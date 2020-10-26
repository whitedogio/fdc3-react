import { ContextTypes } from '@finos/fdc3';

export const ContactContext = {
  type: ContextTypes.Contact,
  id: { email: 'test@example.com' },
};

export const InstrumentContext = {
  type: ContextTypes.Instrument,
  id: { ticker: 'GBPUSD' },
};
