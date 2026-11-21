/* =========================================================================
   BIRLA PUNYA — page data + interactions (jQuery, GSAP, Lenis)
   Sources: Tower C Layouts + Interior Specifications brochures (plans, specs,
   RERA), birlaestates.com/birla-punya-pune (configs, amenities, location, FAQs)
   ========================================================================= */
(function ($) {
  'use strict';

  /* =====================================================================
     SETTINGS — check these before going live
     ===================================================================== */
  var CONTACT = {
    phone: '+919096330038',        // tel: link (IVR)
    phoneLabel: '+91 90963 30038', // shown on the site
    whatsapp: '919096330038'       // wa.me number
  };

  var IMG = 'assets/images/';
  var GALLERY_SIZES = '(max-width: 900px) calc(100vw - 48px), (max-width: 1300px) calc(100vw - 350px), 946px';
  var DEFAULT_SIZES = '(max-width: 600px) 100vw, (max-width: 900px) 70vw, 640px';
  var AUTO_POPUP_DELAY = 25000;

  /* =====================================================================
     DATA
     ===================================================================== */

  /* Tower C unit plans — straight from the brochure. */
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

  var AMENITIES = [
    {
      title: 'The Park',
      text: 'Landscaped greens, decks and walks for slow mornings and family evenings.',
      images: ['landscaped-park', 'balcony-green-views', 'kids-play-area'],
      items: ['Pickle Ball Court', 'Forest Viewing Deck', 'Hammock Deck', 'Multi-Purpose Lawn', 'Stage', 'Siddha Walk', 'Net Cricket']
    },
    {
      title: 'The Sky Deck',
      text: 'Elevated leisure with river and city views.',
      images: ['golf-sky-deck-amenity', 'urban-terraces', 'balcony-green-views'],
      items: ['Mini Golf', 'Pool Table', 'Table Tennis', 'Yoga Deck / Dance Studio', 'Outdoor Cinema', 'Sky Lounge', 'Riverview Deck', 'Hammocks', 'Senior Citizen Fitness Station', 'Fragrance Garden']
    },
    {
      title: 'The Courts',
      text: 'Pools, lawns and decks built around water and sunshine.',
      images: ['swimming-pool-amenity', 'pickleball-amenity', 'kids-play-area'],
      items: ['Semi Olympic Pool', 'Lounge Deck', 'Lounge Pool', 'Sunken Lawn', 'Sun Deck', 'BBQ Deck', 'Kids Pool', "Kid's Play Area"]
    },
    {
      title: 'The Clubhouse',
      text: 'An exclusive clubhouse to work, play and recharge.',
      images: ['exclusive-clubhouse', 'urban-terraces', 'golf-sky-deck-amenity'],
      items: ['Multi-purpose Hall', 'Mini Theatre', 'Business Centre / Co-working', 'Café with Pantry', 'Gymnasium', 'Badminton Court', 'Aerobics & Zumba Studio', 'Spa', 'Kids Zone', 'Creative Section', 'Clinic']
    }
  ];

  /* [file slug, caption, filter category] — the first image reuses the hero shot. */
  var GALLERY = [
    ['towers-riverside', 'Riverside towers', 'architecture'],
    ['tree-lined-road', 'Tree-lined avenues', 'landscapes'],
    ['master-bedroom', 'Master bedroom', 'interiors'],
    ['jogging-track', 'Jogging track', 'landscapes'],
    ['luxury-living', 'Living room', 'interiors'],
    ['natural-greenery', 'Natural greenery', 'landscapes'],
    ['bedroom-view', 'Bedroom views', 'interiors'],
    ['luxury-bedroom', 'Bedroom interiors', 'interiors']
  ];

  var LOCATIONS = [
    { title: 'Transport', items: [['ROT', '0.1 km'], ['Mangalwar Peth Metro Station', '0.3 km'], ['Pune Railway Station', '1.9 km'], ['Pune Airport', '8.5 km']] },
    { title: 'Hospitals', items: [['Sancheti Hospital', '1.2 km'], ['Jehangir Hospital', '1.6 km'], ['Ruby Hall Clinic', '2.6 km']] },
    { title: 'Education', items: [['SSPM Day School', '0.2 km'], ['AISSMS College', '0.6 km'], ['Nowrosjee Wadia College', '2.8 km'], ['Fergusson College', '3.6 km'], ['Abasaheb Garware College', '4.4 km'], ['MIT College', '7.5 km']] },
    { title: 'Leisure', items: [['Boat Club', '0.9 km'], ['Sheraton Grand Hotel', '1.5 km'], ['Bund Garden', '3.2 km'], ['KOPA Mall', '5.9 km'], ['Westin Hotel', '6.1 km'], ['Westend Mall', '8 km']] },
    { title: 'Nearby', items: [['Shivaji Nagar', '1.6 km'], ['Shaniwar Wada', '2.2 km'], ['Swargate', '4.2 km'], ['Koregaon Park', '4.5 km'], ['Yerwada', '5.3 km'], ['Pune Cantonment', '5.7 km'], ['Kalyani Nagar', '8.3 km'], ['Viman Nagar', '10.4 km'], ['Baner', '11.2 km'], ['Kharadi', '11.5 km']] }
  ];

  /* FAQs — from the official Birla Estates project page. */
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

  /* =====================================================================
     HELPERS
     ===================================================================== */
  var $win = $(window);
  var $doc = $(document);
  var $html = $('html');

  var G = window.gsap;
  var ST = window.ScrollTrigger;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anim = !!(G && ST) && !reduceMotion;
  var lenis = null;

  var store = (window.LeadForm && window.LeadForm.store) || {
    get: function () { return null; },
    set: function () {}
  };

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return ESCAPES[c]; });
  }

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function refreshScroll() {
    if (ST) ST.refresh();
  }

  /* Block page scrolling while an overlay is open. */
  function lockScroll() {
    $html.css('overflow', 'hidden');
    if (lenis) lenis.stop();
  }
  function unlockScroll() {
    $html.css('overflow', '');
    if (lenis) lenis.start();
  }

  /* Give an <img> its responsive srcset (from image-sources.js) and size. */
  function applyPhoto(image, src, sizes) {
    var source = window.BirlaImageSources && window.BirlaImageSources[src];
    image.decoding = 'async';
    if (source) {
      image.width = source.width;
      image.height = source.height;
      image.sizes = sizes || image.getAttribute('sizes') || DEFAULT_SIZES;
      image.srcset = source.srcset;
    }
    image.src = src;
  }

  /* Fade content out, re-render it, fade it back in.
     A new call with the same key cancels the previous transition. */
  var transitions = {};
  function smoothContent(key, selector, render) {
    var $nodes = $(selector);
    if (transitions[key]) transitions[key].kill();
    if (!anim) { render(); return; }

    G.killTweensOf($nodes);
    transitions[key] = G.timeline()
      .to($nodes, { opacity: .1, y: 3, duration: .14, ease: 'power1.out' })
      .call(render)
      .to($nodes, { opacity: 1, y: 0, duration: .42, ease: 'power2.out', clearProps: 'transform,opacity' });
  }

  /* Arrow / Home / End keyboard support for a role="tab" list. */
  function enableTabKeys($container, tabSelector) {
    $container.on('keydown', tabSelector, function (e) {
      var $tabs = $container.find(tabSelector);
      var index = $tabs.index(this);

      if (e.key === 'ArrowRight') index = (index + 1) % $tabs.length;
      else if (e.key === 'ArrowLeft') index = (index + $tabs.length - 1) % $tabs.length;
      else if (e.key === 'Home') index = 0;
      else if (e.key === 'End') index = $tabs.length - 1;
      else return;

      e.preventDefault();
      $tabs.eq(index).trigger('focus').trigger('click');
    });
  }

  /* Page-wide basics. */
  $('[data-tel]').attr('href', 'tel:' + CONTACT.phone);
  $('[data-tel-label]').text(CONTACT.phoneLabel);
  $('[data-wa]').attr('href', 'https://wa.me/' + CONTACT.whatsapp + '?text=' + encodeURIComponent('Hi, I am interested in Birla Punya, Pune. Please share details.'));
  $('#year').text(new Date().getFullYear());

  /* =====================================================================
     RESIDENCES — one selection drives the plan preview, areas and enquiry source
     ===================================================================== */
  var $residenceTypes = $('#residenceTypes');

  function plansOfType(type) {
    return PLANS.filter(function (p) { return p.id.charAt(0) === type; });
  }

  $residenceTypes.html(['2', '3', '4'].map(function (type) {
    var count = plansOfType(type).length;
    return '<button type="button" role="tab" id="residenceType' + type + '" aria-controls="residencePanel" aria-selected="false" tabindex="-1" data-type="' + type + '">' +
      '<b>' + type + ' BHK</b><span>' + count + (count === 1 ? ' layout' : ' layouts') + '</span></button>';
  }).join(''));

  function residenceShow(id, animate) {
    var plan = PLANS.filter(function (p) { return p.id === id; })[0];
    var type = plan.id.charAt(0);

    function render() {
      var style = /Garden/.test(plan.name) ? 'Private garden' : /Study/.test(plan.name) ? 'With study' : 'Standard layout';

      $('#residenceLayout').val(plan.id);
      $('#residenceName').text(type + ' BHK');
      $('#residenceStyle').text(style);
      $('#residenceLayoutName, #residencePlanLabel').text(plan.name);
      $('#residenceTotal').html('<b>' + esc(plan.total.split(' sq. ft.')[0]) + '</b> sq. ft.');
      $('#residenceCarpet').text(plan.carpet);
      $('#residenceFloors').text(plan.floors);
      $('#residenceFeatures').text(plan.note);
      $('#residenceImage').attr({ src: IMG + 'plans/' + plan.id + '-thumb.webp', alt: plan.name + ' floor plan preview' });
      $('#residencePreview, #residenceEnquire').attr('data-enquire', 'Plan & Price - ' + plan.name);
      $('#residencePreview').attr('aria-label', 'Request the detailed plan and price for ' + plan.name);
      $('#residenceVisit').attr('data-enquire', 'Site Visit - ' + plan.name);

      if (animate) {
        $('#residenceStatus').text(plan.name + ' selected. Total area ' + plan.total + '. Price on request.');
        refreshScroll();
      }
    }

    if (animate) {
      smoothContent('residence', '.residences__preview, .residences__name, .residences__layout-name, .residences__areas, .residences__specs', render);
    } else {
      render();
    }
  }

  function residenceChoose(type, animate) {
    var options = plansOfType(type);

    $residenceTypes.find('[role="tab"]').each(function () {
      var selected = this.getAttribute('data-type') === type;
      $(this).attr({ 'aria-selected': String(selected), tabindex: selected ? '0' : '-1' });
    });
    $('#residencePanel').attr('aria-labelledby', 'residenceType' + type);
    $('#residenceLayout').html(options.map(function (p) {
      return '<option value="' + p.id + '">' + esc(p.name) + '</option>';
    }).join(''));

    residenceShow(options[0].id, animate);
  }

  $residenceTypes.on('click', '[role="tab"]', function () {
    residenceChoose(this.getAttribute('data-type'), true);
  });
  enableTabKeys($residenceTypes, '[role="tab"]');
  $('#residenceLayout').on('change', function () { residenceShow(this.value, true); });
  residenceChoose('2', false);

  /* "More details" — slide open/closed instead of jumping. */
  $('.residences__more summary').on('click', function (e) {
    if (reduceMotion) return;
    e.preventDefault();

    var details = this.parentNode;
    var $list = $(details).find('.residences__specs').stop(true, true);

    if (details.open) {
      $list.slideUp(260, function () {
        details.open = false;
        $list.css('display', '');
        refreshScroll();
      });
    } else {
      details.open = true;
      $list.hide().slideDown(300, function () {
        $list.css('display', '');
        refreshScroll();
      });
    }
  });
  $('.residences__more').on('toggle', function () {
    if (reduceMotion) refreshScroll();
  });

  /* =====================================================================
     AMENITIES — the list drives a sticky image stage
     ===================================================================== */
  function amenityImage(slug) {
    return IMG + 'amenities/a-' + slug + '-lg.webp';
  }

  $('#amStage').html($.map(AMENITIES, function (a, i) {
    return '<figure' + (i ? '' : ' class="is-on"') + '>' +
      '<img src="' + amenityImage(a.images[0]) + '"' + (function (s) { return s ? ' srcset="' + s.srcset + '" sizes="(max-width: 600px) 100vw, 1200px"' : ''; })(window.BirlaImageSources && window.BirlaImageSources[amenityImage(a.images[0])]) + ' loading="lazy" decoding="async" alt="' + esc(a.title) + '">' +
      '<figcaption>' + esc(a.title) + ' · Artist\'s impression</figcaption></figure>';
  }).join(''));

  $('#amList').html($.map(AMENITIES, function (a, i) {
    var items = $.map(a.items, function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    return '<li class="ami' + (i ? '' : ' is-on') + '" data-i="' + i + '">' +
      '<div class="ami__h"><small>' + pad(i + 1) + '</small><h3>' + esc(a.title) + '</h3><span>' + a.items.length + ' features</span></div>' +
      '<div class="ami__b"><div><p>' + esc(a.text) + '</p><ul>' + items + '</ul></div></div></li>';
  }).join(''));

  var amenityIndex = 0;
  function amenityGo(i) {
    if (i === amenityIndex) return;

    var $figures = $('#amStage figure');
    $figures.removeClass('was-on').eq(amenityIndex).addClass('was-on');
    $figures.removeClass('is-on').eq(i).addClass('is-on');
    $('#amList .ami').removeClass('is-on').eq(i).addClass('is-on');

    amenityIndex = i;
    setTimeout(refreshScroll, 850);
  }

  $('#amList').on('click mouseenter', '.ami', function () { amenityGo(+$(this).data('i')); });
  $('#amStage')
    .attr('data-cursor', 'view')
    .on('click', function () {
      var a = AMENITIES[amenityIndex];
      lightboxOpen($.map(a.images, function (slug) {
        return { src: amenityImage(slug), title: a.title + ' · Artist\'s impression' };
      }), 0);
    });

  /* =====================================================================
     GALLERY — numbered image rail, filters, cancellable transitions, swipe
     ===================================================================== */
  var galleryItems = GALLERY.map(function (g, i) {
    return {
      src: i === 0 ? IMG + 'hero/hero-1-lg.webp' : IMG + 'gallery/g-' + g[0] + '-lg.webp',
      thumb: IMG + 'gallery/g-' + g[0] + '-sm.webp',
      title: g[1],
      category: g[2]
    };
  });
  var galleryVisible = galleryItems.map(function (_, i) { return i; }); // indexes that match the filter
  var galleryIndex = 0;   // image currently shown
  var galleryPending = 0; // image being loaded
  var galleryVersion = 0; // bumps on every request so stale loads are ignored

  function galleryRenderRail() {
    $('#glTrack').html(galleryVisible.map(function (i, position) {
      return '<button type="button" data-image="' + i + '" aria-label="Show ' + esc(galleryItems[i].title) + '" aria-pressed="' + String(i === galleryIndex) + '">' +
        '<img src="' + galleryItems[i].thumb + '" loading="lazy" decoding="async" width="160" height="100" alt="">' +
        '<span class="gallery__thumb-copy"><small>' + pad(position + 1) + '</small><span>' + esc(galleryItems[i].title) + '</span></span></button>';
    }).join(''));
  }

  /* Keep the active thumbnail inside the rail's visible area. */
  function galleryScrollRail(index) {
    var thumb = document.querySelector('#glTrack [data-image="' + index + '"]');
    var rail = document.getElementById('glTrack');
    if (!thumb) return;

    var t = thumb.getBoundingClientRect();
    var r = rail.getBoundingClientRect();
    var behavior = reduceMotion ? 'auto' : 'smooth';

    if (getComputedStyle(rail).flexDirection === 'column') {
      if (t.top < r.top || t.bottom > r.bottom) rail.scrollTo({ top: rail.scrollTop + t.top - r.top, behavior: behavior });
    } else if (t.left < r.left || t.right > r.right) {
      rail.scrollTo({ left: rail.scrollLeft + t.left - r.left, behavior: behavior });
    }
  }

  /* Swap the main photo — crossfades from a clone of the old image when animating. */
  function gallerySwapPhoto(item, animate) {
    var photo = document.getElementById('galleryPhoto');
    var parent = photo.parentNode;

    $(parent).find('.gallery__outgoing').remove();
    if (G) G.killTweensOf(photo);

    if (animate && anim && photo.getAttribute('src') !== item.src) {
      var outgoing = photo.cloneNode(false);
      outgoing.removeAttribute('id');
      outgoing.className = 'gallery__outgoing';
      outgoing.alt = '';
      outgoing.setAttribute('aria-hidden', 'true');
      outgoing.style.opacity = '1';
      parent.insertBefore(outgoing, photo);

      applyPhoto(photo, item.src, GALLERY_SIZES);
      photo.alt = item.title;
      G.fromTo(photo, { opacity: 0, scale: 1.035 }, {
        opacity: 1, scale: 1, duration: .85, ease: 'power2.inOut', clearProps: 'opacity,transform',
        onComplete: function () { outgoing.remove(); }
      });
    } else {
      $(photo).css('opacity', '');
      applyPhoto(photo, item.src, GALLERY_SIZES);
      photo.alt = item.title;
    }
  }

  function gallerySelect(index, animate) {
    var version = ++galleryVersion;
    var item = galleryItems[index];
    var preload = new Image();

    galleryPending = index;
    $('#galleryViewer').attr('aria-busy', 'true');

    preload.onload = function () {
      if (version !== galleryVersion) return;

      gallerySwapPhoto(item, animate);
      galleryIndex = index;

      var position = galleryVisible.indexOf(index) + 1;
      var setCaption = function () { $('#galleryCaption').text(item.title); };
      if (animate) smoothContent('gallery-caption', '#galleryCaption', setCaption);
      else setCaption();

      $('#galleryPosition').text(pad(position) + ' / ' + pad(galleryVisible.length));
      $('#galleryOpen').attr('aria-label', 'View ' + item.title + ' full screen');
      $('#glTrack [data-image]').each(function () {
        $(this).attr('aria-pressed', String(+this.getAttribute('data-image') === index));
      });
      $('#galleryPrevious, #galleryFollowing').prop('disabled', galleryVisible.length < 2);
      $('#galleryViewer').attr('aria-busy', 'false');

      if (animate) {
        $('#galleryStatus').text(item.title + '. Image ' + position + ' of ' + galleryVisible.length + '.');
        galleryScrollRail(index);
      }
    };

    preload.onerror = function () {
      if (version !== galleryVersion) return;
      galleryPending = galleryIndex;
      $('#galleryViewer').attr('aria-busy', 'false');
      $('#galleryStatus').text('This image could not be loaded.');
    };

    applyPhoto(preload, item.src, GALLERY_SIZES);
  }

  function galleryStep(direction) {
    var count = galleryVisible.length;
    var next = (galleryVisible.indexOf(galleryPending) + direction + count) % count;
    gallerySelect(galleryVisible[next], true);
  }

  /* Masonry grid: every image at its natural shape, never cropped. */
  function galleryGridRender(cat) {
    var list = galleryItems.filter(function (g) { return cat === 'all' || g.category === cat; });
    $('#glGrid').html(list.map(function (g, i) {
      var so = window.BirlaImageSources && window.BirlaImageSources[g.src];
      var extra = so ? ' srcset="' + so.srcset + '" sizes="(max-width: 600px) 86vw, 640px" width="' + so.width + '" height="' + so.height + '"' : '';
      return '<button type="button" class="glm" data-gi="' + i + '"><img src="' + g.src + '"' + extra + ' loading="lazy" decoding="async" alt="' + esc(g.title) + '">' +
        '<span class="glm__cap"><small>' + pad(i + 1) + '</small>' + esc(g.title) + '</span></button>';
    }).join('')).data('list', list);
    refreshScroll();
  }
  galleryGridRender('all');
  (function () {
    var rail = document.getElementById('glGrid');
    function step(dir) { rail.scrollBy({ left: dir * rail.clientWidth * .8, behavior: 'smooth' }); }
    function progress() {
      var max = rail.scrollWidth - rail.clientWidth;
      var vis = rail.clientWidth / rail.scrollWidth;
      var bar = document.getElementById('glsBar');
      bar.style.width = (vis * 100) + '%';
      bar.style.left = (max > 0 ? rail.scrollLeft / max * (100 - vis * 100) : 0) + '%';
      document.getElementById('glsPrev').disabled = rail.scrollLeft < 4;
      document.getElementById('glsNext').disabled = rail.scrollLeft > max - 4;
    }
    $('#glsPrev').on('click', function () { step(-1); });
    $('#glsNext').on('click', function () { step(1); });
    rail.addEventListener('scroll', progress, { passive: true });
    $(window).on('resize load', progress);
    $(rail).on('load', 'img', progress);
    rail.addEventListener('load', progress, true);
    $('#galleryFilters').on('click', '[data-category]', function () { rail.scrollLeft = 0; setTimeout(progress, 50); });
    setTimeout(progress, 300);
  })();
  $('#glGrid').on('click', '.glm', function () {
    var list = $('#glGrid').data('list');
    lightboxOpen(list.map(function (g) { return { src: g.src, title: g.title + ' · Artist\'s impression' }; }), +this.getAttribute('data-gi'));
  });
  $('#galleryFilters').on('click', '[data-category]', function () { galleryGridRender(this.getAttribute('data-category')); });

  $('#galleryFilters').on('click', '[data-category]', function () {
    var category = this.getAttribute('data-category');

    galleryVisible = galleryItems
      .map(function (_, i) { return i; })
      .filter(function (i) { return category === 'all' || galleryItems[i].category === category; });

    $('#galleryFilters [data-category]').attr('aria-pressed', 'false');
    $(this).attr('aria-pressed', 'true');

    galleryPending = galleryVisible.indexOf(galleryIndex) >= 0 ? galleryIndex : galleryVisible[0];
    galleryRenderRail();
    gallerySelect(galleryPending, true);
  });

  $('#glTrack').on('click', '[data-image]', function () { gallerySelect(+this.getAttribute('data-image'), true); });
  $('#galleryPrevious').on('click', function () { galleryStep(-1); });
  $('#galleryFollowing').on('click', function () { galleryStep(1); });
  $('#galleryViewer').on('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    galleryStep(e.key === 'ArrowLeft' ? -1 : 1);
  });

  /* Swipe left/right on touch screens. */
  var touchStart = null;
  var justSwiped = false;
  var gallerySurface = document.getElementById('galleryOpen');

  gallerySurface.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  gallerySurface.addEventListener('touchend', function (e) {
    if (!touchStart || !e.changedTouches.length) return;

    var dx = e.changedTouches[0].clientX - touchStart.x;
    var dy = e.changedTouches[0].clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      justSwiped = true;
      galleryStep(dx < 0 ? 1 : -1);
      setTimeout(function () { justSwiped = false; }, 400);
    }
  }, { passive: true });

  $('#galleryOpen, #galleryExpand').on('click', function () {
    if (justSwiped) { justSwiped = false; return; }
    if ($('#galleryViewer').attr('aria-busy') === 'true') return;

    lightboxOpen(galleryVisible.map(function (i) {
      return { src: galleryItems[i].src, title: galleryItems[i].title + ' - Artist\'s impression' };
    }), galleryVisible.indexOf(galleryIndex));
  });

  galleryRenderRail();
  gallerySelect(0, false);

  /* =====================================================================
     LOCATION
     ===================================================================== */
  var $locTabs = $('#lcTabs');

  $locTabs.html($.map(LOCATIONS, function (l, i) {
    return '<button type="button" class="tab' + (i ? '' : ' is-on') + '" role="tab" id="locationTab' + i + '" aria-controls="lcPanel" aria-selected="' + String(!i) + '" tabindex="' + (i ? '-1' : '0') + '" data-i="' + i + '">' + l.title + '</button>';
  }).join(''));

  function locationShow(i, animate) {
    var place = LOCATIONS[i];

    $locTabs.find('.tab')
      .removeClass('is-on').attr({ 'aria-selected': 'false', tabindex: '-1' })
      .eq(i).addClass('is-on').attr({ 'aria-selected': 'true', tabindex: '0' });
    $('#lcPanel').attr('aria-labelledby', 'locationTab' + i);

    function render() {
      $('#lcCategory').text(place.title);
      $('#lcList')
        .attr('aria-label', 'Nearby ' + place.title.toLowerCase())
        .scrollTop(0)
        .html($.map(place.items, function (x) {
          var km = x[1].split(' ')[0];
          return '<li><span>' + esc(x[0]) + '</span><b>' + km + '<small>km</small></b></li>';
        }).join(''));
      refreshScroll();
    }

    if (animate) smoothContent('location', '#lcList, #lcCategory', render);
    else render();
  }

  $locTabs.on('click', '.tab', function () { locationShow(+$(this).data('i'), true); });
  enableTabKeys($locTabs, '.tab');
  locationShow(0, false);

  $('#lcMap').on('click', function () {
    lightboxOpen([{ src: IMG + 'misc/map.webp', title: 'Birla Punya location map · Source: Google Maps' }], 0);
  });

  /* =====================================================================
     FAQ + FOOTER DISCLAIMER
     ===================================================================== */
  $('#fqAcc').html($.map(FAQS, function (f, i) {
    return '<details' + (i ? '' : ' open') + '><summary><span>' + esc(f[0]) + '</span></summary>' +
      '<div class="acc__body"><p>' + esc(f[1]) + '</p></div></details>';
  }).join(''));

  // Compact: show the first 6, reveal the rest on demand.
  $('#fqAcc').after('<button type="button" class="fq__more" id="fqMore" aria-expanded="false">View all ' + FAQS.length + ' FAQs</button>');
  $('#fqMore').on('click', function () {
    var open = $('#fqAcc').toggleClass('is-all').hasClass('is-all');
    $(this).text(open ? 'Show fewer' : 'View all FAQs').attr('aria-expanded', String(open));
    refreshScroll();
  });

  // Only one answer open at a time.
  $('.acc details').on('toggle', function () {
    if (this.open) $(this).siblings('details[open]').removeAttr('open');
    refreshScroll();
  });

  $('#ftMore').on('click', function () {
    var open = $('#ftDisc').toggleClass('is-open').hasClass('is-open');
    $(this).text(open ? 'Read less' : 'Read more').attr('aria-expanded', String(open));
    refreshScroll();
  });

  /* =====================================================================
     HEADER + MOBILE MENU + NAVIGATION
     ===================================================================== */
  var header = document.getElementById('hd');
  var $menu = $('#menu');
  var $burger = $('#burger');

  function headerUpdate(scrollY) {
    var y = typeof scrollY === 'number' ? scrollY : window.scrollY;
    var menuOpen = $menu.hasClass('is-open');
    header.classList.toggle('is-solid', y > 60 && !menuOpen);
    header.classList.toggle('is-menu-open', menuOpen);
  }
  $win.on('scroll', function () { headerUpdate(); });
  headerUpdate();

  function menuOpen() {
    $menu.addClass('is-open').attr('aria-hidden', 'false').prop('inert', false);
    $burger.attr({ 'aria-expanded': 'true', 'aria-label': 'Close menu' });
    lockScroll();
    headerUpdate();
    $menu.find('a').first().trigger('focus');
  }

  function menuClose() {
    $menu.removeClass('is-open').attr('aria-hidden', 'true').prop('inert', true);
    $burger.attr({ 'aria-expanded': 'false', 'aria-label': 'Open menu' });
    unlockScroll();
    headerUpdate();
    $burger.trigger('focus');
  }

  $burger.on('click', function () {
    if ($menu.hasClass('is-open')) menuClose();
    else menuOpen();
  });

  $win.on('resize', function () {
    if (window.innerWidth > 1100 && $menu.hasClass('is-open')) menuClose();
  });

  // Keep Tab focus inside the header + menu while the menu is open.
  $doc.on('keydown.menu', function (e) {
    if (e.key !== 'Tab' || !$menu.hasClass('is-open')) return;

    var controls = $('#hd a, #hd button, #menu a, #menu button').filter(':visible');
    var first = controls[0];
    var last = controls[controls.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* In-page anchor links glide with Lenis. */
  $doc.on('click', 'a[href^="#"]', function (e) {
    var id = this.getAttribute('href');
    if (id.length < 2) return;

    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    if ($menu.hasClass('is-open')) menuClose();

    if (lenis) {
      lenis.scrollTo(target, { offset: id === '#home' ? 0 : -(header.offsetHeight + 36), duration: 1.6 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });

  /* Active nav link + sliding underline marker. */
  var $navLinks = $('.hd__nav a');

  function navSetActive($link) {
    $navLinks.removeClass('is-on').removeAttr('aria-current');
    $link.addClass('is-on').attr('aria-current', 'location');
    navMarker();
  }

  function navMarker() {
    var active = $navLinks.filter('.is-on')[0];
    var nav = document.querySelector('.hd__nav');

    if (!active || !nav.offsetWidth) {
      nav.classList.remove('has-active');
      return;
    }
    nav.style.setProperty('--nav-x', active.offsetLeft + 'px');
    nav.style.setProperty('--nav-width', active.offsetWidth + 'px');
    nav.classList.add('has-active');
  }

  $navLinks.on('click', function () { navSetActive($(this)); });
  $win.on('resize', navMarker);
  if (document.fonts) document.fonts.ready.then(navMarker);

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) navSetActive($navLinks.filter('[href="#' + entry.target.id + '"]'));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    $navLinks.each(function () {
      var section = document.querySelector(this.getAttribute('href'));
      if (section) navObserver.observe(section);
    });
    navObserver.observe(document.getElementById('home'));
  }

  /* =====================================================================
     LIGHTBOX
     ===================================================================== */
  var $lightbox = $('#lb');
  var $modal = $('#leadModal');
  var lightboxList = [];
  var lightboxIndex = 0;

  function lightboxShow(i) {
    lightboxIndex = (i + lightboxList.length) % lightboxList.length;
    var item = lightboxList[lightboxIndex];

    $('#lbImg').attr({ src: item.src, alt: item.title });
    $('#lbCap').text(item.title);
    $lightbox.find('.lb__nav').toggle(lightboxList.length > 1);
    if (anim) G.fromTo('#lbImg', { opacity: 0, scale: .96 }, { opacity: 1, scale: 1, duration: .7, ease: 'expo.out' });
  }

  function lightboxOpen(list, i) {
    lightboxList = list;
    $lightbox.addClass('is-open').attr('aria-hidden', 'false');
    lockScroll();
    lightboxShow(i || 0);
  }

  function lightboxClose() {
    $lightbox.removeClass('is-open').attr('aria-hidden', 'true');
    if (!$modal.hasClass('is-open')) unlockScroll();
  }

  $lightbox
    .on('click', '[data-lb-close]', lightboxClose)
    .on('click', '[data-lb-prev]', function () { lightboxShow(lightboxIndex - 1); })
    .on('click', '[data-lb-next]', function () { lightboxShow(lightboxIndex + 1); })
    .on('click', function (e) { if (e.target === this) lightboxClose(); });

  /* =====================================================================
     LEAD MODAL
     ===================================================================== */

  /* Pick the modal heading from the button's enquiry source. */
  function modalTitleFor(source) {
    if (/visit/i.test(source)) return 'Book a site visit';
    if (/plan.*price/i.test(source)) return 'Get your plan & price';
    if (/plan/i.test(source)) return 'Get the unit plan';
    if (/brochure|full list/i.test(source)) return 'Download the brochure';
    if (/price|cost/i.test(source)) return 'Get the price sheet';
    return 'Enquire now';
  }

  function modalOpen(source) {
    $('#modalTitle').text(modalTitleFor(source));
    $modal.find('.lead-form').attr('data-source', source || 'Popup Form');
    if ($menu.hasClass('is-open')) menuClose();

    $modal.addClass('is-open').attr('aria-hidden', 'false');
    lockScroll();
    store.set('bp_popup_seen', '1', true);
  }

  function modalClose() {
    $modal.removeClass('is-open').attr('aria-hidden', 'true');
    if (!$lightbox.hasClass('is-open')) unlockScroll();
  }

  $doc.on('click', '[data-enquire]', function (e) {
    e.preventDefault();
    e.stopPropagation();
    modalOpen($(this).attr('data-enquire'));
  });
  $modal.on('click', '[data-close]', modalClose);

  // Escape closes the top-most overlay.
  $doc.on('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($lightbox.hasClass('is-open')) lightboxClose();
    else if ($modal.hasClass('is-open')) modalClose();
    else if ($menu.hasClass('is-open')) menuClose();
  });

  // Auto popup once per session, unless they already enquired.
  setTimeout(function () {
    var alreadyLead = store.get('bp_lead') === '1';
    var alreadySeen = store.get('bp_popup_seen', true);
    var overlayOpen = $modal.hasClass('is-open') || $lightbox.hasClass('is-open');
    if (!alreadyLead && !alreadySeen && !overlayOpen) modalOpen('Auto Popup');
  }, AUTO_POPUP_DELAY);

  /* =====================================================================
     RESPONSIVE IMAGES
     ===================================================================== */
  $('img[src]').each(function () {
    if (this.id === 'lbImg') return;

    var src = this.getAttribute('src');
    var sizes;
    if (this.id === 'galleryPhoto') sizes = GALLERY_SIZES;
    else if (this.classList.contains('hero__image')) sizes = '(max-width: 600px) 100vw, 55vw';
    else if (this.closest('#lcMap')) sizes = '(max-width: 600px) calc(100vw - 64px), (max-width: 900px) 55vw, 760px';
    else if (this.closest('.menu__img')) sizes = '45vw';

    if (window.BirlaImageSources && window.BirlaImageSources[src]) applyPhoto(this, src, sizes);
    else this.decoding = 'async';
  });

  /* =====================================================================
     MOTION
     ===================================================================== */
  function startCounters() {
    $('[data-count]').each(function () {
      var el = this;
      var target = +el.getAttribute('data-count');

      if (!anim) { el.textContent = target; return; }

      var counter = { value: 0 };
      G.to(counter, {
        value: target, duration: 2.2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        onUpdate: function () { el.textContent = Math.round(counter.value); }
      });
    });
  }

  /* No GSAP or reduced motion: show everything in its final state and stop here. */
  if (!anim) {
    $('[data-up],[data-hero]').css({ opacity: 1, transform: 'none' });
    $('[data-clip]').css('clip-path', 'none');
    $('.ov__statement').css('opacity', 1);
    startCounters();
    return;
  }

  G.registerPlugin(ST);

  /* ---------- Smooth scroll + progress bar ---------- */
  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.25,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    lenis.on('scroll', function (e) {
      ST.update();
      headerUpdate(e.scroll);
    });
    G.ticker.add(function (time) { lenis.raf(time * 1000); });
    G.ticker.lagSmoothing(0);
  }

  G.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  /* ---------- Text splitting ---------- */
  function splitChars(el) {
    var text = el.textContent;
    el.textContent = '';
    text.split('').forEach(function (char) {
      var wrap = document.createElement('span');
      var inner = document.createElement('span');
      wrap.className = 'chw';
      inner.className = 'ch';
      inner.textContent = char;
      wrap.appendChild(inner);
      el.appendChild(wrap);
    });
    return el.querySelectorAll('.ch');
  }

  function splitWords(el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="w">' + w + '</span>';
    }).join(' ');
    return el.querySelectorAll('.w');
  }

  /* Headings: wrap each word in a mask so the line rises into view. */
  function splitLines(el) {
    var wrap = function (html) { return '<span class="line-wrap" style="display:inline-block"><span>' + html + '</span></span>'; };
    var out = [];

    $(el).contents().each(function () {
      if (this.nodeType === 3) {
        this.textContent.split(/(\s+)/).forEach(function (part) {
          out.push(/\S/.test(part) ? wrap(esc(part)) : part);
        });
      } else {
        out.push(wrap(this.outerHTML));
      }
    });
    el.innerHTML = out.join('');
    return el.querySelectorAll('.line-wrap > span');
  }

  /* ---------- Hero intro ---------- */
  var heroChars = [];
  $('[data-split]').each(function () { heroChars.push.apply(heroChars, splitChars(this)); });

  var settle = { ease: 'power3.out', clearProps: 'transform,opacity' };
  var heroIntro = G.timeline({ delay: .15, onComplete: function () { $('.hero').addClass('is-ready'); } });
  heroIntro
    .from('.hero__pattern', { opacity: 0, duration: 1.5, ease: 'power2.out' }, 0)
    .from(heroChars, { yPercent: 110, duration: 1.1, stagger: .035, ease: 'power4.out' }, '<.1')
    .to('[data-hero]', { opacity: 1, duration: .9, stagger: .1, ease: 'power2.out' }, '<.4')
    .from('[data-hero]', { y: 20, duration: .9, stagger: .1, ease: 'power3.out' }, '<')
    .from('.hero__typology strong', $.extend({ y: 8, opacity: 0, duration: .65 }, settle), .6)
    .from('.hero__price', $.extend({ y: 18, opacity: 0, duration: .85 }, settle), .7)
    .from('.hero__price small, .hero__amount > span', $.extend({ y: 8, opacity: 0, duration: .65, stagger: .08 }, settle), .95)
    .from('.hero__cta .btn', $.extend({ y: 10, opacity: 0, duration: .6, stagger: .12 }, settle), 1)
    .from('.hero__highlights li', $.extend({ y: 16, opacity: 0, duration: .65, stagger: .14 }, settle), 1.1)
    .from('.hero__caption', { y: 12, opacity: 0, duration: .8, clearProps: 'transform,opacity' }, .4);

  /* Count up the banner highlights only; the price stays readable. */
  $('[data-hero-count]').each(function (i) {
    var el = this;
    var counter = { value: 0 };
    heroIntro.to(counter, {
      value: +el.getAttribute('data-hero-count'), duration: 1.15, ease: 'power2.out',
      onUpdate: function () { el.textContent = Math.round(counter.value); }
    }, 1.15 + i * .14);
  });

  /* A light glint passes over the highlights once the intro ends. */
  heroIntro.call(function () { $('.hero__highlights').addClass('is-lit'); }, null, 2.6);

  /* ---------- Hero image: curtain reveal, scroll drift, pointer depth ---------- */
  (function () {
    var media = document.getElementById('heroMedia');
    var img = media && media.querySelector('.hero__image');
    if (!img) return;

    media.insertAdjacentHTML('beforeend', '<span class="hero__wipe" aria-hidden="true"></span><span class="hero__glint" aria-hidden="true"></span>');
    var wipe = media.querySelector('.hero__wipe');

    G.set(img, { scale: 1.3, transformOrigin: '50% 40%' });
    heroIntro
      .fromTo(media, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
      .fromTo(wipe, { xPercent: 0, opacity: 1 }, { left: '0%', duration: 1.5, ease: 'expo.inOut' }, 0)
      .to(wipe, { opacity: 0, duration: .4 }, 1.4)
      .to(img, { scale: 1.06, duration: 2.6, ease: 'expo.out' }, .3)
      .add(function () { media.classList.add('is-revealed'); }, 1.8);

    // Drift and slow zoom as the banner scrolls away.
    G.to(img, { yPercent: 8, scale: 1.14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Subtle depth on desktop pointer movement.
    if (!window.matchMedia('(hover: hover) and (min-width: 901px)').matches) return;

    var hero = document.querySelector('.hero');
    var moveX = G.quickTo(img, 'x', { duration: 1.2, ease: 'power3.out' });
    var moveY = G.quickTo(img, 'y', { duration: 1.2, ease: 'power3.out' });

    hero.addEventListener('pointermove', function (e) {
      var r = media.getBoundingClientRect();
      moveX(((e.clientX - r.left) / r.width - .5) * -22);
      moveY(((e.clientY - r.top) / r.height - .5) * -14);
    });
    hero.addEventListener('pointerleave', function () {
      moveX(0);
      moveY(0);
    });
  })();

  /* ---------- Overview: words light up as you scroll ---------- */
  G.to(splitWords(document.querySelector('[data-words]')), {
    opacity: 1, stagger: .1, ease: 'none',
    scrollTrigger: { trigger: '[data-words]', start: 'top 80%', end: 'bottom 45%', scrub: true }
  });

  /* ---------- Elevation sketch ----------
     Draws the building elevation in pencil-like passes as the section enters view.
     A stroked SVG mask reveals the artwork without shifting content.
     Visitors without animation keep the static CSS background. */
  $('.ov__sketch, .cf, .gl').each(function (index) {
    var section = this;
    var maskId = 'elevation-pencil-' + index;
    var left = 660;
    var right = 1680;
    var strokes = [];

    // Zig-zag pencil path from top to bottom.
    for (var y = 0, row = 0; y <= 960; y += 19, row++) {
      strokes.push((row ? 'L' : 'M') + (row % 2 ? right : left) + ' ' + y);
      strokes.push('L' + (row % 2 ? left : right) + ' ' + (y + 7));
    }

    section.insertAdjacentHTML('afterbegin',
      '<svg class="elevation-sketch" viewBox="0 0 1672 941" aria-hidden="true" focusable="false">' +
        '<defs><mask id="' + maskId + '" maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="941">' +
          '<path class="elevation-sketch__pencil" d="' + strokes.join(' ') + '" fill="none" stroke="white" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</mask></defs>' +
        '<image href="' + IMG + 'pattern/elevation-watercolor.webp" width="1672" height="941" preserveAspectRatio="none" mask="url(#' + maskId + ')"/>' +
      '</svg>');

    var pencil = section.querySelector('.elevation-sketch__pencil');
    var length = pencil.getTotalLength();

    G.set(pencil, { strokeDasharray: length, strokeDashoffset: length });
    section.classList.add('has-elevation-sketch');
    G.to(pencil, {
      strokeDashoffset: 0, duration: 3.8, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 78%', once: true },
      onStart: function () { section.classList.add('is-sketching'); },
      onComplete: function () {
        section.classList.remove('is-sketching');
        section.classList.add('is-sketched');
      }
    });
  });

  /* ---------- Section reveals ---------- */
  $('[data-lines]').each(function () {
    G.from(splitLines(this), { yPercent: 110, duration: 1.3, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: this, start: 'top 88%' } });
  });

  ST.batch('[data-up]', {
    start: 'top 90%', once: true,
    onEnter: function (batch) { G.to(batch, { opacity: 1, y: 0, duration: 1.2, stagger: .1, ease: 'expo.out' }); }
  });

  // Image wipes + inner parallax.
  $('[data-clip]').each(function () {
    G.to(this, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: this, start: 'top 85%' } });
  });
  $('[data-parallax]').each(function () {
    G.fromTo(this, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: this.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  startCounters();

  G.from('.residences__panel', { opacity: 0, y: 24, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.residences__panel', start: 'top 90%', once: true } });
  G.from('.ami', { opacity: 0, x: 40, duration: 1.1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '#amList', start: 'top 85%' } });
  G.from('#galleryViewer', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '#galleryViewer', start: 'top 90%', once: true } });

  ST.batch('.acc details, .rera__qrs figure', {
    start: 'top 94%', once: true,
    onEnter: function (batch) {
      G.fromTo(batch, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .7, stagger: .1, ease: 'power3.out', clearProps: 'transform,opacity' });
    }
  });

  /* ---------- Detail motion ---------- */

  // Gold underline draws in under each heading.
  ST.batch('.head .title, .fq__grid .title, .ct__title', {
    start: 'top 85%', once: true,
    onEnter: function (batch) {
      batch.forEach(function (el, i) {
        setTimeout(function () { el.classList.add('is-drawn'); }, 350 + i * 120);
      });
    }
  });

  // Stats cards rise in sequence, then their numbers get a gold glint.
  if (document.querySelector('.stats')) G.from('.stats li', {
    opacity: 0, y: 40, scale: .94, duration: 1, stagger: .12, ease: 'expo.out', clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.stats', start: 'top 88%', once: true },
    onComplete: function () { $('.stats').addClass('is-lit'); }
  });

  // Tabs, location rows, gallery thumbs and filters cascade in.
  [
    ['.residences__types > *', '.residences__types'],
    ['#lcList li', '#lcList'],
    ['#glTrack button', '#glTrack'],
    ['.lc__tabs > *', '.lc__tabs'],
    ['.gallery__filters button', '.gallery__filters']
  ].forEach(function (pair) {
    if (!document.querySelector(pair[0])) return;
    G.from(pair[0], $.extend({ opacity: 0, y: 14, duration: .7, stagger: .06, scrollTrigger: { trigger: pair[1], start: 'top 90%', once: true } }, settle));
  });

  // Section kickers slide in with their gold rule.
  ST.batch('.sec .kicker, .ct .kicker', {
    start: 'top 90%', once: true,
    onEnter: function (batch) { batch.forEach(function (el) { el.classList.add('is-in'); }); }
  });

  // Contact card lifts in; the map drifts slowly.
  G.from('.ct .card', {
    opacity: 0, y: 50, rotateX: 8, transformPerspective: 900, duration: 1.3, ease: 'expo.out', clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.ct', start: 'top 75%', once: true }
  });
  G.fromTo('.lc__map img', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.lc__map', start: 'top bottom', end: 'bottom top', scrub: true } });

  $win.on('load', refreshScroll);

})(jQuery);
