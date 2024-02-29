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
const AddDeduction = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const dragxError = useMotionValue(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabaseClient.auth.getUser();
        if (userError) throw userError;

        const { data: fetchedGroupData, error: fetchDataError } =
          await supabaseClient.rpc("fetch_group_data", { user_id: user.id });

        if (fetchDataError) throw fetchDataError;

        if (fetchedGroupData && fetchedGroupData.length > 0) {
          const group = fetchedGroupData[0]; // Assuming the first group is what you're interested in
          setGroupData(group);

        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    fetchHouses();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchHouses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient.from("houses").select("*");
      if (error) throw error;
      setHouses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDeduction = async () => {
    return;
  };

  if (loading) return <Loading />;


  houses.sort((a, b) => a.total_points > b.total_points ? -1 : 1);
  return (
    <StyledWindow windowWidth={windowWidth}>
      <WindowHeader>
        <span>Add Deduction 😈</span>
      </WindowHeader>
      <WindowContent style={{ overflowX: "visible" }}>
        <GroupBox style={{ marginBottom: "10px" }}>
          You have {groupData.total_points} points in total. You can deduct a maximum of {groupData.total_points} points.
        </GroupBox>
        <GroupBox label="Select House to Deduct">
          <Select
            options={houses.map((house) => ({
              label: house.name + ` (${house.total_points} points)`,
              value: house,
            }))}
            width="100%"
            onChange={(e) => setSelectedHouse(e.value)}
          />
        </GroupBox>

        {selectedHouse && (
          <PointsSection>
            <p>Points to deduct: </p>
            <NumberInput defaultValue={0} step={20} min={0} max={groupData.total_points} />
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
            <Button onClick={() => handleApplyDeduction()}>Deduct</Button>
          )}
        </div>
      </WindowContent>
    </StyledWindow>
  );
};

export default AddDeduction;
