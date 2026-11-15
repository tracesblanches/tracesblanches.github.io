#!/usr/bin/env python3
"""Checks the links of the bilingual site: English at the root, French in fr/.

usage: scripts/check-links.py            (from the repository root)

For every page: each internal link, image (src and srcset), script and stylesheet points to an
existing file, and each #anchor exists in its target; exactly one <h1>; unique ids. Links to
the site's own address (SITE below, e.g. in canonical and hreflang links) are checked as
internal files.

For every page but 404.html: <html lang> matches the folder (fr/ is French, the rest English);
a canonical link to the page itself; hreflang alternates en, fr and x-default (= en) that
exist and point back to each other; a FR | EN switch whose links (data-lang) lead to the
same counterpart; lang.js loaded. Every page has its counterpart in the other language.
External links are listed, not fetched. Exit status 1 on any problem.
"""
import html.parser
import pathlib
import sys
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://tracesblanches.github.io/"
SKIP_DIRS = {"scripts", "node_modules", ".git"}


class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.h1, self.lang = [], [], 0, None
        self.alternates, self.canonical, self.switch, self.scripts = {}, None, {}, []

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
        if tag == "img":
            self.links.append(a["src"])
            for part in (a.get("srcset") or "").split(","):
                if part.strip():
                    self.links.append(part.strip().split()[0])


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


pages = sorted(p for p in ROOT.rglob("*.html") if not SKIP_DIRS & set(p.relative_to(ROOT).parts))
parsed = {p.resolve(): parse(p) for p in pages}
problems, external, checked = [], set(), 0


def rel(p):
    return p.relative_to(ROOT).as_posix()


for page, info in parsed.items():
    if info.h1 != 1:
        problems.append(f"{rel(page)}: {info.h1} <h1> elements")
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
    if not any(s.endswith("lang.js") for s in info.scripts):
        problems.append(f"{name}: lang.js is not loaded (the language choice would not be kept)")
    pairs += 1

print(f"{len(pages)} pages, {checked} internal links, images and scripts checked, "
      f"{pairs} pages with a checked counterpart, {len(external)} external links (not fetched)")
for e in sorted(external):
    print("  external:", e)
for p in problems:
    print("PROBLEM:", p)
sys.exit(1 if problems else 0)
