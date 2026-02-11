import fs from "fs";
import path from "path";

export default function (plop) {
    // helpers
    plop.setHelper("pascalCase", (txt) => {
        if (!txt) return "";
        return txt
            .split(/[-_ ]/)
            .map((p) => p[0].toUpperCase() + p.slice(1))
            .join("");
    });
    plop.setHelper("kebabCase", (txt) => {
        if (!txt) return "";
        return txt
            .replace(/([A-Z])/g, "-$1")
            .replace(/_+/g, "-")
            .replace(/--+/g, "-")
            .toLowerCase()
            .replace(/^-/, "");
    });
    plop.setHelper("upperCase", (s) => (s || "").toUpperCase());
    plop.setHelper("eq", (a, b) => a === b);

    // module scaffold
    plop.setGenerator("module-scaffold", {
        description: "Create module scaffold (domains, modules/api, modules/persistence, tests)",
        prompts: [
            { type: "input", name: "module", message: "Module name (kebab-case, e.g. auth)" },
        ],
        actions: function (data) {
            const m = data.module;
            const base = `src/${m}`;
            return [
                {
                    type: "add",
                    path: `${base}/domains/entities/.gitkeep`,
                    templateFile: "plop-templates/_gitkeep.hbs",
                },
                {
                    type: "add",
                    path: `${base}/domains/ports/in/.gitkeep`,
                    templateFile: "plop-templates/_gitkeep.hbs",
                },
                {
                    type: "add",
                    path: `${base}/domains/ports/out/.gitkeep`,
                    templateFile: "plop-templates/_gitkeep.hbs",
                },
                {
                    type: "add",
                    path: `${base}/domains/services/.gitkeep`,
                    templateFile: "plop-templates/_gitkeep.hbs",
                },
                {
                    type: "add",
                    path: `${base}/modules/api/dto/.gitkeep`,
                    templateFile: "plop-templates/_gitkeep.hbs",
                },
                {
                    type: "add",
                    path: `${base}/modules/api/${m}-api.module.ts`,
                    templateFile: "plop-templates/module-api.module.ts.hbs",
                },
                {
                    type: "add",
                    path: `${base}/modules/persistence/.gitkeep`,
                    templateFile: "plop-templates/_gitkeep.hbs",
                },
                {
                    type: "add",
                    path: `${base}/tests/.gitkeep`,
                    templateFile: "plop-templates/_gitkeep.hbs",
                },
            ];
        },
    });

    // entity generator
    plop.setGenerator("entity", {
        description:
            "Create domain entity + ports + dto + service + persistence adapter + controller + tests",
        prompts: [
            { type: "input", name: "module", message: "Module name (kebab-case)" },
            {
                type: "input",
                name: "entity",
                message: "Entity name (kebab-case, e.g. user-statistics)",
            },
            {
                type: "input",
                name: "fields",
                message:
                    "Fields (comma separated name:type, e.g. totalLogins:number,lastLoginAt:Date)",
                default: "",
            },
        ],
        actions: function (data) {
            const m = data.module;
            const e = data.entity;
            const base = `src/${m}`;
            const fieldsArr = (data.fields || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((f) => {
                    const [name, type] = f.split(":").map((x) => x && x.trim());
                    return { name: name, type: type || "string" };
                });

            const actions = [];

            // domain entity
            actions.push({
                type: "add",
                path: `${base}/domains/entities/${e}.entity.ts`,
                templateFile: "plop-templates/entity.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // ports (out repository)
            actions.push({
                type: "add",
                path: `${base}/domains/ports/out/i-${e}-repository.port.ts`,
                templateFile: "plop-templates/repo-port.hbs",
                data: { entity: e },
            });

            // dto
            actions.push({
                type: "add",
                path: `${base}/modules/api/dto/${e}.dto.ts`,
                templateFile: "plop-templates/dto.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // domain service / use-case
            actions.push({
                type: "add",
                path: `${base}/domains/services/update-${e}.service.ts`,
                templateFile: "plop-templates/usecase.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // persistence adapter folder + orm entity
            actions.push({
                type: "add",
                path: `${base}/modules/persistence/${e}/${e}.orm-entity.ts`,
                templateFile: "plop-templates/orm-entity.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // persistence adapter file
            actions.push({
                type: "add",
                path: `${base}/modules/persistence/${e}-repository.adapter.ts`,
                templateFile: "plop-templates/adapter.hbs",
                data: { entity: e },
            });

            // controller
            actions.push({
                type: "add",
                path: `${base}/modules/api/${e}.controller.ts`,
                templateFile: "plop-templates/controller.hbs",
                data: { module: m, entity: e },
            });

            // test skeleton
            actions.push({
                type: "add",
                path: `${base}/tests/${e}.spec.ts`,
                templateFile: "plop-templates/test.hbs",
                data: { entity: e },
            });

            // now: ensure persistence module exists or create it
            const persistenceModulePath = path.join(
                process.cwd(),
                base,
                "modules",
                "persistence",
                `${m}-persistence.module.ts`,
            );
            if (fs.existsSync(persistenceModulePath)) {
                // modify existing file
                actions.push({
                    type: "modify",
                    path: `${base}/modules/persistence/${m}-persistence.module.ts`,
                    pattern: /(export class [\s\S]*?\n\})/m,
                    template:
                        "$1\n// CLAUDE: ensure adapter is provided in module providers (if using DI)\n",
                });
            } else {
                // create a persistence module skeleton so modify won't fail later
                actions.push({
                    type: "add",
                    path: `${base}/modules/persistence/${m}-persistence.module.ts`,
                    templateFile: "plop-templates/persistence-module.hbs",
                    data: { module: m },
                });
            }

            return actions;
        },
    });
}
