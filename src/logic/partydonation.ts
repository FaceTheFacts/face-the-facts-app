// Party Donation related util functions

import {monthMap} from '../utils/util';
import {
  ApiPartyDonationDetails,
  GroupedPartyDonations,
  PartyDonation,
} from './api';

// Calculation for Card and helper function for Addtitional information
export function averageDonations(donations_sum: number, years: number) {
  const average = Math.floor(donations_sum / years);
  return average.toLocaleString('de-DE');
}

// Formatting used in View and as helper function for List and Additional information
export function round(value: number, decimals: number) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}
// Formatting used in Card
export function getSumUpDonationsInMillion(donations_sum: number) {
  return round(donations_sum / 1000000, 2);
}

// Calculation used as helper function for groupAndSortDonations
export function groupByMonth(donations: PartyDonation[]) {
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
  return Object.values(grouped);
}

// Calculation used as helper function for groupAndSortDonations
export function sortByDate(donations: PartyDonation[]) {
  const sorted = donations.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  return sorted;
}
// Calculation used for List
export function groupAndSortDonations(
  donations: ApiPartyDonationDetails,
  selection: number,
) {
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
  return groupedDonations;
}
// Calculation used in View for Additional information
export function getDonationsSum(donations: PartyDonation[]) {
  const sum = donations.reduce((acc, donation) => {
    return acc + donation.amount;
  }, 0);
  return sum;
}

// Calculation used in View for Additional information
export function getDonationAveragePerYear(
  totalDonations: number,
  selection: number,
) {
  let years = 1;
  switch (selection) {
    case 0:
      // To do: figure out how to get the latest year of donations
      years = 12;
      return averageDonations(totalDonations, years);
    case 1:
      years = 8;
      return averageDonations(totalDonations, years);
    default:
      years = 4;
      return averageDonations(totalDonations, years);
}

// Calculation used in View for Additional information
export function getAverageDonation(
  donationSum: number,
  donationCount: number,
) {
  const average = donationSum / donationCount;
  return average
}

// Calculation used as helper for function for getLargestDonor
export function getSumOfEachOrg(donations: PartyDonation[]) {
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
  return sorted[0];
}

// Calculation used in View for Additional information
export function getLargestDonor(
  donations: ApiPartyDonationDetails,
  selection: number,
) {
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
  return (
    largestDonor.organization.donor_name +
    ' mit ' +
    round(largestDonor.sum / 1000000, 2) +
    ' Mio €'
  );
}

export function getDonationsFromSelection(
  donations: ApiPartyDonationDetails,
  selection: number,
) {
  let relevantDonations: PartyDonation[] = [];
  for (const partyId in donations) {
    // selection 0 = all donations
    if (selection < 1) {
      relevantDonations = relevantDonations.concat(
        donations[partyId].donations_older_than_8_years,
      );
    }
    // selection 1 = donations less than 8 years old
    if (selection < 2) {
      relevantDonations = relevantDonations.concat(
        donations[partyId].donations_4_to_8_years_old,
      );
    }
    // selection 2 donations lett than 4 years old
    if (selection < 3) {
      relevantDonations = relevantDonations.concat(
        donations[partyId].donations_less_than_4_years_old,
      );
    }
  }
  return relevantDonations;
}

export function getAdditionalDonationInformation(
  partydonations: ApiPartyDonationDetails,
  selection: number,
) {
  const relevantDonations = getDonationsFromSelection(
    partydonations,
    selection,
  );
  // Calculations for additional information
  const totalDonations = getDonationsSum(relevantDonations);
  const averageDonationPerYear = getDonationAveragePerYear(totalDonations, selection);
  const averageDonation = getAverageDonation(totalDonations, relevantDonations.length);

  // Formatting for additional information

  // Returning final object additionalDonationInformation
}
