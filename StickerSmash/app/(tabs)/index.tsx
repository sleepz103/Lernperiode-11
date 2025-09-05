import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
    style={styles.container}>
      <Text style={styles.text}>Hello Expo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e18300ff"
  },
  text: {
    color: "#ffffff",
    fontSize: 20
  },
  button: {
    fontSize: 22,
    textDecorationLine: "underline",
    color: "#ffffff"
  }
});

