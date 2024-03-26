import { useState, useEffect } from "react";
import {
  Frame,
  Window,
  WindowContent,
  WindowHeader,
  GroupBox,
  ScrollView,
  TextInput,
  Button,
  Avatar,
} from "react95";
import Loading from "../loading";
import { fetchGroup } from "../../supabase/services";
import { useStore, initializeUserData } from "../../context/userContext";
import { supabaseClient } from "../../supabase/supabaseClient";
import logo from "../../assets/logo.png";

const Messenger = () => {
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const userData = useStore((state) => state.userData);

  useEffect(() => {
    const init = async () => {
      // Assuming initializeUserData() updates the user context with the fetched data
      await initializeUserData(); // Fetch and initialize user data
    };

    if (!userData) {
      init();
    }
  }, [userData]); // Add userData and navigate to dependency array

  useEffect(() => {
    const initChannel = async () => {
      const newChannel = supabaseClient.channel("test_channel", {
        config: {
          broadcast: { self: true },
        },
      });
      console.log("Channel created", newChannel);
      newChannel
        .on("broadcast", { event: "chat" }, (payload) => {
          console.log("New message received", payload.payload);
          setMessages((prevMessages) => [...prevMessages, payload.payload]);
        })
        .subscribe();

      setChannel(newChannel);

      return () => newChannel.unsubscribe();
    };

    initChannel();
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const group = await fetchGroup();
        setGroupData(group);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => setMessage(e.target.value);

  const handleSend = async () => {
    if (!message.trim()) return; // Prevents sending empty messages

    console.log("Message", message);
    console.log("User data", userData);
    const { error } = await channel.send({
      type: "broadcast",
      event: "chat",
      payload: { user_id: userData.id, name: userData.profile_name, message },
    });

    if (error) {
      console.error("Sending message error:", error);
    } else {
      setMessage("");
    }
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
    <Window
      style={{
        flex: 1,
        maxWidth: "100vw",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <WindowHeader>Insieme Live Messenger</WindowHeader>
      <WindowContent
        style={{
          flex: 1, // Make WindowContent fill the available space
          display: "flex", // Enable flex layout
          flexDirection: "column", // Stack children vertically
        }}
      >
        {groupData && (
          <GroupBox label={`Description`}>
            Chat here with anyone in RVFOP! Messages will not be saved and will be deleted after the session ends.
          </GroupBox>
        )}
        <div style={{ marginTop: 10 }}>
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
                style={{
                  height: "50vh",
                  overflow: "auto", // Add scrollbars if content overflows
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
        <Avatar style={{ background: generateColorFromName(message.user_id) }} size={40}>
                      {message.name[0]}
                    </Avatar>
                    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack name and message content vertically
        alignItems: message.user_id === userData.id ? "flex-end" : "flex-start", // Align items to the end if it's the user's message
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
    </Window>
  );
};
export default Messenger;
