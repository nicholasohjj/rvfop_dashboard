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
} from "react95";
import Loading from "../loading";
import { useStore, initializeUserData } from "../../context/userContext";
import { supabaseClient } from "../../supabase/supabaseClient";
import Filter from "bad-words";
import styled from "styled-components"; // Import styled-components
import { useNavigate } from "react-router-dom";

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
  const [selectedChannel, setSelectedChannel] = useState("General"); // Default channel
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userData = useStore((state) => state.userData);
  const scrollViewRef = useRef();
  const filter = new Filter();
  const navigate = useNavigate();

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
        .order("tm_created", { ascending: true });

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
    const scroll = () => {
      if (scrollViewRef.current) {
        const scrollElement = scrollViewRef.current;
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    };

    // Execute scroll to bottom on component mount and messages update
    scroll();
  }, [messages.length]); // Dependency on messages.length ensures scroll updates with new messages

  const handleChange = (e) => setMessage(e.target.value);

  const handleMatch = async () => {
    if (matching == false) {
      setMatching(true);
      console.log("Matching user:", userData);
    } else {
      setMatching(false);
      console.log("Stopping matching user:", userData);
    }
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

  const isNewDay = (currentMessageDate, previousMessageDate) => {
    const currentDate = new Date(currentMessageDate).setHours(0, 0, 0, 0);
    const previousDate = new Date(previousMessageDate).setHours(0, 0, 0, 0);
    return currentDate > previousDate;
  };

  if (loading) return <Loading />;

  return (
    <StyledWindow style={{ flex: 1, width: 320 }}>
      <StyledWindowHeader
      onClick={
        () => {
          navigate("/message", { replace: true });
      }}>Insieme Live Messenger (Matcher)</StyledWindowHeader>
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
        }}>
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
          
          }}>
          Finding a match for you...
          <Hourglass size={32} style={{ margin: 20 }} />
          </div>
        )}
        {matched && (
          
        <Frame
          variant="field"
          style={{
            marginTop: "1rem",
            flex: 1,
            width: "100%",
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            style={{
              height: "50vh",
              overflow: "auto",
            }}
          >
            {messages.map((message, index) => {
              const previousMessage = messages[index - 1];
              const isStartOfNewDay =
                index === 0 ||
                (previousMessage &&
                  isNewDay(message.tm_created, previousMessage.tm_created));

              // Format the date as "30 March"
              const formatDate = (dateString) => {
                const date = new Date(dateString);
                return `${date.getDate()} ${date.toLocaleString("default", {
                  month: "long",
                })}`;
              };

              return (
                <React.Fragment key={index}>
                  {isStartOfNewDay && (
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        margin: "10px 0",
                      }}
                    >
                      <strong>{formatDate(message.tm_created)}</strong>
                    </div>
                  )}
                  <div
                    style={{
                      padding: "10px",
                      display: "flex",
                      flexDirection:
                        message.user_id === userData.id ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "10px",
                      textAlign:
                        message.user_id === userData.id ? "right" : "left",
                    }}
                  >
                    <Avatar
                      style={{
                        background: generateColorFromName(message.user_id),
                        flexShrink: 0,
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
                            hour12: false,
                          }
                        )}{" "}
                      </div>
                    </MessageBubble>
                  </div>
                </React.Fragment>
              );
            })}
          </ScrollView>
          <div style={{ display: "flex" }}>
            <TextInput
              value={message}
              placeholder="Type here..."
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                  e.preventDefault();
                }
              }}
              fullWidth
            />
            <Button onClick={handleSend} style={{ marginLeft: 4 }}>
              Send
            </Button>
          </div>
        </Frame>
        )}
      </WindowContent>
    </StyledWindow>
  );
};
export default Matcher;
