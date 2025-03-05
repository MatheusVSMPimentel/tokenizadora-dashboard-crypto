import { User } from "../../entities/user.entity";

export class CreateUserResponseDto {
    name: string;
    email: string;
    birthday: string;

    private constructor(){}

    static createUserResponseBuilder(entity: User): CreateUserResponseDto{
        return {name: entity.name, email: entity.email, birthday: entity.birthday}
    }
}