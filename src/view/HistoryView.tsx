import React, {useContext, useEffect, useRef, useState} from 'react';
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
import PoliticianList from '../component/PoliticianList';
import {groupByDate} from '../utils/date';
import {useQuery} from 'react-query';
import {ApiSearchPolitician} from '../logic/api';
import {fetch_api} from '../logic/fetch';
import PoliticianRow from '../component/PoliticianRow';
import Icon from '../component/Icon';
import {SearchIcon} from '../icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {debounce} from 'lodash';

const HistoryView = () => {
  const [items, setItems] = useState<HistoryItem[] | null>(null);

  const data = useContext(DataContext);
  useEffect(() => {
    data.dbManager.getHistoryItems().then(setItems);
  }, [data]);
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef<TextInput>(null);
  const searchOverlayOpacity = useRef(new Animated.Value(0)).current;
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

  const debouncedSearch = useRef(
    // eslint-disable-next-line no-shadow
    debounce(searchInput => {
      setSearchInput(searchInput);
    }, 300),
  ).current;

  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const {data: search, status} = useQuery<
    ApiSearchPolitician[] | undefined,
    Error
  >(`search-${searchInput}`, () =>
    fetch_api<ApiSearchPolitician[]>(
      `search?text=${searchInput}&page=1&size=50`,
    ),
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

  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.iosSafeTop} />
      <View style={styles.header}>
        <Text style={styles.title}>Politiker</Text>
      </View>
      <Animated.View
        style={[
          styles.searchOverlay,
          {
            opacity: searchOverlayOpacity,
          },
        ]}
      />
      <SafeAreaView style={styles.header}>
        <KeyboardAvoidingView
          style={styles.searchWrapper}
          behavior="height"
          keyboardVerticalOffset={insets.top}>
          <View style={{flexDirection: 'row'}}>
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
                onChangeText={debouncedSearch}
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
            {searching && (
              <TouchableOpacity
                style={styles.searchBarButton}
                onPress={() => {
                  setSearchInput('');
                  inputRef.current!.focus();
                  stopSearching();
                }}>
                <Text style={styles.searchBarButtonText}>Abbrechen</Text>
              </TouchableOpacity>
            )}
          </View>
          {searching && search && status === 'success' && searchInput !== '' && (
            <View>
              <View style={styles.separatorLine} />
              <Text style={styles.searchResultTitle}>suchergebnisse</Text>
              <ScrollView
                style={styles.searchResultContainer}
                keyboardDismissMode="interactive">
                {search?.map(politician => (
                  <PoliticianRow
                    key={politician.id}
                    style={styles.searchItem}
                    politician={politician}
                    politicianId={politician.id}
                  />
                ))}
              </ScrollView>
            </View>
          )}
          {
            // TO-DO: Implement Error Screen when ready
            searching && !search && status === 'success' && (
              <Text style={styles.searchNoResult}>
                Es wurden keine Politiker:innen gefunden.
              </Text>
            )
          }
        </KeyboardAvoidingView>
      </SafeAreaView>
      <View style={styles.separatorLine} />
      <View style={[styles.historyContainer, searching && {opacity: 0.3}]}>
        <Text style={styles.subtitle}>Verlauf</Text>
        {items ? (
          items.length ? (
            <PoliticianList
              sections={[
                ...groupByDate(
                  items,
                  item => item.politicianId,
                  item => item.date,
                  (label, historyItems) => ({
                    title: label,
                    politicianIds: historyItems.map(item => item.politicianId),
                  }),
                ),
              ]}
            />
          ) : (
            <Text style={styles.noDataText}>
              Hier erscheinen Kandidat:innen, deren Wahlplakate du gescannt
              hast.
            </Text>
          )
        ) : (
          <Text style={styles.noDataText}>Laden...</Text>
        )}
      </View>
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
    color: '#FCFCFC',
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
  },
  searchBarContainer: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(70, 71, 80, 1)',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
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
  searchBarClearButton: {
    width: 24,
    height: 24,
    marginRight: 16,
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
    color: '#FCFCFC',
    paddingBottom: 8,
    letterSpacing: 0.7,
    backgroundColor: Colors.background,
    padding: 12,
  },
  searchResultContainer: {
    height: '80%',
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
  },
  searchNoResult: {
    fontFamily: 'Inter',
    fontSize: 17,
    marginHorizontal: 16,
    marginVertical: 8,
    color: Colors.foreground,
  },
  searchItem: {
    marginBottom: 12,
  },
});

export default HistoryView;
