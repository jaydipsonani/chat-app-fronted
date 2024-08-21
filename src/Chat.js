import React, { useEffect, useState } from "react";
import ScrollToBottom from 'react-scroll-to-bottom' 
const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const hours = String(new Date(Date.now()).getHours()).padStart(2, "0");
  const minutes = String(new Date(Date.now()).getMinutes()).padStart(2, "0");

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: hours + ":" + minutes,
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("")
    }
  };

  useEffect(() => {
    // When joining the room, retrieve previous messages
    socket.on("previous_messages", (messages) => {
      setMessageList(messages);
    });

    // Listen for new messages
    socket.on("receive-message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    // Clean up the socket listeners on component unmount
    return () => {
      socket.off("previous_messages");
      socket.off("receive-message");
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>join a room</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
        {messageList.map((messageContent) => {
          return (
            <div
              className="message"
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="type a message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
