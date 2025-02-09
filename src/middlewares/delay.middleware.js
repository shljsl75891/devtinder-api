import {waitFor} from '../utils.js';

/**
 * This function returns the middleware which adds artificial
 * delay specified in seconds before each and every request
 * @param {number} delay in seconds
 * @returns {import('express').RequestHandler} the middleware
 */
function delay(delay) {
  return (_, __, next) => waitFor(delay * 1000).then(next);
}

export default delay;
