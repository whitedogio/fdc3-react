import {
  ContextHandler,
  ContextTypes,
  DesktopAgent,
  Listener,
} from '@finos/fdc3';
import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import { useAddContextListener } from '../src';
import * as Expected from './constants';

test('useAddContextListener - no type', async () => {
  const originalFdc3 = window.fdc3;
  const unsubscribe = jest.fn();
  window.fdc3 = ({
    addContextListener: jest.fn().mockReturnValue({ unsubscribe } as Listener),
  } as unknown) as DesktopAgent;

  const { result } = renderHook(() => useAddContextListener());
  const handler = (window.fdc3.addContextListener as jest.Mock).mock
    .calls[0][0] as ContextHandler;

  expect(result.current).toBeUndefined();
  expect(window.fdc3.addContextListener).toHaveBeenCalledTimes(1);

  act(() => handler(Expected.ContactContext));
  expect(result.current).toBe(Expected.ContactContext);

  act(() => handler(Expected.InstrumentContext));
  expect(result.current).toBe(Expected.InstrumentContext);

  await cleanup();
  expect(unsubscribe).toHaveBeenCalledTimes(1);

  window.fdc3 = originalFdc3;
});

test('useAddContextListener - with type', async () => {
  const originalFdc3 = window.fdc3;
  const unsubscribe = jest.fn();
  window.fdc3 = ({
    addContextListener: jest.fn().mockReturnValue({ unsubscribe } as Listener),
  } as unknown) as DesktopAgent;

  const { result } = renderHook(() =>
    useAddContextListener(ContextTypes.Instrument)
  );
  const handler = (window.fdc3.addContextListener as jest.Mock).mock
    .calls[0][1] as ContextHandler;

  expect(window.fdc3.addContextListener).toBeCalledWith(
    ContextTypes.Instrument,
    expect.anything()
  );

  expect(result.current).toBeUndefined();

  // useAddContextListener doesn't filter by type, that is expected to be performed by the DesktopAgent implementation.
  act(() => handler(Expected.ContactContext));
  expect(result.current).toBe(Expected.ContactContext);

  act(() => handler(Expected.InstrumentContext));
  expect(result.current).toBe(Expected.InstrumentContext);

  await cleanup();
  expect(unsubscribe).toHaveBeenCalledTimes(1);

  window.fdc3 = originalFdc3;
});
