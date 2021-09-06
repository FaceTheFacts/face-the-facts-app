import React, {useContext, useState} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';
import {DataContext} from '../../logic/model';
import Icon from '../Icon';
import {ArrowForwardIos, ClearIcon} from '../../icons';
import {PoliticianPosition} from '../../logic/data';
import PositionAnswerTag from '../utils/PositionAnswerTag';

const PoliticianPositions = () => {
  const politician = useContext(PoliticianContext);
  const data = useContext(DataContext);
  const [openedCandidatePosition, setOpenedCandidatePosition] =
    useState<PoliticianPosition | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const openedPosition = openedCandidatePosition
    ? data.lookupPosition(openedCandidatePosition.id)
    : null;

  return (
    <>
      <ScrollView style={styles.container}>
        {politician.positions!.map(candidatePosition => {
          const position = data.lookupPosition(candidatePosition.id)!;

          return (
            <TouchableOpacity
              key={position.id}
              style={styles.position}
              onPress={() => {
                setOpenedCandidatePosition(candidatePosition);
                setModalOpen(true);
              }}>
              <Text style={styles.title}>{position.title}</Text>
              <PositionAnswerTag
                short
                center
                answer={candidatePosition.answer}
              />
              <Icon style={styles.arrow} icon={ArrowForwardIos} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {openedCandidatePosition && (
        <Modal
          animationType="fade"
          transparent
          visible={modalOpen}
          onRequestClose={() => setModalOpen(false)}>
          <View style={styles.modalWrapper}>
            <Pressable
              style={styles.modalBarrier}
              onPress={() => setModalOpen(false)}
            />
            <TouchableOpacity onPress={() => setModalOpen(false)}>
              <Icon style={styles.modalClose} icon={ClearIcon} />
            </TouchableOpacity>
            <View style={styles.modalContainer}>
              <Text style={styles.modalDescription}>
                {openedPosition!.title}
              </Text>
              <View style={styles.modalSeparator} />
              <PositionAnswerTag answer={openedCandidatePosition.answer} />
              {openedCandidatePosition.reason && (
                <>
                  <Text style={styles.modalReasonLabel}>
                    Begründung von {politician.name}:
                  </Text>
                  <Text style={styles.modalReason}>
                    "{openedCandidatePosition.reason}"
                  </Text>
                </>
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
