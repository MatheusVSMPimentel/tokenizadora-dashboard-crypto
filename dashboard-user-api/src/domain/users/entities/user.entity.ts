import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";
const {nanoid} = require("nanoid");

@Entity("ClientsUser")
export class User {
    @PrimaryColumn()
    id: string
    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    birthday: string;
    @Column()
    password: string;

    @BeforeInsert()
    generateId(){
        this.id = `dev_${nanoid()}`
    }
}
