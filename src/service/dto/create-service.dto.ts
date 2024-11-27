import { IsArray, IsBoolean, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  descricao: string;

  @IsNotEmpty()
  @IsPositive()
  preco: number;

  @IsBoolean()
  ativo: boolean;

  @IsArray()
  funcionarios: number[];
}
