// eslint-disable-next-line max-classes-per-file
import { mixins } from 'vue-class-component';
import GlobalMixin from '@/mixins/global-mixin';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// validation for character utilizing fetch call to database to get the valid list of races and classes
export class validatorParent extends mixins(GlobalMixin) {
  validValues: string[] = [];

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const category = args.constraints[0]; // only a single constraint which is the category name as the first position
    this.validValues = await this.fetchValuesFromDatabase(category); // assign validValues to be used in the default message
    return this.validValues.includes(value);
  }

  protected async fetchValuesFromDatabase(type: string): Promise<string[]> {
    const response = await fetch(`${this.BACKEND_BASE_API}/info/${type === 'class' ? 'classes' : 'races'}`);
    if (!response.ok) {
      throw new Error(`Error fetching data for ${type}`);
    }

    const result = await response.json();

    // Assuming your API response has a 'name' property
    return result.map((item: { name: string; }) => item.name);
  }
}

// used to be one validatorConstraint for both, but the modification of the instance of validValues messed up the defaultMessage (displayed raceNames as the message for both class and race)
@ValidatorConstraint({ name: 'isValidClassValue', async: true })
export class isValidClassValue extends validatorParent implements ValidatorConstraintInterface {
  defaultMessage(args: ValidationArguments): string {
    const category: string = args.constraints[0];
    const invalidValue: string = args.value; // Assuming args.value is the value related to this validator constraint in this case
    // console.log(this.validValues)
    return `Please choose a valid ${category} from the list: ${this.validValues.toString()}. The provided value (${invalidValue}) is not valid.`;
  }
}
@ValidatorConstraint({ name: 'isValidRaceValue', async: true })
export class isValidRaceValue extends validatorParent implements ValidatorConstraintInterface {
  defaultMessage(args: ValidationArguments): string {
    const category: string = args.constraints[0];
    const invalidValue: string = args.value;
    // console.log(this.validValues)
    return `Please choose a valid ${category} from the list: ${this.validValues.toString()}. The provided value (${invalidValue}) is not valid.`;
  }
}
