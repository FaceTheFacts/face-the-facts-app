jest.mock('react-native-fs', () => ({
  CachesDirectoryPath: jest.fn(),
  downloadFile: jest.fn(),
  exists: jest.fn(),
  ExternalStorageDirectoryPath: 'package-path',
}));

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ProfilePicturePlaceholder from '../src/component/ProfilePicturePlaceholder';

it('PoliticianPicture renders correctly', () => {
  const tree = renderer.create(<ProfilePicturePlaceholder />).toJSON();
  expect(tree).toMatchSnapshot();
});
