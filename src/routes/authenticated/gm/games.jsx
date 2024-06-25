import {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
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
import { fetchAwardedGames } from "../../../supabase/services";
import { useNavigate } from "react-router-dom";
import { formatSGT } from "../../../utils/time";
import { userContext } from "../../../context/context";
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

const Games = () => {
  const { user, setUser } = useContext(userContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [awardedGames, setAwardedGames] = useState([]); // Initialize to empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const constraintsRef = useRef(null);
  const dragxError = useMotionValue(0);

  const navigate = useNavigate();
  const rotateValueError = useTransform(dragxError, [-100, 100], [-10, 10]); // Maps drag from -100 to 100 pixels to a rotation of -10 to 10 degrees

  useEffect(() => {
    const fetchData = async () => {
      if (user && !user.can_add_activity) {
        navigate("/", { replace: true });
      }

      if (user && !user.id) {
        return;
      }

      // Assuming `fetchAwardedGames` is an async function that needs a user ID
      try {
        const awardedGames = await fetchAwardedGames(user.id);
        setAwardedGames(awardedGames); // Assuming this is what you intend to do with the fetched data
      } catch (error) {
        console.error("Failed to fetch awarded games:", error);
      }
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

  const handleViewButtonClick = useCallback(
    (game) => {
      setIsModalOpen(!isModalOpen);
      setSelectedGame(game); // Set the selected activity
    },
    [isModalOpen]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const windowStyle = {
    width: windowWidth > 500 ? 500 : "90%", // Adjust width here
    margin: "0%",
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        maxHeight: "100vh",
        position: "relative",
      }}
    >
      <Window
        style={{
          flex: 1,
          overflow: "auto",
          minHeight: "100vh",
          maxHeight: "100vh",
        }}
      >
        <Helmet>
          <title>Insieme 2024 - Awarded Games</title>
          <meta name="description" content="Track games awarded by you here" />
        </Helmet>
        <WindowHeader>Awarded Games</WindowHeader>
        <WindowContent>
          {awardedGames.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Day</TableHeadCell>
                  <TableHeadCell>Activity</TableHeadCell>
                  <TableHeadCell>Group</TableHeadCell>
                  <TableHeadCell>Points Awarded</TableHeadCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {awardedGames.map((game, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleViewButtonClick(game)}
                  >
                    <TableDataCell>{formatSGT(game.tm_created)}</TableDataCell>
                    <TableDataCell>{game.activity_name}</TableDataCell>
                    <TableDataCell>{game.group_name}</TableDataCell>
                    <TableDataCell>{game.points_earned}</TableDataCell>
                    <TableDataCell></TableDataCell>
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
                initial="hidden"
                animate="visible"
                exit="hidden"
                drag
                dragConstraints={constraintsRef}
                variants={modalVariants}
                style={{
                  position: "absolute", // This makes the div position relative to the nearest positioned ancestor
                  top: 0,
                  left: 0,
                  minWidth: "100vw",
                  minHeight: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <Window style={windowStyle}>
                  <StyledWindowHeader>
                    <span>{selectedGame.activity_name}</span>
                    <Button onClick={handleCloseModal}>
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
    </div>
  );
};
export default Games;
