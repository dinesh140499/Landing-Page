/* =========================================================================
   BIRLA PUNYA — data + interactions (jQuery)
   Sources: Tower C Layouts + Interior Specifications brochures (plans, specs,
   RERA), birlaestates.com/birla-punya-pune (configs, amenities, location, FAQs)
   ========================================================================= */
(function ($) {
  'use strict';

  /* ---------- SETTINGS — check these before going live ---------- */
  var C = {
    phone: '+919126264444',                    // tel: link
    phoneLabel: '+91 91262 64444'              // shown on the site
  };

  var IMG = 'assets/images/';

  /* Configurations & price — add a row here to add a configuration to the site.
     area: carpet range in sq. ft. · sqm: same in sq. m · price: '' shows "Price on request" · tag: optional label */
  var CONFIGS = [
    { type: '2 BHK', area: '869 – 907', sqm: '80.77 – 84.23', price: '', tag: '' },
    { type: '3 BHK', area: '1443 – 1473', sqm: '134.09 – 136.83', price: '', tag: 'Most sought' },
    { type: '4 BHK', area: '1735 – 1798', sqm: '161.20 – 167.08', price: '', tag: '' }
  ];

  /* Tower C unit plans — straight from the brochure */
  var PLANS = [
    { id: '2bhk-a', name: '2 BHK – A', total: '1180 sq. ft. (109.66 sq. m)', carpet: '88.96 sq. m', excl: '20.70 sq. m', floors: '2, 7, 12, 16', note: 'Open balcony 20.70 sq. m' },
    { id: '3bhk-c', name: '3 BHK – C', total: '1465 sq. ft. (136.08 sq. m)', carpet: '115.43 sq. m', excl: '20.65 sq. m', floors: '2 to 14, 16 to 19', note: 'Open balcony 20.65 sq. m' },
    { id: '3bhk-e', name: '3 BHK – E', total: '1451 sq. ft. (134.81 sq. m)', carpet: '114.16 sq. m', excl: '20.65 sq. m', floors: '3–6, 8–11, 13–14, 17–19', note: 'Open balcony 20.65 sq. m' },
    { id: '3bhk-d', name: '3 BHK – D + Study', total: '1629 sq. ft. (151.35 sq. m)', carpet: '119.13 sq. m', excl: '32.22 sq. m', floors: '2, 7, 12, 16', note: 'Open balcony 18.46 sq. m · Enclosed balcony 13.76 sq. m · Study room' },
    { id: '3bhk-b', name: '3 BHK – B Garden', total: '1775 sq. ft. (164.89 sq. m)', carpet: '114.16 sq. m', excl: '50.73 sq. m', floors: '1 (private garden unit)', note: 'Open balcony 22.03 sq. m · Open-to-sky terrace 28.70 sq. m' },
    { id: '3bhk-a', name: '3 BHK – A Garden', total: '1907 sq. ft. (177.20 sq. m)', carpet: '115.43 sq. m', excl: '61.77 sq. m', floors: '1 (private garden unit)', note: 'Open balcony 22.03 sq. m · Open-to-sky terrace 39.74 sq. m' },
    { id: '4bhk-b', name: '4 BHK – B', total: '1805 sq. ft. (167.65 sq. m)', carpet: '119.10 sq. m', excl: '48.55 sq. m', floors: '2 to 14, 16 to 19', note: 'Open balcony 23.52 sq. m · Enclosed balcony 25.03 sq. m · Staff room' },
    { id: '4bhk-c', name: '4 BHK – C', total: '1805 sq. ft. (167.65 sq. m)', carpet: '119.10 sq. m', excl: '48.55 sq. m', floors: '3–6, 8–11, 13–14, 17–19', note: 'Open balcony 23.52 sq. m · Enclosed balcony 25.03 sq. m · Staff room' },
    { id: '4bhk-a', name: '4 BHK – A Garden', total: '2082 sq. ft. (193.44 sq. m)', carpet: '119.10 sq. m', excl: '74.34 sq. m', floors: '1 (private garden unit)', note: 'Open balcony 24.82 sq. m · Enclosed balcony 25.03 sq. m · Terrace 24.49 sq. m' }
  ];

  var AMEN = [
    { t: 'The Park', d: 'Landscaped greens, decks and walks for slow mornings and family evenings.', img: ['landscaped-park', 'balcony-green-views', 'kids-play-area'],
      items: ['Pickle Ball Court', 'Forest Viewing Deck', 'Hammock Deck', 'Multi-Purpose Lawn', 'Stage', 'Siddha Walk', 'Net Cricket'] },
    { t: 'The Sky Deck', d: 'Elevated leisure with river and city views.', img: ['golf-sky-deck-amenity', 'urban-terraces', 'balcony-green-views'],
      items: ['Mini Golf', 'Pool Table', 'Table Tennis', 'Yoga Deck / Dance Studio', 'Outdoor Cinema', 'Sky Lounge', 'Riverview Deck', 'Hammocks', 'Senior Citizen Fitness Station', 'Fragrance Garden'] },
    { t: 'The Courts', d: 'Pools, lawns and decks built around water and sunshine.', img: ['swimming-pool-amenity', 'pickleball-amenity', 'kids-play-area'],
      items: ['Semi Olympic Pool', 'Lounge Deck', 'Lounge Pool', 'Sunken Lawn', 'Sun Deck', 'BBQ Deck', 'Kids Pool', "Kid's Play Area"] },
    { t: 'The Clubhouse', d: 'An exclusive clubhouse to work, play and recharge.', img: ['exclusive-clubhouse', 'urban-terraces', 'golf-sky-deck-amenity'],
      items: ['Multi-purpose Hall', 'Mini Theatre', 'Business Centre / Co-working', 'Café with Pantry', 'Gymnasium', 'Badminton Court', 'Aerobics & Zumba Studio', 'Spa', 'Kids Zone', 'Creative Section', 'Clinic'] }
  ];


  var GAL = [
    ['towers-riverside', 'Riverside towers'], ['tree-lined-road', 'Tree-lined avenues'], ['master-bedroom', 'Master bedroom'],
    ['jogging-track', 'Jogging track'], ['luxury-living', 'Living room'], ['natural-greenery', 'Natural greenery'], ['bedroom-view', 'Bedroom views'], ['luxury-bedroom', 'Bedroom interiors']
  ];

  var LOC = [
    { t: 'Transport', items: [['ROT', '0.1 km'], ['Mangalwar Peth Metro Station', '0.3 km'], ['Pune Railway Station', '1.9 km'], ['Pune Airport', '8.5 km']] },
    { t: 'Hospitals', items: [['Sancheti Hospital', '1.2 km'], ['Jehangir Hospital', '1.6 km'], ['Ruby Hall Clinic', '2.6 km']] },
    { t: 'Education', items: [['SSPM Day School', '0.2 km'], ['AISSMS College', '0.6 km'], ['Nowrosjee Wadia College', '2.8 km'], ['Fergusson College', '3.6 km'], ['Abasaheb Garware College', '4.4 km'], ['MIT College', '7.5 km']] },
    { t: 'Leisure', items: [['Boat Club', '0.9 km'], ['Sheraton Grand Hotel', '1.5 km'], ['Bund Garden', '3.2 km'], ['KOPA Mall', '5.9 km'], ['Westin Hotel', '6.1 km'], ['Westend Mall', '8 km']] },
    { t: 'Nearby', items: [['Shivaji Nagar', '1.6 km'], ['Shaniwar Wada', '2.2 km'], ['Swargate', '4.2 km'], ['Koregaon Park', '4.5 km'], ['Yerwada', '5.3 km'], ['Pune Cantonment', '5.7 km'], ['Kalyani Nagar', '8.3 km'], ['Viman Nagar', '10.4 km'], ['Baner', '11.2 km'], ['Kharadi', '11.5 km']] }
  ];

  /* FAQs only cover what the rest of the page doesn't */
  var FAQ = [
    ['Who are the architects and consultants?', 'Broadway Malyan (Principal Design Consultant), JW Consultants LLP (Structural), STX Landscape Architects (Landscape) and Terracon Ecotech Pvt. Ltd. (Environmental).'],
    ['What sustainability features are included?', 'Solar hot-water systems, solar lighting for landscapes and walkways, energy-efficient equipment for common services and a rainwater harvesting system that collects and stores rainwater for reuse.'],
    ['What fire-safety and electrical protection is provided?', 'All rooms are fitted with red water pipes as part of the fire-safety system, and homes feature an Intelligent Electricity Management System that protects against electrical fires and insulation failures caused by rodents.'],
    ['Are the apartments Vastu compliant?', 'Yes, all apartments are designed in accordance with Vastu principles, with layouts and orientation planned for a harmonious home.']
  ];

