import { Channel, getSystemChannels } from '@finos/fdc3';
import { useEffect, useState } from 'react';

export const useSystemChannels: () => Array<Channel> = () => {
  const [channels, setChannels] = useState([] as Array<Channel>);

  useEffect(() => {
    getSystemChannels().then(channels => setChannels(channels));
  });

  return channels;
};
