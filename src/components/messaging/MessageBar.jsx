import React, { Component } from "react";
import "../../styles/MessageBar.css";
import { TiEdit } from "react-icons/ti";
import { BsThreeDots } from "react-icons/bs";
import { MdClose, MdSend } from "react-icons/md";
import io from "socket.io-client";

const connOpt = {
  transports: ["websocket"],
  query: "token=" + localStorage["accessToken"]
}
let socket = io("http://localhost:3002", connOpt)


export class MessageBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: [],
      bottom: 0,
      showChatbox: false,
      senderID: "",
      senderToken: "",
      senderSocketID: "",
      recipientID: "",
      recipientUsername: "",
      message: "",
      messages: [],
      currentChatMessages: [],
      check: true,
    };
  }

  bufferToBase64(buf) {
    var binstr = Array.prototype.map
      .call(buf, function (ch) {
        return String.fromCharCode(ch);
      })
      .join("");
    return btoa(binstr);
  }

  componentDidMount = async () => {
    // Setting the username of the current user logged into the application
    this.setCurrentLogged_id()

    let response = await fetch(`http://localhost:3002/user`)
    let parsedJson = await response.json();
    console.log(parsedJson)

    this.setState({ connections: parsedJson });

    const token = localStorage.getItem("accessToken")
    console.log("This is the socket id: " + socket.id)
    this.setState({
      senderToken: token,
      senderSocketID: socket.id
    })    

    // Messages
    let messagesResponse = await fetch("http://localhost:3002/messages/");

    let messages = await messagesResponse.json();
    console.log("Thise are the messages: ", messages);
    this.setState({ messages: messages });

    socket.on("connect", () => {
    });

    socket.emit("setUsername", {
      username: this.state.senderUsername,
    });

    socket.on("privateMessage", (msg) =>
      this.setState({
        messages: this.state.messages.concat(msg),
        check: false,
      })
    );
  };

  // Insert the live messages displayng function
  componentDidUpdate = async() => {

  }

  // Set the _id of the current logged user (senderID)
  setCurrentLogged_id = async() => {
    const token = localStorage.getItem("accessToken")
    const response = await fetch("http://localhost:3002/user/bytoken/" + token)
    const parsedResponse = await response.json()
    console.log("The username is : " + parsedResponse._id)
    this.setState({
      senderID: parsedResponse._id
    })
  }

  setCurrentOpenChat_id = async() => {
    const username = this.state.recipientUsername
    const response = await fetch("http://localhost:3002/user/byUsername/" + username)
    const parsedResponse = await response.json()
    console.log(parsedResponse._id)
    this.setState({
      recipientID: parsedResponse._id
  })
}

  setChatMessages = async() => {
    const allMessages = this.state.messages
    const currentMessages = allMessages.filter((message) => 
      (message.from === this.state.recipientID && message.to === this.state.senderID)
      ||
      (message.from === this.state.senderID && message.to === this.state.recipientID)

    )
    console.log(currentMessages)
    this.setState({
      currentChatMessages: currentMessages
    })
  }


  handleMessaging = () => {
    if (this.state.bottom === 0) {
      this.setState({ bottom: -245 });
    } else {
      this.setState({ bottom: 0 });
    }
  };


  openChatbox = (name, username) => {
    this.setState(
      { 
        showChatbox: true, 
        recipientName: name, 
        recipientUsername: username 
      }
    );

  this.setCurrentOpenChat_id()
  this.setCurrentLogged_id()
  this.setChatMessages()
};

  closeChatbox = () => {
    this.setState({ showChatbox: false, recipientName: "", currentChatMessages: [] });
  };



  updateMessage = (e) => {
    this.setState({ message: e.currentTarget.value });
  };

  sendMessage = (e) => {
    e.preventDefault();
    if (this.state.message !== "") {
      socket.emit("privateMessage", {
        from: this.state.senderToken,
        to: this.state.recipientUsername,
        text: this.state.message,
      });
      this.setState({ message: "" });
    }
  };

  render() {
    return (
      <>
        <div id="message" style={{ bottom: `${this.state.bottom}px` }}>
          <div id="messagebar">
            <div id="header">
              <img src="" alt="" />
              <p onClick={this.handleMessaging}>Messaging</p>
            </div>
            <div id="icons">
              <p>{<TiEdit />}</p>
              <p>{<BsThreeDots />}</p>
            </div>
          </div>
          <div id="connections">
            {this.state.connections.filter((connection) => (connection._id !== this.state.senderID)).map((connection) => {
              return (
                <div id="connection">
                  <img
                    src={`data:image/jpeg;base64,${connection.image}`}
                    alt="image"
                  />
                  <a onClick={() => this.openChatbox(connection.name, connection.username)}>
                    {connection.name}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
        {this.state.showChatbox ? (
          <div id="chatbox">
            <div id="header">
              <div id="name">
                <p>{this.state.recipientName}</p>
              </div>
              <div id="icons">
                <p>{<TiEdit />}</p>
                <p onClick={this.closeChatbox}>{<MdClose />}</p>
              </div>
            </div>
            <div id="chat">
              <div id="messages">
                {this.state.currentChatMessages.map((message) => {
                  return (
                    <p
                      className={
                        message.from === this.state.senderID
                          ? "text-right"
                          : "text-left"
                      }
                    >
                      {message.text}
                    </p>
                  );
                })}
              </div>
              <div id="input">
                <input
                  type="text"
                  value={this.state.message}
                  onChange={this.updateMessage}
                />
                <p onClick={this.sendMessage}>{<MdSend />}</p>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default MessageBar;
