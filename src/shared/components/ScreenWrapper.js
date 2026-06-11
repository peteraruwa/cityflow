import React, { createContext, useContext, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../constants/theme';

const ScreenMetricsContext = createContext({
  width: 0,
  height: 0,
  isSmallScreen: false,
  isLandscape: false,
  scale: 1,
});

export function useScreenMetrics() {
  return useContext(ScreenMetricsContext);
}

export default function ScreenWrapper({
  children,
  style,
  backgroundColor = C.bg,
  edges = ['top', 'right', 'bottom', 'left'],
}) {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const metrics = useMemo(() => ({
    width,
    height,
    scale,
    fontScale,
    isSmallScreen: Math.min(width, height) < 380,
    isLandscape: width > height,
  }), [fontScale, height, scale, width]);

  return (
    <ScreenMetricsContext.Provider value={metrics}>
      <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor }, style]}>
        {typeof children === 'function'
          ? children(metrics)
          : <>{children}</>
        }
      </SafeAreaView>
    </ScreenMetricsContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
  },
});
