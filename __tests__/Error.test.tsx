import 'react-native';
import renderer from 'react-test-renderer';
import Error from '../src/component/Error';

it('Error component renders correctly', () => {
  const tree = renderer.create(Error()).toJSON();
  expect(tree).toMatchSnapshot();
});
