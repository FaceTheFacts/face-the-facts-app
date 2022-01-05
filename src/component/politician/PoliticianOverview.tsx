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
import {SideJobIncomeLevel, Vote} from '../../logic/data';
import {ArrowForwardIos} from '../../icons';
import PollCard from '../poll/PollCard';

const incomeLevelLabels: Record<SideJobIncomeLevel, string> = {
  '1': '1.000 € bis 3.500 €',
  '2': '3.500 € bis 7.000 €',
  '3': '7.000 € bis 15.000 €',
  '4': '15.000 € bis 30.000 €',
  '5': '30.000 € bis 50.000 €',
  '6': '50.000 € bis 75.000 €',
  '7': '75.000 € bis 100.000 €',
  '8': '100.000 € bis 150.000 €',
  '9': '150.000 € bis 250.000 €',
  '10': 'ab 250.000 €',
};

export const possibleVotes: Vote[] = ['yes', 'no', 'abstain', 'none'];

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
        {politician.votes && (
          <>
            <TouchableOpacity
              style={styles.pollsHeader}
              onPress={() => {
                navigator.push('PollsScreen', {
                  politician,
                });
              }}>
              <Text style={styles.pollsTitle}>Kürzliche Abstimmungen</Text>
              <Icon style={styles.pollsArrow} icon={ArrowForwardIos} />
            </TouchableOpacity>
            <ScrollView
              style={styles.pollContainer}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}>
              {data.polls
                .filter(poll => poll.id in politician.votes!)
                .slice(0, 5)
                .map(poll => (
                  <PollCard
                    key={poll.id}
                    style={{
                      width: width - 32,
                      marginHorizontal: 4,
                    }}
                    poll={poll}
                    candidateVote={politician.votes![poll.id]}
                  />
                ))}
            </ScrollView>
          </>
        )}
        {politician.sideJobs && (
          <>
            <Text style={styles.subtitle}>Bekannte Nebentätigkeiten</Text>
            {politician.sideJobs.map((sideJob, index) => (
              <View key={index} style={styles.sideJob}>
                <Text style={styles.sideJobTitle}>{sideJob.job}</Text>
                <Text style={styles.sideJobOrganization}>
                  {sideJob.organization}
                </Text>
                <View style={styles.sideJobBottomContainer}>
                  {sideJob.incomeLevel && (
                    <Text style={styles.sideJobIncome}>
                      {incomeLevelLabels[sideJob.incomeLevel]}
                    </Text>
                  )}
                  {sideJob.date && (
                    <Text style={styles.sideJobDate}>
                      {formatDate(sideJob.date)}
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
    opacity: 0.7,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
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
    marginTop: 16,
    marginBottom: 8,
  },
  pollsTitle: {
    flex: 1,
    color: Colors.foreground,
    opacity: 0.7,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
  },
  pollsArrow: {
    width: 12,
    height: 12,
    color: Colors.foreground,
    opacity: 0.7,
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
