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
} from '../icons';
import {
  ApiPartyDonationDetails,
  ApiPartyStyle,
  ApiPollResult,
  GroupedPartyDonations,
  PartyDonation,
  PartyDonationWithPartyStyle,
  PositionAnswer,
  TopicIcon,
} from '../logic/api';

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
  previousDate: string | undefined,
  currentDate: string,
): boolean {
  if (!previousDate) {
    return false;
  }
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
  'zeit-online': require('../../assets/logo/zeitLogo.png'),
  sueddeutsche: require('../../assets/logo/sueddeutscheLogo.png'),
  tagesschau: require('../../assets/logo/tagesschauLogo.png'),
};

export function getLogoPath(source: string): any {
  if (source in logoPathMap) {
    return logoPathMap[source];
  }
  return require('../../assets/logo/placeHolderNewsTag.png');
}

const minimumWidth = 7;

export function getWidth(
  width: number,
  voteNumber: number,
  partyVote: ApiPollResult,
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
  if (yesWidth > 0 && yesWidth < minimumWidth) {
    smallWidthArray.push(yesWidth);
  }
  if (noWidth > 0 && noWidth < minimumWidth) {
    smallWidthArray.push(noWidth);
  }
  if (abstainWidth > 0 && abstainWidth < minimumWidth) {
    smallWidthArray.push(abstainWidth);
  }
  if (noShowWidth > 0 && noShowWidth < minimumWidth) {
    smallWidthArray.push(noShowWidth);
  }
  let difference = 0;
  const n = smallWidthArray.length;
  for (let i = 0; i < n; i++) {
    difference = difference + minimumWidth - smallWidthArray[i];
  }

  const partialDifference = difference / (4 - n);
  if (n > 0) {
    const result = containerWidth * (voteNumber / total) - partialDifference;
    return result;
  }

  return containerWidth * (voteNumber / total);
}

export function getChartData(partyVotes?: ApiPollResult[]) {
  let yes = 0;
  let no = 0;
  let abstain = 0;
  let noShow = 0;
  if (partyVotes) {
    partyVotes.forEach(partyVote => {
      yes += partyVote.total_yes;
      no += partyVote.total_no;
      abstain += partyVote.total_abstain;
      noShow += partyVote.total_no_show;
    });
    return [yes, no, abstain, noShow];
  }
  // returning 0 breaks react-native-pie-chart
  return [1, 1, 1, 1];
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
  'BÜNDNIS 90/DIE GRÜNEN': {
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
    background_color: '#0057A1',
    border_color: '#FEE205',
  },
  'CDU/CSU (EVP)': {
    id: 39,
    display_name: 'EVP',
    foreground_color: '#FFFFFF',
    background_color: '#0057A1',
    border_color: '#FEE205',
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
  'DIE GRÜNEN/PIRATEN/ÖDP (Grüne/EFA)': {
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
  'DIE LINKE (GUE/NGL)': {
    id: 34,
    display_name: 'Linke',
    foreground_color: '#FFFFFF',
    background_color: '#76232F',
  },
  'FDP/FREIE WÄHLER (ALDE)': {
    id: 4,
    display_name: 'ALDE',
    foreground_color: '#181924',
    background_color: '#FFE06D',
  },
  'AfD (EFDD)': {
    id: 9,
    display_name: 'EFDD',
    foreground_color: '#FFFFFF',
    background_color: '#01A5B5',
  },
  'AfD (ENF)': {
    id: 9,
    display_name: 'ENF',
    foreground_color: '#FFFFFF',
    background_color: '#016FB8',
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
  'SPD (S&D)': {
    id: 1,
    display_name: 'S&D',
    foreground_color: '#FFFFFF',
    background_color: '#E74343',
  },
  'ALFA/FAMILIEN-PARTEI (EKR)': {
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

export const topicTypes: Record<number, TopicIcon> = {
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

export const topicTypesArr = [
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

export const answerLongLabels: Record<PositionAnswer, string> = {
  agree: 'Kandidat:in stimmt zu',
  disagree: 'Kandidat:in stimmt nicht zu',
  neutral: 'Kandidat:in sieht es neutral',
};

export const answerShortLabels: Record<PositionAnswer, string> = {
  agree: 'Ja',
  disagree: 'Nein',
  neutral: 'Neutral',
};

export const answerColors: Record<PositionAnswer, string> = {
  agree: '#45C66F',
  disagree: '#E54A6F',
  neutral: '#2695F5',
};

export function getPosition(position: PositionAnswer) {
  return answerLongLabels[position];
}

// Party Donation related util functions

export function averageDonations(donations_sum: number, years: number) {
  const average = Math.floor(donations_sum / years);
  return average.toLocaleString('de-DE');
}

export function round(value: number, decimals: number) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

export function getSumUpDonationsInMillion(donations_sum: number) {
  return round(donations_sum / 1000000, 2);
}

export function groupByMonth(donations: PartyDonationWithPartyStyle[]) {
  const start = performance.now();
  const grouped = donations.reduce((acc, donation) => {
    const month = donation.date.slice(5, 7);
    const year = donation.date.slice(0, 4);
    const key = `${year}-${month}`;
    if (!acc[key]) {
      acc[key] = {
        month: monthMap[month],
        sum: 0,
        sorted_donations: [],
      };
    }
    acc[key].sorted_donations.push(donation);
    acc[key].sum += donation.amount;
    return acc;
  }, {} as Record<string, GroupedPartyDonations>);
  const end = performance.now();
  console.log('grouped', end - start);
  return Object.values(grouped);
}

export function groupByMonth(donations: PartyDonationWithPartyStyle[]) {
  const start = performance.now();
  const grouped = donations.reduce((acc, donation) => {
    const month = donation.date.slice(5, 7);
    const year = donation.date.slice(0, 4);
    const key = `${year}-${month}`;
    if (!acc[key]) {
      acc[key] = {
        month: monthMap[month],
        sum: 0,
        sorted_donations: [],
      };
    }
    acc[key].sorted_donations.push(donation);
    acc[key].sum += donation.amount;
    return acc;
  }, {} as Record<string, GroupedPartyDonations>);
  const end = performance.now();
  console.log('grouped', end - start);
  return Object.values(grouped);
}

export function sortByDate(donations: PartyDonationWithPartyStyle[]) {
  const start = performance.now();
  const sorted = donations.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  const end = performance.now();
  console.log('sorted', end - start);
  return sorted;
}

export function appendPartyStyleToDonation(
  party_style: ApiPartyStyle,
  donations: PartyDonation[],
) {
  const start = performance.now();
  const donationWithPartyStyle: PartyDonationWithPartyStyle[] = donations.map(
    donation => {
      return {
        ...donation,
        party_style,
      };
    },
  );
  const end = performance.now();
  console.log('appendPartyStyleToDonation', end - start);
  return donationWithPartyStyle;
}
export function groupAndSortDonations(
  donations: ApiPartyDonationDetails,
  selection: number,
) {
  const start = performance.now();
  let allDonations: PartyDonationWithPartyStyle[] = [];

  for (const party in donations) {
    // selection 0 = all donations
    if (selection < 1) {
    }
    // selection 1 = donations less than 8 years old
    if (selection < 2) {
    }
    // selection 2 donations lett than 4 years old
    if (selection < 3) {
      let donationWithPartyStyle: PartyDonationWithPartyStyle[] =
        appendPartyStyleToDonation(
          donations[party].party_style,
          donations[party].donations_less_than_4_years_old,
        );
      allDonations = allDonations.concat(donationWithPartyStyle);
    }
  }
  allDonations = sortByDate(allDonations);
  const groupedDonations = groupByMonth(allDonations);
  const end = performance.now();
  console.log('groupAndSortDonations took ' + (end - start) + ' seconds.');
  return groupedDonations;
}

export function getDonationsSum(
  donations: ApiPartyDonationDetails,
  selection: number,
) {
  const start = performance.now();
  let allDonations: PartyDonation[] = [];
  for (const key in donations) {
    if (selection < 1) {
    }
    // selection 1 = donations less than 8 years old
    if (selection < 2) {
    }
    // selection 2 donations lett than 4 years old
    if (selection < 3) {
      allDonations = allDonations.concat(
        donations[key].donations_less_than_4_years_old,
      );
    }
  }
  const sum = allDonations.reduce((acc, donation) => {
    return acc + donation.amount;
  }, 0);
  const end = performance.now();
  console.log('getDonationsSum', end - start);
  return round(sum, 0).toLocaleString('de-DE');
}
