import React, {createContext, useState} from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import PoliticianHeader from '../component/politician/PoliticianHeader';
import {ApiPolitician, ApiPoliticianProfile, ApiPositions} from '../logic/api';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import PoliticianProfile from '../component/politician/PoliticianProfile';
import PoliticianPositions from '../component/politician/PoliticianPositions';
import PoliticianConstituency from '../component/politician/PoliticianConstituency';
import {Colors} from '../theme';
import {Route} from 'react-native-tab-view/lib/typescript/types';
import BackButton from '../component/BackButton';

interface PoliticianViewProps {
  route: RouteProp<
    {params: {profile: ApiPoliticianProfile; positions: ApiPositions}},
    'params'
  >;
}

const renderScene = SceneMap({
  positions: PoliticianPositions,
  profile: PoliticianProfile,
  constituency: PoliticianConstituency,
});

export const PoliticianContext = createContext<ApiPolitician>(null as any);
const PoliticianView = ({route}: PoliticianViewProps) => {
  const politician: ApiPolitician = {
    profile: route.params.profile,
    positions: route.params.positions,
  };
  const {width} = useWindowDimensions();

  const routes = [
    (politician.profile.topic_ids_of_latest_committee ||
      politician.profile.votes_and_polls ||
      politician.profile.sidejobs ||
      politician.profile.cvs ||
      politician.profile.weblinks) && {
      title: 'Profilseite',
      key: 'profile',
    },
    politician.positions.positions && {
      title: 'Positionen',
      key: 'positions',
    },
    /* politician.constituency && {
      title: 'Wahlkreis',
      key: 'constituency',
    }, */
  ].filter(Boolean) as Route[];
  const [tabIndex, setTabIndex] = useState<number>(() =>
    routes.findIndex(value => value.key === 'profile'),
  );

  return (
    <PoliticianContext.Provider value={politician}>
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
