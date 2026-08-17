import { Module, DynamicModule } from '@nestjs/common';

@Module({})
export class GeneratedModulesModule {
  static forRoot(modules: any[]): DynamicModule {
    if (!modules.length) {
      return { module: GeneratedModulesModule, imports: [], exports: [] };
    }
    return {
      module: GeneratedModulesModule,
      imports: modules,
      exports: modules,
    };
  }
}
