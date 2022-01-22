import {ApiPartyStyle, ApiPollDetail} from '../logic/api';

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function distinct<T>(
  items: T[],
  idGetter: (item: T) => string | number | symbol,
): void {
  const visitedIds = new Set<string | number | symbol>();

  for (let i = 0; i < items.length; i++) {
    const id = idGetter(items[i]);
    if (visitedIds.has(id)) {
      items.splice(i, 1);
      i--;
    } else {
      visitedIds.add(id);
    }
  }
}

export function* groupByDate<E, R>(
  items: E[],
  idGetter: (item: E) => string | number | symbol,
  dateGetter: (item: E) => Date,
  sectionBuilder: (label: string, items: E[]) => R,
): Generator<R> {
  const todayItems: E[] = [];
  const yesterdayItems: E[] = [];
  const lastWeekItems: E[] = [];
  const longerAgoItems: E[] = [];

  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
  const lastWeek = today.getTime() - 1000 * 60 * 60 * 24 * 7;

  for (const item of items) {
    const date = dateGetter(item);

    if (sameDay(date, today)) {
      todayItems.push(item);
    } else if (sameDay(date, yesterday)) {
      yesterdayItems.push(item);
    } else if (date.getTime() >= lastWeek) {
      lastWeekItems.push(item);
    } else {
      longerAgoItems.push(item);
    }
  }

  const compareFunction = (a: E, b: E) =>
    dateGetter(b).getTime() - dateGetter(a).getTime();

  if (todayItems.length) {
    distinct(todayItems, idGetter);
    yield sectionBuilder('Heute', todayItems.sort(compareFunction));
  }

  if (yesterdayItems.length) {
    distinct(yesterdayItems, idGetter);
    yield sectionBuilder('Gestern', yesterdayItems.sort(compareFunction));
  }

  if (lastWeekItems.length) {
    distinct(lastWeekItems, idGetter);
    yield sectionBuilder('Letzte Woche', lastWeekItems.sort(compareFunction));
  }

  if (longerAgoItems.length) {
    distinct(longerAgoItems, idGetter);
    yield sectionBuilder('Kürzlich', longerAgoItems.sort(compareFunction));
  }
}

export function formatDate(date: string): string {
  const [year, month, day] = date.slice(0, 10).split('-');
  const formattedDate = `${day}.${month}.${year}`;
  return formattedDate;
}

const monthMap: Record<string, string> = {
  '01': 'Januar',
  '02': 'Februar',
  '03': 'März',
  '04': 'April',
  '05': 'Mai',
  '06': 'Juni',
  '07': 'Juli',
  '08': 'August',
  '09': 'September',
  '10': 'Oktober',
  '11': 'November',
  '12': 'Dezember',
};

export function formatMonth(date: string): string {
  const month = date.slice(5, 7);
  return monthMap[month];
}

export function checkPreviousMonth(
  previousDate: string,
  currentDate: string,
): boolean {
  const currentMonth = currentDate.slice(5, 7);
  const previousMonth = previousDate.slice(5, 7);
  return currentMonth !== previousMonth;
}

const logoPathMap: Record<string, any> = {
  spon: require('../../assets/logo/spiegelLogo.png'),
  welt: require('../../assets/logo/weltLogo.png'),
  bild: require('../../assets/logo/bildLogo.png'),
  faz: require('../../assets/logo/fazLogo.png'),
  taz: require('../../assets/logo/tazLogo.png'),
  zeit: require('../../assets/logo/zeitLogo.png'),
  sueddeutsche: require('../../assets/logo/sueddeutscheLogo.png'),
  tagesschau: require('../../assets/logo/tagesschauLogo.png'),
};

export function getLogoPath(source: string): any {
  if (source in logoPathMap) {
    return logoPathMap[source];
  }
  return require('../../assets/logo/placeHolderNewsTag.png');
}

export function getWidth(
  width: number,
  voteNumber: number,
  partyVote: ApiPollDetail,
) {
  const total =
    partyVote.total_yes +
    partyVote.total_no +
    partyVote.total_abstain +
    partyVote.total_no_show;
  const containerWidth = width - 122;
  const yesWidth = (containerWidth * partyVote.total_yes) / total;
  const noWidth = (containerWidth * partyVote.total_no) / total;
  const abstainWidth = (containerWidth * partyVote.total_abstain) / total;
  const noShowWidth = (containerWidth * partyVote.total_no_show) / total;
  let smallWidthArray: Array<number> = [];
  if (yesWidth > 0 && yesWidth < 7) {
    smallWidthArray.push(yesWidth);
  }
  if (noWidth > 0 && noWidth < 7) {
    smallWidthArray.push(noWidth);
  }
  if (abstainWidth > 0 && abstainWidth < 7) {
    smallWidthArray.push(abstainWidth);
  }
  if (noShowWidth > 0 && noShowWidth < 7) {
    smallWidthArray.push(noShowWidth);
  }
  let difference = 0;
  const n = smallWidthArray.length;
  for (let i = 0; i < n; i++) {
    difference = difference + 7 - smallWidthArray[i];
  }

  const partialDifference = difference / (4 - n);
  if (n > 0) {
    const result = containerWidth * (voteNumber / total) - partialDifference;
    return result;
  }

  //console.log(containerWidth * (voteNumber / total));
  return containerWidth * (voteNumber / total);
}

export function getChartData(partyVotes: ApiPollDetail[] | undefined) {
  let total = 0;
  let yes = 0;
  let no = 0;
  let abstain = 0;
  let noShow = 0;
  if (partyVotes !== undefined) {
    partyVotes.map(partyVote => {
      console.log(partyVote);
      total +=
        partyVote.total_yes +
        partyVote.total_no +
        partyVote.total_abstain +
        partyVote.total_no_show;
      yes += partyVote.total_yes;
      no += partyVote.total_no;
      abstain += partyVote.total_abstain;
      noShow += partyVote.total_no_show;
    });
    return [total, yes, no, abstain, noShow];
  }
  // returning 0 breaks react-native-pie-chart
  return [4, 1, 1, 1, 1];
}

const fractionStyleMap: Record<string, ApiPartyStyle> = {
  FDP: {
    id: 4,
    display_name: 'FDP',
    foreground_color: '#181924',
    background_color: '#FFE06D',
  },
  'FDP/DVP': {
    id: 4,
    display_name: 'FDP',
    foreground_color: '#181924',
    background_color: '#FFE06D',
  },
  SPD: {
    id: 1,
    display_name: 'SPD',
    foreground_color: '#FFFFFF',
    background_color: '#E74343',
  },
  'CDU/CSU': {
    id: 2,
    display_name: 'Union',
    foreground_color: '#FFFFFF',
    background_color: '#5D6265',
  },
  CDU: {
    id: 21,
    display_name: 'CDU',
    foreground_color: '#FFFFFF',
    background_color: '#5D6265',
  },
  CSU: {
    id: 22,
    display_name: 'CSU',
    foreground_color: '#FFFFFF',
    background_color: '#0D6CB4',
    border_color: '#F8F8F8',
  },
  'DIE GRÜNEN': {
    id: 5,
    display_name: 'Grüne',
    foreground_color: '#FFFFFF',
    background_color: '#40A962',
  },
  'DIE LINKE': {
    id: 8,
    display_name: 'Linke',
    foreground_color: '#FFFFFF',
    background_color: '#CD3E72',
  },
  AfD: {
    id: 9,
    display_name: 'AfD',
    foreground_color: '#FFFFFF',
    background_color: '#3AA6F4',
  },
  'BVB - Freie Wähler': {
    id: 7,
    display_name: 'FW',
    foreground_color: '#2F5997',
    background_color: '#F8F8F8',
    border_color: '#FD820B',
  },
  EVP: {
    id: 39,
    display_name: 'EVP',
    foreground_color: '#FFFFFF',
    background_color: '#3AA6F4',
  },
  'S&D': {
    id: 31,
    display_name: 'S&D',
    foreground_color: '#FFFFFF',
    background_color: '#E74343',
  },
  'Grüne/EFA': {
    id: 35,
    display_name: 'Grüne',
    foreground_color: '#FFFFFF',
    background_color: '#40A962',
  },
  'GUE/NGL': {
    id: 34,
    display_name: 'Linke',
    foreground_color: '#FFFFFF',
    background_color: '#76232F',
  },
  ID: {
    id: 39,
    display_name: 'ID',
    foreground_color: '#FFFFFF',
    background_color: '#055DA3',
  },
  RE: {
    id: 34,
    display_name: 'RE',
    foreground_color: '#181924',
    background_color: '#FFE06D',
  },
  EKR: {
    id: 39,
    display_name: 'EKR',
    foreground_color: '#FFFFFF',
    background_color: '#1382E3',
  },
  fraktionslos: {
    id: 25,
    display_name: 'Sonst',
    foreground_color: '#FFFFFF',
    background_color: '#5D6265',
  },
};

export function getFractionStyle(party: string) {
  return party in fractionStyleMap
    ? fractionStyleMap[party]
    : fractionStyleMap.fraktionslos;
}
