import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FavouritesProvider } from './src/context/FavouritesContext';
import { SongsProvider } from './src/context/SongsContext';
import HomeScreen from './src/screens/HomeScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import FavouritesScreen from './src/screens/FavouritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SongDetailScreen from './src/screens/SongDetailScreen';
import AddSongScreen from './src/screens/AddSongScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a0e05',
          borderTopColor: '#2a1a0a',
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#d4873c',
        tabBarInactiveTintColor: '#444',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Discover: 'compass',
            Add: 'add-circle',
            Favourites: 'heart',
            Settings: 'settings',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Add" component={AddSongScreen} options={{ title: 'Add Song' }} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SongsProvider>
        <FavouritesProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Tabs" component={HomeTabs} />
              <Stack.Screen name="Song" component={SongDetailScreen} />
              <Stack.Screen name="AddSong" component={AddSongScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </FavouritesProvider>
      </SongsProvider>
    </SafeAreaProvider>
  );
}
