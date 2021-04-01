import { Widget as ChatWidget, addResponseMessageToBottom, addUserMessageToBottom, addResponseMessageToTop, addUserMessageToTop, setQuickButtons, toggleMsgLoader, addLinkSnippet, dropMessages } from '@du201/react-chat-widget';
import '@du201/react-chat-widget/lib/styles.css';
import './Chat.css';




import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'


const client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/coursemeta/123');
let loading = false; // whether the chat is loading history

function Chat() {
  let [input, setInput] = useState(""); // message input
  let [currentRoom, setCurrentRoom] = useState(""); // the current chat room
  let [moreHistoryToLoad, setMoreHistoryToLoad] = useState(false); // when there is more chat history page to load from the server
  let [nextHistoryPageToLoad, setNextHistoryPageToLoad] = useState(1); // the page index of the next history page to load from the server

  // Initial connection
  useEffect(() => {

    // connect to the server
    client.onopen = function (event) {
      console.log("successfully connected to the server");
    };

    // listen to the messages from the server
    client.onmessage = function (message) {
      let messageFromServer = JSON.parse(message.data);
      let date = new Date(messageFromServer.message.timestamp);
      if (messageFromServer.sender) { // if the sender of the message is this instance itself
        addUserMessageToBottom(messageFromServer.message.text + ' ' + messageFromServer.id, messageFromServer.user.username, convertTimeFormat(date)); // display the message on the right side
      } else {
        addResponseMessageToBottom(messageFromServer.message.text + ' ' + messageFromServer.id, messageFromServer.user.username, convertTimeFormat(date)); // display the message on the left side
      }
    };

  }, []);

  // Pull in chat history when changing chatroom
  useEffect(() => {

    // if room selection is not empty
    if (currentRoom !== "") {

      // empty the chat window
      dropMessages();

      // display the loading sign
      toggleMsgLoader();

      // by default, assume no chat history when switch to a new chat room, and start loading from page 1
      setMoreHistoryToLoad(false);
      setNextHistoryPageToLoad(1);

      // todo: 123 needs to be replaced with real chat room number
      axios.get(`http://127.0.0.1:8000/api/chat/coursemeta/${123}?page=${1}`).then(res => {

        // check the existence of chat history
        if (res.data.count !== 0) {

          // if chat history exists, load the messenges
          let chatHistory = res.data.results;

          chatHistory.forEach((message) => {
            let date = new Date(message.message.timestamp);
            console.log(message);
            addResponseMessageToTop(message.message.text + ' ' + message.id, message.user.username, convertTimeFormat(date)); // todo: ask William to add "sender" data
          });

          // undisplay the loading sign
          toggleMsgLoader();

          // check whether more history exists
          if (res.data.next !== null) {
            setMoreHistoryToLoad(true);
            setNextHistoryPageToLoad(nextHistoryPageToLoad + 1);
          }
        }
      });

    }
  }, [currentRoom]);

  /**
   * Convert Date() object to the date string format that I want
   */
  let convertTimeFormat = (date) => {
    let hourMinutes = "";

    // date.getHours() returns a number between 0 and 23
    switch (date.getHours()) {
      case 0:
        hourMinutes = "" + (12) + ":" + date.getMinutes() + " AM";
        break;
      case 12:
        hourMinutes = "" + (12) + ":" + date.getMinutes() + " PM";
        break;
      default:
        if (date.getHours() > 12) {
          hourMinutes = "" + (date.getHours() - 12) + ":" + date.getMinutes() + " PM";
        } else {
          hourMinutes = "" + (date.getHours()) + ":" + date.getMinutes() + " AM";
        }
        break;
    }

    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear().toString().substring(2, 4) + ', ' + hourMinutes;
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
    // console.log(e.key);
    setCurrentRoom(e.key);
  };

  /**
   * When the chat window is scrolled to the top
   */
  let handleScrollToTop = () => {
    // console.log("before enter: " + loading);
    if (moreHistoryToLoad && !loading) {
      loading = true; // grab lock
      // console.log(nextHistoryPageToLoad, moreHistoryToLoad, loading);
      toggleMsgLoader();
      axios.get(`http://127.0.0.1:8000/api/chat/coursemeta/123?page=${nextHistoryPageToLoad}`).then(res => {

        // check the existence of chat history
        if (res.data.count !== 0) {

          // if chat history exists, load the messenges
          let chatHistory = res.data.results;
          chatHistory.forEach((message) => {
            let date = new Date(message.message.timestamp);
            console.log(message);
            addResponseMessageToTop(message.message.text + ' ' + message.id, message.user.username, convertTimeFormat(date));
          });

          toggleMsgLoader();

          // check whether more history exists
          if (res.data.next !== null) {
            setMoreHistoryToLoad(true);
            setNextHistoryPageToLoad(nextHistoryPageToLoad + 1);
          } else {
            setMoreHistoryToLoad(false);
          }
        }

        loading = false; // release lock
      });
    }
  }

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
        handleScrollToTop={handleScrollToTop}
        courseChatRooms={["ece437", "ece301", "ece302"]}
        privateChatRooms={["William", "Andy", "John"]}
        loading={loading}
      />
    </div>
  );
}

export default Chat;
