import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {ApiParty} from '../../logic/api';
import {Colors} from '../../theme';
import BackButton from '../BackButton';
import SkeletonPoliticianHeader from './SkeletonPoliticianHeader';

export interface SkeletonPoliticianProfileProps {
  politicianId: number;
  politicianName: string;
  party: ApiParty;
}

const SkeletonPoliticianProfile = ({
  politicianId,
  politicianName,
  party,
}: SkeletonPoliticianProfileProps) => {
  const {width} = useWindowDimensions();
  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.headerContainer}>
        <BackButton />
        <SkeletonPoliticianHeader
          politicianId={politicianId}
          politicianName={politicianName}
          party={party}
        />
      </View>
      <View style={styles.contentContainer}>
        <ContentLoader backgroundColor={Colors.cardBackground} speed={2}>
          <Rect x="12" y="12" rx="4" ry="4" width="92" height="16" />
          <Rect x="12" y="40" rx="4" ry="4" width={width - 24} height="120" />
          <Rect x="12" y="184" rx="4" ry="4" width="92" height="16" />
          <Rect x="12" y="212" rx="4" ry="4" width={width - 24} height="120" />
          <Rect x="12" y="356" rx="4" ry="4" width="92" height="16" />
          <Rect x="12" y="384" rx="4" ry="4" width={width - 24} height="120" />
        </ContentLoader>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  headerContainer: {
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(252,252,252,0.25)',
  },
  contentContainer: {
    backgroundColor: Colors.background,
  },
});
export default SkeletonPoliticianProfile;
