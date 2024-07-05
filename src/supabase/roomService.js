import { supabaseClient } from "./supabaseClient";

export const findRoom = async (userId) => {
  //Find a room with strictly 1 user excluding the current user
  const { data: room, error } = await supabaseClient.rpc("findroom", {
    id: userId,
  });
  if (error) throw error;

  console.log("Room", room, error);

  return room;
};

export const leaveRoom = async (userId) => {
  console.log("Leaving room");
  const { data: room, error } = await supabaseClient.rpc("leaveroom", {
    id: userId,
  });
  return null;
};
