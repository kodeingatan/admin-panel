import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Role } from '@/modules/roles/entities/role.entity';
import { GuardUrl } from '@/modules/guards/entities/guard-url.entity';

@Entity('guards')
export class Guard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  guardName: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.guards)
  roles: Role[];

  @OneToMany(() => GuardUrl, (gu) => gu.guard, { eager: true })
  urls: GuardUrl[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
