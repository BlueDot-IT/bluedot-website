# Spatial BlueDot site

One homepage document and one WebGL world. The original spatial introduction
continues into Services, Research, About, and Contact. Four new world-space destinations are appended after the original five scenes:
a workshop, observatory, studio, and signal plaza. Native scroll drives the
extended camera path; navigation seeks a chapter without replacing the canvas
or reloading the page. The first four scenes and their camera poses are preserved. Tomorrow is now a
landscaped campus courtyard, followed by a two-storey lab, observatory, planted
studio, and entrance forecourt. Glazing, timber, furniture, equipment, paving,
and planting give the later stops the scale and depth of complete places. The extended journey ends at 3.5. The ribbons are
parametric meshes, not a fluid simulation.

## Build and preview

```sh
npm run build:site
npm run check:site
npm run dev -- --hostname 127.0.0.1
```

Python 3 and its standard library generate the public HTML. The existing Next.js
application serves it and retains the contact API, articles, legal/security
pages, and authenticated backend. No new runtime package is required.

- `index.template.html`: original scenes and unified navigation.
- `documents.py`: reviewed public chapter content, detail dialogs, retained pages.
- `src/engine.js`: shared WebGL world and scroll-driven camera.
- `src/styles.css`, `src/flow.css`: original presentation and in-world content.
- `src/ui.js`: navigation, focus, service selection, and local brief dialogs.
- `src/contact.js`: existing inquiry form API client, embedded once.
- `../content/research/public-findings.json`: public research only.

The four former routes redirect temporarily to `/#services`, `/#research`,
`/#about`, and `/#contact`. Query parameters are preserved for contact service
preselection. Work and Process remain separate supporting pages. The generated
legacy HTML files link into the unified flow instead of duplicating those pages.
No fragment URLs belong in the sitemap.

Each new location has a compact on-scene introduction and a detail button.
Full service descriptions, source-linked research, founder information, and the
inquiry form use native modal dialogs with scrollable content. There is no
iframe or second renderer. Keyboard navigation moves focus to the destination
chapter; closing a dialog returns to its trigger. Reduced motion shows still scene views instead of
camera travel. The motion control pauses animation everywhere. An early JavaScript marker
hides the open no-JavaScript fallback dialogs until UI initialization, avoiding
a startup modal flash. Hidden tabs stop
rendering. No-WebGL and no-JavaScript paths retain all four chapters and their full details; sending an
inquiry requires JavaScript. The optional project brief stays local and does not
send an inquiry.

Generated output belongs in `public/spatial` and is not tracked. Do not put
private advisory histories, mail metadata, credentials, or draft profile copy
in this tree. Counts are derived from the public-only source and CVE/GHSA aliases
are grouped. The private ledger is never imported.

## Publication boundary

This nine-location revision was deployed to https://bluedot.it.com on
September 14, 2026 with Jason's explicit approval. The static front end uses a
versioned Nginx release; the existing Next.js backend was left running. No Git
push or external profile edit was performed. Future publication needs the
appropriate authorization. An app deployment alone does not replace the static
Nginx front end. Before an approved deployment,
inspect its current configuration and release pointer, preserve rollback, and
update the exact public route ownership needed for the new release. Keep API,
login/admin, legal, security, article, and well-known routes intact. Verify the
final canonical URLs and discovery metadata as part of that release.
