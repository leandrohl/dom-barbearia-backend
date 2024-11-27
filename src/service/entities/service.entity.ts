import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ServiceEmployee } from './service-employee.entity';
import { OrderItem } from '../../command/entities/order-item.entity';

@Entity({ name: 'Servico' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  descricao: string;

  @Column('float')
  preco: number;

  @Column()
  ativo: boolean;

  @OneToMany(
    () => ServiceEmployee,
    (serviceEmployee) => serviceEmployee.servico,
  )
  servicoFuncionario: ServiceEmployee[];

  @OneToMany(() => OrderItem, (item) => item.servico, { cascade: true })
  items: OrderItem[];
}
