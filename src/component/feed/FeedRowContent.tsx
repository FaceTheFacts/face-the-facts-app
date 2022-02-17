import React, {useContext, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../theme';
import {NavigationContext} from '@react-navigation/native';
import {ApiParty, ApiSidejob, ApiVoteAndPoll, Vote} from '../../logic/api';
import BottomSheet from '../utils/BottomSheet';
import {Modalize} from 'react-native-modalize';
import SpeechPlayer from '../speech/SpeechPlayer';
import PoliticianCard from '../politician/PoliticianCard';
import {formatDate} from '../../utils/util';
import Icon from '../Icon';
import {ArrowUpRightFromSquare} from '../../icons';

export interface PoliticianInfo {
  id: number;
  label: string;
  party: ApiParty;
  vote?: Vote;
}

export type PollTab = ApiVoteAndPoll & {
  created: string;
  politicians: PoliticianInfo[];
};

interface PollRowProps {
  poll: PollTab;
}

export const PollRowContent = ({poll}: PollRowProps) => {
  const modal = useRef<Modalize>(null);
  const navigator = useContext<any>(NavigationContext)!;

  return (
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
        <Text style={styles.linkText}>Abstimmung</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}> teilgenommen.</Text>
      <BottomSheet
        modalRef={modal}
        modalStyle={styles.modalStyle}
        adjustToContentHeight={true}>
        <>
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
            <PoliticianCard
              key={politician.id}
              politicianId={politician.id}
              politicianName={politician.label}
              party={politician.party}
              vote={politician.vote!}
            />
          ))}
        </>
      </BottomSheet>
    </View>
  );
};

export type SideJobTab = ApiSidejob & {
  politicians: PoliticianInfo[];
};

interface SideJobRowProps {
  sideJob: SideJobTab;
}

export const SideJobRowContent = ({sideJob}: SideJobRowProps) => {
  const navigator = useContext<any>(NavigationContext)!;

  return (
    <View style={styles.title}>
      <Text style={styles.boldText}>{sideJob.politicians[0].label}</Text>
      <Text style={styles.titleText}> hat an eine </Text>
      <TouchableOpacity
        onPress={() => {
          navigator.push('Politician', {
            politicianId: sideJob.politicians[0].id,
            politicianName: sideJob.politicians[0].label,
            party: sideJob.politicians[0].party,
          });
        }}>
        <Text style={styles.linkText}>Nebentätigkeit</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}> hinzugefügt.</Text>
    </View>
  );
};

export type SpeechTab = {
  politicians: PoliticianInfo[];
  videoFileURI: string;
  title: string;
  created: string;
};

interface SpeechRowProps {
  speech: SpeechTab;
}

export const SpeechRowContent = ({speech}: SpeechRowProps) => {
  const modal = useRef<Modalize>(null);

  return (
    <View style={styles.title}>
      <Text style={styles.boldText}>{speech.politicians[0].label}</Text>
      <Text style={styles.titleText}> hat an eine </Text>
      <TouchableOpacity onPress={() => modal.current?.open()}>
        <Text style={styles.linkText}>Rede</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}> gehalten.</Text>
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
  descText: {
    fontSize: 11,
    color: Colors.baseWhite,
    marginTop: 4,
    flexWrap: 'wrap',
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
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
    marginTop: 16,
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
  politicianName: {
    fontSize: 13,
    lineHeight: 15.7,
    color: Colors.baseWhite,
  },
  politicianContainer: {
    backgroundColor: Colors.cardBackground,
  },
});
