import React, {useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {Colors} from '../../theme';
import CardPolitician from '../CardPolitician';
import BottomSheet from '../utils/BottomSheet';
import SpeechPlayer from './SpeechPlayer';

interface SpeechCardProps {
  politicianId?: number;
  politician: string;
  title: string;
  date: string;
  video: string;
  cardHeight: number;
}

const SpeechCard = ({
  politicianId,
  politician,
  title,
  date,
  video,
  cardHeight,
}: SpeechCardProps) => {
  const modal = useRef<Modalize>(null);
  const handleClickOpen = () => {
    modal.current!.open();
  };

  return (
    <TouchableOpacity onPress={handleClickOpen}>
      <View style={[styles.container, {height: cardHeight}]}>
        {politicianId && (
          <>
            <CardPolitician politicianId={politicianId} />
            <View style={styles.separatorLine} />
          </>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.descText}>{title}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <BottomSheet
          modalRef={modal}
          modalStyle={{backgroundColor: Colors.background}}
          modalHeight={600}
          withHandle={false}>
          <SpeechPlayer
            politician={politician}
            title={title}
            date={date}
            video={video}
          />
        </BottomSheet>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 266,
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
  },
  dateText: {
    fontSize: 11,
    lineHeight: 13.31,
    color: Colors.white70,
    alignSelf: 'flex-end',
  },
});

export default SpeechCard;
