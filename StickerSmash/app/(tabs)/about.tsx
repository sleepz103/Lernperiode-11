import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import Countdown from "../Countdown";


export default function AboutScreen() {
  const [started, setStarted] = useState(false);

  return (
    <View style={styles.container}>
      {!started ? (
        <Button title="Begin" onPress={() => setStarted(true)} />
      ) : (
        <Countdown minutes={25} />
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
  }
});

