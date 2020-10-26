import { ContextHandler, DesktopAgent, Intents, Listener } from '@finos/fdc3';
import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import { useAddIntentListener } from '../src';
import * as Expected from './constants';

test('useAddIntentListener', async () => {
  const originalFdc3 = window.fdc3;
  const unsubscribe = jest.fn();
  window.fdc3 = ({
    addIntentListener: jest.fn().mockReturnValue({ unsubscribe } as Listener),
  } as unknown) as DesktopAgent;

  const { result: viewChartResult } = renderHook(() =>
    useAddIntentListener(Intents.ViewChart)
  );

  const { result: startChatResult } = renderHook(() =>
    useAddIntentListener(Intents.StartChart)
  );

  const handler = (window.fdc3.addIntentListener as jest.Mock).mock
    .calls[0][1] as ContextHandler;

  expect(window.fdc3.addIntentListener).toBeCalledTimes(2);
  expect(window.fdc3.addIntentListener).toBeCalledWith(
    Intents.ViewChart,
    expect.anything()
  );
  expect(window.fdc3.addIntentListener).toBeCalledWith(
    Intents.StartChart,
    expect.anything()
  );

  expect(viewChartResult.current).toBeUndefined();

  act(() => handler(Expected.ContactContext));
  expect(viewChartResult.current).toBe(Expected.ContactContext);

  act(() => handler(Expected.InstrumentContext));
  expect(viewChartResult.current).toBe(Expected.InstrumentContext);

  expect(startChatResult.current).toBeUndefined();

  await cleanup();
  expect(unsubscribe).toHaveBeenCalledTimes(2);

  window.fdc3 = originalFdc3;
});
