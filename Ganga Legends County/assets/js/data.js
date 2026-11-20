/* =========================================================================
   GANGA LEGENDS COUNTY — THE LIVING BLUEPRINT · site content & settings
   ========================================================================= */
window.SITE = {

  /* ---------- SETTINGS: fill these in before going live ---------- */
  contact: {
    phone: '+919126264444',         // IVR (used for tel: links)
    phoneLabel: '+91 91262 64444',  // IVR (shown on the site)
    whatsapp: '',                   // e.g. '919800000000' (country code + number, no +) — WhatsApp stays hidden until set
    whatsappText: "Hi, I'm interested in Ganga Legends County – The Living Blueprint, Bavdhan. Please share the price sheet & site visit details."
  },

  /* ---------- Residences by tower (RERA carpet, prices as supplied) ---------- */
  towers: [
     { id: 'b7', name: 'B7', tag: 'New tower', possession: 'Dec 2029', progress: 0.38,
      units: [
        { type: '3 BHK', carpet: 1021, price: '1.56' },
        { type: '3 BHK', carpet: 1222, price: '1.90' },
        { type: '4 BHK', carpet: 1294, price: '2.05' },
        { type: '4 BHK', carpet: 1411, price: '2.31' }
      ] },
    { id: 'b5', name: 'B5', tag: 'Nearing possession', possession: 'Dec 2027', progress: 0.82,
      units: [
        { type: '3 BHK',   carpet: 1262, price: '1.78' },
        { type: '3 BHK',   carpet: 1272, price: '1.83' },
        { type: '3.5 BHK', carpet: 1402, price: '2.02' },
        { type: '3.5 BHK', carpet: 1470, price: '2.16' }
      ] }
   
  ],

  /* ---------- Long Life by Design: the seven wellness layers (USP brochure) ---------- */
  wellness: [
    { img: 'banner-tower-facade', title: 'Air Architecture', strap: 'Every breath matters.',
      feats: ['Fresh-air supply', 'Cross ventilation', 'Air-quality monitoring', 'PM2.5-reducing mesh', 'Low-VOC materials'],
      means: 'Cleaner indoor air and a home that feels easier to breathe in.' },
    { img: 'amenities-resort-pool', title: 'Water Architecture', strap: 'Designed to do more than flow.',
      feats: ['Centralised functional water', 'Osmosis & REDOX treatment', 'Mineralisation & pH balancing', 'Copper-silver ionisation'],
      means: 'Cleaner water and greater confidence in every glass.' },
    { img: 'amenities-swing-deck', title: 'Nature Architecture', strap: "Nature isn't the view. It's the design.",
      feats: ['Biophilic landscapes', 'Tree-canopied walkways', 'Sensory gardens', 'Grounding paths', 'Hydroponic growing'],
      means: 'More nature in everyday life — more chances to pause and reconnect.' },
    { img: 'amenities-retail-promenade', title: 'Nutrition Ecosystem', strap: 'Better eating, made the easier choice.',
      feats: ['Fresh produce access', 'Natural farmer partnerships', 'Community & hydroponic farming', 'Personalised nutrition guidance'],
      means: 'Better access, better choices, better everyday eating habits.' },
    { img: 'amenities-games-lounge', title: 'Sound Architecture', strap: 'Designed for quiet. Shaped by nature.',
      feats: ['Double-glazed windows', 'High-performance wall assemblies', 'Sound-reducing floors & ceilings', 'Quiet zones'],
      means: 'Calmer interiors, better focus, more restful living.' },
    { img: 'amenities-gymnasium', title: 'Longevity Centre', strap: 'Know earlier. Act smarter. Live better.',
      feats: ['Diagnostics & health screening', 'Movement & mobility assessment', 'Rehab & physiotherapy', 'Sleep & recovery guidance'],
      means: 'Measure. Understand. Personalise. Progress.' },
    { img: 'amenities-skywalk-cardio', title: 'Smart Longevity', strap: 'Your body is always speaking.',
      feats: ['TLB Ring — HRV, sleep & stress', 'TLB App wellness dashboard', 'Personal coaching access', 'Community challenges'],
      means: 'Data → Insight → Action → Habit.' }
  ],

  /* ---------- Amenity renders ---------- */
  amenities: [
    { img: 'amenities-resort-pool',      title: 'Resort-Style Pool',       note: 'Heated pool, kids’ pool & deck' },
    { img: 'amenities-skywalk-cardio',   title: 'Sky Walk Cardio Studio',  note: 'Workouts with a view' },
    { img: 'amenities-swing-deck',       title: 'Garden Swing Deck',       note: 'Pergolas & lounge swings' },
    { img: 'amenities-gymnasium',        title: 'Air-Conditioned Gym',     note: 'Strength & functional training' },
    { img: 'amenities-games-lounge',     title: 'Indoor Games Lounge',     note: 'Chess, cards & conversation' },
    { img: 'amenities-ileseum-clubs',    title: 'Ileseum Clubs',           note: 'Sports & active-living hub' }
  ],

  /* ---------- Location (from the developer website) ---------- */
  location: [
    { cat: 'Connectivity', items: [['Mumbai–Bengaluru Highway', '2 min'], ['Kothrud', '5 min'], ['Baner', '5 min'], ['Pune Station', '15 min'], ['Pune International Airport', '22 km']] },
    { cat: 'Education',    items: [['Goel Ganga International School', '0 km'],['Ryan International School, Bavdhan', '1.8 km'], ['Suryadatta College', '2 min'], ['Little Millennium School', '7 min']] },
    { cat: 'Healthcare',   items: [['Chellaram Hospital', '4 min'], ['Asian Speciality Hospital', '11 min'], ['Apple Speciality Hospital', '15 min']] },
    { cat: 'Shopping & Dining', items: [['Vishal Shopping Mall', '1 min'], ['Aditya Shagun Mall', '2 min'], ['La Bali Bar & Kitchen', '2 min'], ['Bagfull Mart', '3 min'], ['Regent Plaza Mall', '13 min']] }
  ]
};
