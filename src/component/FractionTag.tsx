import React from 'react';
import Tag from './utils/Tag';
import {StyleProp, ViewStyle} from 'react-native';
import {ApiPartyStyle} from '../logic/api';

export interface FractionTagProps {
  style?: StyleProp<ViewStyle>;
  party: string;
}

const fractionMap: Record<string, ApiPartyStyle> = {
  FDP: {
    id: 4,
    display_name: 'FDP',
    foreground_color: '#181924',
    background_color: '#FFE06D',
  },
  'FDP/DVP': {
    id: 4,
    display_name: 'FDP',
    foreground_color: '#181924',
    background_color: '#FFE06D',
  },
  SPD: {
    id: 1,
    display_name: 'SPD',
    foreground_color: '#FFFFFF',
    background_color: '#E74343',
  },
  'CDU/CSU': {
    id: 2,
    display_name: 'Union',
    foreground_color: '#FFFFFF',
    background_color: '#5D6265',
  },
  CDU: {
    id: 21,
    display_name: 'CDU',
    foreground_color: '#FFFFFF',
    background_color: '#5D6265',
  },
  CSU: {
    id: 22,
    display_name: 'CSU',
    foreground_color: '#FFFFFF',
    background_color: '#0D6CB4',
    border_color: '#F8F8F8',
  },
  'DIE GRÜNEN': {
    id: 5,
    display_name: 'Grüne',
    foreground_color: '#FFFFFF',
    background_color: '#40A962',
  },
  'DIE LINKE': {
    id: 8,
    display_name: 'Linke',
    foreground_color: '#FFFFFF',
    background_color: '#CD3E72',
  },
  AfD: {
    id: 9,
    display_name: 'AfD',
    foreground_color: '#FFFFFF',
    background_color: '#3AA6F4',
  },
  'BVB - Freie Wähler': {
    id: 7,
    display_name: 'BVB',
    foreground_color: '#2F5997',
    background_color: '#F8F8F8',
    border_color: '#FD820B',
  },
  fraktionslos: {
    id: 25,
    display_name: 'fraktionslos',
    foreground_color: '#FFFFFF',
    background_color: '#333333',
  },
};
// FDP/DVP, BVB/Freie Wähler

const FractionTag = ({style, party}: FractionTagProps) => {
  const fractionStyle =
    party in fractionMap ? fractionMap[party] : fractionMap.fraktionslos;
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
