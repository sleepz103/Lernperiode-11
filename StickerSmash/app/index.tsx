import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Countdown from "./Countdown";

export default function AboutScreen() {
  const [started, setStarted] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);

const handleComplete = () => {
  setIsWorkSession(!isWorkSession);
  setStarted(false);
}

return (
    <View style={styles.container}>
      {!started ? (
        <Pressable style={styles.beginButton} onPress={() => setStarted(true)}>
          <Text style={styles.text}>Begin</Text>
        </Pressable>
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
    width: 200,
    height: 200,
    borderRadius: 100, // half of width/height
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8ad07cff",
  },
});

