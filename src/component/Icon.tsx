import React, {memo} from 'react';
import Svg, {Path} from 'react-native-svg';
import {StyleProp, ViewStyle} from 'react-native';
import {SVGIcon} from '../icons';

export interface IconProps {
  style?: StyleProp<ViewStyle & {color: string}>;
  icon: SVGIcon;
}

const Icon = memo(({style, icon: {viewBox, d}}: IconProps) => {
  return (
    <Svg style={style} viewBox={viewBox}>
      <Path d={d} fill="currentColor" />
    </Svg>
  );
});

export default Icon;
