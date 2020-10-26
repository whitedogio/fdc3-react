import {
  broadcast,
  Contact,
  Context,
  ContextTypes,
  Intents,
  raiseIntent,
} from '@finos/fdc3';
import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import {
  useAddContextListener,
  useAddIntentListener,
  useCurrentChannel,
  useSystemChannels,
} from '../src';
import './desktopAgent';

const UseCurrentChannelExample: React.FunctionComponent = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [channel, refresh] = useCurrentChannel({ autoRefresh });

  return (
    <div>
      <dl>
        <h2>useCurrentChannel</h2>
        <dt>Current Channel</dt>
        <dd>{channel?.id}</dd>
      </dl>
      <button onClick={refresh}>Refresh</button>
      <button onClick={() => setAutoRefresh(!autoRefresh)}>
        {autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
      </button>
    </div>
  );
};

const UseSystemChannelsExample: React.FunctionComponent = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [channels, refresh] = useSystemChannels({ autoRefresh });

  return (
    <div>
      <h2>useSystemChannels</h2>
      <ul>
        {channels?.map(c => (
          <li key={c.id}>{c.id}</li>
        ))}
      </ul>
      <button onClick={refresh}>Refresh</button>
      <button onClick={() => setAutoRefresh(!autoRefresh)}>
        {autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
      </button>
    </div>
  );
};

const UseAddContextListenerExample: React.FunctionComponent = () => {
  const anyContext: Context = useAddContextListener();
  const contactContext: Contact = useAddContextListener(
    ContextTypes.Contact
  ) as Contact;

  return (
    <div>
      <div>
        <h2>useAddContextListener</h2>
        <button
          onClick={() =>
            broadcast({
              type: ContextTypes.Instrument,
              id: { ticker: 'GBPUSD' },
            })
          }
        >
          Broadcast Instrument Context
        </button>
        <button
          onClick={() =>
            broadcast({
              type: ContextTypes.Contact,
              id: { email: 'test@example.com' },
            })
          }
        >
          Broadcast Contact Context
        </button>
      </div>
      <div>
        <h3>Any Context</h3>
        <textarea
          defaultValue={JSON.stringify(anyContext, null, 2)}
          readOnly={true}
          rows={6}
          cols={35}
        ></textarea>
      </div>
      <div>
        <h3>Contact Context</h3>
        <textarea
          defaultValue={JSON.stringify(contactContext, null, 2)}
          readOnly={true}
          rows={6}
          cols={35}
        ></textarea>
      </div>
    </div>
  );
};

const UseAddIntentListenerExample: React.FunctionComponent = () => {
  const viewChartIntentContext: Context = useAddIntentListener(
    Intents.ViewChart
  );

  return (
    <div>
      <div>
        <h2>useAddIntentListener</h2>
        <button
          onClick={() =>
            raiseIntent(Intents.ViewChart, {
              type: ContextTypes.Instrument,
              id: { ticker: 'GBPUSD' },
            })
          }
        >
          Raise ViewChart Intent
        </button>
      </div>
      <div>
        <textarea
          defaultValue={JSON.stringify(viewChartIntentContext, null, 2)}
          readOnly={true}
          rows={6}
          cols={35}
        ></textarea>
      </div>
    </div>
  );
};

const App: React.FunctionComponent = () => {
  return (
    <>
      <h1>FDC3 React Hooks Examples</h1>
      <UseCurrentChannelExample />
      <UseSystemChannelsExample />
      <UseAddContextListenerExample />
      <UseAddIntentListenerExample />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
