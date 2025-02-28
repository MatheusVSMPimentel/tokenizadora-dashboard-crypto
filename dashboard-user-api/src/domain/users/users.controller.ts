import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const developer = await this.usersService.findOne(id);
    if (developer) throw new NotFoundException();
    return developer
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const developer = await this.usersService.update(id, updateUserDto);
    if (developer) throw new NotFoundException();
    return developer
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const developer = await this.usersService.remove(id);

    if (developer) throw new NotFoundException();

    return 
  }
}
