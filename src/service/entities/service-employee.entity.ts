import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './service.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('servico_funcionario')
export class ServiceEmployee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Service, (service) => service.servicoFuncionario)
  @JoinColumn({ name: 'servico_id' })
  servico: Service;

  @ManyToOne(() => Employee, (employee) => employee.serviceEmployee)
  @JoinColumn({ name: 'funcionario_id' })
  funcionario: Employee;
}
