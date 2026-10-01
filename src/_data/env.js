// The public address of the site. GitHub sets SITE_URL while building, so image and link addresses
// are correct on the test address and later on thibaultlab.com without any edit.
module.exports = {
    siteUrl: (process.env.SITE_URL || "https://www.thibaultlab.com").replace(/\/$/, "").replace(/^http:/, "https:"),
};
