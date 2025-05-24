import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResultModel {
  @Field()
  userId: string;

  @Field()
  isAdmin: boolean;

  @Field()
  accessToken: string;

  constructor(userId: string, accessToken: string, isAdmin: boolean) {
    this.userId = userId;
    this.accessToken = accessToken;
    this.isAdmin = isAdmin;
  }
}
