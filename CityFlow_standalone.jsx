
/* ── runtime shim (React + lucide icons provided by host/UMD) ── */
const { useState, useEffect, useRef } = React;
function __mkIcon(name){
  return function LucideIcon(props){
    props = props || {};
    var size = props.size == null ? 24 : props.size;
    var color = props.color || 'currentColor';
    var sw = props.strokeWidth == null ? 2 : props.strokeWidth;
    var fill = props.fill || 'none';
    var lib = (typeof window !== 'undefined' && window.lucide) ? window.lucide : {};
    var entry = lib[name] || (lib.icons && lib.icons[name]);
    var node = (entry && entry[2]) || [];
    var kids = node.map(function(c, i){ return React.createElement(c[0], Object.assign({ key:i }, c[1])); });
    return React.createElement('svg', {
      xmlns:'http://www.w3.org/2000/svg', width:size, height:size, viewBox:'0 0 24 24',
      fill:fill, stroke:color, strokeWidth:sw, strokeLinecap:'round', strokeLinejoin:'round',
      style:props.style, className:props.className
    }, kids);
  };
}
const MapPin = __mkIcon('MapPin');
const MapPinned = __mkIcon('MapPinned');
const Search = __mkIcon('Search');
const Bell = __mkIcon('Bell');
const Navigation = __mkIcon('Navigation');
const Car = __mkIcon('Car');
const Building2 = __mkIcon('Building2');
const CalendarDays = __mkIcon('CalendarDays');
const ChevronRight = __mkIcon('ChevronRight');
const Clock = __mkIcon('Clock');
const Home = __mkIcon('Home');
const Compass = __mkIcon('Compass');
const User = __mkIcon('User');
const AlertCircle = __mkIcon('AlertCircle');
const Radio = __mkIcon('Radio');
const Leaf = __mkIcon('Leaf');
const Coffee = __mkIcon('Coffee');
const Eye = __mkIcon('Eye');
const EyeOff = __mkIcon('EyeOff');
const ArrowRight = __mkIcon('ArrowRight');
const Phone = __mkIcon('Phone');
const Lock = __mkIcon('Lock');
const Package = __mkIcon('Package');
const Send = __mkIcon('Send');
const CheckCircle = __mkIcon('CheckCircle');
const Shield = __mkIcon('Shield');
const Star = __mkIcon('Star');
const Settings = __mkIcon('Settings');
const HelpCircle = __mkIcon('HelpCircle');
const LogOut = __mkIcon('LogOut');
const Tag = __mkIcon('Tag');
const BookOpen = __mkIcon('BookOpen');
const ChevronDown = __mkIcon('ChevronDown');
const ChevronUp = __mkIcon('ChevronUp');
const Smartphone = __mkIcon('Smartphone');
const Wallet = __mkIcon('Wallet');
const Watch = __mkIcon('Watch');
const Zap = __mkIcon('Zap');
const FileText = __mkIcon('FileText');
const MapPinOff = __mkIcon('MapPinOff');
const Plus = __mkIcon('Plus');
const X = __mkIcon('X');
const Check = __mkIcon('Check');
const Flame = __mkIcon('Flame');
const Ambulance = __mkIcon('Ambulance');
const TrafficCone = __mkIcon('TrafficCone');
const Bot = __mkIcon('Bot');
const Lightbulb = __mkIcon('Lightbulb');
const Store = __mkIcon('Store');
const Utensils = __mkIcon('Utensils');
const Landmark = __mkIcon('Landmark');
const Hotel = __mkIcon('Hotel');
const Banknote = __mkIcon('Banknote');
const PhoneCall = __mkIcon('PhoneCall');
const Mail = __mkIcon('Mail');
const Globe = __mkIcon('Globe');
const Info = __mkIcon('Info');
const ChevronLeft = __mkIcon('ChevronLeft');
const RotateCcw = __mkIcon('RotateCcw');
const Trophy = __mkIcon('Trophy');
const Wifi = __mkIcon('Wifi');
const Siren = __mkIcon('Siren');


/* ── Tokens ──────────────────────────────────────────────── */
const C = {
  bg:     "#08011A",
  surf:   "rgba(255,255,255,0.04)",
  surfHi: "rgba(255,255,255,0.07)",
  purple: "#7128CE",
  purpleL:"#9458E0",
  gold:   "#C48D38",
  goldL:  "#D9A85A",
  tp:     "#EBE3D6",
  ts:     "#8C7DA0",
  tm:     "#504460",
  b:      "rgba(255,255,255,0.07)",
  bHi:    "rgba(255,255,255,0.14)",
  green:  "#3DAA6A",
  amber:  "#C48D38",
  red:    "#D44F4F",
};
const FONT   = "'Sora', sans-serif";
const CINZEL = "'Cinzel', serif";

/* ── Mock Data ───────────────────────────────────────────── */
const FOUND_ITEMS = [
  { id:1, item:"Samsung Galaxy S21",      category:"Electronics",   desc:"Black Samsung phone with cracked screen protector found near the water fountain at Gate B.", location:"Main Auditorium — Gate B", date:"Dec 15, 2024", status:"pending", ref:"LF-2024-0041" },
  { id:2, item:"Brown Leather Wallet",    category:"Wallet/Purse",  desc:"Brown leather bifold wallet containing some cash and a national ID card.", location:"Guest House B — Reception", date:"Dec 14, 2024", status:"claimed", ref:"LF-2024-0039" },
  { id:3, item:"Blue Nike Backpack",      category:"Bag/Luggage",   desc:"Medium-sized blue Nike backpack with several document folders inside.", location:"Car Park C — Row 4", date:"Dec 15, 2024", status:"pending", ref:"LF-2024-0042" },
  { id:4, item:"Gold Analog Wristwatch",  category:"Jewellery",     desc:"Gold-tone Fossil analog wristwatch with a brown leather strap.", location:"Prayer Mountain — Main Steps", date:"Dec 13, 2024", status:"pending", ref:"LF-2024-0037" },
  { id:5, item:"Apple AirPods Pro Case",  category:"Electronics",   desc:"White AirPods Pro charging case (no earbuds). Initials 'T.K.' engraved on the lid.", location:"Camp Restaurant Area", date:"Dec 14, 2024", status:"claimed", ref:"LF-2024-0038" },
  { id:6, item:"Red Children's Bible",   category:"Book/Document", desc:"Red hardcover children's Bible. Name 'Grace Okafor' written on the inside cover.", location:"Children's Pavilion", date:"Dec 16, 2024", status:"pending", ref:"LF-2024-0043" },
];

const EXPLORE_PLACES = [
  { Icon:Building2, name:"Main Auditorium",      cat:"Worship",   dist:"0.2km", color:"#6B35C0", rating:"4.9" },
  { Icon:Home,      name:"Guest House A",         cat:"Stay",      dist:"0.3km", color:"#2A7FAB", rating:"4.7" },
  { Icon:Home,      name:"Guest House B",         cat:"Stay",      dist:"0.5km", color:"#2A7FAB", rating:"4.5" },
  { Icon:Leaf,      name:"Prayer Garden",         cat:"Spiritual", dist:"0.6km", color:"#4A8A5A", rating:"4.8" },
  { Icon:Coffee,    name:"Camp Restaurant",       cat:"Dining",    dist:"0.3km", color:"#C48D38", rating:"4.3" },
  { Icon:Coffee,    name:"Bread of Life Café",    cat:"Dining",    dist:"0.7km", color:"#C48D38", rating:"4.6" },
  { Icon:Car,       name:"Main Car Park",         cat:"Transport", dist:"0.1km", color:"#6A6880", rating:"3.9" },
  { Icon:BookOpen,  name:"Camp Bookshop",         cat:"Retail",    dist:"0.5km", color:"#9B5E3A", rating:"4.4" },
  { Icon:Building2, name:"Children's Pavilion",   cat:"Worship",   dist:"0.8km", color:"#6B35C0", rating:"4.6" },
  { Icon:Leaf,      name:"Prayer Mountain",       cat:"Spiritual", dist:"1.2km", color:"#4A8A5A", rating:"4.9" },
];

const RIDE_TYPES = [
  { id:"shuttle",  label:"Camp Shuttle", seats:12, fare:"₦150", eta:"8 min", note:"Shared bus between all zones" },
  { id:"standard", label:"Standard",     seats:4,  fare:"₦450", eta:"5 min", note:"Comfortable sedan" },
  { id:"premium",  label:"Premium",      seats:4,  fare:"₦850", eta:"3 min", note:"Priority pickup · AC guaranteed" },
];

const RECENT_DEST = ["Main Auditorium","Guest House A","Prayer Mountain","Camp Bookshop"];

const CATS_LOST = ["Electronics","Clothing","Bag/Luggage","Documents","Wallet","Jewellery","Book","Other"];
const LOCATIONS = ["Main Auditorium","Guest House A","Guest House B","Prayer Garden","Camp Restaurant",
  "Car Park A","Car Park B","Car Park C","Bookshop","Prayer Mountain","Children's Pavilion","Main Gate","Other"];

const BUSINESSES = [
  { cat:"Restaurants", Icon:Utensils, color:"#C48D38", items:[
    { name:"Camp Restaurant",        desc:"Main dining hall — breakfast, lunch & dinner",  hours:"7AM–9PM",  rating:"4.3", phone:"0800-CAMP-EAT" },
    { name:"Bread of Life Café",     desc:"Coffee, snacks, light meals & pastries",        hours:"6AM–8PM",  rating:"4.6", phone:"0800-CAFE-01" },
    { name:"Manna Fast Food",        desc:"Burgers, suya, jollof rice & shawarma",         hours:"10AM–10PM",rating:"4.1", phone:"0800-MANNA-01" },
  ]},
  { cat:"Hotels & Guest Houses", Icon:Hotel, color:"#2A7FAB", items:[
    { name:"Guest House A",          desc:"Standard rooms · 84 units · AC & WiFi",        hours:"24hrs",    rating:"4.7", phone:"0800-GHOUSE-A" },
    { name:"Guest House B",          desc:"Economy rooms · 120 units · shared facilities",hours:"24hrs",    rating:"4.5", phone:"0800-GHOUSE-B" },
    { name:"VIP Guest Lodge",        desc:"Premium suites · limited availability",         hours:"24hrs",    rating:"4.9", phone:"0800-VIP-LOD" },
  ]},
  { cat:"Banks & ATMs", Icon:Banknote, color:"#4A8A5A", items:[
    { name:"Access Bank Branch",     desc:"Full service banking · ATM available",          hours:"8AM–4PM",  rating:"4.0", phone:"0700-ACCESS" },
    { name:"GTBank ATM",             desc:"24-hour ATM — near Main Auditorium",            hours:"24hrs",    rating:"4.2", phone:"0802-900-5900" },
    { name:"POS Centre",             desc:"Mobile money transfers & bill payments",        hours:"8AM–8PM",  rating:"4.4", phone:"0800-POS-001" },
  ]},
  { cat:"Shops & Services", Icon:Store, color:"#9B5E3A", items:[
    { name:"Camp Bookshop",          desc:"Bibles, devotionals, souvenirs & stationery",  hours:"9AM–7PM",  rating:"4.4", phone:"0800-BOOKS-01" },
    { name:"City Pharmacy",          desc:"OTC drugs, first aid & health products",        hours:"7AM–9PM",  rating:"4.6", phone:"0800-PHARMA-1" },
    { name:"Redemption Supermart",   desc:"Groceries, beverages, toiletries & more",      hours:"8AM–9PM",  rating:"4.2", phone:"0800-MART-001" },
  ]},
];

const FUN_FACTS = [
  { fact:"Redemption City was officially commissioned in 1999 and now hosts over 1 million visitors annually during major conventions.", icon:"🏙️" },
  { fact:"The Redemption Camp covers an area of over 560 square kilometres — larger than some entire states in Nigeria!", icon:"🗺️" },
  { fact:"The Main Auditorium at Redemption Camp has a seating capacity of over 1 million people, one of the largest in the world.", icon:"🏟️" },
  { fact:"Redemption City has its own dedicated power supply, water treatment plant, and internal road network of over 30km.", icon:"⚡" },
  { fact:"The Redemption Camp Expressway was constructed specifically to ease access — it's over 21km long and connects directly to the Lagos–Ibadan Expressway.", icon:"🛣️" },
  { fact:"There are over 3,000 buildings inside Redemption City including churches, schools, banks, hospitals, and hotels.", icon:"🏘️" },
  { fact:"CityFlow processes an average of 4,200 ride bookings every week during peak convention periods.", icon:"🚗" },
  { fact:"Prayer Mountain within the camp grounds records the highest visitor traffic in the early morning hours — typically between 4AM and 6AM.", icon:"⛰️" },
];

const CONTACTS_DATA = [
  { group:"Emergency", color:"#D44F4F", contacts:[
    { name:"General Emergency",     phone:"112",              Icon:Siren,      note:"Free call, works without airtime" },
    { name:"Ambulance",             phone:"199",              Icon:Ambulance,  note:"Medical emergencies" },
    { name:"Police",                phone:"112 / 07055201816",Icon:Shield,     note:"Crime & security" },
    { name:"Fire Service",          phone:"190",              Icon:Flame,      note:"Fire & rescue" },
    { name:"Road Safety (FRSC)",    phone:"122",              Icon:TrafficCone,note:"Traffic accidents" },
  ]},
  { group:"Camp Administration", color:"#7128CE", contacts:[
    { name:"Camp Office (Main)",    phone:"0800-RCCG-HQ",     Icon:Building2,  note:"General enquiries" },
    { name:"Security Desk",         phone:"0800-CAMP-SEC",    Icon:Shield,     note:"24-hour security operations" },
    { name:"Lost & Found Office",   phone:"0800-LF-CAMP",     Icon:Package,    note:"Gate B, Main Auditorium" },
    { name:"Medical Centre",        phone:"0800-MED-CAMP",    Icon:Ambulance,  note:"On-site clinic — 24hrs" },
  ]},
  { group:"Hospitality", color:"#2A7FAB", contacts:[
    { name:"Guest House A",         phone:"0800-GHOUSE-A",    Icon:Hotel,      note:"Bookings & reception" },
    { name:"Guest House B",         phone:"0800-GHOUSE-B",    Icon:Hotel,      note:"Bookings & reception" },
    { name:"Camp Restaurant",       phone:"0800-CAMP-EAT",    Icon:Utensils,   note:"Reservations & catering" },
  ]},
  { group:"CityFlow Support", color:"#C48D38", contacts:[
    { name:"CityFlow Helpdesk",     phone:"0800-CITYFLOW",    Icon:Smartphone, note:"App support & ride issues" },
    { name:"CityFlow WhatsApp",     phone:"+234 800 CITY 01", Icon:Phone,      note:"Chat support — 8AM–10PM" },
    { name:"Email Support",         phone:"support@cityflow.ng",Icon:Mail,     note:"Response within 2 hours" },
  ]},
];

const QUIZ_QUESTIONS = [
  { q:"What is the seating capacity of the Main Auditorium at Redemption Camp?", options:["500,000","1 million","2 million","250,000"], correct:1 },
  { q:"What year was Redemption City officially commissioned?", options:["1989","1993","1999","2005"], correct:2 },
  { q:"How large is Redemption City in square kilometres?", options:["120 km²","350 km²","560 km²","800 km²"], correct:2 },
  { q:"How long is the Redemption Camp Expressway?", options:["5km","10km","15km","21km"], correct:3 },
  { q:"Which emergency number works even without airtime credit in Nigeria?", options:["199","190","112","122"], correct:2 },
  { q:"What is the name of the spiritual retreat location inside the camp?", options:["Holy Hill","Prayer Mountain","Mount Zion","Faith Peak"], correct:1 },
  { q:"Approximately how many buildings are inside Redemption City?", options:["500+","1,000+","3,000+","10,000+"], correct:2 },
  { q:"What does 'RCCG' stand for in the context of Redemption City?", options:["Royal Christian Church of God","Redeemed Christian Church of God","Reformed Church of Christ Global","Redemption City Church of Grace"], correct:1 },
];

/* ── Global CSS ──────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Cinzel:wght@500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { display: none; }
  input, textarea, select { font-family: 'Sora', sans-serif; }
  input::placeholder, textarea::placeholder { color: #504460; }
  input, textarea { caret-color: #C48D38; }
  select option { background: #0e0428; color: #EBE3D6; }
  @keyframes livepulse { 0%,100%{ opacity:1 } 50%{ opacity:0.25 } }
  @keyframes fadeup { from { transform:translateY(12px) } to { transform:translateY(0) } }
  @keyframes spin    { to { transform:rotate(360deg) } }
  @keyframes dotp    { 0%,80%,100%{ opacity:0.2; transform:scale(0.8) } 40%{ opacity:1; transform:scale(1.15) } }
  @keyframes scalein { from{ transform:scale(0.88) } to{ transform:scale(1) } }
  @keyframes tickerScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  .live  { animation: livepulse 2s ease-in-out infinite; }
  .fu0   { animation: fadeup 0.45s ease 0.05s both; }
  .fu1   { animation: fadeup 0.45s ease 0.12s both; }
  .fu2   { animation: fadeup 0.45s ease 0.20s both; }
  .fu3   { animation: fadeup 0.45s ease 0.28s both; }
  .fu4   { animation: fadeup 0.45s ease 0.36s both; }
  .si    { animation: scalein 0.35s ease both; }
`;

/* ── PhoneShell ──────────────────────────────────────────── */
function PhoneShell({ children }) {
  return (
    <div style={{
      width:390, height:844, background:C.bg, borderRadius:50,
      overflow:"hidden", position:"relative", display:"flex", flexDirection:"column",
      boxShadow:`0 80px 160px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.08),
                 inset 0 1px 0 rgba(255,255,255,0.06)`,
      fontFamily:FONT,
    }}>
      <div style={{ display:"flex", justifyContent:"center", paddingTop:14, flexShrink:0 }}>
        <div style={{ width:126, height:34, background:"#000", borderRadius:20 }} />
      </div>
      {children}
    </div>
  );
}

/* ── BottomNav ───────────────────────────────────────────── */
const NAV_TABS = [
  { id:"home",         Icon:Home,    label:"Home"     },
  { id:"cityride",     Icon:Car,     label:"CityRide" },
  { id:"explore",      Icon:Compass, label:"Explore"  },
  { id:"lostandfound", Icon:Package, label:"Lost & Fnd"},
  { id:"more",         Icon:Zap,     label:"More"     },
];

function BottomNav({ tab, setTab }) {
  return (
    <div style={{ flexShrink:0, padding:"10px 2px 30px", background:"rgba(7,1,18,0.92)",
      backdropFilter:"blur(24px)", borderTop:`1px solid ${C.b}` }}>
      <div style={{ display:"flex", justifyContent:"space-around" }}>
        {NAV_TABS.map(({ id, Icon, label }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              background:"none", border:"none", cursor:"pointer", padding:"5px 6px",
              opacity: active ? 1 : 0.38, transition:"opacity 0.2s ease", fontFamily:FONT,
            }}>
              <Icon size={20} strokeWidth={active ? 2.2 : 1.6} color={active ? C.gold : C.tp}/>
              <span style={{ fontSize:9, fontWeight: active?600:400, color: active?C.gold:C.ts, whiteSpace:"nowrap" }}>{label}</span>
              {active && <div style={{ width:3, height:3, borderRadius:"50%", background:C.gold }}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── AppShell ────────────────────────────────────────────── */
function AppShell({ tab, setTab, children }) {
  return (
    <PhoneShell>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
          {children}
        </div>
        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    </PhoneShell>
  );
}

/* ── SectionHeader ───────────────────────────────────────── */
function SectionHeader({ title, action="See all", onAction }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <span style={{ fontSize:15, fontWeight:700, color:C.tp, letterSpacing:"-0.01em" }}>{title}</span>
      {action && (
        <div onClick={onAction} style={{ display:"flex", alignItems:"center", gap:2, cursor:"pointer" }}>
          <span style={{ fontSize:11, color:C.gold, fontWeight:500 }}>{action}</span>
          <ChevronRight size={12} color={C.gold} strokeWidth={2.5}/>
        </div>
      )}
    </div>
  );
}

/* ── ScreenHeader (inner screens) ────────────────────────── */
function ScreenHeader({ title, sub }) {
  return (
    <div style={{ padding:"18px 22px 6px" }}>
      <div style={{ fontSize:20, fontWeight:700, color:C.tp, letterSpacing:"-0.01em" }}>{title}</div>
      {sub && <div style={{ fontSize:12, color:C.ts, marginTop:4 }}>{sub}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SPLASH SCREEN
══════════════════════════════════════════════════════════ */
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"),  2100);
    const t3 = setTimeout(() => onDone(),          2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  const fading = phase === "out";
  const held   = phase !== "in";
  return (
    <PhoneShell>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        position:"relative", overflow:"hidden",
        opacity:fading?0:1, transition:fading?"opacity 0.55s ease":"none" }}>
        <div style={{ position:"absolute", inset:0,
          background:"radial-gradient(ellipse 60% 50% at 50% 55%, rgba(100,35,200,0.26) 0%, transparent 70%)",
          pointerEvents:"none" }}/>
        <div style={{ width:48, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,
          marginBottom:22, opacity:held?1:0, transition:"opacity 0.6s ease 0.1s" }}/>
        <div style={{ transform:`scale(${held?1:0.85})`, transition:"transform 0.65s cubic-bezier(0.34,1.56,0.64,1)", textAlign:"center" }}>
          <img src={(window.__resources && window.__resources.logo) || "cityflow_logo.png"} alt="Redemption City of God" style={{ width:108, height:108, objectFit:"contain", display:"block", margin:"0 auto 22px", borderRadius:"50%", boxShadow:"0 0 44px rgba(180,140,220,0.4), 0 0 0 1px rgba(255,255,255,0.12)" }}/>
          <div style={{ fontFamily:CINZEL, fontSize:38, fontWeight:600, color:C.tp, letterSpacing:"0.1em",
            textShadow:"0 0 40px rgba(180,140,220,0.25)" }}>CityFlow</div>
          <div style={{ height:1, marginTop:10, background:`linear-gradient(90deg,transparent,${C.gold} 40%,transparent)` }}/>
          <div style={{ fontSize:11, color:C.gold, letterSpacing:"0.3em", fontWeight:500, marginTop:10,
            textTransform:"uppercase", opacity:held?1:0, transition:"opacity 0.5s ease 0.2s" }}>
            Redemption City
          </div>
        </div>
        <div style={{ width:48, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,
          marginTop:22, opacity:held?1:0, transition:"opacity 0.6s ease 0.1s" }}/>
        <div style={{ position:"absolute", bottom:52, display:"flex", gap:6, alignItems:"center",
          opacity:held?1:0, transition:"opacity 0.4s ease 0.3s" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:5, height:5, borderRadius:"50%", background:C.gold,
              animation:`dotp 1.2s ease ${i*0.2}s infinite` }}/>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

/* ══════════════════════════════════════════════════════════
   LOGIN SCREEN
══════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [phone,   setPhone]   = useState("");
  const [pass,    setPass]    = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  }

  const inputBase = {
    width:"100%", padding:"13px 14px 13px 44px", background:"rgba(255,255,255,0.05)",
    border:`1px solid ${C.b}`, borderRadius:14, fontSize:13.5, color:C.tp, outline:"none",
    fontFamily:FONT, transition:"border-color 0.2s, background 0.2s", WebkitAppearance:"none",
  };
  const fld = (f) => ({
    ...inputBase,
    borderColor: focused===f ? "rgba(113,40,206,0.55)" : C.b,
    background:  focused===f ? "rgba(113,40,206,0.08)" : "rgba(255,255,255,0.05)",
  });

  return (
    <PhoneShell>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", top:-80, left:"50%", transform:"translateX(-50%)",
          width:280, height:280, background:"radial-gradient(circle,rgba(100,30,190,0.22) 0%,transparent 70%)",
          pointerEvents:"none" }}/>
        <div style={{ padding:"28px 26px 0", position:"relative" }}>
          <div style={{ fontFamily:CINZEL, fontSize:22, fontWeight:600, color:C.tp, letterSpacing:"0.06em" }}>CityFlow</div>
          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
            <MapPin size={10} color={C.gold} strokeWidth={2.5}/>
            <span style={{ fontSize:10, color:C.ts }}>Redemption City</span>
          </div>
        </div>
        <div style={{ padding:"32px 26px 0" }}>
          <div style={{ fontSize:26, fontWeight:700, color:C.tp, lineHeight:1.2 }}>Welcome back</div>
          <div style={{ fontSize:13, color:C.ts, marginTop:7, lineHeight:1.6 }}>
            Sign in to continue your journey across the city.
          </div>
        </div>
        <div style={{ padding:"28px 22px 0", display:"flex", flexDirection:"column", gap:13 }}>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
              <Phone size={15} color={focused==="phone"?C.purpleL:C.ts} strokeWidth={1.8}/>
            </div>
            <input type="tel" placeholder="Phone number or email" value={phone}
              onChange={e=>setPhone(e.target.value)}
              onFocus={()=>setFocused("phone")} onBlur={()=>setFocused(null)}
              style={fld("phone")}/>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
              <Lock size={15} color={focused==="pass"?C.purpleL:C.ts} strokeWidth={1.8}/>
            </div>
            <input type={showPw?"text":"password"} placeholder="Password" value={pass}
              onChange={e=>setPass(e.target.value)}
              onFocus={()=>setFocused("pass")} onBlur={()=>setFocused(null)}
              style={{ ...fld("pass"), paddingRight:44 }}/>
            <div onClick={()=>setShowPw(p=>!p)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", cursor:"pointer" }}>
              {showPw?<EyeOff size={15} color={C.ts} strokeWidth={1.8}/>:<Eye size={15} color={C.ts} strokeWidth={1.8}/>}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:-4 }}>
            <span style={{ fontSize:12, color:C.gold, cursor:"pointer", fontWeight:500 }}>Forgot password?</span>
          </div>
          <button onClick={handleLogin} style={{
            width:"100%", padding:"14px 0", borderRadius:15, border:"none", cursor:"pointer",
            background:loading?"rgba(113,40,206,0.4)":`linear-gradient(135deg,${C.purple} 0%,#5A18A8 100%)`,
            fontSize:14, fontWeight:600, color:"#fff", fontFamily:FONT,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:loading?"none":"0 8px 28px rgba(100,30,190,0.35)",
            transition:"background 0.2s, transform 0.1s",
          }}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.98)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            {loading
              ? <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin 0.7s linear infinite" }}/>
              : <><span>Sign In</span><ArrowRight size={15} strokeWidth={2.5}/></>
            }
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"22px 22px 0" }}>
          <div style={{ flex:1, height:1, background:C.b }}/><span style={{ fontSize:11, color:C.tm }}>or continue with</span>
          <div style={{ flex:1, height:1, background:C.b }}/>
        </div>
        <div style={{ display:"flex", gap:12, padding:"14px 22px 0" }}>
          {[
            ["Google", (
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
              </svg>
            )],
            ["Apple", (
              <svg width="16" height="16" viewBox="0 0 24 24" fill={C.tp} aria-hidden="true" style={{ marginTop:-2 }}>
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            )],
          ].map(([lbl, ic]) => (
            <button key={lbl} style={{
              flex:1, padding:"11px 0", borderRadius:13, background:C.surf,
              border:`1px solid ${C.b}`, fontSize:13, fontWeight:600, color:C.tp,
              cursor:"pointer", fontFamily:FONT, transition:"background 0.15s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}
              onMouseEnter={e=>e.currentTarget.style.background=C.surfHi}
              onMouseLeave={e=>e.currentTarget.style.background=C.surf}
            >{ic}<span>{lbl}</span></button>
          ))}
        </div>
        <div style={{ flex:1, display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:34 }}>
          <span style={{ fontSize:13, color:C.ts }}>
            Don't have an account?{" "}
            <span style={{ color:C.gold, fontWeight:600, cursor:"pointer" }}>Sign up</span>
          </span>
        </div>
      </div>
    </PhoneShell>
  );
}


/* ══════════════════════════════════════════════════════════
   HOME SCREEN
══════════════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════════════════════
   EXTRA ICONS (for the upgraded home features)
════════════════════════════════════════════════════════════════ */
const Sun = __mkIcon('Sun');
const Quote = __mkIcon('Quote');
const ImageIcon = __mkIcon('Image');
const Church = __mkIcon('Church');
const Heart = __mkIcon('Heart');
const Share2 = __mkIcon('Share2');
const Droplets = __mkIcon('Droplets');
const Wind = __mkIcon('Wind');
const Sparkles = __mkIcon('Sparkles');
const Camera = __mkIcon('Camera');
const ArrowUpRight = __mkIcon('ArrowUpRight');
const Sunrise = __mkIcon('Sunrise');
const Cloud = __mkIcon('Cloud');
const CloudRain = __mkIcon('CloudRain');
const Thermometer = __mkIcon('Thermometer');

/* ── new feature data ──────────────────────────────────────────── */
const EVENTS = [
  { day:"SUN", date:"15", title:"Sunday Victory Service",  venue:"Main Auditorium", time:"8:00 AM",  tag:"Worship", color:"#7128CE", live:true,
    yt:"https://www.youtube.com/@RCCGofficial/live",
    desc:"A powerful service of worship, the Word and testimonies, led by the General Overseer. Doors open 7:00 AM — come early, seats fill up fast." },
  { day:"FRI", date:"06", title:"Holy Ghost Service",      venue:"Main Auditorium", time:"6:00 PM",  tag:"Special", color:"#C48D38",
    desc:"The monthly all-night service of prayer, worship and miracles that draws visitors from across the world." },
  { day:"SAT", date:"21", title:"Youth Convention",        venue:"Youth Centre",    time:"4:00 PM",  tag:"Youth",   color:"#2A7FAB",
    desc:"Worship, teaching and connection for young people across the city — with guest ministers and live music." },
  { day:"WED", date:"18", title:"Mass Choir Rehearsal",    venue:"Music Hall",      time:"5:30 PM",  tag:"Music",   color:"#4A8A5A",
    desc:"Open rehearsal for all choir departments ahead of the convention. New members welcome." },
  { day:"MON", date:"23", title:"Digging Deep Bible Study", venue:"Faith Chapel",   time:"5:00 PM",  tag:"Study",   color:"#9B5E3A",
    desc:"Verse-by-verse Bible study — bring your Bible and a notebook. Tea and refreshments afterwards." },
];

const CHURCHES = [
  { name:"City of God Cathedral", dist:"0.2km", addr:"Central Plaza, Redemption City", service:"8:00 AM · Sun", color:"#7128CE" },
  { name:"Faith Chapel — Zone 3", dist:"0.6km", addr:"Block C, Residential Quarter",   service:"9:00 AM · Sun", color:"#2A7FAB" },
  { name:"Grace Assembly Parish", dist:"1.1km", addr:"Camp Road North, Gate 4",        service:"7:30 AM · Sun", color:"#4A8A5A" },
  { name:"Mount Zion Parish",     dist:"1.4km", addr:"Prayer Mountain Foot, East Wing", service:"6:00 AM · Sun", color:"#C48D38" },
];

const HOME_NOTIFS = [
  { Icon:Radio,        color:"#7128CE", title:"Monthly Thanksgiving Service", body:"Join us Saturday at 6PM for a special celebration of praise and worship.", time:"2h ago", unread:true },
  { Icon:AlertCircle,  color:"#D44F4F", title:"Lost: Black Wallet — Gate B",  body:"A black leather wallet was found at Gate B. Contact the security desk to claim.", time:"4h ago", unread:true },
  { Icon:CalendarDays, color:"#2A7FAB", title:"Reminder: Holy Ghost Service", body:"Starts in 3 hours at the Main Auditorium. Tap to get directions.", time:"5h ago", unread:true },
  { Icon:Navigation,   color:"#C48D38", title:"Camp Road Closure",            body:"Main Camp Road closed 10AM–2PM for event. Please use Alternative Route 2.", time:"6h ago" },
  { Icon:Bot,          color:"#9458E0", title:"CityFlow AI tip",              body:"You can now ask me for directions to any location inside the city.", time:"1d ago" },
];

const GALLERY = [
  { title:"Sunrise at Prayer Mountain", by:"@grace.o",   g:"linear-gradient(160deg,#C48D38,#7128CE)" },
  { title:"Main Auditorium at Dusk",    by:"@cityflow",  g:"linear-gradient(160deg,#2A7FAB,#0A0218)" },
  { title:"Prayer Garden Bloom",        by:"@tunde.a",   g:"linear-gradient(160deg,#4A8A5A,#0A0218)" },
  { title:"Camp Lights, Night",         by:"@ada.n",     g:"linear-gradient(160deg,#7128CE,#0A0218)" },
  { title:"Bread of Life Café",         by:"@cityflow",  g:"linear-gradient(160deg,#9B5E3A,#0A0218)" },
  { title:"Gate B Walkway",             by:"@samuel.k",  g:"linear-gradient(160deg,#6A6880,#0A0218)" },
];

const QUOTES = [
  { text: "Thanksgiving is the glue that helps to firmly attach your blessings to you.", by: "Pastor E.A. Adeboye" },
  { text: "The first and biggest victory of all is victory over your own self.", by: "Pastor E.A. Adeboye" },
  { text: "Brethren, this is the time anybody will need grace more than ever before.", by: "Pastor (Mrs.) Folu Adeboye" },
  { text: "If you have been struggling with a problem, try praise.", by: "Pastor E.A. Adeboye" },
  { text: "When in trouble, praise and thank God.", by: "Pastor E.A. Adeboye" },
];
const DEVOTIONAL = {
  date:"Today", topic:"The Power of Praise",
  text:"Praise is the highest form of prayer. When you praise God in the midst of your circumstances, you invite His presence and power into your situation…",
  verse:"Let everything that has breath praise the Lord.", ref:"Psalm 150:6", reading:"Psalm 150",
};

/* ── shared bits ───────────────────────────────────────────────── */
function PulsingDot({ size=6, color="#F06565", style }) {
  return <div className="live" style={{ width:size, height:size, borderRadius:"50%", background:color, flexShrink:0, ...style }}/>;
}

function SubHeader({ onBack, title, sub, right }) {
  return (
    <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:10 }}>
      <div onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:C.surf,
        border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
        <ChevronLeft size={16} color={C.tp} strokeWidth={2}/>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:18, fontWeight:700, color:C.tp }}>{title}</div>
        {sub && <div style={{ fontSize:11, color:C.ts }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

/* ── WEATHER WIDGET ────────────────────────────────────────────── */
function WeatherWidget({ onOpen }) {
  return (
    <div onClick={onOpen} style={{ display:"flex", alignItems:"center", gap:9, background:C.surf, border:`1px solid ${C.b}`,
      borderRadius:22, padding:"7px 13px", flexShrink:0, cursor:"pointer" }}>
      <WeatherIcon main={WEATHER.conditionMain} size={28}/>
      <div>
        <div style={{ fontSize:16, fontWeight:700, color:C.tp, lineHeight:1 }}>{WEATHER.temp}°</div>
        <div style={{ fontSize:10, color:C.ts, marginTop:2 }}>{WEATHER.condition}</div>
      </div>
    </div>
  );
}

/* ── WEATHER ICON (condition → icon mapping) ──────────────────── */
function WeatherIcon({ main, size = 34, style, color }) {
  const props = { size, strokeWidth: 1.8, style };
  switch ((main ?? '').toLowerCase()) {
    case 'clear':        return <Sun        {...props} color={color || C.gold}  />;
    case 'rain':
    case 'drizzle':      return <CloudRain  {...props} color={color || "#6B9BC0"} />;
    case 'thunderstorm': return <CloudRain  {...props} color={color || "#7B6BC0"} />;
    case 'snow':         return <Cloud      {...props} color={color || "#B0D0E8"} />;
    case 'clouds':       return <Cloud      {...props} color={color || "#B0A8C0"} />;
    default:             return <Sun        {...props} color={color || C.gold}  />;
  }
}

const WEATHER = {
  city:"Redemption City", temp:29, feels:32, conditionMain:"Clear", condition:"Sunny", desc:"Sunny · clear skies",
  humidity:"64%", wind:"12 km/h", visibility:"10 km",
  hourly:[
    { t:"Now", temp:29, main:"Clear"  },
    { t:"1PM", temp:31, main:"Clear"  },
    { t:"2PM", temp:31, main:"Clouds" },
    { t:"3PM", temp:30, main:"Clouds" },
    { t:"4PM", temp:28, main:"Rain"   },
    { t:"5PM", temp:27, main:"Rain"   },
  ],
  days:[
    { d:"Tomorrow", main:"Clouds",       hi:30, lo:22 },
    { d:"Thursday", main:"Rain",         hi:27, lo:21 },
    { d:"Friday",   main:"Thunderstorm", hi:26, lo:21 },
    { d:"Saturday", main:"Clear",        hi:31, lo:23 },
  ],
};

/* ── WEATHER MODAL ───────────────────────────────────────── */
function WeatherModal({ onClose }) {
  return (
    <div style={{ position:"absolute", inset:0, zIndex:60, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(2,0,8,0.62)" }}/>
      <div className="si" style={{ position:"relative", background:"#0F0A1E", border:`1px solid ${C.bHi}`, borderBottom:"none",
        borderRadius:"24px 24px 0 0", padding:"10px 18px 28px", maxHeight:"78%", overflowY:"auto", scrollbarWidth:"none" }}>
        <div style={{ width:40, height:4, background:"rgba(255,255,255,0.18)", borderRadius:2, margin:"0 auto 14px" }}/>

        {/* header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:700, color:C.tp }}>Weather</div>
            <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
              <MapPin size={9} color={C.gold} strokeWidth={2.5}/>
              <span style={{ fontSize:10.5, color:C.ts }}>{WEATHER.city} · Updated just now</span>
            </div>
          </div>
          <div onClick={onClose} style={{ width:32, height:32, borderRadius:10, background:C.surf, border:`1px solid ${C.b}`,
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <X size={15} color={C.ts} strokeWidth={2}/>
          </div>
        </div>

        {/* current conditions */}
        <div style={{ background:"linear-gradient(148deg,rgba(196,141,56,0.12) 0%,rgba(10,2,24,1) 80%)",
          border:"1px solid rgba(196,141,56,0.22)", borderRadius:20, padding:"18px 16px",
          display:"flex", alignItems:"center", gap:16, marginBottom:14 }}>
          <WeatherIcon main={WEATHER.conditionMain} size={46}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:36, fontWeight:800, color:C.tp, lineHeight:1 }}>{WEATHER.temp}°</div>
            <div style={{ fontSize:11.5, color:C.ts, marginTop:5 }}>{WEATHER.desc}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, background:C.surfHi, border:`1px solid ${C.b}`,
            borderRadius:10, padding:"7px 10px", alignSelf:"flex-start" }}>
            <Thermometer size={11} color={C.gold} strokeWidth={2}/>
            <span style={{ fontSize:10, color:C.tp, fontWeight:500 }}>Feels {WEATHER.feels}°</span>
          </div>
        </div>

        {/* stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9, marginBottom:14 }}>
          {[[Droplets,"Humidity",WEATHER.humidity],[Wind,"Wind",WEATHER.wind],[Eye,"Visibility",WEATHER.visibility]].map(([Ic,lbl,val],i)=>(
            <div key={i} style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:14, padding:"11px 8px", textAlign:"center" }}>
              <Ic size={14} color={C.ts} strokeWidth={1.8} style={{ marginBottom:6 }}/>
              <div style={{ fontSize:12.5, fontWeight:700, color:C.tp }}>{val}</div>
              <div style={{ fontSize:9, color:C.tm, marginTop:2 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* hourly */}
        <div style={{ fontSize:10.5, fontWeight:700, color:C.ts, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:9 }}>Today</div>
        <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none", marginBottom:16 }}>
          {WEATHER.hourly.map((h,i)=>(
            <div key={i} style={{ flexShrink:0, width:54, background: i===0 ? "rgba(113,40,206,0.12)" : C.surf,
              border:`1px solid ${i===0 ? "rgba(113,40,206,0.3)" : C.b}`, borderRadius:14, padding:"10px 0",
              display:"flex", flexDirection:"column", alignItems:"center", gap:7 }}>
              <span style={{ fontSize:9.5, color: i===0 ? C.tp : C.ts, fontWeight: i===0 ? 700 : 500 }}>{h.t}</span>
              <WeatherIcon main={h.main} size={17}/>
              <span style={{ fontSize:11.5, fontWeight:700, color:C.tp }}>{h.temp}°</span>
            </div>
          ))}
        </div>

        {/* next days */}
        <div style={{ fontSize:10.5, fontWeight:700, color:C.ts, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:9 }}>Next 4 Days</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {WEATHER.days.map((d,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:C.surf,
              border:`1px solid ${C.b}`, borderRadius:14, padding:"11px 14px" }}>
              <span style={{ flex:1, fontSize:12.5, fontWeight:600, color:C.tp }}>{d.d}</span>
              <WeatherIcon main={d.main} size={16}/>
              <span style={{ fontSize:12, fontWeight:700, color:C.tp, width:30, textAlign:"right" }}>{d.hi}°</span>
              <span style={{ fontSize:12, color:C.tm, width:26, textAlign:"right" }}>{d.lo}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── QUOTE OF THE DAY ──────────────────────────────────────────── */
function QuoteOfTheDay() {
  const [i, setI] = useState(0);
  const q = QUOTES[i];
  return (
    <div style={{ padding:"0 18px", marginBottom:22 }}>
      <div onClick={()=>setI(n=>(n+1)%QUOTES.length)} style={{ background:"linear-gradient(148deg,rgba(196,141,56,0.13) 0%,rgba(10,2,24,1) 82%)",
        border:"1px solid rgba(196,141,56,0.22)", borderRadius:22, padding:"18px 18px", position:"relative", overflow:"hidden", cursor:"pointer" }}>
        <div style={{ position:"absolute", top:-18, right:-6, opacity:0.12 }}>
          <Quote size={88} color={C.gold} strokeWidth={1.5}/>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, position:"relative" }}>
          <Sparkles size={12} color={C.gold} strokeWidth={2}/>
          <span style={{ fontSize:9, fontWeight:700, color:C.gold, letterSpacing:"0.18em", textTransform:"uppercase" }}>Quote of the Day</span>
        </div>
        <div style={{ fontSize:15, color:C.tp, fontWeight:600, lineHeight:1.55, marginBottom:10, position:"relative" }}>
          "{q.text}"
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, position:"relative" }}>
          <div style={{ flex:1, fontSize:11.5, color:C.gold, fontWeight:600 }}>— {q.by}</div>
          <div style={{ display:"flex", gap:4 }}>
            {QUOTES.map((_,d)=>(
              <div key={d} style={{ width:4.5, height:4.5, borderRadius:"50%", background: d===i ? C.gold : C.tm }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── EVENTS PREVIEW ────────────────────────────────────────────── */
function EventDateBadge({ day, date, color }) {
  return (
    <div style={{ width:46, borderRadius:12, overflow:"hidden", border:`1px solid ${color}35`, flexShrink:0, textAlign:"center" }}>
      <div style={{ background:`${color}28`, fontSize:8.5, fontWeight:700, color:C.tp, letterSpacing:"0.1em", padding:"3px 0" }}>{day}</div>
      <div style={{ fontSize:17, fontWeight:800, color:C.tp, padding:"4px 0 5px" }}>{date}</div>
    </div>
  );
}

function EventsPreview({ onSeeAll }) {
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ padding:"0 18px", marginBottom:12 }}>
        <SectionHeader title="Upcoming Events" action="See all" onAction={onSeeAll}/>
      </div>
      <div style={{ display:"flex", gap:12, paddingLeft:18, paddingRight:18, overflowX:"auto", scrollbarWidth:"none" }}>
        {EVENTS.slice(0,4).map((e,i) => (
          <div key={i} onClick={onSeeAll} style={{ minWidth:208, flexShrink:0, background:C.surf,
            border:`1px solid ${C.b}`, borderRadius:18, padding:"13px 14px", cursor:"pointer",
            display:"flex", gap:12, alignItems:"center" }}>
            <EventDateBadge day={e.day} date={e.date} color={e.color}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                <span style={{ fontSize:8.5, fontWeight:700, color:e.color, background:`${e.color}1E`,
                  border:`1px solid ${e.color}30`, borderRadius:6, padding:"2px 6px", letterSpacing:"0.04em" }}>{e.tag}</span>
                {e.live && <PulsingDot size={5} color="#F06565" style={{ marginLeft:0 }}/>}
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:C.tp, marginBottom:4, lineHeight:1.25,
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.title}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <Clock size={9} color={C.gold} strokeWidth={2}/>
                <span style={{ fontSize:10, color:C.ts }}>{e.time} · {e.venue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FIND A CHURCH ─────────────────────────────────────────────── */
function FindAChurchSection({ onSeeAll }) {
  return (
    <div style={{ padding:"0 18px", marginBottom:22 }}>
      <SectionHeader title="Find a Church" action="See all" onAction={onSeeAll}/>
      <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:9 }}>
        {CHURCHES.slice(0,2).map((c,i) => (
          <div key={i} onClick={onSeeAll} style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:16,
            padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:`${c.color}18`, border:`1px solid ${c.color}28`,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Church size={17} color={c.color} strokeWidth={1.8}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.tp, marginBottom:2 }}>{c.name}</div>
              <div style={{ fontSize:10.5, color:C.ts }}>{c.service} · {c.addr}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
              <MapPinned size={9} color={C.gold} strokeWidth={2.5}/>
              <span style={{ fontSize:10, color:C.gold, fontWeight:600 }}>{c.dist}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PICTURE OF THE DAY ────────────────────────────────────────── */
function PictureOfTheDay({ onOpen }) {
  const pic = GALLERY[0];
  return (
    <div style={{ padding:"0 18px", marginBottom:22 }}>
      <SectionHeader title="Picture of the Day" action="View Gallery" onAction={onOpen}/>
      <div onClick={onOpen} style={{ marginTop:12, borderRadius:22, overflow:"hidden", cursor:"pointer",
        border:`1px solid ${C.b}`, position:"relative", height:188 }}>
        <div style={{ position:"absolute", inset:0, background:pic.g }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(8,1,26,0) 35%,rgba(8,1,26,0.85) 100%)" }}/>
        <div style={{ position:"absolute", top:12, right:12, opacity:0.55 }}>
          <Camera size={16} color="#fff" strokeWidth={1.8}/>
        </div>
        <div style={{ position:"absolute", left:14, bottom:13, right:14 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(8,1,26,0.55)",
            border:"1px solid rgba(255,255,255,0.14)", borderRadius:20, padding:"3px 9px", marginBottom:8 }}>
            <Sunrise size={10} color={C.gold} strokeWidth={2}/>
            <span style={{ fontSize:9.5, color:"#fff", fontWeight:600 }}>Prayer Mountain</span>
          </div>
          <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:2 }}>{pic.title}</div>
          <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.7)" }}>by {pic.by}</div>
        </div>
      </div>
    </div>
  );
}

/* ── OPEN HEAVEN DEVOTIONAL ────────────────────────────────────── */
function OpenHeavenDevotional() {
  return (
    <div style={{ padding:"0 18px", marginBottom:22 }}>
      <SectionHeader title="Open Heaven Devotional" action="Read Full" onAction={()=>{}}/>
      <div style={{ marginTop:12, background:C.surf, border:`1px solid ${C.b}`, borderRadius:22, overflow:"hidden" }}>
        <div style={{ padding:"15px 16px", borderBottom:`1px solid ${C.b}`, display:"flex", alignItems:"center", gap:11 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:"rgba(113,40,206,0.18)",
            border:"1px solid rgba(113,40,206,0.28)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <BookOpen size={17} color={C.purpleL} strokeWidth={1.8}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:8.5, fontWeight:700, color:C.gold, letterSpacing:"0.16em", textTransform:"uppercase" }}>{DEVOTIONAL.date}'s Devotional</div>
            <div style={{ fontSize:14.5, fontWeight:700, color:C.tp, marginTop:2 }}>{DEVOTIONAL.topic}</div>
          </div>
        </div>
        <div style={{ padding:"14px 16px" }}>
          <div style={{ background:"rgba(196,141,56,0.08)", border:"1px solid rgba(196,141,56,0.2)", borderRadius:13,
            padding:"11px 13px", marginBottom:12 }}>
            <div style={{ fontSize:12, color:C.tp, fontStyle:"italic", lineHeight:1.55, marginBottom:5 }}>"{DEVOTIONAL.verse}"</div>
            <div style={{ fontSize:10.5, color:C.gold, fontWeight:600 }}>{DEVOTIONAL.ref}</div>
          </div>
          <div style={{ fontSize:12, color:C.ts, lineHeight:1.65, marginBottom:13 }}>{DEVOTIONAL.text}</div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:6, background:C.surfHi,
              border:`1px solid ${C.b}`, borderRadius:11, padding:"9px 12px" }}>
              <BookOpen size={12} color={C.gold} strokeWidth={2}/>
              <span style={{ fontSize:11, color:C.tp, fontWeight:500 }}>Reading: {DEVOTIONAL.reading}</span>
            </div>
            <div style={{ width:38, height:38, borderRadius:11, background:C.surfHi, border:`1px solid ${C.b}`,
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <Heart size={15} color={C.ts} strokeWidth={1.8}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   NOTIFICATIONS SCREEN
════════════════════════════════════════════════════════════════ */
function NotificationsScreen({ onBack }) {
  const [read, setRead] = useState(false);
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="Notifications" sub={`${HOME_NOTIFS.filter(n=>n.unread).length} unread`}
        right={<div onClick={()=>setRead(true)} style={{ fontSize:11, color:C.gold, fontWeight:600, cursor:"pointer" }}>Mark all read</div>}/>
      <div style={{ padding:"4px 18px 20px", display:"flex", flexDirection:"column", gap:10 }}>
        {HOME_NOTIFS.map((n,i) => {
          const unread = n.unread && !read;
          return (
            <div key={i} style={{ background: unread ? "rgba(113,40,206,0.08)" : C.surf,
              border:`1px solid ${unread ? "rgba(113,40,206,0.25)" : C.b}`, borderRadius:18, padding:"14px 15px",
              display:"flex", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:11, flexShrink:0, background:`${n.color}18`,
                border:`1px solid ${n.color}28`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <n.Icon size={16} color={n.color} strokeWidth={2}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.tp, lineHeight:1.3 }}>{n.title}</span>
                  <span style={{ fontSize:10, color:C.tm, flexShrink:0 }}>{n.time}</span>
                </div>
                <p style={{ fontSize:11.5, color:C.ts, lineHeight:1.55, margin:0 }}>{n.body}</p>
              </div>
              {unread && <div style={{ width:7, height:7, borderRadius:"50%", background:C.gold, flexShrink:0, marginTop:4 }}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   EVENTS SCREEN
════════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   EVENT DETAIL
══════════════════════════════════════════════════════════════ */
function EventDetail({ e, onBack }) {
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="Event Details"/>
      <div style={{ padding:"4px 18px 20px" }}>
        <div style={{ background:`linear-gradient(148deg,${e.color}22 0%,rgba(10,2,24,1) 75%)`,
          border:`1px solid ${e.color}38`, borderRadius:24, padding:"20px 18px", marginBottom:13, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-30, width:150, height:150,
            background:`${e.color}14`, borderRadius:"50%", filter:"blur(45px)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:13, position:"relative" }}>
            <span style={{ fontSize:9, fontWeight:700, color:e.color, background:`${e.color}1E`,
              border:`1px solid ${e.color}35`, borderRadius:7, padding:"3px 9px", letterSpacing:"0.05em" }}>{e.tag}</span>
            {e.live && (
              <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(215,55,55,0.18)",
                border:"1px solid rgba(225,75,75,0.3)", borderRadius:20, padding:"3px 9px" }}>
                <PulsingDot size={5} color="#F06565"/>
                <span style={{ fontSize:8.5, fontWeight:800, color:"#F06565", letterSpacing:"0.12em" }}>LIVE NOW</span>
              </span>
            )}
          </div>
          <div style={{ fontSize:20, fontWeight:700, color:C.tp, lineHeight:1.3, marginBottom:13, position:"relative" }}>{e.title}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:7, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <CalendarDays size={12} color={C.gold} strokeWidth={1.8}/>
              <span style={{ fontSize:12, color:C.ts }}>{e.day === "SUN" ? "Sunday" : e.day === "FRI" ? "Friday" : e.day === "SAT" ? "Saturday" : e.day === "WED" ? "Wednesday" : "Monday"} {e.date} · This month</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <Clock size={12} color={C.gold} strokeWidth={1.8}/>
              <span style={{ fontSize:12, color:C.ts }}>{e.time}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <Building2 size={12} color={C.gold} strokeWidth={1.8}/>
              <span style={{ fontSize:12, color:C.ts }}>{e.venue} · Redemption City</span>
            </div>
          </div>
        </div>

        <div style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18, padding:"15px 16px", marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.tm, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>About this event</div>
          <div style={{ fontSize:12.5, color:C.ts, lineHeight:1.7 }}>{e.desc}</div>
        </div>

        {e.live ? (
          <button onClick={()=>{ try { window.open(e.yt, "_blank"); } catch(err) {} }} style={{ width:"100%", padding:"14px 0",
            borderRadius:15, border:"none", cursor:"pointer", fontFamily:FONT, fontSize:13.5, fontWeight:700, color:"#fff",
            background:"linear-gradient(135deg,#E62117,#B31217)", display:"flex", alignItems:"center", justifyContent:"center",
            gap:9, boxShadow:"0 8px 26px rgba(230,33,23,0.35)" }}>
            <svg width="17" height="12" viewBox="0 0 24 17" aria-hidden="true">
              <rect x="0" y="0" width="24" height="17" rx="4" fill="#fff"/>
              <path d="M10 4.5 L16.5 8.5 L10 12.5 Z" fill="#B31217"/>
            </svg>
            Watch live on YouTube
          </button>
        ) : (
          <button style={{ width:"100%", padding:"13px 0", borderRadius:15, cursor:"pointer", fontFamily:FONT,
            fontSize:13, fontWeight:600, color:C.tp, background:C.surf, border:`1px solid ${C.bHi}`,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <Bell size={14} color={C.gold} strokeWidth={2}/> Set a reminder
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EVENTS SCREEN
══════════════════════════════════════════════════════════════ */
function EventsScreen({ onBack }) {
  const [filter, setFilter] = useState("All");
  const [sel, setSel] = useState(null);
  if (sel) return <EventDetail e={sel} onBack={()=>setSel(null)}/>;
  const tags = ["All", ...Array.from(new Set(EVENTS.map(e=>e.tag)))];
  const list = filter==="All" ? EVENTS : EVENTS.filter(e=>e.tag===filter);
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="Events" sub="What's on across the city"/>
      <div style={{ display:"flex", gap:8, padding:"2px 18px 14px", overflowX:"auto", scrollbarWidth:"none" }}>
        {tags.map(t => (
          <div key={t} onClick={()=>setFilter(t)} style={{ flexShrink:0, padding:"7px 14px", borderRadius:20,
            fontSize:11.5, fontWeight:600, cursor:"pointer",
            background: filter===t ? C.gold : C.surf, color: filter===t ? "#08011A" : C.ts,
            border:`1px solid ${filter===t ? C.gold : C.b}` }}>{t}</div>
        ))}
      </div>
      <div style={{ padding:"0 18px 20px", display:"flex", flexDirection:"column", gap:11 }}>
        {list.map((e,i) => (
          <div key={i} onClick={()=>setSel(e)} style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18, padding:"14px 15px",
            display:"flex", gap:13, alignItems:"center", cursor:"pointer" }}>
            <EventDateBadge day={e.day} date={e.date} color={e.color}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                <span style={{ fontSize:8.5, fontWeight:700, color:e.color, background:`${e.color}1E`,
                  border:`1px solid ${e.color}30`, borderRadius:6, padding:"2px 7px" }}>{e.tag}</span>
                {e.live && <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
                  <PulsingDot size={5} color="#F06565"/><span style={{ fontSize:8.5, fontWeight:700, color:"#F06565", letterSpacing:"0.1em" }}>LIVE</span></span>}
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:C.tp, marginBottom:5 }}>{e.title}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 12px" }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                  <Building2 size={10} color={C.ts} strokeWidth={2}/><span style={{ fontSize:10.5, color:C.ts }}>{e.venue}</span></span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                  <Clock size={10} color={C.gold} strokeWidth={2}/><span style={{ fontSize:10.5, color:C.gold, fontWeight:500 }}>{e.time}</span></span>
              </div>
            </div>
            <ChevronRight size={15} color={C.tm} strokeWidth={2} style={{ flexShrink:0 }}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PICTURE GALLERY SCREEN
════════════════════════════════════════════════════════════════ */
function PictureGalleryScreen({ onBack }) {
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="Picture Gallery" sub="Moments from Redemption City"/>
      <div style={{ padding:"4px 18px 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {GALLERY.map((p,i) => (
          <div key={i} style={{ borderRadius:16, overflow:"hidden", border:`1px solid ${C.b}`, position:"relative",
            height:148, cursor:"pointer" }}>
            <div style={{ position:"absolute", inset:0, background:p.g }}/>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(8,1,26,0) 40%,rgba(8,1,26,0.82) 100%)" }}/>
            <div style={{ position:"absolute", left:10, right:10, bottom:10 }}>
              <div style={{ fontSize:11.5, fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:2 }}>{p.title}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.7)" }}>{p.by}</div>
            </div>
            <div style={{ position:"absolute", top:9, right:9, display:"flex", alignItems:"center", gap:3,
              background:"rgba(8,1,26,0.4)", borderRadius:20, padding:"3px 7px" }}>
              <Heart size={9} color="#fff" strokeWidth={2}/>
              <span style={{ fontSize:9, color:"#fff", fontWeight:600 }}>{12 + i*7}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CHURCH FINDER SCREEN
════════════════════════════════════════════════════════════════ */
function ChurchFinderScreen({ onBack }) {
  const [q, setQ] = useState("");
  const list = CHURCHES.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="Find a Church" sub={`${CHURCHES.length} parishes nearby`}/>
      <div style={{ padding:"2px 18px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, background:C.surf, border:`1px solid ${C.b}`,
          borderRadius:14, padding:"11px 13px" }}>
          <Search size={15} color={C.ts} strokeWidth={2}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search parishes…"
            style={{ flex:1, background:"none", border:"none", outline:"none", color:C.tp, fontSize:13, fontFamily:FONT }}/>
        </div>
      </div>
      <div style={{ padding:"0 18px 20px", display:"flex", flexDirection:"column", gap:11 }}>
        {list.map((c,i) => (
          <div key={i} style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18, padding:"15px 15px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:42, height:42, borderRadius:13, background:`${c.color}18`, border:`1px solid ${c.color}28`,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Church size={19} color={c.color} strokeWidth={1.8}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.tp, marginBottom:3 }}>{c.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <MapPin size={10} color={C.ts} strokeWidth={2}/>
                  <span style={{ fontSize:10.5, color:C.ts }}>{c.addr}</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, background:C.surfHi, border:`1px solid ${C.b}`,
                borderRadius:9, padding:"6px 10px" }}>
                <Clock size={10} color={C.gold} strokeWidth={2}/>
                <span style={{ fontSize:10.5, color:C.tp, fontWeight:500 }}>{c.service}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5, background:C.surfHi, border:`1px solid ${C.b}`,
                borderRadius:9, padding:"6px 10px" }}>
                <MapPinned size={10} color={C.gold} strokeWidth={2}/>
                <span style={{ fontSize:10.5, color:C.tp, fontWeight:500 }}>{c.dist}</span>
              </div>
              <button style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5, padding:"8px 13px",
                borderRadius:11, border:"none", cursor:"pointer", fontFamily:FONT,
                background:`linear-gradient(135deg,${C.purple},#5A18A8)`, color:"#fff", fontSize:11, fontWeight:600 }}>
                <Navigation size={11} strokeWidth={2.5}/> Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   HOME SCREEN  (upgraded)
════════════════════════════════════════════════════════════════ */
/* ──────────────────────────────────────────────────────────────
   LIVE MAP — Redemption City (Leaflet + dark tiles)
────────────────────────────────────────────────────────────── */
const MAP_CENTER = [6.8068, 3.4376];
const USER_POS   = [6.8000, 3.4350];
const MAP_PLACES = [
  { name:"Main Auditorium",     cat:"Worship",   pos:[6.8095,3.4360], color:"#8B5CF6", Icon:Building2 },
  { name:"Prayer Mountain",     cat:"Spiritual", pos:[6.8160,3.4420], color:"#4A8A5A", Icon:Leaf },
  { name:"Prayer Garden",       cat:"Spiritual", pos:[6.8120,3.4320], color:"#4A8A5A", Icon:Leaf },
  { name:"Guest House A",       cat:"Stay",      pos:[6.8055,3.4305], color:"#2A7FAB", Icon:Home },
  { name:"Guest House B",       cat:"Stay",      pos:[6.8030,3.4410], color:"#2A7FAB", Icon:Home },
  { name:"Camp Restaurant",     cat:"Dining",    pos:[6.8042,3.4368], color:"#C48D38", Icon:Coffee },
  { name:"Bread of Life Café",  cat:"Dining",    pos:[6.8078,3.4422], color:"#C48D38", Icon:Coffee },
  { name:"Camp Bookshop",       cat:"Retail",    pos:[6.8068,3.4310], color:"#9B5E3A", Icon:BookOpen },
  { name:"Children's Pavilion", cat:"Worship",   pos:[6.8115,3.4395], color:"#8B5CF6", Icon:Building2 },
  { name:"Main Car Park",       cat:"Transport", pos:[6.8012,3.4362], color:"#6A6880", Icon:Car },
];
function distKm(a,b){
  const R=6371, dLat=(b[0]-a[0])*Math.PI/180, dLon=(b[1]-a[1])*Math.PI/180;
  const s=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return 2*R*Math.asin(Math.sqrt(s));
}

/* ── NEWS TICKER ─────────────────────────────────────────── */
const TICKER_ITEMS = [
  "Sunday Victory Service — live now at the Main Auditorium",
  "Main Camp Road closed 10AM–2PM — use Alternative Route 2",
  "Monthly Thanksgiving Service — Saturday, 6:00 PM",
  "Holy Ghost Service — Friday, 6:00 PM",
  "Lost & Found: black wallet recovered at Gate B — contact security",
];
function NewsTicker({ onTap }) {
  return (
    <div onClick={onTap} style={{ display:"flex", alignItems:"stretch", margin:"10px 18px 2px", borderRadius:12,
      background:C.surf, border:`1px solid ${C.b}`, overflow:"hidden", cursor:"pointer" }}>
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:5, padding:"8px 10px",
        background:"rgba(196,141,56,0.13)", borderRight:`1px solid ${C.b}` }}>
        <PulsingDot size={5} color={C.gold}/>
        <span style={{ fontSize:8.5, fontWeight:800, color:C.gold, letterSpacing:"0.12em" }}>NEWS</span>
      </div>
      <div style={{ flex:1, overflow:"hidden", display:"flex", alignItems:"center" }}>
        <div style={{ display:"flex", whiteSpace:"nowrap", width:"max-content", animation:"tickerScroll 36s linear infinite" }}>
          {[0,1].map(rep => (
            <div key={rep} style={{ display:"flex", alignItems:"center" }}>
              {TICKER_ITEMS.map((t,i)=>(
                <span key={i} style={{ display:"inline-flex", alignItems:"center" }}>
                  <span style={{ fontSize:10.5, color:C.ts, padding:"0 13px" }}>{t}</span>
                  <span style={{ width:3.5, height:3.5, borderRadius:"50%", background:C.gold, flexShrink:0, opacity:0.7 }}/>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Crosshair = __mkIcon('Crosshair');

function MapScreen({ onBack, initialDest }) {
  const mapEl = useRef(null);
  const S = useRef({});
  const [ready, setReady]   = useState(false);
  const [dest, setDest]     = useState(null);
  const [info, setInfo]     = useState(null);
  const [navOn, setNavOn]   = useState(false);
  const [navPct, setNavPct] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState(() => { try { return JSON.parse(localStorage.getItem('cf_favs')||'[]'); } catch(e){ return []; } });
  const [recents, setRecents] = useState(() => { try { return JSON.parse(localStorage.getItem('cf_recents')||'[]'); } catch(e){ return []; } });
  function toggleFav(name){ setFavs(f => { const n = f.includes(name) ? f.filter(x=>x!==name) : [name, ...f]; try{ localStorage.setItem('cf_favs', JSON.stringify(n)); }catch(e){} return n; }); }
  function pushRecent(name){ setRecents(r => { const n = [name, ...r.filter(x=>x!==name)].slice(0,5); try{ localStorage.setItem('cf_recents', JSON.stringify(n)); }catch(e){} return n; }); }

  async function selectDest(p) {
    const st = S.current; const L = st.L, map = st.map; if (!map) return;
    setSearchOpen(false); setNavOn(false); setNavPct(0); clearInterval(st.timer);
    if (st.line)       { map.removeLayer(st.line); st.line = null; }
    if (st.destMarker) { map.removeLayer(st.destMarker); st.destMarker = null; }
    if (st.navMarker)  { map.removeLayer(st.navMarker); st.navMarker = null; }
    setDest(p); setInfo(null);
    pushRecent(p.name);
    const pin = L.divIcon({ className:'', iconSize:[30,38], iconAnchor:[15,32],
      html:`<div style="width:30px;height:30px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:${p.color};border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.6)"></div>` });
    st.destMarker = L.marker(p.pos, { icon:pin }).addTo(map);

    let coords = null;
    try {
      const r = await fetch(`https://router.project-osrm.org/route/v1/foot/${USER_POS[1]},${USER_POS[0]};${p.pos[1]},${p.pos[0]}?overview=full&geometries=geojson`);
      const j = await r.json();
      if (j.routes && j.routes[0]) coords = j.routes[0].geometry.coordinates.map(c=>[c[1],c[0]]);
    } catch(e) {}
    if (!coords || coords.length < 2) {
      coords = []; const n=24, a=USER_POS, b=p.pos;
      const mx=(a[0]+b[0])/2+(b[1]-a[1])*0.18, my=(a[1]+b[1])/2-(b[0]-a[0])*0.18;
      for (let i=0;i<=n;i++){ const t=i/n;
        coords.push([(1-t)*(1-t)*a[0]+2*(1-t)*t*mx+t*t*b[0], (1-t)*(1-t)*a[1]+2*(1-t)*t*my+t*t*b[1]]);
      }
    }
    st.coords = coords;
    st.line = L.polyline(coords, { color:"#9458E0", weight:5, opacity:0.92, lineCap:"round", lineJoin:"round" }).addTo(map);
    map.fitBounds(st.line.getBounds(), { padding:[60,60] });
    let km=0; for (let i=1;i<coords.length;i++) km += distKm(coords[i-1],coords[i]);
    setInfo({ km:km.toFixed(1), walkMin:Math.max(1,Math.round(km*13)), rideMin:Math.max(1,Math.round(km*3)) });
  }

  function startNav() {
    const st = S.current; const L = st.L, map = st.map, coords = st.coords; if (!coords) return;
    setNavOn(true); setNavPct(0);
    const navIcon = L.divIcon({ className:'', iconSize:[22,22], iconAnchor:[11,11],
      html:'<div style="width:22px;height:22px;border-radius:50%;background:#4285F4;border:3px solid #fff;box-shadow:0 0 0 6px rgba(66,133,244,0.25),0 2px 8px rgba(0,0,0,0.5)"></div>' });
    if (st.navMarker) map.removeLayer(st.navMarker);
    const m = L.marker(coords[0], { icon:navIcon }).addTo(map);
    st.navMarker = m;
    map.setView(coords[0], 16);
    let i = 0; const total = coords.length - 1;
    clearInterval(st.timer);
    st.timer = setInterval(() => {
      i++;
      if (i > total) { clearInterval(st.timer); setNavPct(100); return; }
      m.setLatLng(coords[i]); map.panTo(coords[i], { animate:true });
      setNavPct(Math.round(i/total*100));
    }, 320);
  }
  function endNav() {
    const st = S.current; clearInterval(st.timer); setNavOn(false); setNavPct(0);
    if (st.navMarker) { st.map.removeLayer(st.navMarker); st.navMarker = null; }
    if (st.line) st.map.fitBounds(st.line.getBounds(), { padding:[60,60] });
  }
  function clearDest() {
    const st = S.current; clearInterval(st.timer); setNavOn(false); setNavPct(0);
    if (st.navMarker)  { st.map.removeLayer(st.navMarker); st.navMarker = null; }
    if (st.line)       { st.map.removeLayer(st.line); st.line = null; }
    if (st.destMarker) { st.map.removeLayer(st.destMarker); st.destMarker = null; }
    setDest(null); setInfo(null); st.map.setView(MAP_CENTER, 15);
  }

  useEffect(() => {
    let dead = false;
    function init(){
      if (dead) return;
      if (!window.L || !mapEl.current) { setTimeout(init, 120); return; }
      const L = window.L;
      const map = L.map(mapEl.current, { zoomControl:false, attributionControl:false }).setView(MAP_CENTER, 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', { subdomains:'abcd', maxZoom:19 }).addTo(map);
      const userIcon = L.divIcon({ className:'', iconSize:[18,18], iconAnchor:[9,9],
        html:'<div style="position:relative;width:18px;height:18px"><div class="live" style="position:absolute;inset:-7px;border-radius:50%;background:rgba(66,133,244,0.3)"></div><div style="position:absolute;inset:0;border-radius:50%;background:#4285F4;border:2.5px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,0.5)"></div></div>' });
      L.marker(USER_POS, { icon:userIcon }).addTo(map);
      MAP_PLACES.forEach(p => {
        const ic = L.divIcon({ className:'', iconSize:[10,10], iconAnchor:[5,5],
          html:`<div style="width:10px;height:10px;border-radius:50%;background:${p.color};border:1.5px solid rgba(255,255,255,0.75);box-shadow:0 1px 4px rgba(0,0,0,0.6)"></div>` });
        L.marker(p.pos, { icon:ic }).addTo(map).on('click', () => selectDest(p));
      });
      S.current.map = map; S.current.L = L;
      setTimeout(()=>map.invalidateSize(), 150);
      setReady(true);
      if (initialDest) { const p = MAP_PLACES.find(x=>x.name===initialDest); if (p) selectDest(p); }
    }
    init();
    return () => { dead = true; clearInterval(S.current.timer); if (S.current.map) { S.current.map.remove(); S.current.map = null; } };
  }, []);

  const list = MAP_PLACES.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  const secHdr = { fontSize:10, fontWeight:700, color:C.tm, letterSpacing:"0.1em", textTransform:"uppercase", margin:"10px 2px 10px" };
  const col = { display:"flex", flexDirection:"column", gap:8 };
  function PlaceRow({ p, sub }) {
    const saved = favs.includes(p.name);
    return (
      <div onClick={()=>selectDest(p)} style={{ display:"flex", alignItems:"center", gap:11, padding:"12px 13px",
        background:C.surf, border:`1px solid ${C.b}`, borderRadius:14, cursor:"pointer" }}>
        <div style={{ width:36, height:36, borderRadius:11, background:`${p.color}1E`, border:`1px solid ${p.color}30`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <p.Icon size={16} color={p.color} strokeWidth={1.8}/>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.tp }}>{p.name}</div>
          <div style={{ fontSize:10.5, color:C.ts, marginTop:1 }}>{sub || p.cat}</div>
        </div>
        <span style={{ fontSize:10, color:C.gold, fontWeight:600, flexShrink:0 }}>{distKm(USER_POS,p.pos).toFixed(1)}km</span>
        <div onClick={(e)=>{ e.stopPropagation(); toggleFav(p.name); }} style={{ display:"flex", cursor:"pointer", flexShrink:0, padding:4 }}>
          <Star size={15} color={C.gold} fill={saved ? C.gold : "none"} strokeWidth={1.8}/>
        </div>
      </div>
    );
  }
  return (
    <div style={{ position:"relative", height:"100%", overflow:"hidden", background:"#0A0512" }}>
      <div ref={mapEl} style={{ position:"absolute", inset:0 }}/>
      {!ready && (
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", gap:10, alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:22, height:22, borderRadius:"50%", border:"2.5px solid rgba(148,88,224,0.25)", borderTopColor:"#9458E0", animation:"spin 0.8s linear infinite" }}/>
          <span style={{ fontSize:11.5, color:C.ts }}>Loading live map…</span>
        </div>
      )}

      {/* top bar */}
      <div style={{ position:"absolute", top:10, left:12, right:12, zIndex:1100, display:"flex", gap:8 }}>
        <div onClick={onBack} style={{ width:40, height:40, borderRadius:13, background:"rgba(10,4,24,0.94)", border:`1px solid ${C.bHi}`,
          display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
          <ChevronLeft size={17} color={C.tp} strokeWidth={2}/>
        </div>
        <div onClick={()=>setSearchOpen(true)} style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:"rgba(10,4,24,0.94)",
          border:`1px solid ${C.bHi}`, borderRadius:13, padding:"0 13px", cursor:"pointer", minWidth:0 }}>
          <Search size={14} color={C.ts} strokeWidth={2}/>
          <span style={{ flex:1, fontSize:12.5, color: dest ? C.tp : C.tm, fontWeight: dest ? 600 : 400,
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{dest ? dest.name : "Where to?"}</span>
          {dest && (
            <div onClick={(e)=>{ e.stopPropagation(); clearDest(); }} style={{ display:"flex", flexShrink:0, cursor:"pointer" }}>
              <X size={14} color={C.ts} strokeWidth={2}/>
            </div>
          )}
        </div>
      </div>

      {/* locate me + current location pill */}
      <div onClick={()=>{ const st=S.current; if (st.map) st.map.setView(USER_POS, 16); }}
        style={{ position:"absolute", right:12, bottom: navOn ? 110 : (dest && info ? 200 : 64), zIndex:1100,
        width:42, height:42, borderRadius:14, background:"rgba(10,4,24,0.94)", border:`1px solid ${C.bHi}`,
        display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"bottom 0.2s" }}>
        <Crosshair size={17} color={C.tp} strokeWidth={1.8}/>
      </div>
      {!dest && !navOn && (
        <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", bottom:16, zIndex:1100,
          display:"flex", alignItems:"center", gap:7, background:"rgba(10,4,24,0.94)", border:`1px solid ${C.bHi}`,
          borderRadius:20, padding:"8px 14px", whiteSpace:"nowrap" }}>
          <div style={{ width:9, height:9, borderRadius:"50%", background:"#4285F4", border:"2px solid rgba(255,255,255,0.85)", flexShrink:0 }}/>
          <span style={{ fontSize:11, color:C.tp, fontWeight:600 }}>Current location</span>
          <span style={{ fontSize:11, color:C.ts }}>· Main Gate Area</span>
        </div>
      )}

      {/* nav banner */}
      {navOn && (
        <div style={{ position:"absolute", top:60, left:12, right:12, zIndex:1100, background:"rgba(22,84,48,0.96)",
          border:"1px solid rgba(61,170,106,0.5)", borderRadius:16, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
          <Navigation size={20} color="#fff" strokeWidth={2}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13.5, fontWeight:700, color:"#fff" }}>{navPct>=100 ? "You have arrived" : `Head towards ${dest ? dest.name : ""}`}</div>
            <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.78)", marginTop:2 }}>
              {navPct>=100 ? (dest ? dest.name : "") : `${info ? (info.km*(100-navPct)/100).toFixed(1) : "–"} km remaining · via Camp Road`}
            </div>
          </div>
          <div style={{ fontSize:13, fontWeight:800, color:"#fff", flexShrink:0 }}>{navPct}%</div>
        </div>
      )}

      {/* bottom: route card */}
      {dest && info && !navOn && (
        <div className="si" style={{ position:"absolute", left:12, right:12, bottom:12, zIndex:1100,
          background:"rgba(12,5,28,0.97)", border:`1px solid ${C.bHi}`, borderRadius:20, padding:"15px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:13 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:`${dest.color}1E`, border:`1px solid ${dest.color}38`,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <dest.Icon size={18} color={dest.color} strokeWidth={1.8}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14.5, fontWeight:700, color:C.tp }}>{dest.name}</div>
              <div style={{ fontSize:10.5, color:C.ts, marginTop:1 }}>{dest.cat} · Redemption City</div>
            </div>
            <div onClick={()=>toggleFav(dest.name)} style={{ width:38, height:38, borderRadius:12, background:C.surfHi,
              border:`1px solid ${favs.includes(dest.name) ? "rgba(196,141,56,0.45)" : C.b}`, display:"flex", alignItems:"center",
              justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
              <Star size={16} color={C.gold} fill={favs.includes(dest.name) ? C.gold : "none"} strokeWidth={1.8}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:13 }}>
            {[[MapPinned, `${info.km} km`],[User, `${info.walkMin} min walk`],[Car, `${info.rideMin} min ride`]].map(([Ic,lbl],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:5, background:C.surfHi, border:`1px solid ${C.b}`,
                borderRadius:10, padding:"7px 10px" }}>
                <Ic size={11} color={C.gold} strokeWidth={2}/>
                <span style={{ fontSize:10.5, color:C.tp, fontWeight:600 }}>{lbl}</span>
              </div>
            ))}
          </div>
          <button onClick={startNav} style={{ width:"100%", padding:"13px 0", borderRadius:14, border:"none", cursor:"pointer",
            background:`linear-gradient(135deg,${C.purple},#5A18A8)`, color:"#fff", fontSize:13.5, fontWeight:700, fontFamily:FONT,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 8px 24px rgba(100,30,190,0.4)" }}>
            <Navigation size={14} strokeWidth={2.5}/> Start Navigation
          </button>
        </div>
      )}

      {/* bottom: active navigation bar */}
      {navOn && (
        <div style={{ position:"absolute", left:12, right:12, bottom:12, zIndex:1100, background:"rgba(12,5,28,0.97)",
          border:`1px solid ${C.bHi}`, borderRadius:18, padding:"13px 15px" }}>
          <div style={{ height:5, background:C.surf, borderRadius:5, overflow:"hidden", marginBottom:11 }}>
            <div style={{ height:"100%", width:`${navPct}%`, borderRadius:5, background:"linear-gradient(90deg,#3DAA6A,#9458E0)", transition:"width 0.3s" }}/>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.tp }}>{navPct>=100 ? "Arrived" : `${info ? Math.max(1, Math.round(info.walkMin*(100-navPct)/100)) : "–"} min left`}</div>
              <div style={{ fontSize:10, color:C.ts, marginTop:1 }}>{navPct>=100 ? "Enjoy your visit" : `${info ? (info.km*(100-navPct)/100).toFixed(1) : "–"} km · on foot`}</div>
            </div>
            <button onClick={endNav} style={{ padding:"10px 18px", borderRadius:12, border:"1px solid rgba(212,79,79,0.4)",
              background:"rgba(212,79,79,0.15)", color:"#F06565", fontSize:12, fontWeight:700, fontFamily:FONT, cursor:"pointer" }}>
              {navPct>=100 ? "Done" : "End"}
            </button>
          </div>
        </div>
      )}

      {/* destination search sheet */}
      {searchOpen && (
        <div style={{ position:"absolute", inset:0, zIndex:1200, background:"rgba(8,1,20,0.98)", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"12px 14px", display:"flex", gap:8, alignItems:"center" }}>
            <div onClick={()=>setSearchOpen(false)} style={{ width:38, height:38, borderRadius:12, background:C.surf,
              border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
              <ChevronLeft size={16} color={C.tp} strokeWidth={2}/>
            </div>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, background:C.surf, border:`1px solid ${C.bHi}`,
              borderRadius:12, padding:"10px 13px" }}>
              <Search size={14} color={C.ts} strokeWidth={2}/>
              <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search destinations…"
                style={{ flex:1, background:"none", border:"none", outline:"none", color:C.tp, fontSize:13, fontFamily:FONT }}/>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"4px 14px 16px" }}>
            {!q && favs.length > 0 && (
              <>
                <div style={secHdr}>★ Saved</div>
                <div style={col}>
                  {favs.map(n => { const p = MAP_PLACES.find(x=>x.name===n); return p ? <PlaceRow key={'f'+n} p={p}/> : null; })}
                </div>
              </>
            )}
            {!q && recents.length > 0 && (
              <>
                <div style={secHdr}>Recents</div>
                <div style={col}>
                  {recents.map(n => { const p = MAP_PLACES.find(x=>x.name===n); return p ? <PlaceRow key={'r'+n} p={p} sub="Recently visited"/> : null; })}
                </div>
              </>
            )}
            <div style={secHdr}>{q ? `Results (${list.length})` : "All destinations"}</div>
            <div style={col}>
              {list.map((p,i)=><PlaceRow key={i} p={p}/>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HomeScreen({ onTabChange }) {
  const [homeSub, setHomeSub] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  const [mapDest, setMapDest] = useState(null);

  if (homeSub === "map")           return <MapScreen onBack={()=>{ setHomeSub(null); setMapDest(null); }} initialDest={mapDest}/>;

  if (homeSub === "emergency")     return <EmergencyScreen         onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "ai")            return <AIAssistantScreen       onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "business")      return <BusinessDirectoryScreen onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "facts")         return <FunFactsScreen          onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "contacts")      return <ContactsScreen          onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "quiz")          return <QuizScreen              onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "tour")          return <CityTourScreen          onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "notifications") return <NotificationsScreen     onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "events")        return <EventsScreen            onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "gallery")       return <PictureGalleryScreen    onBack={()=>setHomeSub(null)}/>;
  if (homeSub === "church")        return <ChurchFinderScreen      onBack={()=>setHomeSub(null)}/>;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const ACTIONS = [
    { Icon:Navigation,   label:"Navigate",  sub:"Live city map",   color:"#7128CE", onClick:()=>setHomeSub("map") },
    { Icon:Car,          label:"CityRide",  sub:"Book a ride",     color:"#C48D38", onClick:()=>onTabChange("cityride") },
    { Icon:Building2,    label:"Stay",      sub:"Guest houses",    color:"#2A7FAB", onClick:()=>onTabChange("explore") },
    { Icon:CalendarDays, label:"Events",    sub:"What's on today", color:"#4A8A5A", onClick:()=>setHomeSub("events") },
  ];

  return (
    <>
      {/* App Header */}
      <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontFamily:CINZEL, fontSize:21, fontWeight:600, color:C.tp, letterSpacing:"0.06em" }}>CityFlow</div>
          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
            <MapPin size={10} color={C.gold} strokeWidth={2.5}/>
            <span style={{ fontSize:10, color:C.ts }}>Redemption City · 110115</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <div onClick={()=>onTabChange("explore")} style={{ width:38, height:38, borderRadius:13, background:C.surf,
            border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <Search size={16} color={C.tp} strokeWidth={1.8}/>
          </div>
          <div onClick={()=>setHomeSub("notifications")} style={{ width:38, height:38, borderRadius:13, background:C.surf,
            border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}>
            <Bell size={16} color={C.tp} strokeWidth={1.8}/>
            <div style={{ position:"absolute", top:9, right:9, width:6, height:6, background:C.gold, borderRadius:"50%", border:`1.5px solid ${C.bg}` }}/>
          </div>
        </div>
      </div>
      <div style={{ height:1, margin:"0 18px 4px", background:"rgba(255,255,255,0.055)" }}/>

      {/* News ticker */}
      <NewsTicker onTap={()=>setHomeSub("notifications")}/>

      {/* Greeting + Weather */}
      <div className="fu0" style={{ padding:"16px 18px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:500, color:C.ts }}>{getGreeting()},</div>
          <div style={{ fontSize:24, fontWeight:800, color:C.tp, lineHeight:1.2 }}>Peter 👋</div>
          <div style={{ fontSize:11.5, color:C.tm, marginTop:4 }}>Welcome to Redemption City of God</div>
        </div>
        <WeatherWidget onOpen={()=>setShowWeather(true)}/>
      </div>

      {/* Quote of the Day */}
      <div className="fu0"><QuoteOfTheDay/></div>

      {/* Hero Card */}
      <div className="fu1" style={{ padding:"0 18px", marginBottom:22 }}>
        <div style={{ background:"linear-gradient(148deg,rgba(90,18,165,0.94) 0%,rgba(38,8,75,0.97) 55%,rgba(10,2,24,1) 100%)",
          borderRadius:26, border:"1px solid rgba(110,50,190,0.3)", padding:20, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-50, right:-30, width:200, height:200,
            background:"rgba(105,35,200,0.14)", borderRadius:"50%", filter:"blur(55px)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(215,55,55,0.18)",
              border:"1px solid rgba(225,75,75,0.28)", borderRadius:20, padding:"3px 9px" }}>
              <PulsingDot size={5} color="#F06565"/>
              <span style={{ fontSize:9, fontWeight:700, color:"#F06565", letterSpacing:"0.12em" }}>LIVE NOW</span>
            </div>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }}/>
            <span style={{ fontSize:10, color:C.ts }}>Today</span>
          </div>
          <div style={{ fontSize:19, fontWeight:700, color:C.tp, lineHeight:1.3, marginBottom:8, position:"relative" }}>Sunday Victory Service</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:18, position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Building2 size={11} color={C.gold} strokeWidth={1.8}/>
              <span style={{ fontSize:11.5, color:C.ts }}>Main Auditorium · Redemption City</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Clock size={11} color={C.gold} strokeWidth={1.8}/>
              <span style={{ fontSize:11.5, color:C.ts }}>8:00 AM – 11:30 AM</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, position:"relative" }}>
            <button onClick={()=>{ setMapDest("Main Auditorium"); setHomeSub("map"); }} style={{ flex:1, padding:"11px 0", borderRadius:13, background:C.purple, border:"none",
              cursor:"pointer", fontSize:12, fontWeight:600, color:"#fff", fontFamily:FONT,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <Navigation size={12} strokeWidth={2.5}/> Get Directions
            </button>
            <button onClick={()=>setHomeSub("events")} style={{ flex:1, padding:"11px 0", borderRadius:13, background:"rgba(255,255,255,0.07)",
              border:`1px solid ${C.b}`, cursor:"pointer", fontSize:12, fontWeight:600, color:C.tp, fontFamily:FONT }}>
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Emergency / SOS Banner */}
      <div className="fu1" style={{ padding:"0 18px", marginBottom:22 }}>
        <div onClick={()=>setHomeSub("emergency")} style={{ background:"rgba(212,79,79,0.1)", border:"1px solid rgba(212,79,79,0.32)",
          borderRadius:20, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:13, background:"rgba(212,79,79,0.18)",
            border:"1px solid rgba(212,79,79,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Siren size={20} color="#F06565" strokeWidth={1.8}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13.5, fontWeight:700, color:"#F06565", marginBottom:3 }}>Emergency / SOS</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[["199","Ambulance"],["112","Police"],["190","Fire"],["122","Road"]].map(([num,lbl])=>(
                <div key={num} style={{ fontSize:10, color:"rgba(240,101,101,0.75)", fontWeight:600 }}>
                  {num} <span style={{ color:C.tm, fontWeight:400 }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <PulsingDot size={8} color="#F06565"/>
            <ChevronRight size={14} color="#F06565" strokeWidth={2}/>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fu2" style={{ padding:"0 18px", marginBottom:22 }}>
        <SectionHeader title="Quick Actions" action={null}/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:14 }}>
          {ACTIONS.map(({ Icon, label, sub, color, onClick },i) => (
            <div key={i} onClick={onClick} style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:20,
              padding:"16px 14px", cursor:"pointer" }}>
              <div style={{ width:38, height:38, borderRadius:12, marginBottom:12,
                background:`${color}1A`, border:`1px solid ${color}28`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={18} color={color} strokeWidth={1.8}/>
              </div>
              <div style={{ fontSize:14, fontWeight:600, color:C.tp, marginBottom:2 }}>{label}</div>
              <div style={{ fontSize:11, color:C.ts }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="fu2"><EventsPreview onSeeAll={()=>setHomeSub("events")}/></div>

      {/* Updates */}
      <div className="fu2" style={{ padding:"0 18px", marginBottom:22 }}>
        <SectionHeader title="News &amp; Announcements" action={null}/>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:14 }}>
          {[
            { Icon:Radio,       color:"#7128CE", title:"Monthly Thanksgiving Service", body:"Join us Saturday at 6PM for a special celebration of praise and worship.", time:"2h ago" },
            { Icon:AlertCircle, color:"#D44F4F", title:"Lost: Black Wallet — Gate B",  body:"A black leather wallet was found at Gate B. Contact security desk to claim.", time:"4h ago", onClick:()=>onTabChange("lostandfound") },
            { Icon:Navigation,  color:"#C48D38", title:"Camp Road Closure",            body:"Main Camp Road closed 10AM–2PM for event. Please use Alternative Route 2.", time:"1h ago" },
          ].map(({ Icon,color,title,body,time,onClick },i) => (
            <div key={i} onClick={onClick} style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18,
              padding:"14px 15px", display:"flex", gap:12, cursor:onClick?"pointer":"default" }}>
              <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, background:`${color}18`,
                border:`1px solid ${color}28`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={15} color={color} strokeWidth={2}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.tp, flex:1, marginRight:8, lineHeight:1.3 }}>{title}</span>
                  <span style={{ fontSize:10, color:C.tm }}>{time}</span>
                </div>
                <p style={{ fontSize:11.5, color:C.ts, lineHeight:1.55, margin:0 }}>{body}</p>
                {onClick && <span style={{ fontSize:11, color:C.gold, fontWeight:500, marginTop:5, display:"block" }}>View in Lost &amp; Found →</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* City Tour */}
      <div className="fu3" style={{ padding:"0 18px", marginBottom:22 }}>
        <SectionHeader title="Redemption City Tour" action="Explore" onAction={()=>setHomeSub("tour")}/>
        <div onClick={()=>setHomeSub("tour")} style={{ marginTop:12, background:"linear-gradient(148deg,rgba(42,127,171,0.18) 0%,rgba(10,2,24,1) 80%)",
          border:"1px solid rgba(42,127,171,0.3)", borderRadius:22, padding:"18px 16px", cursor:"pointer", position:"relative", overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:"rgba(42,127,171,0.18)",
              border:"1px solid rgba(42,127,171,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Navigation size={17} color="#2A7FAB" strokeWidth={1.8}/>
            </div>
            <div>
              <div style={{ fontSize:13.5, fontWeight:700, color:C.tp }}>Guided City Tour</div>
              <div style={{ fontSize:10.5, color:C.ts }}>8 stops · ~2 hours · Self-paced</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none", paddingBottom:2 }}>
            {[
              { Icon:Building2, name:"Main Auditorium", color:"#6B35C0" },
              { Icon:Leaf,      name:"Prayer Mountain", color:"#4A8A5A" },
              { Icon:Coffee,    name:"Camp Restaurant", color:"#C48D38" },
              { Icon:BookOpen,  name:"Bookshop",        color:"#9B5E3A" },
            ].map(({ Icon, name, color },i)=>(
              <div key={i} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:6,
                background:`${color}14`, border:`1px solid ${color}25`, borderRadius:10, padding:"6px 10px" }}>
                <Icon size={11} color={color} strokeWidth={2}/>
                <span style={{ fontSize:10.5, color:C.tp, fontWeight:500, whiteSpace:"nowrap" }}>{name}</span>
              </div>
            ))}
            <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:4,
              background:C.surfHi, border:`1px solid ${C.b}`, borderRadius:10, padding:"6px 10px" }}>
              <span style={{ fontSize:10.5, color:C.ts, whiteSpace:"nowrap" }}>+4 more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Find a Church */}
      <div className="fu3"><FindAChurchSection onSeeAll={()=>setHomeSub("church")}/></div>

      {/* Business Directory */}
      <div className="fu3" style={{ padding:"0 18px", marginBottom:22 }}>
        <SectionHeader title="Business Directory" action="See all" onAction={()=>setHomeSub("business")}/>
        <div onClick={()=>setHomeSub("business")} style={{ marginTop:12, background:C.surf, border:`1px solid ${C.b}`,
          borderRadius:16, padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"rgba(196,141,56,0.15)",
            border:"1px solid rgba(196,141,56,0.25)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Utensils size={15} color={C.gold} strokeWidth={2}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:C.tp, marginBottom:1 }}>Camp Restaurant</div>
            <div style={{ fontSize:10.5, color:C.ts }}>Open · 7AM–9PM · Tap to call</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:3 }}>
            <Star size={9} color={C.gold} fill={C.gold} strokeWidth={0}/>
            <span style={{ fontSize:10.5, color:C.gold, fontWeight:600 }}>4.3</span>
          </div>
        </div>
      </div>

      {/* CityFlow AI */}
      <div className="fu3" style={{ padding:"0 18px", marginBottom:22 }}>
        <SectionHeader title="CityFlow AI" action="Open chat" onAction={()=>setHomeSub("ai")}/>
        <div style={{ marginTop:12, background:C.surf, border:`1px solid ${C.b}`, borderRadius:22, overflow:"hidden" }}>
          <div style={{ padding:"12px 14px", borderBottom:`1px solid ${C.b}`, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:"rgba(113,40,206,0.18)",
              border:"1px solid rgba(113,40,206,0.28)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Bot size={14} color={C.purpleL} strokeWidth={2}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.tp }}>CityFlow AI</div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <PulsingDot size={5} color={C.green}/>
                <span style={{ fontSize:9.5, color:C.green, fontWeight:600 }}>Online</span>
              </div>
            </div>
          </div>
          <div style={{ padding:"12px 14px" }}>
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <div style={{ width:24, height:24, borderRadius:7, background:"rgba(113,40,206,0.18)",
                border:"1px solid rgba(113,40,206,0.28)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                <Bot size={11} color={C.purpleL} strokeWidth={2}/>
              </div>
              <div style={{ padding:"9px 12px", background:"rgba(255,255,255,0.05)", border:`1px solid ${C.b}`,
                borderRadius:"4px 14px 14px 14px", fontSize:11.5, color:C.tp, lineHeight:1.55, maxWidth:"80%" }}>
                Hi! I'm your CityFlow AI. Ask me anything about Redemption City.
              </div>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
              {["Find a restaurant","Book a CityRide","Emergency contacts"].map(q=>(
                <div key={q} onClick={()=>setHomeSub("ai")} style={{ padding:"5px 10px", borderRadius:16,
                  border:`1px solid ${C.b}`, background:C.surfHi, fontSize:10.5, color:C.tp, cursor:"pointer", fontWeight:500 }}>{q}</div>
              ))}
            </div>
            <div onClick={()=>setHomeSub("ai")} style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.04)",
              border:`1px solid ${C.b}`, borderRadius:13, padding:"9px 12px", cursor:"pointer" }}>
              <span style={{ flex:1, fontSize:11.5, color:C.tm }}>Ask me anything about the city…</span>
              <div style={{ width:28, height:28, borderRadius:9, background:`linear-gradient(135deg,${C.purple},#5A18A8)`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Send size={12} color="#fff" strokeWidth={2}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Picture of the Day */}
      <div className="fu4"><PictureOfTheDay onOpen={()=>setHomeSub("gallery")}/></div>

      {/* Did You Know */}
      <div className="fu4" style={{ padding:"0 18px", marginBottom:22 }}>
        <SectionHeader title="Did You Know?" action="See all" onAction={()=>setHomeSub("facts")}/>
        <div onClick={()=>setHomeSub("facts")} style={{ marginTop:12, background:"linear-gradient(148deg,rgba(113,40,206,0.15) 0%,rgba(10,2,24,1) 80%)",
          border:"1px solid rgba(113,40,206,0.28)", borderRadius:22, padding:"20px 18px", cursor:"pointer", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ fontSize:36, marginBottom:10 }}>{FUN_FACTS[0].icon}</div>
          <div style={{ fontSize:8.5, fontWeight:700, color:C.gold, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:8 }}>FACT 1 OF {FUN_FACTS.length}</div>
          <div style={{ fontSize:12.5, color:C.tp, lineHeight:1.65, fontWeight:500, marginBottom:16 }}>{FUN_FACTS[0].fact}</div>
          <div style={{ display:"flex", justifyContent:"center", gap:5 }}>
            {FUN_FACTS.slice(0,8).map((_,i)=>(
              <div key={i} style={{ width:5, height:5, borderRadius:"50%", background: i===0 ? C.gold : C.tm }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="fu4" style={{ padding:"0 18px", marginBottom:22 }}>
        <SectionHeader title="Know Your City Quiz" action="Play" onAction={()=>setHomeSub("quiz")}/>
        <div onClick={()=>setHomeSub("quiz")} style={{ marginTop:12, background:"linear-gradient(148deg,rgba(196,141,56,0.13) 0%,rgba(10,2,24,1) 75%)",
          border:"1px solid rgba(196,141,56,0.25)", borderRadius:22, padding:"17px 16px", cursor:"pointer", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-30, width:140, height:140,
            background:"rgba(196,141,56,0.08)", borderRadius:"50%", filter:"blur(40px)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:13, marginBottom:14, position:"relative" }}>
            <div style={{ width:46, height:46, borderRadius:14, flexShrink:0, background:"rgba(196,141,56,0.16)",
              border:"1px solid rgba(196,141,56,0.32)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Trophy size={21} color={C.gold} strokeWidth={1.8}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14.5, fontWeight:700, color:C.tp }}>Know Your City</div>
              <div style={{ fontSize:11, color:C.ts, marginTop:3, lineHeight:1.5 }}>Test your knowledge of Redemption City — history, places &amp; more.</div>
            </div>
            <div style={{ width:32, height:32, borderRadius:10, flexShrink:0, background:`linear-gradient(135deg,${C.gold},#A87425)`,
              display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 18px rgba(196,141,56,0.3)" }}>
              <ArrowRight size={14} color="#08011A" strokeWidth={2.5}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, position:"relative" }}>
            {[[FileText, `${QUIZ_QUESTIONS.length} questions`],[Clock, "~3 min"],[Star, "Earn a badge"]].map(([Ic,lb])=>(
              <div key={lb} style={{ display:"flex", alignItems:"center", gap:5, background:C.surfHi,
                border:`1px solid ${C.b}`, borderRadius:9, padding:"6px 10px" }}>
                <Ic size={11} color={C.gold} strokeWidth={2}/>
                <span style={{ fontSize:10, color:C.tp, fontWeight:500 }}>{lb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Heaven Devotional */}
      <div className="fu4"><OpenHeavenDevotional/></div>

      <div style={{ height:8 }}/>

      {/* Weather modal */}
      {showWeather && <WeatherModal onClose={()=>setShowWeather(false)}/>}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   REDEMPTION CITY TOUR SCREEN
══════════════════════════════════════════════════════════ */
const TOUR_STOPS = [
  { Icon:Building2, name:"Main Auditorium",    desc:"Start your tour at the iconic main worship hall — seats over 1 million worshippers.",     color:"#6B35C0", dist:"0.2km", duration:"20 min" },
  { Icon:Leaf,      name:"Prayer Garden",      desc:"A beautifully landscaped garden — ideal for quiet meditation and morning prayers.",         color:"#4A8A5A", dist:"0.6km", duration:"15 min" },
  { Icon:Coffee,    name:"Bread of Life Café", desc:"Refresh yourself with coffee, pastries, and light bites in a serene garden setting.",       color:"#C48D38", dist:"0.7km", duration:"20 min" },
  { Icon:Leaf,      name:"Prayer Mountain",    desc:"The spiritual high point of camp — breathtaking views, rated 4.9★ by all visitors.",       color:"#4A8A5A", dist:"1.2km", duration:"30 min" },
  { Icon:Home,      name:"Guest House A",      desc:"See the accommodation facilities — 84 rooms with AC & WiFi, the heart of camp hospitality.", color:"#2A7FAB", dist:"0.3km", duration:"10 min" },
  { Icon:BookOpen,  name:"Camp Bookshop",      desc:"Browse Bibles, devotionals, and souvenirs at the largest Christian bookstore on camp.",     color:"#9B5E3A", dist:"0.5km", duration:"15 min" },
  { Icon:Building2, name:"Children's Pavilion",desc:"A dedicated 4.6★-rated space for younger visitors — games, worship, and activities.",        color:"#6B35C0", dist:"0.8km", duration:"15 min" },
  { Icon:Car,       name:"Main Car Park",      desc:"End your tour back at the main car park — a perfect debrief point before your next visit.",  color:"#6A6880", dist:"0.1km", duration:"5 min" },
];

function CityTourScreen({ onBack }) {
  const [activeStop, setActiveStop] = useState(0);
  const [completed,  setCompleted]  = useState(new Set());

  function markDone(i) {
    setCompleted(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; });
  }

  const totalDone = completed.size;
  const pct = Math.round((totalDone / TOUR_STOPS.length) * 100);

  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      {/* Header */}
      <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:10 }}>
        <div onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:C.surf,
          border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ChevronLeft size={16} color={C.tp} strokeWidth={2}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:18, fontWeight:700, color:C.tp }}>Redemption City Tour</div>
          <div style={{ fontSize:11, color:C.ts }}>Self-guided · 8 stops · ~2 hrs</div>
        </div>
        <div style={{ fontSize:12, fontWeight:700, color:C.gold }}>{totalDone}/{TOUR_STOPS.length}</div>
      </div>

      {/* Progress bar */}
      <div style={{ margin:"0 18px 16px" }}>
        <div style={{ height:6, background:C.surf, borderRadius:6, overflow:"hidden", border:`1px solid ${C.b}` }}>
          <div style={{ height:"100%", borderRadius:6, width:`${pct}%`,
            background:`linear-gradient(90deg,#2A7FAB,${C.purple})`, transition:"width 0.4s ease" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
          <span style={{ fontSize:10, color:C.ts }}>{pct}% complete</span>
          <span style={{ fontSize:10, color:C.ts }}>{TOUR_STOPS.length - totalDone} stops remaining</span>
        </div>
      </div>

      {/* Featured stop card */}
      <div style={{ padding:"0 18px", marginBottom:18 }}>
        <div style={{
          background:`linear-gradient(148deg,${TOUR_STOPS[activeStop].color}22 0%,rgba(10,2,24,1) 75%)`,
          border:`1px solid ${TOUR_STOPS[activeStop].color}35`,
          borderRadius:24, padding:"20px 18px", position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-30, right:-20, width:130, height:130,
            background:`${TOUR_STOPS[activeStop].color}0A`, borderRadius:"50%", filter:"blur(35px)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:44, height:44, borderRadius:13, flexShrink:0,
              background:`${TOUR_STOPS[activeStop].color}20`, border:`1px solid ${TOUR_STOPS[activeStop].color}35`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              {React.createElement(TOUR_STOPS[activeStop].Icon, { size:20, color:TOUR_STOPS[activeStop].color, strokeWidth:1.8 })}
            </div>
            <div>
              <div style={{ fontSize:8.5, fontWeight:700, color:TOUR_STOPS[activeStop].color,
                letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:2 }}>
                STOP {activeStop+1} OF {TOUR_STOPS.length}
              </div>
              <div style={{ fontSize:15, fontWeight:700, color:C.tp }}>{TOUR_STOPS[activeStop].name}</div>
            </div>
          </div>
          <div style={{ fontSize:12.5, color:C.ts, lineHeight:1.65, marginBottom:14 }}>
            {TOUR_STOPS[activeStop].desc}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <MapPinned size={11} color={C.gold} strokeWidth={2}/>
              <span style={{ fontSize:11, color:C.gold, fontWeight:500 }}>{TOUR_STOPS[activeStop].dist}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <Clock size={11} color={C.ts} strokeWidth={2}/>
              <span style={{ fontSize:11, color:C.ts }}>{TOUR_STOPS[activeStop].duration}</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>markDone(activeStop)} style={{
              flex:1, padding:"10px 0", borderRadius:12, border:"none", cursor:"pointer", fontFamily:FONT,
              background: completed.has(activeStop)
                ? "rgba(61,170,106,0.2)" : `linear-gradient(135deg,${TOUR_STOPS[activeStop].color},${TOUR_STOPS[activeStop].color}BB)`,
              fontSize:12, fontWeight:600,
              color: completed.has(activeStop) ? C.green : "#fff",
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}>
              {completed.has(activeStop) ? <><CheckCircle size={13} strokeWidth={2}/>Visited</> : <><MapPin size={13} strokeWidth={2}/>Mark Visited</>}
            </button>
            {activeStop < TOUR_STOPS.length - 1 && (
              <button onClick={()=>{ markDone(activeStop); setActiveStop(i=>i+1); }} style={{
                padding:"10px 16px", borderRadius:12, border:`1px solid ${C.b}`,
                background:C.surf, fontSize:12, fontWeight:600, color:C.tp, cursor:"pointer", fontFamily:FONT,
                display:"flex", alignItems:"center", gap:5,
              }}>Next <ChevronRight size={12} strokeWidth={2}/></button>
            )}
          </div>
        </div>
      </div>

      {/* All stops list */}
      <div style={{ padding:"0 18px 8px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.ts, letterSpacing:"0.06em",
          textTransform:"uppercase", marginBottom:12 }}>All Stops</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {TOUR_STOPS.map((stop, i)=>(
            <div key={i} onClick={()=>setActiveStop(i)} style={{
              display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
              background: i===activeStop ? `${stop.color}12` : C.surf,
              border:`1px solid ${i===activeStop ? stop.color+"40" : C.b}`,
              borderRadius:16, cursor:"pointer", transition:"all 0.2s",
            }}>
              <div style={{ width:32, height:32, borderRadius:10, flexShrink:0,
                background:`${stop.color}18`, border:`1px solid ${stop.color}28`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {React.createElement(stop.Icon, { size:14, color:stop.color, strokeWidth:1.8 })}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, fontWeight:600, color:C.tp, marginBottom:1 }}>{stop.name}</div>
                <div style={{ fontSize:10.5, color:C.ts }}>{stop.dist} · {stop.duration}</div>
              </div>
              {completed.has(i)
                ? <CheckCircle size={14} color={C.green} strokeWidth={2}/>
                : <div style={{ width:8, height:8, borderRadius:"50%", background: i===activeStop ? stop.color : C.tm }}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CITYRIDE SCREEN
══════════════════════════════════════════════════════════ */
/* ── searchable location dropdown ────────────────────────── */
function LocationSelect({ label, value, placeholder, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const list = LOCATIONS.filter(l => l.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ position:"relative", flex:1 }}>
      <div onClick={()=>{ setOpen(o=>!o); setQ(""); }} style={{ cursor:"pointer" }}>
        <div style={{ fontSize:10, color:C.ts, marginBottom:3 }}>{label}</div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ flex:1, fontSize:13, fontWeight:600, color: value ? C.tp : C.ts }}>{value || placeholder}</span>
          <ChevronDown size={13} color={C.ts} strokeWidth={2} style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform 0.2s", flexShrink:0 }}/>
        </div>
      </div>
      {open && (
        <div className="si" style={{ position:"absolute", top:"calc(100% + 10px)", left:-26, right:-16, zIndex:60,
          background:"#140B2A", border:`1px solid ${C.bHi}`, borderRadius:16, overflow:"hidden",
          boxShadow:"0 20px 50px rgba(0,0,0,0.65)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 13px", borderBottom:`1px solid ${C.b}` }}>
            <Search size={13} color={C.ts} strokeWidth={2}/>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search locations…"
              style={{ flex:1, background:"none", border:"none", outline:"none", color:C.tp, fontSize:12.5, fontFamily:FONT }}/>
          </div>
          <div style={{ maxHeight:204, overflowY:"auto", scrollbarWidth:"none" }}>
            {list.length === 0 && <div style={{ padding:14, fontSize:11.5, color:C.tm, textAlign:"center" }}>No locations found</div>}
            {list.map(l => (
              <div key={l} onClick={()=>{ onChange(l); setOpen(false); }} style={{ display:"flex", alignItems:"center", gap:9,
                padding:"11px 13px", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.04)",
                background: l===value ? "rgba(113,40,206,0.12)" : "transparent" }}
                onMouseEnter={e=>{ if(l!==value) e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background = l===value ? "rgba(113,40,206,0.12)" : "transparent"; }}>
                <MapPin size={12} color={l===value?C.purpleL:C.tm} strokeWidth={2}/>
                <span style={{ fontSize:12.5, color:C.tp, fontWeight:500 }}>{l}</span>
                {l===value && <Check size={12} color={C.purpleL} strokeWidth={2.5} style={{ marginLeft:"auto" }}/>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CityRideScreen() {
  const [from,       setFrom]       = useState("Main Gate");
  const [dest,       setDest]       = useState("");
  const [rideType,   setRideType]   = useState("standard");
  const [booking,    setBooking]    = useState(false);
  const [booked,     setBooked]     = useState(false);
  const [focused,    setFocused]    = useState(false);

  function handleBook() {
    if (!dest.trim()) return;
    setBooking(true);
    setTimeout(() => { setBooking(false); setBooked(true); }, 1500);
  }

  const selected = RIDE_TYPES.find(r=>r.id===rideType);

  if (booked) return (
    <>
      <ScreenHeader title="CityRide" sub="Your city transport"/>
      <div className="si" style={{ margin:"40px 22px 0", background:"rgba(61,170,106,0.1)", border:"1px solid rgba(61,170,106,0.25)",
        borderRadius:24, padding:"32px 24px", textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(61,170,106,0.15)",
          border:"1px solid rgba(61,170,106,0.3)", display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 18px" }}>
          <CheckCircle size={30} color={C.green} strokeWidth={1.8}/>
        </div>
        <div style={{ fontSize:18, fontWeight:700, color:C.tp, marginBottom:6 }}>Ride Confirmed!</div>
        <div style={{ fontSize:13, color:C.ts, marginBottom:20, lineHeight:1.6 }}>
          Your {selected.label} is on the way to {from}.<br/>Estimated arrival: {selected.eta}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:24 }}>
          {[["Destination", dest],["Fare", selected.fare],["ETA", selected.eta]].map(([k,v])=>(
            <div key={k} style={{ textAlign:"center" }}>
              <div style={{ fontSize:10, color:C.ts, marginBottom:4 }}>{k}</div>
              <div style={{ fontSize:14, fontWeight:600, color:C.tp }}>{v}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>{ setBooked(false); setDest(""); }}
          style={{ padding:"11px 32px", borderRadius:13, background:C.purple, border:"none",
            fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer", fontFamily:FONT }}>
          Book Another
        </button>
      </div>
    </>
  );

  return (
    <>
      <ScreenHeader title="CityRide" sub="Fast, reliable camp transport"/>
      <div style={{ padding:"16px 18px 0" }}>
        {/* Route card */}
        <div style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:22, padding:16, marginBottom:18 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:14,
            borderBottom:`1px solid ${C.b}` }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, flexShrink:0 }}/>
            <LocationSelect label="FROM" value={from} placeholder="Pickup location" onChange={setFrom}/>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12, paddingTop:14 }}>
            <MapPin size={14} color={C.gold} strokeWidth={2} style={{ flexShrink:0 }}/>
            <LocationSelect label="TO" value={dest} placeholder="Where to?" onChange={setDest}/>
          </div>
        </div>

        {/* Recent destinations */}
        {!dest && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, color:C.ts, marginBottom:10, fontWeight:500 }}>RECENT</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {RECENT_DEST.map(d => (
                <div key={d} onClick={()=>setDest(d)} style={{ display:"flex", alignItems:"center", gap:12,
                  padding:"10px 14px", background:C.surf, border:`1px solid ${C.b}`,
                  borderRadius:13, cursor:"pointer" }}>
                  <Clock size={13} color={C.ts} strokeWidth={1.8}/>
                  <span style={{ fontSize:13, color:C.tp, fontWeight:500 }}>{d}</span>
                  <ChevronRight size={13} color={C.ts} strokeWidth={2} style={{ marginLeft:"auto" }}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ride types */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, color:C.ts, marginBottom:10, fontWeight:500 }}>SELECT RIDE TYPE</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {RIDE_TYPES.map(r => {
              const active = rideType === r.id;
              return (
                <div key={r.id} onClick={()=>setRideType(r.id)} style={{
                  display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
                  background: active ? "rgba(113,40,206,0.12)" : C.surf,
                  border: `1px solid ${active ? "rgba(113,40,206,0.4)" : C.b}`,
                  borderRadius:16, cursor:"pointer", transition:"all 0.2s",
                }}>
                  <div style={{ width:40, height:40, borderRadius:12, flexShrink:0,
                    background: active ? "rgba(113,40,206,0.2)" : "rgba(255,255,255,0.05)",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Car size={18} color={active?C.purpleL:C.ts} strokeWidth={1.8}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:C.tp, marginBottom:2 }}>{r.label}</div>
                    <div style={{ fontSize:11, color:C.ts }}>{r.note}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:active?C.gold:C.tp }}>{r.fare}</div>
                    <div style={{ fontSize:10, color:C.ts }}>{r.eta}</div>
                  </div>
                  {active && (
                    <div style={{ width:18, height:18, borderRadius:"50%", background:C.purple, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Check size={10} color="#fff" strokeWidth={3}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Book button */}
        <button onClick={handleBook} style={{
          width:"100%", padding:"14px 0", borderRadius:15, border:"none", cursor:"pointer",
          background: !dest.trim() ? "rgba(113,40,206,0.3)" : `linear-gradient(135deg,${C.purple},#5A18A8)`,
          fontSize:14, fontWeight:600, color:"#fff", fontFamily:FONT,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          boxShadow: dest.trim() ? "0 8px 28px rgba(100,30,190,0.35)" : "none",
          marginBottom:16,
        }}>
          {booking
            ? <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin 0.7s linear infinite" }}/>
            : <><Car size={15} strokeWidth={2}/><span>Book CityRide · {selected.fare}</span></>
          }
        </button>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   EXPLORE SCREEN
══════════════════════════════════════════════════════════ */
function ExploreScreen() {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");
  const CATS = ["All","Worship","Stay","Dining","Spiritual","Transport","Retail"];

  const filtered = EXPLORE_PLACES.filter(p => {
    const matchCat = category==="All" || p.cat===category;
    const matchQ   = !query || p.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <>
      <ScreenHeader title="Explore" sub="Discover Redemption City"/>
      {/* Search bar */}
      <div style={{ padding:"12px 18px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, background:C.surf,
          border:`1px solid ${C.b}`, borderRadius:14, padding:"11px 14px" }}>
          <Search size={15} color={C.ts} strokeWidth={1.8}/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search places..."
            style={{ flex:1, background:"transparent", border:"none", outline:"none",
              fontSize:13, color:C.tp, fontFamily:FONT }}/>
          {query && <X size={14} color={C.ts} strokeWidth={2} style={{ cursor:"pointer" }} onClick={()=>setQuery("")}/>}
        </div>
      </div>
      {/* Category filters */}
      <div style={{ display:"flex", gap:8, padding:"14px 18px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {CATS.map(c => (
          <button key={c} onClick={()=>setCategory(c)} style={{
            padding:"7px 14px", borderRadius:20, border:"none", cursor:"pointer",
            background: category===c ? C.purple : C.surf,
            color: category===c ? "#fff" : C.ts,
            fontSize:12, fontWeight:600, fontFamily:FONT,
            border: `1px solid ${category===c ? "transparent" : C.b}`,
            flexShrink:0, transition:"all 0.2s",
          }}>{c}</button>
        ))}
      </div>
      {/* Grid */}
      <div style={{ padding:"16px 18px 8px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {filtered.map(({ Icon, name, cat, dist, color, rating },i) => (
          <div key={i} style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18,
            overflow:"hidden", cursor:"pointer", transition:"transform 0.12s" }}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{ height:76, background:`${color}18`, borderBottom:`1px solid ${C.b}`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon size={28} color={color} strokeWidth={1.4}/>
            </div>
            <div style={{ padding:"10px 12px 12px" }}>
              <div style={{ fontSize:12.5, fontWeight:600, color:C.tp, marginBottom:4, lineHeight:1.3 }}>{name}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:10, color:C.ts }}>{cat}</span>
                <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                  <Star size={9} color={C.gold} fill={C.gold} strokeWidth={0}/>
                  <span style={{ fontSize:10, color:C.gold, fontWeight:600 }}>{rating}</span>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                <MapPinned size={9} color={C.gold} strokeWidth={2.5}/>
                <span style={{ fontSize:9.5, color:C.gold, fontWeight:500 }}>{dist}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0 && (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"40px 0", color:C.ts, fontSize:13 }}>
            No places found for "{query}"
          </div>
        )}
      </div>
    </>
  );
}


/* ══════════════════════════════════════════════════════════
   LOST & FOUND SCREEN
══════════════════════════════════════════════════════════ */
function LostAndFoundScreen() {
  const [subTab,     setSubTab]     = useState("found");
  const [expandedId, setExpandedId] = useState(null);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    itemName:"", category:"", description:"", dateLost:"",
    locationLost:"", ownerName:"", ownerPhone:"", ownerEmail:""
  });

  function upd(field, val) { setForm(f=>({ ...f, [field]:val })); }

  function handleSubmit() {
    if (!form.itemName.trim() || !form.ownerName.trim() || !form.ownerPhone.trim()) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
  }

  function resetForm() {
    setForm({ itemName:"", category:"", description:"", dateLost:"",
      locationLost:"", ownerName:"", ownerPhone:"", ownerEmail:"" });
    setSubmitted(false);
  }

  const inputStyle = {
    width:"100%", padding:"12px 14px", background:"rgba(255,255,255,0.05)",
    border:`1px solid ${C.b}`, borderRadius:13, fontSize:13, color:C.tp,
    outline:"none", fontFamily:"'Sora',sans-serif", transition:"border-color 0.2s",
  };

  const labelStyle = { fontSize:11, fontWeight:600, color:"#8C7DA0", letterSpacing:"0.04em",
    textTransform:"uppercase", marginBottom:7, display:"block" };

  const catIcons = {
    "Electronics":"📱", "Clothing":"👕", "Bag/Luggage":"🎒",
    "Documents":"📄", "Wallet":"👜", "Jewellery":"⌚", "Book":"📚", "Other":"📦"
  };

  return (
    <>
      {/* Header */}
      <div style={{ padding:"18px 22px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"rgba(113,40,206,0.15)",
            border:"1px solid rgba(113,40,206,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Package size={16} color={C.purpleL} strokeWidth={1.8}/>
          </div>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:C.tp }}>Lost & Found</div>
            <div style={{ fontSize:11, color:C.ts }}>Report or locate missing items</div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display:"flex", margin:"14px 18px 0", background:C.surf,
        border:`1px solid ${C.b}`, borderRadius:14, padding:3 }}>
        {[["found","Found Items"],["report","Report Lost"]].map(([id,lbl]) => (
          <button key={id} onClick={()=>setSubTab(id)} style={{
            flex:1, padding:"9px 0", borderRadius:11, border:"none", cursor:"pointer",
            background: subTab===id ? C.purple : "transparent",
            fontSize:12, fontWeight:600, color: subTab===id ? "#fff" : C.ts,
            fontFamily:"'Sora',sans-serif", transition:"all 0.2s",
          }}>{lbl}</button>
        ))}
      </div>

      {/* ── FOUND ITEMS ── */}
      {subTab==="found" && (
        <div style={{ padding:"14px 18px 8px" }}>
          <div style={{ fontSize:11, color:C.ts, marginBottom:12, fontWeight:500 }}>
            {FOUND_ITEMS.length} ITEMS CURRENTLY IN CUSTODY
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {FOUND_ITEMS.map(item => {
              const open    = expandedId === item.id;
              const claimed = item.status === "claimed";
              return (
                <div key={item.id} style={{ background:C.surf, border:`1px solid ${C.b}`,
                  borderRadius:18, overflow:"hidden", transition:"all 0.2s" }}>
                  {/* Card header row */}
                  <div onClick={()=>setExpandedId(open?null:item.id)}
                    style={{ padding:"14px 16px", cursor:"pointer", display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
                      background:"rgba(113,40,206,0.12)", border:"1px solid rgba(113,40,206,0.22)",
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                      <Package size={16} color={C.purpleL} strokeWidth={1.8}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                        <span style={{ fontSize:13.5, fontWeight:700, color:C.tp, lineHeight:1.3 }}>{item.item}</span>
                        <span style={{
                          fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:20,
                          background: claimed ? "rgba(61,170,106,0.15)" : "rgba(196,141,56,0.15)",
                          color:       claimed ? C.green : C.amber,
                          border:`1px solid ${claimed?"rgba(61,170,106,0.3)":"rgba(196,141,56,0.3)"}`,
                          flexShrink:0, marginLeft:8, letterSpacing:"0.06em",
                          textTransform:"uppercase",
                        }}>
                          {claimed ? "Claimed" : "Pending"}
                        </span>
                      </div>
                      <div style={{ fontSize:10, color:C.ts, marginBottom:4 }}>
                        <span style={{ padding:"2px 7px", borderRadius:10, background:C.surfHi, marginRight:6 }}>{item.category}</span>
                        <span style={{ color:C.tm }}>{item.ref}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <MapPin size={9} color={C.ts} strokeWidth={2}/>
                        <span style={{ fontSize:10.5, color:C.ts }}>{item.location}</span>
                      </div>
                    </div>
                    <div style={{ flexShrink:0, color:C.ts, marginTop:2 }}>
                      {open ? <ChevronUp size={14} strokeWidth={2}/> : <ChevronDown size={14} strokeWidth={2}/>}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {open && (
                    <div style={{ borderTop:`1px solid ${C.b}`, padding:"14px 16px" }}>
                      <div style={{ fontSize:12, color:C.ts, lineHeight:1.6, marginBottom:12 }}>{item.desc}</div>
                      <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <Clock size={10} color={C.ts} strokeWidth={2}/>
                          <span style={{ fontSize:10.5, color:C.ts }}>{item.date}</span>
                        </div>
                      </div>
                      {/* Contact Security button */}
                      {!claimed && (
                        <button style={{
                          width:"100%", padding:"11px 0", borderRadius:12,
                          background:"rgba(113,40,206,0.12)", border:"1px solid rgba(113,40,206,0.3)",
                          fontSize:12, fontWeight:600, color:C.purpleL, cursor:"pointer",
                          fontFamily:"'Sora',sans-serif", display:"flex", alignItems:"center",
                          justifyContent:"center", gap:7,
                        }}>
                          <Phone size={13} strokeWidth={2}/>
                          Contact Security · 0800-RCCG-SOS
                        </button>
                      )}
                      {claimed && (
                        <div style={{ textAlign:"center", padding:"8px 0" }}>
                          <span style={{ fontSize:12, color:C.green, fontWeight:500 }}>
                            ✓ This item has been returned to its owner
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Security contact card */}
          <div style={{ marginTop:18, background:"rgba(113,40,206,0.08)", border:"1px solid rgba(113,40,206,0.2)",
            borderRadius:18, padding:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <Shield size={16} color={C.purpleL} strokeWidth={1.8}/>
              <span style={{ fontSize:13, fontWeight:700, color:C.tp }}>RCCG Security Department</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {[
                [MapPin,   "Gate B Command Post, Redemption City"],
                [Phone,    "0800-RCCG-SOS (0800-7224-767)"],
                [Clock,    "Available 24/7 during camp programmes"],
              ].map(([Icon, txt], i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Icon size={11} color={C.purpleL} strokeWidth={2}/>
                  <span style={{ fontSize:11.5, color:C.ts }}>{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT LOST ── */}
      {subTab==="report" && (
        <div style={{ padding:"14px 18px 8px" }}>
          {submitted ? (
            <div className="si" style={{ background:"rgba(61,170,106,0.08)", border:"1px solid rgba(61,170,106,0.22)",
              borderRadius:22, padding:"28px 22px", textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(61,170,106,0.15)",
                border:"1px solid rgba(61,170,106,0.3)", display:"flex", alignItems:"center",
                justifyContent:"center", margin:"0 auto 16px" }}>
                <CheckCircle size={26} color={C.green} strokeWidth={1.8}/>
              </div>
              <div style={{ fontSize:17, fontWeight:700, color:C.tp, marginBottom:6 }}>Report Submitted</div>
              <div style={{ fontSize:12.5, color:C.ts, lineHeight:1.65, marginBottom:8 }}>
                Your lost item report has been received.<br/>
                Security will review it within 24 hours.
              </div>
              <div style={{ fontSize:11, color:C.ts, marginBottom:20 }}>
                Reference: <span style={{ color:C.gold, fontWeight:600 }}>LF-2024-{Math.floor(4044+Math.random()*100)}</span>
              </div>
              <div style={{ background:"rgba(113,40,206,0.1)", border:"1px solid rgba(113,40,206,0.2)",
                borderRadius:14, padding:"12px 16px", marginBottom:20, textAlign:"left" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <Phone size={12} color={C.purpleL} strokeWidth={2}/>
                  <span style={{ fontSize:12, fontWeight:600, color:C.tp }}>RCCG Security</span>
                </div>
                <span style={{ fontSize:11.5, color:C.ts }}>0800-RCCG-SOS (0800-7224-767)</span>
              </div>
              <button onClick={resetForm} style={{ padding:"11px 32px", borderRadius:13, background:C.purple,
                border:"none", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
                Report Another Item
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

              {/* Section 1 */}
              <div style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.tp, marginBottom:14,
                  display:"flex", alignItems:"center", gap:7 }}>
                  <Tag size={14} color={C.gold} strokeWidth={1.8}/> Item Details
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div>
                    <label style={labelStyle}>Item Name *</label>
                    <input value={form.itemName} onChange={e=>upd("itemName",e.target.value)}
                      placeholder="e.g. Black Samsung Galaxy S21" style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                      {CATS_LOST.map(c => (
                        <button key={c} onClick={()=>upd("category",c)} style={{
                          padding:"6px 12px", borderRadius:20, border:`1px solid ${form.category===c?"transparent":C.b}`,
                          background: form.category===c ? C.purple : C.surf,
                          color: form.category===c ? "#fff" : C.ts,
                          fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:"'Sora',sans-serif",
                          transition:"all 0.15s",
                        }}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Description / Specifications</label>
                    <textarea value={form.description} onChange={e=>upd("description",e.target.value)}
                      placeholder="Colour, brand, model, unique identifiers, contents..."
                      rows={3} style={{ ...inputStyle, resize:"none", lineHeight:1.55 }}/>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.tp, marginBottom:14,
                  display:"flex", alignItems:"center", gap:7 }}>
                  <Clock size={14} color={C.gold} strokeWidth={1.8}/> When & Where
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div>
                    <label style={labelStyle}>Date & Time Lost</label>
                    <input value={form.dateLost} onChange={e=>upd("dateLost",e.target.value)}
                      placeholder="e.g. Dec 15, 2024 around 2:00 PM" style={inputStyle}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Last Known Location</label>
                    <div style={{ position:"relative" }}>
                      <select value={form.locationLost} onChange={e=>upd("locationLost",e.target.value)}
                        style={{ ...inputStyle, paddingRight:32, appearance:"none", WebkitAppearance:"none" }}>
                        <option value="">Select location...</option>
                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <ChevronDown size={14} color={C.ts} strokeWidth={2}
                        style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.tp, marginBottom:14,
                  display:"flex", alignItems:"center", gap:7 }}>
                  <User size={14} color={C.gold} strokeWidth={1.8}/> Owner Information
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    ["ownerName",  "Full Name *",         "e.g. Peter Adeyemi",           "text"],
                    ["ownerPhone", "Phone Number *",      "e.g. 08012345678",             "tel" ],
                    ["ownerEmail", "Email (optional)",    "e.g. peter@example.com",       "email"],
                  ].map(([field,lbl,ph,type]) => (
                    <div key={field}>
                      <label style={labelStyle}>{lbl}</label>
                      <input type={type} value={form[field]} onChange={e=>upd(field,e.target.value)}
                        placeholder={ph} style={inputStyle}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4 – Security info */}
              <div style={{ background:"rgba(113,40,206,0.08)", border:"1px solid rgba(113,40,206,0.2)",
                borderRadius:18, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.tp, marginBottom:12,
                  display:"flex", alignItems:"center", gap:7 }}>
                  <Shield size={14} color={C.purpleL} strokeWidth={1.8}/> RCCG Security Department
                </div>
                <div style={{ fontSize:12, color:C.ts, lineHeight:1.65, marginBottom:12 }}>
                  Your report will be sent directly to the RCCG Security team.
                  They will contact you within 24 hours if a match is found.
                </div>
                {[
                  [MapPin,  "Gate B Command Post, Redemption City"],
                  [Phone,   "0800-RCCG-SOS (0800-7224-767)"],
                  [Clock,   "Available 24/7 during camp programmes"],
                ].map(([Icon,txt],i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <Icon size={11} color={C.purpleL} strokeWidth={2}/>
                    <span style={{ fontSize:11.5, color:C.ts }}>{txt}</span>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} style={{
                width:"100%", padding:"14px 0", borderRadius:15, border:"none", cursor:"pointer",
                background: (!form.itemName||!form.ownerName||!form.ownerPhone) ? "rgba(113,40,206,0.3)" : `linear-gradient(135deg,${C.purple},#5A18A8)`,
                fontSize:14, fontWeight:600, color:"#fff", fontFamily:"'Sora',sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:(form.itemName&&form.ownerName&&form.ownerPhone)?"0 8px 28px rgba(100,30,190,0.35)":"none",
                marginBottom:8,
              }}>
                {submitting
                  ? <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin 0.7s linear infinite" }}/>
                  : <><Send size={14} strokeWidth={2}/><span>Submit Report</span></>
                }
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   EMERGENCY / SOS SCREEN
══════════════════════════════════════════════════════════ */
function EmergencyScreen({ onBack }) {
  const [sosActive, setSosActive] = useState(null);
  const [locSent,   setLocSent]   = useState(false);

  const SERVICES = [
    { id:"ambulance", label:"Ambulance",    sub:"Medical emergency",    color:"#D44F4F", bg:"rgba(212,79,79,0.12)",  Icon:Ambulance,    number:"199" },
    { id:"police",    label:"Police",       sub:"Crime / security",     color:"#2A7FAB", bg:"rgba(42,127,171,0.12)", Icon:Shield,       number:"112" },
    { id:"fire",      label:"Fire Service", sub:"Fire / rescue",        color:"#E07A1A", bg:"rgba(224,122,26,0.12)", Icon:Flame,        number:"190" },
    { id:"road",      label:"Road Safety",  sub:"Accident / traffic",   color:"#C48D38", bg:"rgba(196,141,56,0.12)", Icon:TrafficCone,  number:"122" },
  ];

  function handleSOS(svc) {
    setSosActive(svc.id);
    setLocSent(false);
    setTimeout(() => setLocSent(true), 1200);
  }

  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      {/* Header */}
      <div style={{ padding:"14px 18px 0", display:"flex", alignItems:"center", gap:10 }}>
        <div onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:C.surf,
          border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ChevronLeft size={16} color={C.tp} strokeWidth={2}/>
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:C.tp }}>Emergency / SOS</div>
          <div style={{ fontSize:11, color:C.ts }}>One-tap access · Location auto-shared</div>
        </div>
      </div>

      {/* Alert banner */}
      <div style={{ margin:"14px 18px 0", background:"rgba(212,79,79,0.1)", border:"1px solid rgba(212,79,79,0.28)",
        borderRadius:16, padding:"12px 16px", display:"flex", gap:10, alignItems:"center" }}>
        <div className="live" style={{ width:8, height:8, borderRadius:"50%", background:"#F06565", flexShrink:0 }}/>
        <span style={{ fontSize:12, color:"#F06565", fontWeight:500, lineHeight:1.5 }}>
          Tapping any button will call the service and share your GPS location with responders.
        </span>
      </div>

      {/* SOS Buttons */}
      <div style={{ padding:"16px 18px 0", display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {SERVICES.map(svc => {
          const active = sosActive === svc.id;
          return (
            <div key={svc.id} onClick={() => handleSOS(svc)}
              style={{ background: active ? svc.bg : C.surf,
                border:`2px solid ${active ? svc.color : C.b}`,
                borderRadius:22, padding:"20px 14px 18px", textAlign:"center", cursor:"pointer",
                transition:"all 0.2s", boxShadow: active ? `0 0 24px ${svc.color}33` : "none",
              }}
              onMouseDown={e=>e.currentTarget.style.transform="scale(0.96)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              <div style={{ width:52, height:52, borderRadius:16, margin:"0 auto 12px",
                background: active ? `${svc.color}22` : `${svc.color}18`,
                border:`1px solid ${svc.color}35`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svc.Icon size={24} color={svc.color} strokeWidth={1.8}/>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:C.tp, marginBottom:3 }}>{svc.label}</div>
              <div style={{ fontSize:10.5, color:C.ts, marginBottom:8 }}>{svc.sub}</div>
              <div style={{ fontSize:13, fontWeight:700, color: active ? svc.color : C.gold,
                fontFamily:"'Sora',sans-serif" }}>{svc.number}</div>
              {active && locSent && (
                <div style={{ marginTop:8, fontSize:10, color:svc.color, fontWeight:600,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                  <MapPin size={9} strokeWidth={2.5}/> Location sent
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* General emergency card */}
      <div style={{ margin:"18px 18px 8px", background:"rgba(212,79,79,0.07)",
        border:"1px solid rgba(212,79,79,0.2)", borderRadius:18, padding:"14px 16px" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#F06565", marginBottom:6 }}>🚨 General Emergency Line</div>
        <div style={{ fontSize:22, fontWeight:800, color:C.tp, marginBottom:4 }}>112</div>
        <div style={{ fontSize:11, color:C.ts, lineHeight:1.6 }}>
          Available 24/7. Dispatches nearest available emergency unit. Works even without airtime.
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CITYFLOW AI ASSISTANT SCREEN
══════════════════════════════════════════════════════════ */
function AIAssistantScreen({ onBack }) {
  const [messages, setMessages] = useState([
    { role:"ai", text:"Hi! I'm your CityFlow AI Assistant. How can I help you today in Redemption City?" }
  ]);
  const [input,    setInput]    = useState("");
  const [typing,   setTyping]   = useState(false);
  const bottomRef = useRef(null);

  const QUICK = ["Find a restaurant","Book a CityRide","Emergency contacts","Prayer Mountain location","Today's events"];

  const AI_RESPONSES = {
    restaurant: "There are several great dining spots in Redemption City! The Camp Restaurant (0.3km) is the most popular — open 7AM–9PM. Bread of Life Café (0.7km) serves light snacks and beverages all day. Both accept cash and mobile payments.",
    ride:       "I can help you book a CityRide! Head to the CityRide tab in the bottom nav. Camp Shuttle is just ₦150, Standard is ₦450, and Premium is ₦850. Average wait time is 3–8 minutes.",
    emergency:  "For emergencies in Redemption City: Ambulance — 199, Police — 112, Fire Service — 190, Road Safety — 122. General Emergency: 112 (works without airtime). You can also tap Emergency in the More tab.",
    prayer:     "Prayer Mountain is 1.2km from the Main Gate. It's rated 4.9★ — one of the most peaceful spots in camp. Open daily from 5AM–10PM. Take the blue pathway from the main auditorium and follow signs.",
    default:    "I'm here to help with anything in Redemption City — navigation, bookings, emergencies, events, or local info. Could you give me a bit more detail about what you need?"
  };

  function getResponse(msg) {
    const m = msg.toLowerCase();
    if (m.includes("restaurant") || m.includes("food") || m.includes("eat") || m.includes("dining")) return AI_RESPONSES.restaurant;
    if (m.includes("ride") || m.includes("transport") || m.includes("car")) return AI_RESPONSES.ride;
    if (m.includes("emergency") || m.includes("ambulance") || m.includes("police") || m.includes("sos")) return AI_RESPONSES.emergency;
    if (m.includes("prayer") || m.includes("mountain") || m.includes("pray")) return AI_RESPONSES.prayer;
    return AI_RESPONSES.default;
  }

  function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(m => [...m, { role:"user", text:msg }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role:"ai", text:getResponse(msg) }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:"smooth" }), 50);
    }, 1100);
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <div onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:C.surf,
          border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ChevronLeft size={16} color={C.tp} strokeWidth={2}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:17, fontWeight:700, color:C.tp }}>CityFlow AI</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:1 }}>
            <div className="live" style={{ width:6, height:6, borderRadius:"50%", background:C.green }}/>
            <span style={{ fontSize:10, color:C.green, fontWeight:600 }}>Online</span>
          </div>
        </div>
        <div style={{ width:36, height:36, borderRadius:12, background:"rgba(113,40,206,0.15)",
          border:"1px solid rgba(113,40,206,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Bot size={17} color={C.purpleL} strokeWidth={1.8}/>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"0 16px" }}>
        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, color:C.ts, marginBottom:8, fontWeight:500 }}>QUICK QUESTIONS</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => sendMessage(q)} style={{
                  padding:"7px 12px", borderRadius:20, border:`1px solid ${C.b}`,
                  background:C.surf, fontSize:11, color:C.tp, cursor:"pointer",
                  fontFamily:FONT, fontWeight:500, transition:"all 0.15s",
                }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=C.surfHi; e.currentTarget.style.borderColor="rgba(113,40,206,0.4)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=C.surf; e.currentTarget.style.borderColor=C.b; }}
                >{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m,i) => (
          <div key={i} style={{ marginBottom:12, display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="ai" && (
              <div style={{ width:26, height:26, borderRadius:8, background:"rgba(113,40,206,0.18)",
                border:"1px solid rgba(113,40,206,0.3)", display:"flex", alignItems:"center",
                justifyContent:"center", flexShrink:0, marginRight:8, marginTop:2 }}>
                <Bot size={12} color={C.purpleL} strokeWidth={2}/>
              </div>
            )}
            <div style={{
              maxWidth:"76%", padding:"10px 13px", borderRadius: m.role==="ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
              background: m.role==="ai" ? C.surf : `linear-gradient(135deg,${C.purple},#5A18A8)`,
              border: m.role==="ai" ? `1px solid ${C.b}` : "none",
              fontSize:12.5, color:C.tp, lineHeight:1.6,
            }}>{m.text}</div>
          </div>
        ))}

        {typing && (
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <div style={{ width:26, height:26, borderRadius:8, background:"rgba(113,40,206,0.18)",
              border:"1px solid rgba(113,40,206,0.3)", display:"flex", alignItems:"center",
              justifyContent:"center", flexShrink:0 }}>
              <Bot size={12} color={C.purpleL} strokeWidth={2}/>
            </div>
            <div style={{ padding:"10px 14px", background:C.surf, border:`1px solid ${C.b}`,
              borderRadius:"4px 16px 16px 16px", display:"flex", gap:4, alignItems:"center" }}>
              {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:"50%",
                background:C.ts, animation:`dotp 1.2s ease ${i*0.2}s infinite` }}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{ padding:"10px 16px 14px", flexShrink:0, borderTop:`1px solid ${C.b}` }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", background:C.surf,
          border:`1px solid ${C.b}`, borderRadius:16, padding:"8px 8px 8px 14px" }}>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter" && sendMessage()}
            placeholder="Ask me anything about the city..."
            style={{ flex:1, background:"transparent", border:"none", outline:"none",
              fontSize:12.5, color:C.tp, fontFamily:FONT }}/>
          <button onClick={() => sendMessage()} style={{
            width:34, height:34, borderRadius:11, border:"none", cursor:"pointer",
            background: input.trim() ? `linear-gradient(135deg,${C.purple},#5A18A8)` : C.surfHi,
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <Send size={14} color={input.trim()?"#fff":C.ts} strokeWidth={2}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LOCAL BUSINESS DIRECTORY SCREEN
══════════════════════════════════════════════════════════ */
function BusinessDirectoryScreen({ onBack }) {
  const [activeCat, setActiveCat] = useState("Restaurants");
  const [search,    setSearch]    = useState("");

  const current = BUSINESSES.find(b => b.cat === activeCat);
  const filtered = current?.items.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:10 }}>
        <div onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:C.surf,
          border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ChevronLeft size={16} color={C.tp} strokeWidth={2}/>
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:C.tp }}>Business Directory</div>
          <div style={{ fontSize:11, color:C.ts }}>Redemption City local businesses</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding:"0 18px 14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, background:C.surf,
          border:`1px solid ${C.b}`, borderRadius:14, padding:"11px 14px" }}>
          <Search size={14} color={C.ts} strokeWidth={1.8}/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search businesses..."
            style={{ flex:1, background:"transparent", border:"none", outline:"none",
              fontSize:13, color:C.tp, fontFamily:FONT }}/>
          {search && <X size={14} color={C.ts} style={{ cursor:"pointer" }} onClick={()=>setSearch("")}/>}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display:"flex", gap:8, padding:"0 18px 16px", overflowX:"auto", scrollbarWidth:"none" }}>
        {BUSINESSES.map(b => {
          const act = activeCat === b.cat;
          return (
            <button key={b.cat} onClick={() => { setActiveCat(b.cat); setSearch(""); }} style={{
              display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
              borderRadius:20, border:`1px solid ${act ? "transparent" : C.b}`, cursor:"pointer",
              background: act ? b.color : C.surf, flexShrink:0, fontFamily:FONT,
              fontSize:11.5, fontWeight:600, color: act ? "#fff" : C.ts, transition:"all 0.2s",
            }}>
              <b.Icon size={12} strokeWidth={2}/>{b.cat.split(" ")[0]}
            </button>
          );
        })}
      </div>

      {/* Listings */}
      <div style={{ padding:"0 18px 8px", display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.map((item,i) => (
          <div key={i} style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18, padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.tp, flex:1, marginRight:8 }}>{item.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
                <Star size={9} color={C.gold} fill={C.gold} strokeWidth={0}/>
                <span style={{ fontSize:10.5, color:C.gold, fontWeight:600 }}>{item.rating}</span>
              </div>
            </div>
            <div style={{ fontSize:11.5, color:C.ts, lineHeight:1.5, marginBottom:10 }}>{item.desc}</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <Clock size={10} color={C.ts} strokeWidth={2}/>
                <span style={{ fontSize:10.5, color:C.ts }}>{item.hours}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px",
                background:`${current.color}15`, border:`1px solid ${current.color}25`, borderRadius:10,
                cursor:"pointer" }}>
                <Phone size={10} color={current.color} strokeWidth={2.5}/>
                <span style={{ fontSize:10.5, color:current.color, fontWeight:600 }}>{item.phone}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"32px 0", color:C.ts, fontSize:13 }}>
            No results for "{search}"
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FUN FACTS SCREEN
══════════════════════════════════════════════════════════ */
function FunFactsScreen({ onBack }) {
  const [current, setCurrent] = useState(0);
  const [flipped,  setFlipped] = useState(false);

  function next() { setFlipped(true); setTimeout(() => { setCurrent(c => (c+1) % FUN_FACTS.length); setFlipped(false); }, 200); }
  function prev() { setFlipped(true); setTimeout(() => { setCurrent(c => (c - 1 + FUN_FACTS.length) % FUN_FACTS.length); setFlipped(false); }, 200); }

  const fact = FUN_FACTS[current];

  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:10 }}>
        <div onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:C.surf,
          border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ChevronLeft size={16} color={C.tp} strokeWidth={2}/>
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:C.tp }}>Did You Know?</div>
          <div style={{ fontSize:11, color:C.ts }}>Fun facts about Redemption City</div>
        </div>
      </div>

      {/* Main card */}
      <div style={{ padding:"0 18px", marginBottom:20 }}>
        <div style={{
          background:"linear-gradient(148deg,rgba(113,40,206,0.18) 0%,rgba(10,2,24,1) 80%)",
          border:"1px solid rgba(113,40,206,0.3)", borderRadius:26, padding:"32px 22px",
          textAlign:"center", minHeight:200, display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          opacity: flipped ? 0 : 1, transition:"opacity 0.2s",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160,
            background:"rgba(196,141,56,0.06)", borderRadius:"50%", filter:"blur(40px)" }}/>
          <div style={{ fontSize:48, marginBottom:18 }}>{fact.icon}</div>
          <div style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:"0.2em",
            textTransform:"uppercase", marginBottom:14 }}>Fact {current+1} of {FUN_FACTS.length}</div>
          <div style={{ fontSize:14.5, color:C.tp, lineHeight:1.7, fontWeight:500 }}>{fact.fact}</div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"0 18px 20px" }}>
        <button onClick={prev} style={{ padding:"11px 22px", borderRadius:13, border:`1px solid ${C.b}`,
          background:C.surf, fontSize:13, fontWeight:600, color:C.tp, cursor:"pointer", fontFamily:FONT,
          display:"flex", alignItems:"center", gap:6 }}>
          <ChevronLeft size={14} strokeWidth={2}/> Prev
        </button>
        <div style={{ display:"flex", gap:6 }}>
          {FUN_FACTS.map((_,i) => (
            <div key={i} onClick={() => { setFlipped(true); setTimeout(()=>{ setCurrent(i); setFlipped(false); }, 200); }}
              style={{ width:6, height:6, borderRadius:"50%", cursor:"pointer",
                background: i===current ? C.gold : C.tm, transition:"all 0.2s" }}/>
          ))}
        </div>
        <button onClick={next} style={{ padding:"11px 22px", borderRadius:13, border:"none",
          background:`linear-gradient(135deg,${C.purple},#5A18A8)`, fontSize:13, fontWeight:600,
          color:"#fff", cursor:"pointer", fontFamily:FONT, display:"flex", alignItems:"center", gap:6 }}>
          Next <ChevronRight size={14} strokeWidth={2}/>
        </button>
      </div>

      {/* All facts list */}
      <div style={{ padding:"0 18px 8px" }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.ts, letterSpacing:"0.06em",
          textTransform:"uppercase", marginBottom:12 }}>All Facts</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {FUN_FACTS.map((f,i) => (
            <div key={i} onClick={() => { setFlipped(true); setTimeout(()=>{ setCurrent(i); setFlipped(false); }, 200); window.scrollTo(0,0); }}
              style={{ background: i===current ? "rgba(113,40,206,0.12)" : C.surf,
                border:`1px solid ${i===current ? "rgba(113,40,206,0.35)" : C.b}`,
                borderRadius:14, padding:"12px 14px", cursor:"pointer", display:"flex", gap:10, alignItems:"flex-start",
                transition:"all 0.2s" }}>
              <span style={{ fontSize:20 }}>{f.icon}</span>
              <span style={{ fontSize:12, color: i===current ? C.tp : C.ts, lineHeight:1.55, flex:1 }}>{f.fact}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTACTS SCREEN
══════════════════════════════════════════════════════════ */
function ContactsScreen({ onBack }) {
  const [expanded, setExpanded] = useState("Emergency");

  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:10 }}>
        <div onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:C.surf,
          border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ChevronLeft size={16} color={C.tp} strokeWidth={2}/>
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:C.tp }}>Quick Contacts</div>
          <div style={{ fontSize:11, color:C.ts }}>All important numbers in one place</div>
        </div>
      </div>

      <div style={{ padding:"0 18px 8px", display:"flex", flexDirection:"column", gap:12 }}>
        {CONTACTS_DATA.map(group => {
          const open = expanded === group.group;
          return (
            <div key={group.group} style={{ background:C.surf, border:`1px solid ${open ? group.color+"44" : C.b}`,
              borderRadius:20, overflow:"hidden", transition:"all 0.2s" }}>
              <div onClick={() => setExpanded(open ? null : group.group)}
                style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                <div style={{ width:32, height:32, borderRadius:10, background:`${group.color}18`,
                  border:`1px solid ${group.color}28`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <PhoneCall size={14} color={group.color} strokeWidth={2}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:C.tp }}>{group.group}</div>
                  <div style={{ fontSize:10.5, color:C.ts }}>{group.contacts.length} contacts</div>
                </div>
                {open ? <ChevronUp size={14} color={C.ts} strokeWidth={2}/> : <ChevronDown size={14} color={C.ts} strokeWidth={2}/>}
              </div>
              {open && (
                <div style={{ borderTop:`1px solid ${C.b}`, padding:"10px 16px 14px",
                  display:"flex", flexDirection:"column", gap:10 }}>
                  {group.contacts.map((c,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ width:30, height:30, borderRadius:9, background:`${group.color}14`,
                        border:`1px solid ${group.color}22`, display:"flex", alignItems:"center",
                        justifyContent:"center", flexShrink:0 }}>
                        <c.Icon size={13} color={group.color} strokeWidth={1.8}/>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12.5, fontWeight:600, color:C.tp, marginBottom:2 }}>{c.name}</div>
                        <div style={{ fontSize:12, color:group.color, fontWeight:700, marginBottom:2 }}>{c.phone}</div>
                        <div style={{ fontSize:10, color:C.ts }}>{c.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   KNOW YOUR CITY QUIZ SCREEN
══════════════════════════════════════════════════════════ */
function QuizScreen({ onBack }) {
  const [phase,     setPhase]    = useState("intro"); // intro | playing | result
  const [qIdx,      setQIdx]     = useState(0);
  const [selected,  setSelected] = useState(null);
  const [score,     setScore]    = useState(0);
  const [answers,   setAnswers]  = useState([]);

  function startQuiz() { setPhase("playing"); setQIdx(0); setScore(0); setSelected(null); setAnswers([]); }

  function handleAnswer(idx) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === QUIZ_QUESTIONS[qIdx].correct;
    if (correct) setScore(s => s+1);
    setAnswers(a => [...a, { q:QUIZ_QUESTIONS[qIdx].q, chosen:idx, correct:QUIZ_QUESTIONS[qIdx].correct }]);
    setTimeout(() => {
      if (qIdx + 1 < QUIZ_QUESTIONS.length) { setQIdx(q=>q+1); setSelected(null); }
      else { setPhase("result"); }
    }, 900);
  }

  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  if (phase === "intro") return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:10 }}>
        <div onClick={onBack} style={{ width:34, height:34, borderRadius:10, background:C.surf,
          border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <ChevronLeft size={16} color={C.tp} strokeWidth={2}/>
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:C.tp }}>Know Your City</div>
          <div style={{ fontSize:11, color:C.ts }}>Test your Redemption City knowledge</div>
        </div>
      </div>
      <div style={{ padding:"0 18px" }}>
        <div style={{ background:"linear-gradient(148deg,rgba(196,141,56,0.15) 0%,rgba(10,2,24,1) 70%)",
          border:"1px solid rgba(196,141,56,0.25)", borderRadius:26, padding:"32px 22px", textAlign:"center",
          marginBottom:20, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-50, right:-30, width:200, height:200,
            background:"rgba(196,141,56,0.06)", borderRadius:"50%", filter:"blur(55px)" }}/>
          <div style={{ fontSize:48, marginBottom:14 }}>🏙️</div>
          <div style={{ fontSize:20, fontWeight:700, color:C.tp, marginBottom:8 }}>Know Your City Quiz</div>
          <div style={{ fontSize:13, color:C.ts, lineHeight:1.7, marginBottom:20 }}>
            {QUIZ_QUESTIONS.length} questions about Redemption City's history, facts, and layout. How well do you know your city?
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:16, marginBottom:24 }}>
            {[["📋", QUIZ_QUESTIONS.length+" Qs"],["⏱️","~3 mins"],["🏆","Earn a badge"]].map(([ic,lb])=>(
              <div key={lb} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
                <div style={{ fontSize:10.5, color:C.ts }}>{lb}</div>
              </div>
            ))}
          </div>
          <button onClick={startQuiz} style={{ padding:"13px 40px", borderRadius:15, border:"none",
            background:`linear-gradient(135deg,${C.gold},#B07020)`, fontSize:14, fontWeight:700,
            color:"#08011A", cursor:"pointer", fontFamily:FONT, boxShadow:"0 8px 28px rgba(196,141,56,0.3)" }}>
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );

  if (phase === "playing") {
    const q = QUIZ_QUESTIONS[qIdx];
    return (
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
        <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:10 }}>
          <div onClick={()=>setPhase("intro")} style={{ width:34, height:34, borderRadius:10, background:C.surf,
            border:`1px solid ${C.b}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <X size={16} color={C.tp} strokeWidth={2}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.ts }}>Question {qIdx+1} of {QUIZ_QUESTIONS.length}</div>
            <div style={{ height:4, background:C.surf, borderRadius:4, marginTop:6, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:4, width:`${((qIdx+1)/QUIZ_QUESTIONS.length)*100}%`,
                background:`linear-gradient(90deg,${C.gold},${C.goldL})`, transition:"width 0.3s" }}/>
            </div>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:C.gold }}>{score} pts</div>
        </div>

        <div style={{ padding:"0 18px 20px" }}>
          <div style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:22, padding:"20px 18px",
            marginBottom:16, minHeight:100, display:"flex", alignItems:"center" }}>
            <div style={{ fontSize:14.5, color:C.tp, fontWeight:600, lineHeight:1.6 }}>{q.q}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {q.options.map((opt, i) => {
              let bg = C.surf, border = C.b, color = C.tp;
              if (selected !== null) {
                if (i === q.correct)  { bg = "rgba(61,170,106,0.15)"; border = "rgba(61,170,106,0.5)"; color = C.green; }
                else if (i === selected && i !== q.correct) { bg = "rgba(212,79,79,0.15)"; border = "rgba(212,79,79,0.5)"; color = C.red; }
              } else if (selected === i) { bg = "rgba(113,40,206,0.15)"; border = "rgba(113,40,206,0.5)"; }
              return (
                <div key={i} onClick={() => handleAnswer(i)} style={{
                  padding:"13px 16px", background:bg, border:`1px solid ${border}`,
                  borderRadius:14, cursor:selected===null?"pointer":"default",
                  display:"flex", gap:10, alignItems:"center", transition:"all 0.2s",
                }}>
                  <div style={{ width:26, height:26, borderRadius:8, background:`${border}22`,
                    border:`1px solid ${border}`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:11, fontWeight:700, color, flexShrink:0 }}>
                    {String.fromCharCode(65+i)}
                  </div>
                  <span style={{ fontSize:13, color, fontWeight:500 }}>{opt}</span>
                  {selected !== null && i === q.correct && <CheckCircle size={14} color={C.green} strokeWidth={2} style={{ marginLeft:"auto" }}/>}
                  {selected !== null && i === selected && i !== q.correct && <X size={14} color={C.red} strokeWidth={2} style={{ marginLeft:"auto" }}/>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Result screen — persist best badge earned
  try {
    const prev = JSON.parse(localStorage.getItem('cf_quiz_badge') || 'null');
    if (!prev || pct > prev.pct) {
      localStorage.setItem('cf_quiz_badge', JSON.stringify({
        pct, score, total: QUIZ_QUESTIONS.length,
        label: pct >= 80 ? "City Expert" : pct >= 50 ? "Good Knowledge" : "City Learner",
      }));
    }
  } catch(e) {}
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <div style={{ padding:"14px 18px 12px", display:"flex", alignItems:"center", gap:10 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:C.tp }}>Quiz Complete!</div>
          <div style={{ fontSize:11, color:C.ts }}>Here's how you did</div>
        </div>
      </div>
      <div style={{ padding:"0 18px 20px" }}>
        <div className="si" style={{ background:"linear-gradient(148deg,rgba(113,40,206,0.15) 0%,rgba(10,2,24,1) 70%)",
          border:"1px solid rgba(113,40,206,0.28)", borderRadius:26, padding:"28px 22px", textAlign:"center", marginBottom:18 }}>
          <div style={{ fontSize:56, marginBottom:6 }}>
            {pct >= 80 ? "🏆" : pct >= 50 ? "🎯" : "📚"}
          </div>
          <div style={{ fontSize:40, fontWeight:800, color:C.gold, marginBottom:4 }}>{score}/{QUIZ_QUESTIONS.length}</div>
          <div style={{ fontSize:16, fontWeight:600, color:C.tp, marginBottom:6 }}>
            {pct >= 80 ? "City Expert!" : pct >= 50 ? "Good Knowledge!" : "Keep Learning!"}
          </div>
          <div style={{ fontSize:12, color:C.ts, marginBottom:20 }}>
            You scored {pct}% — {pct >= 80 ? "Excellent! You really know your city." : pct >= 50 ? "Not bad! A few more visits and you'll be an expert." : "Explore more of Redemption City to improve your score!"}
          </div>
          <button onClick={startQuiz} style={{ padding:"11px 28px", borderRadius:13, border:"none",
            background:`linear-gradient(135deg,${C.purple},#5A18A8)`, fontSize:13, fontWeight:600,
            color:"#fff", cursor:"pointer", fontFamily:FONT, display:"inline-flex", alignItems:"center", gap:6 }}>
            <RotateCcw size={13} strokeWidth={2}/> Play Again
          </button>
        </div>

        {/* Answer review */}
        <div style={{ fontSize:12, fontWeight:700, color:C.ts, letterSpacing:"0.06em",
          textTransform:"uppercase", marginBottom:12 }}>Review Answers</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {answers.map((a,i) => {
            const right = a.chosen === a.correct;
            return (
              <div key={i} style={{ background:C.surf, border:`1px solid ${right?"rgba(61,170,106,0.3)":"rgba(212,79,79,0.3)"}`,
                borderRadius:14, padding:"12px 14px" }}>
                <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                  <div style={{ width:20, height:20, borderRadius:6, background: right?"rgba(61,170,106,0.2)":"rgba(212,79,79,0.2)",
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    {right ? <Check size={10} color={C.green} strokeWidth={3}/> : <X size={10} color={C.red} strokeWidth={3}/>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11.5, color:C.tp, marginBottom:4, lineHeight:1.5 }}>Q{i+1}: {a.q}</div>
                    {!right && <div style={{ fontSize:10.5, color:C.green }}>✓ {QUIZ_QUESTIONS[i].options[a.correct]}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROFILE SCREEN
══════════════════════════════════════════════════════════ */
function ProfileScreen({ onLogout }) {
  let badge = null; try { badge = JSON.parse(localStorage.getItem('cf_quiz_badge') || 'null'); } catch(e) {}
  const MENU = [
    { Icon:Bell,       label:"Notifications",   sub:"Manage your alerts",      color:"#7128CE" },
    { Icon:Package,    label:"My L&F Reports",  sub:"Track your submissions",  color:"#C48D38" },
    { Icon:BookOpen,   label:"Booking History", sub:"Past stays & events",     color:"#2A7FAB" },
    { Icon:HelpCircle, label:"Help & Support",  sub:"FAQs and contact",        color:"#4A8A5A" },
    { Icon:Settings,   label:"Settings",        sub:"App preferences",         color:"#6A6880" },
  ];
  return (
    <>
      <ScreenHeader title="Profile" sub="Your account"/>
      <div style={{ padding:"10px 22px 20px", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:72, height:72, borderRadius:"50%",
          background:`linear-gradient(135deg,${C.purple},#5A18A8)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:26, fontWeight:700, color:"#fff", marginBottom:14,
          boxShadow:"0 8px 28px rgba(100,30,190,0.35)" }}>PA</div>
        <div style={{ fontSize:18, fontWeight:700, color:C.tp, marginBottom:4 }}>Peter Adeyemi</div>
        <div style={{ fontSize:12, color:C.ts, marginBottom:4 }}>peter.adeyemi@example.com</div>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          <MapPin size={10} color={C.gold} strokeWidth={2.5}/>
          <span style={{ fontSize:11, color:C.ts }}>Redemption City</span>
        </div>
        {badge && (
          <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:12, padding:"7px 14px",
            background:"linear-gradient(135deg,rgba(196,141,56,0.16),rgba(196,141,56,0.05))",
            border:"1px solid rgba(196,141,56,0.4)", borderRadius:20 }}>
            <Trophy size={13} color={C.gold} strokeWidth={2}/>
            <span style={{ fontSize:11.5, fontWeight:700, color:C.gold }}>{badge.label}</span>
            <span style={{ fontSize:10.5, color:C.ts }}>· Know Your City · {badge.pct}%</span>
          </div>
        )}
      </div>
      <div style={{ display:"flex", gap:0, margin:"0 18px 20px",
        background:C.surf, border:`1px solid ${C.b}`, borderRadius:18, overflow:"hidden" }}>
        {[["14","CityRides"],["8","Events"],["2","L&F Reports"]].map(([val,lbl],i) => (
          <div key={i} style={{ flex:1, padding:"14px 0", textAlign:"center",
            borderRight: i<2 ? `1px solid ${C.b}` : "none" }}>
            <div style={{ fontSize:20, fontWeight:700, color:C.tp, marginBottom:3 }}>{val}</div>
            <div style={{ fontSize:10, color:C.ts }}>{lbl}</div>
          </div>
        ))}
      </div>
      <div style={{ padding:"0 18px", display:"flex", flexDirection:"column", gap:10 }}>
        {MENU.map(({ Icon, label, sub, color },i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px",
            background:C.surf, border:`1px solid ${C.b}`, borderRadius:16, cursor:"pointer",
            transition:"background 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.background=C.surfHi}
            onMouseLeave={e=>e.currentTarget.style.background=C.surf}>
            <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
              background:`${color}18`, border:`1px solid ${color}25`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon size={16} color={color} strokeWidth={1.8}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:600, color:C.tp, marginBottom:2 }}>{label}</div>
              <div style={{ fontSize:11, color:C.ts }}>{sub}</div>
            </div>
            <ChevronRight size={14} color={C.tm} strokeWidth={2}/>
          </div>
        ))}
        <button onClick={onLogout} style={{
          width:"100%", padding:"13px 15px", borderRadius:16, cursor:"pointer",
          background:"rgba(212,79,79,0.08)", border:"1px solid rgba(212,79,79,0.2)",
          display:"flex", alignItems:"center", gap:12, fontFamily:"'Sora',sans-serif",
          marginTop:4, marginBottom:8,
        }}>
          <div style={{ width:36, height:36, borderRadius:10, flexShrink:0,
            background:"rgba(212,79,79,0.12)", border:"1px solid rgba(212,79,79,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <LogOut size={16} color={C.red} strokeWidth={1.8}/>
          </div>
          <span style={{ fontSize:13.5, fontWeight:600, color:C.red }}>Sign Out</span>
        </button>
      </div>
    </>
  );
}

/* ── small toggle ─────────────────────────────────────────────── */
function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{ width:44, height:26, borderRadius:20, padding:3, cursor:"pointer", flexShrink:0,
      background: on ? C.purple : "rgba(255,255,255,0.1)", transition:"background 0.2s" }}>
      <div style={{ width:20, height:20, borderRadius:"50%", background:"#fff", transform:`translateX(${on?18:0}px)`,
        transition:"transform 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }}/>
    </div>
  );
}

/* ── info card helpers for About screens ──────────────────────── */
function InfoSection({ icon:Ic, color, title, children }) {
  return (
    <div style={{ background:C.surf, border:`1px solid ${C.b}`, borderRadius:18, padding:"15px 16px", marginBottom:11 }}>
      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
        <div style={{ width:30, height:30, borderRadius:9, background:`${color}18`, border:`1px solid ${color}28`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Ic size={14} color={color} strokeWidth={2}/>
        </div>
        <span style={{ fontSize:13.5, fontWeight:700, color:C.tp }}>{title}</span>
      </div>
      <div style={{ fontSize:12, color:C.ts, lineHeight:1.7 }}>{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SETTINGS SCREEN
════════════════════════════════════════════════════════════════ */
function SettingsScreen({ onBack }) {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('cf_lang') || "en"; } catch(e){ return "en"; } });
  const [push, setPush] = useState(true);
  const [loc, setLoc]   = useState(true);
  const [sounds, setSounds] = useState(false);
  function pickLang(code){ setLang(code); try{ localStorage.setItem('cf_lang', code); }catch(e){} }
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="Settings" sub="App preferences"/>
      <div style={{ padding:"4px 18px 20px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.tm, letterSpacing:"0.1em", textTransform:"uppercase", margin:"6px 2px 10px" }}>Language</div>
        <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:18 }}>
          {LANGS.map(l => {
            const active = lang === l.code;
            return (
              <div key={l.code} onClick={()=>pickLang(l.code)} style={{ display:"flex", alignItems:"center", gap:12,
                padding:"12px 14px", borderRadius:14, cursor:"pointer",
                background: active ? "rgba(113,40,206,0.12)" : C.surf,
                border:`1px solid ${active ? "rgba(148,88,224,0.5)" : C.b}` }}>
                <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                  background: active ? "rgba(148,88,224,0.22)" : C.surfHi, border:`1px solid ${active ? "rgba(148,88,224,0.45)" : C.b}` }}>
                  <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.08em", color: active ? C.purpleL : C.ts }}>{l.code.toUpperCase()}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:C.tp }}>{l.native}</div>
                  <div style={{ fontSize:10.5, color:C.ts }}>{l.name}</div>
                </div>
                {active && <CheckCircle size={16} color={C.purpleL} strokeWidth={2}/>}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize:10, fontWeight:700, color:C.tm, letterSpacing:"0.1em", textTransform:"uppercase", margin:"6px 2px 10px" }}>Preferences</div>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {[
            { Icon:Bell,   label:"Push Notifications", sub:"Events, alerts & reminders", on:push,   set:()=>setPush(p=>!p),   color:"#C48D38" },
            { Icon:MapPin, label:"Location Services",   sub:"For maps & nearby places",  on:loc,    set:()=>setLoc(p=>!p),    color:"#2A7FAB" },
            { Icon:Radio,  label:"In-app Sounds",       sub:"Taps & notification tones", on:sounds, set:()=>setSounds(p=>!p), color:"#4A8A5A" },
          ].map(({ Icon, label, sub, on, set, color }, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px",
              background:C.surf, border:`1px solid ${C.b}`, borderRadius:14 }}>
              <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, background:`${color}18`,
                border:`1px solid ${color}28`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={15} color={color} strokeWidth={1.8}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.tp }}>{label}</div>
                <div style={{ fontSize:10.5, color:C.ts, marginTop:1 }}>{sub}</div>
              </div>
              <Toggle on={on} onChange={set}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PRIVACY SCREEN
════════════════════════════════════════════════════════════════ */
function PrivacyScreen({ onBack }) {
  const [analytics, setAnalytics] = useState(true);
  const [personalized, setPersonalized] = useState(false);
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="Privacy" sub="Data & permissions"/>
      <div style={{ padding:"4px 18px 20px" }}>
        <InfoSection icon={Shield} color="#4A8A5A" title="Your data, your control">
          CityFlow only collects the information needed to run the app — your account details, saved places and ride history.
          Your data is never sold to third parties.
        </InfoSection>
        <div style={{ fontSize:10, fontWeight:700, color:C.tm, letterSpacing:"0.1em", textTransform:"uppercase", margin:"14px 2px 10px" }}>Data Preferences</div>
        <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:18 }}>
          {[
            { label:"Usage Analytics",        sub:"Help improve CityFlow with anonymous stats", on:analytics,    set:()=>setAnalytics(p=>!p) },
            { label:"Personalised Suggestions", sub:"Recommendations based on your activity",   on:personalized, set:()=>setPersonalized(p=>!p) },
          ].map(({ label, sub, on, set }, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px",
              background:C.surf, border:`1px solid ${C.b}`, borderRadius:14 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.tp }}>{label}</div>
                <div style={{ fontSize:10.5, color:C.ts, marginTop:1 }}>{sub}</div>
              </div>
              <Toggle on={on} onChange={set}/>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10, fontWeight:700, color:C.tm, letterSpacing:"0.1em", textTransform:"uppercase", margin:"6px 2px 10px" }}>Permissions</div>
        <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:18 }}>
          {[["Location","While using the app"],["Notifications","Allowed"],["Camera","Not allowed"]].map(([k,v],i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"13px 14px", background:C.surf, border:`1px solid ${C.b}`, borderRadius:14 }}>
              <span style={{ fontSize:13, fontWeight:600, color:C.tp }}>{k}</span>
              <span style={{ fontSize:11, color:C.ts }}>{v}</span>
            </div>
          ))}
        </div>
        <button style={{ width:"100%", padding:"13px 0", borderRadius:14, cursor:"pointer", fontFamily:FONT,
          background:"rgba(212,79,79,0.08)", border:"1px solid rgba(212,79,79,0.25)", color:C.red, fontSize:12.5, fontWeight:600 }}>
          Request Account Deletion
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ABOUT CITYFLOW
════════════════════════════════════════════════════════════════ */
function AboutCityFlowScreen({ onBack }) {
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="About CityFlow"/>
      <div style={{ padding:"8px 18px 20px" }}>
        <div style={{ textAlign:"center", padding:"14px 0 22px" }}>
          <img src={(window.__resources && window.__resources.logo) || "cityflow_logo.png"} alt="Redemption City of God" style={{ width:76, height:76, objectFit:"contain",
            borderRadius:"50%", boxShadow:"0 0 32px rgba(180,140,220,0.3), 0 0 0 1px rgba(255,255,255,0.1)" }}/>
          <div style={{ fontFamily:CINZEL, fontSize:22, fontWeight:600, color:C.tp, letterSpacing:"0.08em", marginTop:14 }}>CityFlow</div>
          <div style={{ fontSize:11, color:C.ts, marginTop:4 }}>Version 1.0.0 · Build 2026.06</div>
        </div>
        <InfoSection icon={Sparkles} color="#9458E0" title="Credits">
          Designed &amp; built by <span style={{ color:C.tp, fontWeight:600 }}>SerialQuest</span>.
        </InfoSection>
        <InfoSection icon={Heart} color="#D44F4F" title="Acknowledgments">
          To God Almighty, for the grace to build. And to my wife and family — for the patience,
          encouragement and unwavering support that made CityFlow possible.
        </InfoSection>
        <div style={{ textAlign:"center", fontSize:10, color:C.tm, marginTop:16 }}>© 2026 CityFlow · Made for Redemption City</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ABOUT RCCG
════════════════════════════════════════════════════════════════ */
function AboutRCCGScreen({ onBack }) {
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="About RCCG" sub="The Redeemed Christian Church of God"/>
      <div style={{ padding:"4px 18px 20px" }}>
        <InfoSection icon={BookOpen} color="#7128CE" title="History">
          The Redeemed Christian Church of God was founded in 1952 in Lagos, Nigeria, by Pa Josiah Olufemi Akindayomi.
          In 1981, Pastor Enoch Adejare Adeboye became General Overseer, leading a period of extraordinary growth.
          Today the church has parishes in over 190 nations around the world.
        </InfoSection>
        <InfoSection icon={Heart} color="#C48D38" title="Beliefs">
          RCCG holds the Bible as the inspired word of God — teaching salvation through faith in Jesus Christ,
          holiness of life, the power of prayer, evangelism, and practical love for one's neighbour.
        </InfoSection>
        <InfoSection icon={Building2} color="#2A7FAB" title="Structure">
          The church is led by the General Overseer, supported by continental and regional overseers.
          It is organised into provinces, zones, areas and parishes — a structure designed to plant a church
          within reach of every community.
        </InfoSection>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   ABOUT REDEMPTION CITY
════════════════════════════════════════════════════════════════ */
function AboutCityScreen({ onBack, onFacts }) {
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="About Redemption City"/>
      <div style={{ padding:"4px 18px 20px" }}>
        <InfoSection icon={BookOpen} color="#7128CE" title="History">
          What began as Redemption Camp along the Lagos–Ibadan Expressway grew into a full city,
          officially commissioned as Redemption City in 1999. It now hosts over 1 million visitors
          annually during major conventions.
        </InfoSection>
        <InfoSection icon={MapPinned} color="#C48D38" title="Size">
          The city covers over 560 square kilometres with an internal road network of more than 30km —
          larger than some entire states in Nigeria.
        </InfoSection>
        <InfoSection icon={Building2} color="#2A7FAB" title="Facilities">
          Over 3,000 buildings including the 1-million-capacity Main Auditorium, guest houses, schools,
          a hospital, banks, restaurants — plus dedicated power supply and a water treatment plant.
        </InfoSection>
        <div onClick={onFacts} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 15px", cursor:"pointer",
          background:"linear-gradient(148deg,rgba(74,138,90,0.14) 0%,rgba(10,2,24,1) 80%)",
          border:"1px solid rgba(74,138,90,0.3)", borderRadius:16 }}>
          <div style={{ width:36, height:36, borderRadius:11, background:"rgba(74,138,90,0.18)", flexShrink:0,
            border:"1px solid rgba(74,138,90,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Lightbulb size={16} color="#4A8A5A" strokeWidth={1.8}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.tp }}>Fun Facts</div>
            <div style={{ fontSize:10.5, color:C.ts }}>{FUN_FACTS.length} things you didn't know</div>
          </div>
          <ChevronRight size={14} color={C.tm} strokeWidth={2}/>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   CONTACT SUPPORT
════════════════════════════════════════════════════════════════ */
function SupportScreen({ onBack }) {
  const [cat, setCat] = useState(null);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const CATS = ["App bug", "Ride issue", "Payment", "Account", "Other"];
  if (sent) {
    return (
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
        <SubHeader onBack={onBack} title="Contact Support"/>
        <div className="si" style={{ margin:"30px 18px", background:"rgba(61,170,106,0.08)", border:"1px solid rgba(61,170,106,0.3)",
          borderRadius:22, padding:"30px 22px", textAlign:"center" }}>
          <div style={{ width:54, height:54, borderRadius:"50%", background:"rgba(61,170,106,0.15)", margin:"0 auto 14px",
            border:"1px solid rgba(61,170,106,0.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <CheckCircle size={24} color={C.green} strokeWidth={2}/>
          </div>
          <div style={{ fontSize:16, fontWeight:700, color:C.tp, marginBottom:6 }}>Report received</div>
          <div style={{ fontSize:12, color:C.ts, lineHeight:1.6, marginBottom:18 }}>
            Ref: SUP-2026-{String(Math.floor(Math.random()*900)+100)}. Our team responds within 2 hours (8AM–10PM).
          </div>
          <button onClick={()=>{ setSent(false); setCat(null); setMsg(""); }} style={{ padding:"11px 24px", borderRadius:13,
            border:`1px solid ${C.b}`, background:C.surf, color:C.tp, fontSize:12.5, fontWeight:600, fontFamily:FONT, cursor:"pointer" }}>
            Submit another report
          </button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <SubHeader onBack={onBack} title="Contact Support" sub="Report issues & get help"/>
      <div style={{ padding:"4px 18px 20px" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:18 }}>
          {[
            { Icon:Smartphone, label:"CityFlow Helpdesk", sub:"0800-CITYFLOW · App & ride issues", color:"#C48D38" },
            { Icon:Phone,      label:"WhatsApp Support",  sub:"+234 800 CITY 01 · 8AM–10PM",      color:"#4A8A5A" },
            { Icon:Mail,       label:"Email",             sub:"support@cityflow.ng · ~2hr response", color:"#2A7FAB" },
          ].map(({ Icon, label, sub, color }, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", cursor:"pointer",
              background:C.surf, border:`1px solid ${C.b}`, borderRadius:14 }}>
              <div style={{ width:36, height:36, borderRadius:11, flexShrink:0, background:`${color}18`,
                border:`1px solid ${color}28`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={16} color={color} strokeWidth={1.8}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.tp }}>{label}</div>
                <div style={{ fontSize:10.5, color:C.ts, marginTop:1 }}>{sub}</div>
              </div>
              <ChevronRight size={13} color={C.tm} strokeWidth={2}/>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10, fontWeight:700, color:C.tm, letterSpacing:"0.1em", textTransform:"uppercase", margin:"6px 2px 10px" }}>Report an issue</div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:12 }}>
          {CATS.map(c => (
            <div key={c} onClick={()=>setCat(c)} style={{ padding:"7px 13px", borderRadius:18, cursor:"pointer", fontSize:11.5, fontWeight:600,
              background: cat===c ? "rgba(113,40,206,0.15)" : C.surf, color: cat===c ? C.purpleL : C.ts,
              border:`1px solid ${cat===c ? "rgba(148,88,224,0.5)" : C.b}` }}>{c}</div>
          ))}
        </div>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Describe the issue…" rows={4}
          style={{ width:"100%", boxSizing:"border-box", padding:"12px 13px", background:"rgba(255,255,255,0.05)",
            border:`1px solid ${C.b}`, borderRadius:14, fontSize:12.5, color:C.tp, outline:"none", resize:"none",
            fontFamily:FONT, marginBottom:12 }}/>
        <button onClick={()=>{ if (cat && msg.trim()) setSent(true); }} style={{ width:"100%", padding:"13px 0", borderRadius:14,
          border:"none", cursor:"pointer", fontFamily:FONT, fontSize:13, fontWeight:600, color:"#fff",
          background: cat && msg.trim() ? `linear-gradient(135deg,${C.purple},#5A18A8)` : "rgba(113,40,206,0.3)",
          display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
          <Send size={13} strokeWidth={2}/> Submit Report
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MORE SCREEN
══════════════════════════════════════════════════════════ */
function MoreScreen({ onTabChange, onLogout }) {
  const [subScreen, setSubScreen] = useState(null);
  const back = () => setSubScreen(null);

  if (subScreen === "contacts")      return <ContactsScreen       onBack={back}/>;
  if (subScreen === "profile")       return <ProfileScreen        onLogout={onLogout}/>;
  if (subScreen === "settings")      return <SettingsScreen       onBack={back}/>;
  if (subScreen === "notifications") return <NotificationsScreen  onBack={back}/>;
  if (subScreen === "privacy")       return <PrivacyScreen        onBack={back}/>;
  if (subScreen === "aboutapp")      return <AboutCityFlowScreen  onBack={back}/>;
  if (subScreen === "aboutrccg")     return <AboutRCCGScreen      onBack={back}/>;
  if (subScreen === "aboutcity")     return <AboutCityScreen      onBack={back} onFacts={()=>setSubScreen("facts")}/>;
  if (subScreen === "facts")         return <FunFactsScreen       onBack={()=>setSubScreen("aboutcity")}/>;
  if (subScreen === "support")       return <SupportScreen        onBack={back}/>;

  const SECTIONS = [
    { title:"Quick Contacts", items:[
      { id:"contacts",      Icon:PhoneCall,  label:"Quick Contacts",        sub:"All important numbers in one place",      color:"#2A7FAB" },
    ]},
    { title:"Account", items:[
      { id:"profile",       Icon:User,       label:"Profile",               sub:"Your account & history",                  color:"#7128CE" },
      { id:"settings",      Icon:Settings,   label:"Settings",              sub:"Language & preferences",                  color:"#6A6880" },
      { id:"notifications", Icon:Bell,       label:"Notifications",         sub:"Alerts & updates",                        color:"#C48D38" },
      { id:"privacy",       Icon:Shield,     label:"Privacy",               sub:"Data & permissions",                      color:"#4A8A5A" },
    ]},
    { title:"About", items:[
      { id:"aboutapp",      Icon:Smartphone, label:"About CityFlow",        sub:"Version, credits & acknowledgments",      color:"#9458E0" },
      { id:"aboutrccg",     Icon:Church,     label:"About RCCG",            sub:"History, beliefs & structure",            color:"#7128CE" },
      { id:"aboutcity",     Icon:Building2,  label:"About Redemption City", sub:"History, size, facilities & fun facts",   color:"#C48D38" },
      { id:"support",       Icon:HelpCircle, label:"Contact Support",       sub:"Report issues & get help",                color:"#D44F4F" },
    ]},
  ];

  return (
    <>
      <ScreenHeader title="More" sub="Account, info & support"/>
      <div style={{ padding:"8px 18px 16px" }}>
        {SECTIONS.map(sec => (
          <div key={sec.title} style={{ marginBottom:18 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.tm, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 2px 10px" }}>{sec.title}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {sec.items.map(({ id, Icon, label, sub, color }) => (
                <div key={id} onClick={()=>setSubScreen(id)} style={{ display:"flex", alignItems:"center", gap:13,
                  padding:"13px 15px", background:C.surf, border:`1px solid ${C.b}`, borderRadius:16, cursor:"pointer",
                  transition:"background 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.surfHi}
                  onMouseLeave={e=>e.currentTarget.style.background=C.surf}>
                  <div style={{ width:38, height:38, borderRadius:12, flexShrink:0, background:`${color}18`,
                    border:`1px solid ${color}26`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon size={17} color={color} strokeWidth={1.8}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:C.tp, marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:11, color:C.ts }}>{sub}</div>
                  </div>
                  <ChevronRight size={14} color={C.tm} strokeWidth={2}/>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={onLogout} style={{
          width:"100%", padding:"13px 15px", borderRadius:16, cursor:"pointer",
          background:"rgba(212,79,79,0.08)", border:"1px solid rgba(212,79,79,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center", gap:9, fontFamily:FONT }}>
          <LogOut size={15} color={C.red} strokeWidth={1.8}/>
          <span style={{ fontSize:13, fontWeight:600, color:C.red }}>Sign Out</span>
        </button>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   ONBOARDING — language selection + feature intro
────────────────────────────────────────────────────────────── */
const LANGS = [
  { code:"en", name:"English",  native:"English"  },
  { code:"fr", name:"French",   native:"Français" },
  { code:"yo", name:"Yoruba",   native:"Yorùbá"   },
];
const OB_T = {
  en: {
    welcome:"Welcome to CityFlow", chooseLang:"Choose your language", continueBtn:"Continue",
    skip:"Skip", next:"Next", start:"Get Started",
    slides:[
      { title:"Navigate the City",        body:"Live maps, directions and guided tours across Redemption City." },
      { title:"Book CityRides",           body:"Shuttles and rides between camp zones in just a few taps." },
      { title:"Everything in One Place",  body:"Events, lost & found, emergency help and more — all in CityFlow." },
    ],
  },
  fr: {
    welcome:"Bienvenue sur CityFlow", chooseLang:"Choisissez votre langue", continueBtn:"Continuer",
    skip:"Passer", next:"Suivant", start:"Commencer",
    slides:[
      { title:"Naviguez dans la ville",   body:"Cartes en direct, itinéraires et visites guidées dans toute la ville." },
      { title:"Réservez des trajets",     body:"Navettes et trajets entre les zones du camp en quelques gestes." },
      { title:"Tout au même endroit",     body:"Événements, objets trouvés, aide d'urgence et plus — tout dans CityFlow." },
    ],
  },
  yo: {
    welcome:"Káàbọ̀ sí CityFlow", chooseLang:"Yan èdè rẹ", continueBtn:"Tẹ̀síwájú",
    skip:"Fò kọjá", next:"Tókàn", start:"Bẹ̀rẹ̀",
    slides:[
      { title:"Rin ìrìn àjò ìlú",          body:"Àwòrán ilẹ̀ alààyè, ìtọ́sọ́nà àti ìrìn àjò jákèjádò Ìlú Ìràpadà." },
      { title:"Gba ọkọ̀ CityRide",          body:"Ọkọ̀ àjọkò àti ìrìn-àjò láàrín àgbègbè àgọ́ pẹ̀lú ìtẹ̀ díẹ̀." },
      { title:"Ohun gbogbo ní ibì kan",     body:"Ìṣẹ̀lẹ̀, ohun tó sọnù, ìrànlọ́wọ́ pàjáwìrì àti bẹ́ẹ̀ bẹ́ẹ̀ lọ — nínú CityFlow." },
    ],
  },
};
const OB_VISUALS = [
  { Icon:Navigation, color:"#7128CE" },
  { Icon:Car,        color:"#C48D38" },
  { Icon:Zap,        color:"#2A7FAB" },
];

function OnboardingScreen({ onDone }) {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('cf_lang') || "en"; } catch(e){ return "en"; } });
  const [step, setStep] = useState(0); // 0 = language, 1..3 = slides
  const t = OB_T[lang] || OB_T.en;

  function pickLang(code){ setLang(code); try{ localStorage.setItem('cf_lang', code); }catch(e){} }

  return (
    <PhoneShell>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", top:-90, left:"50%", transform:"translateX(-50%)", width:300, height:300,
          background:"radial-gradient(circle,rgba(100,30,190,0.2) 0%,transparent 70%)", pointerEvents:"none" }}/>

        {step === 0 ? (
          /* ── language selection ── */
          <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"0 26px", position:"relative" }}>
            <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <img src={(window.__resources && window.__resources.logo) || "cityflow_logo.png"} alt="Redemption City of God" style={{ width:84, height:84, objectFit:"contain",
                borderRadius:"50%", marginBottom:20, boxShadow:"0 0 36px rgba(180,140,220,0.35), 0 0 0 1px rgba(255,255,255,0.12)" }}/>
              <div style={{ fontFamily:CINZEL, fontSize:24, fontWeight:600, color:C.tp, letterSpacing:"0.06em", marginBottom:6, textAlign:"center" }}>{t.welcome}</div>
              <div style={{ fontSize:12.5, color:C.ts, marginBottom:26 }}>{t.chooseLang}</div>
              <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:11 }}>
                {LANGS.map(l => {
                  const active = lang === l.code;
                  return (
                    <div key={l.code} onClick={()=>pickLang(l.code)} style={{ display:"flex", alignItems:"center", gap:13,
                      padding:"14px 16px", borderRadius:16, cursor:"pointer", transition:"all 0.15s",
                      background: active ? "rgba(113,40,206,0.14)" : C.surf,
                      border:`1.5px solid ${active ? "rgba(148,88,224,0.6)" : C.b}` }}>
                      <div style={{ width:38, height:38, borderRadius:11, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                        background: active ? "rgba(148,88,224,0.22)" : C.surfHi, border:`1px solid ${active ? "rgba(148,88,224,0.45)" : C.b}` }}>
                        <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.08em", color: active ? C.purpleL : C.ts }}>{l.code.toUpperCase()}</span>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.tp }}>{l.native}</div>
                        <div style={{ fontSize:10.5, color:C.ts, marginTop:1 }}>{l.name}</div>
                      </div>
                      <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0,
                        border:`1.5px solid ${active ? C.purpleL : C.tm}`,
                        background: active ? C.purpleL : "transparent",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {active && <Check size={11} color="#fff" strokeWidth={3}/>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ paddingBottom:34 }}>
              <button onClick={()=>setStep(1)} style={{ width:"100%", padding:"14px 0", borderRadius:15, border:"none", cursor:"pointer",
                background:`linear-gradient(135deg,${C.purple} 0%,#5A18A8 100%)`, fontSize:14, fontWeight:600, color:"#fff", fontFamily:FONT,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 8px 28px rgba(100,30,190,0.35)" }}>
                <span>{t.continueBtn}</span><ArrowRight size={15} strokeWidth={2.5}/>
              </button>
            </div>
          </div>
        ) : (
          /* ── feature slides ── */
          <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"0 26px", position:"relative" }}>
            <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:16 }}>
              <span onClick={onDone} style={{ fontSize:12.5, color:C.ts, fontWeight:500, cursor:"pointer", padding:"4px 2px" }}>{t.skip}</span>
            </div>
            <div className="si" key={step} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
              <div style={{ width:110, height:110, borderRadius:34, marginBottom:30, position:"relative",
                background:`${OB_VISUALS[step-1].color}16`, border:`1px solid ${OB_VISUALS[step-1].color}30`,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 20px 60px ${OB_VISUALS[step-1].color}30` }}>
                {React.createElement(OB_VISUALS[step-1].Icon, { size:46, color:OB_VISUALS[step-1].color, strokeWidth:1.5 })}
              </div>
              <div style={{ fontSize:23, fontWeight:700, color:C.tp, lineHeight:1.25, marginBottom:12 }}>{t.slides[step-1].title}</div>
              <div style={{ fontSize:13, color:C.ts, lineHeight:1.7, maxWidth:280 }}>{t.slides[step-1].body}</div>
            </div>
            <div style={{ paddingBottom:34 }}>
              <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20 }}>
                {[1,2,3].map(i => (
                  <div key={i} onClick={()=>setStep(i)} style={{ width: i===step ? 22 : 6, height:6, borderRadius:4, cursor:"pointer",
                    background: i===step ? C.gold : C.tm, transition:"all 0.25s" }}/>
                ))}
              </div>
              <button onClick={()=>{ step < 3 ? setStep(step+1) : onDone(); }} style={{ width:"100%", padding:"14px 0", borderRadius:15,
                border:"none", cursor:"pointer", background:`linear-gradient(135deg,${C.purple} 0%,#5A18A8 100%)`,
                fontSize:14, fontWeight:600, color:"#fff", fontFamily:FONT, display:"flex", alignItems:"center",
                justifyContent:"center", gap:8, boxShadow:"0 8px 28px rgba(100,30,190,0.35)" }}>
                <span>{step < 3 ? t.next : t.start}</span><ArrowRight size={15} strokeWidth={2.5}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

function App() {
  const [screen, setScreen] = useState("splash");
  const [tab,    setTab]    = useState("home");

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ background:"#07010F", minHeight:"100vh", display:"flex", alignItems:"center",
        justifyContent:"center", padding:"32px 16px", fontFamily:FONT }}>

        {/* Demo navigator pills */}
        <div style={{ position:"fixed", top:18, left:"50%", transform:"translateX(-50%)",
          display:"flex", gap:7, zIndex:100, background:"rgba(8,1,26,0.85)",
          backdropFilter:"blur(12px)", padding:"6px 8px", borderRadius:30,
          border:`1px solid ${C.b}` }}>
          {[["splash","Splash"],["onboarding","Intro"],["login","Login"],["app","App"]].map(([s,lbl]) => (
            <button key={s} onClick={()=>{ setScreen(s); if(s==="app") setTab("home"); }} style={{
              padding:"5px 14px", borderRadius:20, border:"none", cursor:"pointer",
              fontSize:11, fontWeight:600, fontFamily:FONT,
              background: screen===s ? C.gold : "rgba(255,255,255,0.07)",
              color: screen===s ? "#08011A" : C.ts,
              transition:"all 0.2s",
            }}>{lbl}</button>
          ))}
        </div>

        {screen==="splash" && <SplashScreen onDone={()=>setScreen("onboarding")}/>}
        {screen==="onboarding" && <OnboardingScreen onDone={()=>setScreen("login")}/>}
        {screen==="login"  && <LoginScreen  onLogin={()=>{ setScreen("app"); setTab("home"); }}/>}
        {screen==="app"    && (
          <AppShell tab={tab} setTab={setTab}>
            {tab==="home"         && <HomeScreen      onTabChange={setTab}/>}
            {tab==="cityride"     && <CityRideScreen/>}
            {tab==="explore"      && <ExploreScreen/>}
            {tab==="lostandfound" && <LostAndFoundScreen/>}
            {tab==="more"         && <MoreScreen        onTabChange={setTab} onLogout={()=>setScreen("login")}/>}
          </AppShell>
        )}
      </div>
    </>
  );
}

if (typeof module !== "undefined") { module.exports = { CityFlowApp: App }; }
if (typeof window !== "undefined") { window.CityFlowApp = App; }

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
