import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Matches,
} from 'class-validator';
import { MessagesHelper } from '../../helpers/messages.helper';
import { RegExHelper } from '../../helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'O email fornecido não é válido.' })
  email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.password, {
    message: MessagesHelper.PASSWORD_VALID,
  })
  senha: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  perfil: number;
}
