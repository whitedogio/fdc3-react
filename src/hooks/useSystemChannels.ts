import { Channel, getSystemChannels } from '@finos/fdc3';
import { useEffect, useState } from 'react';

export type UseSystemChannelsOptions = {
  autoRefresh?: boolean;
  autoRefreshInterval?: number;
};

const DefaultUseSystemChannelsOptions: UseSystemChannelsOptions = {
  autoRefresh: false,
  autoRefreshInterval: 5000,
};

export const useSystemChannels: (
  options?: UseSystemChannelsOptions
) => [Channel[], () => void] = (options?) => {
  const { autoRefresh, autoRefreshInterval } = {
    ...DefaultUseSystemChannelsOptions,
    ...options,
  };

  const [channels, setChannels] = useState((undefined as unknown) as Channel[]);

  const [shouldRefresh, setShouldRefresh] = useState({});
  const refresh = () => setShouldRefresh({});

  useEffect(() => {
    getSystemChannels().then(newChannels => {
      setChannels(newChannels);
    });
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

  return [channels, refresh];
};
