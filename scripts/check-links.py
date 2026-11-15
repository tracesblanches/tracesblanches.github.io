#!/usr/bin/env python3
"""Checks the links of the built bilingual site (dist/): English at the root, French in fr/.

usage: scripts/check-links.py [site-root]      site-root defaults to dist/ (run `npm run build` first)

For every page: each internal link, image (src and srcset, <source srcset>, preloaded
imagesrcset, og:image), script and stylesheet points to an existing file, and each #anchor exists
in its target; exactly one <h1>; unique ids. Links to the site's own address (SITE below, e.g. in
canonical and hreflang links) are checked as internal files. Every inline script is allowed by a
hash of the Content-Security-Policy <meta>, which comes before it.

For every page but 404.html: <html lang> matches the folder (fr/ is French, the rest English);
a canonical link to the page itself; hreflang alternates en, fr and x-default (= en) that
exist and point back to each other; a FR | EN switch whose links (data-lang) lead to the
same counterpart; the script that remembers the FR | EN choice inlined (src/scripts/lang-memory.js).
Only the English home page carries the detection script (src/scripts/lang-root.js). Every page
has its counterpart in the other language, and sitemap.xml lists exactly the pages but 404.html.
External links are listed, not fetched. Exit status 1 on any problem.
"""
import base64
import hashlib
import re
import html.parser
import pathlib
import sys
import urllib.parse

REPO = pathlib.Path(__file__).resolve().parent.parent
ROOT = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else REPO / "dist"
SITE = "https://tracesblanches.github.io/"
SKIP_DIRS = set()
MEMORY = (REPO / "src/scripts/lang-memory.js").read_text(encoding="utf-8").strip()
DETECT = (REPO / "src/scripts/lang-root.js").read_text(encoding="utf-8").strip()


class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.h1, self.lang = [], [], 0, None
        self.alternates, self.canonical, self.switch, self.scripts = {}, None, {}, []
        self.inline, self.csp, self.csp_pos, self.in_script, self.script_pos = [], None, None, False, []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "h1":
            self.h1 += 1
        if tag == "a" and "href" in a:
            self.links.append(a["href"])
            if "data-lang" in a:
                self.switch[a["data-lang"]] = a["href"]
        if tag == "link" and "href" in a:
            rel = a.get("rel")
            if rel in ("stylesheet", "icon", "alternate", "canonical"):
                self.links.append(a["href"])
            if rel == "alternate" and "hreflang" in a:
                self.alternates[a["hreflang"]] = a["href"]
            if rel == "canonical":
                self.canonical = a["href"]
        if tag == "script" and "src" in a:
            self.links.append(a["src"])
            self.scripts.append(a["src"])
        elif tag == "script" and a.get("type") in (None, "module", "text/javascript"):
            self.in_script = True
            self.inline.append("")
            self.script_pos.append(self.getpos())
        if tag == "meta" and (a.get("http-equiv") or "").lower() == "content-security-policy":
            self.csp, self.csp_pos = a.get("content"), self.getpos()
        if tag == "meta" and a.get("property") == "og:image":
            self.links.append(a["content"])
        if tag == "img":
            self.links.append(a["src"])
        srcset = a.get("srcset") or (a.get("imagesrcset") if tag == "link" else None) or ""
        for part in srcset.split(","):
            if part.strip():
                self.links.append(part.strip().split()[0])

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_script = False

    def handle_data(self, data):
        if self.in_script:
            self.inline[-1] += data


def parse(path):
    p = Page()
    p.feed(path.read_text(encoding="utf-8"))
    return p


def target_of(page, href):
    """Local file for an internal link (None for an external one), and the #fragment."""
    if href.startswith(SITE):
        href = "/" + href[len(SITE):]
    url = urllib.parse.urlparse(href)
    if url.scheme or url.netloc:
        return None, ""
    path = urllib.parse.unquote(url.path)
    if not path:
        target = page
    elif path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = page.parent / path
    if target.is_dir() or path.endswith("/"):
        target = target / "index.html"
    return target.resolve(), url.fragment


if not (ROOT / "index.html").exists():
    sys.exit(f"{ROOT}/index.html not found: run `npm run build` first")
pages = sorted(p for p in ROOT.rglob("*.html") if not SKIP_DIRS & set(p.relative_to(ROOT).parts))
parsed = {p.resolve(): parse(p) for p in pages}
problems, external, checked = [], set(), 0


def rel(p):
    return p.relative_to(ROOT).as_posix()


for page, info in parsed.items():
    if info.h1 != 1:
        problems.append(f"{rel(page)}: {info.h1} <h1> elements")
    for code, pos in zip(info.inline, info.script_pos):
        digest = "sha256-" + base64.b64encode(hashlib.sha256(code.encode("utf-8")).digest()).decode()
        if info.csp is None or f"'{digest}'" not in info.csp:
            problems.append(f"{rel(page)}: inline script at line {pos[0]} is not allowed by the CSP <meta> ({digest})")
        elif info.csp_pos > pos:
            problems.append(f"{rel(page)}: the CSP <meta> comes after the inline script at line {pos[0]}")
    has_detect = DETECT in info.inline
    if has_detect != (rel(page) == "index.html"):
        problems.append(f"{rel(page)}: language detection script {'present' if has_detect else 'missing'} (only on the English home page)")
    dup = {i for i in info.ids if info.ids.count(i) > 1}
    if dup:
        problems.append(f"{rel(page)}: duplicate ids {sorted(dup)}")
    for href in info.links:
        target, fragment = target_of(page, href)
        if target is None:
            external.add(href)
            continue
        checked += 1
        if not target.exists():
            problems.append(f"{rel(page)}: broken link {href}")
            continue
        if fragment:
            if target.suffix != ".html":
                problems.append(f"{rel(page)}: anchor on a non-page {href}")
            elif fragment not in parsed[target].ids:
                problems.append(f"{rel(page)}: missing anchor {href}")

# Bilingual structure.
pairs = 0
for page, info in parsed.items():
    name = rel(page)
    if name == "404.html":
        continue
    lang = "fr" if name.startswith("fr/") else "en"
    other = "en" if lang == "fr" else "fr"
    if info.lang != lang:
        problems.append(f"{name}: <html lang={info.lang!r}>, expected {lang!r}")
    if info.canonical is None or target_of(page, info.canonical)[0] != page:
        problems.append(f"{name}: canonical {info.canonical!r} is not the page itself")
    if not (info.canonical or "").startswith(SITE):
        problems.append(f"{name}: canonical {info.canonical!r} is not an absolute address on {SITE}")
    for h in ("en", "fr", "x-default"):
        if h not in info.alternates:
            problems.append(f"{name}: no hreflang={h} alternate")
        elif not info.alternates[h].startswith(SITE):
            problems.append(f"{name}: hreflang={h} {info.alternates[h]!r} is not on {SITE}")
    if {"en", "fr", "x-default"} - info.alternates.keys():
        continue
    if target_of(page, info.alternates[lang])[0] != page:
        problems.append(f"{name}: hreflang={lang} does not point to the page itself")
    if info.alternates["x-default"] != info.alternates["en"]:
        problems.append(f"{name}: x-default differs from the English page")
    counterpart = target_of(page, info.alternates[other])[0]
    if counterpart not in parsed:
        problems.append(f"{name}: no {other} counterpart ({info.alternates[other]})")
        continue
    back = parsed[counterpart].alternates.get(lang)
    if back is None or target_of(counterpart, back)[0] != page:
        problems.append(f"{name}: its {other} counterpart {rel(counterpart)} does not point back")
    if other not in info.switch or target_of(page, info.switch[other])[0] != counterpart:
        problems.append(f"{name}: the {other.upper()} switch link {info.switch.get(other)!r} does not lead to {rel(counterpart)}")
    if MEMORY not in info.inline:
        problems.append(f"{name}: the FR | EN memory script is missing (the language choice would not be kept)")
    pairs += 1

# Sitemap: exactly the pages but 404.html, each with its alternates.
sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8") if (ROOT / "sitemap.xml").exists() else ""
locs = re.findall(r"<loc>(.*?)</loc>", sitemap)
listed = {target_of(ROOT / "index.html", u)[0] for u in locs}
expected = {p for p in parsed if rel(p) != "404.html"}
if listed != expected:
    problems.append(f"sitemap.xml lists {sorted(rel(p) for p in listed - expected)} too many and misses {sorted(rel(p) for p in expected - listed)}")
for u in re.findall(r'href="([^"]*)"', sitemap):
    t = target_of(ROOT / "index.html", u)[0]
    if t is None or not t.exists():
        problems.append(f"sitemap.xml: alternate {u} does not exist")

print(f"{len(pages)} pages, {checked} internal links, images and scripts checked, "
      f"{pairs} pages with a checked counterpart, {len(external)} external links (not fetched)")
for e in sorted(external):
    print("  external:", e)
for p in problems:
    print("PROBLEM:", p)
sys.exit(1 if problems else 0)
