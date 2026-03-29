import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { I18nPlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

const LOCALES = ["en", "it"];
const FEED_META_BY_LOCALE = {
	en: {
		title: "Lorenzo's Articles",
		subtitle: "My projects and ideas."
	},
	it: {
		title: "Gli Articoli di Lorenzo",
		subtitle: "I miei progetti e le mie idee."
	}
};

export default async function (eleventyConfig) {
	// Small utility filter: take first N items from an array (or first N chars from a string)
	eleventyConfig.addFilter("take", (value, count) => {
		const n = Number(count) || 0;
		if (n <= 0) return [];
		if (Array.isArray(value)) return value.slice(0, n);
		if (typeof value === "string") return value.slice(0, n);
		return [];
	});

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
				base: "https://www.lorenzoborghi.it/",
				author: { name: "Lorenzo Borghi" }
			}
		});

		eleventyConfig.addCollection(`articles_${locale}`, (collectionApi) => {
			return collectionApi.getFilteredByGlob(`src/${locale}/articles/*.md`).sort((a, b) => b.date - a.date);
		});

		eleventyConfig.addCollection(`publications_${locale}`, (collectionApi) => {
			return collectionApi.getFilteredByGlob(`src/${locale}/publications/*.md`).sort((a, b) => b.date - a.date);
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
