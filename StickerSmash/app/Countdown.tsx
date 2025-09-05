// Countdown.tsx
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

type CountdownProps = {
  minutes?: number; // default to 25 if not provided
};

const Countdown = ({ minutes = 25 }: CountdownProps) => {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Format as MM:SS
  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <View style={{ alignItems: "center", padding: 20 }}>
      {secondsLeft > 0 ? (
        <Text style={{ fontSize: 40, fontWeight: "bold" }}>{formatTime()}</Text>
      ) : (
        <Text style={{ fontSize: 32 }}>⏰ Time’s up!</Text>
      )}
    </View>
  );
};

export default Countdown;
