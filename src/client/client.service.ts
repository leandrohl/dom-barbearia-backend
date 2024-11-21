import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { clientClassification, verifyLastVisit } from '../utils/classification';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  async findOne(id: number): Promise<Client | null> {
    return await this.clientRepository.findOneBy({ id });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    return await this.clientRepository.update(id, updateClientDto);
  }

  async remove(id: number) {
    return await this.clientRepository.delete(id);
  }

  async findAllWithStatistics(
    date?: string,
    employeeId?: string,
  ): Promise<any[]> {
    const clients = await this.clientRepository.find({
      relations: ['comandas', 'comandas.items', 'comandas.items.funcionario'],
    });

    const data = clients.map((client) => {
      let filteredComandas = date
        ? client.comandas.filter((comanda) => {
            const comandaDate = new Date(comanda.dataLancamento);
            const filterDate = new Date(date);

            return (
              comandaDate.getFullYear() === filterDate.getFullYear() &&
              comandaDate.getMonth() === filterDate.getMonth() &&
              comandaDate.getDate() === filterDate.getDate()
            );
          })
        : client.comandas;

      if (employeeId) {
        filteredComandas = filteredComandas.filter((command) =>
          command.items.find(
            (item) => item.funcionario?.id === Number(employeeId),
          ),
        );
      }

      if (filteredComandas.length === 0) {
        return null;
      }

      const totalValue = filteredComandas.reduce((acc, comanda) => {
        const valueCommand = comanda.items.reduce(
          (itemAcc, item) => itemAcc + (item.valor || 0),
          0,
        );
        return acc + valueCommand;
      }, 0);

      const frequencyVisits = client.comandas.length;

      const lastVisit = verifyLastVisit(client);

      return {
        id: client.id,
        nome: client.nome,
        classificacao: clientClassification(lastVisit),
        frequenciaVisitas: frequencyVisits,
        valorGastoTotal: totalValue,
        ultimaVisita: lastVisit,
      };
    });

    return data.filter((item) => item !== null);
  }
}
