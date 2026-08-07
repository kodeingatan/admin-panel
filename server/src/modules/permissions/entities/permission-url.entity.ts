import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Permission } from '@/modules/permissions/entities/permission.entity';

@Entity('permission_urls')
export class PermissionUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Permission, (permission) => permission.urls, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;
}
