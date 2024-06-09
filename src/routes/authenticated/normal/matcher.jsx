import React, { useState, useEffect, useContext } from "react";
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
  Hourglass,
} from "react95";
import { createOrFindRoom } from "../../../supabase/roomService";
import usePresence from "../../../supabase/usePresence";
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

const Matcher = () => {
  const { user } = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [matched, setMatched] = useState(false);
  const [partner, setPartner] = useState(null);
  const [matcherChannel, setMatcherChannel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const room = await createOrFindRoom(user.id);
      const channel = supabaseClient.channel(`room-${room.id}`, {
        // Create channel variable
        config: {
          presence: {
            key: user.id.toString(),
          },
        },
      });
      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState(); // Update to channel
          const availableUsers = Object.keys(state).filter(
            (id) => id !== user.id.toString() && !state[id].matched
          );
          if (availableUsers.length > 0) {
            const partnerId = availableUsers[0];
            setPartner(partnerId);
            setMatched(true);
            channel.updatePresence({
              id: user.id.toString(),
              matched: true,
            });
            channel.updatePresence({
              id: partnerId,
              matched: true,
            });
          }
        })
        .subscribe();
      setLoading(false);
      setMatcherChannel(channel); // Set matcherChannel state
    };
    init();
    return () => {
      if (matcherChannel) {
        matcherChannel.unsubscribe();
        matcherChannel.updatePresence({
          id: user.id.toString(),
          matched: false,
        });
      }
    };
  }, [user]);

  useEffect(() => {
    const leaveRoom = () => {
      if (matcherChannel) {
        matcherChannel.unsubscribe();
        matcherChannel.updatePresence({
          id: user.id.toString(),
          matched: false,
        });
      }
    };

    window.addEventListener("beforeunload", leaveRoom);

    const TIMEOUT_DURATION = 1000 * 60 * 5; // 5 minutes

    const timeout = setTimeout(() => {
      leaveRoom();
    }, TIMEOUT_DURATION);

    return () => {
      window.removeEventListener("beforeunload", leaveRoom);
      clearTimeout(timeout);
    };
  }, [user, matcherChannel]);

  const handleMatch = async () => {
    setMatching(!matching);
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
