import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Countdown from "./Countdown";
import { Audio } from 'expo-av';
import { AnimatedButton } from "./components/AnimatedButton";

export default function AboutScreen() {
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
    <View style={styles.container}>
      {!started ? (
        <AnimatedButton
          title="Begin"
          onPress={async () => {
            await playSound();
            setStarted(true);
          }}
          style={styles.beginButton}
        />
      ) : (
        <View>
          <Text style={styles.text}>
            {isWorkSession ? "Work Session" : "Break Time"}
          </Text>
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
    backgroundColor: "#ffffffff"
  },
  text: {
    color: "#ffffff",
    fontSize: 20
  },
  beginButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
});

