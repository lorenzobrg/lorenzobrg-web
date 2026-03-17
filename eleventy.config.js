import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { I18nPlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

const LOCALES = ["en", "it"];
const FEED_META_BY_LOCALE = {
	en: {
		title: "11ty-base Articles (EN)",
		subtitle: "Tiny demo feed for 11ty-base (English)."
	},
	it: {
		title: "11ty-base Articoli (IT)",
		subtitle: "Feed demo minimale per 11ty-base (Italiano)."
	}
};

export default async function (eleventyConfig) {

	// Image Transform works independently, takes <img> on html and transforms automatically
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);

	// When site is multi-lingual
	eleventyConfig.addPlugin(I18nPlugin, {
		defaultLanguage: "it", // If client wants, could be italian
		errorMode: "strict", // throw an error if content is missing at /en/slug
		// errorMode: "allow-fallback", // only throw an error when the content is missing at both /en/slug and /slug
	});

	for (const locale of LOCALES) {
		eleventyConfig.addPlugin(feedPlugin, {
			type: "rss",
			outputPath: `/${locale}/articles/feed.xml`,
			collection: { name: `articles_${locale}`, limit: 0 },
			metadata: {
				language: locale,
				title: FEED_META_BY_LOCALE[locale].title,
				subtitle: FEED_META_BY_LOCALE[locale].subtitle,
				base: "https://example.com/",
				author: { name: "11ty-base" }
			}
		});

		eleventyConfig.addCollection(`articles_${locale}`, (collectionApi) => {
			return collectionApi.getFilteredByGlob(`src/${locale}/articles/*.md`).sort((a, b) => b.date - a.date);
		});
	}

	// Passtrough
	eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

	return {
		dir: {
			input: "src",
			output: "_site",
			includes: "_includes",
			data: "_data"
		},
		templateFormats: ["njk", "md", "css"]
	};
};
