import React, {useContext, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {Colors} from '../theme';
import {DataContext} from '../logic/model';
import PollCard from '../component/poll/PollCard';
import {Politician} from '../logic/data';
import Icon from '../component/Icon';
import Wrap from '../component/utils/Wrap';
import BackButton from '../component/BackButton';

export interface PollsViewProps {
  route: RouteProp<{params: {politician: Politician}}, 'params'>;
}

const PollsView = ({route}: PollsViewProps) => {
  const {politician} = route.params;
  const data = useContext(DataContext);
  const [filter, setFilter] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const {width} = useWindowDimensions();

  let visiblePolls = data.polls.filter(poll => poll.id in politician.votes!);

  const [pollTopics] = useState(() =>
    data.pollTopics.filter(topic =>
      visiblePolls.some(poll => poll.topic?.includes(topic.id)),
    ),
  );

  if (filter.length) {
    visiblePolls = visiblePolls.filter(poll =>
      poll.topic?.some(id => filter.includes(id)),
    );
  }

  const collapsed = visiblePolls.length > visibleCount;
  if (collapsed) {
    visiblePolls = visiblePolls.slice(0, visibleCount);
  }

  return (
    <>
      <SafeAreaView style={styles.iosSafeTop} />
      <BackButton />
      <ScrollView style={styles.container}>
        <Text style={styles.subtitle}>nach Themen filtern</Text>
        <ScrollView horizontal style={styles.topicsContainer}>
          <Wrap style={{width: width * 3}} spacing={8}>
            {pollTopics.map(topic => (
              <TouchableOpacity
                key={topic.id}
                style={StyleSheet.flatten([
                  styles.topic,
                  filter.includes(topic.id) && styles.topicSelected,
                ])}
                onPress={() => {
                  setFilter(
                    filter.includes(topic.id)
                      ? filter.filter(value => value !== topic.id)
                      : [...filter, topic.id],
                  );
                  setVisibleCount(20);
                }}>
                <Icon
                  style={StyleSheet.flatten([
                    styles.topicIcon,
                    filter.includes(topic.id) && styles.topicContentSelected,
                  ])}
                  icon={topic.icon}
                />
                <Text
                  style={StyleSheet.flatten([
                    styles.topicLabel,
                    filter.includes(topic.id) && styles.topicContentSelected,
                  ])}>
                  {topic.title}
                </Text>
              </TouchableOpacity>
            ))}
          </Wrap>
        </ScrollView>
        <Text style={styles.subtitle}>Alle Abstimmungen</Text>
        {visiblePolls.map(poll => (
          <PollCard
            key={poll.id}
            style={styles.poll}
            poll={poll}
            candidateVote={politician.votes![poll.id]}
          />
        ))}
        {collapsed && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setVisibleCount(visibleCount + 20)}>
            <Text style={styles.showMoreText}>mehr anzeigen</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <SafeAreaView style={styles.iosSafeBottom} />
    </>
  );
};

const styles = StyleSheet.create({
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  iosSafeBottom: {
    flex: 0,
    backgroundColor: Colors.background,
  },
  container0: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
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
  topicsContainer: {
    overflow: 'visible',
  },
  topic: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
  },
  topicSelected: {
    backgroundColor: Colors.foreground,
  },
  topicIcon: {
    width: 16,
    height: 16,
    color: Colors.foreground,
    marginRight: 8,
  },
  topicLabel: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
  topicContentSelected: {
    color: Colors.cardBackground,
  },
  poll: {
    marginBottom: 8,
  },
  showMoreButton: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  showMoreText: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default PollsView;
