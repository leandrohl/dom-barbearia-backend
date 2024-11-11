import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Command } from './entities/command.entity';
import { Between, Repository } from 'typeorm';
import { CreateCommandDto } from './dto/create-Command.dto';
import { OrderItem } from './entities/order-item.entity';
import { UpdateCommandDto } from './dto/update-command.dto';
import { Service } from '../service/entities/service.entity';
import { Product } from '../product/entities/product.entity';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class CommandService {
  constructor(
    @InjectRepository(Command)
    private readonly commandRepository: Repository<Command>,

    @InjectRepository(OrderItem)
    private readonly itemsRepository: Repository<OrderItem>,
  ) {}

  findAll(): Promise<Command[]> {
    return this.commandRepository.find({
      relations: ['cliente'],
    });
  }

  async findAllWithStatistics(
    startDate: string,
    endDate: string,
    employeeId?: string,
  ): Promise<any[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let commands = await this.commandRepository.find({
      where:
        startDate && endDate
          ? {
              dataLancamento: Between(start, end),
            }
          : {},
      relations: ['cliente', 'items', 'items.funcionario'],
    });

    if (employeeId) {
      commands = commands.filter((command) =>
        command.items.find(
          (item) => item.funcionario.id === Number(employeeId),
        ),
      );
    }

    // const data = employees.map((employee) => {
    //   let totalBilling = 0;
    //   let totalCommands = 0;
    //   const newClients = new Set<any>();

    //   const classificationCounts = {
    //     Excelente: 0,
    //     Otimo: 0,
    //     Regular: 0,
    //     Ruim: 0,
    //   };

    //   const countedClients = new Set<number>();

    //   commands.forEach((command) => {
    //     const hasEmployee = command.items.some(
    //       (item) => item.funcionario && item.funcionario.id === employee.id,
    //     );

    //     if (hasEmployee) {
    //       totalCommands += 1;
    //       totalBilling += command.items.reduce((sum, item) => {
    //         return sum + item.valor;
    //       }, 0);

    //       const client = command.cliente;
    //       const clientFound = clients.find((c) => c.id === client.id);

    //       const isNewClient = clientFound.comandas.length === 1;
    //       if (isNewClient) {
    //         newClients.add(client);
    //       }

    //       const lastVisit = verifyLastVisit(clientFound);

    //       const classification = clientClassification(lastVisit);

    //       if (!countedClients.has(clientFound.id)) {
    //         classificationCounts[classification] += 1;
    //         countedClients.add(clientFound.id);
    //       }
    //     }
    //   });

    //   return {
    //     id: employee.id,
    //     nome: employee.nome,
    //     faturamentoTotal: totalBilling,
    //     totalComandas: totalCommands,
    //     clientesNovos: newClients.size,
    //     classificacaoDosClientes: classificationCounts,
    //   };
    // });

    return commands;
  }

  async findOne(id: number): Promise<Command | null> {
    const command = await this.commandRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });

    const orderItems = await this.itemsRepository.find({
      where: { comanda: { id: command.id } },
      relations: ['produto', 'servico', 'funcionario'],
    });

    command.items = orderItems;

    return command;
  }

  async update(id: number, updateCommandDto: UpdateCommandDto) {
    const { clienteId, items } = updateCommandDto;

    const command = await this.commandRepository.findOneBy({ id });

    if (!command) {
      return null;
    }

    this.commandRepository.merge(command, {
      cliente: { id: clienteId },
    });

    await this.commandRepository.save(command);

    if (items.length > 0) {
      await this.itemsRepository.delete({ comanda: { id: command.id } });

      const commandItens = items.map((item) => {
        const ordemItem = new OrderItem();
        ordemItem.tipo = item.tipo;
        ordemItem.quantidade = item.quantidade;
        ordemItem.valor = item.valor;
        ordemItem.comanda = command;
        ordemItem.servico = { id: item.servicoId } as Service;
        ordemItem.produto = { id: item.produtoId } as Product;
        ordemItem.funcionario = { id: item.funcionarioId } as Employee;

        return ordemItem;
      });

      await this.itemsRepository.save(commandItens);
    }

    return command;
  }

  async create(createCommandDto: CreateCommandDto) {
    const { clienteId, items } = createCommandDto;

    const command = this.commandRepository.create({
      dataLancamento: new Date(),
      cliente: { id: clienteId },
    });

    const savedCommand = await this.commandRepository.save(command);

    const orderItems = items.map((item) => {
      const newItem = this.itemsRepository.create({
        quantidade: item.quantidade,
        tipo: item.tipo,
        valor: item.valor,
        comanda: savedCommand,
        servico: { id: item.servicoId },
        produto: { id: item.produtoId },
        funcionario: { id: item.funcionarioId },
      });
      return newItem;
    });

    await this.itemsRepository.save(orderItems);

    return savedCommand;
  }

  async remove(id: number): Promise<void> {
    await this.commandRepository.delete(id);
  }
}
