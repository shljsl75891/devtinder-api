import {Model, Types} from 'mongoose';

/**
 * The error handler to handle any error in any of the routes
 * @type {import("express").ErrorRequestHandler}
 */
export function errorHandler(err, _req, res, _next) {
  res.status(500).json(errorResponse(err));
}

/** @param {*} data */
export function successResponse(data) {
  return {status: 'success', data};
}

/** @param {Error} err */
export function errorResponse(err) {
  return {status: 'failure', message: err.message ?? 'Something Went Wrong'};
}

/**
 * This function returns whether the val is `null` or `undefined`
 * @param {unknown} val
 * @returns {val is null | undefined}
 */
export function isNullOrUndefined(val) {
  return val === null || val === undefined;
}

/**
 * This function generates error message for entity not found
 * @param {string | Types.ObjectId} entityId
 * @param {Model} entity
 * @returns {Error} The error message to throw
 */
export function notFoundErr(entityId, entity) {
  return new Error(`${entity.modelName} with id: ${entityId} doesn't exist`);
}

/**
 * @param {string | object} val
 * @returns {val is '' | [] | {} }
 */
export function isEmpty(val) {
  return (
    (typeof val === 'object' && Object.keys(val).length === 0) ||
    (typeof val === 'string' && val.trim().length === 0)
  );
}

/**
 * @param {unknown} val
 * @returns {val is null | undefined | '' | {} | []}
 */
export function isNullOrUndefinedOrEmpty(val) {
  return isNullOrUndefined(val) || isEmpty(val);
}

/**
 * This method returns resolved promise after specified delay
 * @param {number} delay in milliseconds
 * @returns {Promise<void>} resolve after specified milliseconds
 */
export function waitFor(delay) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), delay);
  });
}
