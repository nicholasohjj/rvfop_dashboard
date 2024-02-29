import { useState, useEffect, useRef } from "react";
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
  GroupBox,
} from "react95";
import styled from "styled-components";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { supabaseClient } from "../supabase/supabaseClient";
import Loading from "./loading";
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
  color: white; // Adjust the text color as needed for contrast
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Progress = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [groupData, setGroupData] = useState(null); // Initialize to null for better checks
  const [ActivityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);

  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    setLoading(true);
    const fetchGroupAndActivityData = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndActivityData();
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

  if (loading) return <Loading />;

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
    width: windowWidth > 500 ? 500 : "90%", // Adjust width here
    margin: "0%",
  };

  return (
    <Window
      style={{
        flex: 1,
        maxWidth: "100vw",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <WindowHeader>My Progress</WindowHeader>
      <WindowContent>
        <GroupBox label={`Group: ${groupData.name}`}>
          Total Points Earned: {groupData.total_points}
        </GroupBox>
        <div style={{ overflowX: "auto" }}>
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
                  <TableDataCell>
                    {formatSGT(activity.tm_created)}
                  </TableDataCell>
                  <TableDataCell>{activity.name}</TableDataCell>
                  <TableDataCell>{activity.points_earned}</TableDataCell>
                  <TableDataCell
                    style={{
                      gap: 16,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button onClick={() => handleViewButtonClick(activity)}>
                      View
                    </Button>
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                  <span>{selectedActivity.name}</span>
                  <Button onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                  </Button>{" "}
                </StyledWindowHeader>
                <WindowContent>
                  <div style={{ marginBottom: 10 }}>
                    <GroupBox label="Description">
                      {selectedActivity?.description}
                    </GroupBox>
                    <GroupBox label="Points Earned">
                      {selectedActivity?.points_earned}
                    </GroupBox>
                  </div>
                </WindowContent>
              </Window>
            </motion.div>
          </div>
        )}
      </WindowContent>
    </Window>
  );
};
export default Progress;
