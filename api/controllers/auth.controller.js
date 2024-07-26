import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import CustomError from "../utils/customError.js";

export const signup = async (req, res, next) => {
  try {
    const {username, email, password} = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
      return next(new CustomError(400, "All fields are required"));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = await User.create({username, email, password: hashedPassword});
    res.status(200).json({
      message: "User has been created"
    });
  } catch (error) {
    next(error);
  }
};