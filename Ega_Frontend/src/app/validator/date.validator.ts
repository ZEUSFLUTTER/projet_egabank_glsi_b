import { AbstractControl, ValidationErrors } from "@angular/forms";

export function noFutureDate() {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Si le champ est vide, laisser Validators.required gérer
    if (!value) return null;

    // Convertir en Date si c'est une string (input type="date")
    const inputDate = value instanceof Date ? value : new Date(value);

    // Vérifier si la date est valide
    if (isNaN(inputDate.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    inputDate.setHours(0, 0, 0, 0);

    return inputDate > today ? { futureDate: true } : null;
  };
}

export function ageRangeValidator(minAge: number, maxAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Si le champ est vide, laisser Validators.required gérer
    if (!value) return null;

    // Convertir en Date si c'est une string (input type="date")
    const birthDate = value instanceof Date ? value : new Date(value);

    // Vérifier si la date est valide
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < minAge) return { ageRange: true, minAge, actualAge: age };
    if (age > maxAge) return { ageRange: true, maxAge, actualAge: age };

    return null;
  };
}