#!/usr/bin/env bash
# Quality gates of the site, as in CI (.github/workflows/pages.yml) plus Lighthouse.
#   bash scripts/check.sh            SKIP="lighthouse" skips steps by name.
# Needs Node (.nvmrc), Python 3, Java (vnu) and Google Chrome (CHROME).
set -uo pipefail
cd "$(dirname "$0")/.."
SKIP="${SKIP:-}"; FAILED=0; SUMMARY=()
step() { local name="$1"; shift
  if [[ " $SKIP " == *" $name "* ]]; then SUMMARY+=("$name skipped"); return; fi
  printf '\n=== %s\n' "$name"
  if "$@"; then SUMMARY+=("$name ok"); else SUMMARY+=("$name FAIL"); FAILED=1; fi; }
step contrast node scripts/check-contrast.mjs
step types npx astro check
step build npm run build
step links python3 -I scripts/check-links.py
step html java -jar node_modules/vnu-jar/build/dist/vnu.jar --errors-only --skip-non-html --also-check-css dist
step lang node scripts/test-lang.mjs
step hero node scripts/check-hero-contrast.mjs
step lighthouse node scripts/lighthouse.mjs
printf '\n=== summary\n'; printf '%s\n' "${SUMMARY[@]}"
exit $FAILED
