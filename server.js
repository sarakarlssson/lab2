
const express = require("express");
const app = express()
const port = 3000;

const { createConnection } = require('./dbConnection');

app.get("/tasks", async (req, res) => {
    const connection = await createConnection();
    console.log("Hämta alla tasks")
    const [tasks] = await connection.execute('SELECT * FROM tasks')
    console.log(tasks)
    await connection.end();
})

app.get("/tasks/:id", async (req, res) => {
    const connection = await createConnection();
    const id = req.params.id;
    const sql = `SELECT * FROM tasks WHERE user_id = ?`
    const [rows, field] = await connection.execute(sql, [id])
    res.json(rows)
})

app.post("/task", (req, res) => {

})


app.put("/tasks/:id", (req, res) => {
    console.log(req.params.id)
    res.send(req.params.id)
})


app.delete("/tasks/:id", (req, res) => {
    console.log(req.params.id)
    res.send(req.params.id)
})


app.listen(port, () => {
    console.log(`http://localhost:${port}`)

})