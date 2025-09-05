import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#000000ff",
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
         headerTitle: "Pomodoro",
         headerTintColor: "#000",
         headerStyle: {
            backgroundColor: "#fff"
         },
         tabBarIcon: ({focused }) =>
             <Ionicons
             name={focused ? "time-sharp" : "time-outline"}
             size={30} />
      }} />
    </Tabs>
  );
}
