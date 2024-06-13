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
  Tooltip,
} from "react95";
import { findRoom, leaveRoom } from "../../../supabase/roomService";
import {
  fetchOtherUser,
  fetchPrivateMessages,
} from "../../../supabase/services";
import { Helmet } from "react-helmet";
import Filter from "bad-words";
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
  const [match, setMatch] = useState(null);
  const [partner, setPartner] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messageChannel, setMessageChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const scrollViewRef = useRef();
  const filter = new Filter();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const newChannel = supabaseClient
    .channel("schema-db-changes")
    if (matching) {

      newChannel
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
          },
          (payload) => {
            console.log("Channel payload", payload);
            if (
              payload.new.usersid.includes(user.id) &&
              payload.new.usersid.length === 2 &&
              payload.new.is_ongoing
            ) {
              setMatch(payload.new);
            }
          }
        )
        .subscribe();

      setChannel(newChannel);
    } else {
      newChannel.unsubscribe();
    }

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [matching, user]);

  useEffect(() => {
    const fetchPartnerData = async () => {
      if (match) {
        let partnerId = match.usersid.filter((id) => id !== user.id)[0];

        const partnerData = await fetchOtherUser(partnerId);

        if (partnerData) {
          console.log("Partner data", partnerData);

          setPartner(partnerData);

          const channel = supabaseClient
            .channel(`chat:${match.match_id}`)
            .on("broadcast", { event: "chat" }, (payload) => {
              setMessages((prevMessages) => [...prevMessages, payload.payload]);
            })
            .subscribe();


          setMessageChannel(channel);
        } else {
          await supabaseClient
            .from("matches")
            .delete()
            .eq("match_id", match.match_id);
          setMatch(null);

          await findRoom(user.id);
        }
      }
    };

    fetchPartnerData();
  }, [match]);

  useEffect(() => {
    const init = async () => {
      if (messageChannel) {

        const messagesData = await fetchPrivateMessages(match.match_id);

        if (messagesData) {
          console.log("Messages data", messagesData);
          setMessages(messagesData);
          scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight;
        }
      }
    };

    init();

    if (messageChannel) {
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
      setPartner(null);
      setMatch(null);
      setMessageChannel(null);
      // Add more logic here if needed for when matching stops
    }
  };

  const scrollToBottom = () => {
    const elem = scrollViewRef.current;
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const sanitizedMessage = filter.clean(message);

    const payload = {
      user_id: user.id,
      message: sanitizedMessage,
      tm_created: new Date().toISOString(),
      match_id: match.match_id,
    };

    const { error } = await messageChannel.send({
      type: "broadcast",
      event: "chat",
      payload: { ...payload, profile_name: user.profile_name}
    });

    const { data, error: postError } = await supabaseClient
      .from("private_messages")
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
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleLeave = async () => {
    await leaveRoom(user.id);

    messageChannel.unsubscribe();

    setMatch(null);
    setMatching(false);
    setPartner(null);
    setMessageChannel(null);
    setMessages([]);
    setMessage("");
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
        {!messageChannel ? (
          <>
            <div
              style={{
                margin: "10px",
              }}
            >
              <p>
                Love is in the air! Find your match and start chatting. (Under
                development)
              </p>
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
                {partner
                  ? `Found a match! Your partner is ${partner.profile_name}`
                  : `Finding a match for you...`}
                <Hourglass size={32} style={{ margin: 20 }} />
              </div>
            )}
          </>
        ) : (
          <>
            Your partner is {partner.profile_name}. Say hi!
            <div
              style={{
                flex: 1,
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ margin: "0 5px" }}>
                <Tooltip
                  text={user.profile_name}
                  enterDelay={100}
                  leaveDelay={100}
                >
                  <ProfileAvatar name={user.profile_name} nameColor={user.id} />
                </Tooltip>
              </div>
              <div style={{ margin: "0 5px" }}>
                <Tooltip
                  text={partner.profile_name}
                  enterDelay={100}
                  leaveDelay={100}
                >
                  <ProfileAvatar
                    name={partner.profile_name}
                    nameColor={partner.id}
                  />
                </Tooltip>
              </div>
            </div>
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
            <Button
              style={{
                margin: "10px",
              }}
              onClick={handleLeave}
            >
              Leave chat
            </Button>
          </>
        )}
      </WindowContent>
    </StyledWindow>
  );
};

export default Matcher;
