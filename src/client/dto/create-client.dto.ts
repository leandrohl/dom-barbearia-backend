import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  telefone: string;

  @IsNotEmpty()
  dataAniversario: string;

  @IsNotEmpty()
  cpf: string;

  @IsNotEmpty()
  endereco: string;

  @IsNotEmpty()
  bairro: string;

  @IsNotEmpty()
  cidade: string;

  @IsNotEmpty()
  profissao: string;

  @IsNotEmpty()
  observacao: string;
}
