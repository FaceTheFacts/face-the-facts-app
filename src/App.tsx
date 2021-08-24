import React from 'react';
import {Host} from 'react-native-portalize';
import {DataContext, FaceTheFactsData} from './logic/model';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainView from './view/MainView';
import EmbeddedView from './view/EmbeddedView';
import {StatusBar} from 'react-native';
// TODO: fetch data from server
import dataset from '../data.json';

const data = new FaceTheFactsData(dataset as any);

const Stack = createStackNavigator();

const App = () => {
  return (
    <DataContext.Provider value={data}>
      <StatusBar barStyle="light-content" />
      <Host>
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            <Stack.Screen name="main" component={MainView} />
            <Stack.Screen name="embedded" component={EmbeddedView} />
          </Stack.Navigator>
        </NavigationContainer>
      </Host>
    </DataContext.Provider>
  );
};

export default App;
