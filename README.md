# Thibault Lab website

The website of the Thibault Lab (NTU Singapore). Every page is built from simple text files.
You edit a text file, save it, and the site rebuilds itself in about a minute.

## Where things live

| To change | Edit this file |
| --- | --- |
| Publications | `src/_data/publications.yml` (newest first) |
| News and media coverage | `src/_data/news.yml` |
| Research page text | `src/_data/research.yml` |
| A lab member's page | `src/people/<name>.md` |
| Your biography | `src/_data/biography.yml` |
| Alumni | `src/_data/alumni.yml` |
| Openings page | `src/openings.njk` |
| Contact page | `src/contact.njk` |
| Home page text | `src/index.njk` |
| Site settings (email, links, GoatCounter code) | `src/_data/site.yml` |

Images and files:

| Folder | What goes in it |
| --- | --- |
| `src/assets/people/` | Profile photos. Use a square JPEG, about 800 by 800 pixels |
| `src/assets/covers/` | Journal covers, about 400 pixels wide |
| `src/assets/audio/` | Podcast files |
| `src/s/` | PDFs. A file `src/s/Paper.pdf` appears at `thibaultlab.com/s/Paper.pdf` |

## Common edits

### Add a paper

Open `src/_data/publications.yml`. Copy an existing entry to the top of its year (or start a new year at the top). Change the fields.

```yaml
- doi: 10.1000/example.2026.001
  year: 2026
  date: 2026 March 3
  journal: Journal Name
  title: The paper title, with <i>italic</i> species names
  authors: Jane Doe, <b>Guillaume Thibault ✉</b>, Sam Roe*
  cover: example-2026.jpg          # optional, file in src/assets/covers/
  links:
    - { label: Abstract, url: "https://pubmed.ncbi.nlm.nih.gov/00000000/" }
    - { label: Full Text, url: "https://doi.org/10.1000/example.2026.001" }
```

Rules for authors. Wrap lab members in `<b>...</b>`. Add `*` after co-first authors. Add ✉ after corresponding authors.
The Altmetric donut appears by itself from the DOI.

### Add a podcast to a paper

Put the audio file in `src/assets/audio/`, then add this to the paper:

```yaml
  podcasts:
    - { label: Podcast, file: My_podcast.m4a }
```

### Add press coverage to a paper

```yaml
  press:
    official: [ { outlet: NTU News, url: "https://..." } ]
    local: [ { outlet: The Straits Times, url: "https://..." } ]
    international: [ { outlet: Phys.org, url: "https://..." } ]
```

### Add a news item

Open `src/_data/news.yml`. Add a year at the top if needed, then add a block. A block is one line of HTML or a heading with a list of outlets.

### Add a lab member

1. Save the photo as `src/assets/people/firstname-lastname.jpg`.
2. Copy an existing file in `src/people/` to `src/people/firstname-lastname.md`.
3. Change the fields at the top. The `sort` field is the surname in lower case. The team page is alphabetical by that field.
4. Write the About and Project sections below the second line of dashes.

To move someone to the alumni list, delete their file in `src/people/` and add them to `src/_data/alumni.yml`.

## Edit in your browser

On github.com, open a file, click the pencil icon, change the text, and choose Commit changes.
The site updates after about a minute. You do not need to install anything for this.

## First-time setup

1. Create a free account at github.com.
2. Create a new empty repository. Any name works, for example `thibaultlab`. Choose Public.
3. Upload this folder. The easiest way is GitHub Desktop (desktop.github.com). Choose File, Add local repository, pick this folder, then Publish repository. Do not use the browser upload for the first time, because it limits the number and size of files.
4. In the repository, go to Settings, then Pages. Under Source choose GitHub Actions.
5. Wait about two minutes. The site appears at `https://YOUR-USERNAME.github.io/thibaultlab/`. Check every page there before moving your domain.
6. Sign up at goatcounter.com. Choose a site code, for example `thibaultlab`. Put the code in `src/_data/site.yml` after `goatcounter:` and save. Visits are counted from then on. The dashboard is at `thibaultlab.goatcounter.com`.

## Move thibaultlab.com to the new site

Do this only when the test site looks right. Squarespace keeps working until you change DNS.

1. In the repository go to Settings, then Pages. Under Custom domain type `www.thibaultlab.com` and Save.
2. At your domain registrar, add these DNS records and remove the old Squarespace ones.
   * `www` CNAME pointing to `YOUR-USERNAME.github.io`
   * Four A records for the bare domain `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`
3. Back in Settings, Pages, tick Enforce HTTPS when it becomes available. This can take up to a day.

If you publish the site at the main address of a user site (a repository called `YOUR-USERNAME.github.io`), nothing else changes.

## Preview on your own computer

Install Node.js (nodejs.org). In this folder run:

```
npm install
npm start
```

Then open the address it prints, usually http://localhost:8080.

## Notes

* Old addresses such as `/people/saeed-alzahrani/` forward to the alumni page. Add more in `src/_data/redirects.yml`.
* Nine old paper PDFs were already missing from the Squarespace site. Their PDF links are removed. To restore one, put the PDF in `src/s/` and add `{ label: PDF, url: /s/Paper.pdf }` to the paper.
* The podcast files were re-encoded to a smaller size so the repository stays light.
* The Google Map on the Contact page and the Altmetric donuts load from their own services.
