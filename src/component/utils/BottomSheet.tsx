import React, {Ref, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {Modalize, ModalizeProps} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const marginBottom = insets.bottom;

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
          <View style={{width: width, marginBottom: marginBottom}}>
            {children}
          </View>
        }
      />
    </Portal>
  );
};

export default BottomSheet;
