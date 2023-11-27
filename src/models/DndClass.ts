import {
  IsNotEmpty, IsOptional, Length, Max, Min,
} from 'class-validator';

export default class DndClass {
  @IsOptional()
    id!: number

  @Length(1, 50, { message: 'Name must be from $constraint1 to $constraint2 characters' })
  @IsNotEmpty({ message: 'name is Required' })
    name!: string

  @IsNotEmpty({ message: 'hitDie is Required' })
  @Max(14, { message: 'hitDie can be at most 14' })
  @Min(4, { message: 'hitDie must be at least 4' }) // setting max and min for custom classes slightly above the range for regular classes (6-12)
    hitDie!: number

  @Length(1, 255, { message: 'profChoices must be from $constraint1 to $constraint2 characters' })
  @IsNotEmpty({ message: 'profChoices is Required' })
    profChoices!: string
}
