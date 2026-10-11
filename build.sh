#!/bin/sh
# Package the add-on for addons.thunderbird.net (.zip) and for direct install (.xpi).
# Files must sit at the root of the archive, with no hidden or development files.
set -e
cd "$(dirname "$0")"
version=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' manifest.json | head -n1)
mkdir -p dist
zip="dist/empty-spam-trash-$version.zip"
xpi="dist/empty-spam-trash-$version.xpi"
rm -f "$zip" "$xpi"
zip -9 -X -q "$zip" manifest.json popup.html popup.js icon.svg LICENSE
cp "$zip" "$xpi"
echo "$zip"
echo "$xpi"
