export default class UserValidatorService {
  /** @param {Record<string, any>} data */
  updateProfile(data) {
    const ALLOWED_FIELDS_TO_UPDATE = [
      'gender',
      'age',
      'profileImageUrl',
      'skills',
    ];
    const payloadKeys = Object.keys(data);
    if (payloadKeys.includes('password')) {
      throw new Error('Please use forgot password !');
    }
    if (!payloadKeys.every(k => ALLOWED_FIELDS_TO_UPDATE.includes(k))) {
      throw new Error('Only some of the attributes can be updated');
    }
  }
}
