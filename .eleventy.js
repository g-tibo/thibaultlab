const { HtmlBasePlugin } = require("@11ty/eleventy");

const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  // Lets us keep the editable content in simple YAML files.
  eleventyConfig.addDataExtension("yaml,yml", (contents) => yaml.load(contents));

  // Rewrites every absolute link and image path so the site works at the domain root or in a project sub folder.
  eleventyConfig.addPlugin(HtmlBasePlugin);
    // Links to other websites, and links to files such as PDFs, open in a new tab.
  // Links that move around this website stay in the same tab.
  eleventyConfig.addTransform("externalLinks", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const own = /^https?:\/\/(www\.)?thibaultlab\.com|^https?:\/\/g-tibo\.github\.io\/thibaultlab/i;
    return content.replace(/<a\s([^>]*?)>/gi, (tag, attrs) => {
      const m = attrs.match(/\bhref\s*=\s*(["'])(.*?)\1/i);
      if (!m || /\btarget\s*=/i.test(attrs)) return tag;
      const href = m[2];
      const external = /^(https?:)?\/\//i.test(href) && !own.test(href);
      const file = /\.(pdf|m4a|mp3|zip|docx?|xlsx?|pptx?)(\?|#|$)/i.test(href);
      if (!external && !file) return tag;
      return `<a ${attrs.trim()} target="_blank" rel="noopener">`;
    });
  });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/s");
  eleventyConfig.addPassthroughCopy("src/uploads");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // The team grid: every person page plus the principal investigator, alphabetical by the "sort" field.
  eleventyConfig.addCollection("team", (api) => {
    const people = api.getFilteredByTag("person").map((p) => ({
      name: p.data.name, role: p.data.role, sort: String(p.data.sort).toLowerCase(), photo: "/assets/people/" + p.data.photo, url: p.url,
    }));
    const pi = api.getAll()[0].data.pi;
    people.push({ name: pi.name, role: pi.role, sort: String(pi.sort).toLowerCase(), photo: "/assets/people/" + pi.photo, url: pi.url });
    return people.sort((x, y) => x.sort.localeCompare(y.sort));
  });

  // Group the publication list by year, newest first.
  eleventyConfig.addFilter("groupByYear", (list) => {
    const map = new Map();
    for (const p of list) { if (!map.has(p.year)) map.set(p.year, []); map.get(p.year).push(p); }
    return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([year, items]) => ({ year, items }));
  });
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());
  eleventyConfig.addFilter("plain", (s) => String(s || "").replace(/<[^>]*>/g, ""));
  eleventyConfig.addFilter("lower", (s) => String(s || "").toLowerCase());
  eleventyConfig.addFilter("pluralize", (n, one, many) => (n === 1 ? one : many));
  eleventyConfig.addFilter("firstHighlight", (list) => list.find((p) => p.highlight));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
