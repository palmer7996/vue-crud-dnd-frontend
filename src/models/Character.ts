import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
  ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate, MaxLength,
} from 'class-validator';
import DndRace from '@/models/DndRace';
import DndClass from '@/models/DndClass';
import GlobalMixin from '@/mixins/global-mixin';
import { mixins } from 'vue-class-component';
import { isValidClassValue, isValidRaceValue } from '@/models/CharacterValidationForClassAndRace';

// import { DndRace } from './DndRace'
// import { DndClass } from './DndClass'

const genderArray = ['Male', 'Female', 'Non-binary', 'Other'];

const alignmentArray = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
];

export default class Character {
  @IsOptional()
    id!: number

  @Length(1, 50, { message: 'Name must be from $constraint1 to $constraint2 characters ' })
  @IsNotEmpty({ message: 'Name is Required' })
    name!: string

  @IsNotEmpty({ message: 'Age is Required' })
  @Min(0, { message: 'Age must be at least 0' })
    age!: number

  // the ones that give a list of valid values won't disappear
  // when user starts typing to make it easy for the user to copy from the valid list

  @IsNotEmpty({ message: 'Gender is Required' })
  @IsIn(genderArray, { message: `Please choose between the options: ${genderArray.toString()}` })
  gender!: string

  @IsNotEmpty({ message: 'Class is Required' })
  @Validate(isValidClassValue, ['class'])
    class!: string

  @IsNotEmpty({ message: 'Race is Required' })
  @Validate(isValidRaceValue, ['race'])
    race!: string

  @IsNotEmpty({ message: 'Alignment is Required' })
  @IsIn(alignmentArray, { message: `Please choose between the options: ${alignmentArray.toString()}` })
    alignment!: string

  @IsOptional()
  @MaxLength(150, { message: 'Description can be at most $constraint1 characters ' })
  @IsNotEmpty({ message: 'Description is required if provided' }) // to prevent just sending an empty string
    description?: string

  // could implement stats with FK, currently not implementing stats

  // autogenerated when submitting to the database
    dateCreated?: Date

  // id related to the user
  @IsOptional()
    userId?: number

  @IsOptional()
  @Min(1, { message: 'Minimum value is 1' })
  @Max(20, { message: 'Maximum value is 20' })
    strength?: number

  @IsOptional()
  @Min(1, { message: 'Minimum value is 1' })
  @Max(20, { message: 'Maximum value is 20' })
    dexterity?: number

  @IsOptional()
  @Min(1, { message: 'Minimum value is 1' })
  @Max(20, { message: 'Maximum value is 20' })
    constitution?: number

  @IsOptional()
  @Min(1, { message: 'Minimum value is 1' })
  @Max(20, { message: 'Maximum value is 20' })
    intelligence?: number

  @IsOptional()
  @Min(1, { message: 'Minimum value is 1' })
  @Max(20, { message: 'Maximum value is 20' })
    wisdom?: number

  @IsOptional()
  @Min(1, { message: 'Minimum value is 1' })
  @Max(20, { message: 'Maximum value is 20' })
    charisma?: number
}
