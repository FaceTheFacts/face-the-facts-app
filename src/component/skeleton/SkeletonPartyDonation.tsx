import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors} from '../../theme';
import BackButton from '../BackButton';

const SkeletonDashboard = () => {
  const {width} = useWindowDimensions();
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Parteispenden</Text>
        </View>
        <View style={styles.rightContainer} />
      </View>
      <View style={styles.contentContainer}>
        <ContentLoader backgroundColor={Colors.cardBackground} speed={2}>
          <Rect x="12" y="12" rx="4" ry="4" width="189" height="31" />
          <Rect x={width - 90} y="12" rx="4" ry="4" width="78" height="29" />
          <Rect x="12" y="55" rx="4" ry="4" width={width - 24} height="288" />
          <Rect x="12" y="367" rx="4" ry="4" width="111" height="31" />
          <Rect x={width - 69} y="367" rx="4" ry="4" width="57" height="31" />
          <Rect x="12" y="406" rx="4" ry="4" width={width - 24} height="105" />
          <Rect x="12" y="519" rx="4" ry="4" width={width - 24} height="105" />
        </ContentLoader>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.cardBackground,
    borderBottomColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButtonContainer: {
    flex: 1,
  },
  titleContainer: {
    flex: 2,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: Colors.foreground,
  },
  contentContainer: {
    backgroundColor: Colors.background,
  },
});
export default SkeletonDashboard;
