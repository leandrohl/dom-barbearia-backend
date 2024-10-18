import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { ServiceEmployee } from './entities/service-employee.entity';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(ServiceEmployee)
    private readonly serviceEmployeeRepository: Repository<ServiceEmployee>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const { funcionarios, ...serviceData } = createServiceDto;

    const service = this.serviceRepository.create(serviceData);
    await this.serviceRepository.save(service);

    if (funcionarios.length > 0) {
      const serviceEmployees = funcionarios.map((employeeId) => {
        const serviceEmployee = new ServiceEmployee();
        serviceEmployee.funcionario = { id: employeeId } as Employee;
        serviceEmployee.servico = service;

        return serviceEmployee;
      });

      await this.serviceEmployeeRepository.save(serviceEmployees);
    }

    return service;
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find();
  }

  async findOne(id: number): Promise<Service | null> {
    const service = await this.serviceRepository.findOneBy({ id });

    const serviceEmployees = await this.serviceEmployeeRepository.find({
      where: { servico: { id: service.id } },
      relations: ['funcionario'],
    });

    service.servicoFuncionario = serviceEmployees;

    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const { funcionarios, ...serviceData } = updateServiceDto;

    const service = await this.serviceRepository.findOneBy({ id });

    if (!service) {
      return null;
    }

    this.serviceRepository.merge(service, serviceData);
    await this.serviceRepository.save(service);

    if (funcionarios.length > 0) {
      await this.serviceEmployeeRepository.delete({
        servico: { id: service.id },
      });

      const serviceEmployees = funcionarios.map((employeeId) => {
        const serviceEmployee = new ServiceEmployee();
        serviceEmployee.funcionario = { id: employeeId } as Employee;
        serviceEmployee.servico = service;

        return serviceEmployee;
      });

      await this.serviceEmployeeRepository.save(serviceEmployees);
    }

    return service;
  }

  async remove(id: number) {
    return await this.serviceRepository.delete(id);
  }
}
