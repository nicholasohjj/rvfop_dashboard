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
import { findRoom, leaveRoom } from "../../../supabase/roomService";
import usePresence from "../../../supabase/usePresence";
import { fetchOtherUser } from "../../../supabase/services";
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
  const [partnerId, setPartnerId] = useState(null);
  const [partner, setPartner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const channel = supabaseClient
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
            setPartnerId(payload.new.usersid.filter((id) => id !== user.id)[0]);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (partnerId) {
      fetchOtherUser(partnerId).then((data) => {
        setPartner(data);

        console.log("Partner", data);
      });
    }
  }, [partnerId]);

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
      // Add more logic here if needed for when matching stops
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
          {!matching ? "" : "Stop"}
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
      </WindowContent>
    </StyledWindow>
  );
};

export default Matcher;
