import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell, BookOpen, Building2, CheckCircle, ChevronLeft, ChevronRight, Church, Heart,
  HelpCircle, Lightbulb, LogOut, Mail, MapPin, MapPinned, PhoneCall, Radio, Send, Settings,
  Shield, Smartphone, Sparkles, User,
} from 'lucide-react-native';
import { C } from '../../shared/constants/theme';
import { FONTS } from '../../shared/constants/theme';
import ScreenHeader from '../../shared/components/ScreenHeader';
import { usePrefs } from '../../shared/context/PrefsContext';
import { translateText } from '../../shared/i18n/runtimeTranslator';

const SECTIONS = [
  {
    title: 'Quick Contacts',
    items: [
      { id: 'Contacts', Icon: PhoneCall, label: 'Quick Contacts', sub: 'All important numbers in one place', color: '#2A7FAB', route: true },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'Profile', Icon: User, label: 'Profile', sub: 'Your account & history', color: '#7128CE', route: true },
      { id: 'settings', Icon: Settings, label: 'Settings', sub: 'Language & preferences', color: '#6A6880' },
      { id: 'notifications', Icon: Bell, label: 'Notifications', sub: 'Alerts & updates', color: '#C48D38' },
      { id: 'privacy', Icon: Shield, label: 'Privacy', sub: 'Data & permissions', color: '#4A8A5A' },
    ],
  },
  {
    title: 'About',
    items: [
      { id: 'aboutapp', Icon: Smartphone, label: 'About CityFlow', sub: 'Version, credits & acknowledgments', color: '#9458E0' },
      { id: 'aboutrccg', Icon: Church, label: 'About RCCG', sub: 'History, beliefs & structure', color: '#7128CE' },
      { id: 'aboutcity', Icon: Building2, label: 'About Redemption City', sub: 'History, size, facilities & fun facts', color: '#C48D38' },
      { id: 'support', Icon: HelpCircle, label: 'Contact Support', sub: 'Report issues & get help', color: '#D44F4F' },
    ],
  },
];

const PAGES = {
  settings: {
    title: 'Settings',
    sub: 'Language & preferences',
    rows: ['English', 'French', 'Yoruba', 'Dark mode enabled', 'Location services enabled', 'Ride updates enabled'],
  },
  notifications: {
    title: 'Notifications',
    sub: 'Alerts & updates',
    rows: ['Service reminder - 8:00 AM', 'Road closure near Main Gate', 'Lost & Found claim approved', 'CityRide driver arriving'],
  },
  privacy: {
    title: 'Privacy',
    sub: 'Data & permissions',
    rows: ['Location is used for nearby services and rides.', 'Notifications are used for alerts and reminders.', 'Profile data stays within CityFlow demo storage.'],
  },
};

const ABOUT_ROUTES = {
  aboutapp: 'AboutCityFlow',
  aboutrccg: 'AboutRCCG',
  aboutcity: 'AboutRedemptionCity',
};

const ACCOUNT_ROUTES = {
  settings: 'MoreSettings',
  notifications: 'Notifications',
  privacy: 'Privacy',
};

const LANGS = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'fr', name: 'French', native: 'Francais' },
  { code: 'yo', name: 'Yoruba', native: 'Yoruba' },
];

export default function MoreScreen({ navigation, route }) {
  const onLogout = route?.params?.onLogout;
  const { language } = usePrefs();
  const tr = (value) => translateText(value, language);
  const [page, setPage] = useState(null);
  const [cat, setCat] = useState('General');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  if (page === 'support') {
    return (
      <View style={s.root}>
        <SubHeader title={tr("Contact Support")} sub={tr("Report issues & get help")} onBack={() => setPage(null)} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {sent ? (
            <View style={s.success}>
              <Send size={30} color={C.green} strokeWidth={1.8} />
              <Text style={s.successTitle}>{tr("Report submitted")}</Text>
              <Text style={s.successSub}>{tr("CityFlow support will review your message shortly.")}</Text>
            </View>
          ) : (
            <>
              <Text style={s.kicker}>{tr("Report an issue")}</Text>
              <View style={s.chips}>
                {['General', 'Ride', 'Map', 'Lost Item', 'Emergency'].map((item) => (
                  <TouchableOpacity key={item} onPress={() => setCat(item)} style={[s.chip, cat === item && s.chipActive]}>
                    <Text style={[s.chipText, cat === item && s.chipTextActive]}>{tr(item)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                value={msg}
                onChangeText={setMsg}
                placeholder={tr("Describe the issue...")}
                placeholderTextColor={C.tm}
                multiline
                style={s.input}
              />
              <TouchableOpacity onPress={() => msg.trim() && setSent(true)} activeOpacity={0.85} style={[s.submit, !msg.trim() && s.submitDisabled]}>
                <Send size={13} color="#fff" strokeWidth={2} />
                <Text style={s.submitText}>{tr("Submit Report")}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  if (page) {
    const info = PAGES[page];
    return (
      <View style={s.root}>
        <SubHeader title={info.title} sub={info.sub} onBack={() => setPage(null)} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {page === 'settings' && (
            <View style={s.langPicker}>
              {[
                { code: 'en', label: 'English', native: 'English' },
                { code: 'fr', label: 'French', native: 'Francais' },
                { code: 'yo', label: 'Yoruba', native: 'Yoruba' },
              ].map((item) => {
                const active = language === item.code;
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[s.langOption, active && s.langOptionActive]}
                    onPress={() => setLanguage(item.code)}
                    activeOpacity={0.82}
                  >
                    <Text style={[s.langOptionCode, active && s.langOptionCodeActive]}>{item.code.toUpperCase()}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.langOptionLabel}>{item.native}</Text>
                      <Text style={s.langOptionSub}>{item.label}</Text>
                    </View>
                    <View style={[s.langDot, active && s.langDotActive]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {info.rows.map((row, index) => (
            <View key={index} style={s.infoRow}>
              <Text style={s.infoText}>{row}</Text>
            </View>
          ))}
          {page === 'aboutcity' && (
            <TouchableOpacity style={s.outlineBtn} onPress={() => navigation.navigate('FunFacts')} activeOpacity={0.82}>
              <Text style={s.outlineText}>View Fun Facts</Text>
              <ChevronRight size={14} color={C.gold} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <ScreenHeader title="More" sub="Account, info & support" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={s.section}>
          <Text style={s.kicker}>{tr(section.title)}</Text>
            {section.items.map(({ id, Icon, label, sub, color, route: isRoute }) => (
              <TouchableOpacity
                key={id}
                style={s.row}
                onPress={() => {
                  if (isRoute) {
                    navigation.navigate(id, id === 'Profile' ? { onLogout } : undefined);
                    return;
                  }
                  if (ABOUT_ROUTES[id]) {
                    navigation.navigate(ABOUT_ROUTES[id]);
                    return;
                  }
                  if (ACCOUNT_ROUTES[id]) {
                    navigation.navigate(ACCOUNT_ROUTES[id]);
                    return;
                  }
                  setPage(id);
                }}
                activeOpacity={0.82}
              >
                <View style={[s.rowIcon, { backgroundColor: `${color}18`, borderColor: `${color}26` }]}>
                  <Icon size={17} color={color} strokeWidth={1.8} />
                </View>
                <View style={s.rowCopy}>
                  <Text style={s.rowLabel}>{tr(label)}</Text>
                  <Text style={s.rowSub}>{tr(sub)}</Text>
                </View>
                <ChevronRight size={14} color={C.tm} strokeWidth={2} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <TouchableOpacity onPress={onLogout} activeOpacity={0.82} style={s.logout}>
          <LogOut size={15} color={C.red} strokeWidth={1.8} />
          <Text style={s.logoutText}>{tr("Sign Out")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SubHeader({ title, sub, onBack }) {
  return (
    <View style={s.subHeader}>
      <TouchableOpacity onPress={onBack} style={s.backBtn} activeOpacity={0.75}>
        <ChevronLeft size={18} color={C.tp} strokeWidth={2} />
      </TouchableOpacity>
      <View>
        <Text style={s.subTitle}>{title}</Text>
        <Text style={s.subText}>{sub}</Text>
      </View>
    </View>
  );
}

function InfoSection({ Icon, color, title, children }) {
  return (
    <View style={s.infoSection}>
      <View style={s.infoSectionHead}>
        <View style={[s.infoSectionIcon, { backgroundColor: `${color}18`, borderColor: `${color}28` }]}>
          <Icon size={14} color={color} strokeWidth={2} />
        </View>
        <Text style={s.infoSectionTitle}>{title}</Text>
      </View>
      <Text style={s.infoSectionBody}>{children}</Text>
    </View>
  );
}

function Toggle({ on, onChange }) {
  return (
    <TouchableOpacity
      onPress={onChange}
      activeOpacity={0.82}
      style={[s.toggle, on ? s.toggleOn : s.toggleOff]}
    >
      <View style={[s.toggleKnob, on && s.toggleKnobOn]} />
    </TouchableOpacity>
  );
}

function SectionKicker({ children }) {
  return <Text style={s.pageKicker}>{children}</Text>;
}

function DeveloperContactCard({ tr }) {
  return (
    <View style={s.devContactCard}>
      <View style={s.devContactRow}>
        <View style={s.devContactIcon}>
          <Mail size={15} color="#49BDEB" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.devContactLabel}>{tr("Email")}</Text>
          <Text style={s.devContactValue}>serialquest@gmail.com</Text>
        </View>
      </View>
      <View style={s.devContactDivider} />
      <View style={s.devContactRow}>
        <View style={s.devContactIcon}>
          <PhoneCall size={15} color="#49BDEB" strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.devContactLabel}>{tr("Phone")}</Text>
          <Text style={s.devContactValue}>09067008473 ({tr("Nigeria")})</Text>
        </View>
      </View>
    </View>
  );
}

export function MoreSettingsScreen({ navigation }) {
  const {
    language,
    setLanguage,
    pushNotifications,
    togglePushNotifications,
    locationServices,
    toggleLocationServices,
    inAppSounds,
    toggleInAppSounds,
  } = usePrefs();
  const tr = (value) => translateText(value, language);

  const preferenceRows = [
    { Icon: Bell, label: 'Push Notifications', sub: 'Events, alerts & reminders', on: pushNotifications, set: togglePushNotifications, color: '#C48D38' },
    { Icon: MapPin, label: 'Location Services', sub: 'For maps & nearby places', on: locationServices, set: toggleLocationServices, color: '#2A7FAB' },
    { Icon: Radio, label: 'In-app Sounds', sub: 'Taps & notification tones', on: inAppSounds, set: toggleInAppSounds, color: '#4A8A5A' },
  ];

  return (
    <View style={s.root}>
      <SubHeader title={tr("Settings")} sub={tr("App preferences")} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.aboutScroll}>
        <SectionKicker>{tr("Language")}</SectionKicker>
        <View style={s.settingsGroup}>
          {LANGS.map((item) => {
            const active = language === item.code;
            return (
              <TouchableOpacity
                key={item.code}
                onPress={() => setLanguage(item.code)}
                activeOpacity={0.82}
                style={[s.settingsLangRow, active && s.settingsLangRowActive]}
              >
                <View style={[s.settingsLangCode, active && s.settingsLangCodeActive]}>
                  <Text style={[s.settingsLangCodeText, active && s.settingsLangCodeTextActive]}>{item.code.toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.settingsLangNative}>{tr(item.native)}</Text>
                  <Text style={s.settingsLangName}>{tr(item.name)}</Text>
                </View>
                {active && <CheckCircle size={16} color={C.purpleL} strokeWidth={2} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <SectionKicker>{tr("Preferences")}</SectionKicker>
        <View style={s.settingsGroup}>
          {preferenceRows.map(({ Icon, label, sub, on, set, color }) => (
            <View key={label} style={s.prefRow}>
              <View style={[s.prefIcon, { backgroundColor: `${color}18`, borderColor: `${color}28` }]}>
                <Icon size={15} color={color} strokeWidth={1.8} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.prefLabel}>{tr(label)}</Text>
                <Text style={s.prefSub}>{tr(sub)}</Text>
              </View>
              <Toggle on={on} onChange={set} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export function PrivacyScreen({ navigation }) {
  const {
    language,
    usageAnalytics,
    toggleUsageAnalytics,
    personalisedSuggestions,
    togglePersonalisedSuggestions,
    locationServices,
    pushNotifications,
  } = usePrefs();
  const tr = (value) => translateText(value, language);
  const [deletionRequested, setDeletionRequested] = useState(false);

  return (
    <View style={s.root}>
      <SubHeader title={tr("Privacy")} sub={tr("Data & permissions")} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.aboutScroll}>
        <InfoSection Icon={Shield} color="#4A8A5A" title="Your data, your control">
          CityFlow only collects the information needed to run the app - your account details, saved places and ride history. Your data is never sold to third parties.
        </InfoSection>

        <SectionKicker>{tr("Data Preferences")}</SectionKicker>
        <View style={s.settingsGroupPrivacy}>
          {[
            { label: 'Usage Analytics', sub: 'Help improve CityFlow with anonymous stats', on: usageAnalytics, set: toggleUsageAnalytics },
            { label: 'Personalised Suggestions', sub: 'Recommendations based on your activity', on: personalisedSuggestions, set: togglePersonalisedSuggestions },
          ].map(({ label, sub, on, set }) => (
            <View key={label} style={s.privacyPrefRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.prefLabel}>{tr(label)}</Text>
                <Text style={s.prefSub}>{tr(sub)}</Text>
              </View>
              <Toggle on={on} onChange={set} />
            </View>
          ))}
        </View>

        <SectionKicker>{tr("Permissions")}</SectionKicker>
        <View style={s.settingsGroupPrivacy}>
          {[
            ['Location', locationServices ? 'While using the app' : 'Off'],
            ['Notifications', pushNotifications ? 'Allowed' : 'Off'],
            ['Camera', 'Not allowed'],
          ].map(([label, value]) => (
            <View key={label} style={s.permissionRow}>
              <Text style={s.permissionLabel}>{tr(label)}</Text>
              <Text style={s.permissionValue}>{tr(value)}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => setDeletionRequested(true)} activeOpacity={0.82} style={s.deleteBtn}>
          <Text style={s.deleteText}>{tr(deletionRequested ? 'Account Deletion Requested' : 'Request Account Deletion')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export function AboutCityFlowScreen({ navigation }) {
  const { language } = usePrefs();
  const tr = (value) => translateText(value, language);
  return (
    <View style={s.root}>
      <SubHeader title={tr("About CityFlow")} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.aboutScrollCityFlow}>
        <View style={s.aboutLogoWrap}>
          <Image source={require('../../../assets/rcog_logo.png')} style={s.aboutLogo} resizeMode="contain" />
          <Text style={s.aboutBrand}>CityFlow</Text>
          <Text style={s.aboutVersion}>{tr("Version")} 1.0.0 · {tr("Build")} 2026.06</Text>
        </View>
        <InfoSection Icon={Sparkles} color="#9458E0" title="Credits">
          Designed & built by SerialQuest.
        </InfoSection>
        <DeveloperContactCard tr={tr} />
        <InfoSection Icon={Heart} color="#D44F4F" title="Acknowledgments">
          To God Almighty, for the grace to build. And to my wife and family — for the patience, encouragement and unwavering support that made CityFlow possible.
        </InfoSection>
        <Text style={s.aboutFooter}>© 2026 CityFlow · {tr("Made for Redemption City")}</Text>
      </ScrollView>
    </View>
  );
}

export function AboutRCCGScreen({ navigation }) {
  const { language } = usePrefs();
  const tr = (value) => translateText(value, language);
  return (
    <View style={s.root}>
      <SubHeader title={tr("About RCCG")} sub={tr("The Redeemed Christian Church of God")} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.aboutScroll}>
        <InfoSection Icon={BookOpen} color="#7128CE" title="History">
          The Redeemed Christian Church of God was founded in 1952 in Lagos, Nigeria, by Pa Josiah Olufemi Akindayomi. In 1981, Pastor Enoch Adejare Adeboye became General Overseer, leading a period of extraordinary growth. Today the church has parishes in over 190 nations around the world.
        </InfoSection>
        <InfoSection Icon={Heart} color="#C48D38" title="Beliefs">
          RCCG holds the Bible as the inspired word of God — teaching salvation through faith in Jesus Christ, holiness of life, the power of prayer, evangelism, and practical love for one's neighbour.
        </InfoSection>
        <InfoSection Icon={Building2} color="#2A7FAB" title="Structure">
          The church is led by the General Overseer, supported by continental and regional overseers. It is organised into provinces, zones, areas and parishes — a structure designed to plant a church within reach of every community.
        </InfoSection>
      </ScrollView>
    </View>
  );
}

export function AboutRedemptionCityScreen({ navigation }) {
  const { language } = usePrefs();
  const tr = (value) => translateText(value, language);
  return (
    <View style={s.root}>
      <SubHeader title={tr("About Redemption City")} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.aboutScroll}>
        <InfoSection Icon={BookOpen} color="#7128CE" title="History">
          What began as Redemption Camp along the Lagos–Ibadan Expressway grew into a full city, officially commissioned as Redemption City in 1999. It now hosts over 1 million visitors annually during major conventions.
        </InfoSection>
        <InfoSection Icon={MapPinned} color="#C48D38" title="Size">
          The city covers over 560 square kilometres with an internal road network of more than 30km — larger than some entire states in Nigeria.
        </InfoSection>
        <InfoSection Icon={Building2} color="#2A7FAB" title="Facilities">
          Over 3,000 buildings including the 1-million-capacity Main Auditorium, guest houses, schools, a hospital, banks, restaurants — plus dedicated power supply and a water treatment plant.
        </InfoSection>
        <TouchableOpacity onPress={() => navigation.navigate('FunFacts')} activeOpacity={0.85}>
          <LinearGradient colors={['rgba(74,138,90,0.14)', 'rgba(10,2,24,1)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.funFactsRow}>
            <View style={s.funFactsIcon}>
              <Lightbulb size={16} color="#4A8A5A" strokeWidth={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.funFactsTitle}>{tr("Fun Facts")}</Text>
              <Text style={s.funFactsSub}>{tr("8 things you didn't know")}</Text>
            </View>
            <ChevronRight size={14} color={C.tm} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 18, paddingTop: 8, paddingBottom: 28 },
  section: { marginBottom: 18 },
  kicker: { fontSize: 10, fontWeight: '700', color: C.tm, letterSpacing: 1.2, textTransform: 'uppercase', marginHorizontal: 2, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, paddingHorizontal: 15, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 16, marginBottom: 9 },
  rowIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  rowCopy: { flex: 1 },
  rowLabel: { fontSize: 13.5, fontWeight: '700', color: C.tp, marginBottom: 2 },
  rowSub: { fontSize: 11, color: C.ts },
  logout: { padding: 13, borderRadius: 16, backgroundColor: 'rgba(212,79,79,0.08)', borderWidth: 1, borderColor: 'rgba(212,79,79,0.2)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  logoutText: { fontSize: 13, fontWeight: '600', color: C.red },
  subHeader: { paddingHorizontal: 18, paddingTop: 48, paddingBottom: 16, flexDirection: 'row', gap: 12, alignItems: 'center' },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, alignItems: 'center', justifyContent: 'center' },
  subTitle: { fontSize: 20, fontWeight: '800', color: C.tp },
  subText: { fontSize: 11, color: C.ts, marginTop: 2 },
  infoRow: { padding: 15, borderRadius: 16, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, marginBottom: 10 },
  infoText: { fontSize: 13, color: C.tp, lineHeight: 20 },
  langPicker: { gap: 10, marginBottom: 14 },
  langOption: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b },
  langOptionActive: { backgroundColor: 'rgba(113,40,206,0.14)', borderColor: 'rgba(148,88,224,0.55)' },
  langOptionCode: { width: 34, fontSize: 11, fontWeight: '800', color: C.ts, letterSpacing: 1 },
  langOptionCodeActive: { color: C.purpleL },
  langOptionLabel: { fontSize: 13.5, fontWeight: '700', color: C.tp },
  langOptionSub: { fontSize: 10.5, color: C.ts, marginTop: 1 },
  langDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: C.tm },
  langDotActive: { backgroundColor: C.purpleL, borderColor: C.purpleL },
  outlineBtn: { marginTop: 4, padding: 13, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(196,141,56,0.3)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  outlineText: { color: C.gold, fontSize: 13, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 },
  chip: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 18, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b },
  chipActive: { backgroundColor: 'rgba(113,40,206,0.15)', borderColor: 'rgba(148,88,224,0.5)' },
  chipText: { fontSize: 11.5, fontWeight: '600', color: C.ts },
  chipTextActive: { color: C.purpleL },
  input: { minHeight: 110, textAlignVertical: 'top', padding: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: C.b, borderRadius: 14, fontSize: 12.5, color: C.tp, marginBottom: 12 },
  submit: { paddingVertical: 13, borderRadius: 14, backgroundColor: C.purple, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  submitDisabled: { backgroundColor: 'rgba(113,40,206,0.3)' },
  submitText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  success: { alignItems: 'center', padding: 26, borderRadius: 18, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b },
  successTitle: { marginTop: 12, fontSize: 17, fontWeight: '800', color: C.tp },
  successSub: { marginTop: 6, fontSize: 12, color: C.ts, textAlign: 'center', lineHeight: 18 },
  aboutScroll: { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 20 },
  aboutScrollCityFlow: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 20 },
  aboutLogoWrap: { alignItems: 'center', paddingTop: 14, paddingBottom: 22 },
  aboutLogo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    shadowColor: '#B48CDC',
    shadowOpacity: 0.3,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 0 },
  },
  aboutBrand: {
    marginTop: 14,
    fontFamily: FONTS.cinzel,
    fontSize: 22,
    fontWeight: '600',
    color: C.tp,
    letterSpacing: 1.76,
  },
  aboutVersion: { fontSize: 11, color: C.ts, marginTop: 4 },
  aboutFooter: { textAlign: 'center', fontSize: 10, color: C.tm, marginTop: 16 },
  devContactCard: {
    backgroundColor: 'rgba(73,189,235,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(73,189,235,0.34)',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginTop: -2,
    marginBottom: 11,
  },
  devContactRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  devContactIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(73,189,235,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(73,189,235,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  devContactLabel: { fontSize: 10, fontWeight: '800', color: '#49BDEB', letterSpacing: 1, textTransform: 'uppercase' },
  devContactValue: { fontSize: 12.5, fontWeight: '600', color: C.tp, marginTop: 2 },
  devContactDivider: { height: 1, backgroundColor: 'rgba(73,189,235,0.22)', marginVertical: 11, marginLeft: 43 },
  infoSection: { backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 18, paddingVertical: 15, paddingHorizontal: 16, marginBottom: 11 },
  infoSectionHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  infoSectionIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  infoSectionTitle: { fontSize: 13.5, fontWeight: '700', color: C.tp },
  infoSectionBody: { fontSize: 12, color: C.ts, lineHeight: 20.4 },
  toggle: { width: 44, height: 26, borderRadius: 20, padding: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: C.purple },
  toggleOff: { backgroundColor: 'rgba(255,255,255,0.1)' },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  toggleKnobOn: { transform: [{ translateX: 18 }] },
  pageKicker: { fontSize: 10, fontWeight: '700', color: C.tm, letterSpacing: 1.2, textTransform: 'uppercase', marginHorizontal: 2, marginTop: 6, marginBottom: 10 },
  settingsGroup: { gap: 9, marginBottom: 18 },
  settingsGroupPrivacy: { gap: 9, marginBottom: 18 },
  settingsLangRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b },
  settingsLangRowActive: { backgroundColor: 'rgba(113,40,206,0.12)', borderColor: 'rgba(148,88,224,0.5)' },
  settingsLangCode: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surfHi, borderWidth: 1, borderColor: C.b },
  settingsLangCodeActive: { backgroundColor: 'rgba(148,88,224,0.22)', borderColor: 'rgba(148,88,224,0.45)' },
  settingsLangCodeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, color: C.ts },
  settingsLangCodeTextActive: { color: C.purpleL },
  settingsLangNative: { fontSize: 13, fontWeight: '600', color: C.tp },
  settingsLangName: { fontSize: 10.5, color: C.ts, marginTop: 1 },
  prefRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 14 },
  prefIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  prefLabel: { fontSize: 13, fontWeight: '600', color: C.tp },
  prefSub: { fontSize: 10.5, color: C.ts, marginTop: 1 },
  privacyPrefRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 14 },
  permissionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, paddingHorizontal: 14, backgroundColor: C.surf, borderWidth: 1, borderColor: C.b, borderRadius: 14 },
  permissionLabel: { fontSize: 13, fontWeight: '600', color: C.tp },
  permissionValue: { fontSize: 11, color: C.ts },
  deleteBtn: { width: '100%', paddingVertical: 13, borderRadius: 14, backgroundColor: 'rgba(212,79,79,0.08)', borderWidth: 1, borderColor: 'rgba(212,79,79,0.25)', alignItems: 'center' },
  deleteText: { color: C.red, fontSize: 12.5, fontWeight: '600' },
  funFactsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 15, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(74,138,90,0.3)' },
  funFactsIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(74,138,90,0.18)', borderWidth: 1, borderColor: 'rgba(74,138,90,0.3)', alignItems: 'center', justifyContent: 'center' },
  funFactsTitle: { fontSize: 13, fontWeight: '700', color: C.tp },
  funFactsSub: { fontSize: 10.5, color: C.ts, marginTop: 1 },
});
