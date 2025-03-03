import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { BadRequestException } from '@nestjs/common';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    override verifyDtoPassword: () => void = () => {
        if(!this.password && !this.confirmPassword) return
        if (
            (this.password && !this.confirmPassword
         || !this.password && this.confirmPassword) 
         || this.password != this.confirmPassword) 
         throw new BadRequestException("Verifique os passwords informados.");
      }
}
