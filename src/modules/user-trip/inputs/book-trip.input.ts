import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TripType } from '../../trip/enums/trip-type.enum';

@InputType()
export class BookTripInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  origin: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  destination: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @Field(() => TripType)
  @IsEnum(TripType)
  type: TripType;

  @Field()
  @IsString()
  @IsNotEmpty()
  displayName: string;
}
