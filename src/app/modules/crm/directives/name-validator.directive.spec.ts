import { NameValidatorDirective } from './name-validator.directive';
import { AbstractControl, FormControl } from '@angular/forms';

describe('NameValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new NameValidatorDirective();
    expect(directive).toBeTruthy();
  });
  it('should be valid', () => {
    const control: AbstractControl = new FormControl();
    control.setValue('marco, zamora');
    const directive = new NameValidatorDirective();
    const value = directive.validate(control);
    expect(value).toBeNull();
  })
  it('should be invalid', () => {
    const control: AbstractControl = new FormControl();
    control.setValue('marco');
    const directive = new NameValidatorDirective();
    const value = directive.validate(control);
    expect(value).not.toBeNull();
  })
});
