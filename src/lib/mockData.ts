
import type { Product, Service, Store, Category, Brand, CompatibleVehicle } from './types';
import { carBrandsData as importedCarBrandsData } from './types'; 

export const carBrands: Brand[] = importedCarBrandsData; 

const algiersWilaya = "Algiers";
const oranWilaya = "Oran";
const blidaWilaya = "Blida";
const constantineWilaya = "Constantine";
const annabaWilaya = "Annaba";
const setifWilaya = "Sétif";


// --- Detailed Product & Service Categories ---
export const productCategories: Category[] = [
  { 
    id: 'cat_prod_mech', name: 'Mechanical', iconName: 'Cog', type: 'product',
    subCategories: [
      { id: 'cat_prod_mech_engine', name: 'Engine Components' }, // e.g., pistons, belts
      { id: 'cat_prod_mech_susp', name: 'Suspension & Steering' },
      { id: 'cat_prod_mech_brakes', name: 'Brake Systems' },
      { id: 'cat_prod_mech_trans', name: 'Transmission & Drivetrain' },
      { id: 'cat_prod_mech_exhaust', name: 'Exhaust Systems' },
    ]
  },
  { 
    id: 'cat_prod_elec', name: 'Electronic & Electrical', iconName: 'Cpu', type: 'product',
    subCategories: [
      { id: 'cat_prod_elec_sensors', name: 'Sensors & Switches' },
      { id: 'cat_prod_elec_ecu', name: 'ECUs & Control Modules' },
      { id: 'cat_prod_elec_ignition', name: 'Ignition Systems' }, // incl. Spark Plugs
      { id: 'cat_prod_elec_battery', name: 'Batteries & Charging' },
      { id: 'cat_prod_elec_lighting', name: 'Lighting Components' }, // Bulbs, Ballasts
    ]
  },
  { 
    id: 'cat_prod_ext', name: 'Exterior & Body', iconName: 'Car', type: 'product',
    subCategories: [
      { id: 'cat_prod_ext_panels', name: 'Body Panels' }, // Fenders, Doors
      { id: 'cat_prod_ext_bumpers', name: 'Bumpers & Grilles' },
      { id: 'cat_prod_ext_mirrors', name: 'Mirrors & Components' },
      { id: 'cat_prod_ext_wipers', name: 'Wipers & Washers' }, // Wiper blades, motors
    ]
  },
  { 
    id: 'cat_prod_int', name: 'Interior Components', iconName: 'Armchair', type: 'product',
    subCategories: [
      { id: 'cat_prod_int_seats', name: 'Seats & Seat Covers' },
      { id: 'cat_prod_int_dash', name: 'Dashboard Parts' },
      { id: 'cat_prod_int_infotain', name: 'Infotainment & Audio' },
      { id: 'cat_prod_int_mats', name: 'Floor Mats & Liners' },
    ]
  },
  { 
    id: 'cat_prod_consum', name: 'Consumables & Fluids', iconName: 'FilterIcon', type: 'product',
    subCategories: [
      { id: 'cat_prod_consum_oil', name: 'Oils & Lubricants' },
      { id: 'cat_prod_consum_filters', name: 'Filters (Air, Oil, Cabin)' },
      { id: 'cat_prod_consum_coolant', name: 'Coolants & Antifreeze' },
      { id: 'cat_prod_consum_tires', name: 'Tires & Wheels' },
      { id: 'cat_prod_consum_cleaning', name: 'Cleaning Supplies' },
    ]
  },
];

export const serviceCategories: Category[] = [
  { 
    id: 'cat_serv_mech', name: 'Mechanical Services', iconName: 'Wrench', type: 'service',
    subCategories: [
      { id: 'cat_serv_mech_eng_repair', name: 'Engine Repair & Diagnostics' },
      { id: 'cat_serv_mech_brake_serv', name: 'Brake System Service' },
      { id: 'cat_serv_mech_oil_change', name: 'Oil & Fluid Changes' },
      { id: 'cat_serv_mech_susp_align', name: 'Suspension & Alignment' },
      { id: 'cat_serv_mech_trans_serv', name: 'Transmission Service' },
      { id: 'cat_serv_mech_tire_serv', name: 'Tire Mounting & Balancing' },
    ]
  },
  { 
    id: 'cat_serv_elec', name: 'Electrical Services', iconName: 'Bolt', type: 'service',
    subCategories: [
      { id: 'cat_serv_elec_ecu_prog', name: 'ECU Programming & Diagnostics' },
      { id: 'cat_serv_elec_batt_alt', name: 'Battery & Alternator Service' },
      { id: 'cat_serv_elec_wiring', name: 'Wiring & Sensor Repair' },
      { id: 'cat_serv_elec_light_repair', name: 'Lighting System Repair' },
    ]
  },
  { 
    id: 'cat_serv_maint', name: 'Maintenance & Inspection', iconName: 'ShieldCheck', type: 'service',
    subCategories: [
      { id: 'cat_serv_maint_checkup', name: 'Scheduled Maintenance' },
      { id: 'cat_serv_maint_inspect', name: 'Pre-Purchase Inspections' },
      { id: 'cat_serv_maint_detailing', name: 'Detailing & Car Wash' },
      { id: 'cat_serv_maint_emissions', name: 'Emissions Testing' },
    ]
  },
  { 
    id: 'cat_serv_custom', name: 'Custom & Specialized', iconName: 'Sparkles', type: 'service',
    subCategories: [
      { id: 'cat_serv_custom_tuning', name: 'Performance Tuning' },
      { id: 'cat_serv_custom_mods', name: 'Custom Modifications' },
      { id: 'cat_serv_custom_tinting', name: 'Window Tinting' },
      { id: 'cat_serv_custom_paint', name: 'Paint & Bodywork Repair' },
    ]
  },
];

// --- Compatibility Examples ---
const toyotaCorolla2018_16Petrol: CompatibleVehicle = { brand: "Toyota", model: "Corolla", years: [2018], engine: "1.6L Petrol" };
const toyotaCorolla2018_2020_AllEngines: CompatibleVehicle = { brand: "Toyota", model: "Corolla", years: [2018, 2019, 2020] };
const renaultClio2015_15Diesel: CompatibleVehicle = { brand: "Renault", model: "Clio", years: [2015], engine: "1.5L Diesel" };
const hyundaiAccentAny: CompatibleVehicle = { brand: "Hyundai", model: "Accent" }; // Any Accent
const peugeot208_2017_12Petrol: CompatibleVehicle = { brand: "Peugeot", model: "208", years: [2017], engine: "1.2L Petrol" };
const vwGolf_GTI_2019_2022: CompatibleVehicle = { brand: "Volkswagen", model: "Golf", years: [2019, 2020, 2021, 2022], engine: "2.0L GTI" };
const mercedesCClass2015_2018_Diesel: CompatibleVehicle = { brand: "Mercedes-Benz", model: "C-Class", years: [2015, 2016, 2017, 2018], engine: "2.0L Diesel" };


// --- Mock Products with Detailed Compatibility ---
export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Premium Ceramic Brake Pads (Front)',
    store: 'AutoParts Algiers',
    location: 'Algiers', wilaya: algiersWilaya, price: 5200,
    description: 'High-performance ceramic front brake pads. Quiet, smooth, and durable.',
    mainCategory: 'Mechanical', subCategory: 'Brake Systems', reviews: 4.7,
    storeAddress: '12 Rue Didouche Mourad, Alger Centre, Algiers',
    compatibleVehicles: [toyotaCorolla2018_16Petrol, { brand: "Hyundai", model: "Elantra", years: [2017, 2018], engine: "1.6L Petrol" }]
  },
  {
    id: 'p2',
    name: 'Full Synthetic Engine Oil 5W-30 (5L)',
    store: 'Oran Car Lube',
    location: 'Oran', wilaya: oranWilaya, price: 3800,
    description: 'Top-grade 5W-30 fully synthetic engine oil for modern engines. API SN Plus.',
    mainCategory: 'Consumables & Fluids', subCategory: 'Oils & Lubricants', reviews: 4.9,
    storeAddress: '5 Avenue de la République, Oran',
    compatibleVehicles: [] // Universal for cars requiring 5W-30
  },
  {
    id: 'p3',
    name: 'NGK Iridium IX Spark Plugs (Set of 4)',
    store: 'Blida Auto Spares',
    location: 'Blida', wilaya: blidaWilaya, price: 2200,
    description: 'NGK Iridium IX spark plugs for improved fuel efficiency and throttle response.',
    mainCategory: 'Electronic & Electrical', subCategory: 'Ignition Systems', reviews: 4.6,
    storeAddress: 'Cité des 1000 Logements, Blida',
    compatibleVehicles: [peugeot208_2017_12Petrol, { brand: "Renault", model: "Symbol", years: [2016, 2017], engine: "1.2L Petrol" }]
  },
  {
    id: 'p4',
    name: 'LED Headlight Conversion Kit H7',
    store: 'Constantine Auto Lights',
    location: 'Constantine', wilaya: constantineWilaya, price: 3200,
    description: 'Ultra-bright H7 LED headlight bulbs. 6000K cool white. Easy installation.',
    mainCategory: 'Electronic & Electrical', subCategory: 'Lighting Components', reviews: 4.4,
    storeAddress: '1 Rue Nationale, Constantine',
    compatibleVehicles: [] // Universal H7 fitment
  },
  {
    id: 'p5',
    name: 'Activated Carbon Cabin Air Filter',
    store: 'AutoParts Algiers',
    location: 'Algiers', wilaya: algiersWilaya, price: 1500,
    description: 'Premium cabin air filter with activated carbon for superior odor filtration.',
    mainCategory: 'Consumables & Fluids', subCategory: 'Filters (Air, Oil, Cabin)', reviews: 4.3,
    storeAddress: '12 Rue Didouche Mourad, Alger Centre, Algiers',
    compatibleVehicles: [toyotaCorolla2018_2020_AllEngines, hyundaiAccentAny]
  },
   {
    id: 'p6',
    name: 'Heavy Duty Car Battery 12V 70Ah',
    store: 'Annaba Power Solutions',
    location: 'Annaba', wilaya: annabaWilaya, price: 8500,
    description: 'Reliable 12V 70Ah car battery with 3-year warranty. Maintenance-free.',
    mainCategory: 'Electronic & Electrical', subCategory: 'Batteries & Charging', reviews: 4.8,
    storeAddress: 'Rue de la Revolution, Annaba',
    compatibleVehicles: [] // Generally universal based on size/terminal, not specific model
  },
  {
    id: 'p7',
    name: 'Engine Air Filter - Performance',
    store: 'Sétif Speed Shop',
    location: 'Sétif', wilaya: setifWilaya, price: 1900,
    description: 'High-flow performance engine air filter for increased horsepower and acceleration.',
    mainCategory: 'Consumables & Fluids', subCategory: 'Filters (Air, Oil, Cabin)', reviews: 4.5,
    storeAddress: 'Avenue de l\'ALN, Sétif',
    compatibleVehicles: [vwGolf_GTI_2019_2022, { brand: "Mercedes-Benz", model: "C-Class", years: [2019, 2020], engine: "AMG Variants" }]
  },
  {
    id: 'p8',
    name: 'Toyota Genuine Oil Filter',
    store: 'AutoParts Algiers',
    location: 'Algiers', wilaya: algiersWilaya, price: 900,
    description: 'Original Toyota oil filter for optimal engine protection.',
    mainCategory: 'Consumables & Fluids', subCategory: 'Filters (Air, Oil, Cabin)', reviews: 4.9,
    storeAddress: '12 Rue Didouche Mourad, Alger Centre, Algiers',
    compatibleVehicles: [{ brand: "Toyota", model: "Corolla" }, { brand: "Toyota", model: "Hilux" }] // Broad Toyota compatibility
  },
  {
    id: 'p9',
    name: 'Bosch Wiper Blade Set (Aerotwin)',
    store: 'Oran Car Lube',
    location: 'Oran', wilaya: oranWilaya, price: 2800,
    description: 'Bosch Aerotwin flat wiper blades for streak-free visibility. Various sizes.',
    mainCategory: 'Exterior & Body', subCategory: 'Wipers & Washers', reviews: 4.7,
    storeAddress: '5 Avenue de la République, Oran',
    compatibleVehicles: [] // Sold by size, universal for matching size
  },
  {
    id: 'p10',
    name: 'Michelin Primacy 4 Tire - 205/55 R16',
    store: 'TirePro Oran', // Re-using a store
    location: 'Oran', wilaya: oranWilaya, price: 12500, // Per tire
    description: 'Michelin Primacy 4 tire for excellent wet braking and longevity. Size 205/55 R16.',
    mainCategory: 'Consumables & Fluids', subCategory: 'Tires & Wheels', reviews: 4.8,
    storeAddress: 'Boulevard Millenium, Bir El Djir, Oran',
    compatibleVehicles: [toyotaCorolla2018_16Petrol, { brand: "Volkswagen", model: "Golf", years: [2015,2016,2017,2018], engine: "1.4L TSI"}] 
  },
  {
    id: 'p11',
    name: 'Front Suspension Strut Assembly',
    store: 'Blida Auto Spares',
    location: 'Blida', wilaya: blidaWilaya, price: 9500,
    description: 'Complete front strut assembly for Renault Clio IV. Restores original ride quality.',
    mainCategory: 'Mechanical', subCategory: 'Suspension & Steering', reviews: 4.2,
    storeAddress: 'Cité des 1000 Logements, Blida',
    compatibleVehicles: [{ brand: "Renault", model: "Clio", years: [2013, 2014, 2015, 2016] }]
  },
  {
    id: 'p12',
    name: 'Android Auto/CarPlay Touchscreen Head Unit',
    store: 'Sétif Speed Shop',
    location: 'Sétif', wilaya: setifWilaya, price: 18000,
    description: '7-inch universal double DIN touchscreen with Android Auto and Apple CarPlay.',
    mainCategory: 'Interior Components', subCategory: 'Infotainment & Audio', reviews: 4.5,
    storeAddress: 'Avenue de l\'ALN, Sétif',
    compatibleVehicles: [] // Universal for double DIN slots
  }
];

// --- Mock Services with Detailed Compatibility ---
export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Premium Car Wash & Wax',
    store: 'CleanCar Algiers',
    location: 'Algiers', wilaya: algiersWilaya, price: 2000,
    description: 'Exterior hand wash, liquid wax application, tire shining, and interior vacuuming.',
    mainCategory: 'Maintenance & Inspection', subCategory: 'Detailing & Car Wash', reviews: 4.5,
    storeAddress: 'Zone Industrielle Oued Smar, Algiers',
    compatibleVehicles: [] 
  },
  {
    id: 's2',
    name: 'Tire Rotation & Balancing Service',
    store: 'TirePro Oran',
    location: 'Oran', wilaya: oranWilaya, price: 1500, 
    description: 'Professional tire rotation and balancing to extend tire life and improve ride.',
    mainCategory: 'Mechanical Services', subCategory: 'Tire Mounting & Balancing', reviews: 4.6,
    storeAddress: 'Boulevard Millenium, Bir El Djir, Oran',
    compatibleVehicles: [] 
  },
  {
    id: 's3',
    name: 'Advanced OBD-II Engine Diagnostics',
    store: 'MechTech Blida',
    location: 'Blida', wilaya: blidaWilaya, price: 3500,
    description: 'Full system scan using latest OBD-II tools to pinpoint engine and electronic issues.',
    mainCategory: 'Mechanical Services', subCategory: 'Engine Repair & Diagnostics', reviews: 4.3,
    storeAddress: 'Route Nationale 1, Blida',
    compatibleVehicles: [toyotaCorolla2018_16Petrol, renaultClio2015_15Diesel, hyundaiAccentAny] 
  },
  {
    id: 's4',
    name: 'Synthetic Oil Change Package',
    store: 'Garage Moderne Constantine',
    location: 'Constantine', wilaya: constantineWilaya, price: 5000,
    description: 'Includes up to 5L of premium synthetic oil, new oil filter, and labor.',
    mainCategory: 'Mechanical Services', subCategory: 'Oil & Fluid Changes', reviews: 4.7,
    storeAddress: 'Cité Boussouf, Constantine',
    compatibleVehicles: [] 
  },
  {
    id: 's5',
    name: 'Brake Pad Replacement (Front Axle)',
    store: 'MechTech Blida',
    location: 'Blida', wilaya: blidaWilaya, price: 4000, // Labor only, pads extra or included
    description: 'Professional replacement of front brake pads. Includes inspection of rotors.',
    mainCategory: 'Mechanical Services', subCategory: 'Brake System Service', reviews: 4.4,
    storeAddress: 'Route Nationale 1, Blida',
    compatibleVehicles: [toyotaCorolla2018_16Petrol, mercedesCClass2015_2018_Diesel]
  },
  {
    id: 's6',
    name: 'ECU Performance Tuning Stage 1',
    store: 'Sétif Speed Shop',
    location: 'Sétif', wilaya: setifWilaya, price: 25000,
    description: 'Optimize your engine\'s performance with our Stage 1 ECU remap. Model specific.',
    mainCategory: 'Custom & Specialized', subCategory: 'Performance Tuning', reviews: 4.9,
    storeAddress: 'Avenue de l\'ALN, Sétif',
    compatibleVehicles: [vwGolf_GTI_2019_2022]
  },
  {
    id: 's7',
    name: 'Air Conditioning System Check & Recharge',
    store: 'Cool Breeze Annaba',
    location: 'Annaba', wilaya: annabaWilaya, price: 6000,
    description: 'Full A/C system inspection, leak test, and refrigerant recharge.',
    mainCategory: 'Maintenance & Inspection', subCategory: 'Scheduled Maintenance', reviews: 4.2,
    storeAddress: 'Zone Activité Berrahal, Annaba',
    compatibleVehicles: []
  },
  {
    id: 's8',
    name: 'Wheel Alignment Service (4 Wheels)',
    store: 'Garage Moderne Constantine',
    location: 'Constantine', wilaya: constantineWilaya, price: 3000,
    description: 'Precision four-wheel alignment using laser-guided equipment.',
    mainCategory: 'Mechanical Services', subCategory: 'Suspension & Alignment', reviews: 4.5,
    storeAddress: 'Cité Boussouf, Constantine',
    compatibleVehicles: []
  }
];

// --- Mock Stores (Expanded slightly) ---
export const mockStores: Store[] = [
  { id: 'st1', name: 'AutoParts Algiers', location: 'Algiers', wilaya: algiersWilaya, type: 'Parts Retailer', address: '12 Rue Didouche Mourad, Alger Centre, Algiers', rating: 4.7 },
  { id: 'st2', name: 'Oran Car Lube', location: 'Oran', wilaya: oranWilaya, type: 'Parts & Fluids Store', address: '5 Avenue de la République, Oran', rating: 4.8 },
  { id: 'st3', name: 'CleanCar Algiers', location: 'Algiers', wilaya: algiersWilaya, type: 'Detailing Center', address: 'Zone Industrielle Oued Smar, Algiers', rating: 4.5 },
  { id: 'st4', name: 'MechTech Blida', location: 'Blida', wilaya: blidaWilaya, type: 'Full Service Garage', address: 'Route Nationale 1, Blida', rating: 4.3 },
  { id: 'st5', name: 'Constantine Auto Lights', location: 'Constantine', wilaya: constantineWilaya, type: 'Specialty Lighting Store', address: '1 Rue Nationale, Constantine', rating: 4.4 },
  { id: 'st6', name: 'Garage Moderne Constantine', location: 'Constantine', wilaya: constantineWilaya, type: 'Service & Repair Shop', address: 'Cité Boussouf, Constantine', rating: 4.6 },
  { id: 'st7', name: 'Annaba Power Solutions', location: 'Annaba', wilaya: annabaWilaya, type: 'Battery & Electrical Specialist', address: 'Rue de la Revolution, Annaba', rating: 4.8 },
  { id: 'st8', name: 'Sétif Speed Shop', location: 'Sétif', wilaya: setifWilaya, type: 'Performance & Tuning Center', address: 'Avenue de l\'ALN, Sétif', rating: 4.7 },
  { id: 'st9', name: 'TirePro Oran', location: 'Oran', wilaya: oranWilaya, type: 'Tire & Wheel Center', address: 'Boulevard Millenium, Bir El Djir, Oran', rating: 4.6 },
  { id: 'st10', name: 'Cool Breeze Annaba', location: 'Annaba', wilaya: annabaWilaya, type: 'A/C Repair Specialist', address: 'Zone Activité Berrahal, Annaba', rating: 4.2 },
];


export const getItemById = (id: string, type: 'product' | 'service'): Product | Service | undefined => {
  if (type === 'product') {
    return mockProducts.find(p => p.id === id);
  }
  return mockServices.find(s => s.id === id);
};

export const allWilayas: string[] = Array.from(new Set(mockStores.map(s => s.wilaya))).sort();
