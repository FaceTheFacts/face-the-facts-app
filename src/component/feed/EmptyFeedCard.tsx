import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../theme';

interface EmptyFeedCardProps {
  setSelected: (value: string) => void;
}

const EmptyFeedCard = ({setSelected}: EmptyFeedCardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Folge Politiker:innen, um Neues über sie zu erfahren.
      </Text>
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={() => setSelected('politicians')}>
        <Text style={styles.header}>Politiker:innen suchen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingTop: 12,
  },
  header: {
    color: Colors.foreground,
    fontSize: 13,
    fontWeight: '600',
  },
  searchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: Colors.white40,
    marginTop: 18,
  },
});

export default EmptyFeedCard;
