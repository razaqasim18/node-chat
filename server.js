
const express = require('express');
const http =  require('http');
const socketio = require('socket.io')
const formatMessage = require('./utility/messages');
const { userjoin,getCurrentuser,userLeave,roomUsers } = require('./utility/users');

const app = express();
const server = http.createServer(app); 
const io = socketio(server);


// set static folder
const path = require('path');
app.use(express.static(path.join(__dirname,'public')));

//socket connection
io.on('connection', (socket) => {
    console.log('io connection');

    socket.on('joinRoom',({ username, room }) => {
        const user = userjoin(socket.id, username, room);
        //Welcome message
        socket.emit('messageDisplay' ,formatMessage ('Bot','Welcome to chat'))
       
        const newuser = getCurrentuser(socket.id);
        //join to a specific room
        socket.join(newuser.room);
        //broatcast when message except the one who created
        // Broadcast when a user connects
        socket.broadcast.to(newuser.room).emit("messageDisplay",
        formatMessage('Bot', ` ${newuser.username} has joined the chat`)
        );

        io.to(newuser.room).emit("roomUsers", {
            room: newuser.room,
            users: roomUsers(newuser.room),
        });
    });
   
    //list for clint messageSend
    socket.on('messageSend',(msg) => {
        const user = getCurrentuser(socket.id);
        io.to(user.room).emit("messageDisplay", formatMessage(user.username, msg));
    })
    //broatcast when message with the one who created
    // io.emit();

    socket.on('disconnect', (username) => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit(
              "messageDisplay",
              formatMessage("Bot", ` ${user.username} has left the chat`)
            );

            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: roomUsers(user.room),
            });
        }      
    });
});

const port = 3000 || process.env.PORT;
server.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});