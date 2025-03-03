import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CoinValue extends Document {
  @Prop({ required: true })
  symbol: string;

  @Prop({ type: Number })
  openDay: number;  

  calculatePercentDifference(price: number): number {
    if (this.openDay === 0) return 0;
    return ((price - this.openDay) / this.openDay) * 100;
  }
}

export const CoinValueSchema = SchemaFactory.createForClass(CoinValue);