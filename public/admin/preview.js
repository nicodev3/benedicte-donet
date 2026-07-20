(function registerPreviews() {
  const h = window.h || (window.React && window.React.createElement);

  if (!window.CMS || !h) {
    window.setTimeout(registerPreviews, 50);
    return;
  }

  const asset = (getAsset, value) => {
    if (!value) return "";
    const resolved = getAsset(value);
    return resolved && resolved.toString ? resolved.toString() : value;
  };

  const toJs = (value, fallback) => {
    if (!value) return fallback;
    if (value.toJS) return value.toJS();
    return value;
  };

  const richText = (value) => {
    if (!value) return "";
    return String(value)
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .map((paragraph) =>
        paragraph.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      )
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  };

  const Button = ({ label, href, className }) =>
    label
      ? h(
          "a",
          {
            className: className || "cms-preview-button",
            href: href || "#",
            onClick: (event) => event.preventDefault(),
          },
          label
        )
      : null;

  const TextImage = ({ title, text, ctaLabel, ctaUrl, image, reverse }) =>
    h(
      "section",
      { className: `cms-preview-text-image${reverse ? " reverse" : ""}` },
      image &&
        h("img", {
          className: "cms-preview-section-image",
          src: image,
          alt: "",
        }),
      h(
        "div",
        { className: "cms-preview-section-copy" },
        h("h2", null, title),
        h("div", {
          className: "cms-preview-richtext",
          dangerouslySetInnerHTML: { __html: richText(text) },
        }),
        h(Button, { label: ctaLabel, href: ctaUrl })
      )
    );

  const getHomeContent = (data) => {
    const nested = toJs(data.get("home"), null);
    if (nested) return nested;
    return toJs(data, {});
  };

  const HomePreview = ({ entry, getAsset }) => {
    const data = entry.get("data");
    const content = getHomeContent(data);
    const hero = content.hero || {};
    const intro = content.intro || {};
    const whyOnline = content.whyOnline || {};
    const services = content.services || {};
    const appointment = content.appointment || {};
    const masterclass = content.masterclass || {};
    const quote = content.quote || {};
    const reviews = content.reviews || {};
    const cards = services.cards || [];
    const steps = appointment.steps || [];
    const reviewItems = reviews.items || [];

    return h(
      "main",
      { className: "cms-preview-content cms-preview-home" },
      h(
        "section",
        {
          className: "cms-preview-hero",
          style: {
            backgroundImage: `url("${asset(getAsset, hero.backgroundImage)}")`,
          },
        },
        h(
          "div",
          { className: "cms-preview-hero-inner" },
          h("p", { className: "cms-preview-hero-eyebrow" }, "Bénédicte Donet"),
          h("h1", null, hero.title),
          h("p", { className: "cms-preview-hero-subtitle" }, hero.subtitle),
          h(Button, {
            label: hero.primaryCtaLabel,
            href: hero.primaryCtaUrl,
            className: "cms-preview-hero-cta",
          })
        )
      ),
      h(TextImage, {
        title: intro.title,
        text: intro.text,
        ctaLabel: intro.ctaLabel,
        ctaUrl: intro.ctaUrl,
        image: asset(getAsset, intro.image),
      }),
      h(TextImage, {
        title: whyOnline.title,
        text: whyOnline.text,
        ctaLabel: whyOnline.ctaLabel,
        ctaUrl: whyOnline.ctaUrl,
        image: asset(getAsset, whyOnline.image),
        reverse: true,
      }),
      h(
        "section",
        { className: "cms-preview-services" },
        h("h2", null, services.title),
        h(
          "div",
          { className: "cms-preview-service-grid" },
          cards.map((card) =>
            h(
              "article",
              { className: "cms-preview-card", key: card.title },
              card.image &&
                h("img", { src: asset(getAsset, card.image), alt: "" }),
              h("h3", null, card.title),
              card.intro &&
                h("div", {
                  className: "cms-preview-richtext",
                  dangerouslySetInnerHTML: { __html: richText(card.intro) },
                }),
              card.bullets &&
                h(
                  "ul",
                  null,
                  card.bullets.map((item) =>
                    h("li", {
                      key: item,
                      dangerouslySetInnerHTML: {
                        __html: String(item).replace(
                          /\*\*(.+?)\*\*/g,
                          "<strong>$1</strong>"
                        ),
                      },
                    })
                  )
                ),
              card.text &&
                h("div", {
                  className: "cms-preview-richtext",
                  dangerouslySetInnerHTML: { __html: richText(card.text) },
                })
            )
          )
        )
      ),
      h(
        "section",
        { className: "cms-preview-steps" },
        h("h2", null, appointment.title),
        h(
          "div",
          { className: "cms-preview-step-grid" },
          steps.map((step, index) =>
            h(
              "article",
              { className: "cms-preview-card", key: `${step.title}-${index}` },
              h("h3", null, step.title),
              h("div", {
                className: "cms-preview-richtext",
                dangerouslySetInnerHTML: { __html: richText(step.text) },
              })
            )
          )
        ),
        h(Button, { label: appointment.ctaLabel, href: appointment.ctaUrl })
      ),
      h(
        "div",
        { className: "cms-preview-masterclass" },
        h(TextImage, {
          title: masterclass.title,
          text: masterclass.text,
          ctaLabel: masterclass.ctaLabel,
          ctaUrl: masterclass.ctaUrl,
          image: asset(getAsset, masterclass.image),
        })
      ),
      h(
        "section",
        { className: "cms-preview-quote" },
        h(
          "blockquote",
          null,
          h("div", {
            dangerouslySetInnerHTML: { __html: richText(quote.text) },
          }),
          quote.author && h("cite", null, quote.author)
        )
      ),
      h(
        "section",
        { className: "cms-preview-reviews" },
        h("h2", null, reviews.title),
        h(
          "div",
          { className: "cms-preview-review-grid" },
          reviewItems.slice(0, 3).map((review) =>
            h(
              "article",
              { className: "cms-preview-card", key: review.author },
              h("div", {
                className: "cms-preview-richtext",
                dangerouslySetInnerHTML: { __html: richText(review.text) },
              }),
              h("strong", null, review.author)
            )
          )
        )
      )
    );
  };

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

  const walkAst = (node, visitor) => {
    visitor(node);
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => walkAst(child, visitor));
    }
  };

  window.CMS.registerRemarkPlugin(function rewritePreviewImageUrls() {
    return function transformer(tree) {
      walkAst(tree, (node) => {
        if (node.type === "image" && node.url) {
          const url = String(node.url);
          // Conserver les chemins relatifs vers src/assets pour getAsset dans la preview
          if (!/^(?:\.\.\/)*assets\/images\//.test(url)) {
            node.url = normalizeImagePath(url);
          }
        }
      });
      return tree;
    };
  });

  const getFieldMarkdown = (entry, fieldName) => {
    const value = entry.getIn(["data", fieldName]);
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value.toJS) {
      const converted = value.toJS();
      if (typeof converted === "string") return converted;
    }
    return String(value);
  };

  const rewriteMarkdownImages = (markdown, getAsset) =>
    String(markdown).replace(
      /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
      (match, alt, url, title) => {
        const src = resolvePreviewImageSrc(url, getAsset);
        return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`;
      }
    );

  const rewriteHtmlImages = (html, getAsset) =>
    String(html).replace(
      /<img\b([^>]*?\bsrc=["'])([^"']+)(["'][^>]*)>/gi,
      (match, before, src, after) => {
        const resolved = resolvePreviewImageSrc(src, getAsset);
        return `<img${before}${resolved}${after}>`;
      }
    );

  const renderMarkdownHtml = (markdown, getAsset) => {
    if (!markdown) return "";
    const normalized = rewriteMarkdownImages(markdown, getAsset);

    if (window.marked && typeof window.marked.parse === "function") {
      const html = window.marked.parse(normalized, { gfm: true, breaks: false });
      return rewriteHtmlImages(html, getAsset);
    }

    return rewriteMarkdownImages(normalized, getAsset)
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        if (/^!\[/.test(block)) {
          return block.replace(
            /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/,
            (_, alt, url) => {
              const src = resolvePreviewImageSrc(url, getAsset);
              const safeAlt = alt.replace(/"/g, "&quot;");
              return `<img src="${src}" alt="${safeAlt}">`;
            }
          );
        }
        return `<p>${block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`;
      })
      .join("");
  };

  const ProsePreview = ({ entry, getAsset, className, fieldName = "body" }) => {
    const html = renderMarkdownHtml(getFieldMarkdown(entry, fieldName), getAsset);
    return h("div", {
      className,
      dangerouslySetInnerHTML: { __html: html },
    });
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const BlogPreview = ({ entry, widgetFor, getAsset }) => {
    const data = entry.get("data");
    const title = data.get("title") || "";
    const excerpt = data.get("excerpt") || "";
    const date = data.get("date");
    const image = asset(getAsset, normalizeImagePath(data.get("image")));
    const tags = toJs(data.get("tags"), []);

    return h(
      "main",
      { className: "cms-preview-content cms-preview-blog" },
      h(
        "section",
        {
          className: "cms-preview-post-hero",
          style: image ? { backgroundImage: `url("${image}")` } : undefined,
        },
        h(
          "div",
          { className: "cms-preview-post-hero-content" },
          date && h("p", { className: "cms-preview-post-hero-meta" }, formatDate(date)),
          h("h1", null, title)
        )
      ),
      h(
        "article",
        { className: "cms-preview-post" },
        tags.length > 0 &&
          h(
            "ul",
            { className: "cms-preview-post-tags" },
            tags.map((tag) => h("li", { key: tag }, h("span", null, tag)))
          ),
        excerpt && h("p", { className: "cms-preview-post-excerpt" }, excerpt),
        h(ProsePreview, { entry, getAsset, className: "prose" })
      )
    );
  };

  const PagePreview = ({ entry, widgetFor, getAsset }) => {
    const data = entry.get("data");
    const pageType = data.get("pageType");

    if (pageType === "home" || data.get("home")) {
      return h(HomePreview, { entry, getAsset });
    }

    const title = data.get("title") || "";
    const heroTitle = data.get("heroTitle") || title;
    const description = data.get("description") || "";
    const image = asset(getAsset, normalizeImagePath(data.get("image")));
    const hasHero = Boolean(image);

    return h(
      "main",
      { className: "cms-preview-content cms-preview-page" },
      hasHero
        ? h(
            "section",
            {
              className: "cms-preview-page-hero",
              style: { backgroundImage: `url("${image}")` },
            },
            h(
              "div",
              { className: "cms-preview-page-hero-content" },
              description &&
                h("p", { className: "cms-preview-page-hero-subtitle" }, description),
              h("h1", null, heroTitle)
            )
          )
        : h(
            "section",
            { className: "cms-preview-page-header" },
            h("h1", null, title),
            description &&
              h("p", { className: "cms-preview-page-description" }, description)
          ),
      h(
        "article",
        { className: "cms-preview-page-body" },
        h(ProsePreview, {
          entry,
          getAsset,
          className: "prose prose-wide",
        })
      )
    );
  };

  // Polices : enregistrer séparément pour un chargement fiable dans l'iframe preview
  window.CMS.registerPreviewStyle(
    "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
  );
  window.CMS.registerPreviewStyle("/admin/preview-content.css");
  window.CMS.registerPreviewTemplate("blog", BlogPreview);
  window.CMS.registerPreviewTemplate("pages", PagePreview);
  window.CMS.registerPreviewTemplate("accueil", PagePreview);
  window.CMS.registerPreviewTemplate("home", HomePreview);
  window.CMS.registerPreviewTemplate("home_en", HomePreview);
})();
