import React, {useEffect, useState} from 'react';
import {Image, Modal, StyleSheet, Text, TouchableOpacity} from 'react-native';
import ProfilePicturePlaceholder from './ProfilePicturePlaceholder';
import {resolvePoliticianPicture} from '../logic/picture';
import {Colors} from '../theme';

export interface PoliticianPictureProps {
  politicianId: number;
  size?: number;
  clickable?: boolean;
  copyright?: string;
}

const PoliticianPicture = ({
  politicianId,
  size = 76,
  clickable = false,
  copyright,
}: PoliticianPictureProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    resolvePoliticianPicture(politicianId).then(setImage);
  }, [politicianId]);

  const handleImagePress = () => {
    setIsExpanded(true);
  };

  const handleCloseModal = () => {
    setIsExpanded(false);
  };

  if (!image) {
    return <ProfilePicturePlaceholder size={size} />;
  }

  const ImageContent = (
    <Image
      style={[styles.image, {width: size, height: size}]}
      source={{uri: image}}
    />
  );

  return (
    <>
      {clickable ? (
        <TouchableOpacity onPress={handleImagePress}>
          {ImageContent}
        </TouchableOpacity>
      ) : (
        ImageContent
      )}
      {clickable && isExpanded && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isExpanded}
          onRequestClose={handleCloseModal}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={handleCloseModal}
            activeOpacity={1}>
            <Image style={styles.expandedImage} source={{uri: image}} />
            {copyright && (
              <Text style={styles.imageSourceText}>
                Bildquelle: {copyright}
              </Text>
            )}
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  expandedImage: {
    width: 200,
    height: 200,
    borderRadius: 19,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSourceText: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.white70,
  },
});

export default PoliticianPicture;
