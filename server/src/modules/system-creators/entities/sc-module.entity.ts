import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sc_modules')
export class ScModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  label: string;

  @Column()
  routePath: string;

  @Column()
  menuLabel: string;

  @Column({ default: 'admin' })
  accessLevel: string;

  @Column({ type: 'text', nullable: true })
  accessRoles: string | undefined;

  @Column({ type: 'text', nullable: true })
  accessPermissions: string | undefined;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text' })
  fieldsConfig: string;

  @Column({ type: 'text', nullable: true })
  relationsConfig: string | undefined;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
