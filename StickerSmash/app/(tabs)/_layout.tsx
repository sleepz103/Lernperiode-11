import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#e18300ff",
      headerStyle: {
        backgroundColor: "#e18300ff"
      },
      headerShadowVisible: false,
      headerTintColor: "#fff",
      tabBarStyle: {
        backgroundColor: "#fff",
      },
    }}
    >
      <Tabs.Screen 
      name="index"
      options={{
         headerTitle: "Home",
         tabBarIcon: ({focused, color }) =>
             <Ionicons
             name={focused ? "home-sharp" : "home-outline"}
             color={color}
             size={30} />
      }} />
      <Tabs.Screen
      name="about"
      options={{
         headerTitle: "About",
         headerStyle: { backgroundColor: "green" },
         tabBarIcon: ({focused, color }) =>
             <Ionicons
             name={focused ? "information-circle-sharp" : "information-circle-outline"}
             color={color ? "green" : color}
             size={30} />
      }} />
      <Tabs.Screen name="+not-found" options={{}} />
    </Tabs>
  );
}
