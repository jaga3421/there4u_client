import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  TextField,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import LoadingDots from "./LoadingDots";

import dotenv from "dotenv";
dotenv.configDotenv();

const backEndUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/chat`;
console.log(backEndUrl);

const ChatBox = () => {
  // Get allMessage from localstorage if it exists and set it to state allMessages
  // If it doesn't exist, set allMessages to an empty array
  const [allMessages, setAllMessages] = useState(
    JSON.parse(localStorage.getItem("allMessages")) || []
  );
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatStatus, setChatStatus] = useState("idle");
  const [serveErr, setServerErr] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();
    const newMessage = {
      role: "user",
      content: currentMessage,
    };

    setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    localStorage.setItem("allMessages", JSON.stringify(allMessages));

    setCurrentMessage("");
    setChatStatus("sent");

    try {
      let toSend = [...allMessages, newMessage];
      if (toSend.length > 20) {
        // choose only the last 20 messages
        toSend = toSend.slice(-20);
      }
      const response = await axios.post(backEndUrl, {
        messages: toSend,
      });

      if (response.status === 200) {
        console.log(...allMessages);
        const newMessage = {
          role: "system",
          content: response.data.message,
        };
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
        localStorage.setItem("allMessages", JSON.stringify(allMessages));
        setChatStatus("received");
      } else {
        setChatStatus("idle");
      }
    } catch (error) {
      console.error(error);
      setChatStatus("idle");
      setServerErr(true);
    }
  };

  useEffect(() => {
    let timeoutId;
    if (chatStatus === "sent") {
      timeoutId = setTimeout(() => {
        setChatStatus("typing");
      }, 1000);
    } else if (chatStatus === "received") {
      setChatStatus("online");
    }
    return () => clearTimeout(timeoutId);
  }, [chatStatus]);

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ zIndex: 999 }}>
        <Toolbar>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar src="https://upload.wikimedia.org/wikipedia/en/6/66/Matthew_Perry_as_Chandler_Bing.png" />
            <div style={{ marginLeft: "10px" }}>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Chandler Bing
              </Typography>

              <Typography
                variant="body2"
                fontSize={10}
                style={{ marginRight: "10px" }}
              >
                {serveErr ? "Offline" : "Online"}
              </Typography>
            </div>
            {/* Dark/Light theme switcher here */}
          </div>
        </Toolbar>
      </AppBar>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          maxHeight: "calc(100dvh - 64px)", // Subtracting the height of the AppBar
        }}
        ref={(div) => {
          if (div) {
            div.scrollTop = div.scrollHeight;
          }
        }}
      >
        {allMessages.map((msg, index) => (
          <div
            key={index}
            className={`user-${msg.role === "system" ? "bing" : "user"}`}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: msg.role !== "system" ? "flex-end" : "flex-start",
              marginLeft: msg.role === "system" ? "0" : "auto",
              width: "80%",
            }}
          >
            <Typography
              fontSize={9}
              style={{
                textAlign: msg.role === "system" ? "left" : "right",
                paddingLeft: msg.role === "system" ? "10px" : "0",
                paddingRight: msg.role === "system" ? "0" : "10px",
              }}
            >
              {msg.role === "system" ? "Chandler Bing" : "You"}
            </Typography>
            <Typography
              fontSize={14}
              style={{
                margin: "5px",
                padding: "10px",
                background: "#f1f0f0",
                textAlign: msg.role === "system" ? "left" : "right",
                borderRadius:
                  msg.role === "system"
                    ? "20px 20px 20px 0"
                    : "20px 20px 0 20px",
              }}
            >
              {msg.content}
            </Typography>
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        style={{ padding: "10px", display: "flex", position: "relative" }}
      >
        <div
          className="typing-indicator"
          style={{
            position: "absolute",
            top: "-10px",
            padding: "2px",
            fontSize: "8px",
            color: serveErr ? "red" : "initial",
            textAlign: serveErr ? "center" : "initial",
            width: "100%",
          }}
        >
          {chatStatus === "typing" && (
            <>
              Chandler is typing <LoadingDots />
            </>
          )}
          {serveErr && <div>Chandler is offline</div>}
        </div>
        <TextField
          variant="outlined"
          fullWidth
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          style={{ marginRight: "10px" }}
          autoFocus
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
        ></Button>
      </form>
    </div>
  );
};

export default ChatBox;
