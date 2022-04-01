import React from 'react';
import {Image, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Colors} from '../theme';
import splash from '../splash.png';
import poliTrack from '../poliTrack.png';
import openParliamentTV from '../openParliamentTV.png';
import abgeordnetenwatch from '../abgeordnetenwatch.png';

const SplashScreen = () => {
  const {width, height} = useWindowDimensions();
  console.log(width);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.background,
      justifyContent: 'center',
      width,
      height,
    },
    text: {
      fontFamily: 'Inter',
      fontSize: 11,
      alignSelf: 'center',
      color: 'rgba(248, 248, 248, 0.7)',
      marginBottom: 12,
    },
    splash: {
      position: 'absolute',
      alignSelf: 'center',
      width: width - 150,
      height: ((width - 150) / 848) * 160,
    },
    partners: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: 80,
    },
    firstRow: {
      flexDirection: 'row',
    },
    poliTrack: {
      alignSelf: 'center',
      width: width - 300,
      height: ((width - 180) / 800) * 140,
      resizeMode: 'contain',
      marginRight: 12,
    },
    openParliamentTV: {
      alignSelf: 'center',
      width: width - 280,
      height: ((width - 180) / 800) * 140,
      resizeMode: 'contain',
      marginLeft: 12,
    },
    abgeordnetenwatch: {
      alignSelf: 'center',
      width: width - 180,
      height: ((width - 180) / 800) * 140,
      resizeMode: 'contain',
    },
  });

  return (
    <View style={styles.container}>
      <Image style={styles.splash} source={splash} />
      <View style={styles.partners}>
        <Text style={styles.text}>powered by</Text>
        <View style={styles.firstRow}>
          <Image style={styles.poliTrack} source={poliTrack} />
          <Image style={styles.openParliamentTV} source={openParliamentTV} />
        </View>

        <Image style={styles.abgeordnetenwatch} source={abgeordnetenwatch} />
      </View>
    </View>
  );
};

export default SplashScreen;
