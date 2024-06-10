import { supabaseClient } from './supabaseClient';

export const findRoom = async (userId) => {
  // Ensure userId is treated as an array for the query

  
  const { data: rooms, error } = await supabaseClient
    .from('matches')
    .select('*')
    .contains('usersId', [userId]);

  if (error) throw error;

  if (rooms.length > 0) {
    return rooms[0];
  }

  // Create a new room if no existing rooms are found
  const { data, error: insertError } = await supabaseClient
    .from('matches')
    .insert([{ usersId: [userId] }])
    .select();

  if (insertError) throw insertError;

  return data[0];
};

export const leaveRoom = async (userId) => {
  const { data: rooms, error } = await supabaseClient
    .from('matches')
    .select('*')
    .contains('usersId', [userId]);

  if (error) throw error;

  if (rooms.length > 0) {
    const room = rooms[0];
    const updatedUsersId = room.usersId.filter(id => id !== userId);

    const { data, error: updateError } = await supabaseClient
      .from('matches')
      .update({ usersId: updatedUsersId })
      .eq('id', room.id)
      .select();

    if (updateError) throw updateError;

    return data[0];
  }

  return null;
};
