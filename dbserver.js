const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const port = process.env.PORT;

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    database: DB_DATABASE,
    port: DB_PORT
});

db.getConnection((err, connection) => {
    if (err) throw (err);
    console.log('DB connected succesfull: ' + connection.threadId);
});

app.listen(port,
    () => console.log(`Server started on port ${port}...`)
);

app.use(express.json());

app.post('/createUser', async (req, res) => {
    const user = req.body.name;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    db.getConnection(async (err, connection) => {
        if (err) throw (err);

        const sqlSearch = 'Select * from usertable where user = ?';
        const search_query = mysql.format(sqlSearch, [user]);

        const sqlInsert = 'Insert into usertable values (0, ?, ?)';
        const insert_query = mysql.format(sqlInsert, [user, hashedPassword]);

        await connection.query(search_query, async (err, result) => {
            if (err) throw err;
            console.log('------> Search Result');
            console.log(result.length);

            if (result.length != 0) {
                connection.release();
                console.log('------> User already exists');
                res.sendStatus(409);
            }
            else {
                await connection.query(insert_query, (err, result) => {
                    connection.release();

                    if (err) throw err;
                    console.log('------> Created new user');
                    console.log(result.insertId);
                    res.sendStatus(201);
                });
            }
        });
    });
});

