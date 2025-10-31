import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet, Platform, ViewStyle, TextStyle, PressableProps } from 'react-native';

interface AnimatedButtonProps extends PressableProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  backgroundColor = "#424242",
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(1)).current;

  const animatePress = {
    pressIn: () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 150,
        friction: 3
      }).start();
      
      Animated.timing(shadowAnim, {
        toValue: 0.5,
        duration: 50,
        useNativeDriver: true
      }).start();
    },
    pressOut: () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 3
      }).start();
      
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true
      }).start();
    }
  };

  return (
    <Pressable
      onPressIn={animatePress.pressIn}
      onPressOut={animatePress.pressOut}
      onPress={onPress}
      {...props}
    >
      <Animated.View style={[
        styles.shadowContainer,
        {
          opacity: shadowAnim
        }
      ]}>
        <Animated.View style={[
          styles.button,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor
          },
          style
        ]}>
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#4a4a4a",
    borderWidth: 1,
  },
  text: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  }
});