import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { RabbitEnum } from '../enum/rabbit-action';

@Entity('ms_transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true, name: 'type' })
  type?: string;

  @Column({ type: 'int', default: 1, name: 'type_dbid' })
  type_dbid: number;

  // --------------------------------------------------
  // Job
  // --------------------------------------------------

  @Column({ type: 'text', nullable: true })
  jobId?: string;

  @Column({ type: 'text', nullable: true })
  transactionId_scanner?: string;

  @Column({ type: 'text', nullable: true })
  transactionId?: string;

  @Column({ length: 50 })
  transactionDate?: string;

  @Column({ length: 50 })
  transactionIPAddress?: string;

  // --------------------------------------------------
  // Customer
  // --------------------------------------------------
  @Column({ length: 255, nullable: true })
  customer_name?: string;

  @Column({ length: 255, nullable: true })
  customer_number?: string;

  @Column({ length: 255, nullable: true })
  customer_email?: string;

  @Column({ type: 'text', default: 1 })
  transaction_type: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  detail?: string;

  // --------------------------------------------------
  // Status
  // --------------------------------------------------
  @Column({ length: 50 })
  status: string;

  @Column({ type: 'enum', enum: RabbitEnum, nullable: true })
  statusJob?: RabbitEnum;

  // --------------------------------------------------
  // Zaman
  // --------------------------------------------------
  @Column({ type: 'int', nullable: true })
  requestedTime: number;

  @Column({ type: 'text' })
  requestedAt: string;

  // --------------------------------------------------
  // Scanner
  // --------------------------------------------------
  @Column({ type: 'int', nullable: true })
  totalScore?: number;

  @Column({ type: 'text', nullable: true })
  triggeredAlarm?: string;

  // --------------------------------------------------
  // User
  // --------------------------------------------------
  @Column({ type: 'int', nullable: true })
  created_byId?: number;

  // --------------------------------------------------
  // Sistem
  // --------------------------------------------------
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'tinyint', default: 0 })
  isUpdated: number;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at?: Date;

  @Column({ type: 'int', nullable: true })
  updated_byId?: number;

  @Column({ type: 'tinyint', default: 1 })
  isActive: number;

  @Column({ type: 'tinyint', default: 0 })
  isDeleted: number;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'int', nullable: true })
  deleted_byId?: number;

  // --------------------------------------------------
  // Fiyat
  // --------------------------------------------------
  @Column({ length: 50 })
  amount?: string;

  @Column({ length: 50 })
  sendAmount?: string;

  @Column({ length: 50 })
  receiveAmount?: string;

  @Column({ length: 50 })
  fee?: string;

  // --------------------------------------------------
  // Transaction Adres Bilgileri
  // --------------------------------------------------
  @Column({ length: 50 })
  transaction_adress?: string;

  @Column({ length: 50 })
  transaction_adress_control?: string;

  @Column({ length: 50 })
  transaction_adress_at?: string;
}
