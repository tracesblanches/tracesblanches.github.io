#!/bin/sh
# Renames the project identifier (organisation, repositories, addresses) in this
# repository: every occurrence of it (file contents only, file names never contain
# it) becomes NEW. The displayed name ("Traces blanches") is changed by hand.
# usage: scripts/rename.sh NEW        (run from the repository root)
set -eu
OLD=tracesblanches
NEW=${1:?usage: scripts/rename.sh NEW}
case "$NEW" in *[!a-z0-9-]*) echo "NEW must be lowercase letters, digits or '-'" >&2; exit 2;; esac
files=$(git grep -l -e "$OLD" -- . ':(exclude)scripts/rename.sh' || true)
[ -n "$files" ] || { echo "no occurrence of $OLD"; exit 0; }
printf '%s\n' "$files" | while IFS= read -r f; do sed -i "s/$OLD/$NEW/g" "$f"; echo "renamed in $f"; done
sed -i "s/^OLD=$OLD\$/OLD=$NEW/" scripts/rename.sh
