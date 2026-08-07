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
import { PermissionMethod } from '@/modules/permissions/entities/permission-method.entity';
import { PermissionUrl } from '@/modules/permissions/entities/permission-url.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  permissionName: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @OneToMany(() => PermissionMethod, (pm) => pm.permission, { eager: true })
  methods: PermissionMethod[];

  @OneToMany(() => PermissionUrl, (pu) => pu.permission, { eager: true })
  urls: PermissionUrl[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
