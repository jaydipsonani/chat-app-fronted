import { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("https://chat-app-backend-lyart.vercel.app");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState("")

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
      <div className="joinChatContainer">
        <h3>Join A Room</h3>
        <input
          type="text"
          placeholder="John..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="room ID..."
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join</button>
      </div>
      ) : (
        <Chat username={username} socket={socket} room={room} />
      )
      }

    </div>
  );
}

export default App;
