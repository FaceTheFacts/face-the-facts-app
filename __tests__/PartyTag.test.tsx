import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import PartyTag from '../src/component/PartyTag';
import {MockParty} from '../__mocks__/MockParty';

it('Party Tag renders correctly', () => {
  const tree = renderer.create(<PartyTag party={MockParty} />).toJSON();
  expect(tree).toMatchSnapshot();
});
