import React from 'react';
import {Vote} from '../../logic/api';
import Tag from './Tag';
import {StyleProp, ViewStyle} from 'react-native';

export const voteLabels: Record<Vote, string> = {
  yes: 'Ja',
  no: 'Nein',
  abstain: 'Enthalten',
  no_show: 'Abwesend',
};

export const voteColors: Record<Vote, string> = {
  yes: '#45C66F',
  no: '#E54A6F',
  abstain: '#1382E3',
  no_show: '#464750',
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
    />
  );
};

export default VoteTag;
