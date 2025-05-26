import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TripType } from '../../trip/enums/trip-type.enum';
import { TripStatus } from '../enums/trip-status.enum';

export type UserTripDocument = UserTrip & Document;

@Schema({ collection: 'UserTrip' })
export class UserTrip {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

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

  @Prop({ required: true, enum: TripType })
  type: TripType;

  @Prop({ required: true, enum: TripStatus })
  status: TripStatus;

  @Prop({ required: true })
  displayName: string;
}

export const UserTripSchema = SchemaFactory.createForClass(UserTrip);
