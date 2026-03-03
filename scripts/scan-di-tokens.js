import fs from "fs";
import path from "path";

function walk(dir, cb) {
    fs.readdirSync(dir).forEach((name) => {
        const p = path.join(dir, name);
        const st = fs.lstatSync(p);
        if (st.isDirectory()) walk(p, cb);
        else cb(p);
    });
}

const root = path.join(process.cwd(), "src");
const occurrences = [];

walk(root, (p) => {
    if (!p.endsWith(".ts")) return;
    const src = fs.readFileSync(p, "utf8");
    const patterns = [
        { name: "Symbol(", re: /Symbol\(/g },
        { name: "Symbol.for(", re: /Symbol\.for\(/g },
        { name: "provide:", re: /provide\s*:\s*/g },
        { name: "useClass:", re: /useClass\s*:/g },
        { name: "useValue:", re: /useValue\s*:/g },
        { name: "useFactory:", re: /useFactory\s*:/g },
        { name: "useExisting:", re: /useExisting\s*:/g },
    ];
    patterns.forEach(({ name, re }) => {
        const m = src.match(re);
        if (m) occurrences.push({ file: p, type: name, count: m.length });
    });
});

console.log(JSON.stringify(occurrences, null, 2));
