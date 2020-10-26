import { Channel, DesktopAgent } from '@finos/fdc3';
import { act, renderHook } from '@testing-library/react-hooks';
import { useSystemChannels } from '../src';

test('useSystemChannels', async () => {
  const expectedChannels = [{ id: 'test channel' } as Channel];

  const originalFdc3 = window.fdc3;
  window.fdc3 = ({
    getSystemChannels: jest.fn().mockResolvedValue(expectedChannels),
  } as unknown) as DesktopAgent;

  const { result, waitForNextUpdate } = renderHook(() => useSystemChannels());

  let [channels, refresh] = result.current;

  expect(channels).toEqual(undefined);

  await waitForNextUpdate();

  [channels, refresh] = result.current;
  expect(channels).toEqual(expectedChannels);
  expect(window.fdc3.getSystemChannels).toHaveBeenCalledTimes(1);

  act(() => refresh());

  await waitForNextUpdate();

  [channels, refresh] = result.current;
  expect(channels).toEqual(expectedChannels);
  expect(window.fdc3.getSystemChannels).toHaveBeenCalledTimes(2);

  window.fdc3 = originalFdc3;
});
