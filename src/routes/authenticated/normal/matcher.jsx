import React, { useRef, useState, useEffect, useContext } from "react";
import { supabaseClient } from "../../../supabase/supabaseClient";
import { userContext } from "../../../context/userContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  Frame,
  Window,
  WindowContent,
  WindowHeader,
  Button,
  TextInput,
  ScrollView,
  Hourglass,
} from "react95";
import { findRoom, leaveRoom } from "../../../supabase/roomService";
import { fetchOtherUser } from "../../../supabase/services";
import { Helmet } from "react-helmet";
import { isNewDay } from "../../../utils/time";
import { createLinkMarkup } from "../../../utils/createLinkMarkup";
import { ProfileAvatar } from "../../../components/profileavatar";
const StyledWindowHeader = styled(WindowHeader)`
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledWindow = styled(Window)`
  flex: 1;
  width: 320px;
  margin: 0 auto;
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
  const { user } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [matched, setMatched] = useState(false);
  const [partnerId, setPartnerId] = useState(null);
  const [partner, setPartner] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messageChannel, setMessageChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const scrollViewRef = useRef();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (matching && !channel) {
      const newChannel = supabaseClient
        .channel("schema-db-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
          },
          (payload) => {
            // filter such that payload.new.usersid array contains the user.id
            console.log(payload.new.usersid);

            if (
              payload.new.usersid.includes(user.id) &&
              payload.new.usersid.length === 2
            ) {
              setMatched(true);

              setPartnerId(
                payload.new.usersid.filter((id) => id !== user.id)[0]
              );
            }
          }
        )
        .subscribe();

      setChannel(newChannel);
    }

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [matching, user]);

  useEffect(() => {
    if (partnerId) {
      fetchOtherUser(partnerId).then((data) => {
        setPartner(data);

        console.log("Partner", data);
      });

      //Enter unique channel for messaging
      const newMessageChannel = supabaseClient.channel(`room-${user.id}`)



      newMessageChannel
        .on("broadcast", { event: "chat" }, (payload) => console.log(payload))
        .subscribe();


      setMessageChannel(newMessageChannel);
    }
  }, [partnerId]);

  useEffect(() => {
    if (messageChannel) {
      console.log("Subscribing to messages", messageChannel);


      return () => {
        messageChannel.unsubscribe();
      };
    }
  }, [messageChannel]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (matching) {
        leaveRoom(user.id);
      }
      // If you want to show a confirmation dialog to the user before leaving
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [matching, user]);

  const handleMatch = async () => {
    setMatching((prevMatching) => !prevMatching);

    if (!matching) {
      console.log("Matching now");
      // Add more logic here if needed for when matching starts
      await findRoom(user.id);
    } else {
      console.log("Stopped matching");
      await leaveRoom(user.id);
      setMatched(false);
      setPartner(null);
      setPartnerId(null);
      setMessageChannel(null);
      // Add more logic here if needed for when matching stops
    }
  };

  const handleSend = async () => {};

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <StyledWindow style={{ flex: 1, width: 320 }}>
      <Helmet>
        <title>Insieme 2024 - Matcher</title>
        <meta
          name="description"
          content="Chat with anyone here from RVFOP! Note: This is a public chat."
        />
      </Helmet>
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
        {!(messageChannel) ? (
          <>
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
                {matched && partner
                  ? `Found a match! Your partner is ${partner.profile_name}`
                  : `Finding a match for you...`}
                <Hourglass size={32} style={{ margin: 20 }} />
              </div>
            )}
          </>
        ) : (
          <>
          Your partner is {partner.profile_name}. Say hi!
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
                        isNewDay(
                          message.tm_created,
                          previousMessage.tm_created
                        ));

                    // Format the date as "30 March"
                    const formatDate = (dateString) => {
                      const date = new Date(dateString);
                      return `${date.getDate()} ${date.toLocaleString(
                        "default",
                        {
                          month: "long",
                        }
                      )}`;
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
                              message.user_id === user.id
                                ? "row-reverse"
                                : "row",
                            alignItems: "flex-start",
                            gap: "10px",
                            marginBottom: "10px",
                            textAlign:
                              message.user_id === user.id ? "right" : "left",
                          }}
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
          </>
        )}
      </WindowContent>
    </StyledWindow>
  );
};

export default Matcher;
