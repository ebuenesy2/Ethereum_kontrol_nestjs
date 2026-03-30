import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterLoad,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { LogActivityEntity } from './log_activity.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @AfterLoad()
  convertIds() {
    this.id = Number(this.id);
  }

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ length: 255, nullable: true })
  confirm_email_token: string;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at: Date | null;

  @Column({ length: 100, nullable: true })
  remember_token: string;

  @Column({ type: 'tinyint', default: 0 })
  level: number;

  @Column({ type: 'tinyint', nullable: true })
  new_level_request: number;

  @Column({ type: 'timestamp', nullable: true })
  new_level_request_datetime: Date;

  @Column({ type: 'tinyint', nullable: true })
  is_phone_verified: number;

  @Column({ type: 'tinyint', nullable: true })
  is_2fa: number;

  @Column({ length: 255, nullable: true })
  google2fa_secret: string;

  @Column({ type: 'tinyint', nullable: true })
  identity_verified: number;

  @Column({ type: 'tinyint', nullable: true })
  documents_verified: number;

  @Column({ length: 255, nullable: true })
  phishing_code: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @Column({ type: 'tinyint', nullable: true })
  blocked_24h: number;

  @Column({ type: 'datetime', nullable: true })
  blocked_24h_started: Date;

  @Column({ type: 'int', nullable: true })
  commission_rate_id: number;

  @Column({ type: 'tinyint', nullable: true })
  accessOTC: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  referral_code_id: number;

  @Column({ type: 'bigint', nullable: true })
  referer_id: number;

  @Column({ type: 'int', nullable: true })
  otc_group_id: number;

  @Column({ type: 'int', nullable: true })
  otc_group_referral_id: number;

  @Column({ type: 'tinyint', nullable: true })
  risk_disclosure_accepted: number;

  @Column({ type: 'timestamp', nullable: true })
  risk_disclosure_date: Date;

  @Column({ length: 255, nullable: true })
  device_id: string;

  @Column({ length: 255, nullable: true })
  register_channel: string;

  @Column({ type: 'int', nullable: true })
  sanction_found: number;

  @Column({ length: 255, nullable: true })
  sanction_reason: string;

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

  @OneToMany(() => LogActivityEntity, (logs) => logs.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'user_id' })
  logs: LogActivityEntity[];
}
