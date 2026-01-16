
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


app.put("/tasks/:id", async (req, res) => {
    const connection = await createConnection();
    const id = req.params.id;
    const { title, description, status } = req.body;

    try {
        const [existing] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ error: `Task med id ${id} hittades inte` });
        }
        const sql = `
            UPDATE tasks 
            SET task_name = ?, description = ?, status = ? 
            WHERE id = ?
        `;
        await connection.execute(sql, [title, description, status, id]);

        const [updatedRows] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [id]);
        res.status(200).json(updatedRows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send("Fel vid uppdatering av task");
    }
    finally {
        await connection.end();
    }

})


app.delete("/tasks/:id", async (req, res) => {
    const connection = await createConnection();
    const id = req.params.id;

    try {
        const [existing] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ error: `Task med id ${id} hittades inte` });
        }
        const sql = 'DELETE FROM tasks WHERE id = ?';

        await connection.execute(sql, [id]);
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Fel vid borttagning av task");
    }
    finally {
        await connection.end();
    }
})


app.listen(port, () => {
    console.log(`http://localhost:${port}`)

})