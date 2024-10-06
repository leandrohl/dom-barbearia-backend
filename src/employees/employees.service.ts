import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  findOne(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOneBy({ id });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return await this.employeeRepository.save(updateEmployeeDto);
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const user = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}
