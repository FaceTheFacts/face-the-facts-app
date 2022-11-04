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
export function formatDonationsInMillions(donations_sum: number) {
  const roundedDonationsInMillions = round(donations_sum / 1000000, 2);
  return '' + roundedDonationsInMillions + ' Mio. €';
}

export function formatDonationsinThousands(donations_sum: number) {
  return round(donations_sum, 0).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
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

export function getDonations(
  donations: ApiPartyDonationDetails,
  selection: number,
) {
  let allDonations: PartyDonation[] = [];
  for (const partyId in donations) {
    // selection 0 = donations older than 8 years
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
    // selection 2 donations between 4 years and 8 years old
    if (selection < 3) {
      allDonations = allDonations.concat(
        donations[partyId].donations_less_than_4_years_old,
      );
    }
  }
  return allDonations;
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
  const allDonations = getDonations(donations, selection);
  const sortedDonations = sortByDate(allDonations);
  const groupedDonations = groupByMonth(sortedDonations);
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
      return getAverageDonation(totalDonations, years);
    case 1:
      years = 8;
      return getAverageDonation(totalDonations, years);
    default:
      years = 4;
      return getAverageDonation(totalDonations, years);
  }
}

// Calculation used in View for Additional information
export function getAverageDonation(donationSum: number, donationCount: number) {
  const average = donationSum / donationCount;
  return average;
}

// Calculation used as helper for function for getLargestDonor
export function getLargestDonor(donations: PartyDonation[]) {
  // Group donations by donor
  const groupedDonors = donations.reduce((acc, donation) => {
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
  // Sort by sum in descending order
  const sortedDonors = Object.values(groupedDonors).sort((a, b) => {
    return b.sum - a.sum;
  });
  return sortedDonors[0];
}

// Calculation used as helper function

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
  donations: ApiPartyDonationDetails,
  selection: number,
) {
  const relevantDonations = getDonationsFromSelection(donations, selection);
  // Calculations for additional information
  const totalDonations = getDonationsSum(relevantDonations);
  const averageDonationPerYear = getDonationAveragePerYear(
    totalDonations,
    selection,
  );
  const averageDonation = getAverageDonation(
    totalDonations,
    relevantDonations.length,
  );
  const largestDonor = getLargestDonor(relevantDonations);

  // Formatting for additional information
  const formattedTotalDonations = formatDonationsinThousands(totalDonations);
  const formattedAverageDonationPerYear = formatDonationsinThousands(
    averageDonationPerYear,
  );
  const formattedAverageDonation = formatDonationsinThousands(averageDonation);
  const formattedLargestDonor = {
    sum: formatDonationsInMillions(largestDonor.sum),
    organization: largestDonor.organization,
  };

  // Returning final object additionalDonationInformation
  const additionalDonationInformation = {
    totalDonations: formattedTotalDonations,
    averageDonationPerYear: formattedAverageDonationPerYear,
    averageDonation: formattedAverageDonation,
    largestDonor: formattedLargestDonor,
  };
  return additionalDonationInformation;
}
