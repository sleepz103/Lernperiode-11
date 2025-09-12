import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
        console.log('Saving state:', { finishTime, secondsLeft, isWorkSession });
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

  // Timer effect
  useEffect(() => {
    if(startImmediately && !finishTime) {
      const finish = new Date();
      finish.setMinutes(finish.getMinutes() + minutes);
      setFinishTime(finish);
      setIsRunning(true); // Set isRunning when timer starts
    }
  }, [startImmediately, minutes]);

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

  // 4️⃣ Format seconds as MM:SS
  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

 return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime()}</Text>
      {(secondsLeft > 0 || !isRunning) && (
        <Pressable
          style={styles.pauseButton}
          onPress={handlePauseResume}
        >
          <Text style={styles.pauseText}>{isRunning ? "Pause" : "Resume"}</Text>
        </Pressable>
      )}
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
  pauseButton: {
    backgroundColor: "#e18300ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  pauseText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});