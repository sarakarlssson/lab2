
const express = require("express");
const app = express()
const port = 3000;

const { createConnection } = require('./dbConnection');

app.use(express.json());

app.get("/tasks", async (req, res) => {
    const connection = await createConnection();
    console.log("Hämta alla tasks")
    try {
        const [tasks] = await connection.execute('SELECT * FROM tasks')
        res.status(200).json(tasks);
        console.log(tasks)

    } catch {
        console.error(err);
        res.status(500).send("Fel vid hämtning av tasks");
    }
    finally {
        await connection.end();
    }
})

app.get("/tasks/:id", async (req, res) => {
    const connection = await createConnection();
    const id = req.params.id;

    try {
        const sql = `SELECT * FROM tasks WHERE id = ?`
        const [rows] = await connection.execute(sql, [id])

        if (rows.length === 0) {
            return res.status(404).json({ error: `Task med id ${id} hittades inte` });
        }

        res.status(200).json(rows);

    }
    catch (err) {
        console.error(err);
        res.status(500).send("Fel vid hämtning av task");
    }
    finally {
        await connection.end();
    }
})


app.post("/tasks", async (req, res) => {
    const connection = await createConnection();
    const { title, description, status, user_id } = req.body;

    try {
        const sql = `INSERT INTO tasks (task_name, description, status, user_id) VALUES (?, ?, ?, ?)`;
        const [result] = await connection.execute(sql, [title, description, status, user_id]);
        console.log(result)
        const createdTask = {
            id: result.insertId,
            title,
            description,
            status,
            user_id
        };

        await connection.end();
        res.status(201).json(createdTask);
    } catch {
        console.error(err);
        res.status(500).send("Fel vid skapande av task");
    }

    finally {
        await connection.end();
    }
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