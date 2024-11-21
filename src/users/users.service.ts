import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async savePasswordResetToken(
    userId: number,
    resetToken: string,
    expiryDate: Date,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    user.resetToken = resetToken;
    user.resetTokenExpiry = expiryDate;

    await this.usersRepository.save(user);
  }

  async findOneAndDeleteResetToken(resetToken: string): Promise<User> {
    console.log(resetToken);
    const user = await this.usersRepository.findOne({
      where: {
        resetToken: resetToken,
      },
    });

    await this.usersRepository.update(user.id, {
      resetToken: null,
      resetTokenExpiry: null,
    });

    return user;
  }
}
