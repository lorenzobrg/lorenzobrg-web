Project Core Rules

    Mobile-First Design: All components and layouts must be 110% mobile-ready and responsive by default.

    Infrastructure Freeze: Do NOT modify the existing project infrastructure. If a task requires a new dependency, you must stop and ask for explicit confirmation before proceeding.

    No Configuration Changes: Do not touch eleventy.config.js or the core SEO configuration files.

Technology Stack & Implementation

    SSG Framework: Use 11ty (Eleventy) functions and structures exclusively.

        File Extensions: All templates must use .njk (Nunjucks). Standard .html files are strictly forbidden.

    Semantic HTML: Use <img> tags for images. Do not wrap images in unnecessary <div> containers or use background images for content-heavy visuals unless specifically requested.

Template Requirements (Front Matter)

Every .njk file must include a properly formatted YAML front matter section containing:

    layout: The specific template to use.

    title: A clear, page-specific title.

    lang: The language code (it or en).

    description: An SEO-optimized meta description.

Multilingual Synchronization (i18n)

The project is localized. You must maintain parity between the Italian and English versions at all times:

    Parallel Updates: If you modify a file in src/it/, you must immediately apply the equivalent structural or stylistic changes to the corresponding file in src/en/.

    Content Consistency: Ensure that IDs, classes, and logic remain identical across both language directories to prevent functional drift.
