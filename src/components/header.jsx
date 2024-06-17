import { useState, useContext } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { useNavigate } from "react-router-dom";
import { userContext, sessionContext } from "../context/userContext";
export const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { session, setSession } = useContext(sessionContext);
  const { user, setUser } = useContext(userContext);

  return (
    <AppBar style={{ zIndex: 1 }}>
      <Toolbar>
        <Button variant="menu" onClick={() => setOpen(!open)} active={open}>
          File
        </Button>
        {open && (
          <MenuList
            style={{
              position: "absolute",
              left: "0",
              top: "100%",
            }}
            onClick={() => setOpen(false)}
          >
            {session && user && (
              <MenuListItem onClick={() => navigate("/profile")}>
                <img
                  src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/password.png"
                  alt="password"
                  style={{ height: "20px", marginRight: 4 }}
                />
                My Profile
              </MenuListItem>
            )}
            {session && user?.can_add_activity && (
              <MenuListItem onClick={() => navigate("/addactivity")}>
                <img
                  src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/sign/rvfop/addactivity.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydmZvcC9hZGRhY3Rpdml0eS5wbmciLCJpYXQiOjE3MTE5NDc5NTIsImV4cCI6MjAyNzMwNzk1Mn0.tBntdvbPBIdWB9Ho16a18nbwW167CwdlYnRAMIq4efw"
                  alt="add_activity"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Add Activity
              </MenuListItem>
            )}
            {session && user?.can_deduct && (
              <MenuListItem onClick={() => navigate("/adddeduction")}>
                <img
                  src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/adddeduction.png"
                  alt="add_deduction"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Add Deduction
              </MenuListItem>
            )}

            <MenuListItem onClick={() => navigate("/about")}>
              <img
                src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/tip.png"
                alt="about"
                style={{ height: "20px", marginRight: 4 }}
              />
              About
            </MenuListItem>
          </MenuList>
        )}
      </Toolbar>
    </AppBar>
  );
};
