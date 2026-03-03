/**
 * scripts/generate-entity.js
 *
 * Usage:
 *  node scripts/generate-entity.js <module> <entity-name> "<field1:type,field2:type,...>"
 *
 * Example:
 *  node scripts/generate-entity.js auth user-statistics "totalLogins:number,lastLoginAt:Date"
 *
 * Generates:
 *  - domain entity
 *  - domain ports (in/out) if missing
 *  - application dto
 *  - application use-case
 *  - persistence orm-entity skeleton (in modules/persistence/<entity>)
 *  - persistence repository adapter skeleton (modules/persistence)
 *  - api controller skeleton (modules/api)
 *  - test skeletons under tests/
 */

import path from "path";
import fsp from "fsp/promises";

function pascalCase(s) {
    return s
        .split(/[-_]/)
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("");
}
function kebabCase(s) {
    return s
        .replace(/([A-Z])/g, "-$1")
        .replace(/_+/g, "-")
        .replace(/--+/g, "-")
        .toLowerCase()
        .replace(/^-/, "");
}

const [, , moduleName, entityNameRaw, fieldsRaw] = process.argv;
if (!moduleName || !entityNameRaw) {
    console.error("Usage: node scripts/generate-entity.js <module> <entity-name> '<fields>'");
    process.exit(2);
}
const entityKebab = kebabCase(entityNameRaw);
const EntityPascal = pascalCase(entityNameRaw);
const base = path.join(process.cwd(), "src", moduleName);
const fields = (fieldsRaw || "")
    .split(",")
    .filter(Boolean)
    .map((f) => {
        const [name, type] = f.split(":").map((s) => s.trim());
        return { name, type: type || "string" };
    });

async function ensureDir(p) {
    try {
        await fsp.mkdir(p, { recursive: true });
    } catch (e) {
        if (e.code !== "EEXIST") {
            throw e;
        }
    }
}

async function writeIfNotExist(filePath, content) {
    try {
        await fsp.access(filePath);
        console.log("exists:", filePath);
    } catch {
        await fsp.writeFile(filePath, content, "utf8");
        console.log("created:", filePath);
    }
}

(async () => {
    // Paths
    const domainEntitiesDir = path.join(base, "domains", "entities");
    const domainPortsInDir = path.join(base, "domains", "ports", "in");
    const domainPortsOutDir = path.join(base, "domains", "ports", "out");
    const appDtosDir = path.join(base, "modules", "api", "dto");
    const appUsecasesDir = path.join(base, "domains", "services"); // you have "services" in domains
    const persistenceDir = path.join(base, "modules", "persistence", entityKebab);
    const persistenceRoot = path.join(base, "modules", "persistence");
    const apiDir = path.join(base, "modules", "api");

    await ensureDir(domainEntitiesDir);
    await ensureDir(domainPortsInDir);
    await ensureDir(domainPortsOutDir);
    await ensureDir(appDtosDir);
    await ensureDir(appUsecasesDir);
    await ensureDir(persistenceDir);
    await ensureDir(persistenceRoot);
    await ensureDir(apiDir);

    // 1. Domain entity
    const entityPath = path.join(domainEntitiesDir, `${entityKebab}.entity.ts`);
    const entityContent = `export class ${EntityPascal}Entity {
  constructor(
    public readonly id: string,
${fields.map((f) => `    public ${f.name}${f.type === "Date" ? "?: Date" : `: ${f.type}`},`).join("\n")}
  ) {}
}
// CLAUDE: domain entity for ${entityKebab}
`;
    await writeIfNotExist(entityPath, entityContent);

    // 2. Domain out-port (repository interface)
    const repoPortPath = path.join(domainPortsOutDir, `i-${entityKebab}-repository.port.ts`);
    const repoPortContent = `import { ${EntityPascal}Entity } from '../../entities/${entityKebab}.entity';

export interface I${EntityPascal}RepositoryPort {
  findById(id: string): Promise<${EntityPascal}Entity | null>;
  save(entity: ${EntityPascal}Entity): Promise<void>;
  // CLAUDE: add other port methods if needed
}
`;
    await writeIfNotExist(repoPortPath, repoPortContent);

    // 3. DTO
    const dtoPath = path.join(appDtosDir, `${entityKebab}.dto.ts`);
    const dtoContent = `${fields
        .map(
            (f) => `export type ${EntityPascal}Dto = {
  ${fields.map((ff) => `${ff.name}${ff.type === "Date" ? "?: string" : `: ${ff.type}`};`).join("\n  ")}
};`,
        )
        .join("\n")}
// CLAUDE: DTO for ${entityKebab}
`;
    await writeIfNotExist(dtoPath, dtoContent);

    // 4. Use-case (skeleton) — put into domains/services or application/use-cases if you prefer
    const usecasePath = path.join(appUsecasesDir, `update-${entityKebab}.service.ts`);
    const usecaseContent = `import { Injectable } from '@nestjs/common';
import { I${EntityPascal}RepositoryPort } from '../ports/out/i-${entityKebab}-repository.port';
import { ${EntityPascal}Entity } from '../entities/${entityKebab}.entity';

@Injectable()
export class Update${EntityPascal}Service {
  constructor(private readonly repo: I${EntityPascal}RepositoryPort){}

  async execute(id: string, payload: Partial<${EntityPascal}Entity>): Promise<${EntityPascal}Entity> {
    // CLAUDE: implement domain validation/logic
    const entity = new ${EntityPascal}Entity(id, ${fields.map((f) => (f.type === "Date" ? "payload." + f.name : "payload." + f.name)).join(", ")});
    await this.repo.save(entity);
    return entity;
  }
}
`;
    await writeIfNotExist(usecasePath, usecaseContent);

    // 5. Persistence orm-entity skeleton
    const ormPath = path.join(persistenceDir, `${entityKebab}.orm-entity.ts`);
    const ormContent = `// ORM entity (adapter) for ${EntityPascal}
// CLAUDE: replace with TypeORM/Prisma definitions
export class ${EntityPascal}OrmEntity {
  id!: string;
${fields.map((f) => `  ${f.name}!: ${f.type === "Date" ? "Date" : f.type};`).join("\n")}
}
`;
    await writeIfNotExist(ormPath, ormContent);

    // 6. Persistence repository adapter
    const adapterPath = path.join(persistenceRoot, `${entityKebab}-repository.adapter.ts`);
    const adapterContent = `import { I${EntityPascal}RepositoryPort } from '../../domains/ports/out/i-${entityKebab}-repository.port';
import { ${EntityPascal}Entity } from '../../domains/entities/${entityKebab}.entity';

export class ${EntityPascal}RepositoryAdapter implements I${EntityPascal}RepositoryPort {
  async findById(id: string): Promise<${EntityPascal}Entity | null> {
    // CLAUDE: implement adapter (DB calls)
    return null;
  }
  async save(entity: ${EntityPascal}Entity): Promise<void> {
    // CLAUDE: persist via ORM
  }
}
`;
    await writeIfNotExist(adapterPath, adapterContent);

    // 7. API controller skeleton
    const controllerPath = path.join(apiDir, `${entityKebab}.controller.ts`);
    const controllerContent = `import { Controller, Patch, Param, Body } from '@nestjs/common';
import { Update${EntityPascal}Service } from '../../domains/services/update-${entityKebab}.service';
import { ${EntityPascal}Dto } from './dto/${entityKebab}.dto';

@Controller('${moduleName}/${entityKebab}')
export class ${EntityPascal}Controller {
  constructor(private readonly updateSvc: Update${EntityPascal}Service) {}

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.updateSvc.execute(id, dto);
  }
}
`;
    await writeIfNotExist(controllerPath, controllerContent);

    // 8. Tests skeleton
    const testsDir = path.join(base, "tests");
    await ensureDir(testsDir);
    const testPath = path.join(testsDir, `${entityKebab}.spec.ts`);
    const testContent = `describe('${EntityPascal} (skeleton)', () => {
  it('should have tests scaffolded', () => {
    expect(true).toBe(true);
  });
});
`;
    await writeIfNotExist(testPath, testContent);

    console.log("Generation finished. Review files and integrate into module exports if needed.");
})();
