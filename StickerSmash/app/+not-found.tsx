import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFound() {
  return (
    <View
    style={styles.container}>
      <Text style={styles.text}>Not Found</Text>
      <Link href={"./about"} style={styles.button}>
      Go to About screen
      </Link>
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

