// SPDX-License-Identifier: GPL-3.0-or-later
// Empty Spam & Trash - Thunderbird add-on
// Copyright (C) 2026 dschaefer79
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const list = document.getElementById("list");
const go = document.getElementById("go");
const status = document.getElementById("status");

// Every real (non-unified, non-virtual) Junk and Trash folder in all accounts.
async function findFolders() {
  const found = [];
  for (const use of ["junk", "trash"]) {
    const folders = await messenger.folders.query({ specialUse: [use] });
    for (const f of folders) {
      if (!f.isUnified && !f.isVirtual) found.push(f);
    }
  }
  return found;
}

async function messageIds(folder) {
  const ids = [];
  let page = await messenger.messages.list(folder.id);
  for (const m of page.messages) ids.push(m.id);
  while (page.id) {
    page = await messenger.messages.continueList(page.id);
    for (const m of page.messages) ids.push(m.id);
  }
  return ids;
}

// TB 140+ takes an options object; TB 128 only takes a boolean (deprecated, not removed).
let deleteOpts = null;
async function permanentDeleteOpts() {
  if (deleteOpts === null) {
    const { version } = await messenger.runtime.getBrowserInfo();
    deleteOpts = parseInt(version, 10) >= 140 ? { deletePermanently: true } : true;
  }
  return deleteOpts;
}

async function scan() {
  const accounts = new Map((await messenger.accounts.list(false)).map(a => [a.id, a.name]));
  const folders = await findFolders();
  const rows = [];
  for (const f of folders) {
    const info = await messenger.folders.getFolderInfo(f.id);
    rows.push({ folder: f, account: accounts.get(f.accountId) || f.accountId, count: info.totalMessageCount });
  }
  return rows;
}

function render(rows) {
  list.textContent = "";
  if (!rows.length) {
    list.innerHTML = "<tr><td>No Spam or Trash folders found.</td></tr>";
    return;
  }
  for (const r of rows) {
    const tr = list.insertRow();
    tr.insertCell().textContent = `${r.account} — ${r.folder.name}`;
    const n = tr.insertCell();
    n.className = "n";
    n.textContent = r.count;
  }
}

async function init() {
  const rows = await scan();
  render(rows);
  const total = rows.reduce((s, r) => s + r.count, 0);
  go.disabled = total === 0;
  status.textContent = total === 0 ? "Nothing to delete." : `${total} message(s) total.`;

  let armed = false;
  go.onclick = async () => {
    // Two-step confirm: window.confirm() is blocked in toolbar popups.
    if (!armed) {
      armed = true;
      go.textContent = `Click again to delete ${total} message(s) forever`;
      return;
    }
    go.disabled = true;
    let deleted = 0;
    try {
      for (const r of rows) {
        status.textContent = `Emptying ${r.account} — ${r.folder.name}…`;
        const ids = await messageIds(r.folder);
        for (let i = 0; i < ids.length; i += 500) {
          await messenger.messages.delete(ids.slice(i, i + 500), await permanentDeleteOpts());
        }
        deleted += ids.length;
      }
      status.textContent = `Done. Deleted ${deleted} message(s).`;
      go.textContent = "Delete all permanently";
      render(await scan());
    } catch (e) {
      status.textContent = "Error: " + e.message;
      console.error(e);
    }
  };
}

init().catch(e => { status.textContent = "Error: " + e.message; });
