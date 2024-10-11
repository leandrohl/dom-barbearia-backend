import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  descricao: string;

  @IsNotEmpty()
  @IsPositive()
  preco: number;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  quantidade: number;
}
