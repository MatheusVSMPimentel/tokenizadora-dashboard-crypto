import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Dashboard extends Document {
  @Prop()
  userId: string;

  @Prop([String])
  symbols: string[];
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
