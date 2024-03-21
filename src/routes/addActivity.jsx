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
  ScrollView,
} from "react95";
import styled from "styled-components";
import { supabaseClient } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  fetchGroup,
  fetchActivities,
  addActivity,
  addGroupActivity,
} from "../supabase/services";
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
  const [newGroupActivity, setNewGroupActivity] = useState({
    group_id: "",
    activity_id: "",
    points_earned: 0,
  });
  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    Promise.all([fetchActivities()]).then((data) => {
      setActivityData([
        ...data[0],
        { name: "Create Activity", activity_id: "custom" },
      ]);
      setLoading(false);
    });
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

  const windowStyle = {
    width: windowWidth > 500 ? 500 : "90%", // Adjust width here
    margin: "0%",
  };

  const handleAddActivity = async () => {
    let activityToAdd;

    if (selectedActivity.activity_id === "custom") {
      console.log(
        "Please fill in all fields" + newActivity.description + newActivity.name
      );

      if (newActivity.description == "" || newActivity.name == "") {
        setError("Please fill in all fields");
        setIsModalOpen(true);
        return;
      }

      try {
        // Directly await the addActivity call without using Promise.all for a single promise
        const [addedActivity] = await addActivity(newActivity);
        console.log("Custom activity received: ", addedActivity);
        activityToAdd = addedActivity;
        console.log("Custom: ", activityToAdd);
      } catch (error) {
        console.error("Error adding activity: ", error);
        setError("Failed to add activity"); // Set an error message to display in your modal
        setIsModalOpen(true);
      }
    }
    if (activityToAdd === undefined) {
      activityToAdd = selectedActivity;
    }

    const group = await fetchGroup();

    newGroupActivity.activity_id = activityToAdd.activity_id;
    newGroupActivity.group_id = group.group_id;

    console.log("Adding activity: ", newGroupActivity);
    
    try { 
      await addGroupActivity(newGroupActivity);
      setNewActivity({ name: "", description: "" });
      navigate("/progress");
    } catch (error) {
      console.error("Error adding group activity: ", error);
      setError("Failed to add group activity"); // Set an error message to display in your modal
      setIsModalOpen(true);
    }
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
            onChange={(e) => {
              setSelectedActivity(e.value)
              setNewGroupActivity({ ...newGroupActivity, activity_id: e.value.activity_id })
            }
            }
            //max height should be 20% of screen
            menuMaxHeight = {window.innerHeight * 0.2}
          />
        </GroupBox>

        <GroupBox label="Select Group">
            
            <Select
              options={activityData.map((activity) => ({
                label: activity.name,
                value: activity.name,
              }))}
              width="100%"
              onChange={(e) => {
                setSelectedActivity(e.value)
                setNewGroupActivity({ ...newGroupActivity, activity_id: e.value.activity_id })
              }
              }
              //max height should be 20% of screen
              menuMaxHeight = {window.innerHeight * 0.2}
            />
          </GroupBox>
        
        {selectedActivity && selectedActivity.activity_id === "custom" && (
          <div style={{ marginTop: "20px" }}>
            <TextInput
              value={newActivity.name}
              placeholder="Activity name"
              onChange={(e) =>
                setNewActivity({ ...newActivity, name: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />
            <TextInput
              value={newActivity.description}
              multiline
              onChange={(e) =>
                setNewActivity({ ...newActivity, description: e.target.value })
              }
              placeholder="Description"
              style={{ marginBottom: "10px" }}
            />
          </div>
        )}
        {selectedActivity && selectedActivity.activity_id != "custom" && (
          <div style={{ marginTop: "10px" }}>
            <p>Activity: {selectedActivity.name}</p>
            <p>Description: {selectedActivity.description}</p>
          </div>
        )}

        {selectedActivity && (
          <PointsSection>
            <p>Points earned: </p>
            <NumberInput
              value={newGroupActivity.points_earned}
              defaultValue={0}
              step={20}
              min={0}
              max={200}
              onChange={(e) =>
                setNewGroupActivity({ ...newGroupActivity, points_earned: e })
              }
            />
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
