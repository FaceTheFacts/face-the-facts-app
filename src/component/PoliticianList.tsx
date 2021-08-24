import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../theme';
import {Politician} from '../logic/data';
import PoliticianRow from './PoliticianRow';

export interface PoliticianListSection {
  title: string;
  politicians: Politician[];
}

export interface PoliticianListProps {
  sections: PoliticianListSection[];
}

const PoliticianList = ({sections}: PoliticianListProps) => {
  return (
    <ScrollView>
      {sections.map(({title, politicians}, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.header}>{title}</Text>
          {politicians.map(politician => (
            <PoliticianRow
              key={politician.id}
              style={styles.politician}
              politician={politician}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  header: {
    fontFamily: 'Inter',
    fontSize: 18,
    color: Colors.foreground,
    opacity: 0.7,
    marginBottom: 10,
    marginLeft: 16,
    marginRight: 16,
  },
  politician: {
    marginBottom: 10,
    marginLeft: 16,
    marginRight: 16,
  },
});

export default PoliticianList;
