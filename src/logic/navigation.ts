import {NavigationProp} from '@react-navigation/native';
import {historyManager} from './history';

export function showPolitician(navigator: NavigationProp<any>, id: string) {
  navigator.navigate('embedded', {
    source: {uri: `https://beta.facethefacts.app/politician/${id}/position`},
  });
  historyManager.pushItem(id);
}
