import React, {useContext, useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';
import {ApiPosition} from '../../logic/api';
import PositionAnswerTag from '../utils/PositionAnswerTag';
import {Modalize} from 'react-native-modalize';
import BottomSheet from '../utils/BottomSheet';
import PositionModal from './PositionModal';

const PoliticianPositions = () => {
  const politician = useContext(PoliticianContext);
  const [openedCandidatePosition, setOpenedCandidatePosition] = useState<
    ApiPosition | undefined
  >(politician?.positions?.positions[0]);
  const modal = useRef<Modalize>(null);
  useEffect(() => {
    setOpenedCandidatePosition(openedCandidatePosition);
  }, [openedCandidatePosition]);
  return (
    <>
      <ScrollView style={styles.container}>
        {politician?.positions?.positions?.map(candidatePosition => {
          return (
            <TouchableOpacity
              key={candidatePosition.id}
              style={styles.position}
              onPress={() => {
                setOpenedCandidatePosition(candidatePosition);
                modal.current?.open();
              }}>
              <Text style={styles.title}>
                {candidatePosition.position_statement.statement}
              </Text>
              <PositionAnswerTag
                short
                center
                answer={candidatePosition.position}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        <PositionModal
          statement={openedCandidatePosition!.position_statement.statement}
          reason={openedCandidatePosition!.reason}
          position={openedCandidatePosition!.position}
        />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  position: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    marginRight: 8,
  },
  arrow: {
    width: 14,
    height: 14,
    color: Colors.foreground,
    marginLeft: 16,
  },
  modalStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.background,
  },
  modalBarrier: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24,25,36,0.7)',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 32,
  },
  modalClose: {
    width: 28,
    height: 28,
    color: Colors.foreground,
    marginBottom: 8,
  },
  modalContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  modalDescription: {
    color: Colors.foreground,
    fontSize: 15,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    width: '100%',
  },
  modalSeparator: {
    backgroundColor: Colors.foreground,
    height: 1,
    opacity: 0.2,
    marginTop: 12,
    marginBottom: 12,
  },
  modalReasonLabel: {
    color: Colors.foreground,
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  modalReason: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default PoliticianPositions;
