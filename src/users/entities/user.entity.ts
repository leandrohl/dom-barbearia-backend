import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { hashSync } from 'bcrypt';

@Entity({ name: 'Usuario' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null;

  @BeforeInsert()
  hashPassword() {
    this.senha = hashSync(this.senha, 10);
  }

  @Column({ name: 'perfilId' })
  perfil: number;
}
