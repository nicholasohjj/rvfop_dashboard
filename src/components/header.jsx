import { useState } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/userContext"
export const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const userData = useStore((state) => state.userData);


  return (
    <AppBar style={{ zIndex: 1 }}>
      <Toolbar>
        <Button variant="menu" onClick={() => setOpen(!open)} active={open}>
          File
        </Button>
        <Button variant="menu" disabled>
          Edit
        </Button>
        <Button variant="menu" disabled>
          Tools
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
              Update Password
            </MenuListItem>
            {(userData.role === "admin" || userData.role === "gm") && (
            <MenuListItem onClick={() => navigate("/addactivity")}>
              Add Activity
            </MenuListItem>
            )}
            {(userData.role === "admin" || userData.role === "deductor") && (
              <MenuListItem onClick={() => navigate("/adddeduction")}>
                Add Deduction 😈
              </MenuListItem>
            )}
          </MenuList>
        )}
      </Toolbar>
    </AppBar>
  );
};
