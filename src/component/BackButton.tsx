import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../theme';
import {ArrowBackIos} from '../icons';
import Icon from './Icon';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Icon style={styles.icon} icon={ArrowBackIos} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    flexDirection: 'row',
  },
  backBtn: {
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  icon: {
    color: Colors.foreground,
    alignSelf: 'center',
    width: 30,
    height: 30,
  },
});

export default BackButton;
