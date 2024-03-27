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
} from "react95";
import Loading from "../loading";
import { useStore, initializeUserData } from "../../context/userContext";
import { supabaseClient } from "../../supabase/supabaseClient";
import Filter from "bad-words";
import styled from "styled-components"; // Import styled-components

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
  max-width: 80%;
  background-color: ${({ isUser }) => (isUser ? "#DCF8C6" : "#ECECEC")};
  margin-bottom: 10px;
  text-align: left;
  align-self: ${({ isUser }) => (isUser ? "flex-end" : "flex-start")};
  display: inline-block;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Messenger = () => {
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const [channels, setChannels] = useState(["General", "Random", "Help"]); // Example channel names
  const [selectedChannel, setSelectedChannel] = useState("General"); // Default channel
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userData = useStore((state) => state.userData);
  const scrollViewRef = useRef();
  const filter = new Filter();

  useEffect(() => {
    if (!userData) initializeUserData();
  }, [userData]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchMessages = async () => {
      if (!selectedChannel) return;

      console.log("Fetching messages for channel:", selectedChannel);
      const { data, error } = await supabaseClient
        .from("messages")
        .select("*")
        .eq("channel", selectedChannel.toLowerCase())
        .order("tm_created", { ascending: true })
        .limit(50); // Example limit, adjust based on your needs

      console.log("Fetched messages", data);

      if (error) {
        console.error("Fetching messages error:", error);
      } else if (isSubscribed) {
        setMessages(data);
      }
    };

    const initChannel = async (channelName) => {
      if (channel) channel.unsubscribe(); // Unsubscribe from the previous channel

      // Initialize and subscribe to the new channel
      const newChannel = supabaseClient.channel(channelName);
      console.log("Channel created", newChannel);

      console.log("Selected channel here:", selectedChannel);
      await fetchMessages(); // Fetch messages for the selected channel
      newChannel
        .on("broadcast", { event: "chat" }, (payload) => {
          // Filter or directly set messages for the selected channel
          console.log("New message received", payload.payload);
          setMessages((prevMessages) => [...prevMessages, payload.payload]);
        })
        .subscribe();

      setChannel(newChannel);
      setLoading(false);
    };

    setMessages([]); // Clear messages from the previous channel
    initChannel(selectedChannel.toLowerCase()); // Re-initialize channel subscription

    return () => {
      isSubscribed = false;
    };
  }, [selectedChannel]); // Dependency array includes selectedChannel

  useLayoutEffect(() => {
    if (scrollViewRef.current) {
      const scrollElement = scrollViewRef.current;
      // This line ensures the scroll position is moved to the bottom
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]); // Runs this effect after messages update

  const handleChange = (e) => setMessage(e.target.value);

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

  const handleChannelChange = (e) => {
    setSelectedChannel(e.value);
    setMessages([]); // Clear messages when changing channels
  };

  const generateColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 75%, 60%)`;
    return color;
  };

  if (loading) return <Loading />;

  return (
    <StyledWindow style={{ flex: 1, width: 320 }}>
      <StyledWindowHeader>Insieme Live Messenger</StyledWindowHeader>
      <WindowContent
        style={{
          overflow: "auto",
          flex: 1, // Make WindowContent fill the available space
          display: "flex", // Enable flex layout
          flexDirection: "column", // Stack children vertically
        }}
      >
        <GroupBox
          label="Select Channel"
          style={{
            marginBottom: "10px",
          }}
        >
          <Select
            defaultValue={selectedChannel}
            value={selectedChannel}
            onChange={handleChannelChange}
            options={channels.map((channel) => ({
              label: channel,
              value: channel,
            }))}
            width="100%"
          />
        </GroupBox>
        Chat with anyone here from RVFOP! Note: This is a public chat.
        <div>
          <Frame
            variant="field"
            style={{
              marginTop: "1rem",
              padding: "1rem",
              flex: 1,
              height: "60vh",
              width: "100%",
            }}
          >
            <div>
              <ScrollView
                ref={scrollViewRef} // Attach the ref to the ScrollView
                style={{
                  height: "50vh",
                  overflow: "auto", // Keep existing styles
                }}
              >
                {messages.map((message, index) => (
                  <div
                    key={index} // It's better to use a unique identifier like message.id if available
                    style={{
                      display: "flex", // Aligns avatar and message content horizontally
                      flexDirection:
                        message.user_id === userData.id ? "row-reverse" : "row", // Conditionally change direction
                      alignItems: "flex-start", // Align items at the start of the cross axis
                      gap: "10px", // Adds space between avatar and text
                      marginBottom: "10px", // Adds space between messages
                      textAlign:
                        message.user_id === userData.id ? "right" : "left", // Align text to the right for user's messages
                    }}
                  >
                    <Avatar
                      style={{
                        background: generateColorFromName(message.user_id),
                      }}
                      size={40}
                    >
                      {message.name[0]}
                    </Avatar>
                    <MessageBubble isUser={message.user_id === userData.id}>
                      <div>
                        <strong>{message.name}</strong>
                      </div>
                      <div>{message.message}</div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          marginTop: "5px",
                          opacity: 0.6,
                        }}
                      >
                        {new Date(message.tm_created).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false, // Use `true` for AM/PM format, `false` for 24-hour format
                          }
                        )}{" "}
                      </div>
                    </MessageBubble>
                  </div>
                ))}
              </ScrollView>
              <div style={{ display: "flex" }}>
                <TextInput
                  value={message}
                  placeholder="Type here..."
                  onChange={handleChange}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                      e.preventDefault(); // Prevent the default action to stop the form from submitting
                    }
                  }}
                  fullWidth
                />
                <Button onClick={handleSend} style={{ marginLeft: 4 }}>
                  Send
                </Button>
              </div>
            </div>
          </Frame>
        </div>
      </WindowContent>
    </StyledWindow>
  );
};
export default Messenger;
