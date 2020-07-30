const Chat = require('./models/Chat');
//Importé una función
module.exports = function(io){
    let users = {};

    io.on('connection', async (socket) => {
        console.log('new user connected');
        let messages = await Chat.find({});
        socket.emit('load old msg',messages);
        //Recibo el mensaje de someone
        socket.on('send message',async (data,cb) => {
            var msg = data.trim();
            if(msg.substr(0,3)==='/w '){
                msg = msg.substr(3);
                let index = msg.indexOf(' ');
                if(index>-1){
                    var name = msg.substr(0,index);
                    msg = msg.substr(index+1);
                    if(name in users){
                        users[name].emit('whisper',{
                            msg,
                            nick:socket.nickname
                        });
                        return;
                    }else{
                        cb('Error! Please enter a valid user');
                    }
                }else{
                    cb('Error! Bad whisper');
                }
            }
            var newMsg = new Chat({
                msg: msg,
                nick: socket.nickname
            });
            await newMsg.save();
            io.sockets.emit('new message',{
                msg:data,
                nick:socket.nickname
            });//cuidado es io.sockets no io.socket
        });
        socket.on('new user',function (data,cb) {
            //console.log(data);
            if(data in users){
                cb(false);
            }else{
                cb(true);
                socket.nickname = data;//Le doy la propiedad
                users[socket.nickname]=socket;
                updateNickName();
            }
        });
        socket.on('disconnect',data=>{
            if(!socket.nickname)return;
            //usernames.splice(usernames.indexOf(socket.nickname),1);//Elimino solo 1 nickname iniciando desde la posición indexOf
            delete users[socket.nickname];
            updateNickName();
        });
        
        function updateNickName() {
            io.sockets.emit('usernames',Object.keys(users));
        }
    });

}