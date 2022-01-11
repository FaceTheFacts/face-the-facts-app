import React, {createContext, useState} from 'react';
import {
  useWindowDimensions,
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import PoliticianHeader from '../component/politician/PoliticianHeader';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import PoliticianProfile from '../component/politician/PoliticianProfile';
import PoliticianPositions from '../component/politician/PoliticianPositions';
import PoliticianConstituency from '../component/politician/PoliticianConstituency';
import {Colors} from '../theme';
import {Route} from 'react-native-tab-view/lib/typescript/types';
import BackButton from '../component/BackButton';
import {useQuery} from 'react-query';
import {fetch_api} from '../logic/fetch';
import type {
  ApiPositions,
  ApiPolitician,
  ApiPoliticianProfile,
  IPoliticianContext,
} from '../logic/api';

type PoliticianViewParams = {
  politicianId: number;
};

interface PoliticianViewProps {
  route: RouteProp<{params: PoliticianViewParams}, 'params'>;
}

const renderScene = SceneMap({
  positions: PoliticianPositions,
  profile: PoliticianProfile,
  constituency: PoliticianConstituency,
});

export const PoliticianContext = createContext<IPoliticianContext | null>(null);

const PoliticianView = ({route}: PoliticianViewProps) => {
  const {politicianId} = route.params;

  const {data: profile} = useQuery<ApiPoliticianProfile | undefined, Error>(
    `politician:${politicianId}`,
    () =>
      fetch_api<ApiPoliticianProfile>(
        `politician/${politicianId}?sidejobs_end=15&votes_end=5`,
      ),
  );

  const {data: positions} = useQuery<ApiPositions | undefined, Error>(
    `postilions:${politicianId}`,
    () => fetch_api<ApiPositions>(`politician/${politicianId}/positions`),
  );

  const {width} = useWindowDimensions();

  const routes = [
    (profile?.topic_ids_of_latest_committee ||
      profile?.votes_and_polls ||
      profile?.sidejobs ||
      profile?.cvs ||
      profile?.weblinks) && {
      title: 'Profilseite',
      key: 'profile',
    },
    positions?.positions && {
      title: 'Positionen',
      key: 'positions',
    },
    // /* politician.constituency && {
    //     title: 'Wahlkreis',
    //     key: 'constituency',
    //   }, */
  ].filter(Boolean) as Route[];

  const [tabIndex, setTabIndex] = useState<number>(() =>
    routes.findIndex(value => value.key === 'profile'),
  );

  return (
    <PoliticianContext.Provider value={{positions, profile}}>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.cardBackground}
        />
        <BackButton />
        <PoliticianHeader />
        {routes.length > 1 ? (
          <TabView
            onIndexChange={setTabIndex}
            navigationState={{
              index: tabIndex,
              routes,
            }}
            renderScene={renderScene}
            renderTabBar={props => (
              <TabBar
                {...props}
                activeColor={Colors.foreground}
                inactiveColor={Colors.inactive}
                style={styles.tabBar}
                labelStyle={styles.tabBarLabel}
                indicatorStyle={styles.tabBarIndicator}
              />
            )}
            initialLayout={{width}}
            swipeEnabled={false}
          />
        ) : (
          <PoliticianProfile />
        )}
      </View>
    </PoliticianContext.Provider>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    backgroundColor: Colors.cardBackground,
  },
  tabBarLabel: {
    textTransform: 'none',
  },
  tabBarIndicator: {
    backgroundColor: Colors.foreground,
    height: 3,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderColor: Colors.cardBackground,
  },
});

export default PoliticianView;
