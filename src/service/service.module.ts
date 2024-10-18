import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { Service } from './entities/service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEmployee } from './entities/service-employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceEmployee])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
