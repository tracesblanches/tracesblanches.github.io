#!/bin/sh
# Renames the project everywhere in this repository: every occurrence of the
# current name (file contents only, file names never contain it) becomes NEW.
# usage: scripts/rename.sh NEW        (run from the repository root)
set -eu
OLD=traceblanche
NEW=${1:?usage: scripts/rename.sh NEW}
case "$NEW" in *[!a-z0-9-]*) echo "NEW must be lowercase letters, digits or '-'" >&2; exit 2;; esac
files=$(git grep -l -e "$OLD" -- . ':(exclude)scripts/rename.sh' || true)
[ -n "$files" ] || { echo "no occurrence of $OLD"; exit 0; }
printf '%s\n' "$files" | while IFS= read -r f; do sed -i "s/$OLD/$NEW/g" "$f"; echo "renamed in $f"; done
sed -i "s/^OLD=$OLD\$/OLD=$NEW/" scripts/rename.sh
