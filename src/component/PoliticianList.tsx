import React from 'react';
import {ScrollView} from 'react-native';
import PoliticianRow from './PoliticianRow';

export interface PoliticianListProps {
  politicianIds: number[];
}

const PoliticianList = ({politicianIds}: PoliticianListProps) => {
  const history = politicianIds.reverse();
  const politicianHistory =
    history.length > 10 ? history.slice(0, 10) : history;
  return (
    <ScrollView>
      {politicianHistory.map((politicianId, index) => (
        <PoliticianRow key={index} politicianId={politicianId} />
      ))}
    </ScrollView>
  );
};

export default PoliticianList;
