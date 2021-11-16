import React, {useRef} from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {TabBar, TabView, SceneRendererProps} from 'react-native-tab-view';
import {Colors} from '../theme';
import FollowFeed from '../component/feed/FollowFeed';
import ParliamentFeed from '../component/feed/ParliamentFeed';
import {Modalize} from 'react-native-modalize';
import BottomSheet from '../component/utils/BottomSheet';
import FeedFilter from '../component/feed/FeedFilter';
import Icon from '../component/Icon';
import {FilterIcon} from '../icons';

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
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'parliament', title: 'Bundestag'},
    {key: 'follow', title: 'Folge ich'},
  ]);
  const modal = useRef<Modalize>(null);

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
    <>
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
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => modal.current?.open()}>
              <Icon style={styles.icon} icon={FilterIcon} />
              <Text style={styles.filterText}>Filtern</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        <FeedFilter />
      </BottomSheet>
    </>
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
    flexDirection: 'row',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  modalStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: Colors.background,
  },
  icon: {
    color: Colors.foreground,
    alignSelf: 'center',
    width: 13,
    height: 13,
    marginRight: 8,
  },
});

export default HomeView;
