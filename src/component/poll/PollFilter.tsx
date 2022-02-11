import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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
import {Colors} from '../../theme';
import Icon from '../Icon';

interface PollFilterProps {
  filter: number[];
  setFilter: (value: number[]) => void;
}
interface topicType {
  label: string;
  icon: string;
}

const PollFilter = ({filter, setFilter}: PollFilterProps) => {
  const topicTypes: topicType[] = [
    {label: 'Medien', icon: MediaIcon},
    {label: 'Arbeit', icon: LabourIcon},
    {label: 'Bildung', icon: EducationIcon},
    {label: 'Europäische Union', icon: EuropeanUnionIcon},
    {label: 'Landwirtschaft', icon: AgricultureIcon},
    {label: 'Parlamentsangelegenheiten', icon: ParliamentaryAffairsIcon},
    {label: 'Kultur', icon: CultureIcon},
    {label: 'Recht', icon: LawIcon},
    {label: 'Umwelt', icon: EnvironmentIcon},
    {label: 'Verkehr', icon: TrafficIcon},
    {label: 'Außenwirtschaft', icon: ForeignTradeIcon},
    {label: 'Tourismus', icon: TourismIcon},
    {label: 'Verteidigung', icon: DefenceIcon},
    {label: 'Soziale Sicherung', icon: SocialSecurityIcon},
    {label: 'Wissenschaft', icon: ScienceIcon},
    {label: 'Gesellschaft', icon: SocietyIcon},
    {label: 'Entwicklungspolitik', icon: DevelopmentIcon},
    {label: 'Bauwesen', icon: HousingIcon},
    {label: 'Wirtschaft', icon: EconomyIcon},
    {label: 'Energie', icon: EnergyIcon},
    {label: 'Außenpolitik', icon: ForeignPolicyIcon},
    {label: 'Öffentliche Finanzen', icon: FinanceIcon},
    {label: 'Innere Sicherheit', icon: HomeSecurityIcon},
    {label: 'Staat und Verwaltung', icon: AdministrationIcon},
    {label: 'Zuwanderung', icon: MigrationIcon},
    {label: 'Neue Bundesländer', icon: NewStatesIcon},
    {label: 'Politisches Leben', icon: PoliticsIcon},
    {label: 'Gesundheit', icon: HealthIcon},
  ];
  useEffect(() => {
    setFilter(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);
  return (
    <View style={styles.container}>
      <Text style={styles.heading2}>Nach Thema</Text>
      <Text style={styles.text1}>
        Wähle ein Thema aus, nach dem die Abstimmungen gefiltert werden sollen
      </Text>
      <View style={styles.separatorLine} />
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}>
        <View style={styles.topicScrollContainer}>
          <View style={styles.topicRow}>
            {topicTypes.slice(0, 7).map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={
                  filter.includes(index) ? styles.topicSelected : styles.topic
                }
                onPress={() => {
                  setFilter(
                    filter.includes(index)
                      ? filter.filter(value => value !== index)
                      : [...filter, index],
                  );
                }}>
                <Icon
                  style={
                    filter.includes(index)
                      ? styles.topicIconSelected
                      : styles.topicIcon
                  }
                  icon={{viewBox: '0 0 24 24', d: topic.icon}}
                />
                <Text
                  style={
                    filter.includes(index)
                      ? styles.topicLabelSelected
                      : styles.topicLabel
                  }>
                  {topic.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.topicRow}>
            {topicTypes.slice(7, 15).map((topic, index) => (
              <TouchableOpacity
                key={index + 7}
                style={
                  filter.includes(index + 7)
                    ? styles.topicSelected
                    : styles.topic
                }
                onPress={() => {
                  setFilter(
                    filter.includes(index + 7)
                      ? filter.filter(value => value !== index + 7)
                      : [...filter, index + 7],
                  );
                }}>
                <Icon
                  style={
                    filter.includes(index + 7)
                      ? styles.topicIconSelected
                      : styles.topicIcon
                  }
                  icon={{viewBox: '0 0 24 24', d: topic.icon}}
                />
                <Text
                  style={
                    filter.includes(index + 7)
                      ? styles.topicLabelSelected
                      : styles.topicLabel
                  }>
                  {topic.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.topicRow}>
            {topicTypes.slice(15, 22).map((topic, index) => (
              <TouchableOpacity
                key={index + 15}
                style={
                  filter.includes(index + 15)
                    ? styles.topicSelected
                    : styles.topic
                }
                onPress={() => {
                  setFilter(
                    filter.includes(index + 15)
                      ? filter.filter(value => value !== index + 15)
                      : [...filter, index + 15],
                  );
                }}>
                <Icon
                  style={
                    filter.includes(index + 15)
                      ? styles.topicIconSelected
                      : styles.topicIcon
                  }
                  icon={{viewBox: '0 0 24 24', d: topic.icon}}
                />
                <Text
                  style={
                    filter.includes(index + 15)
                      ? styles.topicLabelSelected
                      : styles.topicLabel
                  }>
                  {topic.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.topicRow}>
            {topicTypes.slice(22).map((topic, index) => (
              <TouchableOpacity
                key={index + 22}
                style={
                  filter.includes(index + 22)
                    ? styles.topicSelected
                    : styles.topic
                }
                onPress={() => {
                  setFilter(
                    filter.includes(index + 22)
                      ? filter.filter(value => value !== index + 22)
                      : [...filter, index + 22],
                  );
                }}>
                <Icon
                  style={
                    filter.includes(index + 22)
                      ? styles.topicIconSelected
                      : styles.topicIcon
                  }
                  icon={{viewBox: '0 0 24 24', d: topic.icon}}
                />
                <Text
                  style={
                    filter.includes(index + 22)
                      ? styles.topicLabelSelected
                      : styles.topicLabel
                  }>
                  {topic.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 33,
  },
  heading2: {
    fontSize: 17,
    color: Colors.foreground,
    marginBottom: 4,
  },
  text1: {
    fontSize: 13,
    lineHeight: 17.73,
    color: Colors.white70,
  },
  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.foreground,
    opacity: 0.12,
    marginTop: 13,
    marginBottom: 3,
  },
  topicScrollContainer: {
    flexDirection: 'column',
    marginVertical: 12,
  },
  topicRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  topic: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  topicSelected: {
    flexDirection: 'row',
    backgroundColor: Colors.baseWhite,
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  topicIcon: {
    width: 16,
    height: 16,
    color: Colors.foreground,
    marginRight: 8,
  },
  topicIconSelected: {
    width: 16,
    height: 16,
    color: '#181924',
    marginRight: 8,
  },
  topicLabel: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
  topicLabelSelected: {
    color: '#181924',
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default PollFilter;
