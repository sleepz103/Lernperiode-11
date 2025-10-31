import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { Audio } from 'expo-av';
import { useEffect } from 'react';

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  useEffect(() => {
    async function initAudio() {
      try {
        console.log('Initializing audio...');
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });
        console.log('Audio initialized successfully');
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
    initAudio();
  }, []); // Added missing dependency array and cleanup function

  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="not-found"
          options={{ headerTitle: "Not Found" }}
        />
      </Stack>
    </>
  );
}
