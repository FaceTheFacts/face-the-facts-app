// Party Donation related util functions

import {formatDate, monthMap} from '../utils/util';
import {
  BundestagPartyDonationDetails,
  ExtendedGraphData,
  FormattedGroupedPartyDonations,
  GraphData,
  GraphDataOverview,
  GroupedPartyDonations,
  GroupedQuarterPartyDonations,
  PartyDonation,
  PartyDonationDetails,
  PartySeparation,
} from './api';

// Formatting used in View and as helper function for List and Additional information
export function round(value: number, decimals: number) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}
// Formatting
export function formatDonationsInMillions(donations_sum: number) {
  const roundedDonationsInMillions = round(donations_sum / 1000000, 2);
  return '' + roundedDonationsInMillions + ' Mio €';
}

export function formatDonationsInThousands(donations_sum: number) {
  return round(donations_sum, 0).toLocaleString('de-DE', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'EUR',
  });
}

export function formatDonations(donations_sum: number) {
  if (donations_sum >= 1000000) {
    return formatDonationsInMillions(donations_sum);
  } else {
    return formatDonationsInThousands(donations_sum);
  }
}

export function formatIncome(income: number) {
  if (income >= 1000000) {
    return formatDonationsInMillions(income);
  } else {
    return formatDonationsInThousands(income);
  }
}

export function formatGroupedDonations(
  groupedDonations: GroupedPartyDonations[],
): FormattedGroupedPartyDonations[] {
  return groupedDonations.map(group => {
    return {
      title: group.month,
      sum: formatDonations(group.sum),
      data: group.sorted_donations.map(donation => ({
        ...donation,
        amount: formatDonations(donation.amount),
        date: formatDate(donation.date),
      })),
    };
  });
}
// Helper function to append donations based on timeframe selection
export function getDonationsFromSelection(
  donations: PartyDonationDetails,
  selection: number,
) {
  let relevantDonations: PartyDonation[] = [];

  // Adjusted logic to handle PartyDonationDetails
  if (selection < 1) {
    relevantDonations = relevantDonations.concat(
      donations.donations_older_than_8_years,
    );
  }
  if (selection < 2) {
    relevantDonations = relevantDonations.concat(
      donations.donations_4_to_8_years_old,
    );
  }
  if (selection < 3) {
    relevantDonations = relevantDonations.concat(
      donations.donations_less_than_4_years_old,
    );
  }

  return relevantDonations;
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
  relevantDonations: PartyDonation[],
  selection: number,
) {
  let years = 1;
  switch (selection) {
    case 0:
      const date = new Date();
      years = date.getFullYear() + 1 - 2009;
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

// Helper for function for getAdditionalDonationInformation
export function getLargestDonor(donations: PartyDonation[]) {
  if (donations.length === 0) {
    return {sum: 0, organization: {}};
  }
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

// Helper function for groupAndSortDonations
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

export function getAdditionalDonationInformation(
  donations: BundestagPartyDonationDetails | PartyDonationDetails,
  selection: number,
) {
  let relevantDonations: PartyDonation[] = [];

  if ('donations_older_than_8_years' in donations) {
    // donations is of type PartyDonationDetails
    relevantDonations = getDonationsFromSelection(
      donations as PartyDonationDetails,
      selection,
    );
  } else {
    // donations is of type BundestagPartyDonationDetails
    Object.values(donations as BundestagPartyDonationDetails).forEach(
      partyDonationDetails => {
        relevantDonations = relevantDonations.concat(
          getDonationsFromSelection(partyDonationDetails, selection),
        );
      },
    );
  }

  if (relevantDonations.length === 0) {
    return {
      totalDonations: '0 €',
      averageDonationPerYear: '0 €',
      averageDonation: '0 €',
      largestDonor: {
        sum: '0 €',
        organization: {donar_name: ''},
      },
    };
  }
  const totalDonations = getDonationsSum(relevantDonations);
  const averageDonationPerYear = getDonationAveragePerYear(
    totalDonations,
    relevantDonations,
    selection,
  );
  const averageDonation = getAverageDonation(
    totalDonations,
    relevantDonations.length,
  );
  const largestDonor = getLargestDonor(relevantDonations);

  const formattedTotalDonations = formatDonations(totalDonations);
  const formattedAverageDonationPerYear = formatDonations(
    averageDonationPerYear,
  );
  const formattedAverageDonation = formatDonations(averageDonation);
  const formattedLargestDonor = {
    sum: formatDonations(largestDonor.sum),
    organization: largestDonor.organization,
  };

  const additionalDonationInformation = {
    totalDonations: formattedTotalDonations,
    averageDonationPerYear: formattedAverageDonationPerYear,
    averageDonation: formattedAverageDonation,
    largestDonor: formattedLargestDonor,
  };

  return additionalDonationInformation;
}

// Calculation used for List
export function groupAndSortDonations(
  donations: BundestagPartyDonationDetails | PartyDonationDetails,
  selection: number,
) {
  let allDonations: PartyDonation[] = [];

  // Check if 'donations' has the property 'donations_older_than_8_years' indicating it's of type PartyDonationDetails
  if ('donations_older_than_8_years' in donations) {
    allDonations = getDonationsFromSelection(
      donations as PartyDonationDetails,
      selection,
    );
  } else {
    // If it doesn't have the property, it's of type BundestagPartyDonationDetails
    Object.values(donations as BundestagPartyDonationDetails).forEach(
      partyDonationDetails => {
        allDonations = allDonations.concat(
          getDonationsFromSelection(partyDonationDetails, selection),
        );
      },
    );
  }
  if (allDonations.length === 0) {
    return [];
  }
  const sortedDonations = sortByDate(allDonations);
  const groupedDonations = groupByMonth(sortedDonations);
  const formattedGroupedDonations = formatGroupedDonations(groupedDonations);
  return formattedGroupedDonations;
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

export const processData = (
  data: GroupedQuarterPartyDonations[],
): GraphData => {
  // Extract amounts and format them
  const formattedData = data.map(item => ({value: item.amount / 1000}));

  // Determine the highest amount
  const highestAmount = Math.max(...formattedData.map(item => item.value));

  // Determine the step value and number of sections
  const {maxValue, stepValue, noOfSections} =
    determineStepAndSections(highestAmount);

  return {
    data: formattedData,
    maxValue: maxValue,
    noOfSections: noOfSections,
    stepValue: stepValue,
  };
};

export function determineStepAndSections(maxDataValue: number): {
  maxValue: number;
  stepValue: number;
  noOfSections: number;
} {
  // Define potential step values.
  const potentialSteps = [10, 20, 25, 50, 100, 200, 250, 500];

  const maxSections = 5;

  // Choose the step value that is just greater than maxDataValue divided by the length of potentialSteps.
  const stepValue =
    potentialSteps.find(step => maxDataValue / step <= maxSections) || 500;

  const noOfSections = Math.ceil(maxDataValue / stepValue);

  // Adjust the stepValue based on noOfSections to adhere to the formula.
  const maxValue = stepValue * noOfSections;

  return {
    maxValue,
    stepValue,
    noOfSections,
  };
}

function getQuarter(month: string): number {
  if (month <= '03') {
    return 1;
  }
  if (month <= '06') {
    return 2;
  }
  if (month <= '09') {
    return 3;
  }
  return 4;
}

export function groupByQuarter(
  donations: PartyDonation[],
): GroupedQuarterPartyDonations[] {
  const grouped = donations.reduce((acc, donation) => {
    const month = donation.date.slice(5, 7);
    const year = donation.date.slice(0, 4);
    const quarter = getQuarter(month);
    const key = `${year}-Q${quarter}`;
    if (!acc[key]) {
      acc[key] = {
        quarterYear: key,
        amount: 0,
      };
    }
    acc[key].amount += donation.amount;
    return acc;
  }, {} as Record<string, GroupedQuarterPartyDonations>);
  const startYear = parseInt(donations[0].date.slice(0, 4), 10);
  const endYear = parseInt(
    donations[donations.length - 1].date.slice(0, 4),
    10,
  );

  for (let year = startYear; year <= endYear; year++) {
    for (let q = 1; q <= 4; q++) {
      const key = `${year}-Q${q}`;
      if (!grouped[key]) {
        grouped[key] = {
          quarterYear: key,
          amount: 0,
        };
      }
    }
  }
  return Object.values(grouped).sort((a, b) =>
    a.quarterYear.localeCompare(b.quarterYear),
  );
}

export function generateYearList(selection: number): string[] {
  const currentYear = new Date().getFullYear();
  if (selection === 2) {
    return [
      `${currentYear - 3}`,
      `${currentYear - 2}`,
      `${currentYear - 1}`,
      `${currentYear}`,
    ];
  }
  if (selection === 1) {
    return [
      `${currentYear - 7}`,
      `${currentYear - 6}`,
      `${currentYear - 5}`,
      `${currentYear - 4}`,
      `${currentYear - 3}`,
      `${currentYear - 2}`,
      `${currentYear - 1}`,
      `${currentYear}`,
    ];
  } else {
    const maxEntries = 8;
    const step = Math.ceil((currentYear - 2009) / (maxEntries - 1));
    return generateEvenDistribution(2009, currentYear, step);
  }
}

export function generateEvenDistribution(
  start: number,
  end: number,
  step: number,
): string[] {
  const years = [];
  for (let i = start; i <= end; i += step) {
    years.push(i.toString());
  }
  // Ensure the last year is always included
  if (years[years.length - 1] !== end.toString()) {
    years.push(end.toString());
  }
  return years;
}

export function getGraphData(
  partydonations: PartyDonationDetails,
  selection: number,
): ExtendedGraphData {
  const relevantDonations = getDonationsFromSelection(
    partydonations,
    selection,
  );
  if (relevantDonations.length === 0) {
    return {
      data: {
        data: [{value: 0}],
        maxValue: 0,
        noOfSections: 0,
        stepValue: 0,
      },
      yAxis: [],
    };
  }
  const quarterlyDonations = groupByQuarterFilled(relevantDonations, selection);
  const processedData = processData(quarterlyDonations);
  const yearList = generateYearList(selection);
  return {data: processedData, yAxis: yearList};
}

export function getPartyStyle(
  partydonations: BundestagPartyDonationDetails,
): PartySeparation {
  const partyStyles: PartySeparation = {bundestagParties: [], otherParties: []};
  const bundestagParties = [1, 2, 3, 4, 5, 8, 9, 145];
  for (const key in partydonations) {
    const value = partydonations[key];

    for (const category in value) {
      if (category in value) {
        const donationWithPartyStyle = value[
          category as keyof PartyDonationDetails
        ].find(donation => donation.party && donation.party.party_style);

        if (
          donationWithPartyStyle &&
          donationWithPartyStyle.party &&
          donationWithPartyStyle.party.party_style
        ) {
          if (bundestagParties.includes(donationWithPartyStyle.party.id)) {
            if (
              !partyStyles.bundestagParties.some(
                party => party.id === donationWithPartyStyle.party.id,
              )
            ) {
              partyStyles.bundestagParties.push(donationWithPartyStyle.party);
            }
          } else {
            if (
              !partyStyles.otherParties.some(
                party => party.id === donationWithPartyStyle.party.id,
              )
            ) {
              partyStyles.otherParties.push(donationWithPartyStyle.party);
            }
          }
        }
      }
    }
  }

  return partyStyles;
}

export function groupByQuarterFilled(
  donations: PartyDonation[],
  selection: number,
): GroupedQuarterPartyDonations[] {
  // Get the current date, year, and quarter
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Ensures two-digit month format
  const currentQuarter = getQuarter(currentMonth);

  // Calculate the start year based on selection
  let startYear: number;
  if (selection === 2) {
    // Past 4 years
    startYear = currentYear - 3;
  } else if (selection === 1) {
    // Past 8 years
    startYear = currentYear - 7;
  } else {
    // All-time since 2009
    startYear = 2009;
  }

  // Initialize the grouped object with all quarters from startYear to currentYear
  const grouped: Record<string, GroupedQuarterPartyDonations> = {};
  for (let year = startYear; year <= currentYear; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      // Only add quarters for the current year that have passed
      if (year === currentYear && quarter > currentQuarter) {
        continue;
      }
      const key = `${year}-Q${quarter}`;
      grouped[key] = {
        quarterYear: key,
        amount: 0,
      };
    }
  }

  // Aggregate donations into the grouped object
  donations.forEach(donation => {
    const year = parseInt(donation.date.slice(0, 4), 10);
    const month = donation.date.slice(5, 7);
    const quarter = getQuarter(month);
    const key = `${year}-Q${quarter}`;
    if (grouped[key]) {
      grouped[key].amount += donation.amount;
    } else {
      // If the quarter does not exist in the grouped object, it means it's from a year before startYear
      grouped[key] = {
        quarterYear: key,
        amount: donation.amount,
      };
    }
  });

  // Convert grouped object to array and sort by quarterYear
  return Object.values(grouped).sort((a, b) =>
    a.quarterYear.localeCompare(b.quarterYear),
  );
}

export function getGraphDataOverview(
  allPartyDonations: BundestagPartyDonationDetails,
  filter: number[],
  selection: number,
  partyStyles: PartySeparation,
): GraphDataOverview[] {
  const quarterlyDonations = createFilledDonationData(
    allPartyDonations,
    filter,
    selection,
  );
  // Convert the Record<string, {value: number}[]> into an array of GraphDataOverview
  const graphDataOverviews: GraphDataOverview[] = filter.map(key => {
    const keyString = key.toString();
    const donations = quarterlyDonations[keyString].map(item => ({
      value: item.amount / 1000,
    }));

    // Find the color for the current party key
    const partyColor =
      partyStyles.bundestagParties
        .concat(partyStyles.otherParties)
        .find(party => party.id === key)?.party_style.background_color ||
      'white';

    return {
      data: donations,
      color: partyColor,
    };
  });

  return graphDataOverviews;
}

export function getYearsRange(donations: Record<string, PartyDonation[]>): {
  startYear: number;
  endYear: number;
} {
  let startYear = 3000;
  let endYear = 0;

  Object.values(donations)
    .flat()
    .forEach(donation => {
      const year = parseInt(donation.date.slice(0, 4), 10);
      startYear = Math.min(startYear, year);
      endYear = Math.max(endYear, year);
    });

  return {startYear, endYear};
}

export function generateAllQuarterYears(range: {
  startYear: number;
  endYear: number;
}): string[] {
  let quarterYears = [];
  for (let year = range.startYear; year <= range.endYear; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      quarterYears.push(`${year}-Q${quarter}`);
    }
  }
  return quarterYears;
}

export function createFilledDonationData(
  partydonations: BundestagPartyDonationDetails,
  filter: number[],
  selection: number,
): Record<string, GroupedQuarterPartyDonations[]> {
  let filledData: Record<string, GroupedQuarterPartyDonations[]> = {};

  // For each party in the filter, filter the donations based on the selection criteria
  const filteredPartyDonations: Record<string, PartyDonation[]> = {};
  Object.keys(partydonations)
    .filter(key => filter.includes(parseInt(key, 10)))
    .forEach(key => {
      filteredPartyDonations[key] = getDonationsFromSelection(
        partydonations[key],
        selection,
      );
    });

  const yearsRange = getYearsRange(filteredPartyDonations);
  const allQuarterYears = generateAllQuarterYears(yearsRange);

  // Group each party's donations by quarter
  Object.keys(filteredPartyDonations).forEach(key => {
    filledData[key] = groupByQuarter(filteredPartyDonations[key]);
  });

  // For each key, check if each quarter from the baseList exists, if not add it
  Object.keys(filledData).forEach(key => {
    allQuarterYears.forEach(quarterYear => {
      if (!filledData[key].some(q => q.quarterYear === quarterYear)) {
        filledData[key].push({
          quarterYear: quarterYear,
          amount: 0,
        });
      }
    });
    // Sort each list by quarterYear after adding missing quarters
    filledData[key].sort((a, b) => a.quarterYear.localeCompare(b.quarterYear));
  });
  return filledData;
}
