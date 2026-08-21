// Accueil : pas de champ Contenu dans l'UI — on réinjecte le body technique "." à l'enregistrement.
(function setupAccueilBodyPreserve() {
  if (!window.CMS) {
    window.setTimeout(setupAccueilBodyPreserve, 50);
    return;
  }

  window.CMS.registerEventListener({
    name: "preSave",
    handler: ({ entry }) => {
      let data = entry.get("data");
      if (entry.get("collection") === "accueil") {
        data = data.set("body", ".");
      }
      return data;
    },
  });
})();

/**
 * Image Markdown sans champ Title (infobulle inutile).
 * Remplace le composant intégré Decap qui propose Image + Alt + Title.
 */
(function registerImageEditorWithoutTitle() {
  if (!window.CMS || !window.CMS.registerEditorComponent) {
    window.setTimeout(registerImageEditorWithoutTitle, 50);
    return;
  }

  window.CMS.registerEditorComponent({
    id: "image",
    label: "Image",
    fields: [
      {
        label: "Image",
        name: "image",
        widget: "image",
        choose_url: false,
        media_library: { allow_multiple: false },
      },
      {
        label: "Texte alternatif",
        name: "alt",
      },
    ],
    pattern: /^!\[([^\]]*)\]\((.*?)(?:\s+"([^"]*)")?\)$/,
    fromBlock: (match) =>
      match && {
        alt: match[1],
        image: match[2],
      },
    toBlock: ({ alt, image }) => `![${alt || ""}](${image || ""})`,
    toPreview: ({ alt, image }, getAsset, fields) => {
      const imageField = fields?.find((field) => field.get("widget") === "image");
      const src = getAsset(image, imageField);
      const safeSrc = String(src || "").replace(/"/g, "&quot;");
      const safeAlt = String(alt || "").replace(/"/g, "&quot;");
      return `<img src="${safeSrc}" alt="${safeAlt}" />`;
    },
  });
})();

/**
 * Widget Tags — chips + saisie libre + suggestions.
 * Remplace le list Decap « virgules only » (Enter / nouvelle ligne impossibles).
 * Stocke un tableau de strings, compatible avec le schéma Astro existant.
 */
(function registerTagsWidget() {
  if (!window.CMS || !window.CMS.registerWidget) {
    window.setTimeout(registerTagsWidget, 50);
    return;
  }

  const h = window.h;
  const createClass = window.createClass;

  const SUGGESTIONS_FR = [
    "Psycho",
    "EMDR",
    "Trauma",
    "Pleine conscience",
    "Psychoéducation",
    "Psychologie positive",
    "Relations humaines",
    "Théorie de l'attachement",
    "Respiration",
    "Santé",
    "Gratitude",
    "Relation à l'argent",
  ];

  const SUGGESTIONS_EN = [
    "Psychology",
    "EMDR",
    "Trauma",
    "Mindfulness",
    "Psychoeducation",
    "Positive psychology",
    "Human relationships",
    "Attachment theory",
    "Breathing",
    "Health",
    "Gratitude",
    "Relationship with money",
  ];

  const normalizeTag = (tag) => String(tag ?? "").trim().replace(/\s+/g, " ");

  const toTagList = (value) => {
    if (value == null || value === "") return [];
    if (typeof value.toJS === "function") return toTagList(value.toJS());
    if (Array.isArray(value)) {
      return value.map(normalizeTag).filter(Boolean);
    }
    if (typeof value === "string") {
      return value
        .split(/[\n,;]+/)
        .map(normalizeTag)
        .filter(Boolean);
    }
    return [];
  };

  const uniquePreserveOrder = (tags) => {
    const seen = new Set();
    const result = [];
    for (const tag of tags) {
      const key = tag.toLocaleLowerCase("fr");
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(tag);
    }
    return result;
  };

  /** Locale du contenu en cours d'édition (FR/EN), pas la langue de l'UI CMS. */
  const getContentLocale = () => {
    try {
      const state = window.CMS.getStore?.()?.getState?.();
      const entry = state?.entryDraft?.entry;
      const path =
        (typeof entry?.get === "function" && (entry.get("path") || entry.get("slug"))) ||
        "";
      if (typeof path === "string") {
        if (/\.en\.(md|mdx|json)$/i.test(path) || /\.en$/i.test(path)) return "en";
        if (/\.fr\.(md|mdx|json)$/i.test(path) || /\.fr$/i.test(path)) return "fr";
      }

      const activeLocale = document.querySelector(
        '[class*="PaneContainer"] [class*="LanguageNav"] button[class*="active"], [class*="I18n"] button[aria-pressed="true"], [class*="LanguageNav"] [aria-current="true"]'
      );
      const label = activeLocale?.textContent?.trim().toLowerCase() ?? "";
      if (label === "en" || label.startsWith("en") || label.includes("english")) return "en";
      if (label === "fr" || label.startsWith("fr") || label.includes("fran")) return "fr";
    } catch (_) {
      /* ignore */
    }
    return "fr";
  };

  const TagsControl = createClass({
    getInitialState() {
      return { draft: "", focused: false };
    },

    getSuggestions() {
      const locale = getContentLocale();
      const field = this.props.field;
      const key = locale === "en" ? "suggestions_en" : "suggestions_fr";
      const fromConfig = field?.get?.(key) ?? field?.get?.("suggestions");
      if (fromConfig && typeof fromConfig.toJS === "function") {
        return toTagList(fromConfig.toJS());
      }
      if (Array.isArray(fromConfig)) return toTagList(fromConfig);
      return locale === "en" ? SUGGESTIONS_EN : SUGGESTIONS_FR;
    },

    commitTags(tags) {
      this.props.onChange(uniquePreserveOrder(tags.map(normalizeTag).filter(Boolean)));
    },

    addTags(rawTags) {
      const incoming = uniquePreserveOrder(
        (Array.isArray(rawTags) ? rawTags : [rawTags]).map(normalizeTag).filter(Boolean)
      );
      if (!incoming.length) return;
      const current = toTagList(this.props.value);
      this.commitTags([...current, ...incoming]);
      this.setState({ draft: "" });
    },

    addTag(raw) {
      this.addTags([raw]);
    },

    removeTag(tagToRemove) {
      const key = tagToRemove.toLocaleLowerCase("fr");
      this.commitTags(
        toTagList(this.props.value).filter((tag) => tag.toLocaleLowerCase("fr") !== key)
      );
    },

    handleDraftChange(event) {
      const next = event.target.value;
      if (/[,;\n]/.test(next)) {
        const parts = next.split(/[,;\n]+/);
        const last = parts.pop() ?? "";
        this.addTags(parts);
        this.setState({ draft: last });
        return;
      }
      this.setState({ draft: next });
    },

    handleKeyDown(event) {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        this.addTag(this.state.draft);
        return;
      }
      if (event.key === "Backspace" && !this.state.draft) {
        const tags = toTagList(this.props.value);
        if (tags.length > 0) this.removeTag(tags[tags.length - 1]);
      }
    },

    render() {
      const tags = toTagList(this.props.value);
      const selectedKeys = new Set(tags.map((tag) => tag.toLocaleLowerCase("fr")));
      const draft = this.state.draft;
      const draftKey = normalizeTag(draft).toLocaleLowerCase("fr");
      const suggestions = this.getSuggestions().filter(
        (suggestion) => !selectedKeys.has(suggestion.toLocaleLowerCase("fr"))
      );
      const filteredSuggestions = draft
        ? suggestions.filter((suggestion) =>
            suggestion.toLocaleLowerCase("fr").includes(draftKey)
          )
        : suggestions;
      const canCreate =
        Boolean(draftKey) && !selectedKeys.has(draftKey) &&
        !suggestions.some((suggestion) => suggestion.toLocaleLowerCase("fr") === draftKey);

      return h(
        "div",
        { className: this.props.classNameWrapper, style: { padding: "12px 14px" } },
        h(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              minHeight: "42px",
              padding: "8px 10px",
              border: "1px solid #e7ddd4",
              borderRadius: "8px",
              background: "#fffdf9",
            },
          },
          ...tags.map((tag) =>
            h(
              "span",
              {
                key: tag,
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "#efe5dc",
                  color: "#3f474f",
                  fontSize: "13px",
                  lineHeight: 1.3,
                },
              },
              tag,
              h(
                "button",
                {
                  type: "button",
                  "aria-label": `Retirer le tag ${tag}`,
                  onClick: () => this.removeTag(tag),
                  style: {
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#6e756f",
                    fontSize: "14px",
                    lineHeight: 1,
                    padding: 0,
                  },
                },
                "×"
              )
            )
          ),
          h("input", {
            id: this.props.forID,
            type: "text",
            value: draft,
            placeholder: tags.length
              ? "Ajouter un autre tag…"
              : "Écrire un tag puis Entrée",
            onChange: this.handleDraftChange,
            onKeyDown: this.handleKeyDown,
            onFocus: () => this.setState({ focused: true }),
            onBlur: () => this.setState({ focused: false }),
            style: {
              flex: "1 1 160px",
              minWidth: "140px",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              color: "#3f474f",
              padding: "4px 2px",
            },
          })
        ),
        h(
          "p",
          {
            style: {
              margin: "10px 0 6px",
              fontSize: "12px",
              color: "#6e756f",
              lineHeight: 1.45,
            },
          },
          "Appuyez sur Entrée pour ajouter. Suggestions selon la langue de l’article (FR/EN) ; vous pouvez aussi créer un tag libre."
        ),
        canCreate &&
          h(
            "button",
            {
              type: "button",
              onMouseDown: (event) => event.preventDefault(),
              onClick: () => this.addTag(draft),
              style: {
                marginBottom: "8px",
                border: "1px dashed #b98278",
                background: "#fff",
                color: "#b98278",
                borderRadius: "8px",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "13px",
              },
            },
            `Créer le tag « ${normalizeTag(draft)} »`
          ),
        filteredSuggestions.length > 0 &&
          h(
            "div",
            {
              style: {
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              },
            },
            ...filteredSuggestions.slice(0, 16).map((suggestion) =>
              h(
                "button",
                {
                  key: suggestion,
                  type: "button",
                  onMouseDown: (event) => event.preventDefault(),
                  onClick: () => this.addTag(suggestion),
                  style: {
                    border: "1px solid #e7ddd4",
                    background: "#fff",
                    color: "#3f474f",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontSize: "12px",
                  },
                },
                suggestion
              )
            )
          )
      );
    },
  });

  const TagsPreview = createClass({
    render() {
      const tags = toTagList(this.props.value);
      if (!tags.length) return h("span", {}, "");
      return h(
        "ul",
        { style: { display: "flex", flexWrap: "wrap", gap: "6px", listStyle: "none", padding: 0, margin: 0 } },
        ...tags.map((tag) =>
          h(
            "li",
            {
              key: tag,
              style: {
                padding: "2px 8px",
                borderRadius: "999px",
                background: "#efe5dc",
                fontSize: "12px",
              },
            },
            tag
          )
        )
      );
    },
  });

  window.CMS.registerWidget("tags", TagsControl, TagsPreview);
})();

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
