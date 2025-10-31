import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type simpleCountdownIngriedients = {
    minutes?: number;
    isStartAllowed?: boolean
    hasSessionCompleted?: () => void; 
    isWorkSession?: boolean;
};

const SimpleCountdown = ( { minutes = 25, isStartAllowed = false, hasSessionCompleted, isWorkSession } : simpleCountdownIngriedients) => {
    const [sessionFinishTime, setSessionFinishTime] = useState<Date | null>(null);
    const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
    const [isSessionInProgress, setIsSessionInProgress] = useState(false);


    // calculate time logic
    useEffect(() => {
        if(isStartAllowed && !sessionFinishTime)
        {
            const finishDate = new Date();
            finishDate.setMinutes(finishDate.getMinutes() + minutes);
            setSessionFinishTime(finishDate);
            setIsSessionInProgress(true);
            console.log("Starting, seconds left:", secondsLeft);
            console.log(
                "Starting, end time:",
                finishDate.getHours(),
                ":",
                finishDate.getSeconds()
            );

        }   
    }, [ isStartAllowed, minutes ]);

    // counting logic
    useEffect(() => {
        if(!sessionFinishTime || !isSessionInProgress) return;

        const timer = setInterval(() => {
            const now = new Date();
            const diff = Math.max(0, Math.floor((sessionFinishTime.getTime() - now.getTime()) / 1000));
            setSecondsLeft(prev => {
                if (diff === 0) {
                setIsSessionInProgress(false);
                setSessionFinishTime(null);
                hasSessionCompleted?.();
                }
                return diff;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [sessionFinishTime, isSessionInProgress, hasSessionCompleted ])

    // skip logic
      const handleSkip = () => {
    setSecondsLeft(0);
    setIsSessionInProgress(false);
    setSessionFinishTime(null);
    hasSessionCompleted?.();
  }



    // format time
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

        return (
        <View style={styles.container}>
            <Text style={styles.timer}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </Text>
            <Pressable 
                style={styles.buttonBase}
                onPress={() => setIsSessionInProgress(!isSessionInProgress)}
                >
                <Text style={styles.buttonText}>
                    {isSessionInProgress ? 'Pause' : 'Start'}
                </Text>
            </Pressable>
            <Pressable
                style={[styles.buttonBase, styles.buttonSecondary]}
                onPress={handleSkip}
                >
            <Text style={styles.buttonText}>Skip</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    timer: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
    },
  buttonBase: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonPrimary: {
    backgroundColor: "#000000ff",
  },
  buttonSecondary: {
    backgroundColor: "#666666",
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default SimpleCountdown;