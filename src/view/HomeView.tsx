import React from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {TabBar, TabView, SceneRendererProps} from 'react-native-tab-view';
import {Colors} from '../theme';
import FollowFeed from '../component/feed/FollowFeed';
import ParliamentFeed from '../component/feed/ParliamentFeed';

interface HomeViewProps {
  setSelected: (value: string) => void;
}

type Route = {
  key: string;
};

type SceneRenderer = SceneRendererProps & {
  route: Route;
};

const HomeView = (props: HomeViewProps) => {
  console.log(props);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'parliament', title: 'Bundestag'},
    {key: 'follow', title: 'Folge ich'},
  ]);

  const renderScene = ({route}: SceneRenderer) => {
    switch (route.key) {
      case 'parliament':
        return <ParliamentFeed />;
      case 'follow':
        return <FollowFeed setSelected={props.setSelected} />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={props => (
        <View style={styles.headerContainer}>
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: Colors.darkBlue8}}
            tabStyle={styles.tab}
            style={styles.tabBar}
            activeColor={Colors.baseWhite}
            inactiveColor={Colors.white40}
            renderLabel={({route, color}) => (
              <Text style={{...styles.label, color}}>{route.title}</Text>
            )}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>IX Filtern</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 13,
    paddingRight: 16,
    backgroundColor: Colors.darkBlue8,
  },
  tabBar: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    backgroundColor: Colors.darkBlue8,
    shadowOffset: {height: 0, width: 0},
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  tab: {
    width: 'auto',
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 17,
    paddingHorizontal: 0,
    fontWeight: '600',
  },
  filterBtn: {
    borderColor: Colors.white40,
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
});

export default HomeView;
