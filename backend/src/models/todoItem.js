import mongoose from 'mongoose';

const todoItemSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: ['todo','doing','done']
})

const todoItem = mongoose.model('todo-items', todoItemSchema)

export default todoItem;