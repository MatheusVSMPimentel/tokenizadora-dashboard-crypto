import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
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
    dto.verifyDtoPassword;
    developer =  this.repository.create(dto);
    return await this.repository.save(developer);
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
    if(dto.password){
      dto.verifyDtoPassword;
      developer.password = dto.password;
    }
    this.repository.merge(developer, dto);
    return this.repository.save(developer);
  }


  async remove(id: string) {
    const developer = await this.repository.findOneBy({ id });
    if (!developer) return
    return this.repository.remove(developer);
    
  }
}
