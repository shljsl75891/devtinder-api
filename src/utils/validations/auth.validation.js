import validator from 'validator';

/** @param {Record<string, any>} data */
export function validateUserLogin(data) {
  if (!data.email || !validator.isEmail(data.email)) {
    throw new Error('Please enter a valid email address');
  }
  if (!data.password) {
    throw new Error('Please enter your strong password');
  }
}
/** @param {Record<string, any>} data */
export function validateUserSignup(data) {
  const ALLOWED_FIELDS = ['firstName', 'lastName', 'email', 'password'];
  const hasInvalidFields = Object.keys(data).some(
    key => !ALLOWED_FIELDS.includes(key),
  );
  if (hasInvalidFields) {
    throw new Error(
      'Please enter your firstName, lastName, email, and password',
    );
  }
}

/** @param {Record<string, any>} data */
export function forgotPasswordPayload(data) {
  const REQUIRED_FIELDS = ['currentPassword', 'newPassword'];
  const hasAllFields = REQUIRED_FIELDS.every(field => field in data);
  if (!hasAllFields) {
    throw new Error(
      'Please confirm your current password and send new password',
    );
  }
  if (data.currentPassword === data.newPassword) {
    throw new Error(
      'Please choose different password than your current password',
    );
  }
}
