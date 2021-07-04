import Icon from './Icon';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo} from 'react';
import {Colors} from '../theme';
import {BlurView} from 'react-native-blur';

export interface InfoBannerProps {
  style?: StyleProp<ViewStyle>;
  icon: string;
  title: string;
  subtitle: string;
}

const InfoBanner = memo(({style, icon, title, subtitle}: InfoBannerProps) => {
  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      {Platform.OS === 'ios' && (
        <BlurView style={StyleSheet.absoluteFillObject} blurType="dark" />
      )}
      <Icon style={styles.icon} icon={icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container:
    Platform.OS === 'ios'
      ? {
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
        }
      : {
          height: 150,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.cardBackground,
          borderBottomColor: 'rgba(248, 248, 248, 0.22)',
          borderBottomWidth: 1,
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
