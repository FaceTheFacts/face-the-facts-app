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
import Icon from '../Icon';
import Wrap from '../utils/Wrap';
import {Vote} from '../../logic/data';
import PollCard from '../poll/PollCard';
import {
  AdministrationIcon,
  AgricultureIcon,
  CultureIcon,
  DefenceIcon,
  DevelopmentIcon,
  EconomyIcon,
  EducationIcon,
  EnergyIcon,
  EnvironmentIcon,
  EuropeanUnionIcon,
  FinanceIcon,
  ForeignPolicyIcon,
  ForeignTradeIcon,
  HealthIcon,
  HomeSecurityIcon,
  HousingIcon,
  LabourIcon,
  LawIcon,
  MediaIcon,
  MigrationIcon,
  NewStatesIcon,
  ParliamentaryAffairsIcon,
  PoliticsIcon,
  ScienceIcon,
  SocialSecurityIcon,
  SocietyIcon,
  TourismIcon,
  TrafficIcon,
} from '../../icons';

type TopicIcon = {
  label: string;
  icon: string;
};

export const possibleVotes: Vote[] = ['yes', 'no', 'abstain', 'no_show'];

function formatDate(date: string): string {
  const [year, month] = date.split('-');
  return `${month}/${year}`;
}

const PoliticianOverview = () => {
  const politician = useContext(PoliticianContext);
  const navigator = useContext<any>(NavigationContext)!;
  const {width} = useWindowDimensions();

  const topicTypes: Record<number, TopicIcon> = {
    1: {label: 'Medien', icon: MediaIcon},
    2: {label: 'Arbeit', icon: LabourIcon},
    3: {label: 'Bildung', icon: EducationIcon},
    4: {label: 'Europäische Union', icon: EuropeanUnionIcon},
    5: {label: 'Landwirtschaft', icon: AgricultureIcon},
    6: {label: 'Parlamentsangelegenheiten', icon: ParliamentaryAffairsIcon},
    7: {label: 'Kultur', icon: CultureIcon},
    8: {label: 'Recht', icon: LawIcon},
    9: {label: 'Umwelt', icon: EnvironmentIcon},
    10: {label: 'Verkehr', icon: TrafficIcon},
    11: {label: 'Außenwirtschaft', icon: ForeignTradeIcon},
    12: {label: 'Tourismus', icon: TourismIcon},
    13: {label: 'Verteidigung', icon: DefenceIcon},
    14: {label: 'Soziale Sicherung', icon: SocialSecurityIcon},
    15: {label: 'Wissenschaft', icon: ScienceIcon},
    16: {label: 'Gesellschaft', icon: SocietyIcon},
    17: {label: 'Entwicklungspolitik', icon: DevelopmentIcon},
    18: {label: 'Bauwesen', icon: HousingIcon},
    19: {label: 'Wirtschaft', icon: EconomyIcon},
    20: {label: 'Energie', icon: EnergyIcon},
    21: {label: 'Außenpolitik', icon: ForeignPolicyIcon},
    22: {label: 'Öffentliche Finanzen', icon: FinanceIcon},
    23: {label: 'Innere Sicherheit', icon: HomeSecurityIcon},
    24: {label: 'Staat und Verwaltung', icon: AdministrationIcon},
    25: {label: 'Zuwanderung', icon: MigrationIcon},
    26: {label: 'Neue Bundesländer', icon: NewStatesIcon},
    27: {label: 'Politisches Leben', icon: PoliticsIcon},
    28: {label: 'Gesundheit', icon: HealthIcon},
  };

  return (
    <ScrollView style={styles.containerWrapper}>
      <View style={styles.container}>
        {politician?.profile?.topic_ids_of_latest_committee.length !== 0 && (
          <>
            <Text style={styles.subtitle}>Politische Schwerpunkte</Text>
            <Wrap spacing={8}>
              {politician?.profile?.topic_ids_of_latest_committee.map(
                (topicId, index) => {
                  const topic = topicTypes[topicId];
                  return (
                    <View key={index} style={styles.committee}>
                      {topic?.icon && (
                        <Icon
                          style={styles.committeeIcon}
                          icon={{viewBox: '0 0 24 24', d: topic.icon}}
                        />
                      )}
                      <Text style={styles.committeeLabel}>{topic?.label}</Text>
                    </View>
                  );
                },
              )}
            </Wrap>
          </>
        )}
        {politician?.profile?.votes_and_polls && (
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
              {politician.profile.votes_and_polls.slice(0, 5).map(poll => (
                <PollCard
                  key={poll.Poll.id}
                  // eslint-disable-next-line react-native/no-inline-styles
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
        {politician?.profile?.sidejobs && (
          <>
            <Text style={styles.subtitle}>Nebentätigkeiten</Text>
            {politician.profile.sidejobs.map((sidejob, index) => (
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
                  {sidejob.created && (
                    <Text style={styles.sideJobDate}>
                      {formatDate(sidejob.created)}
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
