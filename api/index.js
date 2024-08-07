import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.route.js';
import authRouter from './routes/auth.route.js';
import postsRouter from "./routes/post.route.js";
import commentsRouter from "./routes/comments.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: "API is working."
  });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message
  });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
}).catch(err => {
  console.log(err.message);
});