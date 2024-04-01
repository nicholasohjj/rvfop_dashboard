import { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { useNavigate } from "react-router-dom";
import { useStore, initializeUserData } from "../context/userContext";

export const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const userData = useStore((state) => state.userData);

  useEffect(() => {
    const initialise = async () => {
      if (!userData) {
        await initializeUserData();
      }
    };

    initialise();
  }, [userData]);

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
            <MenuListItem onClick={() => navigate("/update")}>
              <img
                src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/password.png"
                alt="password"
                style={{ height: "20px", marginRight: 4 }}
              />
              Update Password
            </MenuListItem>
            {(userData.role == "admin" || userData.role == "gm") && (
              <MenuListItem onClick={() => navigate("/addactivity")}>
                <img
                  src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/sign/rvfop/addactivity.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydmZvcC9hZGRhY3Rpdml0eS5wbmciLCJpYXQiOjE3MTE5NDc5NTIsImV4cCI6MjAyNzMwNzk1Mn0.tBntdvbPBIdWB9Ho16a18nbwW167CwdlYnRAMIq4efw"
                  alt="add_activity"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Add Activity
              </MenuListItem>
            )}
            {userData?.role == "admin" && (
              <MenuListItem onClick={() => navigate("/adddeduction")}>
                <img
                  src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/adddeduction.png"
                  alt="add_activity"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Add Deduction
              </MenuListItem>
            )}
          </MenuList>
        )}
      </Toolbar>
    </AppBar>
  );
};
