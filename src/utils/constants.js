export const SALT_ROUNDS = 10;
export const HALF_HOUR_IN_MILLISECONDS = 1000 * 60 * 30;

export const USER_SAFE_DATA =
  'firstName lastName gender age about profileImageUrl skills';

/** @param {unknown} val
 * @returns {val is null | undefined}
 */
export const isNullOrUndefined = val => val === null || val === undefined;
