import { Client } from '../../client/entities/client.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('comanda')
export class Command {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  dataLancamento: Date;

  @ManyToOne(() => Client, (client) => client)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Client;

  @OneToMany(() => OrderItem, (item) => item.comanda)
  items: OrderItem[];
}
