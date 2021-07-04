import React, {memo} from 'react';
import Svg, {Path} from 'react-native-svg';
import {StyleProp, ViewStyle} from 'react-native';

export interface IconProps {
  style?: StyleProp<ViewStyle>;
  icon: string;
}

const Icon = memo(({style, icon}: IconProps) => {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path d={icon} fill="currentColor" />
    </Svg>
  );
});

export default Icon;
