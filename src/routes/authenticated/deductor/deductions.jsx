import { useState, useEffect, useRef, useContext } from "react";
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
import Loading from "../../loading";
import { fetchGroup, fetchDeductions } from "../../../supabase/services";
import { userContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import { formatSGT } from "../../../utils/time";
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

const Deductions = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { user, setUser } = useContext(userContext);
  const [groupData, setGroupData] = useState(null); // Initialize to null for better checks
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] = useState(null);
  const [deductionData, setDeductionData] = useState([]);
  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);
  const navigate = useNavigate();
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      if (!user?.can_deduct) {
        navigate("/", { replace: true });
      }

      if (user && !user.group_id) {
        setLoading(false);
        return;
      }

      try {
        const group = await fetchGroup(user.group_id);
        setGroupData(group);

        const deductionData = await fetchDeductions(user.group_id);
        setDeductionData(deductionData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
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

  if (loading) return <Loading />;

  const handleViewButtonClick = (deduction) => {
    setIsModalOpen(!isModalOpen);
    setSelectedDeduction(deduction); // Set the selected activity
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
        <title>Insieme 2024 - My deductions</title>
        <meta name="description" content="Track your deductions here" />
      </Helmet>
      <WindowHeader>My Deductions</WindowHeader>
      <WindowContent>
        <div style={{ marginTop: 10 }}>
          {groupData && deductionData.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Day</TableHeadCell>
                  <TableHeadCell>Points deducted</TableHeadCell>
                  <TableHeadCell>Deducted Group</TableHeadCell>
                  <TableHeadCell>Details</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deductionData.map((deduction, index) => (
                  <TableRow key={index}>
                    <TableDataCell>
                      {formatSGT(deduction.tm_created)}
                    </TableDataCell>
                    <TableDataCell>{deduction.points_deducted}</TableDataCell>
                    <TableDataCell>{deduction.groups.group_name}</TableDataCell>
                    <TableDataCell
                      style={{
                        gap: 16,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button onClick={() => handleViewButtonClick(deduction)}>
                        View
                      </Button>
                    </TableDataCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              No deductions found.
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
                  <span>{selectedDeduction.groups.group_name}</span>
                  <Button onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                  </Button>
                </StyledWindowHeader>
                <WindowContent>
                  <div style={{ marginBottom: 10 }}>
                    <GroupBox label="Date">
                      {selectedDeduction?.tm_created}
                    </GroupBox>
                    <GroupBox label="Points Deducted">
                      {selectedDeduction?.points_deducted}
                    </GroupBox>
                    <GroupBox label="Comments">
                      {selectedDeduction?.comments}
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
export default Deductions;
