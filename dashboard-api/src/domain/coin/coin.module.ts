// src/crypto/crypto.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coin } from './entities/coin.entity';
import { CoinListScheduler } from './coin-list.scheduler';
import { CoinListService } from './services/coin-list.service';
import { CoinService } from './services/coin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardSchema } from './schemas/dashboard.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoinApiService } from 'src/infrastructure/external-data/coin.api.service';
import { CoinValue, CoinValueSchema } from './schemas/coin-value.schema';
import { CoinPoolService } from './services/coin-pool.service';
import { CoinController } from './controllers/coin.controller';
import { SharedModule } from '../shared/shared.module';
import { CoinWebSocketGateway } from './gateways/coin-websocket.gateway';
import { PollingUpdateService } from './services/polling-update.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Coin]),
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
      { name: CoinValue.name, schema: CoinValueSchema },
    ]),
    SharedModule
  ],
  controllers: [CoinController],
  providers: [
    {
      provide: 'ICoinApi', // Token para identificação
      useClass: CoinApiService,
    },
    ConfigService,
    CoinApiService,
    CoinService,
    CoinListService,
    CoinListScheduler,CoinPoolService, CoinWebSocketGateway, PollingUpdateService
  ],
  exports: ['ICoinApi', CoinService, CoinPoolService],
})
export class CoinModule {}
