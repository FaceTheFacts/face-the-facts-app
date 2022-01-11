import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {Colors} from '../theme';
import {HistoryItem} from '../logic/db';
import {DataContext} from '../logic/model';
import PoliticianList from '../component/PoliticianList';
import {groupByDate} from '../utils/date';

const HistoryView = () => {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const data = useContext(DataContext);
  useEffect(() => {
    data.dbManager.getHistoryItems().then(setItems);
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verlauf</Text>
      {items ? (
        items.length ? (
          <PoliticianList
            sections={[
              ...groupByDate(
                items,
                item => item.politicianId,
                item => item.date,
                (label, historyItems) => ({
                  title: label,
                  politicianIds: historyItems.map(item => item.politicianId),
                }),
              ),
            ]}
          />
        ) : (
          <Text style={styles.noDataText}>
            Hier erscheinen Kandidat:innen, deren Wahlplakate du gescannt hast.
          </Text>
        )
      ) : (
        <Text style={styles.noDataText}>Laden...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.foreground,
    margin: 16,
  },
  noDataText: {
    fontFamily: 'Inter',
    fontSize: 17,
    opacity: 0.7,
    color: Colors.foreground,
    marginLeft: 16,
  },
});

export default HistoryView;
