import React, {useEffect, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import ProfilePicturePlaceholder from './ProfilePicturePlaceholder';
import {resolvePoliticianPicture} from '../logic/picture';

export interface PoliticianPictureProps {
  politicianId: string;
}

const PoliticianPicture = ({politicianId}: PoliticianPictureProps) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    resolvePoliticianPicture(politicianId).then(setImage);
  }, [politicianId]);

  if (!image) {
    return <ProfilePicturePlaceholder />;
  }

  return (
    <Image style={styles.image} source={{uri: image}} width={76} height={76} />
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
