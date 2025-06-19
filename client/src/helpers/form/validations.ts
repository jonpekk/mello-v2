import { isValidEmail } from "@/helpers/form/isValidEmail"
export function validateEmail(value: string) {
  if (value === "") {
    return "Email is required"
  }


  if (!isValidEmail(value)) {
    return "Enter a valid email address"
  }
}

export function validateRequiredField(fieldName: string, value?: string) {
  if (!value && value === "") {
    return `${fieldName} is required`
  }

  if (value && value.length < 3) {
    return `${fieldName} must be at least 3 characters`
  }
}

export function validateAlphaNumeric(value: string) {
  const regex = /^[A-Za-z0-9-]+$/;
  return regex.test(value) ? undefined : "Only letters and numbers are allowed. You may not use spaces or special characters.";

}