import { Field, ObjectType } from '@nestjs/graphql';
import { TripModel } from './trip.model';
import { SortByEnum, SortDirectionEnum } from '../enums/sort.enum';

@ObjectType()
export class TripSearchModel {
  @Field(() => [TripModel])
  trips: TripModel[];

  @Field(() => SortByEnum)
  sortBy: SortByEnum;

  @Field(() => SortDirectionEnum)
  sortDirection: SortDirectionEnum;
}
