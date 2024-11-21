import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '10442222130@unoeste.edu.br',
        pass: 'AlunoCloud@2024',
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: 'Serviço de Autenticação',
      to: to,
      subject: 'Solicitação de Redefinição de Senha',
      html: `<p>Você solicitou uma redefinição de senha. Clique no link abaixo para redefinir sua senha:</p><p><a href="${resetLink}">Redefinir senha</a></p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
