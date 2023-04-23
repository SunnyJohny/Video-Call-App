const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});

	console.log(`User Connected: ${socket.id}`);
	  
		socket.on("join_room", (data) => {
		  socket.join(data);
		  console.log(`User with ID: ${socket.id} joined room: ${data}`);
		});
	  
		socket.on("send_message", (data) => {
		  socket.to(data.room).emit("receive_message", data);
		});
	  
		socket.on("disconnect", () => {
		  console.log("User Disconnected", socket.id);
		});
	  
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

