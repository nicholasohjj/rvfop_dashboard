import { useState, useRef, useEffect } from "react";
import {
  Button,
  Select,
  Window,
  WindowContent,
  WindowHeader,
  GroupBox,
  NumberInput,
  TextInput,
} from "react95";
import styled from "styled-components";
import { supabaseClient } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";

import Loading from "./loading";
// Styled components
const StyledWindow = styled(Window)`
  flex: 1;
  max-width: 100vw;
  margin: 0 auto;
  position: relative;
  width: ${({ windowWidth }) => (windowWidth > 500 ? "500px" : "90%")};
`;

const StyledWindowHeader = styled(WindowHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  background-color: #ff0000; // Change this hex code to your desired color

`;

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

const PointsSection = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;

// Main component
const AddActivity = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({ name: "", description: "" });
  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    fetchActivities();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from("activities")
        .select("*");
      if (error) throw error;
      setActivityData([...data, { name: "Create Activity", id: "custom" }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const windowStyle = {
    width: windowWidth > 500 ? 500 : "90%", // Adjust width here
    margin: "0%",
  };

  const handleAddActivity = async () => {
    if (selectedActivity.id === "custom") {
      if (newActivity.description === "" || newActivity.name === "") {
        setError("Please fill in all fields");
        setIsModalOpen(true);
        return;
      }
      console.log("Adding custom activity: ", newActivity);
      return;
    }
    console.log("Adding activity: ", selectedActivity);
  };

  if (loading) return <Loading />;

  return (
    <StyledWindow windowWidth={windowWidth}>
      <WindowHeader>
        <span>Add Activity</span>
      </WindowHeader>
      <WindowContent style={{ overflowX: "visible" }}>
        <GroupBox label="Select Activity">
          <Select
            options={activityData.map((activity) => ({
              label: activity.name,
              value: activity,
            }))}
            width="100%"
            onChange={(e) => setSelectedActivity(e.value)}
          />
        </GroupBox>
        {selectedActivity && selectedActivity.id === "custom" && (
          <div style={{ marginTop: "20px" }}>
            <TextInput
              placeholder="Activity name"
              onChange={(e) =>
                setNewActivity({ ...newActivity, name: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />
            <TextInput
              multiline
              onChange={(e) =>
                setNewActivity({ ...newActivity, description: e.target.value })
              }
              placeholder="Description"
              style={{ marginBottom: "10px" }}
            />
          </div>
        )}
        {selectedActivity && selectedActivity.id != "custom" && (
          <div style={{ marginTop: "10px" }}>
            <p>Activity: {selectedActivity.name}</p>
            <p>Description: {selectedActivity.description}</p>
          </div>
        )}

        {selectedActivity && (
          <PointsSection>
            <p>Points earned: </p>
            <NumberInput defaultValue={0} step={20} min={0} max={200} />
          </PointsSection>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "20px",
            width: "100%",
          }}
        >
          <Button onClick={() => navigate("/")}>Go back</Button>
          {selectedActivity && (
            <Button onClick={() => handleAddActivity()}>Add</Button>
          )}
        </div>
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
                <StyledWindowHeader>
                  <span>Error ⚠️</span>
                  <Button onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                  </Button>
                </StyledWindowHeader>
                <WindowContent>{error}</WindowContent>
              </Window>
            </motion.div>
          </div>
        )}
      </WindowContent>
    </StyledWindow>
  );
};

export default AddActivity;
