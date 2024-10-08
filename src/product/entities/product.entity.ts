import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
