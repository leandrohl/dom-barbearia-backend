import { IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  nome: string;
}
