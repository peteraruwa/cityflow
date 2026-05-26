import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C, FONTS } from '../constants/theme';

export default function ScreenHeader({ title, sub }) {
  return (
    <View style={s.wrap}>
      <Text style={s.title}>{title}</Text>
      {sub ? <Text style={s.sub}>{sub}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:  { paddingHorizontal:22, paddingTop:18, paddingBottom:6 },
  title: { fontSize:20, fontWeight:'700', color:'#EBE3D6', letterSpacing:-0.2 },
  sub:   { fontSize:12, color:'#8C7DA0', marginTop:4 },
});
