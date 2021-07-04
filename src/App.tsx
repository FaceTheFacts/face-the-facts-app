import React from 'react';
import {DataContext, FaceTheFactsData} from './logic/model';
import politicians from '../politicians.json';
import parties from '../parties.json';
import elections from '../elections.json';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainView from './view/MainView';
import EmbeddedView from './view/EmbeddedView';
import {StatusBar} from 'react-native';

const data = new FaceTheFactsData({
  politicians,
  parties,
  elections,
});

const Stack = createStackNavigator();

const App = () => {
  return (
    <DataContext.Provider value={data}>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="main" component={MainView} />
          <Stack.Screen name="embedded" component={EmbeddedView} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataContext.Provider>
  );
};

export default App;
