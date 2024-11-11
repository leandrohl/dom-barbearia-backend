import { Module } from '@nestjs/common';
import { CommandController } from './command.controller';
import { CommandService } from './command.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Command } from './entities/command.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Command, OrderItem])],
  controllers: [CommandController],
  providers: [CommandService],
})
export class CommandModule {}
