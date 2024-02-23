import express, { Request, Response } from "express";
import mongoose, { Document, Schema, Model } from "mongoose";
import bodyParser from "body-parser";
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
mongoose
  .connect(
    "mongodb+srv://Impano:FxBnj2S37fx4RXqN@cluster0.nlggsxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

interface ITodo {
  title: string;
  completed: boolean;
}

const TodoSchema = new Schema({
  title: String,
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", TodoSchema);

app.use(bodyParser.json());

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500);
  }
});

app.post("/todos", async (req: Request, res: Response) => {
  const todo = new Todo({
    title: req.body.title,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400);
  }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  //     try {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
  //    } catch (err) {
  //        res.status(404).json({ message: "Todo not found" });
  //    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
