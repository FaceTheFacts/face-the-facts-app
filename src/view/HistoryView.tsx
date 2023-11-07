import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../theme';
import {HistoryItem} from '../logic/db';
import {DataContext} from '../logic/model';
import PoliticianList from '../component/politician/PoliticianList';
import {useQuery} from 'react-query';
import {ApiPoliticianHeader} from '../logic/api';
import {fetch_api} from '../logic/fetch';
import Icon from '../component/Icon';
import {SearchIcon} from '../icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import PoliticianItem from '../component/politician/PoliticianItem';
import SkeletonPoliticianItem from '../component/skeleton/SkeletonPoliticianItem';
import ErrorCard from '../component/Error';
import {isZipCode} from '../utils/util';

const HistoryView = () => {
  const data = useContext(DataContext);
  const insets = useSafeAreaInsets();
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newSearch, setNewSearch] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const searchOverlayOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    data.dbManager.getHistoryItems().then(setItems);
  }, [data]);

  useEffect(() => {
    if (searching) {
      Animated.spring(searchOverlayOpacity, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(searchOverlayOpacity, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching]);

  const {
    data: searchData,
    status,
    isError,
  } = useQuery<ApiPoliticianHeader[] | undefined, Error>(
    `search-${searchQuery}`,
    () => {
      const route = isZipCode(searchQuery) ? 'search-zipcode' : 'search-name';
      return fetch_api<ApiPoliticianHeader[]>(
        `${route}?text=${encodeURIComponent(searchQuery)}`,
      );
    },
    {enabled: newSearch},
  );

  function startSearching(): void {
    setSearching(true);
  }

  function stopSearching(): void {
    setSearching(false);
    setSearchInput('');
    inputRef.current?.blur();
  }

  useEffect(() => {
    if (!searching) {
      return;
    }

    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      stopSearching();
      return true;
    });
    return () => handler.remove();
  }, [searching]);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      if (searchInput.length > 0) {
        setSearchQuery(searchInput);
        setNewSearch(true);
      } else {
        setSearchInput('');
        setNewSearch(false);
      }
      timeout.current = null;
    }, 800);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [searchInput]);

  useFocusEffect(
    useCallback(() => {
      setSearchInput('');
      stopSearching();
    }, []),
  );

  if (isError) {
    return <ErrorCard />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <Text style={styles.title}>Politiker:innen</Text>
      </View>
      <Animated.View
        style={[
          styles.searchOverlay,
          {
            opacity: searchOverlayOpacity,
          },
        ]}
      />
      <View style={styles.searchBarContainerWrapper}>
        <View
          style={StyleSheet.flatten([
            styles.searchBarContainer,
            insets.top <= 20 && {marginTop: 16},
          ])}>
          <Icon style={styles.searchBarIcon} icon={SearchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchBarInput}
            placeholder="Suche"
            placeholderTextColor={Colors.foreground}
            onFocus={startSearching}
            onBlur={() => setSearching(searchInput !== '')}
            value={searchInput}
            onChangeText={setSearchInput}
            autoCompleteType="off"
            dataDetectorTypes="none"
            textContentType="none"
            spellCheck={false}
            autoCorrect={false}
            autoCapitalize="words"
            returnKeyType="search"
            keyboardAppearance="dark"
          />
        </View>
        {
          // Display cancel button if search is active
          searching && (
            <TouchableOpacity
              style={styles.searchBarButton}
              onPress={() => {
                setSearchInput('');
                stopSearching();
              }}>
              <Text style={styles.searchBarButtonText}>Abbrechen</Text>
            </TouchableOpacity>
          )
        }
      </View>
      <View style={styles.separatorLine} />
      {
        // StartScreen displaying search history
        (!searching || (searching && searchInput.length < 1)) &&
          status !== 'loading' && (
            <View
              style={[styles.historyContainer, searching && {opacity: 0.3}]}>
              <Text style={styles.subtitle}>Verlauf</Text>
              {items ? (
                items.length ? (
                  <PoliticianList
                    politicianIds={items.map(item => item.politicianId)}
                  />
                ) : (
                  <Text style={styles.noDataText}>
                    Hier erscheinen Kandidat:innen, deren Wahlplakate du
                    gescannt hast.
                  </Text>
                )
              ) : (
                <SkeletonPoliticianItem />
              )}
            </View>
          )
      }
      {
        // Start search
        searching && (
          <KeyboardAvoidingView
            style={styles.searchWrapper}
            behavior="height"
            keyboardVerticalOffset={insets.top}>
            {!searchData &&
              status === 'success' &&
              searchInput === searchQuery && (
                <View style={styles.noResultContainer}>
                  <Text style={styles.searchNoResult}>Keine Ergebnisse</Text>
                </View>
              )}
            {
              // Search loading
              (status === 'loading' ||
                (searchInput.length > 0 &&
                  (searchInput !== searchQuery || searchQuery === ''))) && (
                <>
                  <View style={styles.separatorLine} />
                  <Text style={styles.searchResultTitle}>suchergebnisse</Text>
                  <View style={styles.searchResultSkeletonContainer}>
                    <SkeletonPoliticianItem />
                  </View>
                </>
              )
            }
            {
              // Search successful and displaying results
              searchData &&
                status === 'success' &&
                searchInput.length > 0 &&
                searchInput === searchQuery &&
                newSearch && (
                  <>
                    <View style={styles.separatorLine} />
                    <Text style={styles.searchResultTitle}>suchergebnisse</Text>
                    <ScrollView
                      style={styles.searchResultContainer}
                      keyboardDismissMode="interactive"
                      showsVerticalScrollIndicator={false}>
                      {searchData?.map(politician => (
                        <PoliticianItem
                          key={politician.id}
                          politicianId={politician.id}
                          politicianName={politician.label}
                          party={politician.party}
                        />
                      ))}
                    </ScrollView>
                  </>
                )
            }
          </KeyboardAvoidingView>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iosSafeTop: {
    flex: 0,
    backgroundColor: Colors.cardBackground,
  },
  header: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 4,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 26,
    fontWeight: '400',
    color: Colors.foreground,
  },
  separatorLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  historyContainer: {
    padding: 12,
    height: '78%',
  },
  subtitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    color: Colors.baseWhite,
    paddingBottom: 8,
    letterSpacing: 0.7,
    backgroundColor: Colors.background,
  },
  noDataText: {
    fontFamily: 'Inter',
    fontSize: 17,
    opacity: 0.7,
    color: Colors.foreground,
    marginLeft: 16,
    marginBottom: 100,
  },
  searchWrapper: {
    maxHeight: '100%',
    backgroundColor: Colors.cardBackground,
  },
  searchBarContainer: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(70, 71, 80, 1)',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
  },
  searchBarContainerWrapper: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
  },
  searchBarButton: {
    marginRight: 12,
    alignSelf: 'center',
  },
  searchBarButtonText: {
    color: Colors.foreground,
    fontWeight: '600',
    fontSize: 13,
  },
  searchBarIcon: {
    width: 24,
    height: 24,
    marginLeft: 12,
    color: Colors.foreground,
  },
  searchBarInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 12,
    color: Colors.foreground,
  },
  searchOverlay: {
    backgroundColor: Colors.background,
  },
  searchResultTitle: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    color: Colors.baseWhite,
    paddingBottom: 8,
    letterSpacing: 0.7,
    backgroundColor: Colors.background,
    padding: 12,
  },
  searchResultContainer: {
    height: '72%',
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  searchResultSkeletonContainer: {
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  searchNoResult: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.foreground,
  },
  noResultContainer: {
    backgroundColor: Colors.background,
    padding: 12,
  },
});

export default HistoryView;
