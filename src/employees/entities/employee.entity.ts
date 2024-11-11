import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ServiceEmployee } from '../../service/entities/service-employee.entity';
import { OrderItem } from '../../command/entities/order-item.entity';

@Entity({ name: 'Funcionario' })
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 20 })
  telefone: string;

  @Column({ length: 14 })
  cpf: string;

  @Column({ type: 'date' })
  dataContratacao: Date;

  @Column()
  ativo: boolean;

  @OneToMany(
    () => ServiceEmployee,
    (serviceEmployee) => serviceEmployee.funcionario,
  )
  serviceEmployee: ServiceEmployee[];

  @OneToMany(() => OrderItem, (item) => item.funcionario, { cascade: true })
  items: OrderItem[];
}
