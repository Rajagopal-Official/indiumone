import { AbstractControl, ValidationErrors } from '@angular/forms';

export function urlValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null; // Don't validate empty values to allow optional fields
  }
  
  const urlPattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/;
  return urlPattern.test(control.value) ? null : { invalidUrl: true };
}