# Empty Spam & Trash

A Thunderbird add-on that adds one toolbar button to **permanently delete everything in your Spam/Junk and Trash folders, across all accounts**.

![Thunderbird 128+](https://img.shields.io/badge/Thunderbird-128%2B-0a84ff) ![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-green)

## Features

- Finds every real Junk and Trash folder in every account. Unified and virtual folders are skipped, so nothing is counted twice.
- Shows how many messages are in each folder before anything is deleted.
- Asks for confirmation with a second click before deleting.
- Deletes permanently. Messages do not go back into Trash.

## Compatibility

| Thunderbird | Status |
|---|---|
| 153 ESR / current release | ✅ |
| 140 ESR | ✅ |
| 128 ESR | ✅ |
| 127 and older | ❌ (needs the `folders.query` API from 128) |

## Installation

### From a release

1. Download the latest `empty-spam-trash-*.xpi` from the [Releases](../../releases) page.
2. In Thunderbird, open **Tools → Add-ons and Themes**.
3. Click the gear icon, choose **Install Add-on From File…**, and select the `.xpi`.

### From source (for development)

1. Clone this repository.
2. In Thunderbird, open **Tools → Developer Tools → Debug Add-ons**.
3. Click **Load Temporary Add-on…** and select `manifest.json`.

## Usage

1. Click the **Empty Spam & Trash** button in the toolbar.
2. Check the list of folders and message counts.
3. Click **Delete all permanently**, then click again to confirm.

> ⚠️ **Deletion is permanent and cannot be undone.** Make sure there is nothing in Spam or Trash that you want to keep.

## Permissions

| Permission | Why it is needed |
|---|---|
| `accountsRead` | To list your accounts and find their Junk and Trash folders |
| `messagesRead` | To count and list messages in those folders |
| `messagesDelete` | To delete the messages |

The add-on makes no network requests and collects no data.

## Building

```sh
./build.sh
```

This creates `dist/empty-spam-trash-<version>.xpi`.

## Releasing

Update `version` in `manifest.json` and add an entry to `CHANGELOG.md`. Then build and publish:

```sh
./build.sh
git tag v1.1.0 && git push origin v1.1.0
gh release create v1.1.0 dist/empty-spam-trash-1.1.0.xpi --title v1.1.0 --notes-file <(sed -n '/^## 1.1.0/,/^## /{/^## /!p}' CHANGELOG.md)
```

## License

[GPL-3.0-or-later](LICENSE) © 2026 dschaefer79
