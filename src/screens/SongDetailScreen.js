import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
  Animated, TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ChordLine from '../components/ChordLine';
import { useFavourites } from '../context/FavouritesContext';
import { useSongs } from '../context/SongsContext';

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
    return transposeNote(noteMatch[1], steps) + match.slice(noteMatch[1].length);
  });
}

const DIFFICULTY_COLOR = { Beginner: '#4caf50', Intermediate: '#ff9800', Advanced: '#f44336' };
const SCROLL_SPEEDS = [25, 50, 90]; // px/sec: slow, medium, fast
const SPEED_LABELS = ['Slow', 'Med', 'Fast'];

export default function SongDetailScreen({ route, navigation }) {
  const { songId } = route.params;
  const { songs } = useSongs();
  const song = songs.find((s) => s.id === songId);
  const [transpose, setTranspose] = useState(0);
  const [autoScroll, setAutoScroll] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [toolbarsVisible, setToolbarsVisible] = useState(true);
  const { toggle, isFavourite } = useFavourites();
  const scrollRef = useRef(null);
  const scrollYRef = useRef(0);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const toolbarAnim = useRef(new Animated.Value(1)).current;

  const toggleToolbars = () => {
    const toValue = toolbarsVisible ? 0 : 1;
    setToolbarsVisible(!toolbarsVisible);
    Animated.timing(toolbarAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const fav = isFavourite(song?.id);
  const currentKey = song ? transposeNote(song.key, transpose) : '';

  if (!song) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0800" />
        <Text style={{ color: '#fff', fontSize: 16 }}>Song not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#d4873c', fontWeight: '700' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    if (!autoScroll) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const speed = SCROLL_SPEEDS[speedIdx];
    const step = (timestamp) => {
      if (lastTimeRef.current == null) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      scrollYRef.current += speed * delta;
      scrollRef.current?.scrollTo({ y: scrollYRef.current, animated: false });
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
    };
  }, [autoScroll, speedIdx]);

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
          <View style={styles.heroTopRight}>
            <TouchableOpacity onPress={toggleToolbars} style={styles.toolbarToggleBtn}>
              <Ionicons name={toolbarsVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggle(song)} style={styles.favBtn}>
              <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? '#d4873c' : '#fff'} />
            </TouchableOpacity>
          </View>
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

      {/* Row 1: Chord pills */}
      <Animated.View style={[styles.chordBar, { opacity: toolbarAnim, maxHeight: toolbarAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }), overflow: 'hidden' }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chordBarContent}>
          {song.chords.map((c) => (
            <View key={c} style={styles.chordTag}>
              <Text style={styles.chordTagText}>{transposeLine(c, transpose)}</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Row 2: Transpose + Autoscroll */}
      <Animated.View style={[styles.controlsBar, { opacity: toolbarAnim, maxHeight: toolbarAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }), overflow: 'hidden' }]}>
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

        <View style={styles.divider} />

        <View style={styles.autoscrollControls}>
          {autoScroll && (
            <TouchableOpacity
              style={styles.speedBtn}
              onPress={() => setSpeedIdx((i) => (i + 1) % SCROLL_SPEEDS.length)}
            >
              <Text style={styles.speedBtnText}>{SPEED_LABELS[speedIdx]}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.autoScrollBtn, autoScroll && styles.autoScrollBtnActive]}
            onPress={() => setAutoScroll((v) => !v)}
          >
            <Ionicons name={autoScroll ? 'pause' : 'play'} size={15} color={autoScroll ? '#0f0800' : '#fff'} />
            <Text style={[styles.autoScrollText, autoScroll && styles.autoScrollTextActive]}>
              {autoScroll ? 'Pause' : 'Auto'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Chord sheet */}
      <TouchableWithoutFeedback onPress={toggleToolbars}>
      <ScrollView
        ref={scrollRef}
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => { scrollYRef.current = e.nativeEvent.contentOffset.y; }}
        scrollEventThrottle={16}
      >
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
      </TouchableWithoutFeedback>
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
  heroTopRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toolbarToggleBtn: {
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

  chordBar: {
    backgroundColor: '#1a0e05',
    paddingVertical: 10, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#2a1a0a',
  },
  chordBarContent: { gap: 8, alignItems: 'center' },
  chordTag: {
    backgroundColor: '#2a1a0a', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#3a2510',
  },
  chordTagText: { fontSize: 13, color: '#d4873c', fontWeight: '700' },

  controlsBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a0e05',
    paddingVertical: 10, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#2a1a0a',
    gap: 16,
  },
  transposeControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  transposeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#d4873c', alignItems: 'center', justifyContent: 'center',
  },
  transposeVal: { alignItems: 'center', minWidth: 36 },
  transposeLabel: { fontSize: 9, color: '#666', fontWeight: '700', letterSpacing: 0.5 },
  transposeNum: { fontSize: 16, fontWeight: '800', color: '#fff' },

  divider: { width: 1, height: 28, backgroundColor: '#2a1a0a' },

  autoscrollControls: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'flex-end', gap: 8,
  },
  speedBtn: {
    backgroundColor: '#2a1a0a', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: '#3a2510',
  },
  speedBtnText: { fontSize: 12, color: '#d4873c', fontWeight: '700' },
  autoScrollBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#2a1a0a', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#3a2510',
  },
  autoScrollBtnActive: { backgroundColor: '#d4873c', borderColor: '#d4873c' },
  autoScrollText: { fontSize: 13, color: '#fff', fontWeight: '700' },
  autoScrollTextActive: { color: '#0f0800' },

  sheet: { flex: 1, backgroundColor: '#0f0800' },
  sheetContent: { padding: 20, paddingBottom: 80 },
});
