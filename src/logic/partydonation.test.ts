import {
  ApiPartyDonationDetails,
  GroupedPartyDonations,
  PartyDonation,
} from './api';
import {
  averageDonations,
  getAverageDonation,
  getDonationAveragePerYear,
  getDonationsSum,
  getLargestDonor,
  getSumOfEachOrg,
  getSumUpDonationsInMillion,
  groupByMonth,
  round,
  sortByDate,
} from './partydonation';

// Mock data
const partyDonationDetailsData: ApiPartyDonationDetails = {
  '1': {
    donations_older_than_8_years: [
      {
        id: 4,
        party: {
          id: 1,
          label: 'SPD',
          party_style: {
            id: 1,
            display_name: 'SPD',
            foreground_color: '#FFFFFF',
            background_color: '#E95050',
            border_color: undefined,
          },
        },
        amount: 100000,
        date: '2009-01-27',
        party_donation_organization: {
          id: 90,
          donor_name: 'Evonik Industries AG',
          donor_address: 'Rellinghauser Straße 1-11',
          donor_zip: '45128',
          donor_city: 'Essen',
          donor_foreign: false,
        },
      },
      {
        id: 8,
        party: {
          id: 1,
          label: 'SPD',
          party_style: {
            id: 1,
            display_name: 'SPD',
            foreground_color: '#FFFFFF',
            background_color: '#E95050',
            border_color: undefined,
          },
        },
        amount: 151344.56,
        date: '2009-02-20',
        party_donation_organization: {
          id: 168,
          donor_name: 'Bayerische Motoren Werke AG',
          donor_address: 'Petuelring 130',
          donor_zip: '80788',
          donor_city: 'München',
          donor_foreign: false,
        },
      },
    ],
    donations_4_to_8_years_old: [
      {
        id: 151,
        party: {
          id: 1,
          label: 'SPD',
          party_style: {
            id: 1,
            display_name: 'SPD',
            foreground_color: '#FFFFFF',
            background_color: '#E95050',
            border_color: undefined,
          },
        },
        amount: 55000,
        date: '2014-12-18',
        party_donation_organization: {
          id: 116,
          donor_name:
            'Südwestmetall, Verband der Metall- und Elektroindustrie Baden- Württemberg e.V.',
          donor_address: 'Löffelstraße 22-24',
          donor_zip: '70597',
          donor_city: 'Stuttgart',
          donor_foreign: false,
        },
      },
      {
        id: 156,
        party: {
          id: 1,
          label: 'SPD',
          party_style: {
            id: 1,
            display_name: 'SPD',
            foreground_color: '#FFFFFF',
            background_color: '#E95050',
            border_color: undefined,
          },
        },
        amount: 100000,
        date: '2015-05-14',
        party_donation_organization: {
          id: 223,
          donor_name: 'Daimler AG',
          donor_address: 'Mercedesstraße 137',
          donor_zip: '70327',
          donor_city: 'Stuttgart',
          donor_foreign: false,
        },
      },
    ],
    donations_less_than_4_years_old: [
      {
        id: 273,
        party: {
          id: 1,
          label: 'SPD',
          party_style: {
            id: 1,
            display_name: 'SPD',
            foreground_color: '#FFFFFF',
            background_color: '#E95050',
            border_color: undefined,
          },
        },
        amount: 80000,
        date: '2018-11-08',
        party_donation_organization: {
          id: 90,
          donor_name: 'Evonik Industries AG',
          donor_address: 'Rellinghauser Straße 1-11',
          donor_zip: '45128',
          donor_city: 'Essen',
          donor_foreign: false,
        },
      },
      {
        id: 280,
        party: {
          id: 1,
          label: 'SPD',
          party_style: {
            id: 1,
            display_name: 'SPD',
            foreground_color: '#FFFFFF',
            background_color: '#E95050',
            border_color: undefined,
          },
        },
        amount: 50001,
        date: '2018-12-27',
        party_donation_organization: {
          id: 11,
          donor_name:
            'Verband der Bayerischen Metall- und Elektro-Industrie e.V.',
          donor_address: 'Max-Joseph-Straße 5',
          donor_zip: '80333',
          donor_city: 'München',
          donor_foreign: false,
        },
      },
      {
        id: 281,
        party: {
          id: 1,
          label: 'SPD',
          party_style: {
            id: 1,
            display_name: 'SPD',
            foreground_color: '#FFFFFF',
            background_color: '#E95050',
            border_color: undefined,
          },
        },
        amount: 50001,
        date: '2018-12-28',
        party_donation_organization: {
          id: 11,
          donor_name:
            'Verband der Bayerischen Metall- und Elektro-Industrie e.V.',
          donor_address: 'Max-Joseph-Straße 5',
          donor_zip: '80333',
          donor_city: 'München',
          donor_foreign: false,
        },
      },
    ],
  },
};

const sortedSPDPartyDonationsOlderThan8Years: PartyDonation[] = [
  {
    id: 8,
    party: {
      id: 1,
      label: 'SPD',
      party_style: {
        id: 1,
        display_name: 'SPD',
        foreground_color: '#FFFFFF',
        background_color: '#E95050',
        border_color: undefined,
      },
    },
    amount: 151344.56,
    date: '2009-02-20',
    party_donation_organization: {
      id: 168,
      donor_name: 'Bayerische Motoren Werke AG',
      donor_address: 'Petuelring 130',
      donor_zip: '80788',
      donor_city: 'München',
      donor_foreign: false,
    },
  },
  {
    id: 4,
    party: {
      id: 1,
      label: 'SPD',
      party_style: {
        id: 1,
        display_name: 'SPD',
        foreground_color: '#FFFFFF',
        background_color: '#E95050',
        border_color: undefined,
      },
    },
    amount: 100000,
    date: '2009-01-27',
    party_donation_organization: {
      id: 90,
      donor_name: 'Evonik Industries AG',
      donor_address: 'Rellinghauser Straße 1-11',
      donor_zip: '45128',
      donor_city: 'Essen',
      donor_foreign: false,
    },
  },
];

const groupedSPDPartyDonationsOlderThan8Years: GroupedPartyDonations[] = [
  {
    month: 'Februar',
    sum: 151344.56,
    sorted_donations: [
      {
        id: 8,
        party: {
          id: 1,
          label: 'SPD',
          party_style: {
            id: 1,
            display_name: 'SPD',
            foreground_color: '#FFFFFF',
            background_color: '#E95050',
            border_color: undefined,
          },
        },
        amount: 151344.56,
        date: '2009-02-20',
        party_donation_organization: {
          id: 168,
          donor_name: 'Bayerische Motoren Werke AG',
          donor_address: 'Petuelring 130',
          donor_zip: '80788',
          donor_city: 'München',
          donor_foreign: false,
        },
      },
    ],
  },
  {
    month: 'Januar',
    sum: 100000,
    sorted_donations: [
      {
        id: 4,
        party: {
          id: 1,
          label: 'SPD',
          party_style: {
            id: 1,
            display_name: 'SPD',
            foreground_color: '#FFFFFF',
            background_color: '#E95050',
            border_color: undefined,
          },
        },
        amount: 100000,
        date: '2009-01-27',
        party_donation_organization: {
          id: 90,
          donor_name: 'Evonik Industries AG',
          donor_address: 'Rellinghauser Straße 1-11',
          donor_zip: '45128',
          donor_city: 'Essen',
          donor_foreign: false,
        },
      },
    ],
  },
];

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

// Testing the sortByDate function
it('given a list of partydonations, return a list of partydonations sorty by date in ascending order', () => {
  expect(
    sortByDate(partyDonationDetailsData['1'].donations_older_than_8_years),
  ).toEqual(sortedSPDPartyDonationsOlderThan8Years);
});

// Testing the groupByMonth function
it('given a list of partydonations, return a list of partydonations grouped by month', () => {
  expect(
    groupByMonth(partyDonationDetailsData['1'].donations_older_than_8_years),
  ).toEqual(groupedSPDPartyDonationsOlderThan8Years);
});

// Testing for getDonationsSum function
it('given a list of partydonations, return the sum of all donations', () => {
  expect(getDonationsSum(partyDonationDetailsData, 2)).toBe('180.002');
});

// Testing for getDonationAveragePerYear function

it('given a list of partydonations, return the average of all donations per year', () => {
  expect(getDonationAveragePerYear(partyDonationDetailsData, 2)).toBe('45.000');
});

// Testing for getAverageDonation function
it('given a list of partydonations, return the average of all donations', () => {
  expect(getAverageDonation(partyDonationDetailsData, 2)).toBe('60.000');
});

// Testing for getSumOfEachOrg function
it('given a list of partydonations, return the sum of all donations per organization', () => {
  expect(
    getSumOfEachOrg(
      partyDonationDetailsData['1'].donations_less_than_4_years_old,
    ),
  ).toEqual({
    organization: {
      id: 11,
      donor_name: 'Verband der Bayerischen Metall- und Elektro-Industrie e.V.',
      donor_address: 'Max-Joseph-Straße 5',
      donor_zip: '80333',
      donor_city: 'München',
      donor_foreign: false,
    },
    sum: 100002,
  });
});

// Testing for getLargestDonor function
it('given a list of partydonations, return the largest donor', () => {
  expect(getLargestDonor(partyDonationDetailsData, 2)).toEqual(
    'Verband der Bayerischen Metall- und Elektro-Industrie e.V. mit 0.1 Mio €',
  );
});
