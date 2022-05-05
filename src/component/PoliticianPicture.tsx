import React, {useEffect, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import ProfilePicturePlaceholder from './ProfilePicturePlaceholder';
import {resolvePoliticianPicture} from '../logic/picture';

export interface PoliticianPictureProps {
  politicianId: number;
  size?: number;
}

const PoliticianPicture = ({
  politicianId,
  size = 76,
}: PoliticianPictureProps) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    resolvePoliticianPicture(politicianId).then(setImage);
  }, [politicianId]);

  if (!image) {
    return <ProfilePicturePlaceholder size={size} />;
  }

  return (
    <Image
      style={styles.image}
      source={{uri: image}}
      width={size}
      height={size}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
});

export default PoliticianPicture;
