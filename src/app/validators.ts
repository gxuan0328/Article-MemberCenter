import { AbstractControl, ValidatorFn } from '@angular/forms';

export class ConfirmPassword {
    static check(name: string): ValidatorFn {
        let target: AbstractControl;
        return (control: AbstractControl): { [key: string] : boolean } | null => {
            if(!control.parent){
                console.log('TEST',control);
                return null;
            }

            if(!target){
                target = control.parent?.get(name)!;
                target.valueChanges.subscribe(() => {
                    console.log('O');
                    control.updateValueAndValidity();
                });
            }
            
            return target.value === control.value ? null : {'not match': true};
        };
    }
}

