import { useState, useRef, useEffect } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  TextInput,
  Button,
  Select,
  GroupBox,
} from "react95";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabaseClient } from "../supabase/supabaseClient";
import styled from "styled-components";
import { fetchGroups } from "../supabase/services";

// Styled Close Icon Component
const CloseIcon = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  cursor: pointer;
  transform: rotateZ(45deg);
  position: relative;
  &:before,
  &:after {
    content: "";
    position: absolute;
    background: ${({ theme }) =>
      theme.materialText}; // Adjust the color as needed
  }
  &:before {
    height: 100%;
    width: 3px;
    left: 50%;
    transform: translateX(-50%);
  }
  &:after {
    height: 3px;
    width: 100%;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const StyledWindowHeader = styled(WindowHeader)`
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ messageType }) =>
    messageType === "success" ? "green" : "red"};
`;

export const Signup = () => {
  const [email, setemail] = useState(null);
  const [password, setPassword] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null); // Add selectedGroup state
  const [selectedRole, setSelectedRole] = useState(null); // Add selectedRole state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]); // Add groups state
  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation
  const dragX = useMotionValue(0);
  const dragxError = useMotionValue(0);

  const rotateValue = useTransform(dragX, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  useEffect(() => {
    fetchGroups().then((data) => {
      setGroups(data);
      console.log("Groups", data);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Email", email);
    console.log("Password", password);

    if (!email || !password) {
      setError({
        name: "Error",
        message: "Please enter your email and password.",
      });
      setIsModalOpen(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsModalOpen(true);
      setError({
        name: "Error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (password.length < 6) {
      setIsModalOpen(true);
      setError({
        name: "Error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    if (!selectedRole) {
      setIsModalOpen(true);
      setError({
        name: "Error",
        message: "Please select a role.",
      });
      return;
    }

    if (
      (selectedRole === "deductor" || selectedRole === "normal") &&
      !selectedGroup
    ) {
      setIsModalOpen(true);
      setError({
        name: "Error",
        message: "Please select a group.",
      });
      return;
    }

    console.log("Selected Group", selectedGroup);
    console.log("Selected Role", selectedRole);

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            selectedRole,
            selectedGroup,
          },
        },
      });

      console.log("Data", data.user.user_metadata.email_verified);
      if ("email_verified" in data.user.user_metadata) {
        console.log("Here");
        console.log("User Metadata", data.user.user_metadata.email_verified);
        setIsModalOpen(true);
        setError({
          name: "Success",
          message:
            "Please verify your email address by clicking the link in the email we sent you.",
          type: "success", // Add this line
        });
        setemail("");
        setPassword("");
        setSelectedRole(null);
        setSelectedGroup(null);
        return;
      } else {
        setIsModalOpen(true);
        setError({
          name: "Error",
          message: "Email already registered",
        });
      }

      if (error) {
        console.log("Error");
        throw error;
      }
    } catch (error) {
      setIsModalOpen(true);
      setError(error);
    }
  };

  const windowStyle = {
    width: windowWidth > 500 ? 500 : "90%", // Adjust width here
    margin: "0%",
  };

  const groupOptions = groups.map((group) => ({
    label: group.group_name,
    value: group.group_id,
  }));

  const roleOptions = [
    { label: "Normal OG", value: "normal" },
    { label: "Pro-human OG", value: "deductor" },
    { label: "Gamemaster", value: "gm" },
    { label: "Admin", value: "admin" },
  ];

  const onGroupChange = (selectedOption) => {
    setSelectedGroup(selectedOption);
  };

  const onRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption.value);
    console.log("Selected Role", selectedOption);
  };

  return (
    <div
      ref={constraintsRef}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "rgb(0, 128, 128)",
      }}
    >
      <motion.div
        drag
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={modalVariants}
        dragConstraints={constraintsRef}
        style={{ rotate: rotateValue, x: dragX }} // Apply the dynamic rotation and x position
      >
        <Window style={windowStyle}>
          <WindowHeader>
            <span>Sign up</span>
          </WindowHeader>
          <WindowContent>
            <form onSubmit={handleSubmit}>
              <div>
                <div style={{ display: "flex" }}>
                  <TextInput
                    placeholder="Email Address"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                  />
                </div>
                <br />
                <TextInput
                  placeholder="Password"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <br />
                <GroupBox label="Select your Role">
                  <Select
                    defaultValue={2}
                    options={roleOptions}
                    menuMaxHeight={160}
                    width="100%"
                    onChange={onRoleChange}
                  />
                </GroupBox>
                {(selectedRole === "deductor" || selectedRole === "normal") && (
                  <GroupBox label="Select your Orientation Group">
                    <Select
                      defaultValue={2}
                      options={groupOptions}
                      menuMaxHeight={160}
                      width="100%"
                      onChange={onGroupChange}
                    />
                  </GroupBox>
                )}

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Button type="submit" value="login">
                    Enter
                  </Button>
                </div>
              </div>
            </form>
          </WindowContent>
        </Window>
      </motion.div>
      {isModalOpen && (
        <div
          ref={constraintsRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex", // Use flexbox for centering
            alignItems: "center", // Vertical center
            justifyContent: "center", // Horizontal center
            zIndex: 10, // Ensure it's above other content
          }}
        >
          <motion.div
            drag
            dragConstraints={constraintsRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            style={{
              rotate: rotateValueError,
              x: dragxError,
              position: "absolute",
              top: "50%",
              left: "0%",
              width: "80%", // Responsive width
              maxWidth: "90%", // Ensures it doesn't get too large on big screens
              zIndex: 10,
            }}
          >
            <Window style={windowStyle}>
              <StyledWindowHeader
                messageType={error.type} // Pass the messageType based on error state
              >
                <span>{error.name} ⚠️</span>
                <Button
                  onClick={() => {
                    setError(null);
                    setIsModalOpen(false);
                    if (error.type === "success") {
                      navigate("/"); // Use navigate to redirect for success
                    }
                  }}
                >
                  <CloseIcon />
                </Button>
              </StyledWindowHeader>
              <WindowContent>{error.message}</WindowContent>
            </Window>
          </motion.div>
        </div>
      )}
    </div>
  );
};
