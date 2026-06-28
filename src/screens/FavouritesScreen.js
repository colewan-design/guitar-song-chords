import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFavourites } from '../context/FavouritesContext';

export default function FavouritesScreen({ navigation }) {
  const { favourites, toggle } = useFavourites();

  if (favourites.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0800" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favourites</Text>
        </View>
        <View style={styles.emptyState}>
          <LinearGradient colors={['#1e1005', '#0f0800']} style={styles.emptyGuitarBox}>
            <Ionicons name="musical-notes" size={80} color="#2a1a0a" />
          </LinearGradient>
          <Text style={styles.emptyTitle}>You have no favourites yet</Text>
          <Text style={styles.emptyDesc}>
            Tap the heart icon on any song to save it here for quick access.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0800" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourites</Text>
        <Text style={styles.headerSub}>{favourites.length} saved</Text>
      </View>
      <FlatList
        data={favourites}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Song', { songId: item.id })}
            activeOpacity={0.8}
          >
            <LinearGradient colors={item.gradient} style={styles.thumb}>
              <Ionicons name="musical-notes" size={22} color="rgba(255,255,255,0.4)" />
            </LinearGradient>
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
              <Text style={styles.meta}>{item.chords.join(' · ')}</Text>
            </View>
            <TouchableOpacity onPress={() => toggle(item)} style={styles.removeBtn}>
              <Ionicons name="heart" size={22} color="#d4873c" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0800' },

  header: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 16 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 13, color: '#555', marginTop: 2 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 20 },
  emptyGuitarBox: {
    width: 160, height: 200, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center' },
  emptyDesc: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 22 },

  list: { paddingHorizontal: 20, paddingBottom: 30, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a0e05',
    borderRadius: 14, padding: 12, gap: 14,
    borderWidth: 1, borderColor: '#2a1a0a',
  },
  thumb: { width: 54, height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: '#fff' },
  artist: { fontSize: 12, color: '#666', marginTop: 2 },
  meta: { fontSize: 11, color: '#d4873c', marginTop: 4, fontWeight: '600' },
  removeBtn: { padding: 4 },
});
