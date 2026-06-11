import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { C, FONTS } from '../constants/theme';

export default function ScreenHeader({ title, sub, showBack, onBack }) {
  const navigation = useNavigation();
  const canGoBack = typeof showBack === 'boolean' ? showBack : navigation.canGoBack();
  const handleBack = onBack || (() => navigation.goBack());

  return (
    <View style={[s.wrap, canGoBack && s.wrapRow]}>
      {canGoBack && (
        <TouchableOpacity onPress={handleBack} style={s.backBtn} activeOpacity={0.75}>
          <ChevronLeft size={18} color={C.tp} strokeWidth={2} />
        </TouchableOpacity>
      )}
      <View style={s.copy}>
        <Text style={s.title}>{title}</Text>
        {sub ? <Text style={s.sub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:  { paddingHorizontal:22, paddingTop:18, paddingBottom:6 },
  wrapRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1 },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize:20, fontWeight:'700', color:'#EBE3D6', letterSpacing:-0.2 },
  sub:   { fontSize:12, color:'#8C7DA0', marginTop:4 },
});
