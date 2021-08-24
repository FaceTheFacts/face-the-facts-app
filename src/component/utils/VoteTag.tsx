import React from 'react';
import {Vote} from '../../logic/data';
import Tag from './Tag';
import {StyleProp, ViewStyle} from 'react-native';

export const voteLabels: Record<Vote, string> = {
  yes: 'Ja',
  no: 'Nein',
  abstain: 'Enthalten',
  none: 'Abwesend',
};

export const voteColors: Record<Vote, string> = {
  yes: '#5AB760',
  no: '#BB3C45',
  abstain: 'rgba(57, 105, 245, 0.3)',
  none: 'rgba(248, 248, 248, 0.12)',
};

export interface VoteTagProps {
  style?: StyleProp<ViewStyle>;
  vote: Vote;
}

const VoteTag = ({style, vote}: VoteTagProps) => {
  return (
    <Tag
      style={style}
      content={voteLabels[vote]}
      backgroundColor={voteColors[vote]}
      bold
      spacing
      uppercase
    />
  );
};

export default VoteTag;
