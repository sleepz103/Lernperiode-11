import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CountdownProps = {
  minutes?: number; // default 25
  startImmediately?: boolean; // default false
};



const Countdown = ({ minutes = 25, startImmediately = false }: CountdownProps) => {
  // 1️⃣ State for the remaining seconds
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  // 2️⃣ State for whether the timer is running
  const [isRunning, setIsRunning] = useState(startImmediately);

  // 3️⃣ Timer effect
  useEffect(() => {
    // Create a single interval
    const timer = setInterval(() => {
      // Only decrement if running and time > 0
      if (isRunning && secondsLeft > 0) {
        setSecondsLeft((prev) => prev - 1);
      }
      // Stop running when time reaches 0
      if (secondsLeft === 0) {
        setIsRunning(false);
      }
    }, 1000);

    // Cleanup interval on unmount or re-render
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]); // re-run if these change

  // 4️⃣ Format seconds as MM:SS
  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {/* Countdown display */}
      <Text style={styles.timer}>{formatTime()}</Text>

      {/* Pause/Resume button */}
      {secondsLeft > 0 && (
        <Pressable
          style={styles.pauseButton}
          onPress={() => setIsRunning(!isRunning)}
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