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
                    templateFile: "plop-templates/module-api.hbs",
                },
                {
                    type: "add",
                    path: `${base}/modules/persistence/.gitkeep`,
                    templateFile: "plop-templates/_gitkeep.hbs",
                },
                {
                    type: "add",
                    path: `${base}/modules/persistence/${m}-persistence.module.ts`,
                    templateFile: "plop-templates/persistence-module.hbs",
                },
                {
                    type: "add",
                    path: `${base}/tests/.gitkeep`,
                    templateFile: "plop-templates/_gitkeep.hbs",
                },
                {
                    type: "add",
                    path: `${base}/${m}.module.ts`,
                    templateFile: "plop-templates/main-module.hbs",
                },
            ];
        },
    });

    // entity generator (FULL CRUD)
    plop.setGenerator("entity", {
        description:
            "Create domain entity + ports + dto + service + persistence adapter + controller + tests (FULL CRUD)",
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

            // domain entity with mapToDomain
            actions.push({
                type: "add",
                path: `${base}/domains/entities/${e}.entity.ts`,
                templateFile: "plop-templates/entity-crud.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // ports/in - commands
            actions.push({
                type: "add",
                path: `${base}/domains/ports/in/create-${e}.command.ts`,
                templateFile: "plop-templates/command-create.hbs",
                data: { entity: e, fields: fieldsArr },
            });
            actions.push({
                type: "add",
                path: `${base}/domains/ports/in/update-${e}.command.ts`,
                templateFile: "plop-templates/command-update.hbs",
                data: { entity: e, fields: fieldsArr },
            });
            actions.push({
                type: "add",
                path: `${base}/domains/ports/in/delete-${e}.command.ts`,
                templateFile: "plop-templates/command-delete.hbs",
                data: { entity: e },
            });
            actions.push({
                type: "add",
                path: `${base}/domains/ports/in/get-${e}.command.ts`,
                templateFile: "plop-templates/command-get.hbs",
                data: { entity: e },
            });

            // ports/in - use-cases interface
            actions.push({
                type: "add",
                path: `${base}/domains/ports/in/i-${e}.use-cases.ts`,
                templateFile: "plop-templates/use-cases-interface.hbs",
                data: { entity: e },
            });

            // ports/out - repository port (CRUD)
            actions.push({
                type: "add",
                path: `${base}/domains/ports/out/i-${e}-repository.port.ts`,
                templateFile: "plop-templates/repo-port-crud.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // domain service (CRUD)
            actions.push({
                type: "add",
                path: `${base}/domains/services/${e}-crud.service.ts`,
                templateFile: "plop-templates/service-crud.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // dto - request (create)
            actions.push({
                type: "add",
                path: `${base}/modules/api/dto/${e}.request.ts`,
                templateFile: "plop-templates/dto-request.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // dto - update request
            actions.push({
                type: "add",
                path: `${base}/modules/api/dto/${e}-update.request.ts`,
                templateFile: "plop-templates/dto-update-request.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // dto - delete request
            actions.push({
                type: "add",
                path: `${base}/modules/api/dto/${e}-delete.request.ts`,
                templateFile: "plop-templates/dto-delete-request.hbs",
                data: { entity: e },
            });

            // dto - find request
            actions.push({
                type: "add",
                path: `${base}/modules/api/dto/${e}-find.request.ts`,
                templateFile: "plop-templates/dto-find-request.hbs",
                data: { entity: e },
            });

            // dto - response
            actions.push({
                type: "add",
                path: `${base}/modules/api/dto/${e}.response.ts`,
                templateFile: "plop-templates/dto-response.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // persistence adapter folder + orm entity
            actions.push({
                type: "add",
                path: `${base}/modules/persistence/${e}/${e}.orm-entity.ts`,
                templateFile: "plop-templates/orm-entity.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // persistence adapter file (CRUD)
            actions.push({
                type: "add",
                path: `${base}/modules/persistence/${e}-repository.adapter.ts`,
                templateFile: "plop-templates/adapter-crud.hbs",
                data: { entity: e, fields: fieldsArr },
            });

            // controller (FULL CRUD)
            actions.push({
                type: "add",
                path: `${base}/modules/api/${e}.controller.ts`,
                templateFile: "plop-templates/controller-crud.hbs",
                data: { module: m, entity: e, fields: fieldsArr },
            });

            // test skeleton
            actions.push({
                type: "add",
                path: `${base}/tests/${e}.spec.ts`,
                templateFile: "plop-templates/test.hbs",
                data: { entity: e },
            });

            // ensure persistence module exists or create it
            const persistenceModulePath = path.join(
                process.cwd(),
                base,
                "modules",
                "persistence",
                `${m}-persistence.module.ts`,
            );
            if (fs.existsSync(persistenceModulePath)) {
                actions.push({
                    type: "modify",
                    path: `${base}/modules/persistence/${m}-persistence.module.ts`,
                    pattern: /(providers: \[)/,
                    template: `$1\n        // CLAUDE: Register ${e} repository adapter here`,
                });
            } else {
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
