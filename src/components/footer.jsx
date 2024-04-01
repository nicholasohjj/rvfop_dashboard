import { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../supabase/supabaseClient";
import { useStore, initializeUserData } from "../context/userContext";

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
              src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/logo.png"
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
                  src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/scoreboard.png"
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
                    src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/progress.png"
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
                    src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/deduction.png"
                    alt="deduction_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Deductions
                </MenuListItem>
              )}
              {(userData?.role == "admin" || userData?.role == "gm") && (
                <MenuListItem onClick={() => handleNavigate("/games")}>
                  <img
                    src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/games.png"
                    alt="game_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Awarded Games
                </MenuListItem>
              )}
              <MenuListItem onClick={() => handleNavigate("/message")}>
                <img
                  src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/messenger.png"
                  alt="messenger_logo"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Messenger
              </MenuListItem>

              <MenuListItem onClick={() => handleLogout()}>
              <img
                    src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/logout.png"
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
