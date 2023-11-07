import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Icon from '../src/component/Icon';
import {ArrowUpRightFromSquare} from '../src/icons';

it('Icon renders correctly', () => {
  const tree = renderer.create(<Icon icon={ArrowUpRightFromSquare} />).toJSON();
  expect(tree).toMatchSnapshot();
});
