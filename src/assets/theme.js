(() => {
  const paletteLink = document.getElementById("palette-stylesheet");
  const toggleButton = document.getElementById("theme-toggle");

  if (!paletteLink || !toggleButton) return;

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

  const baseLabel = (toggleButton.dataset.label || toggleButton.textContent || "Theme").trim();

  const updateToggleLabel = (palette) => {
    toggleButton.setAttribute("title", palette);
    toggleButton.setAttribute("aria-label", `${baseLabel}: ${palette}`);
  };

  const setPalette = (palette) => {
    paletteLink.setAttribute("href", hrefFor(palette));
    document.documentElement.dataset.palette = palette;
    localStorage.setItem(STORAGE_KEY, palette);
    updateToggleLabel(palette);
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
    setPalette(PALETTES[0]);
  }

  toggleButton.addEventListener("click", () => {
    const current = getCurrentPalette();
    const index = PALETTES.indexOf(current);
    const next = PALETTES[(index + 1) % PALETTES.length];
    setPalette(next);
  });
})();
