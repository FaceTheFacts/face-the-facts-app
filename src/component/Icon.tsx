import React, {memo} from 'react';
import Svg, {Path} from 'react-native-svg';
import {StyleProp, ViewStyle} from 'react-native';

export interface IconProps {
  style?: StyleProp<ViewStyle & {color: string}>;
  icon: string;
  viewBox?: string;
}

const Icon = memo(({style, icon, viewBox}: IconProps) => {
  return (
    <Svg style={style} viewBox={viewBox || '0 0 24 24'}>
      <Path d={icon} fill="currentColor" />
    </Svg>
  );
});

export default Icon;
