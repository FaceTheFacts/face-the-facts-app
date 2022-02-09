import React, {Ref, useState} from 'react';
import {SafeAreaView, useWindowDimensions} from 'react-native';
import {Modalize, ModalizeProps} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {Colors} from '../../theme';

export interface ModalSheetProps extends ModalizeProps {
  modalRef?: Ref<Modalize>;
  autoOpen?: boolean;
}

const BottomSheet = ({
  modalRef,
  autoOpen,
  children,
  ...modalizeProps
}: ModalSheetProps) => {
  if (__DEV__ && autoOpen && modalRef) {
    throw new Error('Cannot use autoOpen when modalRef is given!');
  }

  const [autoOpened, setAutoOpened] = useState(false);
  const {width} = useWindowDimensions();

  return (
    <Portal>
      <Modalize
        ref={
          autoOpen
            ? (instance: Modalize | undefined): void => {
                if (instance && !autoOpened) {
                  setAutoOpened(true);
                  instance.open();
                }
              }
            : modalRef
        }
        modalStyle={{backgroundColor: Colors.background}}
        scrollViewProps={{horizontal: true, scrollEnabled: false}}
        {...modalizeProps}
        FooterComponent={
          <SafeAreaView style={{width}}>{children}</SafeAreaView>
        }
      />
    </Portal>
  );
};

export default BottomSheet;
