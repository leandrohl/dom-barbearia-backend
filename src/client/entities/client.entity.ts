import { Command } from '../../command/entities/command.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'Cliente' })
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 50, nullable: true })
  telefone: string;

  @Column({ type: 'date' })
  dataAniversario: Date;

  @Column({ length: 14 })
  cpf: string;

  @Column({ length: 100, nullable: true })
  endereco: string;

  @Column({ length: 100, nullable: true })
  bairro: string;

  @Column({ length: 100, nullable: true })
  cidade: string;

  @Column({ length: 100, nullable: true })
  profissao: string;

  @Column({ length: 200, nullable: true })
  observacao: string;

  @OneToMany(() => Command, (command) => command.cliente)
  comandas: Command[];
}
