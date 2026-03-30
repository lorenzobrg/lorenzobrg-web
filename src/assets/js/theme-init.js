(() => {
  const STORAGE_KEY = "risotto-palette";
  const DEFAULT = "base16-dark";
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

  const safeGet = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const saved = safeGet(STORAGE_KEY);
  const palette = saved && PALETTES.includes(saved) ? saved : DEFAULT;

  document.documentElement.dataset.palette = palette;

  // Insert the palette stylesheet before other CSS is parsed.
  if (!document.getElementById("palette-stylesheet")) {
    const link = document.createElement("link");
    link.id = "palette-stylesheet";
    link.rel = "stylesheet";
    link.href = `/assets/css/palettes/${palette}.css`;
    document.head.appendChild(link);
  }
})();
