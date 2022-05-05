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
      content={party?.party_style.display_name}
      foregroundColor={party.party_style.foreground_color}
      backgroundColor={party.party_style.background_color}
      borderColor={party.party_style.border_color}
      bold
    />
  );
};

export default PartyTag;
