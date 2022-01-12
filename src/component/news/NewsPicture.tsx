import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {PoliTrackImage} from '../../logic/api';
import ProfilePicturePlaceholder from './../ProfilePicturePlaceholder';

export interface NewsPictureProps {
  size?: number;
  source: string;
  image: PoliTrackImage[];
}

const NewsPicture = ({image}: NewsPictureProps) => {
  if (image.length === 0) {
    return <ProfilePicturePlaceholder />;
  }

  return (
    <Image
      style={styles.image}
      source={{uri: image[0].url}}
      width={styles.image.width}
      height={styles.image.height}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: 191,
    height: 105,
  },
});

export default NewsPicture;
