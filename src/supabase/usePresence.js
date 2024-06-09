import { useEffect, useState } from 'react';
import { supabaseClient } from './supabaseClient';

const usePresence = (roomId, userId) => {
  const [presenceState, setPresenceState] = useState(null);

  useEffect(() => {
    const matcherChannel = supabaseClient.channel(`room-${roomId}`, {
      config: {
        presence: {
          key: userId.toString(),
        },
      },
    });

    matcherChannel
      .on('presence', { event: 'sync' }, () => {
        setPresenceState(matcherChannel.presenceState());
      })
      .subscribe();

    return () => {
      matcherChannel.unsubscribe();
    };
  }, [roomId, userId]);

  return presenceState;
};

export default usePresence;
