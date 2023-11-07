import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Row, Tab} from '../../logic/api';
import {Colors} from '../../theme';

interface FeedMoreButtonProps {
  page: number;
  setPage: (value: number) => void;
  setVisibleCount: (value: number) => void;
  tabs: Tab<Row>[];
  visibleCount: number;
}

const FeedMoreButton = ({
  page,
  setPage,
  setVisibleCount,
  tabs,
  visibleCount,
}: FeedMoreButtonProps) => {
  return (
    <>
      {tabs.length > visibleCount ? (
        <TouchableOpacity
          onPress={() => {
            setPage(page + 1);
            setVisibleCount(visibleCount + 20);
          }}>
          <Text style={styles.moreBtn}>mehr</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </>
  );
};
const styles = StyleSheet.create({
  moreBtn: {
    color: Colors.foreground,
    opacity: 1,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Inter',
    borderRadius: 4,
    borderColor: Colors.moreButtonBorder,
    borderWidth: 1.5,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 60,
    alignSelf: 'center',
  },
});

export default FeedMoreButton;
