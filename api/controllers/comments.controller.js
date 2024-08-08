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

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      throw new CustomError(404, "Comment not found");
    }
    const userIndex = comment.likes.indexOf(req.user.userId);
    if (userIndex === -1) {
      comment.likes.push(req.user.userId);
      comment.numOfLikes += 1;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.numOfLikes -= 1;
    }
    await comment.save();
    res.status(200).json({
      success: true,
      message: "Liked the comment successfully",
      comment
    });
  } catch (error) {
    next(error);
  }
}

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      throw new CustomError(404, "Comment not found");
    }
    if (!req.user.isAdmin || req.user.userId !== comment.userId) {
      throw new CustomError(401, "Not authorized");
    }
    comment.content = req.body.content;
    await comment.save();
    res.status(200).json({
      success: true,
      message: "Edited the comment successfully",
      comment
    });
  } catch (error) {
    next(error);
  }
}

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      throw new CustomError(404, "Comment not found");
    }
    if (!req.user.isAdmin || req.user.userId !== comment.userId) {
      throw new CustomError(401, "Not authorized");
    }
    await comment.deleteOne()
    res.status(200).json({
      success: true,
      message: "Deleted the comment successfully",
    });
  } catch (error) {
    next(error);
  }
}