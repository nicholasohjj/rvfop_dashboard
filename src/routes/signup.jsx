import { useState, useRef, useEffect, useContext, useCallback } from "react";
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
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { supabaseClient } from "../supabase/supabaseClient";
import styled from "styled-components";
import { fetchGroups, fetchRoles } from "../supabase/services";
import { Helmet } from "react-helmet";
import { LoadingHourglass } from "../components/loadinghourglass";
import { groupsContext, sessionContext } from "../context/context";

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

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

const useFetchData = () => {
  const { groups, setGroups } = useContext(groupsContext);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (!groups.length) {
        const groupData = await fetchGroups();
        setGroups(groupData);
      }

      const roleData = await fetchRoles();
      setRoles(roleData);
    };
    init();
  }, [groups, setGroups]);

  return { groups, roles };
};

export const Signup = () => {
  const [captchaToken, setCaptchaToken] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    selectedGroup: null,
    selectedRole: null,
  });
  const windowWidth = useWindowWidth();
  const { groups, roles } = useFetchData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const captcha = useRef();
  const { session, setSession } = useContext(sessionContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const constraintsRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation
  const dragX = useMotionValue(0);
  const dragxError = useMotionValue(0);
  const rotateValue = useTransform(dragX, [-100, 100], [-10, 10]);
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]);

  const handleChange = useCallback(
    (e) => setFormData({ ...formData, [e.target.name]: e.target.value }),
    [formData]
  );

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOption.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, selectedGroup, selectedRole } = formData;

    if (!email || !password || !name) {
      setError({
        name: "Error",
        message: "Please enter your name, email and password.",
      });
      setIsModalOpen(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError({
        name: "Error",
        message: "Please enter a valid email address.",
      });
      setIsModalOpen(true);
      return;
    }

    if (selectedRole?.needs_group && !selectedGroup) {
      setError({ name: "Error", message: "Please select a group." });
      setIsModalOpen(true);
      return;
    }

    if (password.length < 6) {
      setError({
        name: "Error",
        message: "Password must be at least 6 characters.",
      });
      setIsModalOpen(true);
      return;
    }

    if (!selectedRole) {
      setError({ name: "Error", message: "Please select a role." });
      setIsModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          data: {
            group_id: selectedGroup,
            role: selectedRole.role,
            profile_name: name,
          },
        },
      });

      captcha.current.resetCaptcha()

      if (error) throw error;

      setIsLoading(false);
      if (data.user && data.user.user_metadata?.email_verified) {
        setError({
          name: "Account registered successfully!",
          message:
            "Please verify your email address by clicking the link in the email we sent you.",
          type: "success",
        });
        setIsModalOpen(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          selectedGroup: null,
          selectedRole: null,
        });
        return;
      } else {
        setError({ name: "Error", message: "Email already registered" });
        setIsModalOpen(true);
      }
    } catch (error) {
      setIsLoading(false);
      setError({ name: "Error", message: error.message });
      setIsModalOpen(true);
    }
  };

  const windowStyle = {
    width: windowWidth > 500 ? 500 : "90%",
    margin: "0%",
  };

  const groupOptions = groups
    .map((group) => ({ label: group.group_name, value: group.group_id }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const roleOptions = roles
    .map((role) => ({ label: role.role_name, value: role }))
    .sort((a, b) => a.label.localeCompare(b.label));

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
      <Helmet>
        <title>Insieme 2024 - Signup</title>
        <meta name="description" content="Insieme Signup page" />
      </Helmet>
      <motion.div
        drag
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { opacity: 0, scale: 0 },
          visible: { opacity: 1, scale: 1 },
        }}
        dragConstraints={constraintsRef}
        style={{ rotate: rotateValue, x: dragX }} // Apply the dynamic rotation and x position
      >
        <Window style={windowStyle}>
          <WindowHeader>
            <span>Sign up</span>
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
            {isLoading ? (
              <LoadingHourglass />
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <div style={{ display: "flex" }}>
                    <TextInput
                      placeholder="Profile Name (E.g John Doe)"
                      style={{ flex: 1 }}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <br />
                  <div style={{ display: "flex" }}>
                    <TextInput
                      placeholder="Email Address"
                      style={{ flex: 1 }}
                      value={formData.email}
                      name="email"
                      onChange={handleChange}
                    />
                  </div>
                  <br />
                  <TextInput
                    placeholder="Password"
                    style={{ flex: 1 }}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <br />

                  <GroupBox label="Select your Role">
                    <Select
                      options={roleOptions}
                      menuMaxHeight={160}
                      width="100%"
                      onChange={(option) =>
                        handleSelectChange(option, "selectedRole")
                      }
                    />
                  </GroupBox>
                  {formData.selectedRole?.needs_group && (
                    <GroupBox label="Select your Orientation Group">
                      <Select
                        options={groupOptions}
                        menuMaxHeight={160}
                        width="100%"
                        onChange={(option) =>
                          handleSelectChange(option, "selectedGroup")
                        }
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
                    <HCaptcha
                      ref={captcha}
                      sitekey="736ec14e-6698-40de-b576-06aa9220d1f2"
                      onVerify={(token) => {
                        setCaptchaToken(token);
                      }}
                    />
                  </div>

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
            )}
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
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: { opacity: 1, scale: 1 },
            }}
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
                      setSession({
                        user: null,
                        session: null,
                      });
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
