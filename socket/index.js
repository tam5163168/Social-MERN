const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

// Function
const addUser = (userId, socketId) => {
  // nếu mà có 1 userId trùng thì nó sẽ không push
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Socket.io
io.on("connection", (socket) => {
  //when connect
  console.log("a user conencted");

  //take userId and socket from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log(users);
    io.emit("getUsers", users);
  });

  // send and get message
  // kiếm id người nhận của tất cả không phân biệt, rồi gửi lại chính cái sender và đoạn text đó
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  // when disconnnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    console.log(users, "disconnect");
    io.emit("getUsers", users);
  });
});
