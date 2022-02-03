import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {Colors} from '../theme';

const SkeletonPoliticianItem = () => {
  return (
    <ContentLoader backgroundColor={Colors.cardBackground} speed={2}>
      <Circle x="12" y="5" cx="24" cy="24" r="24" />
      <Rect x="72" y="8" rx="4" ry="4" width="130" height="16" />
      <Rect x="72" y="30" rx="4" ry="4" width="27" height="16" />
    </ContentLoader>
  );
};
export default SkeletonPoliticianItem;
