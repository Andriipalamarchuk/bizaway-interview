import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { message: 'Password not strong enough' },
  )
  password: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  lastName: string;
}
