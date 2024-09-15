import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../global/styles/theme';

interface ProgressBarProps {
  progress: number; // Expect a value from 0 to 100
  duration?: number; // Duration of the animation in milliseconds (optional)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, duration = 500 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animates the progress bar when the progress changes
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressInterpolate = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, { width: progressInterpolate }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 20
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
});

export default ProgressBar;