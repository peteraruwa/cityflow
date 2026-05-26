import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Lock, Eye, EyeOff, ArrowRight, MapPin } from 'lucide-react-native';
import { C, FONTS } from '../../shared/constants/theme';

export default function LoginScreen({ onLogin }) {
  const [phone,   setPhone]   = useState('');
  const [pass,    setPass]    = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  }

  const fldStyle = (f) => ({
    ...s.input,
    borderColor: focused === f ? 'rgba(113,40,206,0.55)' : 'rgba(255,255,255,0.07)',
    backgroundColor: focused === f ? 'rgba(113,40,206,0.08)' : 'rgba(255,255,255,0.05)',
  });

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS==='ios'?'padding':'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Text style={s.brand}>CityFlow</Text>
          <View style={s.locRow}>
            <MapPin size={10} color={C.gold} strokeWidth={2.5} />
            <Text style={s.locTxt}> Redemption City</Text>
          </View>
        </View>

        <View style={s.welcomeBlock}>
          <Text style={s.welcome}>Welcome back</Text>
          <Text style={s.sub}>Sign in to continue your journey across the city.</Text>
        </View>

        <View style={s.form}>
          {/* Phone */}
          <View style={s.fieldWrap}>
            <Phone size={15} color={focused==='phone'?C.purpleL:C.ts} strokeWidth={1.8} style={s.fieldIcon}/>
            <TextInput
              style={fldStyle('phone')} value={phone} onChangeText={setPhone}
              placeholder="Phone number or email" placeholderTextColor={C.tm}
              keyboardType="phone-pad"
              onFocus={()=>setFocused('phone')} onBlur={()=>setFocused(null)}
            />
          </View>

          {/* Password */}
          <View style={s.fieldWrap}>
            <Lock size={15} color={focused==='pass'?C.purpleL:C.ts} strokeWidth={1.8} style={s.fieldIcon}/>
            <TextInput
              style={[fldStyle('pass'), { paddingRight:44 }]} value={pass} onChangeText={setPass}
              placeholder="Password" placeholderTextColor={C.tm}
              secureTextEntry={!showPw}
              onFocus={()=>setFocused('pass')} onBlur={()=>setFocused(null)}
            />
            <TouchableOpacity style={s.eyeBtn} onPress={()=>setShowPw(p=>!p)}>
              {showPw
                ? <EyeOff size={15} color={C.ts} strokeWidth={1.8}/>
                : <Eye    size={15} color={C.ts} strokeWidth={1.8}/>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.forgotWrap}>
            <Text style={s.forgotTxt}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign in button */}
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
            <LinearGradient
              colors={loading ? ['rgba(113,40,206,0.4)','rgba(113,40,206,0.4)'] : ['#7128CE','#5A18A8']}
              start={{x:0,y:0}} end={{x:1,y:1}}
              style={s.signInBtn}
            >
              {loading
                ? <ActivityIndicator color="#fff" size="small"/>
                : <><Text style={s.signInTxt}>Sign In</Text><ArrowRight size={15} color="#fff" strokeWidth={2.5}/></>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={s.dividerRow}>
          <View style={s.divLine}/>
          <Text style={s.divTxt}>or continue with</Text>
          <View style={s.divLine}/>
        </View>

        {/* Social */}
        <View style={s.socialRow}>
          {['Google','Apple'].map(lbl => (
            <TouchableOpacity key={lbl} style={s.socialBtn} activeOpacity={0.7}>
              <Text style={s.socialTxt}>{lbl}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign up */}
        <View style={s.signupRow}>
          <Text style={s.signupTxt}>Don't have an account? </Text>
          <TouchableOpacity><Text style={s.signupLink}>Sign up</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:        { flex:1, backgroundColor:'#08011A' },
  scroll:      { paddingBottom:40 },
  header:      { padding:28, paddingBottom:0 },
  brand:       { fontSize:22, fontWeight:'700', color:'#EBE3D6', letterSpacing:3 },
  locRow:      { flexDirection:'row', alignItems:'center', marginTop:3 },
  locTxt:      { fontSize:10, color:'#8C7DA0' },
  welcomeBlock:{ paddingHorizontal:26, paddingTop:32 },
  welcome:     { fontSize:26, fontWeight:'700', color:'#EBE3D6', lineHeight:31 },
  sub:         { fontSize:13, color:'#8C7DA0', marginTop:7, lineHeight:20 },
  form:        { paddingHorizontal:22, paddingTop:28, gap:13 },
  fieldWrap:   { position:'relative', justifyContent:'center' },
  fieldIcon:   { position:'absolute', left:14, zIndex:1 },
  input:       { width:'100%', paddingLeft:44, paddingRight:14, paddingVertical:13, borderRadius:14, borderWidth:1, fontSize:13.5, color:'#EBE3D6' },
  eyeBtn:      { position:'absolute', right:14, padding:4 },
  forgotWrap:  { alignItems:'flex-end', marginTop:-4 },
  forgotTxt:   { fontSize:12, color:'#C48D38', fontWeight:'500' },
  signInBtn:   { width:'100%', paddingVertical:14, borderRadius:15, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8 },
  signInTxt:   { fontSize:14, fontWeight:'600', color:'#fff' },
  dividerRow:  { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:22, paddingTop:22 },
  divLine:     { flex:1, height:1, backgroundColor:'rgba(255,255,255,0.07)' },
  divTxt:      { fontSize:11, color:'#504460' },
  socialRow:   { flexDirection:'row', gap:12, paddingHorizontal:22, paddingTop:14 },
  socialBtn:   { flex:1, paddingVertical:11, borderRadius:13, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center' },
  socialTxt:   { fontSize:13, fontWeight:'600', color:'#EBE3D6' },
  signupRow:   { flexDirection:'row', justifyContent:'center', paddingTop:28 },
  signupTxt:   { fontSize:13, color:'#8C7DA0' },
  signupLink:  { fontSize:13, color:'#C48D38', fontWeight:'600' },
});
