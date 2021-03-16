import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Widget as ChatWidget, addResponseMessage, addUserMessage } from '@du201/react-chat-widget';
import axios from 'axios';

import '@du201/react-chat-widget/lib/styles.css';
import './Chat.css';

const client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/coursemeta/123');

function Chat() {
  let [input, setInput] = useState(""); // message input
  let [currentRoom, setCurrentRoom] = useState("");

  useEffect(() => {
    // connect to the server
    client.onopen = function (event) {
      console.log("successfully connected to the server");
    };

    // listen to the messages from the server
    client.onmessage = function (message) {
      let messageFromServer = JSON.parse(message.data);
      console.log('receiving message: ');
      console.log(messageFromServer);
      if (messageFromServer.sender) { // if the sender of the message is this instance itself
        addUserMessage(messageFromServer.message.text, messageFromServer.user.username, messageFromServer.message.timestamp); // display the message on the right side
      } else {
        addResponseMessage(messageFromServer.message.text, messageFromServer.user.username, messageFromServer.message.timestamp);
      }
    };
  }, []);

  // Pull in chat history when changing chatroom
  useEffect(() => {
    console.log("hello");
    axios.get('http://127.0.0.1:8000/api/chat/coursemeta/123?page=2')
      .then(res => {
        let chatHistory = res.data.results;
        chatHistory.reverse().forEach((message) => {
          let date = new Date(message.message.timestamp);
          addResponseMessage(message.message.text, message.user.username, convertTimeFormat(date));
        });
      });
  }, [currentRoom]);

  /**
   * Convert Date() object to the date string format that I want
   */
  let convertTimeFormat = (date) => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  /**
   * Triggered when a new message is sent from the message input
   * @param {string} newMessage 
   */
  const handleNewUserMessage = (newMessage) => {
    setInput('');
    let messageObj = { message: { text: newMessage, timestamp: Date() } };
    client.send(JSON.stringify(messageObj));
  };

  /**
   * Triggered when any text is inputed to the message input
   */
  let handleTextInputChange = (e) => {
    if (e.target !== undefined) {
      setInput(e.target.value);
    }
  }

  /**
   * When a key press is heard from the message input. Used to detect "ENTER" keystroke
   * and clear the input
   */
  let onKeyPress = (e) => {
    if (e.key === "Enter") {
      setTimeout(() => setInput(""), 10); // this is requried to not block sending messege
    }
  }

  /**
   * When user selects an emoji from the emoji selection panel
   */
  let handleSelectEmoji = (emoji) => {
    let newInput = input + emoji.native;
    setInput(newInput);
  };

  /**
   * change the current selected chatting room
   */
  let handleRoomSelect = (e) => {
    console.log(e.key);
    setCurrentRoom(e.key);
  };
  return (
    <div>
      <ChatWidget
        handleNewUserMessage={handleNewUserMessage}
        title="ECE666"
        subtitle=""
        showEmoji={true}
        input={input}
        handleTextInputChange={handleTextInputChange}
        setInput={onKeyPress}
        handleSelectEmoji={handleSelectEmoji}
        handleRoomSelect={handleRoomSelect}
        currentRoom={currentRoom}
        courseChatRooms={["ece437", "ece301", "ece302"]}
        privateChatRooms={["William", "Andy", "John"]}
      />
    </div>
  );
}

export default Chat;
