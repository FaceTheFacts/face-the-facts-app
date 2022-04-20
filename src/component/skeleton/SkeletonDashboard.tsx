import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {Colors} from '../../theme';

const SkeletonDashboard = () => {
  const {width} = useWindowDimensions();
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.contentContainer}>
        <ContentLoader backgroundColor={Colors.cardBackground} speed={2}>
          <Rect x="12" y="12" rx="4" ry="4" width="92" height="16" />
          <Rect x="12" y="40" rx="4" ry="4" width={width - 24} height="120" />
          <Rect x="12" y="184" rx="4" ry="4" width="92" height="16" />
          <Rect x="12" y="212" rx="4" ry="4" width={width - 24} height="80" />
          <Rect x="12" y="304" rx="4" ry="4" width={width - 24} height="80" />
          <Rect x="12" y="400" rx="4" ry="4" width={width - 24} height="80" />
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
  contentContainer: {
    backgroundColor: Colors.background,
  },
});
export default SkeletonDashboard;
