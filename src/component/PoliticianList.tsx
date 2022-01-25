import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import PoliticianRow from './PoliticianRow';

export interface PoliticianListSection {
  title: string;
  politicianIds: number[];
}

export interface PoliticianListProps {
  sections: PoliticianListSection[];
}

const PoliticianList = ({sections}: PoliticianListProps) => {
  return (
    <ScrollView>
      {sections.map(({politicianIds}) =>
        politicianIds.map(politicianId => (
          <PoliticianRow
            key={politicianId}
            style={styles.politician}
            politicianId={politicianId}
          />
        )),
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  politician: {
    marginBottom: 10,
  },
});

export default PoliticianList;
