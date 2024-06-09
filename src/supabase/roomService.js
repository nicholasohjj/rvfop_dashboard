import { supabaseClient } from './supabaseClient';

export const createOrFindRoom = async (userId) => {
  let { data: rooms, error } = await supabaseClient
    .from('matches')
    .select('*')
    .eq('usersId', `{${userId}}`);

  if (error) throw error;

  if (rooms.length > 0) {
    return rooms[0];
  }

  const { data, error: insertError } = await supabaseClient
    .from('matches')
    .insert([{ usersId: [userId] }])
    .select();

  if (insertError) throw insertError;

  return data[0];
};

export const joinRoom = async (userId) => {
  const { data: room, error } = await supabaseClient
    .from('matches')
    .select('*')
    .neq('usersId', `{${userId}}`)
    .eq('usersId', '1')
    .limit(1)
    .single();

  if (error) throw error;

  const { data: updateRoom, error: updateError } = await supabaseClient
    .from('matches')
    .update({ usersId: [...room.usersId, userId] })
    .eq('id', room.id);

  if (updateError) throw updateError;

  return updateRoom;
};
