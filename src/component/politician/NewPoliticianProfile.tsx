import React, {useContext} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import PoliticianOverview from './PoliticianOverview';
import PoliticianCV from './PoliticianCV';
import PoliticianLinks from './PoliticianLinks';
import {StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import {PoliticianContext} from '../../view/NewPoliticianView';

const NewPoliticianProfile = () => {
  const Tab = createMaterialTopTabNavigator();
  const politician = useContext(PoliticianContext);

  if (
    (!(
      politician?.profile &&
      politician?.profile.topic_ids_of_latest_committee.length > 0
    ) ||
      !(
        politician?.profile && politician?.profile?.votes_and_polls.length > 0
      ) ||
      !(politician?.profile && politician?.profile?.sidejobs.length > 0)) &&
    !(politician?.profile && politician.profile.cvs.length > 0)
  ) {
    return <PoliticianLinks />;
  }

  return (
    <Tab.Navigator
      screenOptions={() => ({
        swipeEnabled: false,
        sceneContainerStyle: {backgroundColor: Colors.background},
        tabBarActiveTintColor: '#FCFCFC',
        tabBarInactiveTintColor: '#FCFCFC66',
        tabBarIndicatorStyle: {
          backgroundColor: '#ffffff',
        },
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: {backgroundColor: Colors.background},
      })}>
      {((politician?.profile &&
        politician?.profile.topic_ids_of_latest_committee.length > 0) ||
        (politician?.profile &&
          politician?.profile?.votes_and_polls.length > 0) ||
        (politician?.profile && politician?.profile?.sidejobs.length > 0)) && (
        <Tab.Screen name="Übersicht" component={PoliticianOverview} />
      )}
      {politician?.profile && politician.profile.cvs.length > 0 && (
        <Tab.Screen name="Biografie" component={PoliticianCV} />
      )}
      <Tab.Screen name="Weblinks" component={PoliticianLinks} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 13,
    textTransform: 'none',
  },
});
export default NewPoliticianProfile;