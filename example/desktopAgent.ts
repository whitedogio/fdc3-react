import {
  Channel,
  Context,
  ContextHandler,
  ContextType,
  DesktopAgent,
} from '@finos/fdc3';

// A horrible FDC3 DesktopAgent implementation :-)

const randomId = (max: number) => Math.floor(Math.random() * (max + 1));

const contextHandlers: Set<ContextHandler> = new Set();
const intentHandlers: Set<(
  intent: string,
  context: Context
) => void> = new Set();

window.fdc3 = ({
  addContextListener: (
    typeOrHandler: ContextType | ContextHandler,
    handler?: ContextHandler
  ) => {
    const wrappedHandler =
      typeof handler !== 'undefined'
        ? (context: Context) => {
            if (context.type === typeOrHandler) {
              handler(context);
            }
          }
        : (typeOrHandler as ContextHandler);

    contextHandlers.add(wrappedHandler);

    return { unsubscribe: () => contextHandlers.delete(wrappedHandler) };
  },

  addIntentListener: (intent: string, handler: ContextHandler) => {
    const wrappedHandler = (i: string, context: Context) => {
      if (i === intent) {
        handler(context);
      }
    };

    intentHandlers.add(wrappedHandler);

    return {
      unsubscribe: () => {
        intentHandlers.delete(wrappedHandler);
      },
    };
  },

  broadcast: (context: Context) => {
    for (const handler of Array.from(contextHandlers)) {
      handler(context);
    }
  },

  getCurrentChannel: () => {
    return Promise.resolve({
      id: `channel${randomId(1)}`,
      type: 'global',
    } as Channel);
  },

  getSystemChannels: () => {
    const channels = Array.from(Array(randomId(10)).keys()).map(i => ({
      id: `channel${i}`,
      type: 'global',
    }));
    return Promise.resolve(channels);
  },

  raiseIntent: (intent: string, context: Context) => {
    for (const handler of Array.from(intentHandlers)) {
      handler(intent, context);
    }
  },
} as unknown) as DesktopAgent;
