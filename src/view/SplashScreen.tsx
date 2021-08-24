import React from 'react';
import {Image, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Colors} from '../theme';
import splash from '../splash.png';
import poweredByAbgeordnetenwatch from '../powered_by_abgeordnetenwatch.png';

const SplashScreen = () => {
  const {width, height} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.background,
      justifyContent: 'center',
      width,
      height,
    },
    splash: {
      position: 'absolute',
      alignSelf: 'center',
      width: width - 150,
      height: ((width - 150) / 848) * 160,
    },
    poweredByAbgeordnetenwatch: {
      position: 'absolute',
      alignSelf: 'center',
      width: width - 180,
      height: ((width - 180) / 800) * 140,
      bottom: 50,
      resizeMode: 'contain',
    },
  });

  return (
    <View style={styles.container}>
      <Image style={styles.splash} source={splash} />
      <Image
        style={styles.poweredByAbgeordnetenwatch}
        source={poweredByAbgeordnetenwatch}
      />
    </View>
  );
};

export default SplashScreen;
