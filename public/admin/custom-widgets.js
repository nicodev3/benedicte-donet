(function registerCustomWidgets() {
  const h = window.h || (window.React && window.React.createElement);

  if (!window.CMS || !h) {
    window.setTimeout(registerCustomWidgets, 50);
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

  const resolvePreviewImageSrc = (src, getAsset) => {
    if (!src) return src;
    const path = String(src).trim();
    if (/^(?:blob:|data:|https?:)/.test(path)) return path;

    if (getAsset) {
      const resolved = getAsset(path);
      if (resolved && resolved.toString) {
        const assetUrl = resolved.toString();
        if (assetUrl) return assetUrl;
      }
    }

    return normalizeImagePath(path);
  };

  const ImageControl = ({ value, onChange, onValidate, classNameWrapper, imageKey, t, field, forID }) => {
    return h(
      "div",
      { className: classNameWrapper },
      h("input", {
        id: forID,
        type: "text",
        value: value || "",
        onChange: (e) => onChange(e.target.value),
        placeholder: "Chemin de l'image ou URL",
        style: {
          width: "100%",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
        },
      })
    );
  };

  const ImagePreview = ({ value, getAsset }) => {
    if (!value) {
      return h(
        "div",
        {
          style: {
            padding: "2rem",
            textAlign: "center",
            color: "#999",
            border: "2px dashed #ddd",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          },
        },
        "Aucune image sélectionnée"
      );
    }

    const src = resolvePreviewImageSrc(value, getAsset);
    if (!src) {
      return h(
        "div",
        { style: { padding: "1rem", color: "#999" } },
        "Impossible de résoudre le chemin de l'image"
      );
    }

    return h("img", {
      src,
      alt: "Aperçu de l'image",
      style: {
        maxWidth: "100%",
        maxHeight: "400px",
        objectFit: "contain",
        borderRadius: "4px",
      },
      onError: () => {
        console.warn("Failed to load image:", src);
      },
    });
  };

  window.CMS.registerWidget("image", ImageControl, ImagePreview);
})();
