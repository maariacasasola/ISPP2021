import { AbstractControl } from '@angular/forms';

export class FormValidations {

    static isActualDate(control: AbstractControl) {

        const value = control.value;
        const actualDate = new Date();
        actualDate.setDate(actualDate.getDate() - 1);
        console.log(actualDate);
        console.log(value);

        if (!(value >= actualDate )) {
            return { isActualDate: true }
        }
        return null;

    }

}