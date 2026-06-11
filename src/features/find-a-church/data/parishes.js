// src/features/find-a-church/data/parishes.js
// Find-a-Church uses the Redemption City navigation directory as its source of truth.

import { CAMP_LOCATIONS } from '../../navigation/data/locations';

const COLORS = ['#6B35C0', '#2A7FAB', '#4A8A5A', '#C48D38', '#8B5CF6', '#AB3E5B'];

const MOCK_MINISTRY_DETAILS = {
  new_arena_auditorium: {
    pastor: 'Pastor Daniel Adeyemi',
    assistant: 'Pastor (Mrs) Grace Adeyemi',
    phone: '+234 802 100 4101',
    email: 'newarena@cityflow.app',
    serviceTimes: 'Sun 8:00 AM, Wed 6:00 PM',
    zone: 'Arena District',
  },
  redemption_city_old_arena: {
    pastor: 'Pastor Samuel Oladipo',
    assistant: 'Pastor Miriam Oladipo',
    email: 'oldarena@cityflow.app',
    serviceTimes: 'Sun 7:30 AM, Tue 6:00 PM',
    zone: 'Old Arena',
  },
  open_heavens_international_centre: {
    pastor: 'Pastor Femi Akinwale',
    assistant: 'Pastor Ruth Akinwale',
    email: 'ohic@cityflow.app',
    serviceTimes: 'Sun 9:00 AM, Thu 6:00 PM',
    zone: 'International Centre',
  },
  king_is_coming_model_parish: {
    pastor: 'Pastor Joshua Bamidele',
    assistant: 'Pastor Deborah Bamidele',
    phone: '+234 803 210 4104',
    email: 'kingiscoming@cityflow.app',
    serviceTimes: 'Sun 8:30 AM, Wed 6:00 PM',
    zone: 'Model Parish Zone',
  },
  rccg_house_of_favour: {
    pastor: 'Pastor Elizabeth Adeleke',
    assistant: 'Pastor Tunde Adeleke',
    phone: '+234 803 456 7890',
    email: 'houseoffavour@cityflow.app',
    serviceTimes: 'Sun 8:00 AM, Tue 6:00 PM',
    zone: 'Favour Court',
  },
  rccg_expression_church: {
    pastor: 'Pastor Michael Okafor',
    assistant: 'Pastor Chidinma Okafor',
    phone: '+234 804 567 8901',
    email: 'expression@cityflow.app',
    serviceTimes: 'Sun 10:00 AM, Fri 6:30 PM',
    zone: 'Expression Hub',
  },
  rccg_amazing_grace_assembly: {
    pastor: 'Pastor Caleb Obi',
    assistant: 'Pastor Ifeoma Obi',
    phone: '+234 814 567 8901',
    email: 'amazinggrace@cityflow.app',
    serviceTimes: 'Sun 8:00 AM, Thu 6:00 PM',
    zone: 'Grace Avenue',
  },
  rccg_open_heaven_parish_church: {
    pastor: 'Pastor Hannah Bello',
    assistant: 'Pastor Ibrahim Bello',
    phone: '+234 813 456 7890',
    email: 'openheavenchurch@cityflow.app',
    serviceTimes: 'Sun 9:00 AM, Wed 6:00 PM',
    zone: 'Open Heaven Close',
  },
  city_of_kings_parish: {
    pastor: 'Pastor Joseph Eze',
    assistant: 'Pastor Sarah Eze',
    phone: '+234 818 901 2345',
    email: 'cityofkings@cityflow.app',
    serviceTimes: 'Sun 8:30 AM, Tue 6:30 PM',
    zone: 'Kings Court',
  },
  gate_of_heaven_church: {
    pastor: 'Pastor Ruth Akinyemi',
    assistant: 'Pastor Stephen Akinyemi',
    phone: '+234 817 890 1234',
    email: 'gateofheaven@cityflow.app',
    serviceTimes: 'Sun 8:00 AM, Fri 6:00 PM',
    zone: 'Gate Axis',
  },
  resurrection_parish: {
    pastor: 'Pastor Peter Adebayo',
    assistant: 'Pastor Naomi Adebayo',
    phone: '+234 810 123 4567',
    email: 'resurrection@cityflow.app',
    serviceTimes: 'Sun 7:30 AM, Wed 6:30 PM',
    zone: 'Resurrection Lane',
  },
  divine_favour_parish: {
    pastor: 'Pastor Mercy Akpan',
    assistant: 'Pastor Emmanuel Akpan',
    phone: '+234 809 012 3456',
    email: 'divinefavour@cityflow.app',
    serviceTimes: 'Sun 8:00 AM, Thu 6:30 PM',
    zone: 'Divine Favour Close',
  },
  the_youth_place: {
    pastor: 'Pastor Temitayo Martins',
    assistant: 'Pastor Kemi Martins',
    phone: '+234 805 678 9012',
    email: 'youthplace@cityflow.app',
    serviceTimes: 'Sun 4:00 PM, Sat 5:00 PM',
    zone: 'Youth Centre',
  },
  love_assembly_parish: {
    pastor: 'Pastor Grace Ogunleye',
    assistant: 'Pastor Wale Ogunleye',
    phone: '+234 807 890 1234',
    email: 'loveassembly@cityflow.app',
    serviceTimes: 'Sun 8:30 AM, Wed 6:00 PM',
    zone: 'Love Assembly Road',
  },
  open_heaven_parish: {
    pastor: 'Pastor Esther Nwachukwu',
    assistant: 'Pastor David Nwachukwu',
    phone: '+234 811 234 5678',
    email: 'openheavenparish@cityflow.app',
    serviceTimes: 'Sun 9:00 AM, Tue 6:00 PM',
    zone: 'Open Heaven Axis',
  },
  glory_house: {
    pastor: 'Pastor Timothy Yusuf',
    assistant: 'Pastor Aisha Yusuf',
    phone: '+234 812 345 6789',
    email: 'gloryhouse@cityflow.app',
    serviceTimes: 'Sun 8:00 AM, Thu 6:00 PM',
    zone: 'Glory House Street',
  },
  messiah_praise_sanctuary: {
    pastor: 'Pastor Richard Owoseni',
    assistant: 'Pastor (Mrs) Bola Owoseni',
    phone: '+234 802 345 6789',
    email: 'messiahpraise@cityflow.app',
    serviceTimes: 'Sun 4:00 PM, Fri 6:30 PM',
    zone: 'Youth Church Axis',
  },
};

function initials(name) {
  return name
    .replace(/The Redeemed Christian Church Of God,?\s*/i, 'RCCG ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !['the', 'of', 'and'].includes(word.toLowerCase()))
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function fallbackPhone(index) {
  return `+234 80${index + 2} 410 ${String(1100 + index).slice(1)}`;
}

export const PARISHES = CAMP_LOCATIONS
  .filter((location) => location.category === 'church')
  .map((location, index) => {
    const detail = MOCK_MINISTRY_DETAILS[location.id] || {};
    const subcategory = location.subcategory
      ? location.subcategory.replace(/_/g, ' ')
      : 'church';

    return {
      ...location,
      shortName: location.shortName || initials(location.name),
      pastor: detail.pastor || 'Pastor CityFlow Parish Lead',
      assistant: detail.assistant || 'Assistant Pastor CityFlow',
      phone: location.phone || detail.phone || fallbackPhone(index),
      email: detail.email || `${location.id}@cityflow.app`,
      serviceTimes: detail.serviceTimes || 'Sun 8:00 AM, Wed 6:00 PM',
      address: location.address || location.description || 'Redemption City',
      zone: detail.zone || `${subcategory.charAt(0).toUpperCase()}${subcategory.slice(1)} Zone`,
      color: COLORS[index % COLORS.length],
      coordinates: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
    };
  });
