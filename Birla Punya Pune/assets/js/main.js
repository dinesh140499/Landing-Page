/* =========================================================================
   BIRLA PUNYA — data + interactions (jQuery)
   Sources: Tower C Layouts + Interior Specifications brochures (plans, specs,
   RERA), birlaestates.com/birla-punya-pune (configs, amenities, location, FAQs)
   ========================================================================= */
(function ($) {
  'use strict';

  /* ---------- SETTINGS — check these before going live ---------- */
  var C = {
    leadEmail: 'officialdinesh1499@gmail.com', // FormSubmit sends every enquiry here
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

  /* ---------- helpers ---------- */
  var $win = $(window), $doc = $(document), $html = $('html');
  var store = {
    get: function (k, ses) { try { return (ses ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, ses) { try { (ses ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };
  var lock = function () { $html.css('overflow', 'hidden'); };
  var unlock = function () { $html.css('overflow', ''); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  $('[data-tel]').attr('href', 'tel:' + C.phone);
  $('[data-tel-label]').text(C.phoneLabel);
  $('#year').text(new Date().getFullYear());

  /* ---------- header: hidden over the banner, slides in after it ---------- */
  var hdEl = document.getElementById('hd'), heroEl = document.getElementById('home');
  function hdToggle() { var solid = window.scrollY > 40 || $('#menu').hasClass('is-open'); hdEl.classList.add('is-shown'); hdEl.classList.toggle('is-solid', solid); }
  $win.on('scroll resize', hdToggle); hdToggle();

  /* ---------- menu ---------- */
  var $menu = $('#menu'), $burger = $('#burger');
  function menuClose() { $menu.removeClass('is-open').attr('aria-hidden', 'true'); $burger.attr('aria-expanded', 'false'); unlock(); }
  $burger.on('click', function () { var open = !$menu.hasClass('is-open'); $menu.toggleClass('is-open', open).attr('aria-hidden', String(!open)); $burger.attr('aria-expanded', String(open)); open ? lock() : unlock(); });
  $menu.on('click', 'a', menuClose);

  /* active nav link */
  var $nav = $('.hd__nav a');
  if ('IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { $nav.removeClass('is-on').filter('[href="#' + e.target.id + '"]').addClass('is-on'); } }); }, { rootMargin: '-45% 0px -50% 0px' });
    $nav.each(function () { var t = document.querySelector(this.getAttribute('href')); if (t) navIo.observe(t); });
  }

  /* ---------- hero slider ---------- */
  var $hs = $('#heroSlides img'), hI = 0;
  $('#heroDots').html('<button type="button" class="hd-arrow" data-hs="-1" aria-label="Previous slide">&#8592;</button>' + $hs.map(function (i) { return '<button type="button" class="hd-num' + (i ? '' : ' is-on') + '" aria-label="Slide ' + (i + 1) + '"><span>0' + (i + 1) + '</span><i></i></button>'; }).get().join('') + '<button type="button" class="hd-arrow" data-hs="1" aria-label="Next slide">&#8594;</button>');
  function heroGo(i) {
    hI = (i + $hs.length) % $hs.length;
    var el = $hs[hI];
    if (el.dataset.src) { var so = el.parentNode.querySelector('source[data-srcset]'); if (so) { so.srcset = so.dataset.srcset; so.removeAttribute('data-srcset'); } el.src = el.dataset.src; el.removeAttribute('data-src'); }
    $hs.removeClass('is-on').eq(hI).addClass('is-on');
    $('#heroDots .hd-num').removeClass('is-on').eq(hI).addClass('is-on'); hLast = Date.now();
  }
  $('#heroDots').on('click', '.hd-num', function () { heroGo($(this).index() - 1); }).on('click', '[data-hs]', function () { heroGo(hI + +$(this).data('hs')); });
  var hLast = Date.now(); setInterval(function () { if (!document.hidden && Date.now() - hLast >= 5400) heroGo(hI + 1); }, 200);

  /* ---------- banner typology chips (from CONFIGS) ---------- */
  $('#heroTypes').html($.map(CONFIGS, function (c) {
    return '<li><button type="button" data-enquire="Banner — ' + esc(c.type) + '">' + esc(c.type) + '</button></li>';
  }).join(''));

  /* ---------- configurations ---------- */
  $('#cfList').html($.map(CONFIGS, function (c, i) {
    return '<article class="cfr' + (c.tag ? ' cfr--hl' : '') + '">' +
      '<span class="cfr__no">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
      '<div class="cfr__type"><b>' + esc(c.type) + '</b>' + (c.tag ? '<em>' + esc(c.tag) + '</em>' : '<small>Residences</small>') + '</div>' +
      '<div class="cfr__area"><small>Carpet area</small><b>' + esc(c.area) + ' <i>sq. ft.</i></b><span>' + esc(c.sqm) + ' sq. m</span></div>' +
      '<div class="cfr__price"><small>Price</small><b>' + (c.price ? '<span class="rs">₹</span>' + esc(c.price) + '<sup>*</sup>' : 'On request') + '</b></div>' +
      '<button type="button" class="btn ' + (c.tag ? 'btn--gold' : 'btn--ghost') + '" data-enquire="Price — ' + esc(c.type) + '">Check Price</button></article>';
  }).join(''));

  /* ---------- floor plans ---------- */
  var lockSvg = '<img src="' + IMG + 'icons/icon-lock.webp" width="56" height="76" alt="">';
  $('#fpGrid').html($.map(PLANS, function (p) {
    var sq = p.total.split(' (')[0], garden = /Garden/.test(p.name), study = /Study/.test(p.name);
    return '<article class="fpc" data-bhk="' + p.id.charAt(0) + '">' +
      '<button type="button" class="fpc__img" data-enquire="Floor Plan — ' + esc(p.name) + '"><img src="' + IMG + 'plans/' + p.id + '-thumb.webp" width="720" height="382" decoding="async" alt="' + esc(p.name) + ' floor plan preview"><span class="fpc__lock">' + lockSvg + 'View plan</span></button>' +
      '<div class="fpc__body"><div class="fpc__top"><h3>' + esc(p.name.replace(/ (Garden|\+ Study)$/, '')) + '</h3>' + (garden ? '<span class="fpc__tag">Private garden</span>' : study ? '<span class="fpc__tag">+ Study</span>' : '') + '</div>' +
      '<p class="fpc__area"><b>' + sq.replace(' sq. ft.', '') + '</b> sq. ft. total area</p>' +
      '<dl><div><dt>RERA carpet</dt><dd>' + p.carpet + '</dd></div><div><dt>Floors</dt><dd>' + esc(p.floors.replace(' (private garden unit)', '')) + '</dd></div></dl>' +
      '<button type="button" class="fpc__cta" data-enquire="Floor Plan — ' + esc(p.name) + '">Get plan &amp; price <span>&#8594;</span></button></div></article>';
  }).join(''));
  $('#fpTabs').on('click', '.tab', function () {
    var f = $(this).data('f') + '';
    $('#fpTabs .tab').removeClass('is-on'); $(this).addClass('is-on');
    $('#fpGrid .fpc').each(function () { $(this).toggle(f === 'all' || $(this).data('bhk') + '' === f); });
    document.getElementById('fpGrid').scrollTo({ left: 0 });
  });
  $('[data-fp]').on('click', function () { var el = document.getElementById('fpGrid'); el.scrollBy({ left: +$(this).data('fp') * (el.querySelector('.fpc').offsetWidth + 20), behavior: 'smooth' }); });

  /* ---------- amenities ---------- */
  $('#amGrid').html($.map(AMEN, function (a, i) {
    var top = a.items.slice(0, 4), more = a.items.length - top.length;
    return '<article class="amc" data-i="' + i + '"><button type="button" class="amc__img" aria-label="View ' + esc(a.t) + ' images"><img src="' + IMG + 'amenities/a-' + a.img[0] + '-sm.webp" width="600" height="300" loading="lazy" decoding="async" alt="' + esc(a.t) + '"><span class="amc__n">' + a.items.length + '</span></button>' +
      '<div class="amc__body"><h3>' + esc(a.t) + '</h3><ul>' + $.map(top, function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      (more > 0 ? '<button type="button" class="amc__more" data-enquire="Amenities — ' + esc(a.t) + '">+' + more + ' more</button>' : '') + '</div></article>';
  }).join(''));
  $('#amGrid').on('click', '.amc__img', function () { var a = AMEN[+$(this).closest('.amc').data('i')]; lbOpen($.map(a.img, function (n) { return { src: IMG + 'amenities/a-' + n + '-lg.webp', title: a.t + ' · Artist\'s impression' }; }), 0); });

  /* ---------- specifications + FAQ accordions ---------- */
  $('#fqAcc').html($.map(FAQ, function (f, i) { return '<details' + (i ? '' : ' open') + '><summary>' + esc(f[0]) + '</summary><div class="acc__body"><p>' + esc(f[1]) + '</p></div></details>'; }).join(''));
  $('.acc details').on('toggle', function () { if (this.open) $(this).siblings('details[open]').removeAttr('open'); });

  /* ---------- gallery ---------- */
  var GSHOW = [4, 2, 0, 6, 7];  /* large renders in the big tiles */
  var galList = $.map(GAL, function (g) { return { src: IMG + 'gallery/g-' + g[0] + '-lg.webp', title: g[1] + ' · Artist\'s impression' }; });
  $('#glMosaic').html($.map(GSHOW, function (gi, k) {
    var g = GAL[gi], more = k === GSHOW.length - 1 ? '<span class="gl__more"><b>+' + (GAL.length - GSHOW.length + 1) + '</b>View all photos</span>' : '';
    return '<button type="button" class="gl__tile" data-i="' + gi + '"><img src="' + IMG + 'gallery/g-' + g[0] + (k < 2 ? '-lg' : '-sm') + '.webp" loading="lazy" decoding="async" alt="' + esc(g[1]) + '"><span class="gl__cap">' + esc(g[1]) + '</span>' + more + '</button>';
  }).join(''));
  $('#glMosaic').on('click', '.gl__tile', function () { lbOpen(galList, +$(this).data('i')); });

  /* ---------- location ---------- */
  $('#lcTabs').html($.map(LOC, function (l, i) { return '<button type="button" class="tab' + (i ? '' : ' is-on') + '" role="tab" data-i="' + i + '">' + l.t + '</button>'; }).join(''));
  function lcShow(i) {
    $('#lcTabs .tab').removeClass('is-on').eq(i).addClass('is-on');
    $('#lcList').html($.map(LOC[i].items, function (x) { var km = x[1].split(' '); return '<li><b>' + km[0] + '<small>km</small></b><span>' + esc(x[0]) + '</span></li>'; }).join(''));
  }
  $('#lcTabs').on('click', '.tab', function () { lcShow(+$(this).data('i')); });
  lcShow(0);
  $('#lcMap').on('click', function () { lbOpen([{ src: IMG + 'misc/map.webp', title: 'Birla Punya location map · Source: Google Maps' }], 0); });

  /* ---------- footer disclaimer ---------- */
  $('#ftMore').on('click', function () { var o = $('#ftDisc').toggleClass('is-open').hasClass('is-open'); $(this).text(o ? 'Read less' : 'Read more').attr('aria-expanded', String(o)); });

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    var rvIo = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rvIo.unobserve(e.target); } }); }, { rootMargin: '0px 0px -40px 0px' });
    $('[data-rv]').each(function () { rvIo.observe(this); });
  } else $('[data-rv]').addClass('is-in');

  /* ---------- lightbox ---------- */
  var $lb = $('#lb'), lbList = [], lbI = 0;
  function lbShow(i) { lbI = (i + lbList.length) % lbList.length; var it = lbList[lbI]; $('#lbImg').attr({ src: it.src, alt: it.title }); $('#lbCap').text(it.title); $lb.find('.lb__nav').toggle(lbList.length > 1); }
  function lbOpen(list, i) { lbList = list; $lb.addClass('is-open').attr('aria-hidden', 'false'); lock(); lbShow(i || 0); }
  function lbClose() { $lb.removeClass('is-open').attr('aria-hidden', 'true'); if (!$modal.hasClass('is-open')) unlock(); }
  $lb.on('click', '[data-lb-close]', lbClose).on('click', '[data-lb-prev]', function () { lbShow(lbI - 1); }).on('click', '[data-lb-next]', function () { lbShow(lbI + 1); })
    .on('click', function (e) { if (e.target === this) lbClose(); });

  /* ---------- lead modal ---------- */
  var $modal = $('#leadModal');
  function mOpen(src) {
    var t = /visit/i.test(src) ? 'Book a site visit' : /plan/i.test(src) ? 'Get the unit plan' : /brochure|full list/i.test(src) ? 'Download the brochure' : /price|cost/i.test(src) ? 'Get the price sheet' : 'Enquire now';
    $('#modalTitle').text(t);
    $modal.find('.lead-form').attr('data-source', src || 'Popup Form');
    $modal.addClass('is-open').attr('aria-hidden', 'false'); lock(); store.set('bp_popup_seen', '1', true);
    if ($menu.hasClass('is-open')) menuClose();
  }
  function mClose() { $modal.removeClass('is-open').attr('aria-hidden', 'true'); if (!$lb.hasClass('is-open')) unlock(); }
  $doc.on('click', '[data-enquire]', function (e) { e.preventDefault(); mOpen($(this).attr('data-enquire')); });
  $modal.on('click', '[data-close]', mClose);
  $doc.on('keydown', function (e) { if (e.key === 'Escape') { if ($lb.hasClass('is-open')) lbClose(); else if ($modal.hasClass('is-open')) mClose(); else if ($menu.hasClass('is-open')) menuClose(); } });
  setTimeout(function () { if (store.get('bp_lead') !== '1' && !store.get('bp_popup_seen', true) && !$modal.hasClass('is-open') && !$lb.hasClass('is-open')) mOpen('Auto Popup'); }, 20000);

  /* ---------- forms → FormSubmit → thank-you ---------- */
  var utm = (function () { var o = {}, q = new URLSearchParams(location.search); ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) { var v = q.get(k) || store.get('bp_' + k, true); if (v) { o[k] = v; store.set('bp_' + k, v, true); } }); return o; })();
  $doc.on('submit', '.lead-form', function (e) {
    e.preventDefault();
    var $f = $(this), $m = $f.find('.form-msg').text(''), v = function (n) { return $.trim($f.find('[name=' + n + ']').val() || ''); };
    if ($f.find('[name=_honey]').val()) return;
    var chk = window.LeadForm.validate($f);
    if (!chk.ok) { $m.text(chk.consent ? 'Please correct the fields marked above.' : 'Please accept the consent to continue.'); return; }
    var src = $f.attr('data-source') || 'Website';
    $f.addClass('is-loading'); $m.text('Sending…');
    $.ajax({ url: 'https://formsubmit.co/ajax/' + C.leadEmail, method: 'POST', dataType: 'json', contentType: 'application/json', timeout: 15000,
      data: JSON.stringify($.extend({ _subject: 'New Lead — Birla Punya — ' + v('name') + ' (' + src + ')', _template: 'table', _captcha: 'false',
        Name: v('name'), Phone: chk.phone, Country: chk.country, Email: v('email'), Message: v('message'), 'Lead Source': src, Page: location.href,
        'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) }, utm)) })
      .done(function () {
        store.set('bp_lead', '1');
        window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'lead_submit', lead_source: src });
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
        setTimeout(function () { location.href = 'thank-you.html?name=' + encodeURIComponent(v('name').split(' ')[0]); }, 300);
      })
      .fail(function () { $m.html('Could not send right now — please call us on <a href="tel:' + C.phone + '" style="text-decoration:underline">' + C.phoneLabel + '</a>.'); })
      .always(function () { $f.removeClass('is-loading'); });
  });
})(jQuery);
