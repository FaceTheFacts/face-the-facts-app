import React from 'react';
import PoliticianView from './PoliticianView';
import {Politician} from '../logic/data';
import BottomSheet, {ModalSheetProps} from '../component/utils/BottomSheet';

export interface PoliticianModalProps
  extends Omit<ModalSheetProps, 'children'> {
  politician: Politician;
}

const PoliticianModal = ({politician, ...modalProps}: PoliticianModalProps) => {
  return (
    <BottomSheet {...modalProps}>
      <PoliticianView politician={politician} />
    </BottomSheet>
  );
};

export default PoliticianModal;
