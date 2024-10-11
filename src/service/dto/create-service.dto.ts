import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  descricao: string;

  @IsNotEmpty()
  @IsPositive()
  preco: number;
}
