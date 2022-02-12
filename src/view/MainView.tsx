import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar} from 'react-native';
import ScannerView from './ScannerView';
import TabMenu from '../component/TabMenu';
import HomeView from './HomeView';
import HistoryView from './HistoryView';
import {Colors} from '../theme';
import {
  HomeIcon,
  HomeIconSolid,
  ScannerIcon,
  ScannerIconSolid,
  PoliticiansIcon,
  PoliticiansIconSolid,
} from '../icons';

const MainView = () => {
  const [selected, setSelected] = useState('home');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.contentContainer}>
        {selected === 'home' && <HomeView setSelected={setSelected} />}
        {selected === 'scanner' && <ScannerView />}
        {selected === 'politicians' && <HistoryView />}
      </View>
      <SafeAreaView style={styles.tabBarContainer}>
        <TabMenu
          items={[
            {
              name: 'home',
              icons: [HomeIcon, HomeIconSolid],
              label: 'Home',
            },
            {
              name: 'scanner',
              icons: [ScannerIcon, ScannerIconSolid],
              label: 'Scan',
            },
            {
              name: 'politicians',
              icons: [PoliticiansIcon, PoliticiansIconSolid],
              label: 'Politiker',
            },
          ]}
          selected={selected}
          onSelect={setSelected}
          blur={false}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBarContainer: {
    backgroundColor: Colors.cardBackground,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default MainView;
