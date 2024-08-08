import { cannotHaveAUsernamePasswordPort } from "whatwg-url";
import User from "../models/user.model.js";
import CustomError from "../utils/customError.js";
import bcryptjs from "bcryptjs";

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json({
      success: true,
      message: "Signe dout successfully"
    })
  } catch (error) {
    next(error);
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new CustomError(404, "User not found");
    }
    const {password, ...rest} = user._doc;
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: rest
    });
  } catch (error) {
    next(error);
  }
}

export const getUsers = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new CustomError(403, "You are not allowed to update this user.");
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const order = req.query.order === 'asc' ? 1 : -1;
    const users = await User.find({})
                            .select({password: 0})
                            .sort({createdAt: order})
                            .skip(startIndex)
                            .limit(limit);
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments(
      {createdAt: {$gte: oneMonthAgo}}
    );
    res.status(200).json({
      success: true,
      users,
      totalUsers,
      lastMonthUsers
    });
  } catch (error) {
    next(error);
  }
}

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.userId !== req.params.userId) {
      throw new CustomError(403, "You are not allowed to update this user.");
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        throw new CustomError(400, "Password must be of atleast characters.");
      }
      req.body.password = bcryptjs.hashSync(req.body.password);
    }
    if (req.body.username) {
      if (req.body.username.length < 7 && req.body.username.length > 20) {
        throw new CustomError(400, "Username must be between 7 and 20 characters.");
      }
      if (req.body.username.includes(' ')) {
        throw new CustomError(400, "Username cannot contain spaces.");
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        throw new CustomError(400, "Username must be lowercase.");
      }
      if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        throw new CustomError(400, "Username can only contain letters and numbers.");
      }
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      profilePicture: req.body.profilePicture
    }, {new: true});
    const {password, ...rest} = updatedUser._doc;
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: rest
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (!req.user.isAdmin && req.user.userId !== req.params.userId) {
      throw new CustomError(403, "You are not allowed to delete this user.");
    }
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}