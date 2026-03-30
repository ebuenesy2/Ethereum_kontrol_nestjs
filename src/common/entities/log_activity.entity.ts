import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterLoad,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { UsersEntity } from './users.entity';

@Entity('ms_log_activities')
export class LogActivityEntity {
  createQueryBuilder(error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Bilinmeyen hata';
    throw new Error(`Method not implemented. failed: ${errorMessage}`);
  }
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  user_id: number;

  @AfterLoad()
  convertIds() {
    this.id = Number(this.id);
    this.user_id = Number(this.user_id);
  }

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'varchar', nullable: false })
  entity: string;

  @Column({ type: 'varchar', nullable: false })
  action: string;

  @Column({ type: 'bigint', nullable: false })
  db_id: number;

  @Column({ type: 'longtext', nullable: false })
  subject: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  method: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ip: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  agent: string;

  @Column({ type: 'longtext', nullable: true })
  details: string;

  // 🔹 created_at varsayılan olarak CURRENT_TIMESTAMP
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  // 🔹 updated_at başlangıçta NULL olacak
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  updated_at: Date;

  // 🔹 deleted_at başlangıçta NULL olacak
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  deleted_at: Date;

  @ManyToOne(() => UsersEntity, (user) => user.logs)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
