import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to the database."))
.catch(err => console.log(err.message));

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});