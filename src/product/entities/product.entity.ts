import { OrderItem } from '../../command/entities/order-item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'Produto' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  descricao: string;

  @Column('float')
  preco: number;

  @Column()
  quantidade: number;

  @OneToMany(() => OrderItem, (item) => item.produto, { cascade: true })
  items: OrderItem[];
}
