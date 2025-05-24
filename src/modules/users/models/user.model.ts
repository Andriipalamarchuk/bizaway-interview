import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  isEnabled: boolean;

  @HideField()
  isAdmin: boolean;

  constructor(
    email: string,
    firstName: string,
    lastName: string,
    isEnabled: boolean,
    isAdmin: boolean,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isEnabled = isEnabled;
    this.isAdmin = isAdmin;
  }
}
