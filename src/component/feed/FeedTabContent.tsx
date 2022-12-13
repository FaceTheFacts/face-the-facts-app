import React from 'react';
import {PollTab, Row, SideJobTab, SpeechTab, Tab} from '../../logic/api';
import {PollFeedContent} from '../poll/PollFeedContent';
import {SideJobFeedContent} from '../sidejob/SideJobFeedContent';
import {SpeechFeedContent} from '../speech/SpeechFeedContent';
import FeedRow from './FeedRow';

interface TabContentProps {
  index: number;
  tab: Tab<Row>;
}

const FeedTabContent = ({index, tab}: TabContentProps) => {
  return (
    <>
      {tab.type === 'poll' && (
        <FeedRow key={index} politicians={tab.content.politicians}>
          <PollFeedContent poll={tab.content as PollTab} />
        </FeedRow>
      )}
      {tab.type === 'sideJob' && (
        <FeedRow key={index} politicians={tab.content.politicians}>
          <SideJobFeedContent sideJob={tab.content as SideJobTab} />
        </FeedRow>
      )}
      {tab.type === 'speech' && (
        <FeedRow key={index} politicians={tab.content.politicians}>
          <SpeechFeedContent speech={tab.content as SpeechTab} />
        </FeedRow>
      )}
    </>
  );
};

export default FeedTabContent;
