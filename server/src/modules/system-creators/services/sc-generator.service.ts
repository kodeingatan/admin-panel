import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { ScModule } from '@/modules/system-creators/entities/sc-module.entity';
import { CreateScModuleDto, ScFieldConfigDto, ScRelationConfigDto } from '@/modules/system-creators/dto/create-sc-module.dto';

const GENERATED_DIR = path.join(process.cwd(), 'src', 'modules', 'generated');

const COLUMN_MAP: Record<string, (f: ScFieldConfigDto) => string> = {
  text: (f) => `{ type: 'varchar', length: ${f.maxLength || 255} }`,
  textarea: () => `{ type: 'text' }`,
  'rich-text': () => `{ type: 'text' }`,
  number: () => `{ type: 'integer' }`,
  boolean: () => `{ type: 'boolean', default: false }`,
  date: () => `{ type: 'date' }`,
  datetime: () => `{ type: 'datetime' }`,
  email: () => `{ type: 'varchar', length: 255 }`,
  phone: () => `{ type: 'varchar', length: 50 }`,
  url: () => `{ type: 'varchar', length: 500 }`,
  password: () => `{ type: 'varchar', length: 255 }`,
  color: () => `{ type: 'varchar', length: 7 }`,
  select: () => `{ type: 'varchar', length: 255 }`,
  json: () => `{ type: 'text' }`,
  file: () => `{ type: 'varchar', length: 500 }`,
  image: () => `{ type: 'varchar', length: 500 }`,
};

const TS_TYPE_MAP: Record<string, string> = {
  text: 'string',
  textarea: 'string',
  'rich-text': 'string',
  number: 'number',
  boolean: 'boolean',
  date: 'string',
  datetime: 'string',
  email: 'string',
  phone: 'string',
  url: 'string',
  password: 'string',
  color: 'string',
  select: 'string',
  json: 'string',
  file: 'string',
  image: 'string',
};

const VALIDATOR_MAP: Record<string, (f: ScFieldConfigDto) => string[]> = {
  text: (f) => {
    const decs = ['@IsString()'];
    if (f.minLength) decs.push(`@MinLength(${f.minLength})`);
    if (f.maxLength) decs.push(`@MaxLength(${f.maxLength})`);
    return decs;
  },
  textarea: (f) => {
    const decs = ['@IsString()'];
    if (f.maxLength) decs.push(`@MaxLength(${f.maxLength})`);
    return decs;
  },
  'rich-text': () => ['@IsString()'],
  number: (f) => {
    const decs = ['@IsNumber()'];
    if (f.min !== undefined) decs.push(`@Min(${f.min})`);
    if (f.max !== undefined) decs.push(`@Max(${f.max})`);
    return decs;
  },
  boolean: () => ['@IsBoolean()'],
  date: () => ['@IsString()'],
  datetime: () => ['@IsString()'],
  email: () => ['@IsEmail()'],
  phone: () => ['@IsString()', '@Matches(/^\\\\+?[\\d\\s\\-()]+$/)'],
  url: () => ['@IsUrl()'],
  password: (f) => {
    const decs = ['@IsString()'];
    if (f.minLength) decs.push(`@MinLength(${f.minLength})`);
    if (f.maxLength) decs.push(`@MaxLength(${f.maxLength})`);
    return decs;
  },
  color: () => ['@IsString()', '@Matches(/^#[0-9A-Fa-f]{6}$/)'],
  select: (f) => {
    if (f.options?.length) {
      const values = f.options.map((o) => `'${o.value}'`).join(', ');
      return ['@IsString()', `@IsIn([${values}])`];
    }
    return ['@IsString()'];
  },
  json: () => ['@IsOptional()', '@IsObject()'],
  file: () => ['@IsString()'],
  image: () => ['@IsString()'],
};

function pascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

function toTsType(field: ScFieldConfigDto): string {
  return TS_TYPE_MAP[field.type] || 'string';
}

@Injectable()
export class ScGeneratorService {
  private readonly logger = new Logger(ScGeneratorService.name);

  constructor(
    @InjectRepository(ScModule)
    private readonly scModuleRepository: Repository<ScModule>,
  ) {}

  async generate(config: CreateScModuleDto & { id: number }): Promise<{
    files: string[];
    modulePath: string;
  }> {
    const name = config.name;
    const Pascal = pascalCase(name);
    const moduleDir = path.join(GENERATED_DIR, `sc_${name}`);

    const files: string[] = [];

    // Write each template
    const templates: [string, string][] = [
      [`entities/${name}.entity.ts`, this.genEntity(name, Pascal, config)],
      [`controllers/${name}.controller.ts`, this.genController(name, Pascal, config)],
      [`services/${name}.service.ts`, this.genService(name, Pascal, config)],
      [`dto/create-${name}.dto.ts`, this.genCreateDto(name, Pascal, config)],
      [`dto/update-${name}.dto.ts`, this.genUpdateDto(name, Pascal, config)],
      [`dto/query-${name}.dto.ts`, this.genQueryDto(name, Pascal, config)],
      [`${name}.module.ts`, this.genModule(name, Pascal, config)],
    ];

    for (const [relPath, content] of templates) {
      const fullPath = path.join(moduleDir, relPath);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fullPath, content, 'utf-8');
      files.push(fullPath);
      this.logger.log(`Generated: ${relPath}`);
    }

    // Compile .ts → .js
    for (const filePath of files) {
      this.compileTsFile(filePath);
    }

    // Auto-restart
    this.logger.log('Generation complete — restarting server in 500ms...');
    setTimeout(() => process.exit(0), 500);

    return { files, modulePath: moduleDir };
  }

  private compileTsFile(filePath: string): void {
    const source = fs.readFileSync(filePath, 'utf-8');
    const result = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2023,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        esModuleInterop: true,
        resolveJsonModule: true,
      },
    });
    const jsPath = filePath.replace(/\.ts$/, '.js');
    fs.writeFileSync(jsPath, result.outputText);
  }

  private genEntity(name: string, Pascal: string, config: CreateScModuleDto): string {
    const imports = new Set<string>(['Entity', 'PrimaryGeneratedColumn', 'Column', 'CreateDateColumn', 'UpdateDateColumn']);
    const columns: string[] = [];
    const relations: string[] = [];

    for (const f of config.fields) {
      const colConfig = COLUMN_MAP[f.type]?.(f) || `{ type: 'varchar', length: 255 }`;
      const nullable = f.required ? '' : ', nullable: true';
      const def = f.defaultValue !== undefined ? `, default: ${JSON.stringify(f.defaultValue)}` : '';
      const tsType = toTsType(f);

      columns.push(
        `  @Column({ ${colConfig}${nullable}${def} })\n  ${f.name}: ${tsType};`,
      );
    }

    if (config.relations) {
      for (const r of config.relations) {
        const targetPascal = pascalCase(r.targetModule);
        const targetFile = `./${r.targetModule}.entity`;

        imports.add('ManyToOne');
        imports.add('JoinColumn');
        if (r.type === 'many-to-many') {
          imports.add('ManyToMany');
          imports.add('JoinTable');
        }
        if (r.type === 'one-to-many') {
          imports.add('OneToMany');
        }

        if (r.type === 'many-to-one') {
          relations.push(
            `  @ManyToOne(() => ${targetPascal}, (${targetPascal.toLowerCase()}) => ${targetPascal.toLowerCase()}.${name}s)\n  @JoinColumn({ name: '${r.name}Id' })\n  ${r.name}: ${targetPascal};`,
          );
        } else if (r.type === 'many-to-many') {
          relations.push(
            `  @ManyToMany(() => ${targetPascal})\n  @JoinTable({ name: '${r.joinTable || `${name}_${r.targetModule}`}' })\n  ${r.name}: ${targetPascal}[];`,
          );
        } else if (r.type === 'one-to-many') {
          relations.push(
            `  @OneToMany(() => ${targetPascal}, (${targetPascal.toLowerCase()}) => ${targetPascal.toLowerCase()}.${name})\n  ${r.name}: ${targetPascal}[];`,
          );
        }
      }
    }

    const importList = Array.from(imports).sort().join(', ');
    const relationImports = config.relations?.length
      ? `import { ${Array.from(imports).filter((i) => ['ManyToOne', 'ManyToMany', 'OneToMany', 'JoinColumn', 'JoinTable'].includes(i)).sort().join(', ')} } from 'typeorm';`
      : '';

    const entityImports = `import { ${importList} } from 'typeorm';`;

    const allColumns = [...columns, ...relations].join('\n\n');

    return `// Auto-generated by System Creators — do not edit manually
${entityImports}
${relationImports ? '\n' + relationImports : ''}

@Entity('${name}')
export class ${Pascal} {
  @PrimaryGeneratedColumn()
  id: number;

${allColumns}

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
`;
  }

  private genController(name: string, Pascal: string, config: CreateScModuleDto): string {
    const hasFileFields = config.fields.some((f) => f.type === 'file' || f.type === 'image');

    const uploadImport = hasFileFields
      ? `\nimport { FileInterceptor } from '@nestjs/platform-express';\nimport { memoryStorage } from 'multer';`
      : '';
    const uploadDecorator = hasFileFields
      ? `
  @Post('upload')
  @Permissions('${config.label} Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Save to server/storage/generated/${name}/
    // Return { url: '/api/storage/generated/${name}/' + file.originalname }
  }`
      : '';

    const useInterceptorsImport = hasFileFields ? ', UseInterceptors, UploadedFile' : '';

    return `// Auto-generated by System Creators — do not edit manually
import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, ParseIntPipe${useInterceptorsImport} } from '@nestjs/common';${uploadImport}
import { ${Pascal}Service } from '../services/${name}.service';
import { Create${Pascal}Dto } from '../dto/create-${name}.dto';
import { Update${Pascal}Dto } from '../dto/update-${name}.dto';
import { Query${Pascal}Dto } from '../dto/query-${name}.dto';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('generated/${name}')
export class ${Pascal}Controller {
  constructor(private readonly service: ${Pascal}Service) {}

  @Get()
  @Permissions('${config.label} Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findAll(@Query() query: Query${Pascal}Dto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions('${config.label} Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Permissions('${config.label} Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  create(@Body() dto: Create${Pascal}Dto, @Request() req) {
    return this.service.create(dto, req);
  }

  @Put(':id')
  @Permissions('${config.label} Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Update${Pascal}Dto, @Request() req) {
    return this.service.update(id, dto, req);
  }

  @Delete(':id')
  @Permissions('${config.label} Management', 'Full Access')
  @Roles('Admin', 'Super Admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.service.remove(id, req);
  }${uploadDecorator}
}
`;
  }

  private genService(name: string, Pascal: string, config: CreateScModuleDto): string {
    const searchableFields = config.fields.filter((f) => f.searchable).map((f) => f.name);
    const sortableFields = config.fields.filter((f) => f.sortable).map((f) => f.name);
    const allSortable = ['id', ...sortableFields, 'createdAt', 'updatedAt'];

    const relationFields = config.relations?.filter((r) => r.type === 'many-to-many' || r.type === 'one-to-many') || [];
    const joinLeftSelects = relationFields.map((r) => `.leftJoinAndSelect('${name}.${r.name}', '${r.name}')`).join('\n      ');

    const createFields = config.fields
      .filter((f) => f.type !== 'file' && f.type !== 'image')
      .map((f) => {
        if (f.type === 'json') return `      ${f.name}: dto.${f.name} ? JSON.stringify(dto.${f.name}) : undefined,`;
        return `      ${f.name}: dto.${f.name},`;
      })
      .join('\n');

    const updateFields = config.fields
      .filter((f) => f.type !== 'file' && f.type !== 'image')
      .map((f) => {
        if (f.type === 'json') {
          return `    if (dto.${f.name} !== undefined) mod.${f.name} = dto.${f.name} ? JSON.stringify(dto.${f.name}) : undefined;`;
        }
        return `    if (dto.${f.name}) mod.${f.name} = dto.${f.name};`;
      })
      .join('\n');

    return `// Auto-generated by System Creators — do not edit manually
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${Pascal} } from '../entities/${name}.entity';
import { Create${Pascal}Dto } from '../dto/create-${name}.dto';
import { Update${Pascal}Dto } from '../dto/update-${name}.dto';
import { Query${Pascal}Dto } from '../dto/query-${name}.dto';
import { ActivityLogsService } from '@/modules/activity-logs/services/activity-logs.service';

@Injectable()
export class ${Pascal}Service {
  constructor(
    @InjectRepository(${Pascal})
    private readonly repo: Repository<${Pascal}>,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async findAll(query: Query${Pascal}Dto) {
    const { page = 1, limit = 20, search, searchField, sortBy, sortOrder } = query;
    const qb = this.repo.createQueryBuilder('${name}');

    ${joinLeftSelects ? `qb${joinLeftSelects.startsWith('\n') ? '' : '\n      '}${joinLeftSelects};` : ''}

    if (search && searchField) {
      const allowed = Query${Pascal}Dto.searchableFields;
      if (allowed.includes(searchField)) {
        qb.where(\`${name}.\${searchField} LIKE :search\`, { search: \`%\${search}%\` });
      }
    } else if (search) {
      const conditions = Query${Pascal}Dto.searchableFields.map(
        (f) => \`${name}.\${f} LIKE :search\`,
      );
      qb.where(\`(\${conditions.join(' OR ')})\`, { search: \`%\${search}%\` });
    }

    const sortable = Query${Pascal}Dto.sortableFields;
    const field = sortBy && sortable.includes(sortBy) ? \`${name}.\${sortBy}\` : '${name}.id';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(field, order)
      .getManyAndCount();

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const mod = await this.repo.findOne({ where: { id } });
    if (!mod) throw new NotFoundException('${Pascal} not found');
    return mod;
  }

  async create(dto: Create${Pascal}Dto, req?: any) {
    const mod = this.repo.create({
${createFields}
    });
    const saved = await this.repo.save(mod);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'CREATE',
      entity: '${Pascal}',
      entityId: saved.id,
      description: \`Created ${name} \${saved.id}\`,
      metadata: { id: saved.id },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return saved;
  }

  async update(id: number, dto: Update${Pascal}Dto, req?: any) {
    const mod = await this.repo.findOne({ where: { id } });
    if (!mod) throw new NotFoundException('${Pascal} not found');

${updateFields}

    const saved = await this.repo.save(mod);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'UPDATE',
      entity: '${Pascal}',
      entityId: saved.id,
      description: \`Updated ${name} \${saved.id}\`,
      metadata: { id: saved.id },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return saved;
  }

  async remove(id: number, req?: any) {
    const mod = await this.repo.findOne({ where: { id } });
    if (!mod) throw new NotFoundException('${Pascal} not found');

    await this.repo.remove(mod);

    await this.activityLogsService.log({
      userId: req?.user?.sub,
      action: 'DELETE',
      entity: '${Pascal}',
      entityId: id,
      description: \`Deleted ${name} \${id}\`,
      metadata: { id },
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
  }
}
`;
  }

  private genCreateDto(name: string, Pascal: string, config: CreateScModuleDto): string {
    const imports = new Set<string>(['IsString', 'IsOptional']);
    const fields: string[] = [];

    for (const f of config.fields) {
      const validators = VALIDATOR_MAP[f.type]?.(f) || ['@IsString()'];
      const tsType = toTsType(f);
      const optional = f.required ? '' : '@IsOptional()\n  ';
      const nullable = f.required ? '' : '?';

      for (const v of validators) {
        const match = v.match(/@(\w+)/);
        if (match) imports.add(match[1]);
      }

      fields.push(
        `  ${optional}${validators.join('\n  ')}\n  ${f.name}${nullable}: ${tsType};`,
      );
    }

    const importList = Array.from(imports).sort().join(', ');

    return `// Auto-generated by System Creators — do not edit manually
import { ${importList} } from 'class-validator';

export class Create${Pascal}Dto {
${fields.join('\n\n')}
}
`;
  }

  private genUpdateDto(name: string, Pascal: string, config: CreateScModuleDto): string {
    return `// Auto-generated by System Creators — do not edit manually
import { PartialType } from '@nestjs/mapped-types';
import { Create${Pascal}Dto } from './create-${name}.dto';

export class Update${Pascal}Dto extends PartialType(Create${Pascal}Dto) {}
`;
  }

  private genQueryDto(name: string, Pascal: string, config: CreateScModuleDto): string {
    const sortableFields = ['id', ...config.fields.filter((f) => f.sortable).map((f) => f.name), 'createdAt', 'updatedAt'];
    const searchableFields = config.fields.filter((f) => f.searchable).map((f) => f.name);

    return `// Auto-generated by System Creators — do not edit manually
import { QueryDto } from '@/common/dto/query.dto';

export class Query${Pascal}Dto extends QueryDto {
  static readonly sortableFields = [${sortableFields.map((f) => `'${f}'`).join(', ')}];
  static readonly searchableFields = [${searchableFields.map((f) => `'${f}'`).join(', ')}];
}
`;
  }

  private genModule(name: string, Pascal: string, config: CreateScModuleDto): string {
    return `// Auto-generated by System Creators — do not edit manually
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${Pascal} } from './entities/${name}.entity';
import { ${Pascal}Controller } from './controllers/${name}.controller';
import { ${Pascal}Service } from './services/${name}.service';
import { ActivityLogsModule } from '@/modules/activity-logs/activity-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([${Pascal}]), ActivityLogsModule],
  controllers: [${Pascal}Controller],
  providers: [${Pascal}Service],
  exports: [${Pascal}Service],
})
export class ${Pascal}Module {}
`;
  }
}
