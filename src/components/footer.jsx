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
    if (!userData) {
      initializeUserData();
    }
  }, [userData]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    supabaseClient.auth.signOut();
    console.log(supabaseClient.auth.getSession());
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
              src="https://insieme.s3.ap-southeast-1.amazonaws.com/logo.png"
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
              <MenuListItem onClick={() => handleNavigate("/progress")}>
                My Progress
              </MenuListItem>
              {userData?.role === "admin" && (
                <MenuListItem onClick={() => handleNavigate("/deductions")}>
                  My Deductions
                </MenuListItem>
              )}

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
