#!/usr/bin/env python3
"""Checks every internal link of the site: target file exists, and #anchor exists in it.

usage: scripts/check-links.py            (from the repository root)
Also checks img src/srcset files, that each page has exactly one <h1>, that ids are
unique, and lists external links (not fetched). Exit status 1 on any problem.
"""
import html.parser
import pathlib
import sys
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent


class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.links, self.h1 = [], [], 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if tag == "h1":
            self.h1 += 1
        if tag == "a" and "href" in a:
            self.links.append(a["href"])
        if tag == "link" and "href" in a and a.get("rel") in ("stylesheet", "icon", "alternate"):
            self.links.append(a["href"])
        if tag == "img":
            self.links.append(a["src"])
            for part in (a.get("srcset") or "").split(","):
                if part.strip():
                    self.links.append(part.strip().split()[0])


def parse(path):
    p = Page()
    p.feed(path.read_text(encoding="utf-8"))
    return p


pages = sorted(p for p in ROOT.rglob("*.html") if "scripts" not in p.parts)
parsed = {p: parse(p) for p in pages}
problems, external, checked = [], set(), 0
for page, info in parsed.items():
    rel = page.relative_to(ROOT)
    if info.h1 != 1:
        problems.append(f"{rel}: {info.h1} <h1> elements")
    dup = {i for i in info.ids if info.ids.count(i) > 1}
    if dup:
        problems.append(f"{rel}: duplicate ids {sorted(dup)}")
    for href in info.links:
        url = urllib.parse.urlparse(href)
        if url.scheme in ("http", "https", "mailto"):
            external.add(href)
            continue
        checked += 1
        path = urllib.parse.unquote(url.path)
        if not path:
            target = page
        elif path.startswith("/"):
            target = ROOT / path.lstrip("/")
        else:
            target = page.parent / path
        if target.is_dir():
            target = target / "index.html"
        if not target.exists():
            problems.append(f"{rel}: broken link {href}")
            continue
        if url.fragment:
            if target.suffix != ".html":
                problems.append(f"{rel}: anchor on a non-page {href}")
            elif url.fragment not in parsed[target.resolve()].ids:
                problems.append(f"{rel}: missing anchor {href}")

print(f"{len(pages)} pages, {checked} internal links and images checked, {len(external)} external links (not fetched)")
for e in sorted(external):
    print("  external:", e)
for p in problems:
    print("PROBLEM:", p)
sys.exit(1 if problems else 0)
