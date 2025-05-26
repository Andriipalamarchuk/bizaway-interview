import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field()
  id?: string;

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
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    isEnabled: boolean,
    isAdmin: boolean,
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isEnabled = isEnabled;
    this.isAdmin = isAdmin;
  }
}
