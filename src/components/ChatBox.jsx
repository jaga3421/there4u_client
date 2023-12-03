import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
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
  const [allMessages, setAllMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatStatus, setChatStatus] = useState("idle");

  const sendMessage = async (event) => {
    event.preventDefault();
    const newMessage = {
      role: "user",
      content: currentMessage,
    };
    console.log(currentMessage, newMessage);
    setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log(1, allMessages);

    setCurrentMessage("");
    setChatStatus("sent");

    try {
      const response = await axios.post(backEndUrl, {
        messages: [...allMessages, newMessage],
      });

      if (response.status === 200) {
        console.log(...allMessages);
        const newMessage = {
          role: "system",
          content: response.data.message,
        };
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
        console.log(allMessages);

        setChatStatus("received");
      } else {
        setChatStatus("idle");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let timeoutId;
    if (chatStatus === "sent") {
      timeoutId = setTimeout(() => {
        setChatStatus("typing");
      }, 2000);
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

              <Typography variant="body2" style={{ marginRight: "10px" }}>
                Online
              </Typography>
            </div>
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
            <p
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
            </p>
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
          }}
        >
          {chatStatus === "typing" && (
            <>
              Chandler is typing <LoadingDots />
            </>
          )}
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
