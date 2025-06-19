/**
 * @param {Record<string, any>} data
 */
export function validateUserUpdate(data) {
  const ALLOWED_FIELDS_TO_UPDATE = ['profileImageUrl', 'password', 'skills'];
  if (!Object.keys(data).every(k => ALLOWED_FIELDS_TO_UPDATE.includes(k))) {
    throw new Error('Only some of the attributes can be updated');
  }
}
