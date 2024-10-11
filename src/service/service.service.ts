import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const product = this.serviceRepository.create(createServiceDto);
    return await this.serviceRepository.save(product);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find();
  }

  async findOne(id: number): Promise<Service | null> {
    return await this.serviceRepository.findOneBy({ id });
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    return await this.serviceRepository.update(id, updateServiceDto);
  }

  async remove(id: number) {
    return await this.serviceRepository.delete(id);
  }
}
