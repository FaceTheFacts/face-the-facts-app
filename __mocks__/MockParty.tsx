import {ApiParty, ApiPartyStyle} from '../src/logic/api';

export const MockPartyStyle: ApiPartyStyle = {
  id: 0,
  display_name: 'test-party',
  foreground_color: '#FFFFFF',
  background_color: '#5D6265',
};

export const MockParty: ApiParty = {
  id: 0,
  label: 'test-party',
  party_style: MockPartyStyle,
};
