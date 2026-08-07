import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Permission } from '@/modules/permissions/entities/permission.entity';

@Entity('permission_methods')
export class PermissionMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Permission, (permission) => permission.methods, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @Column()
  method: string;

  @CreateDateColumn()
  createdAt: Date;
}
