import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
  selector: '[nameValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: NameValidatorDirective,
    multi: true
  }]
})
export class NameValidatorDirective implements Validator {
  constructor() { }

  validate(c: AbstractControl): { [key: string]: any; } {
    const value = c.value;
    if (value) {
      const _names = value.split(',').map(n => n.trim());
      if (_names.length >= 2) {
        if (_names[1].length >= 3) { return null; }
      }
      return { 'namesearch': true };
    }
  }
}
