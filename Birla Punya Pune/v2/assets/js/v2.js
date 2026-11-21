/* =========================================================================
   BIRLA PUNYA — VERSION 2 interactions
   Needs jQuery (vendor bundle) and lead-form.js (form validation + submit).
   ========================================================================= */
(function ($) {
  'use strict';

  /* ---------- SETTINGS (same as v1) ---------- */
  var CONTACT = { phone: '+919096330038', phoneLabel: '+91 90963 30038', whatsapp: '919096330038' };
  var AUTO_POPUP_DELAY = 25000;
  var V2 = 'assets/images/v2/';
  var IMG = 'assets/images/';

  /* ---------- DATA ---------- */
  var PLANS = [
    { id: '2bhk-a', name: '2 BHK – A', total: '1180 sq. ft. (109.66 sq. m)', carpet: '88.96 sq. m', floors: '2, 7, 12, 16', note: 'Open balcony 20.70 sq. m' },
    { id: '3bhk-c', name: '3 BHK – C', total: '1465 sq. ft. (136.08 sq. m)', carpet: '115.43 sq. m', floors: '2 to 14, 16 to 19', note: 'Open balcony 20.65 sq. m' },
    { id: '3bhk-e', name: '3 BHK – E', total: '1451 sq. ft. (134.81 sq. m)', carpet: '114.16 sq. m', floors: '3–6, 8–11, 13–14, 17–19', note: 'Open balcony 20.65 sq. m' },
    { id: '3bhk-d', name: '3 BHK – D + Study', total: '1629 sq. ft. (151.35 sq. m)', carpet: '119.13 sq. m', floors: '2, 7, 12, 16', note: 'Open balcony 18.46 sq. m · Enclosed balcony 13.76 sq. m · Study room' },
    { id: '3bhk-b', name: '3 BHK – B Garden', total: '1775 sq. ft. (164.89 sq. m)', carpet: '114.16 sq. m', floors: '1 (private garden unit)', note: 'Open balcony 22.03 sq. m · Open-to-sky terrace 28.70 sq. m' },
    { id: '3bhk-a', name: '3 BHK – A Garden', total: '1907 sq. ft. (177.20 sq. m)', carpet: '115.43 sq. m', floors: '1 (private garden unit)', note: 'Open balcony 22.03 sq. m · Open-to-sky terrace 39.74 sq. m' },
    { id: '4bhk-b', name: '4 BHK – B', total: '1805 sq. ft. (167.65 sq. m)', carpet: '119.10 sq. m', floors: '2 to 14, 16 to 19', note: 'Open balcony 23.52 sq. m · Enclosed balcony 25.03 sq. m · Staff room' },
    { id: '4bhk-c', name: '4 BHK – C', total: '1805 sq. ft. (167.65 sq. m)', carpet: '119.10 sq. m', floors: '3–6, 8–11, 13–14, 17–19', note: 'Open balcony 23.52 sq. m · Enclosed balcony 25.03 sq. m · Staff room' },
    { id: '4bhk-a', name: '4 BHK – A Garden', total: '2082 sq. ft. (193.44 sq. m)', carpet: '119.10 sq. m', floors: '1 (private garden unit)', note: 'Open balcony 24.82 sq. m · Enclosed balcony 25.03 sq. m · Terrace 24.49 sq. m' }
  ];

  /* [image, caption] — images from the brochure */
  var ZONES = [
    { title: 'The Clubhouse', text: 'A 40,000 sq.ft. grand clubhouse with Be Fit, Social and Creative Kids zones.', lead: ['clubhouse', 'The Clubhouse', 'Architecture'],
      cards: [['gym', 'Gymnasium'], ['badminton', 'Indoor badminton'], ['spa', 'Spa'], ['theatre', 'Mini theatre', 'Amenities'], ['hall', 'Multi-purpose hall'], ['cowork', 'Business centre'], ['cafe', 'Café with pantry'], ['kids-zone', 'Kids zone']],
      items: ['Gymnasium', 'Badminton Court', 'Aerobics & Zumba Studio', 'Spa', 'Multi-purpose Hall', 'Mini Theatre', 'Business Centre / Co-working', 'Café with Pantry', 'Clinic', 'Kids Zone', 'Creative Section'] },
    { title: 'The Courts', text: 'Pools, lawns and decks built around water and sunshine.', lead: ['courts', 'The Courts', 'Amenities'],
      cards: [['pool', 'Semi-Olympic pool', 'Amenities'], ['event-lawn', 'Event lawn'], ['kids-play', "Kid's play area"], ['sunken-lawn', 'Sunken lawn', 'Landscapes'], ['bbq', 'BBQ deck'], ['sun-deck', 'Sun deck']],
      items: ['Semi Olympic Pool', 'Toddler / Kids Pool', 'Lounge Pool', 'Lounge Deck', 'Event Lawn', 'Sunken Lawn', 'Sun Deck', 'BBQ Deck', "Kid's Play Area"] },
    { title: 'The Park', text: 'Landscaped greens, decks and walks for slow mornings and family evenings.', lead: ['park', 'The Park', 'Landscapes'],
      cards: [['pickleball', 'Pickleball court'], ['net-cricket', 'Net cricket'], ['forest-deck', 'Forest viewing deck'], ['hammock', 'Hammock deck'], ['siddha-walk', 'Siddha walk'], ['stretch-deck', 'Stretching deck'], ['mp-lawn', 'Multi-purpose lawn']],
      items: ['Pickle Ball Court', 'Net Cricket', 'Multi-Purpose Lawn', 'Multi-Purpose & Stretching Deck', 'Forest Viewing Deck', 'Hammock Deck', 'Sun Deck', 'Siddha Walk', 'Stage'] },
    { title: 'The Sky Deck', text: 'Elevated leisure with river and city views — social, fitness, entertainment and green zones.', lead: ['skydeck', 'The Sky Deck', 'Amenities'],
      cards: [],
      items: ['Mini Golf', 'Working Pods + Digital Zone', 'Library + Reading Lounge', 'Wall Games', 'Pool Table', 'Table Tennis', 'Walking Loop', 'Yoga Deck / Dance Studio', 'Senior Citizen Fitness Station', 'Outdoor Cinema', 'Sky Lounge', 'Swing Pods', 'Riverview Deck', 'Terrace Garden', 'Meditation Zone', 'Hammocks', 'Juice Bar', 'Fragrance Garden', 'Reflexology Path', 'Lantern Garden'] },
    { title: 'Urban Terrace', text: 'Arrival plaza, retail avenue and marketplace — open for access and use by the general public.', lead: ['retail', 'Retail arrival plaza'],
      cards: [],
      items: ['Main Gateway', 'Retail Avenue', 'Event Plaza', 'Retail Arrival Plaza', 'Marketplace'] }
  ];

  var GALLERY = [
    [V2 + 'lake-2.webp', 'Riverside towers', 'Architecture'], [V2 + 'lifedesigned.webp', 'LifeDesigned® living', 'Interiors'], [V2 + 'pool.webp', 'Semi-Olympic pool'],
    [V2 + 'courts.webp', 'The Courts'], [IMG + 'gallery/g-master-bedroom-lg.webp', 'Master bedroom', 'Interiors'], [V2 + 'skydeck.webp', 'The Sky Deck'],
    [V2 + 'location.webp', 'Towers in Central Pune', 'Architecture'], [V2 + 'clubhouse.webp', 'The Clubhouse'], [V2 + 'usp-3bhk.webp', 'Bedroom views', 'Interiors'],
    [V2 + 'park.webp', 'The Park'], [IMG + 'gallery/g-tree-lined-road-lg.webp', 'Tree-lined avenues', 'Landscapes'], [V2 + 'interior.webp', 'Living &amp; dining', 'Interiors'],
    [V2 + 'riverfront.webp', 'Riverfront', 'Architecture'], [V2 + 'sunken-lawn.webp', 'Sunken lawn'], [IMG + 'gallery/g-luxury-living-lg.webp', 'Living room', 'Interiors'],
    [V2 + 'usp-2bhk.webp', '2 BHK interiors', 'Interiors'], [V2 + 'theatre.webp', 'Mini theatre'], [IMG + 'gallery/g-natural-greenery-lg.webp', 'Natural greenery', 'Landscapes']
  ];

  var LOCATIONS = [
    { title: 'Transport', items: [['ROT', '0.1 km'], ['Mangalwar Peth Metro Station', '0.3 km'], ['Pune Railway Station', '1.9 km'], ['Pune Airport', '8.5 km']] },
    { title: 'Hospitals', items: [['Sancheti Hospital', '1.2 km'], ['Jehangir Hospital', '1.6 km'], ['Ruby Hall Clinic', '2.6 km']] },
    { title: 'Education', items: [['SSPM Day School', '0.2 km'], ['AISSMS College', '0.6 km'], ['Nowrosjee Wadia College', '2.8 km'], ['Fergusson College', '3.6 km'], ['Abasaheb Garware College', '4.4 km'], ['MIT College', '7.5 km']] },
    { title: 'Leisure', items: [['Boat Club', '0.9 km'], ['Sheraton Grand Hotel', '1.5 km'], ['Bund Garden', '3.2 km'], ['KOPA Mall', '5.9 km'], ['Westin Hotel', '6.1 km'], ['Westend Mall', '8 km']] },
    { title: 'Nearby', items: [['Shivaji Nagar', '1.6 km'], ['Shaniwar Wada', '2.2 km'], ['Swargate', '4.2 km'], ['Koregaon Park', '4.5 km'], ['Yerwada', '5.3 km'], ['Pune Cantonment', '5.7 km'], ['Kalyani Nagar', '8.3 km'], ['Viman Nagar', '10.4 km'], ['Baner', '11.2 km'], ['Kharadi', '11.5 km']] },
    { title: 'Business hubs', items: [['Commerzone IT Park, Yerwada', ''], ['Cerebrum IT Park, Kalyani Nagar', ''], ['Poonawalla Fincorp, Koregaon Park', ''], ['ICC Tech Park, SB Road', '']] }
  ];

  /* FAQs — from the official Birla Estates project page */
  var FAQS = [
    ['What is Birla Punya?', 'Birla Punya is a LifeDesigned® residential project by Birla Estates in Central Pune, offering 2, 3 and 4 BHK homes on approximately 5 acres.'],
    ['How many towers are part of Birla Punya?', 'Birla Punya has four towers in Central Pune.'],
    ['Where is Birla Punya located?', 'In the historic heart of Central Pune, where the city\'s cultural heritage is concentrated — near AISSMS College, Wellesley Road, Pune 411001.'],
    ['What are the no. of residences on each floor at Birla Punya?', 'Towers A and B have 8 residences per floor each, while Towers C and D have 4 residences per floor each.'],
    ['Who are the key architects and consultants involved in Birla Punya?', 'Broadway Malyan (Principal Design Consultant), JW Consultants LLP (Principal Structural Consultant), STX Landscape Architects (Landscape) and Terracon Ecotech Pvt. Ltd. (Environmental Consultant).'],
    ['What percentage of open space and greenery does Birla Punya offer?', 'Birla Punya offers 79% open spaces with greenery across the project.'],
    ['Is Birla Punya IGBC compliant?', 'Yes. Birla Punya holds IGBC Gold Pre-certification for its sustainable design and eco-friendly practices.'],
    ['What fire safety and electrical protection features are included?', 'All rooms have red water pipes as part of the fire safety system, and homes feature an Intelligent Electricity Management System that protects against electrical fires and insulation failures caused by rodents.'],
    ['What sustainable development features are included?', 'Solar hot water systems, solar lighting for landscapes and walkways, and energy-efficient equipment for common services.'],
    ['Does Birla Punya have a rainwater harvesting system?', 'Yes. Rainwater is collected and stored for reuse, reducing water wastage and conserving water.'],
    ['Are the apartments at Birla Punya Vastu compliant?', 'Yes. All apartments are designed according to Vastu principles.'],
    ['How do I get the price sheet or book a site visit?', 'Tap “Get Price Sheet” or “Book Site Visit”, or call / WhatsApp +91 90963 30038 — our relationship manager will share current pricing, offers, availability and a visit slot.']
  ];

  /* ---------- HELPERS ---------- */
  var $doc = $(document);
  var store = (window.LeadForm && window.LeadForm.store) || { get: function () { return null; }, set: function () {} };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var locks = 0;
  function lockScroll() { if (locks++ === 0) document.body.classList.add('is-locked'); }
  function unlockScroll() { if (locks > 0 && --locks === 0) document.body.classList.remove('is-locked'); }

  /* ---------- CONTACT LINKS ---------- */
  $('[data-tel]').attr('href', 'tel:' + CONTACT.phone);
  $('[data-tel-label]').text(CONTACT.phoneLabel);
  $('[data-wa]').attr('href', 'https://wa.me/' + CONTACT.whatsapp + '?text=' + encodeURIComponent('Hi, I am interested in Birla Punya, Pune. Please share details.'));
  $('#year').text(new Date().getFullYear());

  /* ---------- HEADER ---------- */
  var hd = document.getElementById('hd');
  function onScroll() { hd.classList.toggle('is-solid', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var $nav = $('#nav'), $burger = $('#burger');
  function menuClose() { $nav.removeClass('is-open'); $burger.attr('aria-expanded', 'false'); }
  $burger.on('click', function () { var open = !$nav.hasClass('is-open'); $nav.toggleClass('is-open', open); $burger.attr('aria-expanded', String(open)); });
  $nav.on('click', 'a', menuClose);

  // active link
  if ('IntersectionObserver' in window) {
    var links = {}; $nav.find('a[href^="#"]').each(function () { links[this.getAttribute('href').slice(1)] = this; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && links[e.target.id]) { $nav.find('a').removeClass('is-active'); links[e.target.id].classList.add('is-active'); } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }
  /* sliding gold marker under the active / hovered link */
  var nav = document.getElementById('nav'), marker = nav.querySelector('.hd__marker');
  function moveMarker(a) {
    if (!a || window.innerWidth <= 1180) { if (nav.classList.contains('has-marker')) nav.classList.remove('has-marker'); return; }
    marker.style.left = a.offsetLeft + 'px'; marker.style.width = a.offsetWidth + 'px'; if (!nav.classList.contains('has-marker')) nav.classList.add('has-marker');
  }
  new MutationObserver(function (list) { if (list.some(function (m) { return m.target.tagName === 'A'; })) moveMarker(nav.querySelector('a.is-active')); }).observe(nav, { subtree: true, attributes: true, attributeFilter: ['class'] });
  $(nav).on('mouseenter', 'a', function () { moveMarker(this); }).on('mouseleave', function () { moveMarker(nav.querySelector('a.is-active')); });
  $(window).on('resize', function () { moveMarker(nav.querySelector('a.is-active')); });

  /* ---------- HERO SLIDESHOW ---------- */
  (function () {
    var slides = $('#heroSlides .hero__slide'), dots = $('#heroDots'), cur = 0, DUR = 6000, timer;
    if (slides.length < 2) return;
    dots.html(slides.map(function (k) {
      return '<button type="button" role="tab" aria-selected="' + (k === 0) + '" data-i="' + k + '"><i></i>' + esc(this.getAttribute('data-cap')) + '</button>';
    }).get().join(''));
    function schedule() { clearTimeout(timer); timer = setTimeout(function () { go(cur + 1); }, DUR); }
    function go(n) {
      slides.eq(cur).removeClass('is-on');
      cur = (n + slides.length) % slides.length;
      var img = slides.eq(cur).find('img')[0];
      if (img.loading === 'lazy') img.loading = 'eager';
      slides.eq(cur).addClass('is-on');
      dots.find('button').each(function (k) {
        this.setAttribute('aria-selected', String(k === cur));
        this.classList.toggle('is-done', k < cur);
        var bar = this.firstChild; bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
      });
      schedule();
    }
    dots.on('click', 'button', function () { go(+this.getAttribute('data-i')); });
    // warm up the other slides after first paint
    $(window).on('load', function () { slides.find('img').each(function () { this.loading = 'eager'; }); });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    schedule();
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else schedule(); });
  })();

  /* ---------- REVEAL ---------- */
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-rv');
    var rv = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rv.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $('[data-rv]').each(function () { rv.observe(this); });
  }

  /* ---------- PRICING & FLOOR PLANS (edit TYPES / PLANS to add more) ---------- */
  var TYPES = [
    { key: '2 BHK', area: '869 – 907 sq.ft.', price: '1.96 – 2.11', img: 'usp-2bhk' },
    { key: '3 BHK', area: '1,443 – 1,473 sq.ft.', price: '3.76 – 3.86', img: 'usp-3bhk' },
    { key: '4 BHK', area: '1,735 – 1,798 sq.ft.', price: '4.58 – 4.97', img: 'interior' }
  ];
  $('#prTypes').html(TYPES.map(function (t, i) {
    return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' +
      '<span class="prx__thumb"><img src="' + V2 + t.img + '-sm.webp" alt="" loading="lazy" decoding="async"></span>' +
      '<span class="prx__txt"><b>' + esc(t.key) + '</b><small>' + esc(t.area) + ' carpet</small></span>' +
      '<span class="prx__price"><small>Price</small><b>&#8377;' + esc(t.price) + ' Cr*</b></span></button>';
  }).join(''));
  var curPlans = [];
  function showPlan(i) {
    var p = curPlans[i]; if (!p) return;
    $('#prLayouts button').attr('aria-selected', 'false').eq(i).attr('aria-selected', 'true');
    var img = document.getElementById('planImg');
    img.classList.remove('is-in'); void img.offsetWidth;
    img.src = IMG + 'plans/' + p.id + '-thumb.webp'; img.alt = p.name + ' floor plan preview'; img.classList.add('is-in');
    $('#planName').text(p.name); $('#planTotal').text(p.total); $('#planCarpet').text(p.carpet); $('#planFloors').text(p.floors); $('#planNote').text(p.note);
    $('#planPreview, #planEnquire').attr('data-enquire', 'Plan & Price - ' + p.name);
  }
  function showType(i) {
    var t = TYPES[i];
    $('#prTypes button').attr('aria-selected', 'false').eq(i).attr('aria-selected', 'true');
    curPlans = PLANS.filter(function (p) { return p.name.indexOf(t.key) === 0; });
    $('#prLayouts').html(curPlans.map(function (p, k) {
      return '<button type="button" role="tab" aria-selected="' + (k === 0) + '" data-i="' + k + '">' + esc(p.name.replace(t.key + ' – ', 'Type ')) + '</button>';
    }).join(''));
    showPlan(0);
  }
  $('#prTypes').on('click', 'button', function () { showType(+this.getAttribute('data-i')); });
  $('#prLayouts').on('click', 'button', function () { showPlan(+this.getAttribute('data-i')); });
  showType(0);

  /* ---------- AMENITIES ---------- */
  $('#amTabs').html(ZONES.map(function (z, i) {
    return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(z.title) + '</button>';
  }).join(''));
  function setLead(src, cap) {
    var img = document.getElementById('amLeadImg');
    img.style.opacity = 0;
    var tmp = new Image();
    tmp.onload = tmp.onerror = function () { img.src = src; img.alt = cap; img.style.opacity = 1; };
    tmp.src = src;
    $('#amLeadCap').text(cap);
  }
  function showZone(i) {
    var z = ZONES[i];
    $('#amTabs button').attr('aria-selected', 'false').eq(i).attr('aria-selected', 'true');
    $('#amTitle').text(z.title); $('#amText').text(z.text);
    setLead(V2 + z.lead[0] + '.webp', z.lead[1]);
    $('#amCards').html(z.cards.map(function (c) {
      return '<button type="button" aria-pressed="false" data-src="' + V2 + c[0] + '.webp" data-cap="' + esc(c[1]) + '"><figure class="arch arch--sm"><img src="' + V2 + c[0] + '.webp" alt="" loading="lazy" decoding="async"></figure>' + esc(c[1]) + '</button>';
    }).join('')).toggle(z.cards.length > 0);
    $('#amList').html(z.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join(''));
  }
  $('#amTabs').on('click', 'button', function () { showZone(+this.getAttribute('data-i')); });
  $('#amCards').on('click', 'button', function () {
    $('#amCards button').attr('aria-pressed', 'false'); this.setAttribute('aria-pressed', 'true');
    setLead(this.getAttribute('data-src'), this.getAttribute('data-cap'));
  });
  showZone(0);

  /* ---------- GALLERY: main viewer + thumbnail rail (add items to GALLERY) ---------- */
  var gvList = GALLERY.slice(), gvI = 0;
  function gvSmall(src) { return src.indexOf(V2) === 0 ? src.replace('.webp', '-sm.webp') : src.replace('-lg.webp', '-sm.webp'); }
  var cats = ['All'].concat(GALLERY.map(function (g) { return g[2]; }).filter(function (c, i, a) { return c && a.indexOf(c) === i; }));
  $('#gvFilters').html(cats.map(function (c, i) { return '<button type="button" aria-pressed="' + (i === 0) + '" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join(''));
  function gvRenderThumbs() {
    $('#gvThumbs').html(gvList.map(function (g, i) {
      return '<button type="button" data-i="' + i + '" aria-label="' + g[1] + '"><img src="' + gvSmall(g[0]) + '" alt="" loading="lazy" decoding="async"><span>' + g[1] + '</span></button>';
    }).join(''));
  }
  function gvShow(i) {
    gvI = (i + gvList.length) % gvList.length;
    var g = gvList[gvI], img = document.getElementById('gvImg');
    img.classList.remove('is-in'); void img.offsetWidth;
    img.src = g[0]; img.alt = $('<i>').html(g[1]).text(); img.classList.add('is-in');
    $('#gvCap').html(g[1]);
    $('#gvPos').text(String(gvI + 1).padStart(2, '0') + ' / ' + String(gvList.length).padStart(2, '0'));
    var $t = $('#gvThumbs button').removeClass('is-on').eq(gvI).addClass('is-on');
    if ($t[0]) { var box = document.getElementById('gvThumbs'), el = $t[0]; box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' }); }
  }
  $('#gvFilters').on('click', 'button', function () {
    var c = this.getAttribute('data-c');
    $('#gvFilters button').attr('aria-pressed', 'false'); this.setAttribute('aria-pressed', 'true');
    gvList = c === 'All' ? GALLERY.slice() : GALLERY.filter(function (g) { return g[2] === c; });
    gvRenderThumbs(); gvShow(0);
  });
  $('#gvThumbs').on('click', 'button', function () { gvShow(+this.getAttribute('data-i')); });
  $('#gvPrev').on('click', function () { gvShow(gvI - 1); });
  $('#gvNext').on('click', function () { gvShow(gvI + 1); });
  gvRenderThumbs(); gvShow(0);

  /* ---------- LIGHTBOX ---------- */
  var $lb = $('#lb'), $modal = $('#leadModal'), lbList = [], lbI = 0;
  function lbShow(i) {
    lbI = (i + lbList.length) % lbList.length;
    $('#lbImg').attr({ src: lbList[lbI][0], alt: $('<i>').html(lbList[lbI][1]).text() });
    $('#lbCap').html(lbList[lbI][1]);
    $lb.find('.lb__nav').toggle(lbList.length > 1);
  }
  function lbOpen(list, i) { lbList = list; $lb.addClass('is-open').attr('aria-hidden', 'false'); lockScroll(); lbShow(i || 0); }
  function lbClose() { if (!$lb.hasClass('is-open')) return; $lb.removeClass('is-open').attr('aria-hidden', 'true'); unlockScroll(); }
  $('#gvOpen').on('click', function () { lbOpen(gvList, gvI); });
  $doc.on('click', '[data-lb-src]', function () { lbOpen([[this.getAttribute('data-lb-src'), esc(this.getAttribute('data-lb-title'))]], 0); });
  $lb.on('click', '[data-lb-close]', lbClose)
    .on('click', '[data-lb-prev]', function () { lbShow(lbI - 1); })
    .on('click', '[data-lb-next]', function () { lbShow(lbI + 1); })
    .on('click', function (e) { if (e.target === this) lbClose(); });

  /* ---------- LOCATION ---------- */
  $('#lcTabs').html(LOCATIONS.map(function (l, i) {
    return '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(l.title) + '</button>';
  }).join(''));
  function showLoc(i) {
    $('#lcTabs button').attr('aria-selected', 'false').eq(i).attr('aria-selected', 'true');
    $('#lcList').html(LOCATIONS[i].items.map(function (it) { return '<li><span>' + esc(it[0]) + '</span>' + (it[1] ? '<b>' + esc(it[1]) + '</b>' : '') + '</li>'; }).join(''));
  }
  $('#lcTabs').on('click', 'button', function () { showLoc(+this.getAttribute('data-i')); });
  showLoc(0);

  /* ---------- FAQ ---------- */
  $('#fqAcc').html(FAQS.map(function (f, i) {
    return '<div class="acc__item"><button type="button" class="acc__q" aria-expanded="' + (i === 0) + '" aria-controls="fa' + i + '">' + esc(f[0]) + '<i aria-hidden="true"></i></button><div class="acc__a" id="fa' + i + '"><div><p>' + esc(f[1]) + '</p></div></div></div>';
  }).join(''));
  $('#fqAcc').on('click', '.acc__q', function () {
    var open = this.getAttribute('aria-expanded') === 'true';
    $('#fqAcc .acc__q').attr('aria-expanded', 'false');
    this.setAttribute('aria-expanded', String(!open));
  });

  /* ---------- DYNAMIC SLIDERS ----------
     Any element with [data-slider] scrolls sideways with arrows + progress.
     Add more items (in the HTML or the data arrays above) and the section
     keeps the same height. */
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>';
  function sliderUpdate(track) {
    var nav = track._snav; if (!nav) return;
    var max = track.scrollWidth - track.clientWidth;
    nav.hidden = max < 4;
    var ratio = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
    var bar = nav.querySelector('.snav__bar i');
    bar.style.width = Math.max(12, ratio * 100) + '%';
    bar.style.transform = 'translateX(' + (max > 0 ? (track.scrollLeft / max) * (100 / Math.max(ratio, .12) - 100) : 0) + '%)';
    nav.querySelector('[data-dir="-1"]').disabled = track.scrollLeft < 4;
    nav.querySelector('[data-dir="1"]').disabled = track.scrollLeft > max - 4;
  }
  function sliderInit(track) {
    if (!track._snav) {
      var nav = document.createElement('div');
      nav.className = 'snav';
      nav.innerHTML = '<button type="button" data-dir="-1" aria-label="Previous">' + ARROW + '</button><span class="snav__bar"><i></i></span><button type="button" data-dir="1" aria-label="Next" style="transform:scaleX(-1)">' + ARROW + '</button>';
      track.parentNode.insertBefore(nav, track.nextSibling);
      track._snav = nav;
      nav.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var item = track.firstElementChild;
        var step = item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16) : track.clientWidth;
        track.scrollBy({ left: +b.getAttribute('data-dir') * step, behavior: 'smooth' });
      });
      track.addEventListener('scroll', function () { sliderUpdate(track); }, { passive: true });
    }
    sliderUpdate(track);
  }
  function slidersRefresh() { $('[data-slider]').each(function () { sliderInit(this); }); }
  slidersRefresh();
  $(window).on('resize load', slidersRefresh);
  $('#amTabs').on('click', 'button', function () { var t = document.getElementById('amCards'); t.scrollLeft = 0; sliderInit(t); });

  /* ---------- ANIMATIONS: slider stagger + counters ---------- */
  if ('IntersectionObserver' in window) {
    $('[data-slider]').each(function () { $(this).children().each(function (k) { this.style.setProperty('--i', Math.min(k, 6)); }); });
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        if (e.target.hasAttribute('data-count')) countUp(e.target);
        io2.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    $('[data-slider], [data-count]').each(function () { io2.observe(this); });
  }
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count')), t0 = null;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    (function step(ts) {
      t0 = t0 || ts; var k = Math.min(1, (ts - t0) / 1400), v = end * (1 - Math.pow(1 - k, 3));
      el.textContent = Math.round(v); if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* ---------- LEAD MODAL (same behaviour as v1) ---------- */
  function modalTitleFor(source) {
    if (/visit/i.test(source)) return 'Book a site visit';
    if (/20:80|offer|eoi/i.test(source)) return 'Unlock the festive offer';
    if (/plan.*price/i.test(source)) return 'Get your plan & price';
    if (/plan/i.test(source)) return 'Get the unit plan';
    if (/brochure|full list/i.test(source)) return 'Download the brochure';
    if (/price|cost/i.test(source)) return 'Get the price sheet';
    return 'Enquire now';
  }
  function modalOpen(source) {
    $('#modalTitle').text(modalTitleFor(source || ''));
    $modal.find('.lead-form').attr('data-source', source || 'Popup Form');
    menuClose();
    if (!$modal.hasClass('is-open')) { $modal.addClass('is-open').attr('aria-hidden', 'false'); lockScroll(); }
    store.set('bp_popup_seen', '1', true);
  }
  function modalClose() { if (!$modal.hasClass('is-open')) return; $modal.removeClass('is-open').attr('aria-hidden', 'true'); unlockScroll(); }
  $doc.on('click', '[data-enquire]', function (e) { e.preventDefault(); e.stopPropagation(); modalOpen(this.getAttribute('data-enquire')); });
  $doc.on('keydown', '[data-enquire][role="button"]', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); modalOpen(this.getAttribute('data-enquire')); } });
  $modal.on('click', '[data-close]', modalClose);
  $doc.on('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($lb.hasClass('is-open')) lbClose(); else if ($modal.hasClass('is-open')) modalClose(); else menuClose();
  });
  setTimeout(function () {
    if (store.get('bp_lead') === '1' || store.get('bp_popup_seen', true)) return;
    if ($modal.hasClass('is-open') || $lb.hasClass('is-open')) return;
    modalOpen('Auto Popup');
  }, AUTO_POPUP_DELAY);
})(jQuery);
