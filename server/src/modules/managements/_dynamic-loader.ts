import * as fs from 'fs';
import * as path from 'path';

const SRC_MANAGEMENTS_DIR = path.join(
  process.cwd(),
  'src',
  'modules',
  'managements',
);
const DIST_MANAGEMENTS_DIR = path.join(__dirname);

export function loadGeneratedModules(): {
  modules: any[];
  entities: Function[];
} {
  const modules: any[] = [];
  const entities: Function[] = [];

  const registryPath = path.join(
    SRC_MANAGEMENTS_DIR,
    'sc-modules-registry.json',
  );
  if (!fs.existsSync(registryPath)) {
    return { modules: [], entities: [] };
  }

  let registry: any[];
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  } catch {
    return { modules: [], entities: [] };
  }

  for (const mod of registry) {
    if (!mod.isActive) continue;

    try {
      const modulePath = path.join(
        DIST_MANAGEMENTS_DIR,
        `sc_${mod.name}`,
        `${mod.name}.module`,
      );
      const entityPath = path.join(
        DIST_MANAGEMENTS_DIR,
        `sc_${mod.name}`,
        'entities',
        `${mod.name}.entity`,
      );

      const modModule = require(modulePath);
      const modEntity = require(entityPath);

      const moduleClass = Object.values(modModule).find(
        (v: any) => typeof v === 'function' && v.name.endsWith('Module'),
      ) as Function | undefined;
      const entityClass = Object.values(modEntity).find(
        (v: any) => typeof v === 'function',
      ) as Function | undefined;

      if (moduleClass) modules.push(moduleClass);
      if (entityClass) entities.push(entityClass);
    } catch (error) {
      console.error(
        `Failed to load generated module "${mod.name}":`,
        error.message,
      );
    }
  }

  return { modules, entities };
}
