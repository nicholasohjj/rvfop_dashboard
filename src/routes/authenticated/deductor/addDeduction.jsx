import { useState, useRef, useEffect, useContext } from "react";
import {
  Button,
  Select,
  Window,
  WindowContent,
  WindowHeader,
  GroupBox,
  TextInput,
  NumberInput,
} from "react95";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  fetchGroups,
  fetchGroup,
  addDeduction,
} from "../../../supabase/services";
import { groupsContext, userContext } from "../../../context/context";
import { Helmet } from "react-helmet";
import { supabaseClient } from "../../../supabase/supabaseClient";

// Styled components
const StyledWindow = styled(Window)`
  flex: 1;
  max-width: 100vw;
  overflow: auto;
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

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
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
const AddDeduction = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { groups, setGroups } = useContext(groupsContext);
  const [comments, setComments] = useState("");
  const [group, setGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [deductionPoints, setDeductionPoints] = useState(0);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, setUser } = useContext(userContext);

  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        if (!user?.group_id) {
          return;
        }

        if (!groups.length) {
          fetchGroups().then((data) => {
            setGroups(data);
          });
        }

        if (!group) {
          const groupData = await fetchGroup(user.group_id);
          setGroup(groupData);
        }
      } catch (error) {
        setError(error.message);
        console.error("Initialization error:", error);
      }
    };

    init();
  }, [group, groups, navigate, user]); // Update dependencies

  const handleUpdate = (payload) => {
    const updatedGroup = payload.new;

    // update group in groups state
    setGroups((currentGroups) => {
      return currentGroups.map((group) =>
        group.group_id === updatedGroup.group_id ? updatedGroup : group
      );
    });

    // if group is my group, update it as well
    if (group?.group_id === updatedGroup.group_id) {
      setGroup(updatedGroup);
    }

    // if group is selected group, update it as well
    if (selectedGroup?.group_id === updatedGroup.group_id) {
      setSelectedGroup(updatedGroup);
    }
  };

  useEffect(() => {
    const channel = supabaseClient
      .channel("groups")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "groups" },
        handleUpdate
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  const handleAddDeduction = async () => {
    if (!selectedGroup || deductionPoints <= 0) {
      setError("Please select a group and specify the points to deduct.");
      setIsModalOpen(true);
      return;
    }

    const deduction = {
      deducted_group_id: selectedGroup.group_id,
      group_id: group.group_id,
      points_deducted: deductionPoints,
      comments: comments,
    };

    try {
      await addDeduction(deduction);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error adding deduction: ", error);
      setError(error.message); // Set an error message to display in your modal
      setIsModalOpen(true); // Open the modal to display the error
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

  const handleSelectChange = (selectedOption) => {
    setSelectedGroup(selectedOption.value);
    setDeductionPoints(0);
  };

  return (
    <StyledWindow windowWidth={windowWidth}>
      <Helmet>
        <title>Insieme 2024 - Add a deduction</title>
        <meta name="description" content="Add deduction page" />
      </Helmet>
      <WindowHeader>
        <span>Add Deduction</span>
      </WindowHeader>
      <WindowContent style={{ overflowX: "visible" }}>
        {group?.total_points >= 0 ? (
          <div>
            <GroupBox style={{ marginBottom: "20px" }}>
              You have {group.total_points} points in total. You can deduct a
              maximum of {group.total_points} points. Note: You can only deduct
              points from other groups with points.
            </GroupBox>

            <GroupBox label="Select Group to Deduct">
              <Select
                value={selectedGroup}
                onChange={handleSelectChange}
                options={groups.map((group) => ({
                  label: `${group.group_name} (${group.total_points} points)`,
                  value: group,
                }))}
                width="100%"
                menuMaxHeight={window.innerHeight * 0.4}
              />
            </GroupBox>

            {group?.total_points >= 0 &&
              selectedGroup &&
              selectedGroup.group_id && (
                <div style={{ marginTop: "10px" }}>
                  <TextInput
                    value={comments}
                    multiline
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Comments. Note: Deducted group will see this."
                    style={{ marginBottom: "10px" }}
                  />
                  <PointsSection>
                    <p>Points to deduct: </p>
                    <NumberInput
                      value={deductionPoints}
                      onChange={(value) => setDeductionPoints(Number(value))}
                      step={20}
                      min={0}
                      max={Math.min(
                        group.total_points,
                        selectedGroup.total_points
                      )}
                    />
                  </PointsSection>
                </div>
              )}

            <ActionButtonsContainer>
              <Button onClick={() => navigate("/")}>Go back</Button>
              {selectedGroup && deductionPoints > 0 && (
                <Button onClick={handleAddDeduction}>Deduct</Button>
              )}
            </ActionButtonsContainer>
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
          </div>
        ) : (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            You are not associated with any Pro-human group.
          </div>
        )}
      </WindowContent>
    </StyledWindow>
  );
};

export default AddDeduction;
