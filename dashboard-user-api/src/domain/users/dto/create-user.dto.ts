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
}
 
