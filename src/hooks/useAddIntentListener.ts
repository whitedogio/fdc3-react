import { addIntentListener, Context, ContextHandler } from '@finos/fdc3';
import { useEffect, useState } from 'react';

export const useAddIntentListener: (intent: string) => Context = (
  intent: string
) => {
  const [context, setContext] = useState((undefined as unknown) as Context);

  useEffect(() => {
    const handler: ContextHandler = newContext => {
      setContext(newContext);
    };

    const listener = addIntentListener(intent, handler);

    return () => {
      listener.unsubscribe();
    };
  }, [intent]);

  return context;
};
