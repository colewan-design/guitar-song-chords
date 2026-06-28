import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFavourites } from '../context/FavouritesContext';
import { useSongs } from '../context/SongsContext';

const DIFFICULTY_COLOR = { Beginner: '#4caf50', Intermediate: '#ff9800', Advanced: '#f44336' };

function SongCard({ song, onPress, onFav, fav }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      <LinearGradient colors={song.gradient} style={styles.cardThumb}>
        <Ionicons name="musical-notes" size={22} color="rgba(255,255,255,0.4)" />
      </LinearGradient>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{song.title}</Text>
        <Text style={styles.cardArtist}>{song.artist}</Text>
        <View style={styles.cardTags}>
          <View style={styles.keyTag}><Text style={styles.keyTagText}>Key {song.key}</Text></View>
          <View style={[styles.diffTag, { backgroundColor: DIFFICULTY_COLOR[song.difficulty] + '30' }]}>
            <Text style={[styles.diffTagText, { color: DIFFICULTY_COLOR[song.difficulty] }]}>{song.difficulty}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={onFav} style={styles.favBtn}>
        <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? '#d4873c' : '#444'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function DiscoverScreen({ navigation, route }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (route.params?.initialCategory) {
      setActiveCategory(route.params.initialCategory);
    }
  }, [route.params?.initialCategory]);
  const { toggle, isFavourite } = useFavourites();
  const { songs, categories, loading } = useSongs();

  const safeSongs = useMemo(
    () => (Array.isArray(songs) ? songs.filter((song) => song && song.id) : []),
    [songs]
  );
  const safeCategories = useMemo(
    () => {
      const normalized = (Array.isArray(categories) ? categories : []).filter(
        (category) => typeof category === 'string' && category.trim() && category !== 'All'
      );
      return ['All', ...new Set(normalized)];
    },
    [categories]
  );

  const filtered = useMemo(() => {
    let result = safeSongs;
    if (activeCategory !== 'All') result = result.filter((s) => s.category === activeCategory);
    const q = query.toLowerCase().trim();
    if (q) result = result.filter((s) =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      (s.chords || []).some((c) => c.toLowerCase().includes(q))
    );
    return result;
  }, [safeSongs, query, activeCategory]);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0800" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <View style={styles.headerMeta}>
            <Text style={styles.headerSub}>Loading songs...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0800" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.headerMeta}>
          <Text style={styles.headerSub}>{filtered.length} songs</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddSong')}>
            <Ionicons name="add" size={14} color="#fff" />
            <Text style={styles.addBtnText}>Add Song</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs, artists, chords..."
          placeholderTextColor="#555"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.catRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
          {safeCategories.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveCategory(item)}
              style={[styles.catChip, activeCategory === item && styles.catChipActive]}
            >
              <Text style={[styles.catChipText, activeCategory === item && styles.catChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SongCard
            song={item}
            onPress={() => navigation.navigate('Song', { songId: item.id })}
            onFav={() => toggle(item)}
            fav={isFavourite(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={48} color="#333" />
            <Text style={styles.emptyText}>No songs found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0800' },

  header: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: '#555', marginTop: 2 },
  headerMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#d4873c',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1e1005', borderRadius: 12,
    marginHorizontal: 20, marginVertical: 12,
    paddingHorizontal: 14, paddingVertical: 10, gap: 8,
  },
  searchIcon: {},
  searchInput: { flex: 1, fontSize: 14, color: '#fff' },

  catRow: { marginBottom: 8 },
  catContent: { paddingHorizontal: 20, gap: 8 },
  catChip: {
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#1e1005', borderWidth: 1, borderColor: '#2a1a0a',
  },
  catChipActive: { backgroundColor: '#d4873c', borderColor: '#d4873c' },
  catChipText: { fontSize: 13, color: '#666', fontWeight: '600' },
  catChipTextActive: { color: '#fff' },

  list: { paddingHorizontal: 20, paddingBottom: 30, gap: 10 },

  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a0e05',
    borderRadius: 14, padding: 12, gap: 14,
    borderWidth: 1, borderColor: '#2a1a0a',
  },
  cardThumb: { width: 54, height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cardArtist: { fontSize: 12, color: '#666', marginTop: 2 },
  cardTags: { flexDirection: 'row', gap: 6, marginTop: 6 },
  keyTag: { backgroundColor: '#2a1a0a', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  keyTagText: { fontSize: 11, color: '#d4873c', fontWeight: '600' },
  diffTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  diffTagText: { fontSize: 11, fontWeight: '600' },
  favBtn: { padding: 4 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: '#444' },
});
