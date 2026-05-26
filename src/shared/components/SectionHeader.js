import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { C, FONTS } from '../constants/theme';

export default function SectionHeader({ title, action = 'See all', onAction }) {
  return (
    <View style={s.row}>
      <Text style={s.title}>{title}</Text>
      {onAction && (
        <TouchableOpacity style={s.actionRow} onPress={onAction}>
          <Text style={s.action}>{action}</Text>
          <ChevronRight size={12} color={C.gold} strokeWidth={2.5} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row:       { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  title:     { fontSize:15, fontWeight:'700', color:C.tp, letterSpacing:-0.15 },
  actionRow: { flexDirection:'row', alignItems:'center', gap:2 },
  action:    { fontSize:11, color:C.gold, fontWeight:'500' },
});
