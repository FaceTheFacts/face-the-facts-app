import {BlurView} from '@react-native-community/blur';
import Icon from './Icon';
import {StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import {Colors} from '../theme';

export interface InfoBannerProps {
  style?: StyleProp<ViewStyle>;
  icon: string;
  title: string;
  subtitle: string;
}

const InfoBanner = memo(({style, icon, title, subtitle}: InfoBannerProps) => {
  return (
    <BlurView style={StyleSheet.flatten([styles.container, style])} blurType="dark">
      <Icon style={styles.icon} icon={icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </BlurView>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    color: Colors.foreground,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 17,
    color: Colors.foreground,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    marginLeft: 32,
    marginRight: 32,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.foreground,
    textAlign: 'center',
    marginLeft: 32,
    marginRight: 32,
  },
});

export default InfoBanner;
