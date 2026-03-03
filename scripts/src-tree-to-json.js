/**
 * scripts/src-tree-to-json.js
 *
 * Usage:
 *   node scripts/src-tree-to-json.js ./src > src-tree.json
 *
 * - Skips node_modules and .git by default.
 * - Produces JSON with nested { name, path, type: "file"|"dir", children? }.
 */

import fs from "fs/promises";
import path from "path";

const IGNORES = new Set(["node_modules", ".git", ".idea", ".vscode"]);

async function statSafe(p) {
    try {
        return await fs.lstat(p);
    } catch (e) {
        return null;
    }
}

async function walk(dir, base = dir) {
    const name = path.basename(dir);
    if (IGNORES.has(name)) return null;

    const s = await statSafe(dir);
    if (!s) return null;

    if (s.isDirectory()) {
        let entries;
        try {
            entries = await fs.readdir(dir);
        } catch (e) {
            return null;
        }
        const children = [];
        for (const e of entries.sort()) {
            const childPath = path.join(dir, e);
            if (IGNORES.has(e)) continue;
            const ch = await walk(childPath, base);
            if (ch) children.push(ch);
        }
        return {
            name,
            path: path.relative(process.cwd(), dir) || ".",
            type: "dir",
            children,
        };
    } else {
        return {
            name,
            path: path.relative(process.cwd(), dir),
            type: "file",
        };
    }
}

async function main() {
    const target = process.argv[2] || "./src";
    const resolved = path.resolve(process.cwd(), target);
    const tree = await walk(resolved);
    if (!tree) {
        console.error(`Не удалось просканировать ${target}`);
        process.exit(2);
    }
    process.stdout.write(JSON.stringify(tree, null, 2));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
