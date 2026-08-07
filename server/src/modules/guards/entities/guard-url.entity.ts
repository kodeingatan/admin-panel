import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Guard } from '@/modules/guards/entities/guard.entity';

@Entity('guard_urls')
export class GuardUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Guard, (guard) => guard.urls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guardId' })
  guard: Guard;

  @Column()
  url: string;

  @Column({ type: 'varchar', length: 10 })
  type: 'allow' | 'deny';

  @CreateDateColumn()
  createdAt: Date;
}
