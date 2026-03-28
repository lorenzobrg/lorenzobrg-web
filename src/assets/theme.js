(() => {
  const paletteLink = document.getElementById("palette-stylesheet");
  const toggleButton = document.getElementById("theme-toggle");

  if (!paletteLink || !toggleButton) return;

  const STORAGE_KEY = "risotto-palette";
  const PALETTES = ["base16-dark", "base16-light"]; // minimal toggle

  const hrefFor = (palette) => `/assets/css/palettes/${palette}.css`;

  const setPalette = (palette) => {
    paletteLink.setAttribute("href", hrefFor(palette));
    document.documentElement.dataset.palette = palette;
    localStorage.setItem(STORAGE_KEY, palette);
    toggleButton.setAttribute("aria-pressed", palette !== PALETTES[0] ? "true" : "false");
  };

  const getCurrentPalette = () => {
    const href = paletteLink.getAttribute("href") || "";
    const match = href.match(/\/palettes\/(.+?)\.css$/);
    return match?.[1] || PALETTES[0];
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && PALETTES.includes(saved)) {
    setPalette(saved);
  } else {
    toggleButton.setAttribute("aria-pressed", "false");
  }

  toggleButton.addEventListener("click", () => {
    const current = getCurrentPalette();
    const next = current === PALETTES[0] ? PALETTES[1] : PALETTES[0];
    setPalette(next);
  });
})();
