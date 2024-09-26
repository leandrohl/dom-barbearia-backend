import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  descricao: string;

  @Column('float')
  preco: number;

  @ManyToMany(() => Employee, (funcionario) => funcionario.servicos)
  funcionarios: Employee[];
}
