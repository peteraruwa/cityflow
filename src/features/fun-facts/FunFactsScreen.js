import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { FUN_FACTS } from '../../shared/data';

export default function FunFactsScreen({ navigation }) {
  const [current, setCurrent] = useState(0);
  const fact = FUN_FACTS[current];

  function next() { setCurrent(c => (c + 1) % FUN_FACTS.length); }
  function prev() { setCurrent(c => (c - 1 + FUN_FACTS.length) % FUN_FACTS.length); }

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        {navigation && (
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color="#EBE3D6" strokeWidth={2}/>
          </TouchableOpacity>
        )}
        <View>
          <Text style={s.title}>Did You Know?</Text>
          <Text style={s.sub}>Fun facts about Redemption City</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Main card */}
        <LinearGradient
          colors={['rgba(113,40,206,0.18)','rgba(10,2,24,1)']}
          start={{x:0,y:0}} end={{x:1,y:1}}
          style={s.factCard}
        >
          <Text style={s.factEmoji}>{fact.icon}</Text>
          <Text style={s.factCounter}>Fact {current + 1} of {FUN_FACTS.length}</Text>
          <Text style={s.factTxt}>{fact.fact}</Text>
        </LinearGradient>

        {/* Navigation */}
        <View style={s.navRow}>
          <TouchableOpacity style={s.prevBtn} onPress={prev} activeOpacity={0.8}>
            <ChevronLeft size={14} color="#EBE3D6" strokeWidth={2}/>
            <Text style={s.prevTxt}> Prev</Text>
          </TouchableOpacity>
          <View style={s.dots}>
            {FUN_FACTS.map((_,i) => (
              <TouchableOpacity key={i} onPress={() => setCurrent(i)}>
                <View style={[s.dot, i === current && s.dotActive]}/>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={next} activeOpacity={0.85}>
            <LinearGradient
              colors={['#7128CE','#5A18A8']}
              start={{x:0,y:0}} end={{x:1,y:1}}
              style={s.nextBtn}
            >
              <Text style={s.nextTxt}>Next </Text>
              <ChevronRight size={14} color="#fff" strokeWidth={2}/>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* All facts list */}
        <Text style={s.allLabel}>ALL FACTS</Text>
        {FUN_FACTS.map((f, i) => (
          <TouchableOpacity
            key={i}
            style={[s.factItem, i === current && s.factItemActive]}
            onPress={() => setCurrent(i)}
            activeOpacity={0.8}
          >
            <Text style={s.factItemEmoji}>{f.icon}</Text>
            <Text style={[s.factItemTxt, i === current && { color:'#EBE3D6' }]} numberOfLines={3}>{f.fact}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:          { flex:1, backgroundColor:'#08011A' },
  header:        { paddingHorizontal:18, paddingTop:14, paddingBottom:12, flexDirection:'row', alignItems:'center', gap:10 },
  backBtn:       { width:34, height:34, borderRadius:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  title:         { fontSize:18, fontWeight:'700', color:'#EBE3D6' },
  sub:           { fontSize:11, color:'#8C7DA0' },
  scroll:        { paddingHorizontal:18, paddingBottom:20 },
  factCard:      { borderRadius:26, borderWidth:1, borderColor:'rgba(113,40,206,0.3)', padding:32, paddingHorizontal:22, alignItems:'center', marginBottom:20, minHeight:200, justifyContent:'center' },
  factEmoji:     { fontSize:48, marginBottom:18 },
  factCounter:   { fontSize:10, fontWeight:'700', color:'#C48D38', letterSpacing:3, textTransform:'uppercase', marginBottom:14 },
  factTxt:       { fontSize:14.5, color:'#EBE3D6', lineHeight:22, fontWeight:'500', textAlign:'center' },
  navRow:        { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:16, marginBottom:24 },
  prevBtn:       { flexDirection:'row', alignItems:'center', paddingHorizontal:22, paddingVertical:11, borderRadius:13, borderWidth:1, borderColor:'rgba(255,255,255,0.07)', backgroundColor:'rgba(255,255,255,0.04)' },
  prevTxt:       { fontSize:13, fontWeight:'600', color:'#EBE3D6' },
  dots:          { flexDirection:'row', gap:6, alignItems:'center' },
  dot:           { width:6, height:6, borderRadius:3, backgroundColor:'#504460' },
  dotActive:     { backgroundColor:'#C48D38' },
  nextBtn:       { flexDirection:'row', alignItems:'center', paddingHorizontal:22, paddingVertical:11, borderRadius:13 },
  nextTxt:       { fontSize:13, fontWeight:'600', color:'#fff' },
  allLabel:      { fontSize:12, fontWeight:'700', color:'#8C7DA0', letterSpacing:1, textTransform:'uppercase', marginBottom:12 },
  factItem:      { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:14, padding:12, paddingHorizontal:14, marginBottom:10, flexDirection:'row', gap:10, alignItems:'flex-start' },
  factItemActive:{ backgroundColor:'rgba(113,40,206,0.12)', borderColor:'rgba(113,40,206,0.35)' },
  factItemEmoji: { fontSize:20 },
  factItemTxt:   { fontSize:12, color:'#8C7DA0', lineHeight:17, flex:1 },
});
