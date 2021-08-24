import React, {useContext, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Colors} from '../../theme';
import {DataContext} from '../../logic/model';
import PollCard from './PollCard';
import {Politician} from '../../logic/data';
import Icon from '../Icon';
import Wrap from '../utils/Wrap';

export interface PollsViewProps {
  politician: Politician;
}

const PollsView = ({politician}: PollsViewProps) => {
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
    <ScrollView style={styles.container}>
      <Text style={styles.subtitle}>nach Themen filtern</Text>
      <ScrollView horizontal style={{}}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginVertical: 16,
    overflow: 'visible',
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
  },
  showMoreText: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default PollsView;
