
const express = require("express");
const app = express()
const port = 3000;

app.get("/tasks", (req, res) => {
    res.send("Hämta alla tasks")
})

app.get("/tasks/:id", (req, res) => {
    console.log(req.params.id)
    res.send(req.params.id)
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)

})