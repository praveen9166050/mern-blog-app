import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = await User.create({username, email, password: hashedPassword});
    res.status(200).json({
      message: "User has been created"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};