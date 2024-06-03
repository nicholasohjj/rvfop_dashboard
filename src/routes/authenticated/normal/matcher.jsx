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
  const [partner, setPartner] = useState();
  const [pendingPartner, setPendingPartner] = useState();
  const [sharedState, setSharedState] = useState();
  const [channelName, setChannelName] = useState(); // Default channel
  const [message, setMessage] = useState("");
  const [privateMessages, setPrivateMessages] = useState([]);
  const userData = useStore((state) => state.userData);
  const scrollViewRef = useRef();
  const filter = new Filter();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (!userData) await initializeUserData();
      setLoading(false);
    };
    init();
  }, [userData]);

  useEffect(() => {
    if (partner) {
      console.log("Partner", partner);
    }
  }, [partner]);

  useEffect(() => {
    let isSubscribed = true;

    const initChannel = async (channelName) => {
      if (!channelName) return;

      if (channel) channel.unsubscribe(); // Unsubscribe from the previous channel

      console.log("Initializing channel:", channelName);
      // Initialize and subscribe to the new channel
      const newChannel = supabaseClient.channel(channelName, {
        config: {
          presence: {
            key: userData.id,
          },
        },
      });

      newChannel
        .on(
          "broadcast",
          {
            event: "chat",
          },
          (payload) => {
            if (payload.target_id === userData.id) {
              if (
                payload.user_id !== pendingPartner ||
                pendingPartner == null
              ) {
                // send a response to the new user
                // message was sent by another user that is not the pending partner

                const response = {
                  user_id: userData.id,
                  target_id: payload.user_id,
                  tm_created: new Date().toISOString(),
                };

                newChannel.send({
                  type: "broadcast",
                  event: "chat",
                  payload: response,
                });

                setPendingPartner(payload.user_id);
                setPartner(payload.user_id);

                const privateChannelName = `private-${userData.id}-${payload.user_id}`;
                setChannelName(privateChannelName);
                setChannel(null);
              } else if (payload.user_id === pendingPartner) {
                // message was sent by the pending partner as response to the user
                setPartner(payload.user_id);

                const privateChannelName = `private-${payload.user_id}-${userData.id}`;
                setChannelName(privateChannelName);
                setChannel(null);
              }
            }
          }
        )
        .on("presence", { event: "sync" }, () => {
          const newState = newChannel.presenceState();
          setSharedState(newState);
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          console.log("join", key, newPresences);

          // send a message to the new user

          const payload = {
            user_id: userData.id,
            target_id: key,
            tm_created: new Date().toISOString(),
          };

          if (
            !pendingPartner ||
            (pendingPartner && pendingPartner in sharedState)
          ) {
            newChannel.send({
              type: "broadcast",
              event: "chat",
              payload,
            });

            setPendingPartner(key);
          }
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          console.log("leave", key, leftPresences);
        })
        .subscribe();

      setChannel(newChannel);
    };

    setPrivateMessages([]); // Clear messages from the previous channel
    initChannel(channelName); // Re-initialize channel subscription

    return () => {
      isSubscribed = false;
      if (channel) channel.unsubscribe(); // Clean up the previous subscription
    };
  }, [channelName, userData]); // Dependency array includes channelName

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
      setChannelName("matcher");
      setMatching(true);

      setTimeout(() => {
        setMatched(true);
      }, 1000);

      // setTimeout(() => {
      //   window.location.href =
      //     "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up%20(Official%20Music%20Video).mp4?t=2024-04-08T06%3A12%3A18.440Z";
      // }, 1000);
    } else {
      if (channel) channel.unsubscribe();

      setMatching(false);
      setChannelName(null);
      setMatched(false);
      setChannel(null);
      setPartner(null);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const sanitizedMessage = filter.clean(message);

    console.log("Sending message:", sanitizedMessage);
    console.log("User data:", userData);
    console.log("Selected channel:", channelName);

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

    // Post the message on messages table
    const { data, error: postError } = await supabaseClient
      .from("messages")
      .insert([{ ...payload, channel: channelName.toLowerCase() }])
      .single();

    if (error || postError) {
      console.error("Sending message error:", error, postError);
    } else {
      setPrivateMessages((prevMessages) => [...prevMessages, payload]);
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
          {/* Love is in the air! Find your match and start chatting. */}
        </div>
        <Button
          style={{
            margin: "10px",
          }}
          onClick={handleMatch}
        >
          {/* {!matching ? "Match me!" : "Stop matching"} */}
        </Button>
        {matching && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            {matched
              ? `Found a match! You're on your way to cupid's arrow.`
              : `Finding a match for you...`}
            <Hourglass size={32} style={{ margin: 20 }} />
          </div>
        )}
      </WindowContent>
    </StyledWindow>
  );
};
export default Matcher;
