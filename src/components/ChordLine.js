import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChordLine({ chord, lyric }) {
  if (!chord && !lyric) return <View style={styles.spacer} />;
  return (
    <View style={styles.line}>
      {chord ? <Text style={styles.chord}>{chord}</Text> : <View style={styles.emptyChord} />}
      <Text style={styles.lyric}>{lyric}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  line: { marginBottom: 3 },
  chord: { fontFamily: 'monospace', fontSize: 13, color: '#d4873c', fontWeight: '700' },
  lyric: { fontFamily: 'monospace', fontSize: 15, color: '#ddd' },
  emptyChord: { height: 18 },
  spacer: { height: 14 },
});
