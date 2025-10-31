import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useRef } from "react";
import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Audio } from 'expo-av';

const STORAGE_KEY = "countdown_state";

type CountdownProps = {
  minutes?: number; // default 25
  startImmediately?: boolean; // default false
  isComplete?: () => void; // callback when countdown completes
  isWorkSession?: boolean; // true for work session, false for break
};



const Countdown = ({ minutes = 25, startImmediately = false, isComplete, isWorkSession }: CountdownProps) => {
  const [finishTime, setFinishTime] = useState<Date | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const endSoundRef = useRef<Audio.Sound | null>(null);

  // Initialize sound
  useEffect(() => {
    async function loadSounds() {
      try {
        const { sound: clickSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/click.wav')
        );
        const { sound: endSound } = await Audio.Sound.createAsync(
          require('../assets/sounds/beepbeep.wav')
        );
        soundRef.current = clickSound;
        endSoundRef.current = endSound;
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    }
    loadSounds();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (endSoundRef.current) {
        endSoundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      } else {
        Alert.alert('Sound not loaded');
      }
    } catch (error) {
      Alert.alert('Error playing sound', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // Code from Claude 3.5 which I do not understand
  // essentially it should load and save the timer state to persistent storage
  // from what I can tell it firsts loads from storage
  // and save finish time to storage when it changes

  // Load saved state on mount
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const { finishTime: savedFinishTime, secondsLeft: savedSecondsLeft, isWorkSession: savedIsWorkSession } = JSON.parse(savedState);
          
          // Only restore if the session type matches
          if (savedIsWorkSession === isWorkSession) {
            if (savedFinishTime) {
              setFinishTime(new Date(savedFinishTime));
              setIsRunning(true);
            }
            setSecondsLeft(savedSecondsLeft);
          }
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    };

    loadSavedState();
  }, [isWorkSession]);

  // Save state when it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        const state = {
          finishTime: finishTime?.toISOString(),
          secondsLeft,
          isWorkSession
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state:', error);
      }
    };

    saveState();
  }, [finishTime, secondsLeft, isWorkSession]);

 // End of code from Claude

  // Calculate finish time and start
  useEffect(() => {
    if(startImmediately && !finishTime) {
      const finish = new Date();
      finish.setMinutes(finish.getMinutes() + minutes);
      setFinishTime(finish);
      setIsRunning(true);
    }
  }, [startImmediately, minutes]);

  // Countdown logic
  useEffect(() => {
    if (!finishTime || !isRunning) return;

    // Set initial seconds immediately to prevent the initial delay
    const now = new Date();
    const initialDiff = Math.max(0, Math.floor((finishTime.getTime() - now.getTime()) / 1000));
    setSecondsLeft(initialDiff);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((finishTime.getTime() - now.getTime()) / 1000));
      setSecondsLeft(prev => {
        if (diff === 0) {
          setIsRunning(false);
          setFinishTime(null);
          // Clear saved state when complete
          AsyncStorage.removeItem(STORAGE_KEY).catch(console.error);
          isComplete?.();
        }
        return diff;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [finishTime, isRunning, isComplete]);

  const handlePauseResume = () => {
    if (!isRunning) {
      // When resuming, recalculate finish time based on remaining seconds
      const end = new Date();
      end.setSeconds(end.getSeconds() + secondsLeft);
      setFinishTime(end);
    } else {
      // When pausing, clear finish time but keep secondsLeft
      setFinishTime(null);
    }
    setIsRunning(!isRunning);
  };

  const handleSkip = () => {
    setSecondsLeft(0);
    setIsRunning(false);
    setFinishTime(null);
    // Clear saved state
    AsyncStorage.removeItem(STORAGE_KEY).catch(console.error);
    // Notify completion
    isComplete?.();
  }

  // Format seconds as MM:SS
  const AnimatedNumber = ({ value }: { value: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: withSpring(1, {
          damping: 10,
          stiffness: 100,
          mass: 0.5,
        })}],
      };
    });

    return (
      <Animated.Text style={[styles.timer, animatedStyle]}>
        {String(value).padStart(2, '0')}
      </Animated.Text>
    );
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  // Render - what shows up on screen
 return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <AnimatedNumber value={mins} />
        <Animated.Text style={styles.timer}>:</Animated.Text>
        <AnimatedNumber value={secs} />
      </View>
      <View style={styles.buttonContainer}>
        {(secondsLeft > 0 || !isRunning) && (
          <Pressable
            style={[styles.buttonBase, styles.buttonPrimary]}
            onPress={async () => {
              await playSound();
              handlePauseResume();
            }}
          >
            <Text style={styles.buttonText}>{isRunning ? "Pause" : "Resume"}</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.buttonBase, styles.buttonSecondary]}
          onPress={async () => {
            await playSound();
            handleSkip();
          }}
        >
          <Text style={styles.buttonText}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Countdown;


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonBase: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#000000ff",
  },
  buttonSecondary: {
    backgroundColor: "#666666",
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});