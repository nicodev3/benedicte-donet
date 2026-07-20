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
            className: className || "cms-preview-cta",
            href: href || "#",
            onClick: (event) => event.preventDefault(),
          },
          label
        )
      : null;

  const TextImage = ({ title, text, ctaLabel, ctaUrl, image, reverse, ctaClassName }) =>
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
        h(Button, {
          label: ctaLabel,
          href: ctaUrl,
          className: ctaClassName || "cms-preview-cta",
        })
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
    const fontBase =
      typeof window !== "undefined" && window.location && window.location.origin
        ? window.location.origin
        : "";

    return h(
      "main",
      { className: "cms-preview-content cms-preview-home" },
      h(
        "style",
        null,
        `
          @font-face {
            font-family: "Caviar Dreams";
            src: url("${fontBase}/fonts/CaviarDreams.woff2") format("woff2");
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: "Caviar Dreams";
            src: url("${fontBase}/fonts/CaviarDreams_Bold.woff2") format("woff2");
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          .cms-preview-home {
            --color-button: #c1837b;
            --color-button-text: #241a22;
            --color-button-hover: #b87870;
            --color-primary-dark: #87544d;
            --color-text: #3b2e38;
            --color-bg-soft: #fff1eb;
            --color-bg-muted: #faf6f4;
            --font-heading: "Caviar Dreams", "Trebuchet MS", sans-serif;
            --font-body: "Rubik", system-ui, sans-serif;
            font-family: var(--font-body);
            color: var(--color-text);
            line-height: 1.7;
            background: #fff;
          }
          .cms-preview-home h1,
          .cms-preview-home h2,
          .cms-preview-home h3 {
            font-family: var(--font-heading);
            font-weight: 400;
            color: var(--color-text);
          }
          .cms-preview-home .cms-preview-hero {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            min-height: clamp(18rem, 52vw, 28rem);
            text-align: center;
            border-radius: 0 0 5rem 0;
            box-shadow: 3px 6px 15px rgba(0, 0, 0, 0.25);
            background-color: var(--color-bg-soft);
            background-position: center right;
            background-repeat: no-repeat;
            background-size: cover;
          }
          .cms-preview-home .cms-preview-hero::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 1;
            border-radius: inherit;
            background: radial-gradient(
              ellipse 80% 75% at 50% 45%,
              rgba(255, 255, 255, 0.82) 0%,
              rgba(255, 255, 255, 0.62) 45%,
              rgba(255, 255, 255, 0.4) 100%
            );
            pointer-events: none;
          }
          .cms-preview-home .cms-preview-hero-inner {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5625rem;
            width: 100%;
            max-width: 48rem;
            padding: 3.125rem 1.5rem;
          }
          .cms-preview-home .cms-preview-hero-eyebrow {
            margin: 0;
            font-family: var(--font-heading);
            font-size: clamp(1.125rem, 1rem + 0.5vw, 1.5625rem);
            letter-spacing: 0.04em;
          }
          .cms-preview-home .cms-preview-hero h1 {
            margin: 0;
            font-size: clamp(1.75rem, 1.2rem + 1.8vw, 2.6875rem);
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .cms-preview-home .cms-preview-hero-subtitle {
            margin: 0;
            max-width: 40rem;
            font-family: var(--font-heading);
            font-size: clamp(1.125rem, 1rem + 0.55vw, 1.6875rem);
            letter-spacing: 0.02em;
            line-height: 1.45;
          }
          .cms-preview-home a.cms-preview-cta,
          .cms-preview-home a.cms-preview-hero-cta,
          .cms-preview-home a.cms-preview-button {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            width: fit-content;
            max-width: 100%;
            gap: 0.75rem;
            margin-top: 1rem;
            padding: 0.75rem 1.45rem !important;
            border: none !important;
            border-radius: 2.1875rem 0 !important;
            background: var(--color-button) !important;
            color: var(--color-button-text) !important;
            font-family: var(--font-body) !important;
            font-size: 1.25rem !important;
            font-weight: 400 !important;
            line-height: 1.3;
            text-decoration: none !important;
            box-shadow: none !important;
          }
          .cms-preview-home .cms-preview-hero a.cms-preview-hero-cta {
            margin-top: 0;
          }
          .cms-preview-home a.cms-preview-button {
            border-radius: 999px !important;
            font-family: var(--font-heading) !important;
            font-weight: 700 !important;
            font-size: 1rem !important;
            padding: 0.8em 1.8em !important;
          }
          .cms-preview-home .cms-preview-text-image {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
            gap: clamp(1.5rem, 4vw, 3.75rem);
            align-items: center;
            max-width: 72rem;
            margin: 0 auto;
            padding: clamp(2.5rem, 5vw, 3.75rem) 1.5rem;
          }
          .cms-preview-home .cms-preview-text-image.reverse {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            background: var(--color-bg-muted);
            max-width: none;
          }
          .cms-preview-home .cms-preview-text-image.reverse .cms-preview-section-image {
            order: 2;
            border-radius: 1.25rem 0 0 6.25rem;
            box-shadow: none;
            min-height: 18rem;
            object-fit: cover;
          }
          .cms-preview-home .cms-preview-section-image {
            width: 100%;
            max-height: 34rem;
            object-fit: cover;
            border-radius: 16px;
          }
          .cms-preview-home .cms-preview-section-copy {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .cms-preview-home .cms-preview-text-image.reverse .cms-preview-section-copy {
            align-items: flex-start;
            text-align: start;
          }
          .cms-preview-home .cms-preview-section-copy h2 {
            margin: 0 0 1.5rem;
            color: var(--color-primary-dark);
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .cms-preview-home .cms-preview-richtext p {
            margin: 0 0 1rem;
            text-align: start;
            font-weight: 300;
          }
          @media (max-width: 820px) {
            .cms-preview-home .cms-preview-text-image,
            .cms-preview-home .cms-preview-text-image.reverse {
              grid-template-columns: 1fr;
            }
            .cms-preview-home .cms-preview-text-image.reverse .cms-preview-section-image {
              order: 0;
            }
          }
        `
      ),
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
        h(Button, {
          label: appointment.ctaLabel,
          href: appointment.ctaUrl,
          className: "cms-preview-cta",
        })
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
          ctaClassName: "cms-preview-button",
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

  const registerPreviewTemplates = () => {
    window.CMS.registerPreviewTemplate("blog", BlogPreview);
    window.CMS.registerPreviewTemplate("pages", PagePreview);
    window.CMS.registerPreviewTemplate("accueil", PagePreview);
    window.CMS.registerPreviewTemplate("home", HomePreview);
    window.CMS.registerPreviewTemplate("home_en", HomePreview);
  };

  /**
   * Decap charge la preview dans une iframe : un <link href="/admin/...">
   * échoue souvent. On injecte le CSS en brut + URLs absolues (polices).
   */
  const registerPreviewStyles = () => {
    const origin = window.location.origin;
    window.CMS.registerPreviewStyle(
      "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
    );

    fetch(`${origin}/admin/preview-content.css`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((css) => {
        const absoluteCss = css
          .replace(/@import url\([^)]+\);\s*/g, "")
          .replace(/url\((["']?)\/fonts\//g, `url($1${origin}/fonts/`)
          .replace(/url\((["']?)\/admin\//g, `url($1${origin}/admin/`);
        window.CMS.registerPreviewStyle(absoluteCss, { raw: true });
      })
      .catch((error) => {
        console.warn("[cms-preview] CSS preview indisponible, fallback URL", error);
        window.CMS.registerPreviewStyle(`${origin}/admin/preview-content.css`);
      });
  };

  registerPreviewStyles();
  registerPreviewTemplates();
})();
