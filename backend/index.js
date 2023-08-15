import express from 'express';
import cors from "cors"
import todoRoute from './src/routes/Todo.js';
const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(cors());
app.use('/todo/', todoRoute);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})