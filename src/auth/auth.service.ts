/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { compareSync, hashSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { MailService } from '../services/mail.service';
import { generateToken } from '../utils/generateToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        nome: user.nome,
        perfil: user.perfil,
      },
    };
  }

  async validateUser(email: string, password: string) {
    let user: User;
    try {
      user = await this.userService.findOneByEmail(email);
    } catch {
      return null;
    }

    const isPasswordValid = compareSync(password, user.senha);

    if (!isPasswordValid) return null;

    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = generateToken();

      try {
        await this.userService.savePasswordResetToken(
          user.id,
          resetToken,
          expiryDate,
        );
      } catch (err: any) {
        throw new Error('Erro ao salvar o token de redefinição de senha');
      }

      this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    return { message: 'If this user exists, they will receive an email' };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    const token = await this.userService.findOneAndDeleteResetToken(resetToken);

    const user = await this.userService.findOne(token.id);
    if (!user) {
      throw new InternalServerErrorException();
    }

    user.senha = await hashSync(newPassword, 10);
    await this.userService.update(user.id, user);

    return { message: 'Senha alterada com sucesso!' };
  }
}
