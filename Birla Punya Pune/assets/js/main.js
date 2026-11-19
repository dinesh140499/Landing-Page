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
  var galleryImageSizes = '(max-width: 900px) calc(100vw - 48px), (max-width: 1300px) calc(100vw - 350px), 946px';
  function applyPhoto(image, src, sizes) {
    var source = window.BirlaImageSources && window.BirlaImageSources[src];
    image.decoding = 'async';
    if (source) {
      image.width = source.width; image.height = source.height;
      image.sizes = sizes || image.getAttribute('sizes') || '(max-width: 600px) 100vw, (max-width: 900px) 70vw, 640px';
      image.srcset = source.srcset;
    }
    image.src = src;
  }

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
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var G = window.gsap, ST = window.ScrollTrigger;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anim = !!(G && ST) && !reduce;
  var lenis = null;
  var lock = function () { $html.css('overflow', 'hidden'); if (lenis) lenis.stop(); };
  var unlock = function () { $html.css('overflow', ''); if (lenis) lenis.start(); };

  /* Fade out before replacing text; cancel earlier transitions on rapid input. */
  var contentTransitions = {};
  function smoothContent(key, selector, render) {
    var nodes = $(selector);
    if (contentTransitions[key]) contentTransitions[key].kill();
    if (!anim) { render(); return; }
    G.killTweensOf(nodes);
    contentTransitions[key] = G.timeline()
      .to(nodes, { opacity: .1, y: 3, duration: .14, ease: 'power1.out' })
      .call(render)
      .to(nodes, { opacity: 1, y: 0, duration: .42, ease: 'power2.out', clearProps: 'transform,opacity' });
  }

  $('[data-tel]').attr('href', 'tel:' + C.phone);
  $('[data-tel-label]').text(C.phoneLabel);
  $('#year').text(new Date().getFullYear());

  /* =====================================================================
     RENDER
     ===================================================================== */

  /* One selection drives the plan preview, published areas and enquiry source. */
  var residenceType = '2', residencePlan = null;
  var $residenceTypes = $('#residenceTypes');
  $residenceTypes.html(['2', '3', '4'].map(function (type) {
    var count = PLANS.filter(function (p) { return p.id.charAt(0) === type; }).length;
    return '<button type="button" role="tab" id="residenceType' + type + '" aria-controls="residencePanel" aria-selected="false" tabindex="-1" data-type="' + type + '"><b>' + type + ' BHK</b><span>' + count + (count === 1 ? ' layout' : ' layouts') + '</span></button>';
  }).join(''));
  function residenceShow(id, announce) {
    var p = PLANS.filter(function (p) { return p.id === id; })[0], type = p.id.charAt(0);
    function renderResidence() {
    residencePlan = p;
    var style = /Garden/.test(p.name) ? 'Private garden' : /Study/.test(p.name) ? 'With study' : 'Standard layout';
    $('#residenceLayout').val(p.id);
    $('#residenceName').text(type + ' BHK');
    $('#residenceStyle').text(style);
    $('#residenceLayoutName, #residencePlanLabel').text(p.name);
    $('#residenceTotal').html('<b>' + esc(p.total.split(' sq. ft.')[0]) + '</b> sq. ft.');
    $('#residenceCarpet').text(p.carpet);
    $('#residenceFloors').text(p.floors);
    $('#residenceFeatures').text(p.note);
    $('#residenceImage').attr({ src: IMG + 'plans/' + p.id + '-thumb.webp', alt: p.name + ' floor plan preview' });
    $('#residencePreview, #residenceEnquire').attr('data-enquire', 'Plan & Price - ' + p.name);
    $('#residencePreview').attr('aria-label', 'Request the detailed plan and price for ' + p.name);
    $('#residenceVisit').attr('data-enquire', 'Site Visit - ' + p.name);
    if (announce) $('#residenceStatus').text(p.name + ' selected. Total area ' + p.total + '. Price on request.');
    if (ST && announce) ST.refresh();
    }
    if (announce) smoothContent('residence', '.residences__preview, .residences__name, .residences__layout-name, .residences__areas, .residences__specs', renderResidence);
    else renderResidence();
  }
  function residenceChoose(type, announce) {
    residenceType = type;
    var options = PLANS.filter(function (p) { return p.id.charAt(0) === type; });
    $residenceTypes.find('[role="tab"]').each(function () {
      var selected = this.getAttribute('data-type') === type;
      $(this).attr({ 'aria-selected': String(selected), tabindex: selected ? '0' : '-1' });
    });
    $('#residencePanel').attr('aria-labelledby', 'residenceType' + type);
    $('#residenceLayout').html(options.map(function (p) { return '<option value="' + p.id + '">' + esc(p.name) + '</option>'; }).join(''));
    residenceShow(options[0].id, announce);
  }
  $residenceTypes.on('click', '[role="tab"]', function () { residenceChoose(this.getAttribute('data-type'), true); });
  $residenceTypes.on('keydown', '[role="tab"]', function (e) {
    var tabs = $residenceTypes.find('[role="tab"]'), index = tabs.index(this);
    if (e.key === 'ArrowRight') index = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') index = (index + tabs.length - 1) % tabs.length;
    else if (e.key === 'Home') index = 0;
    else if (e.key === 'End') index = tabs.length - 1;
    else return;
    e.preventDefault(); tabs.eq(index).trigger('focus').trigger('click');
  });
  $('#residenceLayout').on('change', function () { residenceShow(this.value, true); });
  residenceChoose('2', false);
  $('.residences__more summary').on('click', function (event) {
    if (reduce) return;
    event.preventDefault();
    var details = this.parentNode, list = $(details).find('.residences__specs');
    list.stop(true, true);
    if (details.open) {
      list.slideUp(260, function () { details.open = false; list.css('display', ''); if (ST) ST.refresh(); });
    } else {
      details.open = true;
      list.hide().slideDown(300, function () { list.css('display', ''); if (ST) ST.refresh(); });
    }
  });
  $('.residences__more').on('toggle', function () { if (reduce && ST) ST.refresh(); });

  /* amenities — list drives a sticky image stage */
  $('#amStage').html($.map(AMEN, function (a, i) {
    return '<figure' + (i ? '' : ' class="is-on"') + '><img src="' + IMG + 'amenities/a-' + a.img[0] + '-lg.webp" loading="lazy" decoding="async" alt="' + esc(a.t) + '"><figcaption>' + esc(a.t) + ' · Artist\'s impression</figcaption></figure>';
  }).join(''));
  $('#amList').html($.map(AMEN, function (a, i) {
    return '<li class="ami' + (i ? '' : ' is-on') + '" data-i="' + i + '"><div class="ami__h"><small>' + pad(i + 1) + '</small><h3>' + esc(a.t) + '</h3><span>' + a.items.length + ' features</span></div>' +
      '<div class="ami__b"><div><p>' + esc(a.d) + '</p><ul>' + $.map(a.items, function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div></li>';
  }).join(''));
  var amI = 0;
  function amGo(i) {
    if (i === amI) return;
    var $f = $('#amStage figure');
    $f.removeClass('was-on').eq(amI).addClass('was-on');
    $f.removeClass('is-on').eq(i).addClass('is-on');
    $('#amList .ami').removeClass('is-on').eq(i).addClass('is-on');
    amI = i; setTimeout(function () { if (ST) ST.refresh(); }, 850);
  }
  $('#amList').on('click mouseenter', '.ami', function () { amGo(+$(this).data('i')); });
  $('#amStage').on('click', function () { var a = AMEN[amI]; lbOpen($.map(a.img, function (n) { return { src: IMG + 'amenities/a-' + n + '-lg.webp', title: a.t + ' · Artist\'s impression' }; }), 0); }).attr('data-cursor', 'view');

  /* Gallery with a numbered image rail, cancellable transitions and touch navigation. */
  var galleryCategories = ['architecture', 'landscapes', 'interiors', 'landscapes', 'interiors', 'landscapes', 'interiors', 'interiors'];
  var galList = GAL.map(function (g, i) { return { src: i === 0 ? IMG + 'hero/hero-1-lg.webp' : IMG + 'gallery/g-' + g[0] + '-lg.webp', thumb: IMG + 'gallery/g-' + g[0] + '-sm.webp', title: g[1], category: galleryCategories[i] }; });
  var galleryVisible = galList.map(function (_, i) { return i; }), galleryIndex = 0, galleryPending = 0, galleryVersion = 0;
  function galleryFilm() {
    $('#glTrack').html(galleryVisible.map(function (i, position) { return '<button type="button" data-image="' + i + '" aria-label="Show ' + esc(galList[i].title) + '" aria-pressed="' + String(i === galleryIndex) + '"><img src="' + galList[i].thumb + '" loading="lazy" decoding="async" width="160" height="100" alt=""><span class="gallery__thumb-copy"><small>' + pad(position + 1) + '</small><span>' + esc(galList[i].title) + '</span></span></button>'; }).join(''));
  }
  function gallerySelect(index, transition) {
    galleryPending = index;
    var version = ++galleryVersion, item = galList[index], preload = new Image();
    $('#galleryViewer').attr('aria-busy', 'true');
    preload.onload = function () {
      if (version !== galleryVersion) return;
      var photo = document.getElementById('galleryPhoto'), parent = photo.parentNode;
      $(parent).find('.gallery__outgoing').remove();
      if (G) G.killTweensOf(photo);
      if (transition && anim && photo.getAttribute('src') !== item.src) {
        var outgoing = photo.cloneNode(false);
        outgoing.removeAttribute('id'); outgoing.className = 'gallery__outgoing'; outgoing.alt = ''; outgoing.setAttribute('aria-hidden', 'true'); outgoing.style.opacity = '1';
        parent.insertBefore(outgoing, photo);
        applyPhoto(photo, item.src, galleryImageSizes); photo.alt = item.title;
        G.fromTo(photo, { opacity: 0, scale: 1.035 }, { opacity: 1, scale: 1, duration: .85, ease: 'power2.inOut', clearProps: 'opacity,transform', onComplete: function () { outgoing.remove(); } });
      } else { $(photo).css('opacity', ''); applyPhoto(photo, item.src, galleryImageSizes); photo.alt = item.title; }
      galleryIndex = index;
      function caption() { $('#galleryCaption').text(item.title); }
      if (transition) smoothContent('gallery-caption', '#galleryCaption', caption); else caption();
      $('#galleryPosition').text(pad(galleryVisible.indexOf(index) + 1) + ' / ' + pad(galleryVisible.length));
      $('#galleryOpen').attr('aria-label', 'View ' + item.title + ' full screen');
      $('#glTrack [data-image]').each(function () { $(this).attr('aria-pressed', String(+this.getAttribute('data-image') === index)); });
      $('#galleryPrevious, #galleryFollowing').prop('disabled', galleryVisible.length < 2);
      $('#galleryViewer').attr('aria-busy', 'false');
      if (transition) {
        $('#galleryStatus').text(item.title + '. Image ' + (galleryVisible.indexOf(index) + 1) + ' of ' + galleryVisible.length + '.');
        var thumb = document.querySelector('#glTrack [data-image="' + index + '"]'), rail = document.getElementById('glTrack');
        if (thumb) {
          var t = thumb.getBoundingClientRect(), r = rail.getBoundingClientRect(), vertical = getComputedStyle(rail).flexDirection === 'column';
          if (vertical && (t.top < r.top || t.bottom > r.bottom)) rail.scrollTo({ top: rail.scrollTop + t.top - r.top, behavior: reduce ? 'auto' : 'smooth' });
          else if (!vertical && (t.left < r.left || t.right > r.right)) rail.scrollTo({ left: rail.scrollLeft + t.left - r.left, behavior: reduce ? 'auto' : 'smooth' });
        }
      }
    };
    preload.onerror = function () { if (version === galleryVersion) { galleryPending = galleryIndex; $('#galleryViewer').attr('aria-busy', 'false'); $('#galleryStatus').text('This image could not be loaded.'); } };
    applyPhoto(preload, item.src, galleryImageSizes);
  }
  function galleryStep(direction) { gallerySelect(galleryVisible[(galleryVisible.indexOf(galleryPending) + direction + galleryVisible.length) % galleryVisible.length], true); }
  $('#galleryFilters').on('click', '[data-category]', function () {
    var category = this.getAttribute('data-category');
    galleryVisible = galList.map(function (_, i) { return i; }).filter(function (i) { return category === 'all' || galList[i].category === category; });
    $('#galleryFilters [data-category]').attr('aria-pressed', 'false'); $(this).attr('aria-pressed', 'true');
    galleryPending = galleryVisible.indexOf(galleryIndex) >= 0 ? galleryIndex : galleryVisible[0];
    galleryFilm(); gallerySelect(galleryPending, true);
  });
  $('#glTrack').on('click', '[data-image]', function () { gallerySelect(+this.getAttribute('data-image'), true); });
  $('#galleryPrevious').on('click', function () { galleryStep(-1); });
  $('#galleryFollowing').on('click', function () { galleryStep(1); });
  $('#galleryViewer').on('keydown', function (e) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); galleryStep(e.key === 'ArrowLeft' ? -1 : 1); } });
  var galleryTouch = null, gallerySwiped = false;
  var gallerySurface = document.getElementById('galleryOpen');
  gallerySurface.addEventListener('touchstart', function (event) { if (event.touches.length === 1) galleryTouch = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }, { passive: true });
  gallerySurface.addEventListener('touchend', function (event) {
    if (!galleryTouch || !event.changedTouches.length) return;
    var dx = event.changedTouches[0].clientX - galleryTouch.x, dy = event.changedTouches[0].clientY - galleryTouch.y; galleryTouch = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) { gallerySwiped = true; galleryStep(dx < 0 ? 1 : -1); setTimeout(function () { gallerySwiped = false; }, 400); }
  }, { passive: true });
  $('#galleryOpen, #galleryExpand').on('click', function () {
    if (gallerySwiped) { gallerySwiped = false; return; }
    if ($('#galleryViewer').attr('aria-busy') === 'true') return;
    lbOpen(galleryVisible.map(function (i) { return { src: galList[i].src, title: galList[i].title + ' - Artist\'s impression' }; }), galleryVisible.indexOf(galleryIndex));
  });
  galleryFilm(); gallerySelect(0, false);

  /* location */
  $('#lcTabs').html($.map(LOC, function (l, i) { return '<button type="button" class="tab' + (i ? '' : ' is-on') + '" role="tab" id="locationTab' + i + '" aria-controls="lcPanel" aria-selected="' + String(!i) + '" tabindex="' + (i ? '-1' : '0') + '" data-i="' + i + '">' + l.t + '</button>'; }).join(''));
  function lcShow(i, transition) {
    $('#lcTabs .tab').removeClass('is-on').attr({ 'aria-selected': 'false', tabindex: '-1' }).eq(i).addClass('is-on').attr({ 'aria-selected': 'true', tabindex: '0' });
    $('#lcPanel').attr('aria-labelledby', 'locationTab' + i);
    function renderLocation() {
    $('#lcCategory').text(LOC[i].t);
    $('#lcList').attr('aria-label', 'Nearby ' + LOC[i].t.toLowerCase()).scrollTop(0);
    $('#lcList').html($.map(LOC[i].items, function (x) { var km = x[1].split(' '); return '<li><span>' + esc(x[0]) + '</span><b>' + km[0] + '<small>km</small></b></li>'; }).join(''));
    if (ST) ST.refresh();
    }
    if (transition) smoothContent('location', '#lcList, #lcCategory', renderLocation);
    else renderLocation();
  }
  $('#lcTabs').on('click', '.tab', function () { lcShow(+$(this).data('i'), true); });
  $('#lcTabs').on('keydown', '.tab', function (event) {
    var tabs = $('#lcTabs .tab'), index = tabs.index(this);
    if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') index = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = tabs.length - 1;
    else return;
    event.preventDefault(); tabs.eq(index).trigger('focus').trigger('click');
  });
  lcShow(0, false);
  $('#lcMap').on('click', function () { lbOpen([{ src: IMG + 'misc/map.webp', title: 'Birla Punya location map · Source: Google Maps' }], 0); });

  /* FAQ */
  $('#fqAcc').html($.map(FAQ, function (f, i) { return '<details' + (i ? '' : ' open') + '><summary><span>' + esc(f[0]) + '</span></summary><div class="acc__body"><p>' + esc(f[1]) + '</p></div></details>'; }).join(''));
  $('.acc details').on('toggle', function () { if (this.open) $(this).siblings('details[open]').removeAttr('open'); if (ST) ST.refresh(); });

  $('#ftMore').on('click', function () { var o = $('#ftDisc').toggleClass('is-open').hasClass('is-open'); $(this).text(o ? 'Read less' : 'Read more').attr('aria-expanded', String(o)); if (ST) ST.refresh(); });

  /* =====================================================================
     HEADER / MENU / HERO SLIDER
     ===================================================================== */
  var hdEl = document.getElementById('hd');
  function hdToggle(y) {
    y = typeof y === 'number' ? y : window.scrollY;
    var open = $('#menu').hasClass('is-open');
    hdEl.classList.toggle('is-solid', y > 60 && !open);
    hdEl.classList.toggle('is-menu-open', open);
  }
  $win.on('scroll', function () { hdToggle(); }); hdToggle();

  var $menu = $('#menu'), $burger = $('#burger');
  function menuClose() { $menu.removeClass('is-open').attr('aria-hidden', 'true').prop('inert', true); $burger.attr({ 'aria-expanded': 'false', 'aria-label': 'Open menu' }); unlock(); hdToggle(); $burger.trigger('focus'); }
  $burger.on('click', function () { var open = !$menu.hasClass('is-open'); if (!open) return menuClose(); $menu.addClass('is-open').attr('aria-hidden', 'false').prop('inert', false); $burger.attr({ 'aria-expanded': 'true', 'aria-label': 'Close menu' }); lock(); hdToggle(); $menu.find('a').first().trigger('focus'); });
  $win.on('resize', function () { if (window.innerWidth > 1100 && $menu.hasClass('is-open')) menuClose(); });
  $doc.on('keydown.menu', function (event) {
    if (event.key !== 'Tab' || !$menu.hasClass('is-open')) return;
    var controls = $('#hd a, #hd button, #menu a, #menu button').filter(':visible'), first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  /* anchor links glide with Lenis */
  $doc.on('click', 'a[href^="#"]', function (e) {
    var id = this.getAttribute('href'); if (id.length < 2) return;
    var t = document.querySelector(id); if (!t) return;
    e.preventDefault();
    if ($menu.hasClass('is-open')) menuClose();
    if (lenis) lenis.scrollTo(t, { offset: id === '#home' ? 0 : -(hdEl.offsetHeight + 36), duration: 1.6 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  var $nav = $('.hd__nav a');
  function navMarker() {
    var active = $nav.filter('.is-on')[0], nav = document.querySelector('.hd__nav');
    if (!active || !nav.offsetWidth) { nav.classList.remove('has-active'); return; }
    nav.style.setProperty('--nav-x', active.offsetLeft + 'px'); nav.style.setProperty('--nav-width', active.offsetWidth + 'px'); nav.classList.add('has-active');
  }
  $nav.on('click', function () { $nav.removeClass('is-on').removeAttr('aria-current'); $(this).addClass('is-on').attr('aria-current', 'location'); navMarker(); });
  $win.on('resize', navMarker);
  if (document.fonts) document.fonts.ready.then(navMarker);
  if ('IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { $nav.removeClass('is-on').removeAttr('aria-current').filter('[href="#' + e.target.id + '"]').addClass('is-on').attr('aria-current', 'location'); navMarker(); } }); }, { rootMargin: '-45% 0px -50% 0px' });
    $nav.each(function () { var t = document.querySelector(this.getAttribute('href')); if (t) navIo.observe(t); });
    navIo.observe(document.getElementById('home'));
  }

  /* =====================================================================
     LIGHTBOX + LEAD MODAL
     ===================================================================== */
  var $lb = $('#lb'), lbList = [], lbI = 0, $modal = $('#leadModal');
  function lbShow(i) { lbI = (i + lbList.length) % lbList.length; var it = lbList[lbI]; $('#lbImg').attr({ src: it.src, alt: it.title }); $('#lbCap').text(it.title); $lb.find('.lb__nav').toggle(lbList.length > 1); if (anim) G.fromTo('#lbImg', { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .7, ease: 'expo.out' }); }
  function lbOpen(list, i) { lbList = list; $lb.addClass('is-open').attr('aria-hidden', 'false'); lock(); lbShow(i || 0); }
  function lbClose() { $lb.removeClass('is-open').attr('aria-hidden', 'true'); if (!$modal.hasClass('is-open')) unlock(); }
  $lb.on('click', '[data-lb-close]', lbClose).on('click', '[data-lb-prev]', function () { lbShow(lbI - 1); }).on('click', '[data-lb-next]', function () { lbShow(lbI + 1); })
    .on('click', function (e) { if (e.target === this) lbClose(); });

  function mOpen(src) {
    var t = /visit/i.test(src) ? 'Book a site visit' : /plan.*price/i.test(src) ? 'Get your plan & price' : /plan/i.test(src) ? 'Get the unit plan' : /brochure|full list/i.test(src) ? 'Download the brochure' : /price|cost/i.test(src) ? 'Get the price sheet' : 'Enquire now';
    $('#modalTitle').text(t);
    $modal.find('.lead-form').attr('data-source', src || 'Popup Form');
    if ($menu.hasClass('is-open')) menuClose();
    $modal.addClass('is-open').attr('aria-hidden', 'false'); lock(); store.set('bp_popup_seen', '1', true);
  }
  function mClose() { $modal.removeClass('is-open').attr('aria-hidden', 'true'); if (!$lb.hasClass('is-open')) unlock(); }
  $doc.on('click', '[data-enquire]', function (e) { e.preventDefault(); e.stopPropagation(); mOpen($(this).attr('data-enquire')); });
  $modal.on('click', '[data-close]', mClose);
  $doc.on('keydown', function (e) { if (e.key === 'Escape') { if ($lb.hasClass('is-open')) lbClose(); else if ($modal.hasClass('is-open')) mClose(); else if ($menu.hasClass('is-open')) menuClose(); } });
  setTimeout(function () { if (store.get('bp_lead') !== '1' && !store.get('bp_popup_seen', true) && !$modal.hasClass('is-open') && !$lb.hasClass('is-open')) mOpen('Auto Popup'); }, 25000);

  /* =====================================================================
     MOTION
     ===================================================================== */
  $('img[src]').each(function () {
    var src = this.getAttribute('src'), sizes;
    if (this.id === 'lbImg') return;
    if (this.id === 'galleryPhoto') sizes = galleryImageSizes;
    else if (this.classList.contains('hero__image')) sizes = '(max-width: 600px) 100vw, 55vw';
    else if (this.closest('#lcMap')) sizes = '(max-width: 600px) calc(100vw - 64px), (max-width: 900px) 55vw, 760px';
    else if (this.closest('.menu__img')) sizes = '45vw';
    if (window.BirlaImageSources && window.BirlaImageSources[src]) applyPhoto(this, src, sizes);
    else this.decoding = 'async';
  });

  function counters() {
    $('[data-count]').each(function () {
      var el = this, to = +el.getAttribute('data-count');
      if (!anim) { el.textContent = to; return; }
      var o = { v: 0 };
      G.to(o, { v: to, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });
  }

  if (!anim) {
    $('[data-up],[data-hero]').css({ opacity: 1, transform: 'none' });
    $('[data-clip]').css('clip-path', 'none');
    $('.ov__statement').css('opacity', 1);
    counters();
    return;
  }

  G.registerPlugin(ST);

  /* smooth scroll */
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.25, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    lenis.on('scroll', function (e) { ST.update(); hdToggle(e.scroll); });
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
  }

  /* scroll progress */
  G.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  /* split helpers */
  function splitChars(el) {
    var txt = el.textContent; el.textContent = '';
    txt.split('').forEach(function (c) { var w = document.createElement('span'); w.className = 'chw'; var s = document.createElement('span'); s.className = 'ch'; s.textContent = c; w.appendChild(s); el.appendChild(w); });
    return el.querySelectorAll('.ch');
  }
  function splitWords(el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    return el.querySelectorAll('.w');
  }
  /* headings: wrap each word in a mask so the line rises into view */
  function splitLines(el) {
    var out = [];
    $(el).contents().each(function () {
      if (this.nodeType === 3) this.textContent.split(/(\s+)/).forEach(function (t) { out.push(/\S/.test(t) ? '<span class="line-wrap" style="display:inline-block"><span>' + esc(t) + '</span></span>' : t); });
      else out.push('<span class="line-wrap" style="display:inline-block"><span>' + this.outerHTML + '</span></span>');
    });
    el.innerHTML = out.join('');
    return el.querySelectorAll('.line-wrap > span');
  }

  /* ---------- hero intro ---------- */
  var heroChars = [];
  $('[data-split]').each(function () { heroChars.push.apply(heroChars, splitChars(this)); });
  var heroIntro = G.timeline({ delay: .15, onComplete: function () { $('.hero').addClass('is-ready'); } });
  heroIntro
    .from('.hero__pattern', { opacity: 0, duration: 1.5, ease: 'power2.out' }, 0)
    .from(heroChars, { yPercent: 110, duration: 1.1, stagger: .035, ease: 'power4.out' }, '<.1')
    .to('[data-hero]', { opacity: 1, duration: .9, stagger: .1, ease: 'power2.out' }, '<.4')
    .from('[data-hero]', { y: 20, duration: .9, stagger: .1, ease: 'power3.out' }, '<')
    .from('.hero__typology strong', { y: 8, opacity: 0, duration: .65, ease: 'power3.out', clearProps: 'transform,opacity' }, .6)
    .from('.hero__price', { y: 18, opacity: 0, duration: .85, ease: 'power3.out', clearProps: 'transform,opacity' }, .7)
    .from('.hero__price small, .hero__amount > span', { y: 8, opacity: 0, duration: .65, stagger: .08, ease: 'power3.out', clearProps: 'transform,opacity' }, .95)
    .from('.hero__cta .btn', { y: 10, opacity: 0, duration: .6, stagger: .12, ease: 'power3.out', clearProps: 'transform,opacity' }, 1)
    .from('.hero__highlights li', { y: 16, opacity: 0, duration: .65, stagger: .14, ease: 'power3.out', clearProps: 'transform,opacity' }, 1.1)
    .from('.hero__caption', { y: 12, opacity: 0, duration: .8, clearProps: 'transform,opacity' }, .4);

  /* Count only the banner's highlights; the asking price stays readable. */
  $('[data-hero-count]').each(function (i) {
    var el = this, total = +el.getAttribute('data-hero-count'), value = { n: 0 };
    heroIntro.to(value, { n: total, duration: 1.15, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(value.n); } }, 1.15 + i * .14);
  });

  /* overview statement — words light up as you scroll */
  var words = splitWords(document.querySelector('[data-words]'));
  G.to(words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '[data-words]', start: 'top 80%', end: 'bottom 45%', scrub: true } });

  /* Draw the elevation in pencil-like passes as its section enters view.
     A stroked SVG mask reveals the detailed artwork without shifting content.
     Reduced-motion and no-animation visitors keep the static CSS background. */
  $('.ov__sketch, .cf, .gl').each(function (index) {
    var section = this, maskId = 'elevation-pencil-' + index;
    var strokes = [], left = 660, right = 1680;
    for (var y = 0, row = 0; y <= 960; y += 19, row++) {
      strokes.push((row ? 'L' : 'M') + (row % 2 ? right : left) + ' ' + y);
      strokes.push('L' + (row % 2 ? left : right) + ' ' + (y + 7));
    }
    var markup = '<svg class="elevation-sketch" viewBox="0 0 1672 941" aria-hidden="true" focusable="false">' +
      '<defs><mask id="' + maskId + '" maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="941">' +
      '<path class="elevation-sketch__pencil" d="' + strokes.join(' ') + '" fill="none" stroke="white" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</mask></defs><image href="' + IMG + 'pattern/elevation-watercolor.webp" width="1672" height="941" preserveAspectRatio="none" mask="url(#' + maskId + ')"/></svg>';
    section.insertAdjacentHTML('afterbegin', markup);
    var pencil = section.querySelector('.elevation-sketch__pencil');
    var length = pencil.getTotalLength();
    G.set(pencil, { strokeDasharray: length, strokeDashoffset: length });
    section.classList.add('has-elevation-sketch');
    G.to(pencil, { strokeDashoffset: 0, duration: 3.8, ease: 'none', scrollTrigger: { trigger: section, start: 'top 78%', once: true }, onStart: function () { section.classList.add('is-sketching'); }, onComplete: function () { section.classList.remove('is-sketching'); section.classList.add('is-sketched'); } });
  });

  /* headings */
  $('[data-lines]').each(function () {
    var parts = splitLines(this);
    G.from(parts, { yPercent: 110, duration: 1.3, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: this, start: 'top 88%' } });
  });

  /* generic fade-ups */
  ST.batch('[data-up]', { start: 'top 90%', once: true, onEnter: function (b) { G.to(b, { opacity: 1, y: 0, duration: 1.2, stagger: .1, ease: 'expo.out' }); } });

  /* image wipes + inner parallax */
  $('[data-clip]').each(function () {
    G.to(this, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: this, start: 'top 85%' } });
  });
  $('[data-parallax]').each(function () {
    G.fromTo(this, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: this.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  counters();

  /* Combined residence explorer enters as one composed panel. */
  G.from('.residences__panel', { opacity: 0, y: 24, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.residences__panel', start: 'top 90%', once: true } });

  /* amenities list items slide in */
  G.from('.ami', { opacity: 0, x: 40, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '#amList', start: 'top 85%' } });

  /* Reveal the gallery image independently of its thumbnail rail. */
  G.from('#galleryViewer', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#galleryViewer', start: 'top 90%', once: true } });

  /* Finish the page with staggered FAQ and registration reveals. */
  ST.batch('.acc details, .rera__qrs figure', { start: 'top 94%', once: true, onEnter: function (b) { G.fromTo(b, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7, stagger: .1, ease: 'power3.out', clearProps: 'transform,opacity' }); } });

  /* ---------- banner image: curtain reveal, scroll drift, mouse depth ---------- */
  (function () {
    var media = document.getElementById('heroMedia'), img = media && media.querySelector('.hero__image');
    if (!img) return;
    media.insertAdjacentHTML('beforeend', '<span class="hero__wipe" aria-hidden="true"></span><span class="hero__glint" aria-hidden="true"></span>');
    var wipe = media.querySelector('.hero__wipe');
    G.set(img, { scale: 1.3, transformOrigin: '50% 40%' });
    heroIntro
      .fromTo(media, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
      .fromTo(wipe, { xPercent: 0, opacity: 1 }, { left: '0%', duration: 1.5, ease: 'expo.inOut' }, 0)
      .to(wipe, { opacity: 0, duration: .4 }, 1.4)
      .to(img, { scale: 1.06, duration: 2.6, ease: 'expo.out' }, .3)
      .add(function () { media.classList.add('is-revealed'); }, 1.8);

    /* Drift and slow zoom as the banner scrolls away. */
    G.to(img, { yPercent: 8, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* Subtle depth on desktop pointer movement. */
    if (window.matchMedia('(hover: hover) and (min-width: 901px)').matches) {
      var qx = G.quickTo(img, 'x', { duration: 1.2, ease: 'power3.out' }), qy = G.quickTo(img, 'y', { duration: 1.2, ease: 'power3.out' });
      document.querySelector('.hero').addEventListener('pointermove', function (e) {
        var r = media.getBoundingClientRect();
        qx(((e.clientX - r.left) / r.width - .5) * -22);
        qy(((e.clientY - r.top) / r.height - .5) * -14);
      });
      document.querySelector('.hero').addEventListener('pointerleave', function () { qx(0); qy(0); });
    }
  })();

  /* ---------- design refinement: section & highlight motion ---------- */
  /* Gold underline under each heading draws in as its section arrives. */
  ST.batch('.head .title, .fq__grid .title, .ct__title', { start: 'top 85%', once: true, onEnter: function (b) { b.forEach(function (el, i) { setTimeout(function () { el.classList.add('is-drawn'); }, 350 + i * 120); }); } });

  /* Stats cards rise in sequence, then their numbers get a gold glint. */
  G.from('.stats li', { opacity: 0, y: 40, scale: .94, duration: 1, stagger: .12, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.stats', start: 'top 88%', once: true }, onComplete: function () { $('.stats').addClass('is-lit'); } });

  /* Hero highlights: a light glint passes over them once the intro ends. */
  heroIntro.call(function () { $('.hero__highlights').addClass('is-lit'); }, null, 2.6);

  /* Residence tabs, amenity chips, location rows and gallery thumbs cascade in. */
  [['.residences__types > *', '.residences__types'], ['#lcList li', '#lcList'], ['#glTrack button', '#glTrack'], ['.lc__tabs > *', '.lc__tabs'], ['.gallery__filters button', '.gallery__filters']].forEach(function (pair) {
    if (!document.querySelector(pair[0])) return;
    G.from(pair[0], { opacity: 0, y: 14, duration: .7, stagger: .06, ease: 'power3.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: pair[1], start: 'top 90%', once: true } });
  });

  /* Section kickers slide in with their gold rule. */
  ST.batch('.sec .kicker, .ct .kicker', { start: 'top 90%', once: true, onEnter: function (b) { b.forEach(function (el) { el.classList.add('is-in'); }); } });

  /* Contact card lifts in; map gets a slow drift. */
  G.from('.ct .card', { opacity: 0, y: 50, rotateX: 8, transformPerspective: 900, duration: 1.3, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.ct', start: 'top 75%', once: true } });
  G.fromTo('.lc__map img', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.lc__map', start: 'top bottom', end: 'bottom top', scrub: true } });

  $win.on('load', function () { ST.refresh(); });

})(jQuery);
