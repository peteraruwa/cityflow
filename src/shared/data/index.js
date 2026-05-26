import { Building2, Home, Leaf, Coffee, Car, BookOpen } from 'lucide-react-native';

export const FOUND_ITEMS = [
  { id:1, item:'Samsung Galaxy S21', category:'Electronics', desc:'Black Samsung phone with cracked screen protector found near the water fountain at Gate B.', location:'Main Auditorium — Gate B', date:'Dec 15, 2024', status:'pending', ref:'LF-2024-0041' },
  { id:2, item:'Brown Leather Wallet', category:'Wallet/Purse', desc:'Brown leather bifold wallet containing some cash and a national ID card.', location:'Guest House B — Reception', date:'Dec 14, 2024', status:'claimed', ref:'LF-2024-0039' },
  { id:3, item:'Blue Nike Backpack', category:'Bag/Luggage', desc:'Medium-sized blue Nike backpack with several document folders inside.', location:'Car Park C — Row 4', date:'Dec 15, 2024', status:'pending', ref:'LF-2024-0042' },
  { id:4, item:'Gold Analog Wristwatch', category:'Jewellery', desc:'Gold-tone Fossil analog wristwatch with a brown leather strap.', location:'Prayer Mountain — Main Steps', date:'Dec 13, 2024', status:'pending', ref:'LF-2024-0037' },
  { id:5, item:'Apple AirPods Pro Case', category:'Electronics', desc:"White AirPods Pro charging case (no earbuds). Initials 'T.K.' engraved on the lid.", location:'Camp Restaurant Area', date:'Dec 14, 2024', status:'claimed', ref:'LF-2024-0038' },
  { id:6, item:"Red Children's Bible", category:'Book/Document', desc:"Red hardcover children's Bible. Name 'Grace Okafor' written on the inside cover.", location:"Children's Pavilion", date:'Dec 16, 2024', status:'pending', ref:'LF-2024-0043' },
];

export const EXPLORE_PLACES = [
  { iconName:'Building2', name:'Main Auditorium',    cat:'Worship',   dist:'0.2km', color:'#6B35C0', rating:'4.9' },
  { iconName:'Home',      name:'Guest House A',       cat:'Stay',      dist:'0.3km', color:'#2A7FAB', rating:'4.7' },
  { iconName:'Home',      name:'Guest House B',       cat:'Stay',      dist:'0.5km', color:'#2A7FAB', rating:'4.5' },
  { iconName:'Leaf',      name:'Prayer Garden',       cat:'Spiritual', dist:'0.6km', color:'#4A8A5A', rating:'4.8' },
  { iconName:'Coffee',    name:'Camp Restaurant',     cat:'Dining',    dist:'0.3km', color:'#C48D38', rating:'4.3' },
  { iconName:'Coffee',    name:'Bread of Life Café',  cat:'Dining',    dist:'0.7km', color:'#C48D38', rating:'4.6' },
  { iconName:'Car',       name:'Main Car Park',       cat:'Transport', dist:'0.1km', color:'#6A6880', rating:'3.9' },
  { iconName:'BookOpen',  name:'Camp Bookshop',       cat:'Retail',    dist:'0.5km', color:'#9B5E3A', rating:'4.4' },
  { iconName:'Building2', name:"Children's Pavilion", cat:'Worship',   dist:'0.8km', color:'#6B35C0', rating:'4.6' },
  { iconName:'Leaf',      name:'Prayer Mountain',     cat:'Spiritual', dist:'1.2km', color:'#4A8A5A', rating:'4.9' },
];

export const RIDE_TYPES = [
  { id:'shuttle',  label:'Camp Shuttle', seats:12, fare:'₦150', eta:'8 min', note:'Shared bus between all zones' },
  { id:'standard', label:'Standard',     seats:4,  fare:'₦450', eta:'5 min', note:'Comfortable sedan' },
  { id:'premium',  label:'Premium',      seats:4,  fare:'₦850', eta:'3 min', note:'Priority pickup · AC guaranteed' },
];

export const RECENT_DEST = ['Main Auditorium','Guest House A','Prayer Mountain','Camp Bookshop'];

export const CATS_LOST = ['Electronics','Clothing','Bag/Luggage','Documents','Wallet','Jewellery','Book','Other'];
export const LOCATIONS = ['Main Auditorium','Guest House A','Guest House B','Prayer Garden','Camp Restaurant','Car Park A','Car Park B','Car Park C','Bookshop','Prayer Mountain',"Children's Pavilion",'Main Gate','Other'];

export const BUSINESSES = [
  { cat:'Restaurants', iconName:'Utensils', color:'#C48D38', items:[
    { name:'Camp Restaurant',       desc:'Main dining hall — breakfast, lunch & dinner', hours:'7AM–9PM',   rating:'4.3', phone:'0800-CAMP-EAT' },
    { name:'Bread of Life Café',    desc:'Coffee, snacks, light meals & pastries',       hours:'6AM–8PM',   rating:'4.6', phone:'0800-CAFE-01' },
    { name:'Manna Fast Food',       desc:'Burgers, suya, jollof rice & shawarma',        hours:'10AM–10PM', rating:'4.1', phone:'0800-MANNA-01' },
  ]},
  { cat:'Hotels & Guest Houses', iconName:'Hotel', color:'#2A7FAB', items:[
    { name:'Guest House A',         desc:'Standard rooms · 84 units · AC & WiFi',        hours:'24hrs', rating:'4.7', phone:'0800-GHOUSE-A' },
    { name:'Guest House B',         desc:'Economy rooms · 120 units · shared facilities',hours:'24hrs', rating:'4.5', phone:'0800-GHOUSE-B' },
    { name:'VIP Guest Lodge',       desc:'Premium suites · limited availability',         hours:'24hrs', rating:'4.9', phone:'0800-VIP-LOD' },
  ]},
  { cat:'Banks & ATMs', iconName:'Banknote', color:'#4A8A5A', items:[
    { name:'Access Bank Branch',    desc:'Full service banking · ATM available',          hours:'8AM–4PM', rating:'4.0', phone:'0700-ACCESS' },
    { name:'GTBank ATM',            desc:'24-hour ATM — near Main Auditorium',            hours:'24hrs',   rating:'4.2', phone:'0802-900-5900' },
    { name:'POS Centre',            desc:'Mobile money transfers & bill payments',        hours:'8AM–8PM', rating:'4.4', phone:'0800-POS-001' },
  ]},
  { cat:'Shops & Services', iconName:'Store', color:'#9B5E3A', items:[
    { name:'Camp Bookshop',         desc:'Bibles, devotionals, souvenirs & stationery',  hours:'9AM–7PM', rating:'4.4', phone:'0800-BOOKS-01' },
    { name:'City Pharmacy',         desc:'OTC drugs, first aid & health products',        hours:'7AM–9PM', rating:'4.6', phone:'0800-PHARMA-1' },
    { name:'Redemption Supermart',  desc:'Groceries, beverages, toiletries & more',      hours:'8AM–9PM', rating:'4.2', phone:'0800-MART-001' },
  ]},
];

export const FUN_FACTS = [
  { fact:'Redemption City was officially commissioned in 1999 and now hosts over 1 million visitors annually during major conventions.', icon:'🏙️' },
  { fact:'The Redemption Camp covers an area of over 560 square kilometres — larger than some entire states in Nigeria!', icon:'🗺️' },
  { fact:'The Main Auditorium at Redemption Camp has a seating capacity of over 1 million people, one of the largest in the world.', icon:'🏟️' },
  { fact:'Redemption City has its own dedicated power supply, water treatment plant, and internal road network of over 30km.', icon:'⚡' },
  { fact:'The Redemption Camp Expressway was constructed specifically to ease access — it\'s over 21km long and connects directly to the Lagos–Ibadan Expressway.', icon:'🛣️' },
  { fact:'There are over 3,000 buildings inside Redemption City including churches, schools, banks, hospitals, and hotels.', icon:'🏘️' },
  { fact:'CityFlow processes an average of 4,200 ride bookings every week during peak convention periods.', icon:'🚗' },
  { fact:'Prayer Mountain within the camp grounds records the highest visitor traffic in the early morning hours — typically between 4AM and 6AM.', icon:'⛰️' },
];

export const CONTACTS_DATA = [
  { group:'Emergency', color:'#D44F4F', contacts:[
    { name:'General Emergency',    phone:'112',               iconName:'Siren',       note:'Free call, works without airtime' },
    { name:'Ambulance',            phone:'199',               iconName:'Ambulance',   note:'Medical emergencies' },
    { name:'Police',               phone:'112 / 07055201816', iconName:'Shield',      note:'Crime & security' },
    { name:'Fire Service',         phone:'190',               iconName:'Flame',       note:'Fire & rescue' },
    { name:'Road Safety (FRSC)',   phone:'122',               iconName:'TrafficCone', note:'Traffic accidents' },
  ]},
  { group:'Camp Administration', color:'#7128CE', contacts:[
    { name:'Camp Office (Main)',   phone:'0800-RCCG-HQ',     iconName:'Building2',   note:'General enquiries' },
    { name:'Security Desk',        phone:'0800-CAMP-SEC',    iconName:'Shield',      note:'24-hour security operations' },
    { name:'Lost & Found Office',  phone:'0800-LF-CAMP',     iconName:'Package',     note:'Gate B, Main Auditorium' },
    { name:'Medical Centre',       phone:'0800-MED-CAMP',    iconName:'Ambulance',   note:'On-site clinic — 24hrs' },
  ]},
  { group:'Hospitality', color:'#2A7FAB', contacts:[
    { name:'Guest House A',        phone:'0800-GHOUSE-A',    iconName:'Hotel',       note:'Bookings & reception' },
    { name:'Guest House B',        phone:'0800-GHOUSE-B',    iconName:'Hotel',       note:'Bookings & reception' },
    { name:'Camp Restaurant',      phone:'0800-CAMP-EAT',    iconName:'Utensils',    note:'Reservations & catering' },
  ]},
  { group:'CityFlow Support', color:'#C48D38', contacts:[
    { name:'CityFlow Helpdesk',    phone:'0800-CITYFLOW',    iconName:'Smartphone',  note:'App support & ride issues' },
    { name:'CityFlow WhatsApp',    phone:'+234 800 CITY 01', iconName:'Phone',       note:'Chat support — 8AM–10PM' },
    { name:'Email Support',        phone:'support@cityflow.ng', iconName:'Mail',     note:'Response within 2 hours' },
  ]},
];

export const QUIZ_QUESTIONS = [
  { q:'What is the seating capacity of the Main Auditorium at Redemption Camp?', options:['500,000','1 million','2 million','250,000'], correct:1 },
  { q:'What year was Redemption City officially commissioned?', options:['1989','1993','1999','2005'], correct:2 },
  { q:'How large is Redemption City in square kilometres?', options:['120 km²','350 km²','560 km²','800 km²'], correct:2 },
  { q:'How long is the Redemption Camp Expressway?', options:['5km','10km','15km','21km'], correct:3 },
  { q:'Which emergency number works even without airtime credit in Nigeria?', options:['199','190','112','122'], correct:2 },
  { q:'What is the name of the spiritual retreat location inside the camp?', options:['Holy Hill','Prayer Mountain','Mount Zion','Faith Peak'], correct:1 },
  { q:'Approximately how many buildings are inside Redemption City?', options:['500+','1,000+','3,000+','10,000+'], correct:2 },
  { q:"What does 'RCCG' stand for in the context of Redemption City?", options:['Royal Christian Church of God','Redeemed Christian Church of God','Reformed Church of Christ Global','Redemption City Church of Grace'], correct:1 },
];

export const TOUR_STOPS = [
  { iconName:'Building2', name:'Main Auditorium',    desc:'Start your tour at the iconic main worship hall — seats over 1 million worshippers.',      color:'#6B35C0', dist:'0.2km', duration:'20 min' },
  { iconName:'Leaf',      name:'Prayer Garden',       desc:'A beautifully landscaped garden — ideal for quiet meditation and morning prayers.',          color:'#4A8A5A', dist:'0.6km', duration:'15 min' },
  { iconName:'Coffee',    name:'Bread of Life Café',  desc:'Refresh yourself with coffee, pastries, and light bites in a serene garden setting.',        color:'#C48D38', dist:'0.7km', duration:'20 min' },
  { iconName:'Leaf',      name:'Prayer Mountain',     desc:'The spiritual high point of camp — breathtaking views, rated 4.9★ by all visitors.',         color:'#4A8A5A', dist:'1.2km', duration:'30 min' },
  { iconName:'Home',      name:'Guest House A',        desc:'See the accommodation facilities — 84 rooms with AC & WiFi, the heart of camp hospitality.',  color:'#2A7FAB', dist:'0.3km', duration:'10 min' },
  { iconName:'BookOpen',  name:'Camp Bookshop',        desc:'Browse Bibles, devotionals, and souvenirs at the largest Christian bookstore on camp.',       color:'#9B5E3A', dist:'0.5km', duration:'15 min' },
  { iconName:'Building2', name:"Children's Pavilion",  desc:"A dedicated 4.6★-rated space for younger visitors — games, worship, and activities.",         color:'#6B35C0', dist:'0.8km', duration:'15 min' },
  { iconName:'Car',       name:'Main Car Park',         desc:'End your tour back at the main car park — a perfect debrief point before your next visit.',   color:'#6A6880', dist:'0.1km', duration:'5 min'  },
];
