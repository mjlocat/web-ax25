import { validate as EmailValidator } from 'email-validator';
import PasswordValidator from 'password-validator';

const passwordValidator = new PasswordValidator();
passwordValidator
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();

export function validateEmail(email) {
  return EmailValidator(email);
}

export function validatePassword(password) {
  return passwordValidator.validate(password);
}

export function validateFieldNotEmpty(value) {
  return value.length > 0;
}