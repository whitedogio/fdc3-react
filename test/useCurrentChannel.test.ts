import { Channel, DesktopAgent } from '@finos/fdc3';
import { act, renderHook } from '@testing-library/react-hooks';
import { useCurrentChannel } from '../src';

test('useCurrentChannel', async () => {
  const expectedChannel1 = { id: 'test channel 1' } as Channel;
  const expectedChannel2 = { id: 'test channel 2' } as Channel;

  const originalFdc3 = window.fdc3;
  window.fdc3 = ({
    getCurrentChannel: jest
      .fn()
      .mockResolvedValueOnce(expectedChannel1)
      .mockResolvedValueOnce(expectedChannel2),
  } as unknown) as DesktopAgent;

  const { result, waitForNextUpdate } = renderHook(() => useCurrentChannel());
  let [channel, refresh] = result.current;

  expect(channel).toBeUndefined();
  
  await waitForNextUpdate();
  [channel, refresh] = result.current;

  expect(channel).toEqual(expectedChannel1);
  expect(window.fdc3.getCurrentChannel).toHaveBeenCalledTimes(1);

  act(() => refresh());

  await waitForNextUpdate();
  [channel, refresh] = result.current;

  expect(channel).toEqual(expectedChannel2);
  expect(window.fdc3.getCurrentChannel).toHaveBeenCalledTimes(2);

  window.fdc3 = originalFdc3;
});
