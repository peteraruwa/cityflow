import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { C, FONTS } from '../../shared/constants/theme';

export default function SplashScreen({ onDone }) {
  const scale    = useRef(new Animated.Value(0.85)).current;
  const opacity  = useRef(new Animated.Value(0)).current;
  const fadeOut  = useRef(new Animated.Value(1)).current;
  const dot1     = useRef(new Animated.Value(0.2)).current;
  const dot2     = useRef(new Animated.Value(0.2)).current;
  const dot3     = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale,   { toValue:1, useNativeDriver:true, tension:60, friction:7, delay:400 }),
      Animated.timing(opacity, { toValue:1, duration:600, useNativeDriver:true, delay:400 }),
    ]).start();

    const dotLoop = (ref, delay) => Animated.loop(
      Animated.sequence([
        Animated.timing(ref, { toValue:1,   duration:400, useNativeDriver:true, delay }),
        Animated.timing(ref, { toValue:0.2, duration:400, useNativeDriver:true }),
      ])
    );
    dotLoop(dot1, 500).start();
    dotLoop(dot2, 700).start();
    dotLoop(dot3, 900).start();

    const t = setTimeout(() => {
      Animated.timing(fadeOut, { toValue:0, duration:550, useNativeDriver:true, delay:1700 }).start(() => onDone());
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={[s.wrap, { opacity: fadeOut }]}>
      <View style={s.glowBg} />
      <View style={s.lineTop} />
      <Animated.View style={{ transform:[{ scale }], opacity }}>
        <Text style={s.brand}>CityFlow</Text>
        <View style={s.divider} />
        <Text style={s.tagline}>REDEMPTION CITY</Text>
      </Animated.View>
      <View style={s.lineBottom} />
      <View style={s.dots}>
        {[dot1,dot2,dot3].map((d,i) => (
          <Animated.View key={i} style={[s.dot, { opacity: d }]} />
        ))}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap:       { flex:1, backgroundColor:'#08011A', alignItems:'center', justifyContent:'center', position:'relative' },
  glowBg:     { position:'absolute', width:300, height:280, borderRadius:150, backgroundColor:'rgba(100,35,200,0.18)', top:'30%', alignSelf:'center' },
  lineTop:    { width:48, height:1, backgroundColor:'#C48D38', marginBottom:22, opacity:0.8 },
  brand:      { fontSize:38, fontWeight:'700', color:'#EBE3D6', letterSpacing:6, textAlign:'center' },
  divider:    { height:1, backgroundColor:'#C48D38', marginTop:10 },
  tagline:    { fontSize:11, color:'#C48D38', letterSpacing:8, fontWeight:'500', marginTop:10, textAlign:'center', textTransform:'uppercase' },
  lineBottom: { width:48, height:1, backgroundColor:'#C48D38', marginTop:22, opacity:0.8 },
  dots:       { position:'absolute', bottom:52, flexDirection:'row', gap:6, alignItems:'center' },
  dot:        { width:5, height:5, borderRadius:3, backgroundColor:'#C48D38' },
});
