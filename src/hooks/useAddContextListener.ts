import {
  addContextListener,
  Context,
  ContextHandler,
  ContextType,
} from '@finos/fdc3';
import { useEffect, useState } from 'react';

export const useAddContextListener: (type?: ContextType) => Context = (
  type?: string
) => {
  const [context, setContext] = useState((undefined as unknown) as Context);

  useEffect(() => {
    const handler: ContextHandler = context => {
      setContext(context);
    };

    const listener = type
      ? addContextListener(type, handler)
      : addContextListener(handler);

    return () => {
      listener.unsubscribe();
    };
  }, [type]);

  return context;
};
