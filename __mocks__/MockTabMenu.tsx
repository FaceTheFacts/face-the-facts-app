import {TabMenuItem, TabMenuProps} from '../src/component/TabMenu';
import {
  HomeIcon,
  HomeIconSolid,
  PoliticiansIcon,
  PoliticiansIconSolid,
  ScannerIcon,
  ScannerIconSolid,
} from '../src/icons';

export const MockTabMenuItem: TabMenuItem[] = [
  {
    name: 'testname1',
    icons: [HomeIcon, HomeIconSolid],
    label: 'Test1',
  },
  {
    name: 'testname2',
    icons: [ScannerIcon, ScannerIconSolid],
    label: 'Test2',
  },
  {
    name: 'testname3',
    icons: [PoliticiansIcon, PoliticiansIconSolid],
    label: 'Test3',
  },
];

export const MockTabMenu: TabMenuProps = {
  items: MockTabMenuItem,
  selected: 'Test1',
  onSelect: jest.fn(),
  blur: false,
};
