const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/todos", async(req, res)=>{
    try {
        const {description} = req.body;
          newToDo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",[description]);
        console.log(newToDo)
        res.json(newToDo.rows);
    } catch (error) {
        console.log(error);
    }
})

app.get("/todos",async (req, res)=>{
    console.log("Getting all todos");
    const todos = await pool.query("SELECT * FROM todo");
    res.json(todos.rows);
})

app.get("/todos/:id", async (req,res) => {
    const {id} = req.params
    console.log(id);
    const todo = await pool.query("SELECT * FROM todo WHERE id = $1",[id])
    res.json(todo.rows)
})

app.put("/todos/:id", async (req, res) =>{
    const {id} = req.params;
    const {description} = req.body;
    const updatedToDo = await pool.query("UPDATE todo set description = $1 WHERE id = $2 RETURNING *", [description, id]);
    res.json(updatedToDo.rows);
})

app.delete("/todos/:id", async (req, res) => {
    const {id} = req.params;
    const deletedToDo = await pool.query("DELETE FROM todo WHERE id = $1 RETURNING *", [id]);
    res.json(deletedToDo.rows);
})

const PORT = 5000;
app.listen(PORT, ()=>{
    console.log("Server has started at port ",PORT);
})