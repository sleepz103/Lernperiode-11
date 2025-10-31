import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Countdown from "./Countdown";
import { Audio } from 'expo-av';
import { AnimatedButton } from "./components/AnimatedButton";
import { ThemeProvider, useTheme } from './theme/ThemeContext';

function AboutScreen() {
  const { currentTheme, cycleTheme } = useTheme();
  const [started, setStarted] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    async function loadSounds() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/click.wav')
        );
        soundRef.current = sound;
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    }
    loadSounds();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);



  const playSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

const handleComplete = () => {
  setIsWorkSession(!isWorkSession);
  setStarted(false);
}

return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {!started ? (
        <>
          <View style={styles.contentContainer}>
            <AnimatedButton
              title="Begin"
              onPress={async () => {
                await playSound();
                setStarted(true);
              }}
              style={styles.beginButton}
              backgroundColor={currentTheme.primary}
            />
          </View>
          <View style={styles.themeButtonContainer}>
            <AnimatedButton
              title={`Theme: ${currentTheme.name}`}
              onPress={async () => {
                await playSound();
                cycleTheme();
              }}
              style={styles.themeButton}
              backgroundColor={currentTheme.primary}
            />
          </View>
        </>
      ) : (
        <View>
          <Countdown
            startImmediately={started}
            minutes={isWorkSession ? 25 : 5}
            isComplete={handleComplete}
            isWorkSession={isWorkSession}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20
  },
  beginButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  themeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  themeButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
});

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <AboutScreen />
    </ThemeProvider>
  );
}

