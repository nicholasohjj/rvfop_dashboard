import { useState, useContext, useEffect } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../supabase/supabaseClient";
import { userContext, sessionContext } from "../context/context";

const preloadImages = (imageUrls) => {
  imageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

const imageUrls = [
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/logo.png",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/scoreboard.png",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/progress.png",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/deduction.png",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/games.png",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/messenger.png",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/logout.png",
  "https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/login.png",
];

export const Footer = () => {
  const [open, setOpen] = useState(false);
  const { session, setSession } = useContext(sessionContext);
  const { user, setUser } = useContext(userContext);

  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    preloadImages(imageUrls);
  }, []);

  const handleLogout = async () => {
    console.log("Logging out", user);
    await supabaseClient.auth.signOut();
    setSession(null);
    setUser(null);
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

              {session && user.has_progress && (
                <MenuListItem onClick={() => handleNavigate("/progress")}>
                  <img
                    src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/progress.png"
                    alt="progress_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Progress
                </MenuListItem>
              )}

              {session && user.can_deduct && (
                <MenuListItem onClick={() => handleNavigate("/deductions")}>
                  <img
                    src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/deduction.png"
                    alt="deduction_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Deductions
                </MenuListItem>
              )}
              {session && user.can_add_activity && (
                <MenuListItem onClick={() => handleNavigate("/games")}>
                  <img
                    src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/games.png"
                    alt="game_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Awarded Games
                </MenuListItem>
              )}
              {session && (
                <MenuListItem
                  onClick={
                    user
                      ? () => handleNavigate("/message")
                      : () => handleNavigate("/login")
                  }
                >
                  <img
                    src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/messenger.png"
                    alt="messenger_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Messenger
                </MenuListItem>
              )}
              {session && (
                <div>
                  <MenuListItem onClick={() => handleLogout()}>
                    <img
                      src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/logout.png"
                      alt="logout_logo"
                      style={{ height: "20px", marginRight: 4 }}
                    />
                    Logout
                  </MenuListItem>
                </div>
              )}
              {!session && (
                <MenuListItem onClick={() => handleNavigate("/login")}>
                  <img
                    src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/login.png"
                    alt="login_logo"
                    style={{ height: "20px", marginRight: 4 }}
                  />
                  Login
                </MenuListItem>
              )}
            </MenuList>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
