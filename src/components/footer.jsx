import { useState, useEffect } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
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
                            src="../../../images/logo.png"
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
                            <MenuListItem onClick={() => handleNavigate("/login")}>

                                Scoreboard
                            </MenuListItem>
                            <MenuListItem onClick={() => handleNavigate("/login")}>

                                My Progress
                            </MenuListItem>
                            <MenuListItem onClick={() => handleNavigate("/login")}>
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
