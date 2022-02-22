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

const awLink: LinkType = {
  icon: 'M20.059.505H3.915C3.018.506 2.158.865 1.524 1.502.889 2.139.532 3.002.531 3.903V20.102C.532 21.002.889 21.865 1.524 22.502 2.158 23.138 3.018 23.495 3.915 23.495H20.085C20.527 23.5 20.965 23.417 21.375 23.25 21.785 23.084 22.158 22.838 22.472 22.527 22.787 22.215 23.037 21.844 23.208 21.435 23.379 21.026 23.468 20.587 23.469 20.143V3.903C23.468 3.002 23.111 2.139 22.476 1.502 21.842.865 20.982.506 20.085.505H20.059ZM21.752 19.704C21.756 19.977 21.705 20.248 21.603 20.5 21.501 20.753 21.35 20.983 21.158 21.176 20.966 21.369 20.738 21.522 20.486 21.625 20.235 21.728 19.965 21.779 19.693 21.776H4.281C4.009 21.779 3.74 21.728 3.488 21.625 3.237 21.522 3.008 21.369 2.816 21.176 2.625 20.983 2.473 20.753 2.371 20.5 2.269 20.248 2.219 19.977 2.223 19.704V4.296C2.22 4.024 2.27 3.753 2.373 3.501 2.475 3.249 2.626 3.02 2.818 2.827 3.01 2.635 3.238 2.482 3.489 2.38 3.741 2.277 4.01 2.226 4.281 2.23H19.668C19.939 2.226 20.208 2.277 20.46 2.38 20.711 2.482 20.939 2.635 21.131 2.827 21.323 3.02 21.474 3.249 21.576 3.501 21.679 3.753 21.73 4.024 21.726 4.296L21.752 19.704ZM16.599 7.612C15.583 6.508 14.208 5.802 12.722 5.622L12.844 3.582C14.85 3.79 16.714 4.715 18.098 6.189 19.5 7.674 20.333 9.61 20.451 11.653H18.388C18.266 10.132 17.625 8.699 16.573 7.597L16.599 7.612ZM11.832 3.515 11.746 5.587C10.082 5.588 8.485 6.241 7.294 7.408L5.892 5.918C7.479 4.362 9.614 3.498 11.832 3.515ZM16.365 16.903C16.882 16.453 17.304 15.903 17.605 15.286L19.582 15.908C19.124 16.835 18.51 17.676 17.768 18.393L16.365 16.903ZM19.922 15.036 17.986 14.418C18.23 13.825 18.369 13.193 18.398 12.551H20.461C20.434 13.405 20.252 14.248 19.922 15.036ZM14.841 10.352 16.324 8.903C16.943 9.719 17.315 10.697 17.397 11.719H15.333C15.253 11.235 15.081 10.771 14.825 10.352H14.841ZM15.278 12.638H17.341C17.247 14.009 16.643 15.295 15.649 16.24L14.251 14.745C14.819 14.18 15.178 13.436 15.267 12.638H15.278ZM7.98 8.148C8.473 7.655 9.058 7.266 9.702 7.003 10.346 6.74 11.036 6.609 11.731 6.617L11.609 8.689C10.777 8.724 9.986 9.061 9.383 9.638L7.98 8.148ZM14.251 9.638C13.754 9.175 13.138 8.861 12.473 8.73L12.6 6.658C13.765 6.832 14.847 7.367 15.694 8.189L14.251 9.638Z',
  label: 'Abgeordnetenwatch',
  test: link => link.includes('abgeordnetenwatch.de'),
};

const linkTypes: LinkType[] = [
  {
    icon: 'M10.54 9.698C10.441 9.896 9.302 11.926 7.074 15.837 6.827 16.233 6.53 16.431 6.183 16.431H2.965C2.619 16.431 2.371 16.084 2.569 15.738L5.985 9.748C5.985 9.748 5.985 9.748 5.985 9.698L3.807 5.985C3.609 5.589 3.807 5.292 4.203 5.292H7.47C7.817 5.292 8.114 5.49 8.361 5.886L10.54 9.698ZM21.431 1.629 14.302 14.153 18.856 22.371C19.054 22.767 18.856 23.114 18.411 23.114H15.193C14.797 23.114 14.5 22.916 14.302 22.47L9.748 14.153C9.896 13.856 12.272 9.649 16.876 1.53 17.124 1.134 17.421.886 17.767.886H21.035C21.431.886 21.629 1.233 21.431 1.629Z',
    label: 'Xing',
    test: link => link.includes('xing'),
  },
  {
    icon: 'M20.735.883H3.265C1.925.883 .883 1.975.883 3.265V20.735C.883 22.075 1.925 23.117 3.265 23.117H10.064V15.573H6.938V12H10.064V9.32C10.064 6.243 11.901 4.506 14.68 4.506 16.07 4.506 17.459 4.754 17.459 4.754V7.782H15.921C14.382 7.782 13.886 8.724 13.886 9.717V12H17.31L16.764 15.573H13.886V23.117H20.735C22.025 23.117 23.117 22.075 23.117 20.735V3.265C23.117 1.975 22.025.883 20.735.883Z',
    label: 'Facebook',
    test: link => link.includes('facebook'),
  },
  {
    icon: 'M22.726 6.627C22.479 5.643 21.7 4.863 20.757 4.617 18.993 4.125 12.02 4.125 12.02 4.125 12.02 4.125 5.007 4.125 3.243 4.617 2.3 4.863 1.52 5.643 1.274 6.627.782 8.35.782 12.041.782 12.041.782 12.041.782 15.691 1.274 17.455 1.52 18.44 2.3 19.178 3.243 19.424 5.007 19.875 12.02 19.875 12.02 19.875 12.02 19.875 18.993 19.875 20.757 19.424 21.7 19.178 22.479 18.44 22.726 17.455 23.218 15.691 23.218 12.041 23.218 12.041 23.218 12.041 23.218 8.35 22.726 6.627ZM9.724 15.363V8.719L15.548 12.041 9.724 15.363Z',
    label: 'YouTube',
    test: link => link.includes('youtube'),
  },
  {
    icon: 'M23.95 4.375 23.913 4.338 19.178 4.3V4.822C19.551 4.822 20.595 5.009 20.93 5.866L16.344 16.419C16.12 15.896 14.032 11.161 13.771 10.564L15.971 5.978C16.456 5.27 17.313 4.822 18.134 4.822V4.3C17.686 4.3 15.225 4.3 13.547 4.338 13.547 4.449 13.547 4.71 13.547 4.822 14.852 4.86 15.337 5.158 15.002 5.941 14.48 7.097 13.398 9.297 13.212 9.67 12.541 8.327 12.093 7.283 11.385 5.792 11.086 5.083 11.758 4.822 12.503 4.822V4.338L7.171 4.3V4.822C7.917 4.822 8.887 4.897 9.259 5.568 9.781 6.537 11.459 10.49 11.981 11.534 11.31 12.764 9.744 15.747 9.185 16.866 8.365 15.039 5.307 7.954 4.487 6.09 4.151 5.307 5.382 4.86 6.09 4.822V4.3H.05C.05 4.449.087 4.71.087 4.822 1.056 4.822 2.473 6.426 2.883 7.432 4.636 11.534 6.5 15.598 8.215 19.662 8.215 19.7 8.775 19.7 8.775 19.7 9.931 17.351 11.273 14.852 12.503 12.503L15.561 19.7H16.046C17.985 15.263 20.893 8.476 21.825 6.314 22.235 5.419 22.869 4.86 23.913 4.822L23.95 4.375Z',
    label: 'Wikipedia',
    test: link => link.includes('wikipedia'),
  },
  {
    icon: 'M20.347 7.714C21.167 7.099 21.905 6.36 22.48 5.499 21.741 5.827 20.88 6.073 20.019 6.155 20.921 5.622 21.577 4.802 21.905 3.776 21.085 4.269 20.142 4.638 19.198 4.843 18.378 3.981 17.271 3.489 16.04 3.489 13.661 3.489 11.733 5.417 11.733 7.796 11.733 8.124 11.774 8.452 11.856 8.78 8.288 8.575 5.089 6.853 2.956 4.269 2.587 4.884 2.382 5.622 2.382 6.442 2.382 7.919 3.12 9.231 4.31 10.011 3.612 9.97 2.915 9.806 2.341 9.478V9.519C2.341 11.61 3.817 13.333 5.786 13.743 5.458 13.825 5.048 13.907 4.679 13.907 4.392 13.907 4.146 13.866 3.858 13.825 4.392 15.548 5.991 16.778 7.878 16.819 6.401 17.968 4.556 18.665 2.546 18.665 2.177 18.665 1.849 18.624 1.521 18.583 3.407 19.814 5.663 20.511 8.124 20.511 16.04 20.511 20.347 13.989 20.347 8.288 20.347 8.083 20.347 7.919 20.347 7.714Z',
    label: 'Twitter',
    test: link => link.includes('twitter'),
  },
  {
    icon: 'M12.025 6.268C8.849 6.268 6.317 8.849 6.317 11.975 6.317 15.151 8.849 17.683 12.025 17.683 15.151 17.683 17.732 15.151 17.732 11.975 17.732 8.849 15.151 6.268 12.025 6.268ZM12.025 15.697C9.99 15.697 8.303 14.06 8.303 11.975 8.303 9.94 9.94 8.303 12.025 8.303 14.06 8.303 15.697 9.94 15.697 11.975 15.697 14.06 14.06 15.697 12.025 15.697ZM19.271 6.069C19.271 5.325 18.675 4.729 17.931 4.729 17.186 4.729 16.591 5.325 16.591 6.069 16.591 6.814 17.186 7.409 17.931 7.409 18.675 7.409 19.271 6.814 19.271 6.069ZM23.042 7.409C22.943 5.623 22.546 4.035 21.256 2.744 19.965 1.454 18.377 1.057 16.591.958 14.754.858 9.246.858 7.409.958 5.623 1.057 4.084 1.454 2.744 2.744 1.454 4.035 1.057 5.623.958 7.409.858 9.246.858 14.754.958 16.591 1.057 18.377 1.454 19.916 2.744 21.256 4.084 22.546 5.623 22.943 7.409 23.042 9.246 23.142 14.754 23.142 16.591 23.042 18.377 22.943 19.965 22.546 21.256 21.256 22.546 19.916 22.943 18.377 23.042 16.591 23.142 14.754 23.142 9.246 23.042 7.409ZM20.66 18.526C20.313 19.519 19.519 20.263 18.576 20.66 17.087 21.256 13.613 21.107 12.025 21.107 10.387 21.107 6.913 21.256 5.474 20.66 4.481 20.263 3.737 19.519 3.34 18.526 2.744 17.087 2.893 13.613 2.893 11.975 2.893 10.387 2.744 6.913 3.34 5.424 3.737 4.481 4.481 3.737 5.474 3.34 6.913 2.744 10.387 2.893 12.025 2.893 13.613 2.893 17.087 2.744 18.576 3.34 19.519 3.687 20.263 4.481 20.66 5.424 21.256 6.913 21.107 10.387 21.107 11.975 21.107 13.613 21.256 17.087 20.66 18.526Z',
    label: 'Instagram',
    test: link => link.includes('instagram'),
  },
  {
    icon: 'M22.106 9.925V5.999C22.061 5.999 22.061 5.999 22.061 5.999 20.978 5.999 19.941 5.684 19.083 5.097 17.82 4.285 16.918 2.977 16.647 1.488 16.557 1.172 16.557.856 16.557.54 16.557.495 16.557.495 16.557.45H12.587V16.241C12.587 18.091 11.053 19.625 9.203 19.625 7.353 19.625 5.819 18.091 5.819 16.241 5.819 14.391 7.353 12.857 9.203 12.857 9.564 12.857 9.879 12.902 10.24 13.038V8.977C9.879 8.932 9.564 8.887 9.203 8.887 5.142 8.887 1.894 12.181 1.894 16.241 1.894 20.302 5.142 23.55 9.203 23.55 13.263 23.55 16.557 20.302 16.557 16.241V8.165C18.091 9.293 19.986 9.925 22.061 9.925H22.106Z',
    label: 'TikTok',
    test: link => link.includes('tiktok'),
  },
  {
    icon: 'M21.504.912H2.491C1.62.912 .912 1.63.912 2.512v18.978C.912 22.37 1.62 23.088 2.491 23.088H21.504c.871 0 1.584-.718 1.584-1.598V2.512c0-.881-.713-1.598-1.584-1.598zM7.614 19.92H4.327V9.337h3.292V19.92zm-1.643-12.029c-1.055 0-1.906-.857-1.906-1.906S4.916 4.08 5.971 4.08c1.05 0 1.906.855 1.906 1.906 0 1.055-.852 1.906-1.906 1.906zm13.965 12.029h-3.287V14.772c0-1.228-.024-2.807-1.708-2.807-1.712 0-1.975 1.337-1.975 2.717V19.92h-3.287V9.337h3.154v1.445h.044c.44-.832 1.514-1.708 3.114-1.708 3.326 0 3.944 2.194 3.944 5.043V19.92z',
    label: 'LinkedIn',
    test: link => link.includes('linkedin'),
  },
  {
    icon: 'M20.269 2.353H3.731C2.181 2.353.975 3.602.975 5.109V18.891C.975 20.441 2.181 21.647 3.731 21.647H20.269C21.776 21.647 23.025 20.441 23.025 18.891V5.109C23.025 3.602 21.776 2.353 20.269 2.353ZM13.378 5.109C14.11 5.109 14.756 5.755 14.756 6.488 14.756 7.263 14.11 7.866 13.378 7.866 12.603 7.866 12 7.263 12 6.488 12 5.755 12.603 5.109 13.378 5.109ZM9.244 5.109C9.976 5.109 10.622 5.755 10.622 6.488 10.622 7.263 9.976 7.866 9.244 7.866 8.469 7.866 7.866 7.263 7.866 6.488 7.866 5.755 8.469 5.109 9.244 5.109ZM5.109 5.109C5.842 5.109 6.488 5.755 6.488 6.488 6.488 7.263 5.842 7.866 5.109 7.866 4.334 7.866 3.731 7.263 3.731 6.488 3.731 5.755 4.334 5.109 5.109 5.109ZM20.958 18.891C20.958 19.278 20.613 19.58 20.269 19.58H3.731C3.344 19.58 3.042 19.278 3.042 18.891V10.622H20.958V18.891Z',
    label: 'Homepage',
    test: () => true,
  },
];

const PoliticianLinks = () => {
  const politician = useContext(PoliticianContext);
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(politician?.profile?.abgeordnetenwatch_url!)
        }>
        <View style={styles.link}>
          <Icon
            style={styles.icon}
            icon={{viewBox: '0 0 24 24', d: awLink.icon}}
          />
          <Text style={styles.label}>{awLink.label}</Text>
        </View>
      </TouchableOpacity>
      {politician?.profile?.weblinks?.map((link, index) => {
        const type = linkTypes.find(type => type.test(link.link));
        return (
          <TouchableOpacity
            key={index}
            onPress={() => Linking.openURL(link.link)}>
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
    backgroundColor: Colors.background,
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
