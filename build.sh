#!/bin/sh
# Package the add-on into dist/empty-spam-trash-<version>.xpi
set -e
cd "$(dirname "$0")"
version=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' manifest.json | head -n1)
mkdir -p dist
out="dist/empty-spam-trash-$version.xpi"
rm -f "$out"
zip -9 -X "$out" manifest.json popup.html popup.js icon.svg LICENSE
echo "$out"
