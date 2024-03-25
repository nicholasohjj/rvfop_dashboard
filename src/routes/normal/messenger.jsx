import { useState, useEffect, useCallback } from "react";
import {
  Frame,
  Window,
  WindowContent,
  WindowHeader,
  GroupBox,
  ScrollView,
  TextInput,
  Button,
} from "react95";
import Loading from "../loading";
import { fetchGroup } from "../../supabase/services";
import { useStore, initializeUserData } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../supabase/supabaseClient";

const Messenger = () => {
  const [groupData, setGroupData] = useState(null); // Initialize to null for better checks
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const [message, setMessage] = useState("");
  const userData = useStore((state) => state.userData);
  const navigate = useNavigate();

  const initializeAndNavigate = useCallback(async () => {
    if (
      !userData ||
      !(userData.role === "normal" || userData.role === "admin")
    ) {
      try {
        await initializeUserData();
        if (!(userData.role === "normal" || userData.role === "admin")) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Failed to initialize user data:", error);
      }
    }
  }, [userData, navigate]);

  useEffect(() => {
    initializeAndNavigate();

    setChannel(supabaseClient.channel("test_channel"));
  }, [initializeAndNavigate]);

  useEffect(() => {
    initializeAndNavigate();
  }, [initializeAndNavigate]);

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

  if (loading) return <Loading />;

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!message) return;

    channel.subscribe((status) => {
      if (status !== "SUBSCRIBED") {
        return null;
      }

      channel.send({
        type: "broadcast",
        event: "test",
        payload: { message },
      });
    });
    setMessage("");
  };

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
          <GroupBox label={`Group: ${groupData.group_name}`}>
            Total Points Earned: {groupData.total_points}
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
              overflow: "auto", // Add scrollbars if content overflows
            }}
          >
            <div>
              <ScrollView
                style={{
                  height: "50vh",
                }}
              >
                A field frame variant is used to display content.
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
