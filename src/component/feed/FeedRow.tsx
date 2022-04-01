import React, {ReactNode, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PoliticianPicture from '../PoliticianPicture';
import {Colors} from '../../theme';
import {PoliticianInfo} from './FeedRowContent';
import {RootStackParamList} from '../../view/RootStackParams';
import {DataContext} from '../../logic/model';
import BottomSheet from '../utils/BottomSheet';
import PoliticianCard from '../politician/PoliticianCard';
import {Modalize} from 'react-native-modalize';

interface FeedRowProps {
  politicians: PoliticianInfo[];
  children: ReactNode;
  desc: string;
}

const FeedRow = ({politicians, children, desc}: FeedRowProps) => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation<RootStackParamList>();
  const database = useContext(DataContext);
  const modal = useRef<Modalize>(null);
  return (
    <>
      <View style={styles.container}>
        {politicians.length > 1 ? (
          <TouchableOpacity
            style={styles.image}
            onPress={() => modal.current?.open()}>
            <PoliticianPicture politicianId={+politicians[0].id} size={32} />
            <View style={styles.imageOverlay}>
              <PoliticianPicture politicianId={+politicians[1].id} size={32} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.image}
            onPress={() => {
              database.dbManager.pushHistoryItem(politicians[0].id);
              // @ts-expect-error
              navigation.navigate('Politician', {
                politicianId: politicians[0].id,
                politicianName: politicians[0].label,
                party: politicians[0].party,
              });
            }}>
            <PoliticianPicture politicianId={+politicians[0].id} size={48} />
          </TouchableOpacity>
        )}
        <View style={[{width: width - 80}]}>
          {children}
          <Text style={styles.descText}>{desc}</Text>
        </View>
      </View>
      <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        {politicians.map(politician => (
          <TouchableOpacity
            key={politician.id}
            onPress={() => {
              modal.current?.close();
              database.dbManager.pushHistoryItem(politician.id);
              // @ts-expect-error
              navigation.push('Politician', {
                politicianId: politician.id,
                politicianName: politician.label,
                party: politician.party,
              });
            }}>
            <PoliticianCard
              politicianId={politician.id}
              politicianName={politician.label}
              party={politician.party}
              styling={styles.politicianCard}
            />
          </TouchableOpacity>
        ))}
      </BottomSheet>
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
  modalStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.background,
    paddingTop: 12,
  },
  politicianCard: {
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 6,
    padding: 12,
  },
});

export default FeedRow;
