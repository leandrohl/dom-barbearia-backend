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
import { Client } from '../client/entities/client.entity';
import { clientClassification, verifyLastVisit } from '../utils/classification';

@Injectable()
export class CommandService {
  constructor(
    @InjectRepository(Command)
    private readonly commandRepository: Repository<Command>,

    @InjectRepository(OrderItem)
    private readonly itemsRepository: Repository<OrderItem>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
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
  ): Promise<any> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setDate(end.getDate() + 1);

    const clients = await this.clientRepository.find({
      relations: ['comandas'],
    });

    let commands = await this.commandRepository.find({
      where:
        startDate && endDate
          ? {
              dataLancamento: Between(start, end),
            }
          : {},
      relations: [
        'cliente',
        'items',
        'items.funcionario',
        'items.produto',
        'items.servico',
      ],
    });

    if (employeeId) {
      commands = commands.filter((command) =>
        command.items.find(
          (item) =>
            item.tipo === 'S' && item.funcionario.id === Number(employeeId),
        ),
      );
    }

    const newClients = new Set<any>();
    const classificationCounts = {
      Excelente: 0,
      Otimo: 0,
      Regular: 0,
      Ruim: 0,
    };
    const countedClients = new Set<number>();
    let productRevenue = 0;
    let serviceRevenue = 0;
    let totalRevenue = 0;

    commands.forEach((command) => {
      const client = command.cliente;
      const clientFound = clients.find((c) => c.id === client.id);

      const lastVisit = verifyLastVisit(clientFound);

      const classification = clientClassification(lastVisit);

      if (!countedClients.has(clientFound.id)) {
        const isNewClient = clientFound.comandas.length === 1;

        if (isNewClient) {
          newClients.add(client);
        }

        classificationCounts[classification] += 1;
        countedClients.add(clientFound.id);
      }

      command.items.forEach((item) => {
        if (item.tipo === 'P') {
          productRevenue += item.valor * item.quantidade;
        }
        if (item.tipo === 'S') {
          serviceRevenue += item.valor;
        }
      });
    });

    const newVsReturningClients = {
      novos: newClients.size,
      retorno: countedClients.size - newClients.size,
    };

    totalRevenue = productRevenue + serviceRevenue;

    return {
      novosRetornos: newVsReturningClients,
      classificacaoDosClientes: classificationCounts,
      faturamento: {
        produtos: productRevenue,
        servicos: serviceRevenue,
        total: totalRevenue,
      },
    };
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
