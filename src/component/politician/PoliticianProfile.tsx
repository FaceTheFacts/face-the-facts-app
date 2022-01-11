import React, {useContext, useState} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {Colors} from '../../theme';
import {PoliticianContext} from '../../view/PoliticianView';
import PoliticianOverview from './PoliticianOverview';
import PoliticianCV from './PoliticianCV';
import PoliticianLinks from './PoliticianLinks';
import {Route} from 'react-native-tab-view/lib/typescript/types';

const renderScene = SceneMap({
  overview: PoliticianOverview,
  cv: PoliticianCV,
  links: PoliticianLinks,
});

const PoliticianProfile = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const politician = useContext(PoliticianContext);
  const routes = [
    (politician?.profile?.topic_ids_of_latest_committee.length !== 0 ||
      politician?.profile?.votes_and_polls.length !== 0 ||
      politician?.profile?.sidejobs.length !== 0) && {
      key: 'overview',
      title: 'Übersicht',
    },
    politician?.profile?.cvs.length !== 0 && {
      key: 'cv',
      title: 'Biografie',
    },
    {
      key: 'links',
      title: 'Weblinks',
    },
  ].filter(Boolean) as Route[];

  return (
    <View style={styles.container}>
      <TabView
        onIndexChange={setTabIndex}
        navigationState={{
          index: tabIndex,
          routes,
        }}
        renderScene={renderScene}
        renderTabBar={props => {
          if (props.navigationState.routes.length <= 1) {
            return <></>;
          }

          return (
            <TabBar
              {...props}
              style={styles.tabBar}
              activeColor={Colors.foreground}
              inactiveColor={Colors.inactive}
              labelStyle={styles.tabBarLabel}
              renderIndicator={({
                width,
                style,
                position,
                getTabWidth,
                navigationState: {routes},
              }) => {
                const inputRange = routes.map((_, i) => i);
                const outputRange = routes.reduce<number[]>((acc, _, i) => {
                  if (i === 0) {
                    return [0];
                  }
                  return [...acc, acc[i - 1] + getTabWidth(i - 1)];
                }, []);

                return (
                  <>
                    <Animated.View
                      style={StyleSheet.flatten([
                        style,
                        {
                          width,
                          height: '100%',
                          padding: 8,
                          transform: [
                            {
                              translateX: position.interpolate({
                                inputRange,
                                outputRange,
                                extrapolate: 'clamp',
                              }),
                            },
                          ],
                        },
                      ])}>
                      <View style={styles.indicator} />
                    </Animated.View>
                    <View style={styles.separatorLine} />
                  </>
                );
              }}
            />
          );
        }}
        swipeEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: Colors.background,
  },
  tabBarLabel: {
    textTransform: 'none',
  },
  indicator: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 4,
  },
  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.2,
  },
});

export default PoliticianProfile;
