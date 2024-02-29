import React, { useState, useEffect } from 'react';
import {
  Button,
  Select,
  Window,
  WindowContent,
  WindowHeader,
  Hourglass,
  GroupBox,
  NumberInput,
} from 'react95';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { supabaseClient } from '../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
// Styled components
const StyledWindow = styled(Window)`
  flex: 1;
  max-width: 100vw;
  margin: 0 auto;
  position: relative;
  width: ${({ windowWidth }) => (windowWidth > 500 ? '500px' : '90%')};
`;

const StyledWindowHeader = styled(WindowHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const StyledCloseIcon = styled.div`
  /* Your CloseIcon styles */
`;

const StyledWindowContent = styled(WindowContent)`
  overflow-x: visible;
`;

const ActivityDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
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
  const [selectedActivity, setSelectedActivity] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    fetchActivities();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseClient.from('activities').select('*');
      if (error) throw error;
      setActivityData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async () => {
    console.log("Adding activity: ", selectedActivity);
  };


  if (loading) {
    return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
    >
  <Hourglass size={32} />
    </div>
  )
  }


  return (
    <StyledWindow windowWidth={windowWidth}>
      <StyledWindowHeader>
        <span>Add Activity</span>
        <StyledCloseIcon />
      </StyledWindowHeader>
      <StyledWindowContent>
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
        {selectedActivity && (
          <ActivityDetails>
            <p>Activity: {selectedActivity.name}</p>
            <p>Description: {selectedActivity.description}</p>
            <PointsSection>
              <p>Points earned: </p>
              <NumberInput defaultValue={0} step={20} min={0} max={200} />
            </PointsSection>
          </ActivityDetails>
          
        )}
        <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
          width: "100%",
        }}
        >
        <Button
        onClick={() => navigate('/')}
        >
          Go back
        </Button>
        {selectedActivity && (
        <Button
        onClick={() => handleAddActivity()}
        >
          Add
        </Button>
        )}
        </div>

      </StyledWindowContent>
    </StyledWindow>
  );
};

export default AddActivity;
