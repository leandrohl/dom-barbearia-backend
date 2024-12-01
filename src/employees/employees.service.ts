import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Between, Repository } from 'typeorm';
import { Command } from '../command/entities/command.entity';
import { Client } from '../client/entities/client.entity';
import { clientClassification, verifyLastVisit } from '../utils/classification';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Command)
    private readonly commandRepository: Repository<Command>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async findAllWithStatistics(
    startDate: string,
    endDate: string,
  ): Promise<any[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    end.setDate(end.getDate() + 1);

    const employees = await this.employeeRepository.find();

    const clients = await this.clientRepository.find({
      relations: ['comandas'],
    });

    const commands = await this.commandRepository.find({
      where:
        startDate && endDate
          ? {
              dataLancamento: Between(start, end),
            }
          : {},
      relations: ['cliente', 'items', 'items.funcionario'],
    });

    const data = employees.map((employee) => {
      let totalBilling = 0;
      let totalCommands = 0;
      const newClients = new Set<any>();

      const classificationCounts = {
        Excelente: 0,
        Otimo: 0,
        Regular: 0,
        Ruim: 0,
      };

      const countedClients = new Set<number>();

      commands.forEach((command) => {
        const hasEmployee = command.items.some(
          (item) => item.funcionario && item.funcionario.id === employee.id,
        );

        if (hasEmployee) {
          totalCommands += 1;
          totalBilling += command.items.reduce((sum, item) => {
            return sum + item.valor;
          }, 0);

          const client = command.cliente;
          const clientFound = clients.find((c) => c.id === client.id);

          const isNewClient = clientFound.comandas.length === 1;
          if (isNewClient) {
            newClients.add(client);
          }

          const lastVisit = verifyLastVisit(clientFound);

          const classification = clientClassification(lastVisit);

          if (!countedClients.has(clientFound.id)) {
            classificationCounts[classification] += 1;
            countedClients.add(clientFound.id);
          }
        }
      });

      return {
        id: employee.id,
        nome: employee.nome,
        faturamentoTotal: totalBilling,
        totalComandas: totalCommands,
        clientesNovos: newClients.size,
        classificacaoDosClientes: classificationCounts,
      };
    });

    return data;
  }

  findOne(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOneBy({ id });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return await this.employeeRepository.update(id, updateEmployeeDto);
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const user = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}
