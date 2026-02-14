import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { I18nPlugin } from "@11ty/eleventy";

export default async function(eleventyConfig) {
	
	// Image Transform works independently, takes <img> on html and transforms automatically
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);

	// When site is multi-lingual
	eleventyConfig.addPlugin(I18nPlugin, {
		defaultLanguage: "en", // If client wants, could be italian
		errorMode: "strict", // throw an error if content is missing at /en/slug
		// errorMode: "allow-fallback", // only throw an error when the content is missing at both /en/slug and /slug
	});
};
