import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guard } from '@/modules/guards/entities/guard.entity';
import { GuardUrl } from '@/modules/guards/entities/guard-url.entity';
import { GuardsController } from '@/modules/guards/controllers/guards.controller';
import { GuardsService } from '@/modules/guards/services/guards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Guard, GuardUrl])],
  controllers: [GuardsController],
  providers: [GuardsService],
  exports: [GuardsService],
})
export class GuardsModule {}
