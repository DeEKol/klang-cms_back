import fs from "fs";
import path from "path";

// Directories to skip validation
const SKIP_DIRS = ["migrations", "firebase", "common", "shared", "config", "utils"];

const RULES = {
    fileNaming: {
        entity: /\.entity\.ts$/,
        ormEntity: /\.orm-entity\.ts$/,
        adapter: /-repository\.adapter\.ts$/,
        port: /^i-.*\.port\.ts$/,
        dto: /\.dto\.ts$/,
    },
};

function validateModuleStructure(modulePath) {
    const errors = [];
    const warnings = [];
    const moduleName = path.basename(modulePath);

    // Check if module has domains directory (hexagonal architecture indicator)
    const domainsDir = path.join(modulePath, "domains");
    if (!fs.existsSync(domainsDir)) {
        // Not a hexagonal module, skip
        return { errors: [], warnings: [] };
    }

    // Check recommended directories (warnings only)
    const recommendedDirs = [
        "domains/entities",
        "domains/ports/in",
        "domains/ports/out",
        "domains/services",
        "modules/api",
        "modules/persistence",
    ];

    recommendedDirs.forEach((dir) => {
        const fullPath = path.join(modulePath, dir);
        if (!fs.existsSync(fullPath)) {
            warnings.push(`Missing recommended directory: ${moduleName}/${dir}`);
        }
    });

    // Validate file naming in domains/entities
    const entitiesDir = path.join(modulePath, "domains/entities");
    if (fs.existsSync(entitiesDir)) {
        const files = fs.readdirSync(entitiesDir).filter((f) => f.endsWith(".ts"));
        files.forEach((file) => {
            if (!RULES.fileNaming.entity.test(file)) {
                errors.push(
                    `Invalid entity file name: ${moduleName}/domains/entities/${file} (should be *.entity.ts)`,
                );
            }
        });
    }

    // Validate file naming in domains/ports/out
    const portsOutDir = path.join(modulePath, "domains/ports/out");
    if (fs.existsSync(portsOutDir)) {
        const files = fs.readdirSync(portsOutDir).filter((f) => f.endsWith(".ts"));
        files.forEach((file) => {
            if (!RULES.fileNaming.port.test(file)) {
                errors.push(
                    `Invalid port file name: ${moduleName}/domains/ports/out/${file} (should be i-*.port.ts)`,
                );
            }
        });
    }

    // Validate ORM entities in persistence
    const persistenceDir = path.join(modulePath, "modules/persistence");
    if (fs.existsSync(persistenceDir)) {
        const checkOrmEntities = (dir) => {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            items.forEach((item) => {
                if (item.isDirectory()) {
                    checkOrmEntities(path.join(dir, item.name));
                } else if (item.name.endsWith(".ts") && item.name.includes("orm")) {
                    if (!RULES.fileNaming.ormEntity.test(item.name)) {
                        errors.push(
                            `Invalid ORM entity file name: ${path.relative(modulePath, path.join(dir, item.name))} (should be *.orm-entity.ts)`,
                        );
                    }
                }
            });
        };
        checkOrmEntities(persistenceDir);
    }

    return { errors, warnings };
}

function validateArchitecture() {
    const srcDir = path.join(process.cwd(), "src");
    if (!fs.existsSync(srcDir)) {
        console.error("Error: src/ directory not found");
        process.exit(1);
    }

    const modules = fs
        .readdirSync(srcDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .filter((name) => !name.startsWith(".") && !SKIP_DIRS.includes(name));

    let allErrors = [];
    let allWarnings = [];

    modules.forEach((moduleName) => {
        const modulePath = path.join(srcDir, moduleName);
        const { errors, warnings } = validateModuleStructure(modulePath);
        allErrors = allErrors.concat(errors);
        allWarnings = allWarnings.concat(warnings);
    });

    if (allWarnings.length > 0) {
        console.log("\n⚠️  Architecture warnings:\n");
        allWarnings.forEach((warn) => console.log(`  - ${warn}`));
        console.log("");
    }

    if (allErrors.length > 0) {
        console.error("\n❌ Architecture validation failed:\n");
        allErrors.forEach((err) => console.error(`  - ${err}`));
        console.error(`\nTotal errors: ${allErrors.length}\n`);
        process.exit(1);
    } else {
        console.log("✅ Architecture validation passed!");
        if (allWarnings.length === 0) {
            console.log("   No issues found.\n");
        }
    }
}

validateArchitecture();
