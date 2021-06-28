import {NavigationProp} from '@react-navigation/native';

export function showPolitician(navigator: NavigationProp<any>, id: string) {
  navigator.navigate('embedded', {
    source: {uri: `https://beta.facethefacts.app/politician/${id}/position`},
  });
}
