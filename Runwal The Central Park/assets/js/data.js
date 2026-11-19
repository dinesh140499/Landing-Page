/* =========================================================================
   RUNWAL THE CENTRAL PARK — site content & settings
   ========================================================================= */
window.SITE = {

  /* ---------- SETTINGS: fill these in before going live ---------- */
  contact: {
    phone: '+918804088044',     // IVR (used for tel: links)
    phoneLabel: '+91 88040 88044', // IVR (shown on the site)
    whatsapp: '918804088044',               // e.g. '919800000000'  (country code + number, no +)
    whatsappText: "Hi, I'm interested in Runwal The Central Park, Pimpri-Chinchwad. Please share the price sheet & site visit details.",
    cpFirm: '',                 // your channel-partner firm name (required in the Runwal disclaimer)
    cpRera: 'A52100020438'                // your channel-partner MahaRERA registration number
  },

  /* ---------- Residences (RERA carpet from Tower D3 / D4 booklets; all-inclusive prices for floors G-10, 11-20, 21-30) ---------- */
  residences: [
    { id: '2bhk',   tab: '2 BHK',   area: '850 – 860', sqm: '78.97 – 79.90', price: '₹1.38 Cr*', bands: ['1.38', '1.40', '1.42'], tower: 'Tower D3', img: 'residences-2bhk-plan' },
    { id: '3bhk',   tab: '3 BHK',   area: 1314, sqm: '122.07', price: '₹2.20 Cr*', bands: ['2.20', '2.25', '2.30'], tower: 'Tower D3', img: 'residences-3bhk-plan' },
    { id: '3-5bhk', tab: '3.5 BHK', area: 1548, sqm: '143.81', price: '₹2.55 Cr*', bands: ['2.55', '2.60', '2.65'], tower: 'Tower D4', img: 'residences-3-5bhk-plan' },
    { id: '4-5bhk', tab: '4.5 BHK', area: 2057, sqm: '191.10', price: '₹3.55 Cr*', bands: ['3.55', '3.60', '3.65'], tower: 'Tower D4', img: 'residences-4-5bhk-plan' },
    { id: '2-2bhk', tab: '2+2 BHK', area: 1721, sqm: '159.88', price: 'On Request', bands: null, tower: 'Jodi Residence', img: 'residences-2bhk-plan' },
    { id: '3-5-3-5bhk', tab: '3.5+3.5 BHK', area: 3100, sqm: '288.00', price: 'On Request', bands: null, tower: 'Jodi Residence', img: 'residences-3-5bhk-plan' }
  ],

  /* ---------- Main amenities (renders from the approved brochure) ---------- */
  amenities: [
    { img: 'amenities-grand-club',          title: 'The Grand Club',            line: '50,000 sq ft clubhouse', note: 'One of the largest clubhouses in PCMC — banquet, squash, badminton & more.', disc: "Artist's Impression" },
    { img: 'amenities-indoor-pool',         title: 'Largest Indoor Pool',       line: 'Half the size of an Olympic pool', note: 'The largest indoor pool in PCMC, inside The Grand Club.', disc: "Artist's Impression" },
    { img: 'amenities-double-height-lobby', title: 'Double-Height Lobby',       line: 'Air-conditioned arrival', note: 'A grand, double-heighted air-conditioned entrance lobby.', disc: "Artist's Impression" },
    { img: 'amenities-activity-hub',        title: 'Gym, Theatre & Studios',    line: '50+ enticing activities', note: 'Gymnasium, preview theatre and activity studios under one roof.', disc: "Artist's Impression" },
    { img: 'amenities-skydeck',             title: 'The Skydeck',               line: 'Sky high indulgence', note: 'Infinity pool, sunrise yoga deck, mini golf & astro corner — high above the city.', disc: "Artist's Impression" },
    { img: 'amenities-sky-restaurant',      title: 'Sky Restaurant',            line: 'Dining above the skyline', note: 'A rooftop restaurant and juice deck with panoramic views.', disc: "Artist's Impression" },
    { img: 'amenities-sky-garden',          title: 'Sky Garden',                line: 'Zen garden & sky library', note: 'A quiet garden retreat with outdoor seating on the Skydeck.', disc: "Artist's Impression" },
    { img: 'amenities-central-greens',      title: '5+ Acres Central Greens',   line: 'Embrace nature', note: 'Event lawn for 400–500 guests, adventure park, pet zone & chess court.', disc: "Artist's Impression" },
    { img: 'amenities-everyday-escape',     title: 'Everyday Escape',           line: 'Unwind, every day', note: 'Outdoor amphitheatre, yoga & meditation deck and organic herb garden.', disc: "Artist's Impression" }
  ],

  /* ---------- Gallery: residence interiors ---------- */
  gallery: [
    { img: 'gallery-residence-double-height-living', title: 'Double-Height Living', disc: 'Representational Image' },
    { img: 'gallery-residence-living-room',          title: 'Living Room',          disc: 'Representational Image' },
    { img: 'gallery-residence-dining',               title: 'Dining',               disc: 'Representational Image' },
    { img: 'gallery-residence-bedroom',              title: 'Bedroom',              disc: 'Representational Image' },
    { img: 'gallery-residence-kitchen',              title: 'Kitchen & Lounge',     disc: 'Representational Image' },
    { img: 'gallery-residence-bathroom',             title: 'Bathroom',             disc: 'Representational Image' },
    { img: 'gallery-residence-reading-corner',       title: 'Reading Corner',       disc: 'Representational Image' },
    { img: 'gallery-residence-lounge',               title: 'Lounge',               disc: 'Representational Image' },
    { img: 'gallery-residence-spa-pool',             title: 'Spa Pool',             disc: 'Representational Image' }
  ],

  /* ---------- Location (distances from the project brochure) ---------- */
  location: [
    { cat: 'Metro & Rail', items: [['Chinchwad Metro Station', '0.6 km'], ['Chinchwad Railway Station', '1.5 km'], ['Pimpri Railway Station', '3.0 km']] },
    { cat: 'Work Hubs', items: [['Mother Teresa Flyover', '0.1 km'], ['PCMC Link Road', '0.5 km'], ['MIDC Bhosari', '4 km'], ['Hinjewadi Phase 1', '9 km'], ['Shivajinagar', '14 km']] },
    { cat: 'Schools', items: [['Elpro International School', '2 km'], ['SNBP International School', 'Nearby']] },
    { cat: 'Hospitals', items: [['Aditya Birla Memorial Hospital', '3.8 km'], ['Lokmanya Hospital, Chinchwad', 'Nearby']] },
    { cat: 'Shopping & Leisure', items: [['1 million+ sq ft mall', 'Within the township'], ['Premier Plaza Mall', 'Nearby'], ['D Mart, Chinchwad', 'Nearby'], ['Carnival Cinemas, Chinchwad', 'Nearby']] }
  ]
};
