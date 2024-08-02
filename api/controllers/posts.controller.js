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
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const createdPost = await Post.create({...req.body, slug, userId: req.user.userId});
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: createdPost
    });
  } catch (error) {
    next(error);
  }
}

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const order = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && {userId: req.query.userId}),
      ...(req.query.category && {category: req.query.category}),
      ...(req.query.slug && {slug: req.query.slug}),
      ...(req.query.postId && {_id: req.query.slug}),
      ...(req.query.searchTerm && {
        $or: [
          {title: {$regex: req.query.searchTerm, $options: 'i'}},
          {content: {$regex: req.query.searchTerm, $options: 'i'}},

        ]
      }),
    }).sort({updatedAt: order}).skip(startIndex).limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments(
      {createdAt: {$gte: oneMonthAgo}}
    );
    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
      totalPosts,
      lastMonthPosts
    });
  } catch (error) {
    next(error);
  }
}