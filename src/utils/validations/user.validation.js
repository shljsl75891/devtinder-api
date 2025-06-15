/**
 * @param {Record<string, any>} data
 */
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

/**
 * @param {Record<string, any>} data
 */
export function validateUserUpdate(data) {
  const ALLOWED_FIELDS_TO_UPDATE = ['profileImageUrl', 'password', 'skills'];
  if (!Object.keys(data).every(k => ALLOWED_FIELDS_TO_UPDATE.includes(k))) {
    throw new Error('Only some of the attributes can be updated');
  }
}
