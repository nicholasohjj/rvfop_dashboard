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

const Messenger = () => {
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const [channels, setChannels] = useState(["General", "Random", "Help"]); // Example channel names
  const [selectedChannel, setSelectedChannel] = useState("general"); // Default channel
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userData = useStore((state) => state.userData);
  const scrollViewRef = useRef();
  const filter = new Filter();

  useEffect(() => {
    if (!userData) initializeUserData();
  }, [userData]);

  useEffect(() => {
    let mounted = true;
    const fetchMessages = async () => {
      const { data, error } = await supabaseClient
        .from("messages")
        .select("*")
        .eq("channel", selectedChannel.toLowerCase())
        .order("tm_created", { ascending: true })
        .limit(50);
      if (mounted) {
        setMessages(data || []);
        if (error) console.error("Error fetching messages:", error);
      }
    };

    const subscribeToChannel = (channelName) => {
      const channel = supabaseClient.channel(channelName).on("broadcast", { event: "chat" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      }).subscribe();

      return () => channel.unsubscribe();
    };

    fetchMessages().then(() => setLoading(false));
    return subscribeToChannel(selectedChannel.toLowerCase());

  }, [selectedChannel]);


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
      tm_created: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Singapore",
      }),
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
    <StyledWindow style={{ flex: 1, width: 320, overflow:"auto" }}>
      <StyledWindowHeader>Insieme Live Messenger</StyledWindowHeader>
      <WindowContent
        style={{
          overflowY: "auto",
          flex: 1, // Make WindowContent fill the available space
          display: "flex", // Enable flex layout
          flexDirection: "column", // Stack children vertically
          marginBottom: "10px"
        }}
      >
        <GroupBox
          label="Select Channel"
          style={{
            marginBottom: "10px",
          }}
        >
          <Select
          defaultValue={1}
            value={selectedChannel}
            onChange={handleChannelChange}
            options={channels.map((channel) => ({
              label: channel,
              value: channel,
            }))}
            width="100%"
          />
        </GroupBox>
        Chat with anyone here from RVFOP. Messages are broadcasted to everyone on this. You can select a channel from the dropdown above to view messages from that channel. You can also send messages to the selected channel from this
        page.
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column", // Stack name and message content vertically
                        alignItems:
                          message.user_id === userData.id
                            ? "flex-end"
                            : "flex-start", // Align items to the end if it's the user's message
                      }}
                    >
                      <div>
                        <strong>{message.name}</strong>
                      </div>
                      <div>{message.message}</div>
                    </div>
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
                  style={{ flex: 1 }}
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
