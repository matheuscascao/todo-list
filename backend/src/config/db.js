// todo-admin:123
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
mongoose.connect(`mongodb+srv://${process.env.mongoDbConnectionLogin}:${process.env.mongoDbConnectionPassword}@todo-db.yfdiwm5.mongodb.net/todo-db`)

const db = mongoose.connection;

export default db;