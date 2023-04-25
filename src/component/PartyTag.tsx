import React from 'react';
import Tag from './utils/Tag';
import {StyleProp, ViewStyle} from 'react-native';
import {ApiPartyStyle} from '../logic/api';

export interface PartyTagProps {
  style?: StyleProp<ViewStyle>;
  party: ApiPartyStyle;
}

const PartyTag = ({style, party}: PartyTagProps) => {
  return (
    <Tag
      style={style}
      content={party?.display_name}
      foregroundColor={party.foreground_color}
      backgroundColor={party.background_color}
      borderColor={party.border_color}
      bold
    />
  );
};

export default PartyTag;
