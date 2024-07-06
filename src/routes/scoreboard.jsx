import { useEffect, useCallback, useMemo, useContext } from "react";
import {
  Anchor,
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Window,
  WindowContent,
  WindowHeader,
} from "react95";

import { fetchHouses } from "../supabase/services";
import { supabaseClient } from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { LoadingHourglass } from "../components/loadinghourglass";
import { housesContext } from "../context/context";

const useHouses = () => {
  const { houses, setHouses } = useContext(housesContext);
  const sortHousesInitially = useCallback((housesData) => {
    return housesData.sort((a, b) => b.total_points - a.total_points);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const housesData = await fetchHouses();
      const sortedHouses = sortHousesInitially(housesData);
      setHouses(sortedHouses);
    };

    fetchData();

    const channel = supabaseClient
      .channel("houses")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "houses" },
        (payload) => {
          const updatedHouse = payload.new;
          setHouses((currentHouses) =>
            currentHouses.map((house) =>
              house.house_id === updatedHouse.house_id ? updatedHouse : house
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [sortHousesInitially]);

  return { houses };
};

const Scoreboard = () => {
  const { houses } = useHouses();
  const navigate = useNavigate();

  const totalPoints = useMemo(() => {
    return houses.reduce(
      (acc, house) => {
        acc.total += house.total_points;
        acc.proHuman += house.pro_human_points;
        return acc;
      },
      { total: 0, proHuman: 0 }
    );
  }, [houses]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        maxHeight: "100vh",
        position: "relative",
      }}
    >
      <Helmet>
        <title>Insieme 2024 - Scoreboard</title>
        <meta name="description" content="Scoreboard page" />
      </Helmet>
      <Window
        style={{
          flex: 1,
          overflow: "auto",
          minHeight: "100vh",
          maxHeight: "100vh",
        }}
      >
        <WindowHeader onClick={() => navigate("/video")}>
          Scoreboard
        </WindowHeader>

        {!totalPoints ? (
          <LoadingHourglass />
        ) : (
          <WindowContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Group</TableHeadCell>
                  <TableHeadCell>Points</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableDataCell>Pro-humans</TableDataCell>
                  <TableDataCell>{totalPoints.proHuman}</TableDataCell>
                </TableRow>
                <TableRow>
                  <TableDataCell>Tribals</TableDataCell>
                  <TableDataCell>{totalPoints.total}</TableDataCell>
                </TableRow>
              </TableBody>
            </Table>
            <div
              style={{
                textAlign: "center",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              Detailed scoreboard{" "}
              <Anchor
                target="_blank"
                href="https://nicholasohjj.grafana.net/public-dashboards/96bd2c34e5bb424db39f6424cda1451a"
              >
                here
              </Anchor>
            </div>
          </WindowContent>
        )}
      </Window>
    </div>
  );
};
export default Scoreboard;
