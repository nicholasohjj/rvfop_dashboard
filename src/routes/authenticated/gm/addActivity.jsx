import { useState, useRef, useEffect, useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  fetchActivities,
  fetchGroups,
  addActivity,
  addGroupActivity,
} from "../../../supabase/services";
import { useStore, groupsContext } from "../../../context/context";
import { userContext } from "../../../context/context";
import { Helmet } from "react-helmet";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { groups, setGroups } = useContext(groupsContext);
  const { user, setUser } = useContext(userContext);
  const [newActivity, setNewActivity] = useState({
    activity_name: "",
    description: "",
  });
  const [newGroupActivity, setNewGroupActivity] = useState({
    group_id: "",
    activity_id: "",
    points_earned: 0,
    gm_id: "",
    comments: "",
  });
  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees
  const navigate = useNavigate();
  const storeGroups = useStore((state) => state.groups);
  useEffect(() => {
    const init = async () => {
      if (!groups.length) {
        const groups = await fetchGroups();
        setGroups(groups);
      }
      setSelectedGroup(groups[0]);
    };
    init();
  }, [groups, navigate]);

  // New useEffect hook for fetching activities
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const activities = await fetchActivities();

        setActivityData([
          ...activities,
          { activity_name: "Create Activity", activity_id: "custom" },
        ]);
        setSelectedActivity(activities[0]);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivityData();
  }, [storeGroups.length]);

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
    overflow: "auto",
  };

  const handleAddActivity = async () => {
    let activityToAdd;

    if (!selectedGroup) {
      setError("Please select a group");
      setIsModalOpen(true);
      return;
    }

    if (selectedActivity.activity_id === "custom") {
      if (newActivity.description == "" || newActivity.activity_name == "") {
        setError("Please fill in all fields");
        setIsModalOpen(true);
        return;
      }

      // if points <= 0, don't add activity
      if (newGroupActivity.points_earned <= 0) {
        setError("Please enter a valid number of points");
        setIsModalOpen(true);
        return;
      }

      try {
        // Directly await the addActivity call without using Promise.all for a single promise
        const [addedActivity] = await addActivity(newActivity);
        activityToAdd = addedActivity;
      } catch (error) {
        console.error("Error adding activity: ", error);
        setError("Failed to add activity"); // Set an error message to display in your modal
        setIsModalOpen(true);
      }
    }
    if (activityToAdd === undefined) {
      activityToAdd = selectedActivity;
    }

    newGroupActivity.activity_id = activityToAdd.activity_id;
    newGroupActivity.group_id = selectedGroup.group_id;
    newGroupActivity.gm_id = user.id;

    // if points <= 0, don't add activity
    if (newGroupActivity.points_earned <= 0) {
      setError("Please enter a valid number of points");
      setIsModalOpen(true);
      return;
    }

    try {
      await addGroupActivity(newGroupActivity);
      setNewActivity({ activity_name: "", description: "" });
      navigate("/progress");
    } catch (error) {
      console.error("Error adding group activity: ", error);
      setError("Failed to add group activity"); // Set an error message to display in your modal
      setIsModalOpen(true);
    }
  };

  return (
    <StyledWindow windowWidth={windowWidth}>
      <Helmet>
        <title>Insieme 2024 - Add an activity</title>
        <meta name="description" content="Add activity page" />
      </Helmet>
      <WindowHeader>
        <span>Add Activity</span>
      </WindowHeader>
      <WindowContent style={{ overflowX: "visible" }}>
        <GroupBox label="Select Activity">
          <Select
            value={selectedActivity}
            options={activityData.map((activity) => ({
              label: activity.activity_name,
              value: activity,
            }))}
            width="100%"
            onChange={(e) => {
              setSelectedActivity(e.value);
              setNewGroupActivity({
                ...newGroupActivity,
                activity_id: e.value.activity_id,
              });
            }}
            //max height should be 20% of screen
            menuMaxHeight={window.innerHeight * 0.2}
          />
        </GroupBox>

        <GroupBox label="Select Group">
          <Select
            value={selectedGroup}
            options={groups.map((group) => ({
              label: group.group_name,
              value: group,
            }))}
            width="100%"
            onChange={(e) => {
              setSelectedGroup(e.value);
            }}
            //max height should be 20% of screen
            menuMaxHeight={window.innerHeight * 0.4}
          />
        </GroupBox>

        {selectedActivity && selectedActivity.activity_id === "custom" && (
          <div style={{ marginTop: "20px" }}>
            <TextInput
              value={newActivity.activity_name}
              placeholder="Activity name"
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  activity_name: e.target.value,
                })
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
        {selectedActivity &&
          selectedActivity.activity_id != "custom" &&
          selectedActivity.activity_id != "" && (
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column", // Stack information vertically for clarity
                  alignItems: "center", // Center-align the items for a neat look
                  marginBottom: "10px", // Add some space before the description
                }}
              >
                <div style={{ marginBottom: "5px" }}>
                  <strong>Activity:</strong> {selectedActivity.activity_name}
                </div>
                <div style={{ marginBottom: "5px" }}>
                  <strong>Group:</strong>{" "}
                  {selectedGroup ? selectedGroup.group_name : "Not selected"}
                </div>
              </div>
              <GroupBox
                label="Description"
                style={{ padding: "10px", margin: "0 auto", maxWidth: "90%" }}
              >
                {selectedActivity.description || "No description available."}
              </GroupBox>
            </div>
          )}

        {selectedActivity &&
          selectedActivity.activity_id != "" &&
          selectedGroup?.group_id && (
            <div style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
            
            }}>
                          <TextInput
                value={newGroupActivity.comments}
                multiline
                onChange={(e) => {
                  setNewGroupActivity({
                    ...newGroupActivity,
                    comments: e.target.value,
                  });
                }}
                placeholder="Comments. Note: Awarded Group will see this."
                style={{ marginBottom: "10px" }}
              />
              <PointsSection>
                <p>Points earned: </p>
                <NumberInput
                  defaultValue={0}
                  step={1}
                  min={0}
                  max={200}
                  onChange={(e) =>
                    setNewGroupActivity({
                      ...newGroupActivity,
                      points_earned: e,
                    })
                  }
                />
              </PointsSection>

            </div>
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
          {selectedActivity &&
            selectedActivity.activity_id != "" &&
            selectedGroup?.group_id && (
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
