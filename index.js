import express from 'express';
import cors from 'cors';
import { createServer } from "http";
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import allRoutes from './routes/allRoutes.js';
import dbCon from './helpers/db_connection.js';

const app = express()
const port = 3030
const socketPort = 3031;

const httpServer = createServer(app);

app.use(cors());
app.use(bodyParser.json())
app.use(allRoutes);

app.get('/getDHKey', (req, res) => {
    res.json({ dhKey: 'dhKey' })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

httpServer.listen(socketPort);

const socketIO = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("join", async ({ token }) => {
        try {
            socket.join('room');
            const [history] = await dbCon.query(`SELECT message_history.user_id, message, created_at, username
                                                FROM message_history
                                                LEFT JOIN users ON message_history.user_id = users.id`);
            socket.emit('history', { messages: history });
        } catch (error) {
            console.error('Erreur MySQL :', error);
        }
    });

    socket.on('newMessage', async ({ user, message }) => {
        try {
            const u = (await dbCon.query(
                `SELECT u.username, u.id 
                FROM sessions s
                LEFT JOIN users u ON s.user_id = u.id
                WHERE session_id = ?`, [user]))[0][0];

            socketIO.in('room').emit('newMessage', { message, user_id: u.id, username: u.username });
            await dbCon.query(
                'INSERT INTO message_history (user_id, message, created_at) VALUES (?, ?, ?)',
                [u.id, message, new Date()]
            );
        } catch (error) {
            console.error('Err :', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});