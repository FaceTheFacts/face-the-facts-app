import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {PoliTrackImage} from '../../logic/api';
import NewsArticlePlaceHolder from '../../../assets/logo/placeHolderNewsArticleImage.png';

export interface NewsPictureProps {
  size?: number;
  source: string;
  image: PoliTrackImage[];
  width: number;
  height: number;
  borderBottom?: boolean;
}

const NewsPicture = ({
  image,
  width,
  height,
  borderBottom,
}: NewsPictureProps) => {
  let radius = 0;
  if (borderBottom) {
    radius = 8;
  }
  const imageSource =
    image.length > 0 ? {uri: image[0].url} : NewsArticlePlaceHolder;

  return (
    <Image
      style={[
        styles.image,
        {borderBottomLeftRadius: radius, borderBottomRightRadius: radius},
      ]}
      source={imageSource}
      width={width}
      height={height}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default NewsPicture;
