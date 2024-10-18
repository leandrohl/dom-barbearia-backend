import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ServiceEmployee } from './service-employee.entity';

@Entity({ name: 'Servico' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  descricao: string;

  @Column('float')
  preco: number;

  @OneToMany(
    () => ServiceEmployee,
    (serviceEmployee) => serviceEmployee.servico,
  )
  servicoFuncionario: ServiceEmployee[];
}
