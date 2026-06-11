// src/features/navigation/data/locations.js
// Redemption City places directory for CityFlow navigation.

const makeLocation = (id, name, category, lat, lng, description, extra = {}) => ({
  id,
  name,
  shortName: extra.shortName || name,
  icon: extra.icon || category.slice(0, 2).toUpperCase(),
  category,
  lat,
  lng,
  description,
  phone: extra.phone,
  address: extra.address,
  subcategory: extra.subcategory,
});

export const CAMP_LOCATIONS = [
  makeLocation('new_arena_auditorium', 'NEW ARENA Auditorium', 'church', 6.4531, 3.3958, 'New generation worship arena', { subcategory: 'auditorium', icon: 'CH' }),
  makeLocation('redemption_city_old_arena', 'Redemption City Old Arena', 'church', 6.4525, 3.3950, 'Original worship auditorium', { subcategory: 'auditorium', phone: '09022024174', icon: 'CH' }),
  makeLocation('open_heavens_international_centre', 'Open Heavens International Centre', 'church', 6.4540, 3.3965, 'International worship and conference centre', { subcategory: 'worship_centre', phone: '08169245246', icon: 'CH' }),
  makeLocation('king_is_coming_model_parish', 'The Redeemed Christian Church Of God, King Is Coming Model Parish', 'church', 6.4515, 3.3945, 'Model parish church', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('rccg_house_of_favour', 'RCCG, House of Favour Church', 'church', 6.4505, 3.3938, 'House of Favour Parish', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('rccg_expression_church', 'RCCG, The Expression Church', 'church', 6.4520, 3.3948, 'The Expression Church', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('rccg_amazing_grace_assembly', 'RCCG, Amazing Grace Assembly Church', 'church', 6.4510, 3.3942, 'Amazing Grace Assembly Parish', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('rccg_open_heaven_parish_church', 'RCCG, Open Heaven Parish Church', 'church', 6.4535, 3.3960, 'Open Heaven Parish', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('city_of_kings_parish', 'The Redeemed Christian Church Of God, City Of Kings Parish', 'church', 6.4508, 3.3935, 'City of Kings Parish', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('gate_of_heaven_church', 'The Redeemed Christian Church Of God, Gate Of Heaven Church', 'church', 6.4522, 3.3952, 'Gate of Heaven Church', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('resurrection_parish', 'The Redeemed Christian Church Of God, Resurrection Parish', 'church', 6.4512, 3.3940, 'Resurrection Parish', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('divine_favour_parish', 'The Redeemed Christian Church Of God, Divine Favour Parish', 'church', 6.4518, 3.3946, 'Divine Favour Parish', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('the_youth_place', 'The Redeemed Christian Church Of God, The Youth Place', 'church', 6.4528, 3.3955, 'Youth Church', { subcategory: 'youth', icon: 'CH' }),
  makeLocation('love_assembly_parish', 'The Redeemed Christian Church Of God, Love Assembly Parish', 'church', 6.4502, 3.3930, 'Love Assembly Parish', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('open_heaven_parish', 'The Redeemed Christian Church Of God, Open Heaven Parish', 'church', 6.4538, 3.3962, 'Open Heaven Parish', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('glory_house', 'The Redeemed Christian Church Of God, Glory House', 'church', 6.4526, 3.3953, 'Glory House Parish', { subcategory: 'parish', icon: 'CH' }),
  makeLocation('messiah_praise_sanctuary', 'The Redeemed Christian Church Of God, Messiah Praise Sanctuary', 'church', 6.4530, 3.3956, 'Messiah Praise Sanctuary (Youth Church)', { subcategory: 'youth', icon: 'CH' }),

  makeLocation('redemption_resort', 'Redemption Resort', 'accommodation', 6.4550, 3.3980, 'Luxury resort within Redemption Camp', { subcategory: 'resort', phone: '08067592352', icon: 'ST' }),
  makeLocation('moses_apartment', 'Moses Apartment', 'accommodation', 6.4545, 3.3970, 'Self-contained apartments', { subcategory: 'apartment', icon: 'ST' }),
  makeLocation('shiloh_apartments', 'Shiloh Apartments', 'accommodation', 6.4542, 3.3968, 'Comfortable apartments for visitors', { subcategory: 'apartment', icon: 'ST' }),
  makeLocation('gethsemane_apartment', 'Gethsemane Apartment', 'accommodation', 6.4538, 3.3964, 'Apartments on Canaan Land Road', { subcategory: 'apartment', icon: 'ST' }),
  makeLocation('2000_chalet_project', '2000 Chalet Project', 'accommodation', 6.4560, 3.3990, 'Massive chalet accommodation project', { subcategory: 'chalet', icon: 'ST' }),
  makeLocation('overflow_executive_chalets', 'The Overflow Executive Chalets', 'accommodation', 6.4555, 3.3985, 'Executive chalet accommodation', { subcategory: 'chalet', icon: 'ST' }),
  makeLocation('jordan_executive_chalets', 'Jordan Executive Chalets', 'accommodation', 6.4552, 3.3982, 'Executive chalets', { subcategory: 'chalet', icon: 'ST' }),
  makeLocation('bethel_suites_event_center', 'BETHEL SUITES AND EVENT CENTER', 'accommodation', 6.4548, 3.3975, 'Suites and event centre', { subcategory: 'suite', icon: 'ST' }),
  makeLocation('international_guest_house', 'International Guest House', 'accommodation', 6.4500, 3.3920, 'Guest house for international visitors', { subcategory: 'guest_house', phone: '08058047900', icon: 'ST' }),
  makeLocation('senior_pastors_lodge', "Senior Pastor's Lodge", 'accommodation', 6.4495, 3.3915, 'Official residence of the General Overseer', { subcategory: 'lodge', icon: 'ST' }),
  makeLocation('masters_court_lodge', "The Master's Court Lodge", 'accommodation', 6.4540, 3.3965, 'Premium lodge', { subcategory: 'lodge', icon: 'ST' }),
  makeLocation('pa_sg_elton_chalet_dormitory', 'Pa S.G. Elton Chalet and Dormitory', 'accommodation', 6.4565, 3.3995, 'Chalet and dormitory accommodation', { subcategory: 'chalet', icon: 'ST' }),
  makeLocation('white_house_suites', 'White House Suites', 'accommodation', 6.4558, 3.3988, 'Premium suites', { subcategory: 'suite', icon: 'ST' }),
  makeLocation('shepherds_place_apartment', "Shepherd's Place Apartment", 'accommodation', 6.4535, 3.3962, 'Apartment accommodation', { subcategory: 'apartment', icon: 'ST' }),
  makeLocation('wave_of_glory_apartments', 'Wave of Glory Apartments', 'accommodation', 6.4546, 3.3972, 'Modern apartments', { subcategory: 'apartment', icon: 'ST' }),
  makeLocation('rccg_london_house', 'RCCG London House', 'accommodation', 6.4532, 3.3959, 'London House accommodation', { subcategory: 'guest_house', icon: 'ST' }),
  makeLocation('abuja_hostel', 'Abuja Hostel, Redemption Camp', 'accommodation', 6.4520, 3.3945, 'Hostel accommodation', { subcategory: 'hostel', icon: 'ST' }),
  makeLocation('comfort_palace', 'Comfort Palace', 'accommodation', 6.4544, 3.3967, 'Apartment accommodation', { subcategory: 'apartment', address: 'RF78+77P, Diligence Rd, Omu 110113, Ogun State', icon: 'ST' }),

  makeLocation('tree_of_life_estate', 'Tree of Life Estate', 'estate', 6.4570, 3.4000, 'Residential estate', { subcategory: 'residential', icon: 'ES' }),
  makeLocation('goshen_estate', 'Goshen Estate', 'estate', 6.4562, 3.3992, 'Residential estate', { subcategory: 'residential', icon: 'ES' }),

  makeLocation('redeemers_health_village', "Redeemer's Health Village", 'medical', 6.4480, 3.3900, 'Major medical facility', { subcategory: 'hospital', phone: '07048006499', icon: 'MD' }),
  makeLocation('rccg_maternity_centre', 'RCCG Maternity Centre', 'medical', 6.4490, 3.3910, 'Maternity and child care', { subcategory: 'maternity', phone: '09112926035', icon: 'MD' }),
  makeLocation('redeemers_medical_centre', "Redeemer's Medical Centre", 'medical', 6.4485, 3.3905, 'General medical services', { subcategory: 'clinic', icon: 'MD' }),

  makeLocation('peaceville_international_academy', 'Peaceville International Academy', 'education', 6.4580, 3.4010, 'International school', { subcategory: 'school', icon: 'ED' }),
  makeLocation('redeemers_high_school', "Redeemer's High School", 'education', 6.4575, 3.4005, 'Secondary school', { subcategory: 'school', icon: 'ED' }),
  makeLocation('redeemed_christian_bible_college', 'The Redeemed Christian Bible College, Main-Campus', 'education', 6.4550, 3.3980, 'Bible college and theological training', { subcategory: 'bible_college', icon: 'ED' }),
  makeLocation('school_of_disciples', 'SCHOOL OF DISCIPLES', 'education', 6.4545, 3.3975, 'Discipleship training school', { subcategory: 'training', phone: '07035400926', icon: 'ED' }),
  makeLocation('redeemers_university_staff_quarters', 'Redeemers University Staff Quarters', 'education', 6.4585, 3.4015, 'University staff housing', { subcategory: 'staff_quarters', icon: 'ED' }),
  makeLocation('christ_redeemer_nursery_primary_school', 'Christ Redeemer Nursery & Primary School (CRNPS)', 'education', 6.4495, 3.3915, 'Nursery and primary school', { subcategory: 'school', icon: 'ED' }),

  makeLocation('emmanuel_park', 'Emmanuel Park', 'park', 6.4600, 3.4020, 'Recreational park', { subcategory: 'recreation', phone: '09161934554', icon: 'PK' }),
  makeLocation('prayer_and_meditation_centre', 'PRAYER AND MEDITATION CENTRE', 'park', 6.4475, 3.3895, 'Prayer and meditation grounds', { subcategory: 'prayer_ground', icon: 'PK' }),

  makeLocation('rccg_national_secretariat', 'RCCG National Secretariat', 'administration', 6.4505, 3.3925, 'National headquarters', { subcategory: 'secretariat', icon: 'AD' }),
  makeLocation('rccg_house_fellowship_department', 'RCCG National Department of House Fellowship', 'administration', 6.4515, 3.3938, 'House Fellowship department', { subcategory: 'department', address: 'RF66+F37 RCCG National Department of House Fellowship Redemption Camp, Mowe, Pakuro 110113', icon: 'AD' }),
  makeLocation('rccg_workers_fund', 'RCCG Workers Fund', 'administration', 6.4510, 3.3935, "Workers' fund office", { subcategory: 'office', icon: 'AD' }),
  makeLocation('rccg_electrical_department', 'RCCG, Electrical Department', 'administration', 6.4500, 3.3928, 'Electrical services department', { subcategory: 'department', phone: '08066319471', address: 'RF95+G29, Genesis Rd, Pakuro 110113', icon: 'AD' }),
  makeLocation('african_missions_global_secretariat', 'African Missions Global Secretariat', 'administration', 6.4495, 3.3920, 'Missions secretariat', { subcategory: 'secretariat', icon: 'AD' }),
  makeLocation('dare_adeboye_innovation_hub', 'Dare Adeboye Innovation Hub', 'administration', 6.4525, 3.3950, 'Innovation and technology hub', { subcategory: 'innovation_hub', icon: 'AD' }),

  makeLocation('car_park_c', 'Car Park C', 'parking', 6.4520, 3.3945, 'Parking area C', { subcategory: 'car_park', icon: 'PA' }),
  makeLocation('car_park_b', 'Car Park B', 'parking', 6.4518, 3.3943, 'Parking area B', { subcategory: 'car_park', icon: 'PA' }),

  makeLocation('canaan_land_market', 'Canaan Land Market', 'shopping', 6.4485, 3.3908, 'Market within the camp', { subcategory: 'market', icon: 'SH' }),
  makeLocation('crm_supermarket', 'CRM Supermarket', 'shopping', 6.4492, 3.3912, 'Supermarket', { subcategory: 'supermarket', icon: 'SH' }),
  makeLocation('crm_bookshop', 'CRM Bookshop', 'shopping', 6.4490, 3.3910, 'Christian bookstore', { subcategory: 'bookshop', icon: 'SH' }),
  makeLocation('crm_pharmacy', 'CRM Pharmacy', 'shopping', 6.4493, 3.3913, 'Pharmacy', { subcategory: 'pharmacy', icon: 'SH' }),

  makeLocation('rccg_national_kitchen', 'RCCG National Kitchen', 'dining', 6.4505, 3.3930, 'Central kitchen facility', { subcategory: 'catering', icon: 'FD' }),

  makeLocation('dove_television', 'Dove Television', 'media', 6.4555, 3.3985, 'Christian television station', { subcategory: 'tv_station', phone: '08029657760', address: 'DOVE TELEVISION, 1 DOVE AVENUE, REDEMPTION CAMP, mowe, Owode 110115', icon: 'ME' }),
  makeLocation('rccg_post_office', 'RCCG POST OFFICE', 'media', 6.4508, 3.3932, 'Postal services', { subcategory: 'post_office', icon: 'ME' }),

  makeLocation('gtb', 'GTB (Guaranty Trust Bank)', 'bank', 6.4500, 3.3925, 'Bank branch', { subcategory: 'bank', icon: 'BK' }),
  makeLocation('zenith_bank', 'Zenith Bank', 'bank', 6.4498, 3.3923, 'Bank branch', { subcategory: 'bank', icon: 'BK' }),
  makeLocation('fcmb', 'FCMB (First City Monument Bank)', 'bank', 6.4496, 3.3921, 'Bank branch', { subcategory: 'bank', icon: 'BK' }),
  makeLocation('uba', 'UBA (United Bank for Africa)', 'bank', 6.4494, 3.3919, 'Bank branch', { subcategory: 'bank', icon: 'BK' }),
  makeLocation('access_bank', 'Access Bank', 'bank', 6.4492, 3.3917, 'Bank branch', { subcategory: 'bank', icon: 'BK' }),
  makeLocation('premium_trust_bank', 'Premium Trust Bank', 'bank', 6.4490, 3.3915, 'Bank branch', { subcategory: 'bank', icon: 'BK' }),

  makeLocation('pastors_quarters', "Pastor's Quarters", 'pastors_quarters', 6.4490, 3.3910, 'Residential area for pastors', { subcategory: 'residential', icon: 'PQ' }),
];

export const CAMP_REGION = {
  latitude: 6.4538,
  longitude: 3.3960,
  latitudeDelta: 0.018,
  longitudeDelta: 0.018,
};

export const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/foot';
