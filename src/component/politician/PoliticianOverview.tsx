import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {NavigationContext, useFocusEffect} from '@react-navigation/native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';
import {DataContext} from '../../logic/model';
import Icon from '../Icon';
import Wrap from '../utils/Wrap';
import PollCard from '../poll/PollCard';
import SpeechCard from '../speech/SpeechCard';
import NewsCard from '../news/NewsCard';
import {formatDate, topicTypes} from '../../utils/util';
import SideJobCard from '../SideJobCard';

interface PoliticianOverviewProps {
  toSideJobs?: boolean;
}

const PoliticianOverview: React.FC<PoliticianOverviewProps> = ({
  toSideJobs,
}) => {
  const politician = useContext(PoliticianContext);
  const navigator = useContext<any>(NavigationContext)!;
  const ref = useRef<ScrollView>(null);
  const {width} = useWindowDimensions();
  const [scrollY, setScrollY] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (toSideJobs) {
        ref.current?.scrollTo({y: scrollY});
      }
    }, [scrollY, toSideJobs]),
  );

  return (
    <ScrollView
      ref={ref}
      style={styles.containerWrapper}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {politician?.profile?.topic_ids_of_latest_committee &&
          politician.profile.topic_ids_of_latest_committee.length > 0 && (
            <>
              <Text style={styles.subtitleFocus}>Politische Schwerpunkte</Text>
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
                        <Text style={styles.committeeLabel}>
                          {topic?.label}
                        </Text>
                      </View>
                    );
                  },
                )}
              </Wrap>
            </>
          )}
        {politician?.profile && politician.profile.votes_and_polls.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.pollsHeader}
              onPress={() => {
                navigator.push('Polls', {politician});
              }}>
              <Text style={styles.pollsTitle}>Abstimmungen</Text>
              {politician?.profile &&
                politician.profile.votes_and_polls.length > 5 && (
                  <Text style={styles.moreButton}>mehr</Text>
                )}
            </TouchableOpacity>
            <ScrollView
              style={styles.pollContainer}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {politician?.profile?.votes_and_polls.map(poll => (
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
                  politician={politician.profile}
                />
              ))}
            </ScrollView>
          </>
        )}
        {politician?.news && politician.news.items.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.pollsHeader}
              onPress={() => {
                navigator.push('News', {
                  politician,
                });
              }}>
              <Text style={styles.pollsTitle}>Artikel</Text>
              {politician?.news && politician.news.items.length > 5 && (
                <Text style={styles.moreButton}>mehr</Text>
              )}
            </TouchableOpacity>
            <ScrollView
              style={styles.pollContainer}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {politician?.news?.items.map((news, index) => (
                <NewsCard
                  key={index}
                  title={news.title}
                  image={news.images}
                  date={formatDate(news.published)}
                  url={news.url}
                  source={news.source}
                />
              ))}
            </ScrollView>
          </>
        )}
        {politician?.speeches && politician.speeches.items.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.pollsHeader}
              onPress={() => {
                navigator.push('Speeches', {
                  politician,
                });
              }}>
              <Text style={styles.pollsTitle}>Reden</Text>
              {politician?.speeches && !politician.speeches.is_last_page && (
                <Text style={styles.moreButton}>mehr</Text>
              )}
            </TouchableOpacity>
            <ScrollView
              style={styles.pollContainer}
              horizontal
              showsHorizontalScrollIndicator={false}>
              {politician?.speeches?.items.slice(0, 5).map((speech, index) => (
                <SpeechCard
                  key={index}
                  politicianName={politician.profile?.label!}
                  title={speech.title}
                  date={formatDate(speech.date)}
                  video={speech.videoFileURI}
                  cardHeight={103}
                  cardWidth={width * 0.71}
                />
              ))}
            </ScrollView>
          </>
        )}
        {politician?.profile?.sidejobs &&
          politician.profile.sidejobs.length > 0 && (
            <View onLayout={e => setScrollY(e.nativeEvent.layout.y)}>
              <Text style={styles.subtitleFocus}>Nebentätigkeiten</Text>
              {politician?.profile?.sidejobs.map((sidejob, index) => (
                <SideJobCard
                  key={index}
                  date={sidejob.created}
                  label={sidejob.label}
                  organization={sidejob.sidejob_organization.label}
                  income={sidejob.income_level}
                />
              ))}
            </View>
          )}
      </View>
      <BottomSheet modalRef={pollsModal} modalTopOffset={60}>
        <PollsView politician={politician} />
      </BottomSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    marginBottom: 32,
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
    alignItems: 'center',
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
});

export default PoliticianOverview;
