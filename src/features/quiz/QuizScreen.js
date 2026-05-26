import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, X, CheckCircle, Check, RotateCcw } from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { QUIZ_QUESTIONS } from '../../shared/data';

export default function QuizScreen({ navigation }) {
  const [phase,    setPhase]    = useState('intro'); // intro | playing | result
  const [qIdx,     setQIdx]     = useState(0);
  const [selected, setSelected] = useState(null);
  const [score,    setScore]    = useState(0);
  const [answers,  setAnswers]  = useState([]);

  function startQuiz() {
    setPhase('playing'); setQIdx(0); setScore(0); setSelected(null); setAnswers([]);
  }

  function handleAnswer(idx) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === QUIZ_QUESTIONS[qIdx].correct;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { q:QUIZ_QUESTIONS[qIdx].q, chosen:idx, correct:QUIZ_QUESTIONS[qIdx].correct }]);
    setTimeout(() => {
      if (qIdx + 1 < QUIZ_QUESTIONS.length) { setQIdx(q => q + 1); setSelected(null); }
      else setPhase('result');
    }, 900);
  }

  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  if (phase === 'intro') return (
    <View style={s.root}>
      <View style={s.header}>
        {navigation && (
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={16} color="#EBE3D6" strokeWidth={2}/>
          </TouchableOpacity>
        )}
        <View>
          <Text style={s.title}>Know Your City</Text>
          <Text style={s.sub}>Test your Redemption City knowledge</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <LinearGradient
          colors={['rgba(196,141,56,0.18)','rgba(10,2,24,1)']}
          start={{x:0,y:0}} end={{x:1,y:1}}
          style={s.introCard}
        >
          <Text style={s.introEmoji}>🏙️</Text>
          <Text style={s.introTitle}>Know Your City Quiz</Text>
          <Text style={s.introBody}>{QUIZ_QUESTIONS.length} questions about Redemption City's history, facts, and layout. How well do you know your city?</Text>
          <View style={s.introBadges}>
            {[['📋',`${QUIZ_QUESTIONS.length} Qs`],['⏱️','~3 mins'],['🏆','Earn a badge']].map(([ic,lb])=>(
              <View key={lb} style={{alignItems:'center'}}>
                <Text style={{fontSize:20, marginBottom:4}}>{ic}</Text>
                <Text style={{fontSize:10.5,color:C.ts}}>{lb}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={startQuiz} activeOpacity={0.85}>
            <LinearGradient
              colors={['#C48D38','#B07020']}
              start={{x:0,y:0}} end={{x:1,y:1}}
              style={s.startBtn}
            >
              <Text style={s.startBtnTxt}>Start Quiz</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );

  if (phase === 'playing') {
    const q = QUIZ_QUESTIONS[qIdx];
    return (
      <View style={s.root}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => setPhase('intro')}>
            <X size={16} color="#EBE3D6" strokeWidth={2}/>
          </TouchableOpacity>
          <View style={{flex:1}}>
            <Text style={s.progressLabel}>Question {qIdx+1} of {QUIZ_QUESTIONS.length}</Text>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width:`${((qIdx+1)/QUIZ_QUESTIONS.length)*100}%` }]}/>
            </View>
          </View>
          <Text style={s.scoreTxt}>{score} pts</Text>
        </View>
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.questionCard}>
            <Text style={s.questionTxt}>{q.q}</Text>
          </View>
          <View style={s.options}>
            {q.options.map((opt, i) => {
              let bg = C.surf, border = 'rgba(255,255,255,0.07)', color = '#EBE3D6';
              if (selected !== null) {
                if (i === q.correct)              { bg='rgba(61,170,106,0.15)'; border='rgba(61,170,106,0.5)'; color='#3DAA6A'; }
                else if (i===selected&&i!==q.correct){ bg='rgba(212,79,79,0.15)'; border='rgba(212,79,79,0.5)'; color='#D44F4F'; }
              }
              return (
                <TouchableOpacity
                  key={i}
                  style={[s.optionCard, { backgroundColor:bg, borderColor:border }]}
                  onPress={() => handleAnswer(i)}
                  activeOpacity={selected===null?0.8:1}
                >
                  <View style={[s.optionLetter, { borderColor:border }]}>
                    <Text style={[s.optionLetterTxt, {color}]}>{String.fromCharCode(65+i)}</Text>
                  </View>
                  <Text style={[s.optionTxt, {color}]}>{opt}</Text>
                  {selected!==null&&i===q.correct && <CheckCircle size={14} color="#3DAA6A" strokeWidth={2} style={{marginLeft:'auto'}}/>}
                  {selected!==null&&i===selected&&i!==q.correct && <X size={14} color="#D44F4F" strokeWidth={2} style={{marginLeft:'auto'}}/>}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Result
  return (
    <View style={s.root}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Quiz Complete!</Text>
          <Text style={s.sub}>Here's how you did</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <LinearGradient
          colors={['rgba(113,40,206,0.18)','rgba(10,2,24,1)']}
          start={{x:0,y:0}} end={{x:1,y:1}}
          style={s.resultCard}
        >
          <Text style={{fontSize:56,marginBottom:6}}>{pct>=80?'🏆':pct>=50?'🎯':'📚'}</Text>
          <Text style={s.resultScore}>{score}/{QUIZ_QUESTIONS.length}</Text>
          <Text style={s.resultTitle}>{pct>=80?'City Expert!':pct>=50?'Good Knowledge!':'Keep Learning!'}</Text>
          <Text style={s.resultBody}>You scored {pct}% — {pct>=80?'Excellent! You really know your city.':pct>=50?'Not bad! A few more visits and you\'ll be an expert.':'Explore more of Redemption City to improve your score!'}</Text>
          <TouchableOpacity onPress={startQuiz} activeOpacity={0.85}>
            <LinearGradient colors={['#7128CE','#5A18A8']} start={{x:0,y:0}} end={{x:1,y:1}} style={s.replayBtn}>
              <RotateCcw size={13} color="#fff" strokeWidth={2}/>
              <Text style={s.replayBtnTxt}> Play Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
        <Text style={s.reviewLabel}>REVIEW ANSWERS</Text>
        {answers.map((a,i) => {
          const right = a.chosen === a.correct;
          return (
            <View key={i} style={[s.reviewCard, {borderColor:right?'rgba(61,170,106,0.3)':'rgba(212,79,79,0.3)'}]}>
              <View style={[s.reviewMark, {backgroundColor:right?'rgba(61,170,106,0.2)':'rgba(212,79,79,0.2)'}]}>
                {right ? <Check size={10} color="#3DAA6A" strokeWidth={3}/> : <X size={10} color="#D44F4F" strokeWidth={3}/>}
              </View>
              <View style={{flex:1}}>
                <Text style={s.reviewQ} numberOfLines={2}>Q{i+1}: {a.q}</Text>
                {!right && <Text style={s.reviewAnswer}>✓ {QUIZ_QUESTIONS[i].options[a.correct]}</Text>}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex:1, backgroundColor:'#08011A' },
  header:       { paddingHorizontal:18, paddingTop:14, paddingBottom:12, flexDirection:'row', alignItems:'center', gap:10 },
  backBtn:      { width:34, height:34, borderRadius:10, backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', alignItems:'center', justifyContent:'center' },
  title:        { fontSize:18, fontWeight:'700', color:'#EBE3D6' },
  sub:          { fontSize:11, color:'#8C7DA0' },
  scroll:       { padding:18, paddingTop:4, paddingBottom:24 },
  introCard:    { borderRadius:26, borderWidth:1, borderColor:'rgba(196,141,56,0.25)', padding:32, paddingHorizontal:22, alignItems:'center', position:'relative' },
  introEmoji:   { fontSize:48, marginBottom:14 },
  introTitle:   { fontSize:20, fontWeight:'700', color:'#EBE3D6', marginBottom:8 },
  introBody:    { fontSize:13, color:'#8C7DA0', lineHeight:20, marginBottom:20, textAlign:'center' },
  introBadges:  { flexDirection:'row', justifyContent:'center', gap:24, marginBottom:24 },
  startBtn:     { paddingHorizontal:40, paddingVertical:13, borderRadius:15 },
  startBtnTxt:  { fontSize:14, fontWeight:'700', color:'#08011A' },
  progressLabel:{ fontSize:13, fontWeight:'600', color:'#8C7DA0' },
  progressBar:  { height:4, backgroundColor:'rgba(255,255,255,0.04)', borderRadius:4, marginTop:6, overflow:'hidden' },
  progressFill: { height:'100%', borderRadius:4, backgroundColor:'#C48D38' },
  scoreTxt:     { fontSize:13, fontWeight:'700', color:'#C48D38' },
  questionCard: { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor:'rgba(255,255,255,0.07)', borderRadius:22, padding:20, marginBottom:16, minHeight:100, justifyContent:'center' },
  questionTxt:  { fontSize:14.5, color:'#EBE3D6', fontWeight:'600', lineHeight:22 },
  options:      { gap:10 },
  optionCard:   { flexDirection:'row', alignItems:'center', gap:10, padding:13, paddingHorizontal:16, borderRadius:14, borderWidth:1 },
  optionLetter: { width:26, height:26, borderRadius:8, borderWidth:1, alignItems:'center', justifyContent:'center', flexShrink:0 },
  optionLetterTxt:{ fontSize:11, fontWeight:'700' },
  optionTxt:    { fontSize:13, fontWeight:'500', flex:1 },
  resultCard:   { borderRadius:26, borderWidth:1, borderColor:'rgba(113,40,206,0.28)', padding:28, paddingHorizontal:22, alignItems:'center', marginBottom:18 },
  resultScore:  { fontSize:40, fontWeight:'800', color:'#C48D38', marginBottom:4 },
  resultTitle:  { fontSize:16, fontWeight:'600', color:'#EBE3D6', marginBottom:6 },
  resultBody:   { fontSize:12, color:'#8C7DA0', marginBottom:20, textAlign:'center', lineHeight:18 },
  replayBtn:    { flexDirection:'row', alignItems:'center', paddingHorizontal:28, paddingVertical:11, borderRadius:13 },
  replayBtnTxt: { fontSize:13, fontWeight:'600', color:'#fff' },
  reviewLabel:  { fontSize:12, fontWeight:'700', color:'#8C7DA0', letterSpacing:1, textTransform:'uppercase', marginBottom:12 },
  reviewCard:   { backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderRadius:14, padding:12, paddingHorizontal:14, marginBottom:10, flexDirection:'row', gap:8, alignItems:'flex-start' },
  reviewMark:   { width:20, height:20, borderRadius:6, alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 },
  reviewQ:      { fontSize:11.5, color:'#EBE3D6', marginBottom:4, lineHeight:17 },
  reviewAnswer: { fontSize:10.5, color:'#3DAA6A' },
});
