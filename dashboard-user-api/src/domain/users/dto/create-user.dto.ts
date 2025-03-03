import { BadRequestException } from "@nestjs/common";
import { IsDateString, IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;
    @IsEmail()
    email: string;
    @IsDateString()
    birthday: string;
    @IsStrongPassword()
    password: string;
    @IsStrongPassword()
    confirmPassword: string;
    
     verifyDtoPassword: () => void = () => {
        if(!this.password && !this.confirmPassword) return
        if (
            (this.password && !this.confirmPassword
         || !this.password && this.confirmPassword) 
         || this.password != this.confirmPassword) 
         throw new BadRequestException("Verifique os passwords informados.");
      }
}
 
