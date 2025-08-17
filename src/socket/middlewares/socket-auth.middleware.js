import User from '../../models/user.model.js';

/**
 * @param {import('socket.io').Socket} socket
 * @param {(err?: import('socket.io').ExtendedError) => void} next
 */
function socketAuth(socket, next) {
  // @ts-expect-error - cookie-parser attaches cookies to request
  const token = socket.request.cookies?.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  User.verifyJwt(token)
    .then(currentUser => {
      socket.handshake.auth = currentUser;
      next();
    })
    .catch(err => next(err));
}

export default socketAuth;
