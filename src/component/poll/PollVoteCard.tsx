import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {useQuery} from 'react-query';
import {PoliticiansIconSolid} from '../../icons';
import {
  ApiPoliticianHeader,
  ApiPollResult,
  ApiPollVotes,
  Vote,
} from '../../logic/api';
import {fetch_api} from '../../logic/fetch';
import {Colors} from '../../theme';
import {getWidth} from '../../utils/util';
import FractionTag from '../FractionTag';
import Icon from '../Icon';
import BottomSheet from '../utils/BottomSheet';
import {useNavigation} from '@react-navigation/native';
import {DataContext} from '../../logic/model';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../view/RootStackParams';
import PoliticianPicture from '../PoliticianPicture';
import PartyTag from '../PartyTag';
import VoteTag from '../utils/VoteTag';
import ErrorCard from '../Error';

interface PollVoteCardProps {
  pollData: ApiPollResult[];
}

type NavigationProps = StackNavigationProp<RootStackParamList, 'Politician'>;

const PollVoteCard = ({pollData}: PollVoteCardProps) => {
  const navigator = useNavigation<NavigationProps>();
  const database = useContext(DataContext);
  const {width} = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(100);
  const [votes, setVotes] = useState<ApiPoliticianHeader[]>([]);
  const voteTags: Vote[] = ['yes', 'no', 'abstain', 'no_show'];
  const modal = useRef<Modalize>(null);
  const {
    data: voteData,
    isSuccess,
    isError,
  } = useQuery<ApiPollVotes | undefined, Error>(
    `poll:${pollData[0].poll_id}: votes`,
    () => fetch_api<ApiPollVotes>(`poll/${pollData[0].poll_id}/votes`),
    {
      staleTime: 60 * 10000000, // 10000 minute = around 1 week
      cacheTime: 60 * 10000000,
    },
  );
  useEffect(() => {
    if (voteData) {
      switch (index) {
        case 0:
          setVotes(voteData.yes);
          break;
        case 1:
          setVotes(voteData.no);
          break;
        case 2:
          setVotes(voteData.abstain);
          break;
        default:
          setVotes(voteData.no_show);
          break;
      }
    }
  }, [index, voteData]);

  if (isError) {
    return <ErrorCard />;
  }

  return (
    <View style={styles.votesCard}>
      <Text style={styles.cardTitle}>Parteien</Text>
      <View style={styles.separatorLine} />
      {pollData &&
        pollData.map((partyVote, pollIndex) => (
          <Fragment key={pollIndex}>
            <View style={styles.fractionRow}>
              <View style={styles.fractionTagContainer}>
                <FractionTag
                  party={partyVote.fraction.short_name}
                  style={styles.fractionTag}
                />
              </View>
              <View
                style={[
                  styles.partyVoteContainer,
                  {
                    width: width,
                  },
                ]}>
                {partyVote.total_yes > 0 && (
                  <View
                    style={[
                      styles.voteBarContainer,
                      {
                        width: getWidth(width, partyVote.total_yes, partyVote),
                      },
                    ]}>
                    <Text style={styles.partyVote}>{partyVote.total_yes}</Text>
                    <View style={[styles.voteBar, styles.yes]} />
                  </View>
                )}
                {partyVote.total_no > 0 && (
                  <View
                    style={[
                      styles.voteBarContainer,
                      {
                        width: getWidth(width, partyVote.total_no, partyVote),
                      },
                    ]}>
                    <Text style={styles.partyVote}>{partyVote.total_no}</Text>
                    <View style={[styles.voteBar, styles.no]} />
                  </View>
                )}
                {partyVote.total_abstain > 0 && (
                  <View
                    style={[
                      styles.voteBarContainer,
                      {
                        width: getWidth(
                          width,
                          partyVote.total_abstain,
                          partyVote,
                        ),
                      },
                    ]}>
                    <Text style={styles.partyVote}>
                      {partyVote.total_abstain}
                    </Text>
                    <View style={[styles.voteBar, styles.abstain]} />
                  </View>
                )}
                {partyVote.total_no_show > 0 && (
                  <View
                    style={[
                      styles.voteBarContainer,
                      {
                        width: getWidth(
                          width,
                          partyVote.total_no_show,
                          partyVote,
                        ),
                      },
                    ]}>
                    <Text style={styles.partyVote}>
                      {partyVote.total_no_show}
                    </Text>
                    <View style={[styles.voteBar, styles.noShow]} />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.separatorLine} />
          </Fragment>
        ))}
      {isSuccess && voteData && (
        <>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => {
              setIndex(0);
              setOffset(100);
              modal.current?.open();
            }}>
            <Icon style={styles.arrowIcon} icon={PoliticiansIconSolid} />
            <Text style={styles.modalBtnText}>Abstimmung einzeln</Text>
          </TouchableOpacity>
          <BottomSheet
            modalRef={modal}
            modalStyle={styles.modalStyle}
            adjustToContentHeight>
            <View style={styles.tabs}>
              <TouchableOpacity
                onPress={() => {
                  setIndex(0);
                  setOffset(100);
                }}
                style={
                  index === 0 ? [styles.tabBtn, styles.active] : styles.tabBtn
                }>
                <Text
                  style={
                    index === 0
                      ? styles.tabBtnText
                      : [styles.tabBtnText, styles.inactive]
                  }>
                  Ja
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIndex(1);
                  setOffset(100);
                }}
                style={
                  index === 1 ? [styles.tabBtn, styles.active] : styles.tabBtn
                }>
                <Text
                  style={
                    index === 1
                      ? styles.tabBtnText
                      : [styles.tabBtnText, styles.inactive]
                  }>
                  Nein
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIndex(2);
                  setOffset(100);
                }}
                style={
                  index === 2 ? [styles.tabBtn, styles.active] : styles.tabBtn
                }>
                <Text
                  style={
                    index === 2
                      ? styles.tabBtnText
                      : [styles.tabBtnText, styles.inactive]
                  }>
                  Enthalten
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIndex(3);
                  setOffset(100);
                }}
                style={
                  index === 3 ? [styles.tabBtn, styles.active] : styles.tabBtn
                }>
                <Text
                  style={
                    index === 3
                      ? styles.tabBtnText
                      : [styles.tabBtnText, styles.inactive]
                  }>
                  Abwesend
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{flexGrow: 1, height: '90%'}}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}>
              {votes.slice(0, offset).map((politician, voteIndex) => (
                <Pressable
                  key={voteIndex}
                  style={styles.card}
                  onPress={() => {
                    modal.current?.close();
                    database.dbManager.pushHistoryItem(politician.id);
                    navigator.navigate('Politician', {
                      politicianId: politician.id,
                      politicianName: politician.label,
                      party: politician.party,
                    });
                  }}>
                  <PoliticianPicture politicianId={politician.id} size={48} />
                  <View style={styles.content}>
                    <Text style={styles.name}>{politician.label}</Text>
                    <PartyTag party={politician.party} />
                  </View>
                  <View style={styles.voteContainer}>
                    <VoteTag vote={voteTags[index]} />
                  </View>
                </Pressable>
              ))}
              {votes.length > offset && (
                <TouchableOpacity onPress={() => setOffset(offset + 100)}>
                  <Text style={styles.moreButton}>mehr</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </BottomSheet>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  votesCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 36,
  },
  cardTitle: {
    color: Colors.foreground,
    fontWeight: '600',
    fontSize: 17,
    fontFamily: 'Inter',
    padding: 12,
  },
  separatorLine: {
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginHorizontal: 12,
  },
  fractionRow: {
    padding: 12,
    flexDirection: 'row',
  },
  fractionTagContainer: {
    marginRight: 8,
  },
  fractionTag: {
    alignItems: 'center',
  },
  partyVoteContainer: {
    flexDirection: 'row',
  },
  partyVote: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.foreground,
    flex: 1,
    minWidth: 7,
  },
  voteBarContainer: {
    marginRight: 4,
    minWidth: 7,
  },
  voteBar: {
    flex: 1,
    maxHeight: 4,
    borderRadius: 4,
    marginBottom: 3,
  },
  yes: {backgroundColor: '#45C66F'},
  no: {backgroundColor: '#E54A6F'},
  abstain: {backgroundColor: '#1382E3'},
  noShow: {backgroundColor: '#464750'},
  tabs: {
    flexDirection: 'row',
    padding: 16,
  },
  tabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  tabBtnText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: Colors.foreground,
    textAlign: 'center',
  },
  active: {borderBottomColor: Colors.foreground, borderBottomWidth: 2},
  inactive: {opacity: 0.4},
  arrowIcon: {
    color: Colors.foreground,
    height: 13,
    width: 13,
    marginRight: 8,
    marginTop: 2,
  },
  modalBtn: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.cardBackground,
    alignSelf: 'center',
    borderRadius: 4,
    marginVertical: 16,
    marginRight: 12,
    borderColor: 'rgba(252, 252, 252, 0.4)',
    borderWidth: 1,
  },
  modalBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.foreground,
  },
  modalStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    marginVertical: 6,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  name: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  voteContainer: {
    alignContent: 'center',
  },
  moreButton: {
    color: Colors.foreground,
    opacity: 1,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Inter',
    borderRadius: 4,
    borderColor: Colors.moreButtonBorder,
    borderWidth: 1.5,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 60,
    alignSelf: 'center',
  },
});

export default PollVoteCard;
