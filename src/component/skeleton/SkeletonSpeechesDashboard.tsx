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

const SkeletonDashboardSpeeches = () => {
  const {width} = useWindowDimensions();
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Reden</Text>
        </View>
        <View style={styles.rightContainer} />
      </View>
      <View style={styles.contentContainer}>
        <ContentLoader backgroundColor={Colors.cardBackground} speed={2}>
          <Rect
            x={width / 2 - 41}
            y="12"
            rx="4"
            ry="4"
            width="82"
            height="31"
          />
          <Rect x="12" y="55" rx="4" ry="4" width={width - 24} height="169" />
          <Rect x="12" y="236" rx="4" ry="4" width={width - 24} height="169" />
          <Rect x="12" y="417" rx="4" ry="4" width={width - 24} height="169" />
          <Rect x="12" y="598" rx="4" ry="4" width={width - 24} height="169" />
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
export default SkeletonDashboardSpeeches;
