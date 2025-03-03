import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
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
    private _password: string;
    
  // Flag para identificar se a senha foi modificada.
    private passwordChanged = false;

  // Getter para a senha (opcional, você pode não expor a senha)
  get password(): string {
    console.log(this._password)
    return this._password;
  }

  // Setter para a senha — quando for alterada, marca o flag como true.
  set password(newPassword: string) {
    this._password = newPassword;
    this.passwordChanged = true;
  }

  @BeforeInsert()
  async beforeInsert(): Promise<void> {
    // Gere o ID e criptografe a senha ao inserir
    this.id = `dev_${nanoid()}`;
    // A senha sempre será criptografada no insert, independentemente do flag.
    this._password = await this.encryptPassword(this._password);
    this.passwordChanged = false;
    
  }

  @BeforeUpdate()
  async beforeUpdate(): Promise<void> {
    // Apenas criptografa a senha se ela tiver sido modificada.
    if (this.passwordChanged) {
      this._password = await this.encryptPassword(this._password);
      // Resetamos o flag
      this.passwordChanged = false;
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);}
}
