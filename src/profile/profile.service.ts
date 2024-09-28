import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const profile = this.profileRepository.create(createProfileDto);
    return await this.profileRepository.save(profile);
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return this.profileRepository.findOneBy({ id });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    return await this.profileRepository.save(updateProfileDto);
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
