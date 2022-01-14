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
  return `${day}.${month}.${year}`;
}

export function formatMonth(date: string): string {
  const month = date.slice(5, 7);
  switch (month) {
    case '01':
      return 'Januar';
    case '02':
      return 'Februar';
    case '03':
      return 'März';
    case '04':
      return 'April';
    case '05':
      return 'Mai';
    case '06':
      return 'Juni';
    case '07':
      return 'Juli';
    case '08':
      return 'August';
    case '09':
      return 'September';
    case '10':
      return 'Oktober';
    case '11':
      return 'November';
    case '12':
      return 'Dezember';
    default:
      return 'Monat';
  }
}

export function checkPreviousMonth(
  previousDate: string,
  currentDate: string,
): boolean {
  const currentMonth = currentDate.slice(5, 7);
  const previousMonth = previousDate.slice(5, 7);
  return currentMonth !== previousMonth;
}

export function getLogoPath(source: string): any {
  switch (source) {
    case 'spon':
      return require('../../assets/logo/spiegelLogo.png');
    case 'welt':
      return require('../../assets/logo/weltLogo.png');
    case 'bild':
      return require('../../assets/logo/bildLogo.png');
    case 'faz':
      return require('../../assets/logo/fazLogo.png');
    case 'taz':
      return require('../../assets/logo/tazLogo.png');
    case 'zeit':
      return require('../../assets/logo/zeitLogo.png');
    case 'sueddeutsche':
      return require('../../assets/logo/sueddeutscheLogo.png');
    default:
      // defaultLogo still missing
      return require('../../assets/logo/weltLogo.png');
  }
}
