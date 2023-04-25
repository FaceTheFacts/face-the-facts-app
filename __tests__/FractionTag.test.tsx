import 'react-native';
import renderer from 'react-test-renderer';
import FractionTag from '../src/component/FractionTag';

it('Fraction Tag renders correctly', () => {
  const testFraction: string = 'SPD';
  const tree = renderer.create(FractionTag({party: testFraction})).toJSON();
  expect(tree).toMatchSnapshot();
});
