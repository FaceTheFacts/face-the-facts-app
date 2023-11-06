import {NavigationContext} from '@react-navigation/native';
import React, {useContext, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ApiParty} from '../../logic/api';
import {DataContext} from '../../logic/model';
import {Colors} from '../../theme';
import PoliticianCard from '../politician/PoliticianCard';
import BottomSheet from '../utils/BottomSheet';
import SpeechPlayer from './SpeechPlayer';

interface SpeechCardProps {
  politicianId?: number;
  party?: ApiParty;
  politicianName: string;
  title: string;
  date: string;
  video: string;
  cardHeight?: number;
  cardWidth: number;
  verticalScroll?: boolean;
}

const SpeechCard = ({
  politicianId,
  party,
  politicianName,
  title,
  date,
  video,
  cardHeight,
  cardWidth,
  verticalScroll,
}: SpeechCardProps) => {
  const modal = useRef<Modalize>(null);
  const handleClickOpen = () => {
    modal.current!.open();
  };
  const navigator = useContext(NavigationContext);
  const database = useContext(DataContext);
  return politicianId && politicianName && party ? (
    <View style={[styles.container, {height: cardHeight}, {width: cardWidth}]}>
      <TouchableOpacity
        onPress={() => {
          database.dbManager.pushHistoryItem(politicianId);
          navigator?.navigate('Politician', {
            politicianId: politicianId,
            politicianName: politicianName,
            party: party,
          });
        }}>
        <PoliticianCard
          politicianId={politicianId}
          politicianName={politicianName}
          party={party}
        />
      </TouchableOpacity>
      <View style={styles.separatorLine} />
      <TouchableOpacity onPress={handleClickOpen} style={styles.cardContent}>
        {verticalScroll ? (
          <Text style={styles.descText}>{title}</Text>
        ) : (
          <Text
            style={styles.descTextTailed}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {title}
          </Text>
        )}
        <Text style={styles.dateText}>{date}</Text>
      </TouchableOpacity>
      <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        <SpeechPlayer
          politician={politicianName}
          title={title}
          date={date}
          video={video}
        />
      </BottomSheet>
    </View>
  ) : (
    <TouchableOpacity
      onPress={handleClickOpen}
      style={[styles.container, {height: cardHeight}, {width: cardWidth}]}>
      <View style={styles.cardContent}>
        <Text style={styles.descText}>{title}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        <SpeechPlayer
          politician={politicianName}
          title={title}
          date={date}
          video={video}
        />
      </BottomSheet>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginRight: 8,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginVertical: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  descText: {
    fontSize: 13,
    lineHeight: 15.73,
    color: Colors.baseWhite,
    marginBottom: 4,
  },
  descTextTailed: {
    fontSize: 13,
    lineHeight: 15.73,
    color: Colors.baseWhite,
  },
  dateText: {
    fontSize: 11,
    lineHeight: 13.31,
    color: Colors.white70,
    alignSelf: 'flex-end',
  },
  modalStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: Colors.background,
  },
});

export default SpeechCard;
