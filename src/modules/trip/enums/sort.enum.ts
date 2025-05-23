import { registerEnumType } from '@nestjs/graphql';

export enum SortByEnum {
  Fastest = 'fastest',
  Cheapest = 'cheapest',
}

export enum SortDirectionEnum {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortByEnum, {
  name: 'SortByEnum',
});
registerEnumType(SortDirectionEnum, {
  name: 'SortDirectionEnum',
});
