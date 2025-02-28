import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'usrclient',
      password: 'SenhaDoUsuario123',
      database: "userclient",
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, //just for experimental purpose
    }),
    UsersModule]
})
export class AppModule {}
