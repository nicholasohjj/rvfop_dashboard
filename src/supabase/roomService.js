import { supabaseClient } from "./supabaseClient";

export const findRoom = async (userId) => {
  //Find a room with strictly 1 user excluding the current user
  const { data: rooms, error } = await supabaseClient.rpc("findroom", {
    id: userId,
  });

  console.log("rooms", rooms);

  if (error) throw error;
};

export const leaveRoom = async (userId) => {
  console.log("Leaving room");
  const { data: rooms, error } = await supabaseClient.rpc("leaveroom", {
    id: userId,
  });

  console.log("rooms", rooms, error );

  return null;
};
