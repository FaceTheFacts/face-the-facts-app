import React from 'react';
import Tag from './utils/Tag';
import {StyleProp, ViewStyle} from 'react-native';
import {getFractionStyle} from '../utils/util';

export interface FractionTagProps {
  style?: StyleProp<ViewStyle>;
  party: string;
}

const FractionTag = ({style, party}: FractionTagProps) => {
  const fractionStyle = getFractionStyle(party);
  return (
    <Tag
      style={style}
      content={fractionStyle.display_name}
      foregroundColor={fractionStyle.foreground_color}
      backgroundColor={fractionStyle.background_color}
      bold
      width
    />
  );
};

export default FractionTag;
