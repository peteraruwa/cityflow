import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

export default function PulsingDot({ size = 8, color = '#F06565', style }) {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.25, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,    duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: anim },
        style,
      ]}
    />
  );
}
