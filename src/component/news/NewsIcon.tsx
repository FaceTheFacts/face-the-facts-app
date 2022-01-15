import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {getLogoPath} from '../../utils/date';

export interface NewsIconProps {
  size?: number;
  source: string;
}

const NewsIcon = ({source}: NewsIconProps) => {
  const icon = getLogoPath(source);
  return <Image source={icon} style={styles.image} />;
};

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 20,
  },
});

export default NewsIcon;
