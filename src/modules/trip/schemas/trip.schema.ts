import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TripType } from '../enums/trip-type.enum';

export type TripDocument = Trip & Document;

@Schema({ collection: 'Trip' })
export class Trip {
  @Prop({
    required: true,
    match: /^[A-Z]{3}$/,
    trim: true,
    uppercase: true,
  })
  origin: string;

  @Prop({
    required: true,
    match: /^[A-Z]{3}$/,
    trim: true,
    uppercase: true,
  })
  destination: string;

  @Prop({ required: true, min: 0 })
  cost: number;

  @Prop({ required: true, min: 0 })
  duration: number;

  @Prop({ required: true, enum: TripType }) // Add other types as needed
  type: TripType;

  @Prop({ required: true })
  displayName: string;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
