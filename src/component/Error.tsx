import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import error from '../error_logo.png';
import {ReloadIcon, LogoIcon} from '../icons';
import {Colors} from '../theme';
import Icon from './Icon';
import RNRestart from 'react-native-restart';

const ErrorCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon style={styles.logoIcon} icon={LogoIcon} />
        <Image style={styles.logoError} source={error} resizeMode={'contain'} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Ups, hier ist etwas schief gegangen.</Text>
        <Text style={styles.subtitle}>
          Stelle sicher, dass du über eine aktive Internetverbindung verfügst
          und versuche es später noch einmal.
        </Text>
        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => RNRestart.Restart()}>
          <Icon style={styles.icon} icon={ReloadIcon} />
          <Text style={styles.title}>Neu laden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: 'center',
    flex: 1,
    margin: 28,
    //width,
    //height,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: '70%',
    alignItems: 'center',
    marginBottom: -10,
  },
  logoIcon: {
    flex: 1,
    color: Colors.foreground,
    height: 56,
    width: 44,
    marginLeft: 45,
    marginRight: -32,
  },
  logoError: {
    flex: 1,
    height: 18,
    width: 166,
  },
  textContainer: {
    flex: 1,
    margin: 0,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 13,
    color: Colors.foreground,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: Colors.white70,
    marginVertical: 8,
  },
  linkBtn: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    width: 110,
    backgroundColor: Colors.background,
    borderRadius: 4,
    borderColor: Colors.white40,
    borderWidth: 1,
  },
  icon: {
    height: 13,
    width: 13,
    color: Colors.foreground,
    marginTop: 2,
    marginRight: 8,
  },
});

export default ErrorCard;
