import React from "react";
import {
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
import styled from "styled-components";
import data from "../db/houses.json";

const Scoreboard = () => {
  return (
    <Window style={{ flex: 1, width: 320 }}>
      <WindowHeader>Scoreboard</WindowHeader>
      <WindowContent>
        <Table>
            <TableHead>
                <TableHeadCell>House</TableHeadCell>
                <TableHeadCell sort="desc">Points</TableHeadCell>
            </TableHead>
            <TableBody>
                {data.map((house) => {
                    return (
                        <TableRow key={house.id}>
                            <TableDataCell>{house.name}</TableDataCell>
                            <TableDataCell>{house.total_points}</TableDataCell>
                        </TableRow>
                    );
                }
                )}
            </TableBody>
        </Table>
      </WindowContent>
    </Window>
  );
};

export default Scoreboard;
