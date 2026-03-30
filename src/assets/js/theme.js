(() => {
  let paletteLink = document.getElementById("palette-stylesheet");
  if (!paletteLink) return;

  const STORAGE_KEY = "risotto-palette";
  const PALETTES = [
    "base16-dark",
    "base16-light",
    "dracula",
    "gruvbox-dark",
    "gruvbox-light",
    "material",
    "papercolor-dark",
    "papercolor-light",
    "solarized-dark",
    "solarized-light",
    "tender",
    "tokyo-night-dark",
    "tokyo-night-light",
    "windows-95",
    "windows-95-light",
    "apprentice",
  ];

  const hrefFor = (palette) => `/assets/css/palettes/${palette}.css`;

  const safeGet = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  };

  const toggleButton = document.getElementById("theme-toggle");
  const select = document.getElementById("theme-picker");

  const baseLabel = (
    (toggleButton && (toggleButton.dataset.label || toggleButton.textContent)) ||
    "Theme"
  ).trim();

  const updateUi = (palette) => {
    if (toggleButton) {
      toggleButton.setAttribute("title", palette);
      toggleButton.setAttribute("aria-label", `${baseLabel}: ${palette}`);
    }
    if (select && select.tagName === "SELECT") {
      select.value = palette;
      select.setAttribute("title", palette);
    }
  };

  const paletteFromHref = (href) => {
    const match = (href || "").match(/\/palettes\/(.+?)\.css$/);
    return match?.[1] || null;
  };

  const getCurrentPalette = () => {
    const link = document.getElementById("palette-stylesheet");
    if (!link) return PALETTES[0];
    const href = link.getAttribute("href") || "";
    return paletteFromHref(href) || PALETTES[0];
  };

  const setPalette = (palette) => {
    if (!PALETTES.includes(palette)) return;

    const currentLink = document.getElementById("palette-stylesheet");
    if (!currentLink) return;

    const pending = document.getElementById("palette-stylesheet-next");
    if (pending) pending.remove();

    const currentPalette = paletteFromHref(currentLink.getAttribute("href")) || PALETTES[0];
    if (currentPalette === palette) {
      document.documentElement.dataset.palette = palette;
      safeSet(STORAGE_KEY, palette);
      updateUi(palette);
      return;
    }

    const nextHref = hrefFor(palette);
    const nextLink = document.createElement("link");
    nextLink.rel = "stylesheet";
    nextLink.href = nextHref;
    nextLink.id = "palette-stylesheet-next";
    currentLink.insertAdjacentElement("afterend", nextLink);

    // Persist intent immediately so navigation keeps the chosen theme.
    safeSet(STORAGE_KEY, palette);
    updateUi(palette);

    nextLink.addEventListener(
      "load",
      () => {
        document.documentElement.dataset.palette = palette;

        // Swap only after the new CSS is ready to avoid flashes.
        currentLink.remove();
        nextLink.id = "palette-stylesheet";
        paletteLink = nextLink;
      },
      { once: true }
    );

    nextLink.addEventListener(
      "error",
      () => {
        nextLink.remove();
        // Fall back: keep the current stylesheet and revert UI state.
        const fallback = getCurrentPalette();
        document.documentElement.dataset.palette = fallback;
        safeSet(STORAGE_KEY, fallback);
        updateUi(fallback);
      },
      { once: true }
    );
  };

  const saved = safeGet(STORAGE_KEY);
  const initial = saved && PALETTES.includes(saved) ? saved : getCurrentPalette();
  setPalette(initial);

  if (select && select.tagName === "SELECT") {
    if (select.options.length === 0) {
      for (const palette of PALETTES) {
        const option = document.createElement("option");
        option.value = palette;
        option.textContent = palette;
        select.appendChild(option);
      }
    }

    updateUi(initial);

    select.addEventListener("change", () => {
      const next = select.value;
      if (PALETTES.includes(next)) setPalette(next);
    });

    const parseVar = (cssText, varName) => {
      const match = cssText.match(new RegExp(`--${varName}:\\s*([^;]+);`));
      return match ? match[1].trim() : null;
    };

    const enhanceOptionColors = async () => {
      const byValue = new Map(Array.from(select.options, (o) => [o.value, o]));

      await Promise.all(
        PALETTES.map(async (palette) => {
          const option = byValue.get(palette);
          if (!option) return;

          try {
            const res = await fetch(hrefFor(palette), { cache: "force-cache" });
            if (!res.ok) return;
            const cssText = await res.text();

            const bg = parseVar(cssText, "base00");
            const fg = parseVar(cssText, "base05");

            // Best-effort: many browsers allow styling <option>, some ignore it.
            if (bg) option.style.backgroundColor = bg;
            if (fg) option.style.color = fg;
          } catch {
            // ignore
          }
        })
      );
    };

    enhanceOptionColors();
  }

  // Legacy click-to-cycle button (if present somewhere else)
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const current = getCurrentPalette();
      const index = PALETTES.indexOf(current);
      const next = PALETTES[(index + 1) % PALETTES.length];
      setPalette(next);
    });
  }
})();
