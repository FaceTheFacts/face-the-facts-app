import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Colors} from '../../theme';
import SpeechCard from './SpeechCard';
import SideJobCard from './SideJobCard';

const MOCK_SPEECH = {
  politicianId: '119742',
  desc: 'Änderung des Infektionsschutzgesetzes; Einschränkung von Grundrechten',
  date: '27.09.2022',
};

const MOCK_SIDEJOB = {
  politicianId: '145862',
  date: '27.09.2021',
  desc: 'Mitglied des Verwaltungsrates, ehrenamtlich',
  organization: 'Sparkasse Uecker-Randow',
  income: '7.000 bis 15.000€',
};

const speeches = new Array(3).fill(MOCK_SPEECH);
const sideJobs = new Array(3).fill(MOCK_SIDEJOB);

const ParliamentFeed = () => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Reden</Text>
          <TouchableOpacity style={styles.moreBtn}>
            <Text style={styles.btnText}>mehr</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal style={styles.scrollContainer}>
          {speeches.map((speech, index) => (
            <SpeechCard
              key={index}
              politicianId={speech.politicianId}
              desc={speech.desc}
              date={speech.date}
            />
          ))}
        </ScrollView>
      </View>
      <View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Nebentätigkeiten</Text>
          <TouchableOpacity style={styles.moreBtn}>
            <Text style={styles.btnText}>mehr</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal style={styles.scrollContainer}>
          {sideJobs.map((sideJob, index) => (
            <SideJobCard
              key={index}
              politicianId={sideJob.politicianId}
              desc={sideJob.desc}
              date={sideJob.date}
              income={sideJob.income}
              organization={sideJob.organization}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.baseWhite,
  },
  moreBtn: {
    borderColor: Colors.white40,
    borderWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    // borderColor: 'red',
    // borderWidth: 1,
  },
});

export default ParliamentFeed;
