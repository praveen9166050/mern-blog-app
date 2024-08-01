import Post from "../models/post.model.js";
import CustomError from "../utils/customError.js";

export const createPost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new CustomError(403, "You are not allowd to create post");
    }
    if (!req.body.title || !req.body.content) {
      throw new CustomError(400, "Please provide all the required fields");
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/^[a-zA-Z0-9]/g, '-');
    const createdPost = await Post.create({...req.body, slug, userId: user.id});
    res.status(201).json({
      success: true,
      message: "Post created successfully"
    });
  } catch (error) {
    next(error);
  }
}