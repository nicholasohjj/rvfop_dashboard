import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Frame,
  Window,
  WindowContent,
  WindowHeader,
  ScrollView,
  TextInput,
  Button,
  Avatar,
  Select,
  GroupBox,
  Hourglass,
  Tooltip,
} from "react95";
import Loading from "../../loading";
import { useStore, initializeUserData } from "../../../context/userContext";
import { supabaseClient } from "../../../supabase/supabaseClient";
import Filter from "bad-words";
import styled from "styled-components"; // Import styled-components
import { useNavigate } from "react-router-dom";
import { fetchPrivateMessages } from "../../../supabase/services";
const StyledWindowHeader = styled(WindowHeader)`
  color: white; // Adjust the text color as needed for contrast
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledWindow = styled(Window)`
  flex: 1;
  width: 320px; // Example width, you can adjust as needed
  margin: 0 auto; // Center the window if its width is less than the container
  // Add more custom styles here
`;

const MessageBubble = styled.div`
  padding: 10px;
  border-radius: 20px;
  max-width: 80%; /* Adjust based on your layout */
  word-break: break-word; /* Ensure long words do not overflow */
  background-color: ${({ isUser }) => (isUser ? "#DCF8C6" : "#ECECEC")};
  margin-bottom: 10px;
  text-align: left;
  align-self: ${({ isUser }) => (isUser ? "flex-end" : "flex-start")};
  display: inline-block;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Matcher = () => {
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const [matching, setMatching] = useState(false);
  const [matched, setMatched] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(); // Default channel
  const [message, setMessage] = useState("");
  const [privateMessages, setPrivateMessages] = useState([]);
  const userData = useStore((state) => state.userData);
  const scrollViewRef = useRef();
  const filter = new Filter();
  const navigate = useNavigate();

  const initChannel = async (channelName) => {
    if (channel) channel.unsubscribe(); // Unsubscribe from the previous channel
    setPrivateMessages([]); // Clear messages from the previous channel
    // Initialize and subscribe to the new channel
    const newChannel = supabaseClient.channel(channelName);
    console.log("Channel created", newChannel);

    console.log("Selected channel here:", selectedChannel);

    if (channelName != "matcher") {
      const data = await fetchPrivateMessages(); // Fetch messages for the selected channel
      
    }
    newChannel
      .on("broadcast", { event: "chat" }, (payload) => {
        // Filter or directly set messages for the selected channel
        console.log("New message received", payload.payload);
        setPrivateMessages((prevMessages) => [...prevMessages, payload.payload]);
      })
      .subscribe();

    setChannel(newChannel);
  };

  useEffect(() => {
    if (!userData) initializeUserData();
  }, [userData]);

  useEffect(() => {

  }, [selectedChannel]); // Dependency array includes selectedChannel

  useLayoutEffect(() => {
    const scroll = () => {
      if (scrollViewRef.current) {
        const scrollElement = scrollViewRef.current;
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    };

    // Execute scroll to bottom on component mount and messages update
    scroll();
  }, [privateMessages.length]); // Dependency on messages.length ensures scroll updates with new messages

  const handleMatch = async () => {

    if (!matching) {
    await initChannel("matcher");
    setMatching(true);
    

    const { error } = await channel.send({
      type: "broadcast",
      event: "chat",
      user_id: userData.id,
    })

    console.log("Matching started", error);

    } else {

      if (channel) channel.unsubscribe();
      
      setMatching(false);
      setMatched(false);
      setChannel(null);
    }
    
      // if (!matching) {
      //   setMatching(true);
      //   setTimeout(() => {
      //     console.log("Navigating to the video");
      //     window.location.href =
      //       "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up%20(Official%20Music%20Video).mp4?t=2024-04-08T06%3A12%3A18.440Z";
      //   }, 1000);
      // }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const sanitizedMessage = filter.clean(message);

    console.log("Sending message:", sanitizedMessage);
    console.log("User data:", userData);
    console.log("Selected channel:", selectedChannel);

    const payload = {
      user_id: userData.id,
      name: userData.profile_name,
      message: sanitizedMessage,
      tm_created: new Date().toISOString(),
    };

    const { error } = await channel.send({
      type: "broadcast",
      event: "chat",
      payload,
    });

    // post the message on messages table
    const { data, error: postError } = await supabaseClient
      .from("messages")
      .insert([{ ...payload, channel: selectedChannel.toLowerCase() }])
      .single();

    if (error || postError) {
      console.error("Sending message error:", error, postError);
    } else {
      setMessages((prevMessages) => [...prevMessages, payload]);
      setMessage("");
    }
  };


  return (
    <StyledWindow style={{ flex: 1, width: 320 }}>
      <StyledWindowHeader
        onClick={() => {
          navigate("/message", { replace: true });
        }}
      >
        Insieme Live Messenger ❤️
      </StyledWindowHeader>
      <WindowContent
        style={{
          overflow: "auto",
          flex: 1, // Make WindowContent fill the available space
          display: "flex", // Enable flex layout
          flexDirection: "column", // Stack children vertically
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            margin: "10px",
          }}
        >
          Love is in the air! Find your match and start chatting.
        </div>
        <Button
          style={{
            margin: "10px",
          }}
          onClick={handleMatch}
        >
          {!matching ? "Match me!" : "Stop matching"}
        </Button>
        {!matched && matching && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            Finding a match for you...
            <Hourglass size={32} style={{ margin: 20 }} />
          </div>
          
        )}
      </WindowContent>
    </StyledWindow>
  );
};
export default Matcher;
