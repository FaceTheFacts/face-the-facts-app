import React, {useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {SpeechTab} from '../../logic/api';
import {Colors} from '../../theme';
import {formatDate} from '../../utils/util';
import BottomSheet from '../utils/BottomSheet';
import SpeechPlayer from './SpeechPlayer';

interface SpeechFeedProps {
  speech: SpeechTab;
}

export const SpeechFeedContent = ({speech}: SpeechFeedProps) => {
  const modal = useRef<Modalize>(null);

  return (
    <View style={styles.title}>
      <Text style={styles.boldText}>{speech.politicians[0].label}</Text>
      <Text style={styles.titleText}> hat eine </Text>
      <TouchableOpacity onPress={() => modal.current?.open()}>
        <Text style={styles.linkText}>Rede</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}> gehalten.</Text>
      <View style={styles.desc}>
        <Text style={styles.descText}>{speech.title}</Text>
      </View>
      <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        <SpeechPlayer
          politician={speech.politicians[0].label}
          title={speech.title}
          date={formatDate(speech.created)}
          video={speech.videoFileURI}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 13,
    color: Colors.white40,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseBlueLight,
    textDecorationLine: 'underline',
  },
  boldText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  modalStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: Colors.background,
  },
  desc: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  descText: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.white70,
  },
});
