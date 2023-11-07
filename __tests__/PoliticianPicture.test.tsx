jest.mock('react-native-fs', () => ({
  CachesDirectoryPath: jest.fn(),
  downloadFile: jest.fn(),
  exists: jest.fn(),
  ExternalStorageDirectoryPath: 'package-path',
}));

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import PoliticianPicture from '../src/component/PoliticianPicture';

it('PoliticianPicture renders correctly', () => {
  const testPoliticianId: number = 139064;
  const tree = renderer
    .create(<PoliticianPicture politicianId={testPoliticianId} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
