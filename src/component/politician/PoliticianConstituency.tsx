import React, {useContext} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {DataContext} from '../../logic/model';
import {PoliticianContext} from '../../view/PoliticianView';
import PoliticianRow from '../PoliticianRow';
import {Colors} from '../../theme';

const PoliticianConstituency = () => {
  const data = useContext(DataContext);
  const politician = useContext(PoliticianContext);
  const constituency = data.lookupConstituencies(politician.constituency!)!;

  return (
    <View style={styles.container}>
      <Text style={styles.numberLabel}>Wahlkreis {constituency.number}</Text>
      <Text style={styles.nameLabel}>{constituency.name}</Text>
      <View style={styles.separator} />
      <FlatList
        style={styles.politicianList}
        data={constituency.politicians}
        keyExtractor={item => item}
        renderItem={info => (
          <PoliticianRow style={styles.politicianRow} politician={data.lookupPolitician(info.item)!} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  numberLabel: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  nameLabel: {
    color: Colors.foreground,
    fontSize: 17,
    fontFamily: 'Inter',
  },
  separator: {
    backgroundColor: Colors.foreground,
    height: 1,
    opacity: 0.2,
    marginTop: 12,
    marginBottom: 4,
  },
  politicianList: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  politicianRow: {
    marginVertical: 4,
  },
});

export default PoliticianConstituency;
