import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSongs } from '../context/SongsContext';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const PLACEHOLDER_SHEET = [
  'G                  C          G || Amazing grace, how sweet the sound',
  '                        D      || That saved a wretch like me',
  '',
  'Em                 C          G || Add another verse here',
].join('\n');

function parseSheet(input) {
  return input.split('\n').map((rawLine) => {
    if (!rawLine.trim()) return { chord: '', lyric: '' };
    const [chord = '', lyric = ''] = rawLine.split('||');
    return { chord: chord.trimEnd(), lyric: lyric.trim() };
  });
}

export default function AddSongScreen({ navigation }) {
  const { addSong } = useSongs();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [key, setKey] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [category, setCategory] = useState('');
  const [sheetText, setSheetText] = useState('');
  const [saving, setSaving] = useState(false);

  const saveSong = async () => {
    const lines = parseSheet(sheetText);
    const hasPlayableLine = lines.some((line) => line.chord || line.lyric);

    if (!title.trim() || !artist.trim() || !key.trim() || !category.trim() || !hasPlayableLine) {
      Alert.alert('Missing details', 'Add a title, artist, key, category, and at least one chord or lyric line.');
      return;
    }

    try {
      setSaving(true);
      const song = await addSong({
        title,
        artist,
        key,
        difficulty,
        category,
        lines,
      });

      Alert.alert('Song added', `${song.title} is ready to play.`, [
        { text: 'Stay Here', style: 'cancel' },
        { text: 'Open Song', onPress: () => navigation.replace('Song', { song }) },
      ]);

      setTitle('');
      setArtist('');
      setKey('');
      setDifficulty('Beginner');
      setCategory('');
      setSheetText('');
    } catch (error) {
      console.error('Failed to save song', error);
      Alert.alert('Save failed', 'The song could not be saved right now. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f0800" />
      <View style={styles.header}>
        <View style={styles.iconSpacer}>
          {navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
        <Text style={styles.headerTitle}>Add Song</Text>
        <TouchableOpacity onPress={saveSong} style={styles.saveBtn} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Use one line per lyric row. Separate chords and lyrics with `||`. Leave a blank line to add spacing between verses.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Song title"
            placeholderTextColor="#555"
            style={styles.input}
          />

          <Text style={styles.label}>Artist</Text>
          <TextInput
            value={artist}
            onChangeText={setArtist}
            placeholder="Artist or writer"
            placeholderTextColor="#555"
            style={styles.input}
          />

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Key</Text>
              <TextInput
                value={key}
                onChangeText={setKey}
                placeholder="G, Am, D..."
                placeholderTextColor="#555"
                style={styles.input}
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                value={category}
                onChangeText={setCategory}
                placeholder="Folk, Worship..."
                placeholderTextColor="#555"
                style={styles.input}
              />
            </View>
          </View>

          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.chips}>
            {DIFFICULTIES.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setDifficulty(item)}
                style={[styles.chip, difficulty === item && styles.chipActive]}
              >
                <Text style={[styles.chipText, difficulty === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Lyrics + Chords</Text>
          <TextInput
            value={sheetText}
            onChangeText={setSheetText}
            placeholder={PLACEHOLDER_SHEET}
            placeholderTextColor="#555"
            style={styles.sheetInput}
            multiline
            textAlignVertical="top"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0800' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a0e05',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacer: { width: 40, height: 40 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  saveBtn: {
    backgroundColor: '#d4873c',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  saveBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  intro: { color: '#888', lineHeight: 20, marginBottom: 16 },
  card: {
    backgroundColor: '#1a0e05',
    borderWidth: 1,
    borderColor: '#2a1a0a',
    borderRadius: 18,
    padding: 16,
  },
  label: { color: '#d4873c', fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#120902',
    borderWidth: 1,
    borderColor: '#2a1a0a',
    borderRadius: 12,
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#120902',
    borderWidth: 1,
    borderColor: '#2a1a0a',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipActive: {
    backgroundColor: '#d4873c',
    borderColor: '#d4873c',
  },
  chipText: { color: '#777', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  sheetInput: {
    minHeight: 260,
    backgroundColor: '#120902',
    borderWidth: 1,
    borderColor: '#2a1a0a',
    borderRadius: 12,
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
});
