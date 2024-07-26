import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usersRouter from './routes/users.route.js';
import authRouter from './routes/auth.route.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({
    message: "API is working."
  });
});

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to the database."))
.catch(err => console.log(err.message));

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});