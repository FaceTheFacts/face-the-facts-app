import {
  averageDonations,
  checkPreviousMonth,
  formatDate,
  formatMonth,
  getChartData,
  getFractionStyle,
  getLogoPath,
  getPosition,
  getSumUpDonationsInMillion,
  getWidth,
  round,
} from './util';

// Testing the formatDate function
it('given a date in the format YYYY-MM-DD, formatDate returns in format DD.MM.YYYY', () => {
  expect(formatDate('2000-10-20')).toBe('20.10.2000');
});

// Testing the formatMonth function
it('given a date in the format YYYY-MM-DD, formatMonth returns the German name of the month', () => {
  expect(formatMonth('2000-10-20')).toBe('Oktober');
});

// Testing the checkPreviousMonth function
it('given two dates in the format YYYY-MM-DD, checkPreviousMonth returns false if both dates have the same month', () => {
  expect(checkPreviousMonth('2000-10-20', '2000-10-20')).toBe(false);
});

it('given two dates in the format YYYY-MM-DD, checkPreviousMonth returns true if both dates have different months', () => {
  expect(checkPreviousMonth('2000-11-20', '2000-10-20')).toBe(true);
});

// Testing the getLogoPath function
it('given a logo name, getLogoPath returns the path to the logo', () => {
  expect(getLogoPath('spon')).toStrictEqual({
    testUri: '../../../assets/logo/spiegelLogo.png',
  });
});

// Testing the getChartData function
it('given empty chart data, getChartData returns [1, 1, 1, 1]', () => {
  expect(getChartData()).toEqual(expect.arrayContaining([1, 1, 1, 1]));
});

// Testing the getWidth function
it('given a screenWidth, a testFraction total yes votes and the vote of the entire testFraction, getWidth returns the width of the vote bar', () => {
  const testFraction = {
    id: 0,
    full_name: 'Test Fraction',
    short_name: 'test',
    label: 'Test Fraction',
  };
  const screenWidth = 100 + 122;
  const testParty_total_yes = 1;
  const partyVote = {
    id: 0,
    poll_id: 0,
    fraction: testFraction,
    total_yes: 1,
    total_no: 1,
    total_abstain: 1,
    total_no_show: 1,
  };

  expect(getWidth(screenWidth, testParty_total_yes, partyVote)).toBe(25);
});

// Testing the getFractionStyle Position function
it('given an unknown party fraction, getFractionStyle returns the default fraction style', () => {
  expect(getFractionStyle('test')).toStrictEqual({
    id: 25,
    display_name: 'Sonst',
    foreground_color: '#FFFFFF',
    background_color: '#5D6265',
  });
});

// Testing the getPosition function
it('given a position, getPosition returns the position statement', () => {
  expect(getPosition('agree')).toBe('Kandidat:in stimmt zu');
  expect(getPosition('disagree')).toBe('Kandidat:in stimmt nicht zu');
  expect(getPosition('neutral')).toBe('Kandidat:in sieht es neutral');
});

// Testing the averageDonations function
it('given the sum of donations and the years of donations, averageDonations returns the average donation in the format XX.XXX with out decimal', () => {
  expect(averageDonations(100000, 2)).toBe('50.000');
  expect(averageDonations(100000, 3)).toBe('33.333');
});

// Testing the round function
it('given a number and decimal, round returns the number rounded to the decimal', () => {
  expect(round(1.234, 2)).toBe(1.23);
  expect(round(1.235, 2)).toBe(1.24);
  expect(round(1.234, 0)).toBe(1);
});

// Testing the getSumUpDonationsInMillion function
it('given the sum of donations, getSumUpDonationsInMillion returns the rounded sum of donations in million', () => {
  expect(getSumUpDonationsInMillion(10000)).toBe(0.01);
  expect(getSumUpDonationsInMillion(100000)).toBe(0.1);
  expect(getSumUpDonationsInMillion(1000000)).toBe(1);
  expect(getSumUpDonationsInMillion(10000000)).toBe(10);
  expect(getSumUpDonationsInMillion(10000000.65)).toBe(10);
});
