import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Command } from '../command/entities/command.entity';
import { Client } from '../client/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Command, Client])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
