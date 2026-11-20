/* =========================================================================
   ENVOGUE 2.0 — Site content
   Edit this file to update residences, amenities, gallery and location
   content. Sections are rendered from this data by main.js.
   ========================================================================= */
window.ENVOGUE = {

  /* ---------- Lead + contact settings ---------- */
  contact: {
    phone: '+919126264444',
    phoneLabel: '+91 91262 64444',
    rera: 'P52100077680',
    agentRera: 'A52100020438',
    whatsapp: '919126264444',
    youtubeId: 'HLHXAEoaKpI'
  },

  /* ---------- Residences & Plans ---------- */
  residences: [
    {
      id: '2bhk',
      tab: '2 BHK',
      name: '2 BHK Residence',
      tag: 'Smart Start',
      area: 800,
      price: '₹1.18 Cr*',
      wing: 'Wing K-1',
      img: 'residences-2bhk-800-sqft-plan',
      ratio: '1400/1267',
      rooms: [
        ['Living Room', "10'6\" × 16'6\""],
        ['Master Bedroom', "10'2\" × 11'3\""],
        ['Bedroom 01', "10'1\" × 11'0\""],
        ['Kitchen', "13'11\" × 7'7\""],
        ['Dining', "5'3\" × 7'11\""],
        ['Balconies', "10'6\" × 4'6\" + 10'2\" × 3'0\""]
      ],
      points: ['2 balconies', 'Attached + common toilet', 'Separate entrance lobby']
    },
    {
      id: '3bhk-smart',
      tab: '3 BHK Smart',
      name: '3 BHK Smart',
      tag: 'Best Value',
      area: 916,
      price: '₹1.27 – 1.28 Cr*',
      wing: 'Wing K-1',
      img: 'residences-3bhk-smart-916-sqft-plan',
      ratio: '1400/1005',
      rooms: [
        ['Living Room', "10'6\" × 16'6\""],
        ['Master Bedroom', "10'2\" × 11'3\""],
        ['Bedroom 01', "10'1\" × 11'0\""],
        ['Bedroom 02', "10'0\" × 11'0\""],
        ['Kitchen', "14'5\" × 7'7\""],
        ['Balconies', "10'6\" × 4'6\" + 10'2\" × 3'0\""]
      ],
      points: ['3 bedrooms in under 1,000 sq.ft', '2 balconies', 'Attached + common toilet']
    },
    {
      id: '3bhk-luxury-1265',
      tab: '3 BHK Luxury',
      name: '3 BHK Luxury Suite',
      tag: 'Bed Suites',
      area: 1265,
      price: '₹1.77 – 1.81 Cr*',
      wing: 'Wing K-2',
      img: 'residences-3bhk-luxury-1265-sqft-plan',
      ratio: '1440/1091',
      rooms: [
        ['Living & Dining', "20'9\" × 14'0\""],
        ['Master Suite 01', "11'9\" × 14'0\""],
        ['Suite 02', "12'0\" × 13'0\""],
        ['Suite 03', "11'6\" × 13'0\""],
        ['Kitchen', "14'4\" × 9'6\""],
        ['Balconies', "15'0\" × 4'0\" + 12'0\" × 4'0\""]
      ],
      points: ['Every bedroom is a suite', '3 attached toilets + common toilet', 'Wide 20\'9" living & dining']
    },
    {
      id: '3bhk-luxury',
      tab: '3 BHK Ultra Luxury',
      name: '3 BHK Ultra Luxury Suite',
      tag: 'Bed Suites',
      area: 1450,
      price: '₹xxx',
      wing: 'Wing K-4',
      img: 'residences-3bhk-luxury-1265-sqft-plan',
      ratio: '1440/1091',
      rooms: [
        ['Living & Dining', "20'9\" × 14'0\""],
        ['Master Suite 01', "11'9\" × 14'0\""],
        ['Suite 02', "12'0\" × 13'0\""],
        ['Suite 03', "11'6\" × 13'0\""],
        ['Kitchen', "14'4\" × 9'6\""],
        ['Balconies', "15'0\" × 4'0\" + 12'0\" × 4'0\""]
      ],
      points: ['Every bedroom is a suite', '3 attached toilets + common toilet', 'Wide 20\'9" living & dining']
    },
    {
      id: '4bhk-luxury',
      tab: '4 BHK Luxury',
      name: '4 BHK Luxury Suite',
      tag: 'Signature',
      area: 1840,
      price: '₹2.62 – 2.67 Cr*',
      wing: 'Wing K-3',
      img: 'residences-4bhk-luxury-1840-sqft-plan',
      ratio: '1400/808',
      rooms: [
        ['Living & Dining', "23'8\" × 15'6\""],
        ['Master Suite 01', "15'6\" × 13'0\""],
        ['Master Suite 02', "11'8\" × 14'0\""],
        ['Suite 03 / 04', "12'0\" × 13'0\" · 11'11\" × 13'0\""],
        ['Kitchen', "16'1\" × 9'6\""],
        ['Walk-in Wardrobe', "6'9\" × 8'8\""]
      ],
      points: ['Two master suites', 'Walk-in wardrobe', '4 attached toilets + powder room']
    },
    {
      id: '4.5bhk-ultraluxury',
      tab: '4.5 BHK Ultra Luxury',
      name: '4.5 BHK Ultra Luxury Suite',
      tag: 'Signature',
      area: 2800,
      price: '₹xxxx',
      wing: 'Wing K-4',
      img: 'residences-4.5bhk-ultraluxury-2800-sqft-plan',
      ratio: '1400/808',
      rooms: [
        ['Living & Dining', "23'8\" × 15'6\""],
        ['Master Suite 01', "15'6\" × 13'0\""],
        ['Master Suite 02', "11'8\" × 14'0\""],
        ['Suite 03 / 04', "12'0\" × 13'0\" · 11'11\" × 13'0\""],
        ['Kitchen', "16'1\" × 9'6\""],
        ['Walk-in Wardrobe', "6'9\" × 8'8\""]
      ],
      points: ['Two master suites', 'Walk-in wardrobe', '4 attached toilets + powder room']
    }
  ],

  /* ---------- Amenities (horizontal showcase) ---------- */
  amenities: [
    { img: 'amenities-grand-arrival-lobby', title: 'Grand Arrival Lobby', line: 'The space for an audacious arrival.', note: '20 ft high grand entrance with welcoming sculpture & waiting lounge' },
    { img: 'amenities-horizon-infinity-pool', title: 'Horizon Pool & Little Lagoon', line: 'Be the swanky heart of the party!', note: 'A black-themed infinity pool with cabanas & a kids lagoon' },
    { img: 'amenities-clubhouse', title: 'The Clubhouse', line: 'Celebrations made legendary!', note: 'Ballroom, The Lounge — pool table, cigar & poker room' },
    { img: 'amenities-gym-groupx-studio', title: 'Gym & GroupX Studio', line: 'Unleash your best self!', note: 'Double-height gymnasium, GroupX studio & squash court' },
    { img: 'amenities-fireside-lounge', title: 'Fireside Lounge', line: 'Witness riveting fires!', note: 'An open-sky glass pavilion built around the fire' },
    { img: 'amenities-the-coliseum', title: 'The Coliseum', line: 'Take a seat, embrace the art.', note: 'Amphitheatre seating for performances & gatherings' },
    { img: 'amenities-musical-gathering-space', title: 'Musical Gathering Space', line: 'Where evenings find their rhythm.', note: 'Landscaped lawns with stage & pavilion seating' },
    { img: 'amenities-raised-walkway-seating-cove', title: 'Raised Walkway & Seating Cove', line: 'Walk above the green.', note: 'Elevated trails, reflexology trail & aromatic butterfly grove' },
    { img: 'amenities-childrens-adventure-zone', title: "Children's Adventure Zone", line: 'A captivating space for the little ones!', note: 'Swingscape, skate park & interactive green spaces' }
  ],


  /* ---------- Gallery ---------- */
  gallery: [
    { img: 'gallery-sample-flat-living-dining-room', cat: 'interiors', title: 'Living & Dining — Sample Flat' },
    { img: 'gallery-sample-flat-master-bedroom', cat: 'interiors', title: 'Master Bedroom' },
    { img: 'gallery-sample-flat-toilet-shower', cat: 'interiors', title: 'Glass Shower Toilet', tall: true },
    { img: 'gallery-sample-flat-modular-kitchen', cat: 'interiors', title: 'Kitchen' },
    { img: 'gallery-sample-flat-bedroom-designer-headboard', cat: 'interiors', title: 'Bedroom' },
    { img: 'gallery-sample-flat-marble-bathroom', cat: 'interiors', title: 'Marble Finish Bathroom', tall: true },
    { img: 'gallery-sample-flat-bedroom-tv-unit', cat: 'interiors', title: 'Bedroom with TV Unit' },
    { img: 'gallery-sample-flat-bathroom-vanity', cat: 'interiors', title: 'Attached Bathroom', tall: true },
    { img: 'gallery-sample-flat-guest-bedroom', cat: 'interiors', title: 'Guest Bedroom' },
  ],

  /* ---------- Location ---------- */
  location: [
    { cat: 'Metro & Rail', items: [['Akurdi Metro Station (Upcoming)', '300 m · 02 mins'], ['PCMC Metro Station', '06 mins'], ['Akurdi Railway Station', 'Quick access'], ['Chinchwad Railway Station', 'Quick access']] },
    { cat: 'Schools', items: [['Elpro International School', '05 mins'], ['Orchids — The International School', '05 mins']] },
    { cat: 'Hospitals', items: [["Unique Children's Hospital", '03 mins'], ['Aditya Birla Memorial Hospital', '05 mins'], ['Lokmanya Hospital', 'Nearby']] },
    { cat: 'Shopping & Leisure', items: [['Elpro City Square Mall', '05 mins'], ['D Mart', '08 mins'], ['PVR City One', '03 mins'], ['Vishal E Square', '05 mins'], ['INOX — Elpro City Square', '05 mins']] },
    { cat: 'Work Hubs', items: [['Hinjawadi IT Park', 'Excellent connectivity'], ['Baner', 'Excellent connectivity'], ['Chakan Industrial Zone', 'Excellent connectivity'], ['Pune – Mumbai Highway', 'On Old Mumbai Rd.']] }
  ]
};
