const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

 

const { username, room } = Qs.parse(location.search , {
    ignoreQueryPrefix:true,
})

function outputMessage(message){
    const div =  document.createElement('div');
    div.innerHTML = `<div class="message"><p class="meta"> ${message.username} <span>${message.time}</span></p><p class="text">${message.text}</p></div>`;
    document.querySelector('.chat-messages').appendChild(div);
}

const socket = io();
socket.emit('joinRoom',{ username, room });

// 
socket.on('message', (message) => {
    console.log(message);
 });
// message from server display message
socket.on('messageDisplay', (message) => {
   outputMessage(message);
   chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

  // Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
  }
  
  // Add room name to DOM
  function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
  
  //Prompt the user before leave chat room
  document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });

// listen to form sumbit
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    let msg = e.target.elements.msg.value;
    
    //send message emit  
    socket.emit('messageSend', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

