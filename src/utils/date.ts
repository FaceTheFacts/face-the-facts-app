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
  // defaultLogo still missing
  return require('../../assets/logo/weltLogo.png');
}
