import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  Frame,
  Window,
  WindowContent,
  WindowHeader,
  ScrollView,
  TextInput,
  Button,
  Select,
  GroupBox,
} from "react95";
import { Helmet } from "react-helmet";
import { userContext } from "../../context/context";
import { supabaseClient } from "../../supabase/supabaseClient";
import Filter from "bad-words";
import styled from "styled-components"; // Import styled-components
import { useNavigate } from "react-router-dom";
import { fetchChannels, fetchMessages } from "../../supabase/services";
import { ProfileAvatar } from "../../components/profileavatar";
import { createLinkMarkup } from "../../utils/createLinkMarkup";
import { isNewDay } from "../../utils/time";
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

const Messenger = () => {
  const { user } = useContext(userContext);
  const [channel, setChannel] = useState(null);
  const [channels, setChannels] = useState([]); // Example channel names
  const [selectedChannel, setSelectedChannel] = useState("General"); // Default channel
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const lastMessageRef = useRef(null);
  const filter = useMemo(() => new Filter(), []);
  const navigate = useNavigate();

  const scrollToBottom = useCallback(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    const init = async () => {
      const channels = await fetchChannels();
      setChannels(channels);
      setSelectedChannel(channels[0]);

      const data = await fetchMessages(channels[0]); // Fetch messages for the selected channel

      setMessages(data);
    };
    init();
  }, [user]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]); // Dependency on messages to ensure scroll after update

  useEffect(() => {
    let isSubscribed = true;

    const initChannel = async (channelName) => {
      if (channelName === "" || !isSubscribed) return; // Avoid initializing with an empty channel name (e.g., on component mount

      // check if new channel is same as the current channel
      if (channel && channelName === channel.channelName) return;
      if (channel) channel.unsubscribe(); // Unsubscribe from the previous channel

      const newChannel = supabaseClient.channel(channelName);

      // Initialize and subscribe to the new channel

      const data = await fetchMessages(selectedChannel); // Fetch messages for the selected channel
      setMessages(data);
      newChannel
        .on("broadcast", { event: "chat" }, (payload) => {
          // Filter or directly set messages for the selected channel
          setMessages((prevMessages) => [...prevMessages, payload.payload]);
        })
        .subscribe();

      setChannel(newChannel);
    };

    setMessages([]); // Clear messages from the previous channel
    initChannel(selectedChannel); // Re-initialize channel subscription

    return () => {
      isSubscribed = false;
    };
  }, [selectedChannel]); // Dependency array includes selectedChannel

  const handleChange = useCallback((e) => setMessage(e.target.value), []);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;

    const sanitizedMessage = filter.clean(message);

    const payload = {
      user_id: user.id,
      message: sanitizedMessage,
      tm_created: new Date().toISOString(),
      channel: selectedChannel.toLowerCase(),
    };

    const { error } = await channel.send({
      type: "broadcast",
      event: "chat",
      payload: { ...payload, profile_name: user.profile_name },
    });

    // post the message on messages table
    const { data, error: postError } = await supabaseClient
      .from("messages")
      .insert([payload])
      .single();

    if (error || postError) {
      console.error("Sending message error:", error, postError);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...payload, profile_name: user.profile_name },
      ]);
      setMessage("");
      scrollToBottom();
    }
  }, [message, user, selectedChannel, channel, filter, scrollToBottom]);

  const handleChannelChange = useCallback((e) => {
    setSelectedChannel(e.value);
    setMessages([]); // Clear messages when changing channels
  }, []);

  return (
    <StyledWindow style={{ flex: 1, width: 320 }}>
      <Helmet>
        <title>Insieme 2024 - Messenger</title>
        <meta
          name="description"
          content="Chat with anyone here from RVFOP! Note: This is a public chat."
        />
      </Helmet>
      <StyledWindowHeader
        onClick={() => {
          navigate("/match", { replace: true });
        }}
      >
        Insieme Live Messenger
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
              //capitalise the first letter of the channel name
              label: channel.charAt(0).toUpperCase() + channel.slice(1),
              value: channel,
            }))}
            width="100%"
          />
        </GroupBox>
        Chat with anyone here from RVFOP! Note: This is a public chat.
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
            {messages &&
              messages.map((message, index) => {
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

                const isLastMessage = index === messages.length - 1;

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
                          message.user_id === user.id ? "row-reverse" : "row",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "10px",
                        textAlign:
                          message.user_id === user.id ? "right" : "left",
                      }}
                      ref={isLastMessage ? lastMessageRef : null}
                    >
                      <ProfileAvatar
                        name={message.profile_name}
                        nameColor={message.user_id}
                      />
                      <MessageBubble isUser={message.user_id === user.id}>
                        <div>
                          <strong>{message.profile_name}</strong>
                        </div>
                        <div>{createLinkMarkup(message.message)}</div>
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
                          )}
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
              style={{ flex: 1 }}
            />
            <Button onClick={handleSend} style={{ marginLeft: 4 }}>
              Send
            </Button>
          </div>
        </Frame>
      </WindowContent>
    </StyledWindow>
  );
};
export default Messenger;
