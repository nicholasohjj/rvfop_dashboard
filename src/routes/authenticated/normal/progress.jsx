import { useState, useEffect, useRef, useContext, Suspense } from "react";
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
  Separator,
  Tooltip,
} from "react95";
import styled from "styled-components";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  fetchGroupActivities,
  fetchGroup,
  fetchMembers,
  fetchDeductedDeductions,
} from "../../../supabase/services";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../../context/context";

import { formatSGT } from "../../../utils/time";
import { ProfileAvatar } from "../../../components/profileavatar";
import { Helmet } from "react-helmet";

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
  const [deductions, setDeductions] = useState([]); // Initialize to an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [members, setMembers] = useState([]); // Initialize to an empty array
  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);
  const navigate = useNavigate();
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees
  const { user } = useContext(userContext);

  useEffect(() => {
    const init = async () => {
      if (user && !user.has_progress) {
        navigate("/", { replace: true });
      }
      if (user && !user?.group_id) {
        return;
      }

      try {
        if (user) {
          const group = await fetchGroup(user?.group_id);
          console.log("group", group);
          setGroupData(group);

          const membersData = await fetchMembers(user?.group_id);
          console.log("membersData", membersData);
          setMembers(membersData);

          if (group) {
            const activityData = await fetchGroupActivities(group.group_id);
            setActivityData(activityData);

            const deductedDeductions = await fetchDeductedDeductions(
              group.group_id
            );
            setDeductions(deductedDeductions);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } 
    };
    init();
  }, [user, navigate]);

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
      <Helmet>
        <title>Insieme 2024 - My Progress</title>
        <meta
          name="description"
          content="Track your progress here during Insieme 2024"
        />
      </Helmet>
      <WindowHeader>My Progress</WindowHeader>
      <WindowContent
        style={{
          flex: 1, // Make WindowContent fill the available space
          display: "flex", // Enable flex layout
          flexDirection: "column", // Stack children vertically
        }}
      >
        {groupData ? (
          <div>
            <GroupBox
              label={`Group: ${groupData.group_name}`}
              style={{ marginBottom: 20 }}
            >
              Total Points Earned: {groupData.total_points}
            </GroupBox>
            <div
              style={{
                flex: 1,
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              {members.length > 0 &&
                members.map((member, index) => (
                  <div key={index} style={{ margin: "0 5px" }}>
                    <Tooltip
                      text={member.profile_name}
                      enterDelay={100}
                      leaveDelay={100}
                    >
                      <ProfileAvatar
                        name={member.profile_name}
                        nameColor={member.id}
                      />
                    </Tooltip>
                  </div>
                ))}
            </div>

            <div style={{ marginTop: 10 }}>
              {ActivityData.length > 0 ? (
                <>
                  <h2 style={{ marginBottom: 20, fontWeight: "bold" }}>
                    Activities
                  </h2>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeadCell>Day</TableHeadCell>
                        <TableHeadCell>Activity</TableHeadCell>
                        <TableHeadCell>Points</TableHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ActivityData.map((activity, index) => (
                        <TableRow key={index} onClick={() => handleViewButtonClick(activity)}>
                          <TableDataCell>
                            {formatSGT(activity.tm_created)}
                          </TableDataCell>
                          <TableDataCell>
                            {activity.activity_name}
                          </TableDataCell>
                          <TableDataCell>
                            {activity.points_earned}
                          </TableDataCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  No activities found.
                </div>
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
                      <span>{selectedActivity.activity_name}</span>
                      <Button onClick={() => setIsModalOpen(false)}>
                        <CloseIcon />
                      </Button>
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
            <div style={{ marginTop: 10 }}>
              {deductions.length > 0 && (
                <>
                  <Separator style={{ marginBottom: 20, marginTop: 20 }} />
                  <h2 style={{ marginBottom: 20, fontWeight: "bold" }}>
                    Deductions
                  </h2>

                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeadCell>Day</TableHeadCell>
                        <TableHeadCell>Points deducted</TableHeadCell>
                        <TableHeadCell>Comments</TableHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deductions.map((deduction, index) => (
                        <TableRow key={index}>
                          <TableDataCell>
                            {formatSGT(deduction.tm_created)}
                          </TableDataCell>
                          <TableDataCell>
                            {deduction.points_deducted}
                          </TableDataCell>
                          <TableDataCell>
                            {deduction.comments ? deduction.comments : "-"}
                          </TableDataCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            You are not associated with any group.
          </div>
        )}
      </WindowContent>
    </Window>
  );

};
export default Progress;
