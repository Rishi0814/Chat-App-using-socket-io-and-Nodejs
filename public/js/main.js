// import { io } from "socket.io-client";
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io("http://localhost:3000");

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg.value;
  msg = msg.trim();
  if (!msg) {
    return false;
  }
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  
  const p = document.createElement("p");
  p.classList.add("meta");
  
  const spanUsername = document.createElement("span");
  spanUsername.classList.add("username");
  spanUsername.innerText = message.username;
  
  const spanTime = document.createElement("span");
  spanTime.classList.add("time");
  spanTime.innerText = message.time;
  
  p.appendChild(spanUsername);
  p.appendChild(spanTime);
  
  div.appendChild(p);
  
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  
  div.appendChild(para);
  
  // Set message alignment based on sender or receiver
  if (message.username === username) {
    div.classList.add("sender");
    p.classList.add("text-right");
    spanTime.classList.add("ml-2");
  } else {
    div.classList.add("receiver");
    p.classList.add("text-left");
    spanTime.classList.add("mr-2");
  }
  
  document.querySelector(".chat-messages").appendChild(div);
}


function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
