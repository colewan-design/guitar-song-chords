import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Switch, ActivityIndicator, Alert, Share, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as StoreReview from 'expo-store-review';
import { useSongs } from '../context/SongsContext';
import { useTheme } from '../context/ThemeContext';
import { useFavourites } from '../context/FavouritesContext';

function SettingRow({ icon, label, value, onPress, toggle, toggled, theme, styles }) {
  const { colors } = theme;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={toggle ? 1 : 0.7}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.accent} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {toggle ? (
        <Switch
          value={toggled}
          onValueChange={onPress}
          thumbColor={toggled ? colors.accent : colors.switchThumbOff}
          trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
        />
      ) : (
        <View style={styles.rowRight}>
          {value && <Text style={styles.rowValue}>{value}</Text>}
          <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }) {
  const { songs, sync, syncing } = useSongs();
  const { favourites } = useFavourites();
  const {
    theme,
    isDark,
    toggleTheme,
    autoScrollEnabled,
    setAutoScrollEnabled,
    fontScaleKey,
    cycleFontScale,
  } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createStyles(theme, insets), [theme, insets]);
  const { colors } = theme;
  const customSongsCount = songs.filter((s) => s.isCustom).length;

  const handleAbout = () => {
    Alert.alert(
      'About Guitar Chords',
      `Version 1.0.0\n${songs.length} songs · ${customSongsCount} custom · ${favourites.length} favourites`
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: 'Check out Guitar Chords and Lyrics for quick offline chord sheets and easy song practice.' });
    } catch (e) { /* ignore */ }
  };

  const handleRateApp = async () => {
    try {
      if (await StoreReview.hasAction()) { await StoreReview.requestReview(); return; }
    } catch { /* ignore */ }
    Alert.alert('Rate the App', 'In-app rating is not available on this device yet.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Large Title Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={30} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Guitarist</Text>
            <Text style={styles.profileSub}>{songs.length} songs · {favourites.length} favourites</Text>
          </View>
        </View>

        {/* Preferences group */}
        <Text style={styles.groupLabel}>PREFERENCES</Text>
        <View style={styles.group}>
          <SettingRow
            icon="contrast-outline"
            label="Theme"
            value={isDark ? 'Dark' : 'Light'}
            onPress={toggleTheme}
            theme={theme}
            styles={styles}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="scroll-outline"
            label="Auto Scroll"
            toggle
            toggled={autoScrollEnabled}
            onPress={() => setAutoScrollEnabled(!autoScrollEnabled)}
            theme={theme}
            styles={styles}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="text-outline"
            label="Font Size"
            value={fontScaleKey[0].toUpperCase() + fontScaleKey.slice(1)}
            onPress={cycleFontScale}
            theme={theme}
            styles={styles}
          />
        </View>

        {/* Library group */}
        <Text style={styles.groupLabel}>LIBRARY</Text>
        <View style={styles.group}>
          <SettingRow icon="add-circle-outline" label="Add Song" onPress={() => navigation.navigate('AddSong')} theme={theme} styles={styles} />
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={sync} disabled={syncing} activeOpacity={0.7}>
            <View style={styles.rowIcon}>
              <Ionicons name="sync-outline" size={18} color={colors.accent} />
            </View>
            <Text style={styles.rowLabel}>Sync Library</Text>
            {syncing
              ? <ActivityIndicator size="small" color={colors.accent} />
              : <Ionicons name="chevron-forward" size={16} color={colors.iconMuted} />}
          </TouchableOpacity>
        </View>

        {/* General group */}
        <Text style={styles.groupLabel}>GENERAL</Text>
        <View style={styles.group}>
          <SettingRow icon="star-outline" label="Rate the App" onPress={handleRateApp} theme={theme} styles={styles} />
          <View style={styles.divider} />
          <SettingRow icon="share-outline" label="Share App" onPress={handleShare} theme={theme} styles={styles} />
          <View style={styles.divider} />
          <SettingRow icon="information-circle-outline" label="About" onPress={handleAbout} theme={theme} styles={styles} />
        </View>

        <Text style={styles.version}>Guitar Chords and Lyrics v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function createStyles(theme, insets) {
  const { colors } = theme;
  const topPad = insets.top + 4;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingBottom: 40 },

    header: { paddingHorizontal: 20, paddingTop: topPad, paddingBottom: 20 },
    headerTitle: { fontSize: 34, fontWeight: '700', color: colors.text, letterSpacing: 0.2 },

    profileCard: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 16,
      padding: 16, marginBottom: 28,
      borderWidth: 0.5, borderColor: colors.border,
    },
    profileAvatar: {
      width: 52, height: 52, borderRadius: 26,
      backgroundColor: colors.surfaceSoft, alignItems: 'center', justifyContent: 'center',
    },
    profileName: { fontSize: 17, fontWeight: '600', color: colors.text },
    profileSub: { fontSize: 13, color: colors.textSubtle, marginTop: 3 },

    groupLabel: {
      fontSize: 12, fontWeight: '600', color: colors.textSubtle,
      letterSpacing: 0.8, paddingHorizontal: 20, marginBottom: 8,
    },
    group: {
      backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 16,
      marginBottom: 28, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden',
    },
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 14, minHeight: 52 },
    rowIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
    rowLabel: { flex: 1, fontSize: 16, color: colors.text },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rowValue: { fontSize: 15, color: colors.textSubtle },
    divider: { height: 0.5, backgroundColor: colors.border, marginLeft: 62 },

    version: { textAlign: 'center', fontSize: 13, color: colors.textSubtle, marginTop: 8 },
  });
}
