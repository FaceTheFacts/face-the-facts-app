import React, {Fragment} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {ApiPollDetail} from '../../logic/api';
import {Colors} from '../../theme';
import {getWidth} from '../../utils/date';
import FractionTag from '../FractionTag';

interface PollVoteCardProps {
  pollData?: ApiPollDetail[];
}

const PollVoteCard = ({pollData}: PollVoteCardProps) => {
  const {width} = useWindowDimensions();
  return (
    <View style={styles.votesCard}>
      <Text style={styles.cardTitle}>Parteien</Text>
      <View style={styles.separatorLine} />
      {pollData &&
        pollData.map((partyVote, index) => (
          <Fragment key={index}>
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
            {pollData.length > index + 1 && (
              <View style={styles.separatorLine} />
            )}
          </Fragment>
        ))}
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
});

export default PollVoteCard;
