import jwt from 'jsonwebtoken';
import CustomError from './customError.js';

export const verifyUser = async (req, res, next) => {
  const token = req.cookies.access_token;
    if (!token) {
      return next(new CustomError(401, "Unauthorized"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(new CustomError(401, "Unauthorized"));
      }
      req.user = user;
      next();
    });
}