"""Build the static document pages for the BlueDot spatial site.

The homepage is assembled by ``site/build.py``.  This module owns the six
plain document routes that sit beside it and deliberately reads only the
public research projection.  It has no third-party dependencies so the
parent build can import ``build_documents`` directly.
"""

from __future__ import annotations

import argparse
import html
import json
import re
from datetime import date
from pathlib import Path
from typing import Any, Mapping, Sequence
from urllib.parse import urlsplit


SITE_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = SITE_ROOT.parent
PUBLIC_FINDINGS = PROJECT_ROOT / "content" / "research" / "public-findings.json"
CANONICAL_ORIGIN = "https://bluedot.it.com"
YEAR = "2026"

PUBLIC_FINDING_KEYS = {
    "id",
    "project",
    "title",
    "ghsa",
    "cve",
    "role",
    "researcher",
    "github",
    "publishedAt",
    "cvePublishedAt",
    "fixedVersion",
    "summary",
    "boundary",
    "failure",
    "contribution",
    "remediation",
    "sources",
}

DOCUMENT_ROUTES = ("services", "about", "work", "process", "research", "contact")

# The first five locations belong to the original homepage experience. These
# four destinations continue that same camera journey; their public copy is
# kept in the scrollable dialogs generated below.
DESTINATION_META = {
    "services": {
        "index": 5,
        "number": "06",
        "kicker": "Services",
        "heading": "Straightforward help.<br><em>Real results.</em>",
        "lede": "Whether you need a security review, an automation to save you hours every week, or custom software built for your team—here is how we can work together.",
        "action": "See what I do",
        "dialog_label": "services details",
    },
    "research": {
        "index": 6,
        "number": "07",
        "kicker": "Security Research",
        "heading": "Real vulnerabilities.<br><em>Public records.</em>",
        "lede": "Security issues I've reported in open-source projects, with links to the published CVE advisories and reporter credits.",
        "action": "View public findings",
        "dialog_label": "public research details",
    },
    "about": {
        "index": 7,
        "number": "08",
        "kicker": "About",
        "heading": "Hi, I'm Jason.<br><em>The person behind BlueDot.</em>",
        "lede": "I run BlueDot IT as an independent technical studio and actively contribute to OpenClaw. When I'm not studying cybersecurity at DeVry, I help businesses make their software fast, simple, and secure.",
        "action": "Meet Jason",
        "dialog_label": "about BlueDot",
    },
    "contact": {
        "index": 8,
        "number": "09",
        "kicker": "Contact",
        "heading": "Tell me what's<br><em>on your mind.</em>",
        "lede": "Have a project idea, a repetitive chore you want automated, or a security question? Drop me a line. No sales pitch, no technical jargon required.",
        "action": "Send a message",
        "dialog_label": "contact form",
    },
}

# These are the public repositories whose names, descriptions, and URLs were
# checked against src/data/projectCatalog.ts before being included here.  The
# document generator intentionally does not fetch GitHub or claim live repo
# metrics; the linked source is the evidence.
PUBLIC_REPOSITORIES = (
    {
        "name": "security-middleware",
        "category": "Application security",
        "url": "https://github.com/BlueDot-IT/security-middleware",
        "description": "TypeScript middleware that checks security headers, CORS, and npm dependencies during development.",
        "note": "Developer-facing feedback keeps these checks near the code being changed.",
    },
    {
        "name": "GhostMCP",
        "category": "AI automation and security",
        "url": "https://github.com/BlueDot-IT/GhostMCP",
        "description": "A beta MCP server for authorized assessments with policy-guarded tools, workflows, and audit logging.",
        "note": "The repository documents the controls and the limits of the beta system.",
    },
    {
        "name": "Odinn-Forge",
        "category": "AI systems",
        "url": "https://github.com/BlueDot-IT/Odinn-Forge",
        "description": "A local-first, single-user AI assistant with inspectable memory, approved tools, and activity history.",
        "note": "The source shows how memory, approvals, and tool activity are represented.",
    },
)


def _escape(value: object) -> str:
    """Escape text for an HTML text or attribute context."""

    return html.escape(str(value), quote=True)


def _internal_url(path: str) -> str:
    """Return a validated internal URL."""

    if not path.startswith("/") or path.startswith("//") or any(ch in path for ch in "\r\n\t"):
        raise ValueError(f"Invalid internal URL: {path!r}")
    return _escape(path)


def _external_url(url: str) -> str:
    """Return a validated public HTTPS URL."""

    parsed = urlsplit(url)
    if parsed.scheme != "https" or parsed.netloc != "github.com" or parsed.query:
        raise ValueError(f"External links must use an HTTPS GitHub URL: {url!r}")
    if any(ch in url for ch in "\r\n\t\"'"):
        raise ValueError(f"Invalid external URL: {url!r}")
    return _escape(url)


def _slug(value: str) -> str:
    """Create a stable class fragment from public content."""

    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-") or "item"


def _date_text(value: str) -> str:
    """Format a public ISO date without trusting locale settings."""

    parsed = date.fromisoformat(value)
    return f"{parsed.strftime('%B')} {parsed.day}, {parsed.year}"


def _load_public_findings() -> list[dict[str, Any]]:
    """Load and validate the public-only research projection."""

    document = json.loads(PUBLIC_FINDINGS.read_text(encoding="utf-8"))
    if not isinstance(document, dict) or set(document) != {"reviewedAt", "findings"}:
        raise ValueError("Public projection must contain only reviewedAt and findings")
    date.fromisoformat(document["reviewedAt"])
    findings = document.get("findings")
    if not isinstance(findings, list):
        raise ValueError("Public research projection must contain a findings list")

    validated: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    seen_ghsas: set[str] = set()
    seen_cves: set[str] = set()
    for finding in findings:
        if not isinstance(finding, dict):
            raise ValueError("Each public finding must be an object")
        if set(finding) != PUBLIC_FINDING_KEYS:
            raise ValueError(
                "Public finding has an unexpected schema; private fields must not enter the site"
            )

        required_text = (
            "id",
            "project",
            "title",
            "ghsa",
            "role",
            "researcher",
            "github",
            "publishedAt",
            "fixedVersion",
            "summary",
            "boundary",
            "failure",
            "contribution",
            "remediation",
        )
        if any(not isinstance(finding[key], str) or not finding[key].strip() for key in required_text):
            raise ValueError("Public finding contains a missing or non-text required field")
        if finding["id"] in seen_ids or finding["ghsa"] in seen_ghsas:
            raise ValueError("Public findings must have unique canonical IDs and GHSA values")
        seen_ids.add(finding["id"])
        seen_ghsas.add(finding["ghsa"])

        try:
            date.fromisoformat(finding["publishedAt"])
        except ValueError as error:
            raise ValueError("Public finding publication dates must be ISO dates") from error
        if finding["cvePublishedAt"] is not None:
            if not isinstance(finding["cvePublishedAt"], str):
                raise ValueError("CVE publication date must be text or null")
            try:
                date.fromisoformat(finding["cvePublishedAt"])
            except ValueError as error:
                raise ValueError("CVE publication dates must be ISO dates") from error

        cve = finding["cve"]
        if cve is not None:
            if not isinstance(cve, str) or not cve.strip():
                raise ValueError("CVE values must be non-empty text or null")
            if cve in seen_cves:
                raise ValueError("A CVE may identify only one public finding")
            seen_cves.add(cve)

        if finding["role"] != "Reporter":
            raise ValueError("Only the publicly verified Reporter role is allowed here")
        sources = finding["sources"]
        if not isinstance(sources, list) or not sources:
            raise ValueError("Each public finding needs at least one source")
        for source in sources:
            if not isinstance(source, dict) or set(source) != {"label", "url"}:
                raise ValueError("Public source entries must contain only label and url")
            if not isinstance(source["label"], str) or not source["label"].strip():
                raise ValueError("Public source labels must be non-empty text")
            if not isinstance(source["url"], str):
                raise ValueError("Public source URLs must be text")
            _external_url(source["url"])

        validated.append(finding)
    return validated


def _summary(findings: Sequence[Mapping[str, Any]]) -> str:
    """Derive the public count without counting a GHSA and CVE twice."""

    advisory_count = len(findings)
    cve_count = len({finding["cve"] for finding in findings if finding.get("cve")})
    advisory_word = "credit" if advisory_count == 1 else "credits"
    cve_word = "CVE" if cve_count == 1 else "CVEs"
    return f"{advisory_count} published advisory {advisory_word}, including {cve_count} associated {cve_word}."


def _brand() -> str:
    return (
        f'<a class="doc-brand" href="{_internal_url("/")}" aria-label="BlueDot IT home">'
        '<span class="doc-brand-mark" aria-hidden="true"></span><span>BlueDot IT</span></a>'
    )


def _navigation(current: str) -> str:
    links = [("Home", "/"), ("Services", "/services"), ("Work", "/work"), ("Research", "/research"), ("About", "/about"), ("Contact", "/contact")]
    rendered = []
    for label, path in links:
        current_attr = ' aria-current="page"' if path == f"/{current}" else ""
        if current == "home" and path == "/":
            current_attr = ' aria-current="page"'
        rendered.append(f'<a href="{_internal_url(path)}"{current_attr}>{_escape(label)}</a>')
    return '<nav class="doc-nav" aria-label="Main navigation">' + "".join(rendered) + "</nav>"


def _footer() -> str:
    return f"""
<footer class="doc-footer">
  <div class="doc-shell doc-footer-grid">
    <div>
      {_brand()}
      <p class="doc-footer-note">Independent technical practice for secure systems, useful automation, and software that can be understood.</p>
    </div>
    <nav class="doc-footer-nav" aria-label="Footer navigation">
      <a href="{_internal_url('/blog')}">Blog</a>
      <a href="{_internal_url('/security')}">Security</a>
      <a href="{_internal_url('/legal/privacy')}">Privacy</a>
      <a href="{_internal_url('/legal/terms')}">Terms</a>
    </nav>
    <div class="doc-footer-bottom"><span>&copy; {YEAR} BlueDot IT LLC</span><a href="{_internal_url('/research')}">Public research</a></div>
  </div>
</footer>"""


def _page(*, route: str, title: str, description: str, body: str, contact_script: bool = False) -> str:
    if route in {"/services", "/research", "/about", "/contact"}:
        fragment = route.strip("/")
        return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{_escape(title)} | BlueDot IT</title><link rel="canonical" href="{CANONICAL_ORIGIN}/#{fragment}"><meta http-equiv="refresh" content="0;url=/#{fragment}"></head><body><a href="/#{fragment}">Continue to {_escape(title)} in the BlueDot experience</a><script>location.replace('/'+location.search+'#{fragment}');</script></body></html>"""
    script = '<script src="/spatial-contact.js" defer></script>' if contact_script else ""
    current = route.strip("/") or "home"
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#07121f">
  <meta name="description" content="{_escape(description)}">
  <link rel="canonical" href="{_escape(CANONICAL_ORIGIN + route)}">
  <meta property="og:title" content="{_escape(title)} | BlueDot IT">
  <meta property="og:description" content="{_escape(description)}">
  <meta property="og:url" content="{_escape(CANONICAL_ORIGIN + route)}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="{CANONICAL_ORIGIN}/opengraph-image">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/spatial-documents.css">
  <noscript><style>.doc-hero-spatial #world,.doc-scene-shade,.doc-scene-controls{{display:none}}.doc-hero-spatial .doc-hero-inner{{min-height:0;padding-top:70px}}</style></noscript>
  <title>{_escape(title)} | BlueDot IT</title>
</head>
<body class="doc-page doc-page-{_escape(current)}">
  <a class="doc-skip" href="#main-content">Skip to content</a>
  <header class="doc-header">
    <div class="doc-shell doc-header-inner">
      {_brand()}
      {_navigation(current)}
      <a class="doc-header-cta" href="{_internal_url('/contact')}">Start a conversation <span aria-hidden="true">&rarr;</span></a>
    </div>
  </header>
  <main id="main-content" tabindex="-1">{body}</main>
  {_footer()}
  {script}
</body>
</html>
"""


def _hero(kicker: str, heading: str, lede: str, *, scene: float | None = None) -> str:
    scene_markup = "" if scene is None else f"""
  <canvas id="world" data-scene-progress="{scene}" aria-hidden="true"></canvas>
  <div class="doc-scene-shade" aria-hidden="true"></div>
  <div class="doc-shell doc-scene-controls">
    <span class="doc-scene-caption">BlueDot / Spatial</span>
    <button id="motion" type="button" aria-pressed="false">Motion off</button>
  </div>
  <p id="render-status" role="status"></p>"""
    return f"""
<section class="doc-hero{' doc-hero-spatial' if scene is not None else ''}">
  {scene_markup}
  <div class="doc-shell doc-hero-inner">
    <p class="doc-kicker">{_escape(kicker)}</p>
    <h1>{heading}</h1>
    <p class="doc-lede">{_escape(lede)}</p>
  </div>
</section>"""


def _services_page(*, embedded: bool = False) -> str:
    cards = (
        (
            "01",
            "Security & Defense",
            "Inspect your web apps, servers, and code to catch security holes before someone else does—with a clear fix list.",
            ("Code and server configuration review", "Clear, prioritized fix list", "Authorized testing with agreed boundaries"),
        ),
        (
            "02",
            "Automating the Busywork",
            "Connect your daily apps and automate repetitive chores so your team stops wasting hours on manual data entry.",
            ("Direct app integrations (Slack, email, CRMs, spreadsheets)", "Custom AI tools where you stay in control", "Reliable automated workflows that don't break"),
        ),
        (
            "03",
            "Custom Software",
            "Build custom web applications, customer portals, or internal tools shaped specifically around the way your team works.",
            ("Modern web apps and fast backend APIs", "Clean TypeScript and Python code", "Full handoff, documentation, and ongoing support"),
        ),
    )
    rendered_cards = []
    for number, title, description, bullets in cards:
        list_items = "".join(f"<li>{_escape(item)}</li>" for item in bullets)
        rendered_cards.append(
            f"""<article class="doc-card">
  <p class="doc-card-index">{_escape(number)}</p>
  <h2>{_escape(title)}</h2>
  <p>{_escape(description)}</p>
  <ul class="doc-list">{list_items}</ul>
</article>"""
        )
    body = _hero(
        "Services",
        "Straightforward help.<br><em>Real results.</em>",
        "Whether you need a security review, an automation to save you hours every week, or custom software built for your team, here is how we can work together.",
        scene=None if embedded else 1.46,
    )
    body += f"""
<section class="doc-section doc-section-light">
  <div class="doc-shell">
    <div class="doc-section-heading"><p class="doc-kicker">Services</p><h2>Security, automation, and custom software.</h2></div>
    <div class="doc-card-grid">{"".join(rendered_cards)}</div>
  </div>
</section>
<section class="doc-section doc-section-dark">
  <div class="doc-shell doc-split">
    <div><p class="doc-kicker">Not sure where to start?</p><h2>Tell me what's slowing you down.</h2></div>
    <div class="doc-copy"><p>You don't need a technical spec sheet. Just tell me what's taking up too much time or what security worry is on your mind, and we'll figure out the right fix.</p><a class="doc-link" href="{_internal_url('/contact')}">Let's talk <span aria-hidden="true">&rarr;</span></a></div>
  </div>
</section>"""
    if embedded:
        return _destination("services", body)
    return _page(
        route="/services",
        title="Services",
        description="Security reviews, workflow automation, and custom software development from BlueDot IT.",
        body=body,
    )


def _about_page(*, embedded: bool = False) -> str:
    body = _hero(
        "About",
        "Hi, I'm Jason.<br><em>The person behind BlueDot.</em>",
        "I founded BlueDot IT to help teams build reliable software, automate repetitive busywork, and stay secure. I'm also an active contributor to OpenClaw, and when I'm not writing code, I study cybersecurity at DeVry University.",
        scene=None if embedded else 0.04,
    )
    body += f"""
<section class="doc-section doc-section-light">
  <div class="doc-shell doc-split">
    <div><p class="doc-kicker">The developer</p><h2>Jason O'Neal</h2></div>
    <div class="doc-copy"><p>I work directly with clients on web applications, Linux servers, and the automations that connect their daily tools.</p><p>I'm also an active contributor to OpenClaw, where I report security bugs responsibly so fixes get shipped before vulnerabilities can be exploited. You can see all my public CVEs and credits in the research section.</p><a class="doc-link" href="{_internal_url('/research')}">Read the public research <span aria-hidden="true">&rarr;</span></a></div>
  </div>
</section>
<section class="doc-section doc-section-ice">
  <div class="doc-shell doc-split">
    <div><p class="doc-kicker">How I work</p><h2>Straight talk. No surprises.</h2></div>
    <div class="doc-copy"><p>I believe you should always understand what's being built and why. Before any work begins, we agree on the exact scope, timeline, and cost. At the end, you get clear documentation and an honest walkthrough so you're never left in the dark.</p></div>
  </div>
</section>
<section class="doc-section doc-section-dark">
  <div class="doc-shell doc-split">
    <div><p class="doc-kicker">Ready to chat?</p><h2>What's on your mind?</h2></div>
    <div class="doc-copy"><p>Tell me about your project or what's slowing your team down. Plain English works best—no buzzwords needed.</p><a class="doc-link" href="{_internal_url('/contact')}">Tell me about it <span aria-hidden="true">&rarr;</span></a></div>
  </div>
</section>"""
    if embedded:
        return _destination("about", body)
    return _page(
        route="/about",
        title="About",
        description="Meet Jason O'Neal, the developer and security researcher behind BlueDot IT.",
        body=body,
    )


def _research_identifiers(finding: Mapping[str, Any]) -> str:
    identifiers = [f'<a href="{_external_url(finding["sources"][0]["url"])}">{_escape(finding["ghsa"])}</a>']
    if finding.get("cve"):
        cve_source = next((source["url"] for source in finding["sources"] if "cve" in source["label"].lower()), finding["sources"][0]["url"])
        identifiers.append(f'<a href="{_external_url(cve_source)}">{_escape(finding["cve"])}</a>')
    return " <span aria-hidden=\"true\">/</span> ".join(identifiers)


def _research_card(finding: Mapping[str, Any], number: int) -> str:
    source_links = "".join(
        f'<li><a class="doc-link" href="{_external_url(source["url"])}" target="_blank" rel="noreferrer">{_escape(source["label"])} <span aria-hidden="true">&nearr;</span></a></li>'
        for source in finding["sources"]
    )
    cve_date = ""
    if finding.get("cvePublishedAt"):
        cve_date = f'<div><dt>CVE record</dt><dd><time datetime="{_escape(finding["cvePublishedAt"])}">{_escape(_date_text(finding["cvePublishedAt"]))}</time></dd></div>'
    return f"""<article class="research-card">
  <div class="research-card-top"><p class="doc-card-index">{number:02d}</p><p class="doc-kicker">{_escape(finding['project'])}</p></div>
  <h2>{_escape(finding['title'])}</h2>
  <p class="research-identifiers">{_research_identifiers(finding)}</p>
  <dl class="research-meta">
    <div><dt>Role</dt><dd>{_escape(finding['role'])}, {_escape(finding['researcher'])}</dd></div>
    <div><dt>Advisory published</dt><dd><time datetime="{_escape(finding['publishedAt'])}">{_escape(_date_text(finding['publishedAt']))}</time></dd></div>
    {cve_date}
    <div><dt>First patched</dt><dd><code>{_escape(finding['fixedVersion'])}</code></dd></div>
  </dl>
  <div class="research-copy">
    <p><strong>Impact.</strong> {_escape(finding['summary'])}</p>
    <div class="research-case-study">
      <div><h3>Boundary</h3><p>{_escape(finding['boundary'])}</p></div>
      <div><h3>Documented failure</h3><p>{_escape(finding['failure'])}</p></div>
      <div><h3>Contribution</h3><p>{_escape(finding['contribution'])}</p></div>
      <div><h3>Remediation</h3><p>{_escape(finding['remediation'])}</p></div>
    </div>
  </div>
  <div class="research-sources"><p class="doc-kicker">Public evidence</p><ul>{source_links}</ul></div>
</article>"""


def _research_page(findings: Sequence[Mapping[str, Any]], *, embedded: bool = False) -> str:
    summary = _summary(findings)
    reviewed_at = json.loads(PUBLIC_FINDINGS.read_text(encoding="utf-8"))["reviewedAt"]
    cards = "".join(_research_card(finding, index) for index, finding in enumerate(findings, start=1))
    body = _hero(
        "Security research",
        "Real vulnerabilities.<br><em>Public records.</em>",
        "I report security issues in open-source systems responsibly and help get them fixed. Here are the public CVEs and reporter credits.",
        scene=None if embedded else 0.23,
    )
    body += f"""
<section class="doc-section doc-section-light">
  <div class="doc-shell">
    <div class="research-summary"><p class="doc-kicker">Published research</p><p class="research-count">{_escape(summary)}</p><p>A GHSA and its associated CVE count as one finding. My credit here is for reporting the issue, not writing or independently verifying the fix. This work does not imply an affiliation with the project.</p></div>
    <p class="doc-note">Public sources reviewed <time datetime="{_escape(reviewed_at)}">{_escape(_date_text(reviewed_at))}</time>.</p>
    <div class="research-list">{cards}</div>
  </div>
</section>
<section class="doc-section doc-section-dark">
  <div class="doc-shell doc-split">
    <div><p class="doc-kicker">What's included</p><h2>Published reports only.</h2></div>
    <div class="doc-copy"><p>Everything here is based on published advisories and CVE records. Private discussions and unpublished reports stay private.</p><a class="doc-link" href="{_internal_url('/contact')}">Ask about a security review <span aria-hidden="true">&rarr;</span></a></div>
  </div>
</section>"""
    if embedded:
        return _destination("research", body)
    return _page(
        route="/research",
        title="Security Research & Disclosures",
        description="Public vulnerability disclosures and security research by Jason O'Neal.",
        body=body,
    )


def _work_page(findings: Sequence[Mapping[str, Any]]) -> str:
    research_links = []
    for index, finding in enumerate(findings, start=1):
        research_links.append(
            f"""<article class="work-card">
  <p class="doc-card-index">{index:02d}</p>
  <p class="doc-kicker">{_escape(finding['project'])}</p>
  <h2>{_escape(finding['title'])}</h2>
  <p>{_escape(finding['summary'])}</p>
  <a class="doc-link" href="{_internal_url('/research')}">Read the public record <span aria-hidden="true">&rarr;</span></a>
</article>"""
        )
    repo_cards = []
    for index, repository in enumerate(PUBLIC_REPOSITORIES, start=1):
        repo_cards.append(
            f"""<article class="work-card work-card-repository">
  <p class="doc-card-index">{index:02d}</p>
  <p class="doc-kicker">{_escape(repository['category'])}</p>
  <h2>{_escape(repository['name'])}</h2>
  <p>{_escape(repository['description'])}</p>
  <p class="doc-note">{_escape(repository['note'])}</p>
  <a class="doc-link" href="{_external_url(repository['url'])}" target="_blank" rel="noreferrer">Open public repository <span aria-hidden="true">&nearr;</span></a>
</article>"""
        )
    body = _hero(
        "Selected work",
        "Take a look at the work.",
        "Here are a few projects and security reports, with links so you can look through them yourself.",
    )
    body += f"""
<section class="doc-section doc-section-light">
  <div class="doc-shell">
    <div class="doc-section-heading"><p class="doc-kicker">Public security research</p><h2>Security issues I've reported.</h2></div>
    <div class="doc-card-grid">{"".join(research_links)}</div>
  </div>
</section>
<section class="doc-section doc-section-ice">
  <div class="doc-shell">
    <div class="doc-section-heading"><p class="doc-kicker">Public repositories</p><h2>Projects you can explore.</h2></div>
    <div class="doc-card-grid">{"".join(repo_cards)}</div>
    <p class="doc-section-tail">These descriptions are a snapshot. Check the repositories for the latest code and project notes.</p>
  </div>
</section>"""
    return _page(
        route="/work",
        title="Work",
        description="Selected public security research and software repositories from BlueDot IT.",
        body=body,
    )


def _process_page() -> str:
    steps = (
        ("01", "Understand", "Talk through what you have, how your team uses it, and what needs to change."),
        ("02", "Define", "Agree on the exact work, timeline, and how we'll know it's finished."),
        ("03", "Build and test", "Write the code and test it against the specific problems we set out to fix."),
        ("04", "Review and hand off", "Walk through what changed, how to use it, and answer all your questions."),
    )
    rendered = "".join(
        f"""<article class="process-card"><p class="doc-card-index">{_escape(number)}</p><h2>{_escape(title)}</h2><p>{_escape(description)}</p></article>"""
        for number, title, description in steps
    )
    body = _hero(
        "How we work together",
        "Clear steps. Fewer surprises.",
        "We start with a conversation, agree on the job, and keep you involved as the work takes shape.",
    )
    body += f"""
<section class="doc-section doc-section-light">
  <div class="doc-shell">
    <div class="doc-section-heading"><p class="doc-kicker">The workflow</p><h2>Here's what to expect.</h2></div>
    <div class="process-grid">{rendered}</div>
  </div>
</section>
<section class="doc-section doc-section-dark">
  <div class="doc-shell doc-split">
    <div><p class="doc-kicker">Before work begins</p><h2>Let's agree on the details first.</h2></div>
    <div class="doc-copy"><p>Before I start, we'll put the scope, price, schedule, permissions, and definition of done in writing. If the work involves sensitive information, we'll also agree on how to share it.</p><a class="doc-link" href="{_internal_url('/contact')}">Tell me about your project <span aria-hidden="true">&rarr;</span></a></div>
  </div>
</section>"""
    return _page(
        route="/process",
        title="Process",
        description="How BlueDot IT scopes, builds, tests, secures, and hands off technical work.",
        body=body,
    )


def _contact_page(*, embedded: bool = False) -> str:
    body = _hero(
        "Contact",
        "Tell me what's<br><em>on your mind.</em>",
        "Have a project idea, an annoying chore you want automated, or a security question? Drop me a line. No sales pitch, no technical jargon required.",
        scene=None if embedded else 1.49,
    )
    body += f"""
<section class="doc-section doc-section-light">
  <div class="doc-shell doc-split doc-contact-grid">
    <div class="doc-copy">
      <p class="doc-kicker">Get in touch</p>
      <h2>A few details are enough to start.</h2>
      <p>I'll read your message and get back to you. If I need more detail, I'll ask.</p>
      <p class="doc-warning" id="contact-warning">Please leave out passwords, access tokens, customer records, and other sensitive data. Don't include details of an unpatched security issue here.</p>
    </div>
    <form class="doc-form" id="contact-form" method="post" action="/api/contact" aria-describedby="contact-warning" novalidate>
      <div class="doc-form-grid">
        <div class="doc-field"><label for="contact-name">Name <span aria-hidden="true">*</span></label><input id="contact-name" name="name" autocomplete="name" maxlength="100" required></div>
        <div class="doc-field"><label for="contact-email">Email <span aria-hidden="true">*</span></label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="320" required></div>
        <div class="doc-field"><label for="contact-service">Service <span aria-hidden="true">*</span></label><select id="contact-service" name="service" required><option value="">Choose one</option><option value="security">Security &amp; defense</option><option value="automation">Automating the busywork</option><option value="software">Custom software</option><option value="unsure">Not sure yet</option></select></div>
        <div class="doc-field"><label for="contact-stage">Project stage <span aria-hidden="true">*</span></label><select id="contact-stage" name="stage" required><option value="">Choose one</option><option value="exploring">Exploring</option><option value="in-progress">In progress</option><option value="pre-production">Approaching production</option><option value="production">Already in production</option><option value="remediation">Remediation or review</option></select></div>
        <div class="doc-field doc-field-full"><label for="contact-subject">Project or system <span aria-hidden="true">*</span></label><input id="contact-subject" name="subject" maxlength="160" required></div>
        <div class="doc-field doc-field-full"><label for="contact-message">What do you need help with? <span aria-hidden="true">*</span></label><textarea id="contact-message" name="message" rows="8" maxlength="10000" required></textarea></div>
      </div>
      <input id="startedAt" name="startedAt" type="hidden" value="">
      <div class="doc-honeypot" aria-hidden="true"><label for="hp">Leave this field empty</label><input id="hp" name="hp" type="text" autocomplete="off" tabindex="-1"></div>
      <button class="doc-button" id="contact-submit" type="submit" disabled>Send message <span aria-hidden="true">&rarr;</span></button>
      <p class="doc-form-status" id="contact-status" tabindex="-1" role="status" aria-live="polite"></p>
      <noscript><p>Enable JavaScript to send this form. No inquiry is sent until you choose Send message.</p></noscript>
    </form>
  </div>
</section>"""
    if embedded:
        return _destination("contact", body)
    return _page(
        route="/contact",
        title="Contact",
        description="Get in touch with Jason at BlueDot IT about software, automation, or security.",
        body=body,
        contact_script=True,
    )


def _destination_dialog_body(route: str, body: str) -> str:
    """Adapt a standalone document body for its in-world dialog.

    The reviewed copy remains the source of truth. Only heading levels,
    heading identity, and links between the four destinations change so the
    dialog has one self-contained accessible heading and same-document
    navigation.
    """

    body = body.replace("<h3>", "<h4>").replace("</h3>", "</h4>")
    body = body.replace("<h2>", "<h3>").replace("</h2>", "</h3>")
    body = body.replace(
        "<h1>", f'<h2 id="{route}-dialog-heading">'
    ).replace("</h1>", "</h2>")
    for target in ("services", "research", "about", "contact"):
        body = body.replace(f'href="/{target}"', f'href="#{target}"')
    return body


def _destination(route: str, body: str) -> str:
    """Render one compact chapter overlay plus its full copy dialog."""

    metadata = DESTINATION_META[route]
    heading_id = f"destination-{route}-title"
    dialog_id = f"{route}-dialog"
    dialog_body = _destination_dialog_body(route, body)
    return f"""
<section class="destination destination-{_escape(route)}" id="{_escape(route)}" data-destination="{metadata['index']}" aria-labelledby="{heading_id}" aria-hidden="true" inert tabindex="-1">
  <div class="destination-copy">
    <p class="eyebrow destination-overline">{_escape(metadata['kicker'])}</p>
    <h2 id="{heading_id}">{metadata['heading']}</h2>
    <p class="description">{_escape(metadata['lede'])}</p>
    <div class="actions"><button class="pill" type="button" data-destination-dialog="{_escape(route)}">{_escape(metadata['action'])} <span class="arrow" aria-hidden="true">→</span></button></div>
  </div>
</section>
<dialog id="{dialog_id}" class="destination-dialog" aria-labelledby="{route}-dialog-heading" open>
  <button class="close" type="button" aria-label="Close {_escape(metadata['dialog_label'])}">×</button>
  <div class="destination-dialog-content">{dialog_body}</div>
</dialog>"""


def build_flow() -> str:
    findings = _load_public_findings()
    return "".join((
        _services_page(embedded=True),
        _research_page(findings, embedded=True),
        _about_page(embedded=True),
        _contact_page(embedded=True),
    ))


def build_documents(output: Path) -> list[Path]:
    """Write retained document pages and legacy links into the unified flow."""

    destination = Path(output)
    destination.mkdir(parents=True, exist_ok=True)
    findings = _load_public_findings()
    pages = {
        "services": _services_page(),
        "about": _about_page(),
        "work": _work_page(findings),
        "process": _process_page(),
        "research": _research_page(findings),
        "contact": _contact_page(),
    }
    written: list[Path] = []
    for route in DOCUMENT_ROUTES:
        path = destination / f"{route}.html"
        path.write_text(pages[route], encoding="utf-8")
        written.append(path)
    return written


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", nargs="?", type=Path, default=SITE_ROOT / "dist")
    args = parser.parse_args()
    written = build_documents(args.output)
    print(f"Built {len(written)} document pages in {Path(args.output)}")


if __name__ == "__main__":
    main()
