import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Service } from '../../service/entities/service.entity';

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

  @ManyToMany(() => Service, (servico) => servico.funcionarios)
  servicos: Service[];
}
