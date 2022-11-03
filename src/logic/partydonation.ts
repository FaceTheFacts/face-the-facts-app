// Party Donation related util functions

import {monthMap} from '../utils/util';
import {
  ApiPartyDonationDetails,
  GroupedPartyDonations,
  PartyDonation,
} from './api';

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

export function groupByMonth(donations: PartyDonation[]) {
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

export function sortByDate(donations: PartyDonation[]) {
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
export function groupAndSortDonations(
  donations: ApiPartyDonationDetails,
  selection: number,
) {
  const start = performance.now();
  let allDonations: PartyDonation[] = [];

  for (const partyId in donations) {
    // selection 0 = all donations
    if (selection < 1) {
      allDonations = allDonations.concat(
        donations[partyId].donations_older_than_8_years,
      );
    }
    // selection 1 = donations less than 8 years old
    if (selection < 2) {
      allDonations = allDonations.concat(
        donations[partyId].donations_4_to_8_years_old,
      );
    }
    // selection 2 donations lett than 4 years old
    if (selection < 3) {
      allDonations = allDonations.concat(
        donations[partyId].donations_less_than_4_years_old,
      );
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
  for (const partyId in donations) {
    if (selection < 1) {
      allDonations = allDonations.concat(
        donations[partyId].donations_older_than_8_years,
      );
    }
    // selection 1 = donations less than 8 years old
    if (selection < 2) {
      allDonations = allDonations.concat(
        donations[partyId].donations_older_than_8_years,
      );
    }
    // selection 2 donations less than 4 years old
    if (selection < 3) {
      allDonations = allDonations.concat(
        donations[partyId].donations_less_than_4_years_old,
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

export function getDonationAveragePerYear(
  donations: ApiPartyDonationDetails,
  selection: number,
) {
  const start = performance.now();
  let allDonations: PartyDonation[] = [];
  let year: number = 1;
  for (const key in donations) {
    if (selection < 1) {
    }
    // selection 1 = donations less than 8 years old
    if (selection < 2) {
    }
    // selection 2 donations lett than 4 years old
    if (selection < 3) {
      year = 4;
      allDonations = allDonations.concat(
        donations[key].donations_less_than_4_years_old,
      );
    }
  }
  const sum = allDonations.reduce((acc, donation) => {
    return acc + donation.amount;
  }, 0);
  const average = averageDonations(sum, year);
  const end = performance.now();
  console.log('getDonationAveragePerYear', end - start);
  return average;
}

export function getAverageDonation(
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
  const average = Math.floor(sum / allDonations.length);
  const end = performance.now();
  console.log('getAverageDonation', end - start);
  return average.toLocaleString('de-DE');
}

export function getSumOfEachOrg(donations: PartyDonation[]) {
  const start = performance.now();
  const grouped = donations.reduce((acc, donation) => {
    const key = donation.party_donation_organization.id;
    if (!acc[key]) {
      acc[key] = {
        organization: donation.party_donation_organization,
        sum: 0,
      };
    }
    acc[key].sum += donation.amount;
    return acc;
  }, {} as Record<string, any>);
  const sorted = Object.values(grouped).sort((a, b) => {
    return b.sum - a.sum;
  });
  const end = performance.now();
  console.log('getSumOfEachOrg', end - start);
  return sorted[0];
}

export function getLargestDonor(
  donations: ApiPartyDonationDetails,
  selection: number,
) {
  // start timer
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
  const largestDonor = getSumOfEachOrg(allDonations);
  // end timer
  const end = performance.now();
  console.log('getLargestDonor', end - start);
  return (
    largestDonor.organization.donor_name +
    ' mit ' +
    round(largestDonor.sum / 1000000, 2) +
    ' Mio €'
  );
}
