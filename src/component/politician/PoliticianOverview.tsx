import React, {useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {NavigationContext} from '@react-navigation/native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';
import {DataContext} from '../../logic/model';
import Icon from '../Icon';
import Wrap from '../utils/Wrap';
import {Vote} from '../../logic/data';
import {ArrowForwardIos} from '../../icons';
import PollCard from '../poll/PollCard';

export const possibleVotes: Vote[] = ['yes', 'no', 'abstain', 'no_show'];

function formatDate(date: string): string {
  const [year, month] = date.split('-');
  return `${month}/${year}`;
}

const PoliticianOverview = () => {
  const data = useContext(DataContext);
  const politician = useContext(PoliticianContext);
  const navigator = useContext<any>(NavigationContext)!;
  const {width} = useWindowDimensions();

  return (
    <ScrollView style={styles.containerWrapper}>
      <View style={styles.container}>
        {politician.committees && (
          <>
            <Text style={styles.subtitle}>Politische Schwerpunkte</Text>
            <Wrap spacing={8}>
              {politician.committees.map(committeeId => {
                const committee = data.lookupCommittee(committeeId)!;

                return (
                  <View key={committeeId} style={styles.committee}>
                    {committee.icon && (
                      <Icon
                        style={styles.committeeIcon}
                        icon={{viewBox: '0 0 24 24', d: committee.icon}}
                      />
                    )}
                    <Text style={styles.committeeLabel}>{committee.name}</Text>
                  </View>
                );
              })}
            </Wrap>
          </>
        )}
        {politician.votes_and_polls && (
          <>
            <TouchableOpacity
              style={styles.pollsHeader}
              onPress={() => {
                navigator.push('PollsScreen', {
                  politician,
                });
              }}>
              <Text style={styles.pollsTitle}>Abstimmungen</Text>
              <Text style={styles.moreButton}>mehr</Text>
            </TouchableOpacity>
            <ScrollView
              style={styles.pollContainer}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}>
              {politician.votes_and_polls.slice(0, 5).map(poll => (
                <PollCard
                  key={poll.Poll.id}
                  style={{
                    width: width - 32,
                    marginHorizontal: 4,
                  }}
                  poll={poll.Poll}
                  vote={poll.Vote}
                  candidateVote={poll.Vote.vote}
                />
              ))}
            </ScrollView>
          </>
        )}
        {politician.sidejobs && (
          <>
            <Text style={styles.subtitle}>Nebentätigkeiten</Text>
            {politician.sidejobs.map((sidejob, index) => (
              <View key={index} style={styles.sideJob}>
                <Text style={styles.sideJobTitle}>{sidejob.label}</Text>
                <Text style={styles.sideJobOrganization}>
                  {sidejob.sidejob_organization.label}
                </Text>
                <View style={styles.sideJobBottomContainer}>
                  {sidejob.income_level && (
                    <Text style={styles.sideJobIncome}>
                      {sidejob.income_level}
                    </Text>
                  )}
                  {sidejob.data_change_date && (
                    <Text style={styles.sideJobDate}>
                      {formatDate(sidejob.data_change_date)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  subtitle: {
    color: Colors.foreground,
    opacity: 1,
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter',
    marginTop: 16,
    marginBottom: 8,
  },
  moreButton: {
    color: Colors.foreground,
    opacity: 1,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter',
    borderRadius: 4,
    borderColor: Colors.moreButtonBorder,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  committee: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
  },
  committeeIcon: {
    width: 20,
    height: 20,
    color: Colors.foreground,
  },
  committeeLabel: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    marginLeft: 8,
  },
  pollsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  pollsTitle: {
    flex: 1,
    color: Colors.foreground,
    opacity: 1,
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  pollContainer: {
    overflow: 'visible',
    marginHorizontal: -4,
  },
  sideJob: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sideJobTitle: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  sideJobOrganization: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.7,
  },
  sideJobBottomContainer: {
    flexDirection: 'row',
    borderTopColor: Colors.inactive,
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },
  sideJobIncome: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.7,
  },
  sideJobDate: {
    flex: 1,
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
    opacity: 0.7,
    textAlign: 'right',
  },
});

export default PoliticianOverview;
