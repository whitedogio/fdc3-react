import { Channel, getCurrentChannel } from '@finos/fdc3';
import { useEffect, useState } from 'react';

export type UseCurrentChannelOptions = {
  autoRefresh?: boolean;
  autoRefreshInterval?: number;
};

const DefaultUseCurrentChannelOptions: UseCurrentChannelOptions = {
  autoRefresh: false,
  autoRefreshInterval: 5000,
};

export const useCurrentChannel: (
  options?: UseCurrentChannelOptions
) => [Channel, () => void] = options => {
  const { autoRefresh, autoRefreshInterval } = {
    ...DefaultUseCurrentChannelOptions,
    ...options,
  };

  const [channel, setChannel] = useState((undefined as unknown) as Channel);

  const [shouldRefresh, setShouldRefresh] = useState({});
  const refresh = () => setShouldRefresh({});

  useEffect(() => {
    getCurrentChannel().then(channel => setChannel(channel));
  }, [shouldRefresh]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => refresh(), autoRefreshInterval);
      return () => {
        clearInterval(interval);
      };
    }

    return;
  }, [autoRefresh, autoRefreshInterval]);

  return [channel, refresh];
};
