import { Channel, getCurrentChannel } from '@finos/fdc3';
import { useEffect, useState } from 'react';

export const useCurrentChannel: () => Channel = () => {
  const [channel, setChannel] = useState((undefined as unknown) as Channel);

  useEffect(() => {
    getCurrentChannel().then(channel => setChannel(channel));
  });

  return channel;
};
