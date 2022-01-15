import React from 'react';
import {Party} from '../logic/data';
import Tag from './utils/Tag';
import {StyleProp, ViewStyle} from 'react-native';

export interface PartyTagProps {
  style?: StyleProp<ViewStyle>;
  party: Party;
}

const PartyTag = ({style, party}: PartyTagProps) => {
  return (
    <Tag
      style={style}
      content={party.displayName}
      foregroundColor={party.foregroundColor}
      backgroundColor={party.backgroundColor}
      borderColor={party.borderColor}
    />
  );
};

export default PartyTag;
