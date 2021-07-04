import {NavigationProp} from '@react-navigation/native';
import {historyManager} from './history';

export function showPolitician(navigator: NavigationProp<any>, id: string) {
  const url = `https://beta.facethefacts.app/politician/${id}/position`;

  navigator.navigate('embedded', {
    source: {uri: url},
    shareContent: {url},
  });
  historyManager.pushItem(id);
}
