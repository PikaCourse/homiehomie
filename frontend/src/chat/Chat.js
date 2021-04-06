import { Widget as ChatWidget, addResponseMessageToBottom, addUserMessageToBottom, addResponseMessageToTop, addUserMessageToTop, setQuickButtons, toggleMsgLoader, addLinkSnippet, dropMessages, currentDistanceToBottom, resumeDistanceToBottom } from '@du201/react-chat-widget';
import '@du201/react-chat-widget/lib/styles.css';
import './Chat.css';




import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'


const client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/room/2');

function Chat() {
  let [input, setInput] = useState(""); // message input
  let [currentRoom, setCurrentRoom] = useState(""); // the current chat room. The default value has to be "", cuz it's used as a check in handleRoomSelect
  let [moreHistoryToLoad, setMoreHistoryToLoad] = useState(false); // when there is more chat history page to load from the server
  let [nextHistoryPageToLoad, setNextHistoryPageToLoad] = useState(1); // the page index of the next history page to load from the server
  let [loading, setLoading] = useState(false); // whether the chat is loading history
  let [privateChatRooms, setPrivateChatRooms] = useState([]);
  let [publicChatRooms, setPublicChatRooms] = useState([]);

  // Initial connection
  useEffect(() => {

    // ! manually create a chat room


    // retrieve all the room data
    axios.get(`http://127.0.0.1:8000/api/chat/rooms`).then(res => {
      // console.log(res)
      for (let i = 0; i < res.data.count; i++) {
        if (res.data.results[i].is_private) {
          let rooms = [...privateChatRooms];
          rooms.push(res.data.results[i])
          setPrivateChatRooms(rooms);
        } else {
          let rooms = [...publicChatRooms];
          rooms.push(res.data.results[i])
          setPublicChatRooms(rooms);
        }
      }
    })

    // connect to the server
    client.onopen = function (event) {
      console.log("successfully connected to the server");
    };

    // listen to the messages from the server
    client.onmessage = function (message) {
      let messageFromServer = JSON.parse(message.data);
      displayMessage({ message: messageFromServer, isHistoryMessage: false });
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

      axios.get(`http://127.0.0.1:8000/api/chat/rooms/${getRoomId(currentRoom)}/messages?page=${1}`).then(res => {

        // check the existence of chat history
        if (res.data.count !== 0) {

          // if chat history exists, load the messenges
          let chatHistory = res.data.results;

          chatHistory.forEach((message) => {
            console.log(message);
            displayMessage({ message: message, isHistoryMessage: true });
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
   * get the room id from the currentRoom state
   */
  let getRoomId = (targetRoom) => {

    let publicRoom = publicChatRooms.find(room => room.name === targetRoom);
    let privateRoom = privateChatRooms.find(room => room.name === targetRoom);
    if (publicRoom && privateRoom) {
      throw "the currentRoom's name is in both public and private room! duplicate name";
    } else if (publicRoom) {
      return publicRoom.id;
    } else if (privateRoom) { // if the currentRoom is not a public room (== a private room)
      return privateRoom.id;
    }
  }

  /**
   * 
   * display the message according to its sender and also whether it is history message
   */
  let displayMessage = ({ message, isHistoryMessage }) => {
    let date = new Date(message.message.timestamp);
    if (message.sender) { // if the sender of the message is this instance itself
      if (isHistoryMessage) addUserMessageToTop(message.message.text + ' ' + message.id, message.user.username, convertTimeFormat(date));
      else addUserMessageToBottom(message.message.text + ' ' + message.id, message.user.username, convertTimeFormat(date)); // display the message on the right side
    }
    else {
      if (isHistoryMessage) addResponseMessageToTop(message.message.text + ' ' + message.id, message.user.username, convertTimeFormat(date));
      else addResponseMessageToBottom(message.message.text + ' ' + message.id, message.user.username, convertTimeFormat(date)); // display the message on the left side
    }
  };

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

    // when it is not the first room select && when select a new chat room
    if (currentRoom !== "" && e.key !== currentRoom) {
      // tells the server that I left this chatroom
      axios.post(`http://127.0.0.1:8000/api/chat/rooms/${getRoomId(currentRoom)}/leave`).then(res => {
        console.log(res);
      })

      // tells the server that I joined this chatroom
      axios.post(`http://127.0.0.1:8000/api/chat/rooms/${getRoomId(e.key)}/join`).then(res => {
        console.log(res);
      })
    }

    setCurrentRoom(e.key);
  };

  /**
   * When the chat window is scrolled to the top (have used "loading" variable to prevent load the same history page several times)
   */
  let handleScrollToTop = () => {
    // console.log("before enter: " + loading);
    if (moreHistoryToLoad && !loading) {
      setLoading(true);
      // loading = true; // grab lock
      // console.log(nextHistoryPageToLoad, moreHistoryToLoad, loading);
      toggleMsgLoader();
      axios.get(`http://127.0.0.1:8000/api/chat/rooms/${getRoomId(currentRoom)}/messages?page=${nextHistoryPageToLoad}`).then(res => {

        // check the existence of chat history
        if (res.data.count !== 0) {

          // store scroll position
          let distanceToBottom = currentDistanceToBottom();
          // console.log("to bottom: " + distanceToBottom);

          // if chat history exists, load the messenges
          let chatHistory = res.data.results;
          chatHistory.forEach((message) => {
            console.log(message);
            displayMessage({ message: message, isHistoryMessage: true });
          });

          toggleMsgLoader();

          // resume scroll position
          // console.log("restore: " + distanceToBottom);
          resumeDistanceToBottom(distanceToBottom);

          // check whether more history exists
          if (res.data.next !== null) {
            setMoreHistoryToLoad(true);
            setNextHistoryPageToLoad(nextHistoryPageToLoad + 1);
          } else {
            setMoreHistoryToLoad(false);
          }
        }

        setLoading(false);
        // loading = false; // release lock
      });
    }
  }

  /**
   * return an array of room names used for UI
   */
  let returnRoomNames = (rooms) => {
    return rooms.map((room) => room.name);
  }

  return (
    <div>
      <ChatWidget
        handleNewUserMessage={handleNewUserMessage}
        title=""
        subtitle=""
        showEmoji={true}
        input={input}
        handleTextInputChange={handleTextInputChange}
        setInput={onKeyPress}
        handleSelectEmoji={handleSelectEmoji}
        handleRoomSelect={handleRoomSelect}
        currentRoom={currentRoom}
        handleScrollToTop={handleScrollToTop}
        courseChatRooms={returnRoomNames(publicChatRooms)}
        privateChatRooms={returnRoomNames(privateChatRooms)}
        loading={loading}
      />
    </div>
  );
}

export default Chat;
