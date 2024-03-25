import { useState, useRef, useEffect } from "react";
import {
  Button,
  Select,
  Window,
  WindowContent,
  WindowHeader,
  GroupBox,
  NumberInput,
} from "react95";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { fetchHouses, fetchGroup, addDeduction } from "../supabase/services";
import { useStore, initializeUserData } from "../context/userContext";
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
const AddDeduction = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [deductionPoints, setDeductionPoints] = useState(0);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  const navigate = useNavigate();
  const userData = useStore((state) => state.userData);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeUserData();
        if (!(userData.role === 'deductor' || userData.role === 'admin')) {
          navigate('/', { replace: true });
        }

        const [groupData, housesData] = await Promise.all([fetchGroup(), fetchHouses()]);
        setGroup(groupData);
        setHouses(housesData.sort((a, b) => b.total_points - a.total_points));
        setLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    if (!userData) init();
  }, [userData, navigate]); // Ensuring all dependencies are listed

  const handleAddDeduction = async () => {
    const deduction = {
      house_id: selectedHouse.house_id,
      group_id: group.group_id,
      points_deducted: deductionPoints,
    };

    try {
      const response = await addDeduction(deduction);
      console.log(response);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error adding deduction: ", error);
      setError(error.message); // Set an error message to display in your modal
      setIsModalOpen(true); // Open the modal to display the error
    }

    console.log(deduction);
  };

  if (loading) return <Loading />;

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

  houses.sort((a, b) => (a.total_points > b.total_points ? -1 : 1));
  return (
    <StyledWindow windowWidth={windowWidth}>
      <WindowHeader>
        <span>Add Deduction 😈</span>
      </WindowHeader>
      <WindowContent style={{ overflowX: "visible" }}>
        {'total_points' in group && (
          <GroupBox style={{ marginBottom: "10px" }}>
            You have {group.total_points} points in total. You can deduct a
            maximum of {group.total_points} points.
          </GroupBox>
        )}

        <GroupBox label="Select House to Deduct">
          <Select
            options={houses.map((house) => ({
              label: house.house_name + ` (${house.total_points} points)`,
              value: house,
            }))}
            width="100%"
            onChange={(e) => {
              setSelectedHouse(e.value);
              setDeductionPoints(0);
            }}
          />
        </GroupBox>

        {'total_points' in group && selectedHouse && (
          <PointsSection>
            <p>Points to deduct: </p>
            <NumberInput
              value={deductionPoints}
              onChange={(value) => setDeductionPoints(Number(value))} // Ensure value is a number
              step={20}
              min={0}
              max={Math.min(group.total_points, selectedHouse.total_points)}
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
          <Button onClick={() => navigate("/", { replace: true })}>
            Go back
          </Button>
          {selectedHouse && deductionPoints > 0 && (
            <Button onClick={() => handleAddDeduction()}>Deduct</Button>
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

export default AddDeduction;
