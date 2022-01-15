import {CachesDirectoryPath, downloadFile, exists} from 'react-native-fs';

export async function resolvePoliticianPicture(
  politicianId: string,
): Promise<string | null> {
  const filename = `${CachesDirectoryPath}/politician-${politicianId}.jpg`;
  const uri = `file://${filename}`;

  if (await exists(filename)) {
    return uri;
  }

  const result = await downloadFile({
    fromUrl: `https://image.facethefacts-api.de/${politicianId}.jpg`,
    toFile: filename,
  }).promise;

  if (result.statusCode !== 200) {
    return null;
  }

  return uri;
}
