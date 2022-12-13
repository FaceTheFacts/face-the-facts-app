import React from 'react';
//import {render} from '@testing-library/react-native';
import Dashboard from '../src/component/dashboard/Dashboard';
import {useFetchDashboard} from '../src/queries/useFetchDashboard';
import {DataContext} from '../src/logic/model';
import renderer from 'react-test-renderer';

jest.mock('react-native-chart-kit', () => ({
  LineChart: () => null,
}));

jest.mock('react-native-video', () => ({
  Video: () => null,
}));

jest.mock('../src/queries/useFetchDashboard', () => ({
  useFetchDashboard: jest.fn(),
}));

jest.spyOn(React, 'useContext').mockImplementation(() => {
  // return the mock object for the DataContext
  return DataContext;
});

beforeEach(() => {
  // mock the useFetchDashboard hook to return an array of mock query objects with the isLoading property set to true
  (useFetchDashboard as jest.Mock).mockImplementation(() => [
    {isLoading: true},
    {isLoading: true},
    {isLoading: true},
    {isLoading: true},
  ]);
});

it('renders correctly', () => {
  const tree = renderer.create(<Dashboard />).toJSON();
  expect(tree).toMatchSnapshot();
});
