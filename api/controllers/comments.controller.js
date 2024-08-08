import Comment from "../models/comment.model.js";
import CustomError from "../utils/customError.js";

export const createComment = async (req, res, next) => {
  try {
    const {content, postId, userId} = req.body;
    if (userId !== req.user.userId) {
      throw new CustomError(403, "You are not allowed to create this comment");
    }
    const comment = await Comment.create({content, postId, userId});
    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment
    });
  } catch (error) {
    next(error);
  }
}

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({postId: req.params.postId}).sort({createdAt: -1});
    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments
    });
  } catch (error) {
    next(error);
  }
}