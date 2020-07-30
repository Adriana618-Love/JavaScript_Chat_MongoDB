$(function(){
    const socket = io();

    //Obteniendo elementos del DOM
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');
    //Obteniendo elementos del Formulario
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickName = $('#nickname');

    const $users = $('#usernames');
    $nickForm.submit(e=>{
        e.preventDefault();
        socket.emit('new user', $nickName.val(), data =>{
            if(data){
                $('#nickWrap').hide();
                $('#contentWrap').show();
                $('#sesionName').html(`<b>${$nickName.val()}</b>`);
            }else{
                $nickError.html(`
                <div class="alert alert-danger">
                    That username already exits.
                </div>
                `)
            }
            $nickName.val('');
        });
    });
    //eventos
    $messageForm.submit(e => {
        e.preventDefault();
        const message = $messageBox.val();
        socket.emit('send message',message, data=>{
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    socket.on('new message',function (data){
        displayMsg(data,'');
    });
    socket.on('usernames',data=>{
        let html = '';
        for(let i=0;i<data.length; i++){
            html += `<p><i class="fas fa-user"></i>${data[i]}</p>`;
        }
        $users.html(html);
    });
    socket.on('whisper',data=>{
        displayMsg(data,'whisper');
    });
    socket.on('load old msg',data=>{
        data.forEach(msg => {
            displayMsg(msg,'');
        });
    })
    function displayMsg(data,clase){
        $chat.append(`<p class=${clase}><b>${data.nick}</b>:${data.msg}</p>`);
    }
})