const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');
const { Socket } = require('dgram');
const mongoose = require('mongoose');

/*CREANDO UN SERVIDOR CON HTTP+EXPRESS*/
const app = express();
const server = http.createServer(app);

/*CONECTO SOCKETIO CON EL SERVIDOR*/
const io = socketio.listen(server);

/*CONECT TO MONGODB*/
mongoose.connect('mongodb+srv://adriana:adriana@cluster0.dwuia.mongodb.net/chat?retryWrites=true&w=majority',{ useNewUrlParser: true , useUnifiedTopology: true})//ES "MONGODB" NO JUST MONGO
    .then(db => console.log('db is connected'))
    .catch(err => console.log(err));

/*CONFIGURACIONES*/
app.set('port',process.env.PORT || 3000);

//Inicio conexión de WebSockets
require('./sockets')(io);
/*io.on('connection',socket =>{
    console.log('new user connected');
});*/

/*INICIO EL SERVIDOR*/
const PORT=app.get('port');
server.listen(PORT, ()=>{
    console.log('server on port '+PORT);
});
//console.log(path.join(__dirname,'public'));
/*ENVIO TODO EL HTML+CSS+JS*/
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public')));//Path.join() para unir rutas en Win o Lin, require >>'path'<<
