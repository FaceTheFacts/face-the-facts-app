import 'react-native';
import renderer from 'react-test-renderer';
import TabMenu from '../src/component/TabMenu';
import {MockTabMenu} from '../__mocks__/MockTabMenu';

it('TabMenu renders correctly', () => {
  const tree = renderer.create(TabMenu(MockTabMenu)).toJSON();
  expect(tree).toMatchSnapshot();
});
