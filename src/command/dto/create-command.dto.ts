import { IsArray, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCommandDto {
  @IsNotEmpty()
  @IsPositive()
  clienteId: number;

  @IsArray()
  items: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  @IsPositive()
  quantidade?: number;

  @IsNotEmpty()
  tipo: string;

  @IsNotEmpty()
  valor: number;

  @IsPositive()
  funcionarioId?: number;

  @IsPositive()
  @IsInt()
  produtoId?: number;

  @IsPositive()
  @IsInt()
  servicoId?: number;
}
