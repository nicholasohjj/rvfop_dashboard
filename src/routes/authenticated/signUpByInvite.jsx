import { useState, useRef, useEffect, useContext } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  TextInput,
  Button,
  Select,
  GroupBox,
  Tooltip,
} from "react95";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { userContext } from "../../context/context";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabaseClient } from "../../supabase/supabaseClient";
import styled from "styled-components";
import { fetchGroups, fetchUser, fetchRoles } from "../../supabase/services";
import { Helmet } from "react-helmet";
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

export const SignupByInvite = () => {
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [roles, setRoles] = useState([]); // Add roles state
  const [password, setPassword] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null); // Add selectedGroup state
  const [selectedRole, setSelectedRole] = useState(null); // Add selectedRole state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [groups, setGroups] = useState([]); // Add groups state
  const { user, setUser } = useContext(userContext);
  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation
  const dragX = useMotionValue(0);
  const dragxError = useMotionValue(0);

  const rotateValue = useTransform(dragX, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  useEffect(() => {
    const fetch = async () => {
      if (!user) {
        const newUser = await fetchUser();

        if (!newUser) {
          navigate("/login", { replace: true });
          return;
        }
        setUser(newUser);
      }

      const groups = await fetchGroups();
      setSelectedGroup(groups[0].group_id);
      setGroups(groups);

      const roles = await fetchRoles();
      setRoles(roles);
      setSelectedRole(roles[0]);
    };

    fetch();
  }, [user, setUser]);

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

    if (!password || !name) {
      setError({
        name: "Error",
        message: "Please enter your name and password.",
      });
      setIsModalOpen(true);
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

    if (selectedRole.needs_group && !selectedGroup) {
      setIsModalOpen(true);
      setError({
        name: "Error",
        message: "Please select a group.",
      });
      return;
    }

    if (!selectedRole?.needs_group) {
      setSelectedGroup(null);
    }

    console.log(selectedRole, selectedGroup, name, email, password);

    try {
      const { data, error } = await supabaseClient.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: {
            name: name,
            role: selectedRole.role,
            group_id: selectedGroup,
          },
        }
      );

      if (data.user && "email_verified" in data.user.user_metadata) {
        setIsModalOpen(true);
        setError({
          name: "Account registered successfully!",
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
    label: group.group_display_name + " - " + group.group_name,
    value: group.group_id,
  }));

  const roleOptions = roles.map((role) => ({
    label: role.role_name,
    value: role,
  }));

  const onGroupChange = (selectedOption) => {
    setSelectedGroup(selectedOption.value);
  };

  const onRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption.value);
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
        background:
          "linear-gradient(to bottom, rgb(131, 220, 208), rgb(71, 161, 151))", // Use background instead of backgroundColor for gradients
      }}
    >
      <Helmet>
        <title>Insieme 2024 - Sign Up</title>
        <meta
          name="description"
          content="Received an invitation. Complete your signup process here!"
        />
      </Helmet>
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
            <span>Sign up (By Invite Only)</span>
          </WindowHeader>
          <div style={{ marginTop: 8 }}>
            <Tooltip text="Purr! 🐱‍" enterDelay={100} leaveDelay={100}>
              <img
                src="https://tygfzfyykirshnanbprr.supabase.co/storage/v1/object/public/rvfop/signup.png"
                alt="rvrc-logo"
                width={100}
              />
            </Tooltip>
          </div>
          <WindowContent>
            <form onSubmit={handleSubmit}>
              <div>
                <div style={{ display: "flex" }}>
                  <TextInput
                    placeholder="Profile Name (E.g John Doe)"
                    style={{ flex: 1 }}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <br />
                <div style={{ display: "flex" }}>
                  <TextInput
                    value={user?.email}
                    placeholder="Email Address"
                    disabled
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      setemail(e.target.value);
                    }}
                  />
                </div>
                <br />
                <TextInput
                  placeholder="Password"
                  style={{ flex: 1 }}
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <br />

                <GroupBox label="Select your Role">
                  <Select
                    value={selectedRole}
                    options={roleOptions}
                    menuMaxHeight={160}
                    width="100%"
                    onChange={onRoleChange}
                  />
                </GroupBox>
                {selectedRole?.needs_group && (
                  <GroupBox label="Select your Orientation Group">
                    <Select
                      value={selectedGroup}
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
                    Submit!
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
                    setError("");
                    setIsModalOpen(false);
                    if (error.type === "success") {
                      navigate("/", { replace: true }); // Use navigate to redirect for success
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
