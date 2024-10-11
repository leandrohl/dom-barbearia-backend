import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  telefone: string;

  @IsNotEmpty()
  dataContratacao: string;

  @IsNotEmpty()
  cpf: string;

  @IsBoolean()
  ativo: boolean;
}
