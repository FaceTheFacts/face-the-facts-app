import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {DataContext} from '../../logic/model';
import {Colors} from '../../theme';

interface FollowFeedProps {
  setSelected: (value: string) => void;
}

const FollowFeed = (props: FollowFeedProps) => {
  const data = useContext(DataContext);
  const [followedIds, setFollowedIds] = useState<Set<number> | null>(null);

  useEffect(() => {
    data.dbManager.getFollowedIds().then(setFollowedIds);
  }, [data]);

  if (!followedIds || followedIds.size < 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.header4}>
          Folge Politikern, um Neues über sie zu erfahren.
        </Text>
        <TouchableOpacity
          style={styles.search_btn}
          onPress={() => props.setSelected('scanner')}>
          <Text style={styles.header4}>Politiker suchen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header4}>TODO: implement feed</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  header4: {
    color: Colors.foreground,
    fontSize: 13,
    fontWeight: '600',
  },
  search_btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: Colors.white40,
    marginTop: 18,
  },
});

export default FollowFeed;
