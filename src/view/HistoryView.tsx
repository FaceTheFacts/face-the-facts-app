import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../theme';
import {HistoryItem, historyManager} from '../logic/history';
import {DataContext} from '../logic/model';
import PoliticianList from '../component/PoliticianList';
import {groupByDate} from '../utils/date';

const HistoryView = () => {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const data = useContext(DataContext);
  useEffect(() => {
    historyManager.getItems().then(setItems);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verlauf</Text>
      {items ? (
        items.length ? (
          <PoliticianList
            sections={[
              ...groupByDate(
                items,
                item => item.politicianId,
                item => item.date,
                (label, items) => ({
                  title: label,
                  politicians: items.map(
                    item => data.lookupPolitician(item.politicianId)!,
                  ),
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
    </View>
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
  },
});

export default HistoryView;
