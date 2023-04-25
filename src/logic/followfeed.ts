import {UseQueryResult} from 'react-query';
import {
  ApiPoliticianProfile,
  ApiSpeech,
  ApiSpeeches,
  PoliticianInfo,
  PollTab,
  Row,
  SideJobTab,
  SpeechTab,
  Tab,
} from './api';

export function processSideJobs(
  profile: ApiPoliticianProfile,
  politician: PoliticianInfo,
) {
  const sideJobTabs: Tab<SideJobTab>[] = [];

  profile.sidejobs.forEach(sideJob => {
    const sideJobTab = {
      politicians: [politician],
      ...sideJob,
    };
    sideJobTabs.push({
      type: 'sideJob',
      content: sideJobTab,
    });
  });
  return sideJobTabs;
}

export function processPolls(
  profile: ApiPoliticianProfile,
  politician: PoliticianInfo,
) {
  const pollsMap: Map<number, Tab<PollTab>> = new Map();
  const pollTabs: Tab<PollTab>[] = [];
  const pollsInVote = new Set();

  profile.votes_and_polls.forEach(voteAndPoll => {
    pollsInVote.add(voteAndPoll.Vote.poll_id);
  });

  profile.votes_and_polls.forEach(voteAndPoll => {
    const pollId = voteAndPoll.Poll.id;
    if (pollsInVote.has(pollId)) {
      const poll = pollsMap.get(pollId) ?? {
        type: 'poll',
        content: {
          ...voteAndPoll,
          created: voteAndPoll.Poll.field_poll_date,
          politicians: [],
        },
      };
      poll.content.politicians.push({
        ...politician,
        vote: voteAndPoll.Vote.vote,
      });
      pollsMap.set(pollId, poll);
    }
  });
  pollTabs.push(...pollsMap.values());

  return pollTabs;
}

export function processSpeeches(
  speechQueries: UseQueryResult<ApiSpeeches | undefined, unknown>[],
  profilesMap: Map<number, ApiPoliticianProfile>,
) {
  const speechTabs: Tab<SpeechTab>[] = [];
  speechQueries.forEach(query => {
    if (query.data) {
      const speeches: ApiSpeech[] = query.data.items;
      speeches?.forEach(speech => {
        const title = speech.title;
        const profile = profilesMap.get(Number(query.data?.politician_id))!;
        const politician = {
          id: profile.id,
          label: profile.label,
          party: profile.party,
        };

        const speechTab: Tab<SpeechTab> = {
          type: 'speech',
          content: {
            politicians: [politician],
            videoFileURI: speech.videoFileURI,
            title,
            created: speech.date,
          },
        };
        speechTabs.push(speechTab);
      });
    }
  });
  return speechTabs;
}

export function processPoliticianQueries(
  politicianQueries: UseQueryResult<
    ApiPoliticianProfile | undefined,
    unknown
  >[],
  profilesMap: Map<number, ApiPoliticianProfile>,
  showSideJobs: boolean,
  showPolls: boolean,
) {
  const allTabs: Tab<Row>[] = [];

  politicianQueries.forEach(query => {
    if (query.data) {
      const profile: ApiPoliticianProfile = query.data;
      profilesMap.set(profile.id, profile);
      const politician: PoliticianInfo = {
        id: profile.id,
        label: profile.label,
        party: profile.party,
      };
      if (showSideJobs) {
        const sideJobTabs = processSideJobs(profile, politician);
        allTabs.push(...sideJobTabs);
      }
      if (showPolls) {
        const pollTabs = processPolls(profile, politician);
        allTabs.push(...pollTabs);
      }
    }
  });
  return allTabs;
}

export function sortTabsByDate(tabs: Tab<Row>[]) {
  return tabs.sort(
    (a, b) =>
      new Date(b.content.created).getTime() -
      new Date(a.content.created).getTime(),
  );
}

export function groupTabsByMonth(tabs: Tab<Row>[]) {
  const groupedTabs = tabs.reduce((acc, tab) => {
    const date = new Date(tab.content.created);
    const month = date.getMonth();
    if (!acc[month]) {
      acc[month] = {
        title: `${month + 1}/${date.getFullYear()}`,
        data: [],
      };
    }
    acc[month].data.push(tab);
    return acc;
  }, {} as {[month: number]: {title: string; data: Tab<Row>[]}});

  return Object.values(groupedTabs).reverse();
}
