import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import generateAccessToken from './generateAccessToken.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD;

const port = process.env.PORT;

const db = mysql.createPool({
    connectionLimit: 100,
    host: DB_HOST,
    user: DB_USER,
    //password: DB_PASSWORD;
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

//CREAR USUARIO
app.post('/createUser', async (req, res) => {
    const user = req.body.user;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    db.getConnection(async (err, connection) => {
        if (err) throw (err);

        const sqlSearch = 'Select * from usertable where user = ?';
        const search_query = mysql.format(sqlSearch, [user]);

        const sqlInsert = 'Insert into usertable values (0, ?, ?)';
        const insert_query = mysql.format(sqlInsert, [user, hashedPassword]);

        await connection.query(search_query, async (err, result) => {
            if (err) throw err;
            console.log('------> Resultados de la Búsqueda');
            console.log(result.length);

            if (result.length != 0) {
                connection.release();
                console.log(`------> Este nombre de usuario ya existe: ${user}`);
                res.sendStatus(409);
            }
            else {
                await connection.query(insert_query, (err, result) => {
                    connection.release();

                    if (err) throw err;
                    console.log('------> Nuevo usuario creado');
                    console.log(result.insertId);
                    res.sendStatus(201);
                });
            }
        });
    });
});

//LOGIN (Autenticar usuario)
app.post("/login", (req, res) => {
    const user = req.body.user;
    const password = req.body.password;

    db.getConnection(async (err, connection) => {
        if (err) throw (err);
        const sqlSearch = "Select * from userTable where user = ?";
        const search_query = mysql.format(sqlSearch, [user]);

        await connection.query(search_query, async (err, result) => {
            connection.release();

            if (err) throw (err);
            if (result.length == 0) {
                console.log(`--------> Este usuario no existe: ${user}`);
                res.statusCode = 404;
                res.send('Usuario no encontrado');
            }
            else {
                const hashedPassword = result[0].password;
                //obtener contraseña cifrada
                if (await bcrypt.compare(password, hashedPassword)) {
                    console.log("---------> Usuario autenticado satisfactoriamente");
                    console.log("---------> Generando token de acceso");
                    const token = generateAccessToken({ user: user, message: 'Aqui se guarda cualquier informacion necesaria' });
                    console.log(token);
                    res.json({ accessToken: token });
                }
                else {
                    console.log("---------> Contraseña incorrecta");
                    res.send("Contraseña incorrecta!");
                }
            }
        });
    });
});