import { useState } from "react";
import { AppBar, Toolbar, Button, MenuList, MenuListItem } from "react95";
import { Navigate } from "react-router-dom";

export const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <AppBar style={{ zIndex: 1 }}>
            <Toolbar>
                <Button
                    variant="menu"
                    onClick={() => setOpen(!open)}
                    active={open}
                >
                    File
                </Button>
                <Button variant="menu" disabled>
                    Edit
                </Button>
                <Button variant="menu" disabled>
                    View
                </Button>
                <Button variant="menu" disabled>
                    Format
                </Button>
                <Button variant="menu" disabled>
                    Tools
                </Button>
                <Button variant="menu" disabled>
                    Table
                </Button>
                <Button variant="menu" disabled>
                    Window
                </Button>
                <Button variant="menu" disabled>
                    Help
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
                    </MenuList>
                )}
            </Toolbar>
        </AppBar>
    );
};
