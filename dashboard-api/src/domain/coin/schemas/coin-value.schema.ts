import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CoinValue extends Document {
  @Prop({ required: true })
  symbol: string;

  @Prop({ type: Number })
  openDay: number;  
  @Prop({ type: Number })
  price: number;  
  percentDifference: number
}

export const CoinValueSchema = SchemaFactory.createForClass(CoinValue);