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
import { fetchAwardedGames } from "../../../supabase/services";
import { useNavigate } from "react-router-dom";
import { formatSGT } from "../../../utils/formatsgt";
import { userContext } from "../../../context/userContext";

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

const Games = () => {
  const {user, setUser} = useContext(userContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [awardedGames, setAwardedGames] = useState([]); // Initialize to empty array
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);

  const navigate = useNavigate();
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  useEffect(() => {
    const fetchData = async () => {
        if (!user?.can_add_activity) {
          navigate("/", { replace: true });
        }
      

      if (user && !user.id) {
        setLoading(false);
        return;
      }

      // Assuming `fetchAwardedGames` is an async function that needs a user ID
      try {
        const awardedGames = await fetchAwardedGames(user.id);
        setAwardedGames(awardedGames); // Assuming this is what you intend to do with the fetched data
      } catch (error) {
        console.error("Failed to fetch awarded games:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [user, navigate]); // Dependency array

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

  const handleViewButtonClick = (game) => {
    setIsModalOpen(!isModalOpen);
    setSelectedGame(game); // Set the selected activity
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
        maxHeight: "100vh",
        overflow: "auto",
      }}
    >
      <WindowHeader>Awarded Games</WindowHeader>
      <WindowContent>
        {awardedGames.length > 0 ? (
          <Table>
            <TableHead
              style={{
                maxWidth: "100vw",
                maxHeight: "70vh",
                overflow: "auto",
              }}
            >
              <TableRow>
                <TableHeadCell>Day</TableHeadCell>
                <TableHeadCell>Activity</TableHeadCell>
                <TableHeadCell>Group</TableHeadCell>
                <TableHeadCell>Points Awarded</TableHeadCell>
                <TableHeadCell>Details</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody
              style={{
                maxWidth: "100vw",
                maxHeight: "70vh",
                overflow: "auto",
              }}
            >
              {awardedGames.map((game, index) => (
                <TableRow key={index}>
                  <TableDataCell>{formatSGT(game.tm_created)}</TableDataCell>
                  <TableDataCell>{game.activity_name}</TableDataCell>
                  <TableDataCell>{game.group_name}</TableDataCell>
                  <TableDataCell>{game.points_earned}</TableDataCell>
                  <TableDataCell
                    style={{
                      gap: 16,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button onClick={() => handleViewButtonClick(game)}>
                      View
                    </Button>
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            No games awarded.
          </div>
        )}
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
                left: "50%",
                width: "80%", // Responsive width
                maxWidth: "80%", // Ensures it doesn't get too large on big screens
                zIndex: 10,
              }}
            >
              <Window style={windowStyle}>
                <StyledWindowHeader>
                  <span>{selectedGame.activity_name}</span>
                  <Button onClick={() => setIsModalOpen(false)}>
                    <CloseIcon />
                  </Button>
                </StyledWindowHeader>
                <WindowContent>
                  <div style={{ marginBottom: 10 }}>
                    <GroupBox label="Description">
                      {selectedGame?.description}
                    </GroupBox>
                    <GroupBox label="Group Awarded">
                      {selectedGame?.group_name}
                    </GroupBox>
                    <GroupBox label="Points Awarded">
                      {selectedGame?.points_earned}
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
export default Games;
