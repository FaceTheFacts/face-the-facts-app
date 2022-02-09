import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Colors} from '../theme';

const SkeletonPoliticianItem = () => {
  const {width} = useWindowDimensions();
  return (
    <>
      <View style={[styles.container, {width: width - 24}]}>
        <ContentLoader backgroundColor={Colors.background} speed={2}>
          <Circle x="12" y="12" cx="24" cy="24" r="24" />
          <Rect x="72" y="14" rx="4" ry="4" width="130" height="16" />
          <Rect x="72" y="37" rx="4" ry="4" width="27" height="16" />
        </ContentLoader>
      </View>
      <View style={[styles.container, {width: width - 24}]}>
        <ContentLoader backgroundColor={Colors.background} speed={2}>
          <Circle x="12" y="12" cx="24" cy="24" r="24" />
          <Rect x="72" y="14" rx="4" ry="4" width="130" height="16" />
          <Rect x="72" y="37" rx="4" ry="4" width="27" height="16" />
        </ContentLoader>
      </View>
      <View style={[styles.container, {width: width - 24}]}>
        <ContentLoader backgroundColor={Colors.background} speed={2}>
          <Circle x="12" y="12" cx="24" cy="24" r="24" />
          <Rect x="72" y="14" rx="4" ry="4" width="130" height="16" />
          <Rect x="72" y="37" rx="4" ry="4" width="27" height="16" />
        </ContentLoader>
      </View>
      <View style={[styles.container, {width: width - 24}]}>
        <ContentLoader backgroundColor={Colors.background} speed={2}>
          <Circle x="12" y="12" cx="24" cy="24" r="24" />
          <Rect x="72" y="14" rx="4" ry="4" width="130" height="16" />
          <Rect x="72" y="37" rx="4" ry="4" width="27" height="16" />
        </ContentLoader>
      </View>
      <View style={[styles.container, {width: width - 24}]}>
        <ContentLoader backgroundColor={Colors.background} speed={2}>
          <Circle x="12" y="12" cx="24" cy="24" r="24" />
          <Rect x="72" y="14" rx="4" ry="4" width="130" height="16" />
          <Rect x="72" y="37" rx="4" ry="4" width="27" height="16" />
        </ContentLoader>
      </View>
      <View style={[styles.container, {width: width - 24}]}>
        <ContentLoader backgroundColor={Colors.background} speed={2}>
          <Circle x="12" y="12" cx="24" cy="24" r="24" />
          <Rect x="72" y="14" rx="4" ry="4" width="130" height="16" />
          <Rect x="72" y="37" rx="4" ry="4" width="27" height="16" />
        </ContentLoader>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    marginBottom: 12,
  },
});

export default SkeletonPoliticianItem;
