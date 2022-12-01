import {NavigationContext} from '@react-navigation/native';
import React, {useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ApiSidejobsBundestag} from '../../logic/api';
import {DataContext} from '../../logic/model';
import {Colors} from '../../theme';
import SideJobCard from '../SideJobCard';

interface SideJobCarouselProps {
  sidejobs: ApiSidejobsBundestag[];
}

const SideJobCarousel = ({sidejobs}: SideJobCarouselProps) => {
  const database = useContext(DataContext);
  const navigator = useContext(NavigationContext);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Nebentätigkeiten</Text>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => {
            navigator?.navigate('DashboardSidejobs');
          }}>
          <Text style={styles.btnText}>mehr</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContainerContent}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}>
        {sidejobs.map((sidejob, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              database.dbManager.pushHistoryItem(sidejob.politician.id);
              navigator?.navigate('Politician', {
                politicianId: sidejob.politician.id,
                politicianName: sidejob.politician.label,
                party: sidejob.politician.party,
                toSideJobs: true,
              });
            }}>
            <SideJobCard
              politicianId={sidejob.politician.id}
              politicianName={sidejob.politician.label}
              party={sidejob.politician.party}
              label={sidejob.sidejob.label}
              date={sidejob.sidejob.created}
              income={sidejob.sidejob.income_level}
              organization={sidejob.sidejob.sidejob_organization.label}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 4,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginVertical: 12,
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
  },
  scrollContainerContent: {
    paddingRight: 24,
  },
});

export default SideJobCarousel;
