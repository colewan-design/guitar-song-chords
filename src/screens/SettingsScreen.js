import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function SettingRow({ icon, label, value, onPress, toggle, toggled }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={toggle ? 1 : 0.7}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color="#d4873c" />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {toggle ? (
        <Switch
          value={toggled}
          onValueChange={onPress}
          thumbColor={toggled ? '#d4873c' : '#444'}
          trackColor={{ false: '#2a1a0a', true: '#7a3d0e' }}
        />
      ) : (
        <View style={styles.rowRight}>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          <Ionicons name="chevron-forward" size={16} color="#333" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = React.useState(true);
  const [autoScroll, setAutoScroll] = React.useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0800" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Ionicons name="person" size={32} color="#d4873c" />
        </View>
        <View>
          <Text style={styles.profileName}>Guitarist</Text>
          <Text style={styles.profileSub}>Beginner · 0 songs learned</Text>
        </View>
      </View>

      <Text style={styles.groupLabel}>PREFERENCES</Text>
      <View style={styles.group}>
        <SettingRow icon="moon" label="Dark Mode" toggle toggled={darkMode} onPress={() => setDarkMode((v) => !v)} />
        <View style={styles.divider} />
        <SettingRow icon="scroll" label="Auto Scroll" toggle toggled={autoScroll} onPress={() => setAutoScroll((v) => !v)} />
        <View style={styles.divider} />
        <SettingRow icon="text" label="Font Size" value="Medium" />
      </View>

      <Text style={styles.groupLabel}>APP</Text>
      <View style={styles.group}>
        <SettingRow icon="add-circle" label="Add Song" onPress={() => navigation.navigate('AddSong')} />
        <View style={styles.divider} />
        <SettingRow icon="information-circle" label="About" />
        <View style={styles.divider} />
        <SettingRow icon="star" label="Rate the App" />
        <View style={styles.divider} />
        <SettingRow icon="share-social" label="Share" />
      </View>

      <Text style={styles.version}>Guitar Chords v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0800' },

  header: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },

  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: '#1a0e05', marginHorizontal: 20, borderRadius: 16,
    padding: 18, marginBottom: 28, borderWidth: 1, borderColor: '#2a1a0a',
  },
  profileAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#2a1a0a', alignItems: 'center', justifyContent: 'center',
  },
  profileName: { fontSize: 17, fontWeight: '700', color: '#fff' },
  profileSub: { fontSize: 13, color: '#666', marginTop: 3 },

  groupLabel: { fontSize: 11, fontWeight: '700', color: '#444', letterSpacing: 1.5, paddingHorizontal: 20, marginBottom: 8 },
  group: {
    backgroundColor: '#1a0e05', marginHorizontal: 20, borderRadius: 16,
    marginBottom: 24, borderWidth: 1, borderColor: '#2a1a0a', overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#2a1a0a', alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 15, color: '#ddd' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontSize: 14, color: '#555' },
  divider: { height: 1, backgroundColor: '#2a1a0a', marginLeft: 64 },

  version: { textAlign: 'center', fontSize: 12, color: '#333', marginTop: 8 },
});
