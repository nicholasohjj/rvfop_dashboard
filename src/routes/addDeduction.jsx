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
import { supabaseClient } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { fetchHouses, fetchGroup, addDeduction } from "../supabase/services";
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

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true); // Ensure loading is true at the start

    Promise.all([fetchGroup(), fetchHouses()])
      .then(([groupData, housesData]) => {
        setGroup(groupData);
        setHouses(housesData);
        setLoading(false); // Set loading to false once both promises resolve
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
        setLoading(false); // Ensure loading is set to false even if there's an error
      });

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddDeduction = async () => {
    const deduction = {
      house_id: selectedHouse.house_id,
      group_id: group.group_id,
      points_deducted: deductionPoints,
    }

    try {
      const response = await addDeduction(deduction)
      console.log(response)
      return
    } catch (error) {
      alert(error)
    }

    console.log(deduction)
  };

  if (loading) return <Loading />;

  houses.sort((a, b) => (a.total_points > b.total_points ? -1 : 1));
  return (
    <StyledWindow windowWidth={windowWidth}>
      <WindowHeader>
        <span>Add Deduction 😈</span>
      </WindowHeader>
      <WindowContent style={{ overflowX: "visible" }}>
        <GroupBox style={{ marginBottom: "10px" }}>
          You have {group.total_points} points in total. You can deduct a
          maximum of {group.total_points} points.
        </GroupBox>
        <GroupBox label="Select House to Deduct">
          <Select
            options={houses.map((house) => ({
              label: house.name + ` (${house.total_points} points)`,
              value: house,
            }))}
            width="100%"
            onChange={(e) => {
              setSelectedHouse(e.value);
              setDeductionPoints(0);
            }}
          />
        </GroupBox>

        {selectedHouse && (
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
          <Button onClick={() => navigate("/")}>Go back</Button>
          {selectedHouse && (
            <Button onClick={() => handleAddDeduction()}>Deduct</Button>
          )}
        </div>
      </WindowContent>
    </StyledWindow>
  );
};

export default AddDeduction;
