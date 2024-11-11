import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Command } from './command.entity';
import { Service } from '../../service/entities/service.entity';
import { Product } from '../../product/entities/product.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('itemsdacomanda')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantidade: number;

  @Column({ type: 'char', length: 1 })
  tipo: string;

  @Column({ type: 'float' })
  valor: number;

  @ManyToOne(() => Command, (command) => command.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comanda_id' })
  comanda: Command;

  @ManyToOne(() => Service, (service) => service.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'servico_id' })
  servico: Service;

  @ManyToOne(() => Product, (product) => product.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produto_id' })
  produto: Product;

  @ManyToOne(() => Employee, (employee) => employee.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'funcionario_id' })
  funcionario: Employee;
}
