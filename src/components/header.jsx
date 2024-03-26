import { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { useNavigate } from "react-router-dom";
import { useStore, initializeUserData } from "../context/userContext";
import passwordLogo from "../assets/password.png";
import addactivityLogo from "../assets/addactivity.png";
import adddeductionLogo from "../assets/adddeduction.png";
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
                src={passwordLogo}
                alt="password"
                style={{ height: "20px", marginRight: 4 }}
              />
              Update Password
            </MenuListItem>
            {(userData.role == "admin" || userData.role == "gm") && (
              <MenuListItem onClick={() => navigate("/addactivity")}>
                <img
                  src={addactivityLogo}
                  alt="add_activity"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Add Activity
              </MenuListItem>
            )}
            {userData?.role == "admin" && (
              <MenuListItem onClick={() => navigate("/adddeduction")}>
                <img
                  src={adddeductionLogo}
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
