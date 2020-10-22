# FDC3 React Hooks

React hook helpers for the [FDC3](https://fdc3.finos.org) DesktopAgent API. See also the FDC3 [npm package](https://www.npmjs.com/package/@finos/fdc3).

## Usage

### useCurrentChannel

```tsx
import { Channel } from '@finos/fdc3';
import { useCurrentChannel } from '@whitedog/fdc3-react';

const MyComponent: React.FunctionComponent = () => {
  const channel: Channel = useCurrentChannel();

  return (
    <dl>
      <dt>Current Channel</dt>
      <dd>{channel.id}</dd>
    </dl>
  );
};
```

### useSystemChannels

```tsx
import { Channel } from '@finos/fdc3';
import { useSystemChannels } from '@whitedog/fdc3-react';

const MyComponent: React.FunctionComponent = () => {
  const channels: Channel[] = useSystemChannels();

  return (
    <ul>
      {channels.map(c => (
        <li>{c.id}</li>
      ))}
    </ul>
  );
};
```

### useAddContextListener

```tsx
import { broadcast, Contact, Context, ContextTypes } from '@finos/fdc3';
import { useAddContextListener } from '@whitedog/fdc3-react';

const MyComponent: React.FunctionComponent = () => {
  const anyContext: Context = useAddContextListener();
  const contactContext: Contact = useAddContextListener(ContextTypes.Contact) as Contact;

  return (
    <textarea defaultValue={JSON.stringify(anyContext, null, 2)}></textarea>
    <textarea defaultValue={JSON.stringify(contactContext, null, 2)}></textarea>
    <button onClick={() => broadcast({ type: ContextTypes.Instrument, id: { ticker: 'GBPUSD' } })}>Broadcast Instrument Context</button>
    <button onClick={() => broadcast({ type: ContextTypes.Contact, id: { email: 'test@example.com' } })}>Broadcast Contact Context</button>
  );
};
```

### useAddIntentListener

```tsx
import { broadcast, Contact, Context, ContextTypes } from '@finos/fdc3';
import { useAddContextListener } from '@whitedog/fdc3-react';

const MyComponent: React.FunctionComponent = () => {
  const viewChartIntentContext: Context = useAddIntentListener(Intents.ViewChart);
  
  return (
    <textarea defaultValue={JSON.stringify(viewChartIntentContext, null, 2)}></textarea>
    <button onClick={() => raiseIntent(Intents.ViewChart, { type: ContextTypes.Instrument, id: { ticker: 'GBPUSD' } })}>Raise ViewChart Intent</button>
  );
};
```
