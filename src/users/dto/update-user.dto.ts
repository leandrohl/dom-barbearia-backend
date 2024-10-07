import { IsEmail, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'O email fornecido não é válido.' })
  email: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  perfil: number;
}
