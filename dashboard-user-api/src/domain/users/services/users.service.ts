import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ){}

  async create(dto: CreateUserDto) {
    let developer = await this.repository.findOneBy({ email: dto.email });
    if(developer) throw new ConflictException()
    await this.verifyDtoPassword(dto);
    developer =  this.repository.create(dto);
    return await this.repository.save(developer);
  }

  private async encriptyPassword (password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateUserDto) {
    const developer = await this.repository.findOneBy({ id });

    if (!developer) return
    await this.verifyDtoPassword(dto);
    this.repository.merge(developer, dto);
    return this.repository.save(developer);
  }

  private async verifyDtoPassword(dto: UpdateUserDto) {
    if (dto.password != dto.confirmPassword || !dto.password) throw new BadRequestException("Verifique os passwords informados.");
    dto.password = await this.encriptyPassword(dto.password);
  }

  async remove(id: string) {
    const developer = await this.repository.findOneBy({ id });
    if (!developer) return
    return this.repository.remove(developer);
    
  }
}
