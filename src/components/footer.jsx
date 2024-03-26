import { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../supabase/supabaseClient";
import { useStore, initializeUserData } from "../context/userContext";
import logo from "../assets/logo.png";
import messengerLogo from '../assets/messenger.png'
export const Footer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useStore((state) => state.userData);

  useEffect(() => {

    const init = async () => {
      if (!userData) {
        await initializeUserData();
      }
    }

    init()
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
                Scoreboard
              </MenuListItem>
              {(userData.role == "admin" ||
                userData.role == "normal" ||
                userData.role == "deductor") && (
                <MenuListItem onClick={() => handleNavigate("/progress")}>
                  Progress
                </MenuListItem>
              )}

              {(userData?.role === "admin" ||
                userData?.role === "deductor") && (
                <MenuListItem onClick={() => handleNavigate("/deductions")}>
                  Deductions
                </MenuListItem>
              )}
                            {(userData?.role == "admin" ||
                userData?.role == "gm") && (
                <MenuListItem onClick={() => handleNavigate("/games")}>
                  Awarded Games
                </MenuListItem>
              )}
                              <MenuListItem onClick={() => handleNavigate("/message")}>
                  <img src={messengerLogo} alt="messenger" style={{ height: "20px", marginRight: 4 }} />
                  Messenger
                </MenuListItem>

              <MenuListItem onClick={() => handleLogout()}>
                <span role="img" aria-label="🔙">
                  🔙
                </span>
                Logout
              </MenuListItem>
            </MenuList>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
