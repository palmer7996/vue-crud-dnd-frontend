import {
  IsNotEmpty, IsOptional, Length, MaxLength,
} from 'class-validator';

export default class User {
  @IsOptional()
  id!:number;

  @Length(1, 50, { message: 'username must be from $constraint1 to $constraint2 characters ' })
  @IsNotEmpty({ message: 'username is required' })
  username!: string;

  @Length(7, 50, { message: 'username must be from $constraint1 to $constraint2 characters ' })
  password!: string;

  @IsNotEmpty({ message: 'Token is required' })
  token!: string;

  @IsNotEmpty({ message: 'Token is required' })
  accessLevel!: string;
  // accessLevels = write, read or admin

  // optional stuff that doesn't matter

  // @Length(1, 50, { message: 'First Name must be from $constraint1 to $constraint2 characters ' })
  @IsOptional()
    // @IsNotEmpty({ message: 'First Name is required' })
  firstName?: string;

  @MaxLength(50, { message: 'Last Name can be at most $constraint1 characters' })
  @IsOptional()
  lastName?: string;

  @IsOptional()
  age?: number;

  // make a 1-1 connection between user and character (currently not in use)

  // @OneToMany(() => Character, (character) => character.user)
  // characters: Character[];
}
