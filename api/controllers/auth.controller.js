import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import CustomError from "../utils/customError.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  try {
    const {username, email, password} = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
      throw new CustomError(400, "All fields are required");
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = await User.create({username, email, password: hashedPassword});
    res.status(200).json({
      success: true,
      message: "User has been created"
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    if (!email || !password || email === '' || password === '') {
      throw new CustomError(400, "All fields are required");
    }
    const user = await User.findOne({email});
    if (!user) {
      throw new CustomError(401, "Invalid credentials");
    }
    const matched = bcryptjs.compareSync(password, user.password);
    if (!matched) {
      throw new CustomError(400, "Invalid credentials");
    }
    const token = jwt.sign(
      {userId: user._id, email}, 
      process.env.JWT_SECRET, 
      {expiresIn: process.env.JWT_EXPIRES_IN}
    );
    const {password: pass, ...rest} = user._doc;
    res.status(200).cookie(
      'access_token', 
      token, 
      {httpOnly: true}
    ).json({
      success: true,
      message: "Signed in successfully",
      user: rest
    });
  } catch (error) {
    next(error);
  }
}