import React, {ReactNode} from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import PoliticianPicture from './PoliticianPicture';
import {Politician} from '../logic/data';
import {Colors} from '../theme';

interface FeedRowProps {
  politicians: Politician[];
  children: ReactNode;
  desc: string;
}

const FeedRow = ({politicians, children, desc}: FeedRowProps) => {
  const {width} = useWindowDimensions();

  return (
    <>
      <View style={styles.container}>
        {politicians.length > 1 ? (
          <View style={styles.image}>
            <PoliticianPicture politicianId={politicians[0].id} size={32} />
            <View style={styles.imageOverlay}>
              <PoliticianPicture politicianId={politicians[1].id} size={32} />
            </View>
          </View>
        ) : (
          <View style={styles.image}>
            <PoliticianPicture politicianId={politicians[0].id} size={48} />
          </View>
        )}
        <View style={[{width: width - 80}]}>
          {children}
          <Text style={styles.descText}>{desc}</Text>
        </View>
      </View>
      <View style={styles.separatorLine} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 16,
    flexDirection: 'row',
  },
  image: {
    width: 48,
    height: 48,
    marginRight: 8,
  },
  imageOverlay: {
    width: 48,
    height: 48,
    position: 'relative',
    bottom: 16,
    left: 16,
  },
  descText: {
    fontSize: 11,
    color: Colors.baseWhite,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
    // marginTop: 16,
  },
});

export default FeedRow;
