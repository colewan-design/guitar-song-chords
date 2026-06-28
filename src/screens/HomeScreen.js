import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSongs } from '../context/SongsContext';

const CATEGORY_STYLE = {
  Gospel:       { colors: ['#5C1A00', '#1A0800'], icon: 'heart' },
  Folk:         { colors: ['#1A1A5C', '#08081A'], icon: 'leaf' },
  OPM:          { colors: ['#005C1A', '#001A08'], icon: 'flag' },
  Imported:     { colors: ['#2C1A5C', '#0A0818'], icon: 'globe' },
  Pop:          { colors: ['#5C005C', '#1A001A'], icon: 'musical-notes' },
  Rock:         { colors: ['#3A0000', '#1A0000'], icon: 'flash' },
  Country:      { colors: ['#3A2200', '#1A1000'], icon: 'sunny' },
  Jazz:         { colors: ['#001A3A', '#000A1A'], icon: 'cafe' },
  Classical:    { colors: ['#1A1A00', '#0A0A00'], icon: 'ribbon' },
  Default:      { colors: ['#1a0e05', '#0f0800'], icon: 'musical-note' },
};

function getCategoryStyle(cat) {
  return CATEGORY_STYLE[cat] || CATEGORY_STYLE.Default;
}

const { width } = Dimensions.get('window');
const CARD_W = width - 48;

const STORIES = [
  { id: '1', name: 'John', icon: 'person' },
  { id: '2', name: 'Maria', icon: 'person' },
  { id: '3', name: 'Alex', icon: 'person' },
  { id: '4', name: 'Sam', icon: 'person' },
  { id: '5', name: 'Chris', icon: 'person' },
];

function CategoryCard({ category, count, onPress }) {
  const { colors, icon } = getCategoryStyle(category);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.catCard}>
      <LinearGradient colors={colors} style={styles.catCardGradient}>
        <Ionicons name={icon} size={28} color="rgba(255,255,255,0.25)" style={styles.catCardIcon} />
        <Text style={styles.catCardName}>{category}</Text>
        <Text style={styles.catCardCount}>{count} songs</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function TrendingCard({ song, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.trendingCard}>
      <LinearGradient colors={song.gradient} style={styles.trendingGradient}>
        <Ionicons name="musical-notes" size={64} color="rgba(255,255,255,0.08)" style={styles.bgIcon} />
        <View style={styles.trendingBadge}>
          <Ionicons name="trending-up" size={11} color="#fff" />
          <Text style={styles.trendingBadgeText}>TRENDING</Text>
        </View>
        <View style={styles.trendingBottom}>
          <Text style={styles.trendingTitle}>{song.title}</Text>
          <Text style={styles.trendingArtist}>{song.artist}</Text>
          <View style={styles.trendingMeta}>
            <View style={styles.chordPills}>
              {song.chords.slice(0, 3).map((c) => (
                <View key={c} style={styles.chordPill}>
                  <Text style={styles.chordPillText}>{c}</Text>
                </View>
              ))}
            </View>
            <View style={styles.avatarGroup}>
              {[...Array(3)].map((_, i) => (
                <View key={i} style={[styles.miniAvatar, { marginLeft: i === 0 ? 0 : -8 }]}>
                  <Ionicons name="person" size={10} color="#ccc" />
                </View>
              ))}
              <Text style={styles.avatarCount}>+25</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function FeaturedCard({ song, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.featuredCard}>
      <LinearGradient colors={song.gradient} style={styles.featuredGradient}>
        <Ionicons name="musical-notes" size={40} color="rgba(255,255,255,0.15)" style={styles.featuredIcon} />
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredLabel}>Featured Song</Text>
          <Text style={styles.featuredTitle}>{song.title}</Text>
          <Text style={styles.featuredSub}>{song.chords.length} chords • {song.difficulty}</Text>
        </View>
        <TouchableOpacity style={styles.playBtn} onPress={onPress}>
          <Text style={styles.playBtnText}>PLAY</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { songs, categories, loading } = useSongs();
  const trending = songs.slice(0, 2);
  const featured = songs[2] || songs[0];

  const categorycounts = useMemo(() => {
    const counts = {};
    for (const s of songs) {
      if (s.category) counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [songs]);

  const browseCategories = useMemo(
    () => categories.filter((c) => c !== 'All'),
    [categories]
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0800" />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Good evening</Text>
            <Text style={styles.headerTitle}>Guitar Chords</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading your song library...</Text>
        </View>
      </View>
    );
  }

  if (!featured) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0800" />
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Good evening</Text>
            <Text style={styles.headerTitle}>Guitar Chords</Text>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No songs in the library yet.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0800" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Good evening</Text>
            <Text style={styles.headerTitle}>Guitar Chords</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color="#d4873c" />
          </TouchableOpacity>
        </View>

        {/* Community Stories */}
        <Text style={styles.sectionTitle}>Community Stories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesRow} contentContainerStyle={styles.storiesContent}>
          {STORIES.map((s) => (
            <View key={s.id} style={styles.storyItem}>
              <LinearGradient colors={['#d4873c', '#7a3d0e']} style={styles.storyRing}>
                <View style={styles.storyAvatar}>
                  <Ionicons name="person" size={22} color="#ccc" />
                </View>
              </LinearGradient>
              <Text style={styles.storyName}>{s.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Trending */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {trending.map((song) => (
          <TrendingCard
            key={song.id}
            song={song}
            onPress={() => navigation.navigate('Song', { songId: song.id })}
          />
        ))}

        {/* Featured */}
        <Text style={styles.sectionTitle}>Made for You</Text>
        <FeaturedCard song={featured} onPress={() => navigation.navigate('Song', { songId: featured.id })} />

        {/* Quick picks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Picks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {songs.slice(3, 6).map((song) => (
          <TouchableOpacity
            key={song.id}
            style={styles.quickRow}
            onPress={() => navigation.navigate('Song', { songId: song.id })}
            activeOpacity={0.75}
          >
            <LinearGradient colors={song.gradient} style={styles.quickThumb}>
              <Ionicons name="musical-note" size={20} color="rgba(255,255,255,0.5)" />
            </LinearGradient>
            <View style={styles.quickInfo}>
              <Text style={styles.quickTitle}>{song.title}</Text>
              <Text style={styles.quickArtist}>{song.artist} • {song.difficulty}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#555" />
          </TouchableOpacity>
        ))}

        {/* Browse by Category */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catCardRow}>
          {browseCategories.map((cat) => (
            <CategoryCard
              key={cat}
              category={cat}
              count={categorycounts[cat] || 0}
              onPress={() => navigation.navigate('Discover', { initialCategory: cat })}
            />
          ))}
        </ScrollView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0800' },
  scroll: { paddingBottom: 30 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 54, paddingBottom: 16,
  },
  headerGreeting: { fontSize: 13, color: '#888', marginBottom: 2 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  notifBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#1e1005', alignItems: 'center', justifyContent: 'center',
  },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  seeAll: { fontSize: 13, color: '#d4873c', fontWeight: '600' },

  catCardRow: { paddingHorizontal: 20, paddingBottom: 8, gap: 12 },
  catCard: { width: 130, borderRadius: 16, overflow: 'hidden' },
  catCardGradient: { height: 100, padding: 14, justifyContent: 'flex-end' },
  catCardIcon: { position: 'absolute', top: 10, right: 10 },
  catCardName: { fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 2 },
  catCardCount: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },

  storiesRow: { marginBottom: 4 },
  storiesContent: { paddingHorizontal: 20, gap: 16 },
  storyItem: { alignItems: 'center', gap: 6 },
  storyRing: { width: 58, height: 58, borderRadius: 29, padding: 2, alignItems: 'center', justifyContent: 'center' },
  storyAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#2a1a0a', alignItems: 'center', justifyContent: 'center' },
  storyName: { fontSize: 11, color: '#888' },

  trendingCard: { marginHorizontal: 20, marginBottom: 12, borderRadius: 16, overflow: 'hidden', elevation: 6 },
  trendingGradient: { height: 180, padding: 16, justifyContent: 'space-between' },
  bgIcon: { position: 'absolute', right: 12, top: 12 },
  trendingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#d4873c', alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, gap: 4 },
  trendingBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  trendingBottom: { gap: 4 },
  trendingTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  trendingArtist: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  trendingMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  chordPills: { flexDirection: 'row', gap: 6 },
  chordPill: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  chordPillText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  avatarGroup: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#333', borderWidth: 1, borderColor: '#555', alignItems: 'center', justifyContent: 'center' },
  avatarCount: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginLeft: 6 },

  featuredCard: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', elevation: 6, marginBottom: 4 },
  featuredGradient: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 14 },
  featuredIcon: { position: 'absolute', right: 16, opacity: 0.4 },
  featuredInfo: { flex: 1 },
  featuredLabel: { fontSize: 11, color: '#d4873c', fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  featuredTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  featuredSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  playBtn: { backgroundColor: '#d4873c', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  playBtnText: { fontSize: 12, fontWeight: '800', color: '#fff', letterSpacing: 1 },

  quickRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingVertical: 10, gap: 14,
  },
  quickThumb: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickInfo: { flex: 1 },
  quickTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  quickArtist: { fontSize: 12, color: '#666', marginTop: 2 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' },
});
