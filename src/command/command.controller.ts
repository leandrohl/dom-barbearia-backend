import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CommandService } from './command.service';
import { CreateCommandDto } from './dto/create-Command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';

@Controller('command')
export class CommandController {
  constructor(private readonly CommandService: CommandService) {}

  @Post()
  create(@Body() createCommandDto: CreateCommandDto) {
    return this.CommandService.create(createCommandDto);
  }

  @Get()
  findAll() {
    return this.CommandService.findAll();
  }

  @Get('/statistics')
  findAllWithStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.CommandService.findAllWithStatistics(
      employeeId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.CommandService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommandDto: UpdateCommandDto) {
    return this.CommandService.update(+id, updateCommandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.CommandService.remove(+id);
  }
}
