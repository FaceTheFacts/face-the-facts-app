import React, {useContext} from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PoliticianContext} from '../../view/PoliticianView';
import {Colors} from '../../theme';
import Icon from '../Icon';

interface LinkType {
  icon: string;
  label: string;
  test: (link: string) => boolean;
}

const linkTypes: LinkType[] = [
  {
    icon: 'M17.2188 0.4375H2.78125C1.67383 0.4375 0.8125 1.33984 0.8125 2.40625V16.8438C0.8125 17.9512 1.67383 18.8125 2.78125 18.8125H8.40039V12.5781H5.81641V9.625H8.40039V7.41016C8.40039 4.86719 9.91797 3.43164 12.2148 3.43164C13.3633 3.43164 14.5117 3.63672 14.5117 3.63672V6.13867H13.2402C11.9688 6.13867 11.5586 6.91797 11.5586 7.73828V9.625H14.3887L13.9375 12.5781H11.5586V18.8125H17.2188C18.2852 18.8125 19.1875 17.9512 19.1875 16.8438V2.40625C19.1875 1.33984 18.2852 0.4375 17.2188 0.4375Z',
    label: 'Facebook',
    test: link => link.includes('facebook.com'),
  },
  {
    icon: 'M22.7051 2.75195C22.459 1.76758 21.6797 0.988281 20.7363 0.742188C18.9727 0.25 12 0.25 12 0.25C12 0.25 4.98633 0.25 3.22266 0.742188C2.2793 0.988281 1.5 1.76758 1.25391 2.75195C0.761719 4.47461 0.761719 8.16602 0.761719 8.16602C0.761719 8.16602 0.761719 11.8164 1.25391 13.5801C1.5 14.5645 2.2793 15.3027 3.22266 15.5488C4.98633 16 12 16 12 16C12 16 18.9727 16 20.7363 15.5488C21.6797 15.3027 22.459 14.5645 22.7051 13.5801C23.1973 11.8164 23.1973 8.16602 23.1973 8.16602C23.1973 8.16602 23.1973 4.47461 22.7051 2.75195ZM9.70312 11.4883V4.84375L15.5273 8.16602L9.70312 11.4883Z',
    label: 'YouTube',
    test: link => link.includes('youtube.com'),
  },
  {
    icon: 'M16.203 0H2.86069C2.11923 0.00111529 1.40845 0.297342 0.884158 0.823751C0.359865 1.35016 0.0648315 2.0638 0.0637207 2.80825V16.196C0.0648334 16.94 0.360001 17.6532 0.884414 18.179C1.40883 18.7047 2.11962 19 2.86069 19H16.224C16.5892 19.0039 16.9516 18.9352 17.2902 18.7978C17.6288 18.6604 17.937 18.4571 18.197 18.1996C18.457 17.9421 18.6637 17.6354 18.8051 17.2973C18.9465 16.9592 19.0199 16.5964 19.021 16.2297V2.80825C19.0199 2.0638 18.7248 1.35016 18.2005 0.823751C17.6762 0.297342 16.9655 0.00111529 16.224 0H16.203ZM17.6015 15.8671C17.6049 16.0925 17.5632 16.3163 17.479 16.5252C17.3948 16.7342 17.2697 16.9241 17.1111 17.0837C16.9526 17.2433 16.7637 17.3693 16.5558 17.4544C16.3479 17.5395 16.1251 17.5819 15.9006 17.579H3.16307C2.93857 17.5819 2.71577 17.5395 2.50786 17.4544C2.29995 17.3693 2.11114 17.2433 1.95258 17.0837C1.79402 16.9241 1.66892 16.7342 1.5847 16.5252C1.50047 16.3163 1.45883 16.0925 1.46221 15.8671V3.13293C1.45939 2.90789 1.50145 2.68455 1.58593 2.47608C1.67041 2.26761 1.79559 2.07823 1.95409 1.91908C2.1126 1.75994 2.30123 1.63425 2.50886 1.54943C2.71649 1.46462 2.93893 1.42238 3.16307 1.42521H15.8796C16.1038 1.42238 16.3262 1.46462 16.5338 1.54943C16.7415 1.63425 16.9301 1.75994 17.0886 1.91908C17.2471 2.07823 17.3723 2.26761 17.4568 2.47608C17.5412 2.68455 17.5833 2.90789 17.5805 3.13293L17.6015 15.8671ZM13.343 5.87372C12.5033 4.96096 11.3674 4.37803 10.1387 4.22925L10.2395 2.54261C11.8975 2.71481 13.4386 3.4795 14.5819 4.69729C15.7404 5.92516 16.4291 7.52477 16.5264 9.21327H14.8213C14.7206 7.95596 14.191 6.772 13.322 5.86107L13.343 5.87372ZM9.40375 2.48779L9.33236 4.19973C7.95745 4.20051 6.63726 4.74071 5.65346 5.70506L4.49436 4.47381C5.80565 3.18722 7.57036 2.47333 9.40375 2.48779ZM13.1498 13.5522C13.577 13.1799 13.9255 12.7254 14.1746 12.2155L15.8082 12.7299C15.4301 13.4961 14.9229 14.1908 14.309 14.7834L13.1498 13.5522ZM16.0896 12.0089L14.4895 11.4987C14.6912 11.008 14.8064 10.4857 14.8297 9.95539H16.5348C16.5129 10.6615 16.362 11.3575 16.0896 12.0089ZM11.8899 8.13804L13.1163 6.94052C13.6277 7.61508 13.9353 8.423 14.0024 9.26809H12.2973C12.2309 8.86781 12.0883 8.48414 11.8773 8.13804H11.8899ZM12.2511 10.0271H13.9562C13.8788 11.1605 13.3796 12.2232 12.5577 13.004L11.4028 11.7685C11.8724 11.3013 12.1688 10.6868 12.2427 10.0271H12.2511ZM6.22042 6.31646C6.62721 5.90917 7.11088 5.5875 7.64308 5.37028C8.17528 5.15307 8.74531 5.04469 9.31976 5.05149L9.21897 6.76343C8.53142 6.79238 7.87774 7.07109 7.37952 7.54771L6.22042 6.31646ZM11.4028 7.54771C10.9917 7.16544 10.4827 6.90557 9.93291 6.79716L10.0379 5.08522C11.0008 5.22917 11.895 5.67141 12.5955 6.3502L11.4028 7.54771Z',
    label: 'Abgeordnetenwatch',
    test: link => link.includes('abgeordnetenwatch.de'),
  },
  {
    icon: 'M27.125 0.757812L27.084 0.716797L21.875 0.675781V1.25C22.2852 1.25 23.4336 1.45508 23.8027 2.39844L18.7578 14.0059C18.5117 13.4316 16.2148 8.22266 15.9277 7.56641L18.3477 2.52148C18.8809 1.74219 19.8242 1.25 20.7266 1.25V0.675781C20.2344 0.675781 17.5273 0.675781 15.6816 0.716797C15.6816 0.839844 15.6816 1.12695 15.6816 1.25C17.1172 1.29102 17.6504 1.61914 17.2812 2.48047C16.707 3.75195 15.5176 6.17188 15.3125 6.58203C14.5742 5.10547 14.082 3.95703 13.3027 2.31641C12.9746 1.53711 13.7129 1.25 14.5332 1.25V0.716797L8.66797 0.675781V1.25C9.48828 1.25 10.5547 1.33203 10.9648 2.07031C11.5391 3.13672 13.3848 7.48438 13.959 8.63281C13.2207 9.98633 11.498 13.2676 10.8828 14.498C9.98047 12.4883 6.61719 4.69531 5.71484 2.64453C5.3457 1.7832 6.69922 1.29102 7.47852 1.25V0.675781H0.833984C0.833984 0.839844 0.875 1.12695 0.875 1.25C1.94141 1.25 3.5 3.01367 3.95117 4.12109C5.87891 8.63281 7.92969 13.1035 9.81641 17.5742C9.81641 17.6152 10.4316 17.6152 10.4316 17.6152C11.7031 15.0312 13.1797 12.2832 14.5332 9.69922L17.8965 17.6152H18.4297C20.5625 12.7344 23.7617 5.26953 24.7871 2.89062C25.2383 1.90625 25.9355 1.29102 27.084 1.25L27.125 0.757812Z',
    label: 'Wikipedia',
    test: link => link.includes('wikipedia.org'),
  },
  {
    icon: 'M19.3262 4.85938C20.1465 4.24414 20.8848 3.50586 21.459 2.64453C20.7207 2.97266 19.8594 3.21875 18.998 3.30078C19.9004 2.76758 20.5566 1.94727 20.8848 0.921875C20.0645 1.41406 19.1211 1.7832 18.1777 1.98828C17.3574 1.12695 16.25 0.634766 15.0195 0.634766C12.6406 0.634766 10.7129 2.5625 10.7129 4.94141C10.7129 5.26953 10.7539 5.59766 10.8359 5.92578C7.26758 5.7207 4.06836 3.99805 1.93555 1.41406C1.56641 2.0293 1.36133 2.76758 1.36133 3.58789C1.36133 5.06445 2.09961 6.37695 3.28906 7.15625C2.5918 7.11523 1.89453 6.95117 1.32031 6.62305V6.66406C1.32031 8.75586 2.79688 10.4785 4.76562 10.8887C4.4375 10.9707 4.02734 11.0527 3.6582 11.0527C3.37109 11.0527 3.125 11.0117 2.83789 10.9707C3.37109 12.6934 4.9707 13.9238 6.85742 13.9648C5.38086 15.1133 3.53516 15.8105 1.52539 15.8105C1.15625 15.8105 0.828125 15.7695 0.5 15.7285C2.38672 16.959 4.64258 17.6562 7.10352 17.6562C15.0195 17.6562 19.3262 11.1348 19.3262 5.43359C19.3262 5.22852 19.3262 5.06445 19.3262 4.85938Z',
    label: 'Twitter',
    test: link => link.includes('twitter.com'),
  },
  {
    icon: 'M10 5.4082C7.375 5.4082 5.2832 7.54102 5.2832 10.125C5.2832 12.75 7.375 14.8418 10 14.8418C12.584 14.8418 14.7168 12.75 14.7168 10.125C14.7168 7.54102 12.584 5.4082 10 5.4082ZM10 13.2012C8.31836 13.2012 6.92383 11.8477 6.92383 10.125C6.92383 8.44336 8.27734 7.08984 10 7.08984C11.6816 7.08984 13.0352 8.44336 13.0352 10.125C13.0352 11.8477 11.6816 13.2012 10 13.2012ZM15.9883 5.24414C15.9883 4.62891 15.4961 4.13672 14.8809 4.13672C14.2656 4.13672 13.7734 4.62891 13.7734 5.24414C13.7734 5.85938 14.2656 6.35156 14.8809 6.35156C15.4961 6.35156 15.9883 5.85938 15.9883 5.24414ZM19.1055 6.35156C19.0234 4.875 18.6953 3.5625 17.6289 2.49609C16.5625 1.42969 15.25 1.10156 13.7734 1.01953C12.2559 0.9375 7.70312 0.9375 6.18555 1.01953C4.70898 1.10156 3.4375 1.42969 2.33008 2.49609C1.26367 3.5625 0.935547 4.875 0.853516 6.35156C0.771484 7.86914 0.771484 12.4219 0.853516 13.9395C0.935547 15.416 1.26367 16.6875 2.33008 17.7949C3.4375 18.8613 4.70898 19.1895 6.18555 19.2715C7.70312 19.3535 12.2559 19.3535 13.7734 19.2715C15.25 19.1895 16.5625 18.8613 17.6289 17.7949C18.6953 16.6875 19.0234 15.416 19.1055 13.9395C19.1875 12.4219 19.1875 7.86914 19.1055 6.35156ZM17.1367 15.5391C16.8496 16.3594 16.1934 16.9746 15.4141 17.3027C14.1836 17.7949 11.3125 17.6719 10 17.6719C8.64648 17.6719 5.77539 17.7949 4.58594 17.3027C3.76562 16.9746 3.15039 16.3594 2.82227 15.5391C2.33008 14.3496 2.45312 11.4785 2.45312 10.125C2.45312 8.8125 2.33008 5.94141 2.82227 4.71094C3.15039 3.93164 3.76562 3.31641 4.58594 2.98828C5.77539 2.49609 8.64648 2.61914 10 2.61914C11.3125 2.61914 14.1836 2.49609 15.4141 2.98828C16.1934 3.27539 16.8086 3.93164 17.1367 4.71094C17.6289 5.94141 17.5059 8.8125 17.5059 10.125C17.5059 11.4785 17.6289 14.3496 17.1367 15.5391Z',
    label: 'Instagram',
    test: link => link.includes('instagram.com'),
  },
  {
    icon: 'M19.1875 9.23828V5.66992C19.1465 5.66992 19.1465 5.66992 19.1465 5.66992C18.1621 5.66992 17.2188 5.38281 16.4395 4.84961C15.291 4.11133 14.4707 2.92188 14.2246 1.56836C14.1426 1.28125 14.1426 0.994141 14.1426 0.707031C14.1426 0.666016 14.1426 0.666016 14.1426 0.625H10.5332V14.9805C10.5332 16.6621 9.13867 18.0566 7.45703 18.0566C5.77539 18.0566 4.38086 16.6621 4.38086 14.9805C4.38086 13.2988 5.77539 11.9043 7.45703 11.9043C7.78516 11.9043 8.07227 11.9453 8.40039 12.0684V8.37695C8.07227 8.33594 7.78516 8.29492 7.45703 8.29492C3.76562 8.29492 0.8125 11.2891 0.8125 14.9805C0.8125 18.6719 3.76562 21.625 7.45703 21.625C11.1484 21.625 14.1426 18.6719 14.1426 14.9805V7.63867C15.5371 8.66406 17.2598 9.23828 19.1465 9.23828H19.1875Z',
    label: 'TikTok',
    test: link => link.includes('tiktok.com'),
  },
  {
    icon: 'M18.875 0.9375H3.125C1.64844 0.9375 0.5 2.12695 0.5 3.5625V16.6875C0.5 18.1641 1.64844 19.3125 3.125 19.3125H18.875C20.3105 19.3125 21.5 18.1641 21.5 16.6875V3.5625C21.5 2.12695 20.3105 0.9375 18.875 0.9375ZM12.3125 3.5625C13.0098 3.5625 13.625 4.17773 13.625 4.875C13.625 5.61328 13.0098 6.1875 12.3125 6.1875C11.5742 6.1875 11 5.61328 11 4.875C11 4.17773 11.5742 3.5625 12.3125 3.5625ZM8.375 3.5625C9.07227 3.5625 9.6875 4.17773 9.6875 4.875C9.6875 5.61328 9.07227 6.1875 8.375 6.1875C7.63672 6.1875 7.0625 5.61328 7.0625 4.875C7.0625 4.17773 7.63672 3.5625 8.375 3.5625ZM4.4375 3.5625C5.13477 3.5625 5.75 4.17773 5.75 4.875C5.75 5.61328 5.13477 6.1875 4.4375 6.1875C3.69922 6.1875 3.125 5.61328 3.125 4.875C3.125 4.17773 3.69922 3.5625 4.4375 3.5625ZM19.5312 16.6875C19.5312 17.0566 19.2031 17.3438 18.875 17.3438H3.125C2.75586 17.3438 2.46875 17.0566 2.46875 16.6875V8.8125H19.5312V16.6875Z',
    label: 'Homepage',
    test: () => true,
  },
];

const PoliticianLinks = () => {
  const politician = useContext(PoliticianContext);

  return (
    <ScrollView style={styles.container}>
      {politician.links!.map((link, index) => {
        const type = linkTypes.find(type => type.test(link));

        return (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(link)}>
            <View style={styles.link}>
              {type && (
                <Icon
                  style={styles.icon}
                  icon={{viewBox: '0 0 24 24', d: type.icon}}
                />
              )}
              <Text style={styles.label}>{type?.label ?? link}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  icon: {
    color: Colors.foreground,
    width: 20,
    height: 20,
    marginRight: 8,
  },
  label: {
    color: Colors.foreground,
    fontSize: 13,
    fontFamily: 'Inter',
  },
});

export default PoliticianLinks;
