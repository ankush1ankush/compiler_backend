
const express =require("express");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors=require("cors");
const app = express();
const{connectMongoDb}=require("./connectDB/connection")
require('dotenv').config();
const ACTIONS = require("./utils/Actions")
const apiRouter = require("./routes")
const server = createServer(app);
const io = new Server(server);
app.use(cors());
app.use(express.json());

connectMongoDb(process.env.MONGOURI).catch(err => console.log(err));

const userSocketMap ={};

const getAllConnectedClients = (roomId)=>{
    return Array.from( io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId)=>{
            return {
               socketId,
               username : userSocketMap[socketId],
            }
        }
    )
}

io.on('connection', (socket) => {
     console.log('a user connected', socket.id);
     socket.on(ACTIONS.JOIN,({roomId,userName})=>{
        userSocketMap[socket.id]=userName;
        socket.join(roomId) // joinning the socket in
        const clients = getAllConnectedClients(roomId); // getting all socket present in this room
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                userName,
                socketId : socket.id
            }) 
        })
        console.log(" clients :");
        console.log(clients)
        socket.join(roomId);   // joinning the current socket the roomID 
     })
     socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms];
        
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
     })
});

app.use('/',apiRouter())

server.listen(process.env.PORT || 5000,()=>{
    console.log("listenning to the port no 5000")
})
