// todo-admin:123
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

mongoose.connect(`mongodb+srv://todo-admin:${process.env.mongoDbConnectionPassword}@todo-db.us27znk.mongodb.net/todo-db`)

const db = mongoose.connection;

export default db;