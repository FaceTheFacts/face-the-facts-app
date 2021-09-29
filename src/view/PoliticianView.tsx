import React, {createContext, useState, useContext} from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import PoliticianHeader from '../component/politician/PoliticianHeader';
import {Politician} from '../logic/data';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import PoliticianProfile from '../component/politician/PoliticianProfile';
import PoliticianPositions from '../component/politician/PoliticianPositions';
import PoliticianConstituency from '../component/politician/PoliticianConstituency';
import {Colors} from '../theme';
import {Route} from 'react-native-tab-view/lib/typescript/types';
import {NavigationContext} from '@react-navigation/native';
import Icon from '../component/Icon';
import {ArrowBackIos} from '../icons';

interface PoliticianViewProps {
  route: RouteProp<{params: {politician: Politician}}, 'params'>;
}

const renderScene = SceneMap({
  positions: PoliticianPositions,
  profile: PoliticianProfile,
  constituency: PoliticianConstituency,
});

export const PoliticianContext = createContext<Politician>(null as any);

const PoliticianView = ({route}: PoliticianViewProps) => {
  const {politician} = route.params;
  const {width} = useWindowDimensions();
  const navigator = useContext(NavigationContext)!;

  const routes = [
    politician.positions && {
      title: 'Positionen',
      key: 'positions',
    },
    (politician.committees ||
      politician.votes ||
      politician.sideJobs ||
      politician.cv ||
      politician.links) && {
      title: 'Profil',
      key: 'profile',
    },
    politician.constituency && {
      title: 'Wahlkreis',
      key: 'constituency',
    },
  ].filter(Boolean) as Route[];
  const [tabIndex, setTabIndex] = useState<number>(() =>
    routes.findIndex(value => value.key === 'profile'),
  );

  // TODO: animation direction
  // TODO: check if politician is current politician
  return (
    <PoliticianContext.Provider value={politician}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.cardBackground}
        />
        <View style={styles.backBtnContainer}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigator.goBack()}>
            <Icon style={styles.icon} icon={ArrowBackIos} />
          </TouchableOpacity>
        </View>
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
      </SafeAreaView>
    </PoliticianContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backBtnContainer: {
    backgroundColor: Colors.cardBackground,
    // // height: 40,
    flexDirection: 'row',
    // paddingVertical: 20,
    // paddingHorizontal: 25,
  },
  backBtn: {
    // backgroundColor: Colors.cardBackground,
    // height: 40,
    // flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  icon: {
    color: Colors.foreground,
    alignSelf: 'center',
    width: 30,
    height: 30,
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
