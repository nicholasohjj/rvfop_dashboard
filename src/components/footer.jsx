import { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../supabase/supabaseClient";
import { useStore, initializeUserData } from "../context/userContext";
import logo from "../assets/logo.png";
import messengerLogo from "../assets/messenger.png";
import deductionLogo from "../assets/deduction.png";
import gamesLogo from "../assets/games.png";
import scoreboardLogo from "../assets/leaderboard.png";
import progressLogo from "../assets/progress.png";
import logoutLogo from "../assets/logout.png";
export const Footer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useStore((state) => state.userData);

  useEffect(() => {
    const init = async () => {
      if (!userData) {
        await initializeUserData();
      }
    };

    init();
  }, [userData]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    supabaseClient.auth.signOut();
    navigate("/login");
  };

  return (
    <AppBar style={{ top: "unset", bottom: 0 }}>
      <Toolbar style={{ justifyContent: "space-between" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Button
            onClick={() => setOpen(!open)}
            active={open}
            style={{ fontWeight: "bold" }}
          >
            <img
              src={logo}
              alt="rvrc-logo"
              style={{ height: "20px", marginRight: 4 }}
            />
          </Button>
          {open && (
            <MenuList
              style={{
                position: "absolute",
                left: "0",
                bottom: "100%",
              }}
              onClick={() => setOpen(false)}
            >
              <MenuListItem onClick={() => handleNavigate("/scoreboard")}>
                <img
                  src={scoreboardLogo}
                  alt="scoreboard_logo"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Scoreboard
              </MenuListItem>
              {(userData.role == "admin" ||
                userData.role == "normal" ||
                userData.role == "deductor") && (
                <MenuListItem onClick={() => handleNavigate("/progress")}>
                  <img
                    src={progressLogo}
                    alt="progress_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Progress
                </MenuListItem>
              )}

              {(userData?.role === "admin" ||
                userData?.role === "deductor") && (
                <MenuListItem onClick={() => handleNavigate("/deductions")}>
                  <img
                    src={deductionLogo}
                    alt="deduction_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Deductions
                </MenuListItem>
              )}
              {(userData?.role == "admin" || userData?.role == "gm") && (
                <MenuListItem onClick={() => handleNavigate("/games")}>
                  <img
                    src={gamesLogo}
                    alt="game_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Awarded Games
                </MenuListItem>
              )}
              <MenuListItem onClick={() => handleNavigate("/message")}>
                <img
                  src={messengerLogo}
                  alt="messenger_logo"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Messenger
              </MenuListItem>

              <MenuListItem onClick={() => handleLogout()}>
              <img
                    src={logoutLogo}
                    alt="logout_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                Logout
              </MenuListItem>
            </MenuList>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
