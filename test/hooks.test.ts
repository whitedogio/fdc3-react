import {
  Channel,
  ContextHandler,
  ContextTypes,
  DesktopAgent,
  Intents,
} from '@finos/fdc3';
import { act, renderHook } from '@testing-library/react-hooks';
import {
  useAddContextListener,
  useAddIntentListener,
  useCurrentChannel,
  useSystemChannels,
} from '../src';

const CONTACT_CONTEXT = {
  type: ContextTypes.Contact,
  id: { email: 'test@example.com' },
};

const INSTRUMENT_CONTEXT = {
  type: ContextTypes.Instrument,
  id: { ticker: 'GBPUSD' },
};

describe('hooks', () => {
  beforeEach(() => {
    window.fdc3 = ({
      addContextListener: jest.fn(() => {
        return { unsubscribe: () => {} };
      }),
      addIntentListener: jest.fn(() => {
        return { unsubscribe: () => {} };
      }),
      getCurrentChannel: jest.fn(),
      getSystemChannels: jest.fn(() => Promise.resolve([] as Channel[])),
    } as unknown) as DesktopAgent;
  });

  test('useCurrentChannel', async () => {
    const channel = { id: 'test channel' } as Channel;
    (window.fdc3.getCurrentChannel as jest.Mock)
      .mockReturnValueOnce(Promise.resolve(null))
      .mockReturnValueOnce(Promise.resolve(null))
      .mockReturnValue(Promise.resolve(channel));

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useCurrentChannel()
    );

    expect(result.current).toBeUndefined();

    await waitForNextUpdate();

    expect(result.current).toBeNull();
    expect(window.fdc3.getCurrentChannel as jest.Mock).toHaveBeenCalledTimes(2);

    rerender();

    await waitForNextUpdate();

    expect(result.current).toBe(channel);
    expect(window.fdc3.getCurrentChannel as jest.Mock).toHaveBeenCalledTimes(4);
  });

  test('useSystemChannels', async () => {
    const channels = [{ id: 'test channel' } as Channel];
    (window.fdc3.getSystemChannels as jest.Mock)
      .mockReturnValueOnce(Promise.resolve([] as Channel[]))
      .mockReturnValueOnce(Promise.resolve([] as Channel[]))
      .mockReturnValue(Promise.resolve(channels));

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useSystemChannels()
    );

    expect(result.current).toEqual([] as Channel[]);
    expect(window.fdc3.getSystemChannels).toHaveBeenCalledTimes(1);

    rerender();

    await waitForNextUpdate();

    expect(result.current).toEqual(channels);
    expect(window.fdc3.getSystemChannels).toHaveBeenCalledTimes(5);
  });

  test('useAddContextListener - no type', () => {
    const { result } = renderHook(() => useAddContextListener());
    const handler = (window.fdc3.addContextListener as jest.Mock).mock
      .calls[0][0] as ContextHandler;

    expect(result.current).toBeUndefined();

    act(() => handler(CONTACT_CONTEXT));
    expect(result.current).toBe(CONTACT_CONTEXT);

    act(() => handler(INSTRUMENT_CONTEXT));
    expect(result.current).toBe(INSTRUMENT_CONTEXT);
  });

  test('useAddContextListener - with type', () => {
    const { result } = renderHook(() =>
      useAddContextListener(ContextTypes.Instrument)
    );

    const mock = window.fdc3.addContextListener as jest.Mock;
    const handler = mock.mock.calls[0][1] as ContextHandler;

    expect(mock).toBeCalledWith(ContextTypes.Instrument, expect.anything());

    expect(result.current).toBeUndefined();

    // useAddContextListener doesn't filter by type, that is expected to be performed by the DesktopAgent implementation.
    act(() => handler(CONTACT_CONTEXT));
    expect(result.current).toBe(CONTACT_CONTEXT);

    act(() => handler(INSTRUMENT_CONTEXT));
    expect(result.current).toBe(INSTRUMENT_CONTEXT);
  });

  test('useAddIntentListener', () => {
    const { result: viewChartResult } = renderHook(() =>
      useAddIntentListener(Intents.ViewChart)
    );

    const { result: startChatResult } = renderHook(() =>
      useAddIntentListener(Intents.StartChart)
    );

    const mock = window.fdc3.addIntentListener as jest.Mock;
    const handler = mock.mock.calls[0][1] as ContextHandler;

    expect(mock).toBeCalledTimes(2);
    expect(mock).toBeCalledWith(Intents.ViewChart, expect.anything());
    expect(mock).toBeCalledWith(Intents.StartChart, expect.anything());

    expect(viewChartResult.current).toBeUndefined();

    act(() => handler(CONTACT_CONTEXT));
    expect(viewChartResult.current).toBe(CONTACT_CONTEXT);

    act(() => handler(INSTRUMENT_CONTEXT));
    expect(viewChartResult.current).toBe(INSTRUMENT_CONTEXT);

    expect(startChatResult.current).toBeUndefined();
  });
});
