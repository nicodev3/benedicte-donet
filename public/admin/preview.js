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

  const Button = ({ label, href }) =>
    label
      ? h(
          "a",
          {
            className: "cms-preview-button",
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
      { className: "cms-preview-home" },
      h(
        "style",
        null,
        `
          @font-face {
            font-family: "Caviar Dreams";
            src: url("/fonts/CaviarDreams.woff2") format("woff2");
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: "Caviar Dreams";
            src: url("/fonts/CaviarDreams_Bold.woff2") format("woff2");
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }

          .cms-preview-home {
            --primary: #9f655e;
            --primary-strong: #c1837b;
            --secondary: #67c7ca;
            --text: #3b2e38;
            --soft: #fff1eb;
            --muted: #faf6f4;
            font-family: "Rubik", system-ui, sans-serif;
            color: var(--text);
            background: #fff;
            line-height: 1.65;
          }

          .cms-preview-home * {
            box-sizing: border-box;
          }

          .cms-preview-home h1,
          .cms-preview-home h2,
          .cms-preview-home h3 {
            font-family: "Caviar Dreams", "Trebuchet MS", sans-serif;
            line-height: 1.18;
            margin: 0;
          }

          .cms-preview-hero {
            min-height: 32rem;
            display: grid;
            place-items: center;
            padding: 5rem 2rem;
            color: white;
            text-align: center;
            background-position: center right;
            background-size: cover;
            border-radius: 0 0 5rem 0;
            position: relative;
            overflow: hidden;
          }

          .cms-preview-hero::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, rgba(35, 22, 28, 0.64), rgba(35, 22, 28, 0.24));
          }

          .cms-preview-hero-inner {
            position: relative;
            max-width: 48rem;
            display: grid;
            gap: 1rem;
            justify-items: center;
          }

          .cms-preview-hero h1 {
            font-size: clamp(2.4rem, 5vw, 4.6rem);
            color: white;
          }

          .cms-preview-hero p {
            margin: 0;
            max-width: 42rem;
            font-size: 1.25rem;
          }

          .cms-preview-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-top: 1rem;
            padding: 0.85rem 1.4rem;
            color: white;
            background: var(--primary-strong);
            border-radius: 999px;
            text-decoration: none;
            font-weight: 700;
          }

          .cms-preview-text-image {
            display: grid;
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
            gap: 3rem;
            align-items: center;
            max-width: 72rem;
            margin: 0 auto;
            padding: 5rem 2rem;
          }

          .cms-preview-text-image.reverse {
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
            background: var(--muted);
            max-width: none;
            padding-inline: max(2rem, calc((100vw - 72rem) / 2));
          }

          .cms-preview-text-image.reverse .cms-preview-section-image {
            order: 2;
            border-radius: 1.25rem 0 0 6.25rem;
          }

          .cms-preview-section-image {
            width: 100%;
            max-height: 34rem;
            object-fit: cover;
            border-radius: 1rem;
            box-shadow: 0 8px 30px rgba(59, 46, 56, 0.08);
          }

          .cms-preview-section-copy h2,
          .cms-preview-services h2,
          .cms-preview-steps h2,
          .cms-preview-reviews h2 {
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.02em;
            font-size: 1.75rem;
            margin-bottom: 1.5rem;
          }

          .cms-preview-richtext p {
            margin: 0 0 1rem;
          }

          .cms-preview-services,
          .cms-preview-steps,
          .cms-preview-reviews {
            max-width: 72rem;
            margin: 0 auto;
            padding: 5rem 2rem;
            text-align: center;
          }

          .cms-preview-service-grid,
          .cms-preview-step-grid,
          .cms-preview-review-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.25rem;
            text-align: left;
          }

          .cms-preview-card {
            padding: 1.75rem;
            background: rgba(103, 199, 202, 0.13);
            border-radius: 3rem 0 3rem 0;
          }

          .cms-preview-card img {
            width: 8rem;
            height: 8rem;
            object-fit: contain;
            margin: 0 auto 1rem;
          }

          .cms-preview-card h3 {
            margin-bottom: 0.75rem;
            color: var(--primary);
            font-size: 1.35rem;
            text-align: center;
          }

          .cms-preview-card ul {
            padding-left: 1.2rem;
          }

          .cms-preview-masterclass {
            background: var(--soft);
          }

          .cms-preview-quote {
            padding: 5rem 2rem;
            text-align: center;
            background: var(--muted);
          }

          .cms-preview-quote blockquote {
            max-width: 50rem;
            margin: 0 auto;
            font-family: "Caviar Dreams", "Trebuchet MS", sans-serif;
            font-size: 1.8rem;
            color: var(--primary);
          }

          .cms-preview-quote cite {
            display: block;
            margin-top: 1rem;
            font-style: normal;
          }

          @media (max-width: 820px) {
            .cms-preview-text-image,
            .cms-preview-text-image.reverse,
            .cms-preview-service-grid,
            .cms-preview-step-grid,
            .cms-preview-review-grid {
              grid-template-columns: 1fr;
            }

            .cms-preview-text-image.reverse .cms-preview-section-image {
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
          h("h1", null, hero.title),
          h("p", null, hero.subtitle),
          h(Button, { label: hero.primaryCtaLabel, href: hero.primaryCtaUrl })
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
                      dangerouslySetInnerHTML: { __html: richText(item) },
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
    const path = String(value);
    const match = path.match(/(?:\.\.\/)*assets\/images\/(?:wp\/)?(.+)$/);
    if (match) return `/images/wp/${match[1]}`;
    return path;
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
        h("div", { className: "prose" }, widgetFor("body"))
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
        h("div", { className: "prose prose-wide" }, widgetFor("body"))
      )
    );
  };

  window.CMS.registerPreviewStyle("/admin/preview-content.css");
  window.CMS.registerPreviewTemplate("blog", BlogPreview);
  window.CMS.registerPreviewTemplate("pages", PagePreview);
  window.CMS.registerPreviewTemplate("home", HomePreview);
  window.CMS.registerPreviewTemplate("home_en", HomePreview);
})();
