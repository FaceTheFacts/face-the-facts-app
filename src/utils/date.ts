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
