// Configure un media handler qui normalise les chemins d'images
(function setupImagePathNormalization() {
  if (!window.CMS) {
    window.setTimeout(setupImagePathNormalization, 50);
    return;
  }

  const normalizeImagePath = (value) => {
    if (!value) return "";
    const path = String(value).trim();
    if (/^(?:blob:|data:|https?:)/.test(path)) return path;
    if (path.startsWith("/images/")) return path;

    const assetsMatch = path.match(/(?:\.\.\/)*assets\/images\/(.+)$/);
    if (assetsMatch) return `/images/${assetsMatch[1]}`;

    const imageMatch = path.match(/(?:^|\/)images\/(.+)$/);
    if (imageMatch) return `/images/${imageMatch[1]}`;

    return path;
  };

  // Inject global stylesheet pour corriger l'affichage
  const style = document.createElement("style");
  style.textContent = `
    /* Forcer le chargement des images via les URLs normalisées */
    [class*="ImageWrapper"] img,
    [class*="ImageControl"] img {
      max-width: 100%;
      max-height: 300px;
      object-fit: contain;
    }
  `;
  document.head.appendChild(style);

  // Après que Decap soit complètement chargé, on intercepte les images
  const checkAndFixImages = () => {
    // Trouver tous les éléments image
    document.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        const normalized = normalizeImagePath(src);
        if (normalized !== src && !normalized.startsWith("blob:") && !normalized.startsWith("data:")) {
          img.setAttribute("src", normalized);
        }
      }
    });
  };

  // Exécuter la vérification périodiquement et après les changements
  setInterval(checkAndFixImages, 2000);
  document.addEventListener("change", checkAndFixImages, true);
  document.addEventListener("input", checkAndFixImages, true);

  // Exécution initiale
  setTimeout(checkAndFixImages, 500);
})();
