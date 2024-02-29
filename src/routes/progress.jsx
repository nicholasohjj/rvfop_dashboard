import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Window,
  WindowContent,
  WindowHeader,
  Hourglass,
  GroupBox,
} from "react95";
import { motion } from "framer-motion"; // Import Framer Motion
import { supabaseClient } from "../supabase/supabaseClient";
const Progress = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [user, setUser] = useState();
  const [groupData, setGroupData] = useState(null); // Initialize to null for better checks
  const [ActivityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const constraintsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    setLoading(true);
    const fetchGroupAndActivityData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabaseClient.auth.getUser();
        if (userError) throw userError;
        setUser(user);

        const { data: fetchedGroupData, error: fetchDataError } =
          await supabaseClient.rpc("fetch_group_data", { user_id: user.id });

        if (fetchDataError) throw fetchDataError;

        if (fetchedGroupData && fetchedGroupData.length > 0) {
          const group = fetchedGroupData[0]; // Assuming the first group is what you're interested in
          setGroupData(group);

          const { data: activityData, error: activityError } =
            await supabaseClient.rpc("get_activity_data", {
              current_group_id: group.group_id,
            });

          if (activityError) throw activityError;
          setActivityData(activityData);
          console.log("Activity data: ", activityData);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndActivityData();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <Window style={{ flex: 1, alignItems: "center", width: 320 }}>
        <WindowHeader>My Progress</WindowHeader>
        <Hourglass
          size={32}
          style={{ flex: 1, alignItems: "center", margin: 20 }}
        />
      </Window>
    );
  }

  // Helper function to convert UTC to SGT and format to "day-month"
  const formatSGT = (utcString) => {
    const utcDate = new Date(utcString);
    // Convert UTC date to SGT (UTC+8)
    const sgtDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);
    // Format date to "day-month" using Intl.DateTimeFormat
    return new Intl.DateTimeFormat("en-SG", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(sgtDate);
  };

  const handleViewButtonClick = (activity) => {
    setIsModalOpen(!isModalOpen);
    setSelectedActivity(activity); // Set the selected activity
  };

  const windowStyle = {
    width: windowWidth > 500 ? 500 : '90%', // Adjust width here
    margin: "0%",
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.75,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Window style={{ flex: 1, maxWidth: '100vw', margin: '0 auto', position: 'relative' }}>
      <WindowHeader>My Progress</WindowHeader>
      <WindowContent>
        <GroupBox label={`Group: ${groupData.name}`}>
          Total Points Earned: {groupData.total_points}
        </GroupBox>
        <div style={{ overflowX: 'auto' }}> {/* Container to make the table scrollable */}

        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Day</TableHeadCell>
              <TableHeadCell>Activity</TableHeadCell>
              <TableHeadCell>Points</TableHeadCell>
              <TableHeadCell>Details</TableHeadCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {ActivityData.map((activity, index) => (
              <TableRow key={index}>
                <TableDataCell>{formatSGT(activity.tm_created)}</TableDataCell>
                <TableDataCell>{activity.name}</TableDataCell>
                <TableDataCell>{activity.points_earned}</TableDataCell>
                <TableDataCell style={{gap:16, display:'flex', justifyContent:'center'}}>
                  <Button onClick={() => handleViewButtonClick(activity)}>
                    View
                  </Button>
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </WindowContent>

      {isModalOpen && (
        <div
        ref={constraintsRef}
        style={{
          display: "flex",
          flexDirection: "column",
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
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', // Responsive width
            maxWidth: '90%', // Ensures it doesn't get too large on big screens
            zIndex: 10,
          }}
        >
          <Window style={{ width: '100%' }}>
            <WindowHeader>{selectedActivity.name}</WindowHeader>
            <WindowContent>
              <div style={{marginBottom:10}}>
              <GroupBox label="Description">
              {selectedActivity?.description} 
              </GroupBox>
                <GroupBox label="Points Earned">
              {selectedActivity?.points_earned} 
                </GroupBox>
              </div>

                
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </WindowContent>
          </Window>
        </motion.div>
        </div>

          
      )}
    </Window>
  );
};
export default Progress;
