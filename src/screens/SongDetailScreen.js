import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ChordLine from '../components/ChordLine';
import { useFavourites } from '../context/FavouritesContext';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposeNote(note, steps) {
  const idx = NOTES.indexOf(note.replace('b', '#'));
  if (idx === -1) return note;
  return NOTES[(idx + steps + 12) % 12];
}

function transposeLine(chordLine, steps) {
  if (!chordLine || steps === 0) return chordLine;
  return chordLine.replace(/[A-G]#?b?m?\d*/g, (match) => {
    const noteMatch = match.match(/^([A-G]#?b?)/);
    if (!noteMatch) return match;
    const transposed = transposeNote(noteMatch[1], steps);
    return transposed + match.slice(noteMatch[1].length);
  });
}

const DIFFICULTY_COLOR = { Beginner: '#4caf50', Intermediate: '#ff9800', Advanced: '#f44336' };

export default function SongDetailScreen({ route, navigation }) {
  const { song } = route.params;
  const [transpose, setTranspose] = useState(0);
  const { toggle, isFavourite } = useFavourites();
  const fav = isFavourite(song.id);
  const currentKey = transposeNote(song.key, transpose);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0800" />

      {/* Hero header */}
      <LinearGradient colors={[...song.gradient, '#0f0800']} style={styles.hero}>
        <Ionicons name="musical-notes" size={100} color="rgba(255,255,255,0.05)" style={styles.heroBgIcon} />

        <View style={styles.heroTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggle(song)} style={styles.favBtn}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? '#d4873c' : '#fff'} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroInfo}>
          <Text style={styles.heroTitle}>{song.title}</Text>
          <Text style={styles.heroArtist}>{song.artist}</Text>
          <View style={styles.heroTags}>
            <View style={styles.keyTag}>
              <Ionicons name="musical-note" size={11} color="#d4873c" />
              <Text style={styles.keyTagText}>Key of {currentKey}</Text>
            </View>
            <View style={[styles.diffTag, { backgroundColor: DIFFICULTY_COLOR[song.difficulty] + '30' }]}>
              <Text style={[styles.diffTagText, { color: DIFFICULTY_COLOR[song.difficulty] }]}>{song.difficulty}</Text>
            </View>
            <View style={styles.catTag}>
              <Text style={styles.catTagText}>{song.category}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Transpose bar */}
      <View style={styles.transposeBar}>
        <View style={styles.chordScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {song.chords.map((c) => (
              <View key={c} style={styles.chordTag}>
                <Text style={styles.chordTagText}>{transposeLine(c, transpose)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.transposeControls}>
          <TouchableOpacity style={styles.transposeBtn} onPress={() => setTranspose((t) => t - 1)}>
            <Ionicons name="remove" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.transposeVal}>
            <Text style={styles.transposeLabel}>Capo</Text>
            <Text style={styles.transposeNum}>{transpose > 0 ? `+${transpose}` : transpose}</Text>
          </View>
          <TouchableOpacity style={styles.transposeBtn} onPress={() => setTranspose((t) => t + 1)}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chord sheet */}
      <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
        {((song.sheet || song.lines) || []).map((line, i) => {
          const chord = Array.isArray(line) ? line[0] : line.chord;
          const lyric = Array.isArray(line) ? line[1] : line.lyric;
          return (
            <ChordLine
              key={i}
              chord={transposeLine(chord, transpose)}
              lyric={lyric}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0800' },

  hero: { paddingBottom: 24 },
  heroBgIcon: { position: 'absolute', right: 0, bottom: 0 },
  heroTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  favBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  heroInfo: { paddingHorizontal: 20 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroArtist: { fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 14 },
  heroTags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  keyTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(212,135,60,0.2)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#d4873c50',
  },
  keyTagText: { fontSize: 12, color: '#d4873c', fontWeight: '700' },
  diffTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  diffTagText: { fontSize: 12, fontWeight: '700' },
  catTag: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  catTagText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },

  transposeBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a0e05', paddingVertical: 12, paddingLeft: 16,
    borderBottomWidth: 1, borderBottomColor: '#2a1a0a', gap: 12,
  },
  chordScroll: { flex: 1 },
  chordTag: { backgroundColor: '#2a1a0a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#3a2510' },
  chordTagText: { fontSize: 13, color: '#d4873c', fontWeight: '700' },
  transposeControls: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 16 },
  transposeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#d4873c', alignItems: 'center', justifyContent: 'center',
  },
  transposeVal: { alignItems: 'center', minWidth: 32 },
  transposeLabel: { fontSize: 9, color: '#555', fontWeight: '700', letterSpacing: 0.5 },
  transposeNum: { fontSize: 16, fontWeight: '800', color: '#fff' },

  sheet: { flex: 1, backgroundColor: '#0f0800' },
  sheetContent: { padding: 20, paddingBottom: 60 },
});
