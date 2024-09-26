import { Profile } from '../../profile/entities/profile.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
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

  @ManyToOne(() => Profile, (perfil) => perfil.usuarios)
  perfil: Profile;

  @BeforeInsert()
  hashPassword() {
    this.senha = hashSync(this.senha, 10);
  }
}
