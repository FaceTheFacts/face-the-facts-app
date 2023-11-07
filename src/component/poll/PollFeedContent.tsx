import React, {useContext, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import {DataContext} from '../../logic/model';
import {NavigationContext} from '@react-navigation/native';
import {PollTab} from '../../logic/api';
import BottomSheet from '../utils/BottomSheet';
import {Modalize} from 'react-native-modalize';
import PoliticianCard from '../politician/PoliticianCard';
import Icon from '../Icon';
import {ArrowUpRightFromSquare} from '../../icons';

interface PollFeedProps {
  poll: PollTab;
}

export const PollFeedContent = ({poll}: PollFeedProps) => {
  const modal = useRef<Modalize>(null);
  const navigator = useContext<any>(NavigationContext)!;
  const database = useContext(DataContext);

  return (
    <>
      <View style={styles.title}>
        <Text style={styles.boldText}>{poll.politicians[0].label}</Text>
        {poll.politicians.length > 1 ? (
          <>
            <Text style={styles.titleText}> und </Text>
            <Text style={styles.boldText}>
              {poll.politicians.length - 1} weitere
            </Text>
            <Text style={styles.titleText}> haben an einer </Text>
          </>
        ) : (
          <Text style={styles.titleText}> hat an einer </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            if (poll.politicians.length > 1) {
              modal.current?.open();
            } else {
              navigator.push('PollDetails', {
                poll: poll.Poll,
                vote: poll.Vote,
                candidateVote: poll.Vote.vote,
              });
            }
          }}>
          <Text style={styles.linkText}>Abstimmung </Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>teilgenommen.</Text>
      </View>
      <View style={styles.desc}>
        <Text style={styles.descText}>{poll.Poll.label}</Text>
      </View>
      <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        <TouchableOpacity
          style={styles.redirectBtn}
          onPress={() => {
            modal.current?.close();
            navigator.push('PollDetails', {
              poll: poll.Poll,
              vote: poll.Vote,
              candidateVote: poll.Vote.vote,
            });
          }}>
          <Icon style={styles.arrowIcon} icon={ArrowUpRightFromSquare} />
          <Text style={styles.redirectBtnText}>zur Abstimmung</Text>
        </TouchableOpacity>
        {poll.politicians.map(politician => (
          <TouchableOpacity
            key={politician.id}
            onPress={() => {
              database.dbManager.pushHistoryItem(politician.id);
              modal.current?.close();
              navigator.push('Politician', {
                politicianId: politician.id,
                politicianName: politician.label,
                party: politician.party,
              });
            }}>
            <PoliticianCard
              politicianId={politician.id}
              politicianName={politician.label}
              party={politician.party}
              vote={politician.vote}
              styling={styles.politicianCard}
            />
          </TouchableOpacity>
        ))}
      </BottomSheet>
    </>
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
  arrowIcon: {
    color: Colors.background,
    height: 13,
    width: 13,
    marginRight: 8,
    marginTop: 2,
  },
  redirectBtn: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.baseWhite,
    alignSelf: 'flex-end',
    borderRadius: 4,
    marginVertical: 16,
    marginRight: 12,
  },
  redirectBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
  },
  politicianCard: {
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 6,
    padding: 12,
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
