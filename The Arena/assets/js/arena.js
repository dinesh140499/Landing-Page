/* =========================================================================
   THE ARENA, PIMPRI — "Matchday" design · data + interactions
   Needs jQuery (vendor bundle) and lead-form.js (loaded first).
   ========================================================================= */
(function ($) {
  'use strict';

  /* ---------- SETTINGS — check before going live ---------- */
  var SETTINGS = {
    phone: '+918080907434',
    phoneLabel: '+91 80809 07434',
    rera: ''                       // MahaRERA no. — fill in when issued
  };
  var IMG = 'assets/images/';

  /* ---------- DATA ---------- */
  var CONFIGS = [
    { type: '2 BHK', area: '728 – 1,248', price: '1.15 Cr*' },
    { type: '3 BHK', area: '1,232 – 2,463', price: '1.74 Cr*' },
    { type: '4 BHK', area: '1,590 – 3,050', price: '2.40 Cr*' }
  ];
  var PLANS = [
    { id: '2bhk-994', name: '2 BHK', area: '994' },
    { id: '2bhk-1206', name: '2 BHK', area: '1,206' },
    { id: '3bhk-1232', name: '3 BHK', area: '1,232' },
    { id: '3bhk-1594', name: '3 BHK', area: '1,594' },
    { id: '4bhk-1625', name: '4 BHK', area: '1,625' },
    { id: '4bhk-1944', name: '4 BHK', area: '1,944' },
    { id: 'master-plan', name: 'Master plan', area: '' },
    { id: 'typical-floor', name: 'Typical floor', area: '' }
  ];
  var ZONES = [
    { title: 'Play', items: [['open-air-courts', 'Open-air courts'], ['racquet-courts', 'Indoor racquet courts'], ['gym', 'Expansive gym floor'], ['cue-lounge', 'Cue sports lounge'], ['sports-bar', 'Premium sports bar']] },
    { title: 'Recover', items: [['jacuzzi-deck', 'Jacuzzi & wet leisure deck'], ['steam-sauna', 'Steam, sauna & recovery'], ['cafe-lounge', 'Café lounges']] },
    { title: 'Learn & Work', items: [['early-learning', 'Early learning centre'], ['co-working', 'Co-working spaces'], ['cafe-lounge', 'Café lounges']] }
  ];
  var GALLERY = [
    ['r-revised-view-01', 'The township'], ['r-9', 'Lake edge'], ['r-6', 'Elevated walkway'], ['rooftop-pool', 'Rooftop pool'],
    ['r-8', 'Amphitheatre deck'], ['r-3', 'Water body at dusk'], ['r-4', 'Jogging track'], ['r-11', 'Sculpted pavilion'], ['r-2a', 'Landscaped park']
  ];
  var LOCATIONS = [
    { title: 'Connectivity', items: [['Pune Metro Line 1', '2.4'], ['Chinchwad Railway Station', '2.5'], ['Pimpri Railway Station', '3.5'], ['Pune Railway Station', '17.2'], ['Pune International Airport', '20.4']] },
    { title: 'Workplaces', items: [['KWT (Kohinoor World Towers)', '2'], ['Chakan MIDC', '3.4'], ['MIDC Pimpri–Chinchwad', '4.4'], ['Bhosari Industrial Area', '7.8'], ['Hinjewadi IT Park', '9.9']] },
    { title: 'Education', items: [['Podar International School', '3.8'], ['St. Ursula High School', '4'], ['City Pride School', '4.5'], ['SNBP International School', '4.7'], ['D. Y. Patil International University', '5.7']] },
    { title: 'Healthcare', items: [['Aditya Birla Memorial Hospital', '4.1'], ['Lokmanya Hospital', '5'], ['Sterling Multispecialty Hospital', '5'], ['Dr. D.Y. Patil Hospital', '5.9'], ['Ruby Hall Clinic, Hinjewadi', '11.4']] }
  ];

  /* ---------- HELPERS ---------- */
  var $doc = $(document);
  var store = (window.LeadForm && window.LeadForm.store) || { get: function () { return null; }, set: function () {} };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var locks = 0;
  function lockScroll() { if (locks++ === 0) document.documentElement.classList.add('is-locked'); }
  function unlockScroll() { if (locks > 0 && --locks === 0) document.documentElement.classList.remove('is-locked'); }

  /* ---------- CONTACT DETAILS ---------- */
  $('[data-tel]').attr('href', 'tel:' + SETTINGS.phone);
  $('[data-tel-label]').text(SETTINGS.phoneLabel);
  if (SETTINGS.rera) $('[data-rera]').text(SETTINGS.rera);
  $('#year').text(new Date().getFullYear());

  /* ---------- HEADER ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MENU ---------- */
  var $menu = $('#menu'), $burger = $('#burger');
  function menuOpen() { $menu.addClass('is-open').attr('aria-hidden', 'false').removeAttr('inert'); $burger.attr('aria-expanded', 'true').addClass('is-x'); lockScroll(); }
  function menuClose() { if (!$menu.hasClass('is-open')) return; $menu.removeClass('is-open').attr({ 'aria-hidden': 'true', inert: '' }); $burger.attr('aria-expanded', 'false').removeClass('is-x'); unlockScroll(); }
  $burger.on('click', function () { $menu.hasClass('is-open') ? menuClose() : menuOpen(); });
  $menu.on('click', 'a', menuClose);

  /* ---------- HERO SLIDESHOW ---------- */
  (function () {
    var slides = $('#heroBg img'), i = 0;
    var $dots = $('#heroDots');
    slides.each(function (n) { $dots.append('<i' + (n ? '' : ' class="is-on"') + '></i>'); });
    function load(img) {
      if (img.dataset.src) { img.srcset = img.dataset.srcset; img.src = img.dataset.src; img.removeAttribute('data-src'); }
    }
    if (reduceMotion || slides.length < 2) return;
    setTimeout(function () { slides.each(function () { load(this); }); }, 2500);
    setInterval(function () {
      slides.eq(i).removeClass('is-on'); $dots.children().eq(i).removeClass('is-on');
      i = (i + 1) % slides.length;
      load(slides[i]);
      slides.eq(i).addClass('is-on'); $dots.children().eq(i).addClass('is-on');
    }, 6000);
  })();

  /* ---------- REVEAL ON SCROLL ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function watch(root) { $(root || document).find('[data-rv]').each(function () { io ? io.observe(this) : this.classList.add('is-in'); }); }
  watch();

  /* staggered children + image wipes (CSS does the motion) */
  function stagger(sel) {
    $(sel).each(function () {
      $(this).children().each(function (n) { this.setAttribute('data-st', ''); this.style.setProperty('--i', n); if (io) io.observe(this); else this.classList.add('is-in'); });
    });
  }
  window.ArenaStagger = stagger;
  $('.slot figure').attr('data-wipe', '').each(function () { if (io) io.observe(this); else this.classList.add('is-in'); });

  /* ---------- FILM (opens in lightbox-style player) ---------- */
  $('#filmOpen').on('click', function () {
    var $v = $('<div class="film"><div class="film__bg"></div><video controls autoplay playsinline src="assets/video/life-in-motion.mp4"></video><button type="button" class="film__x" aria-label="Close">×</button></div>');
    $('body').append($v); lockScroll();
    $v.on('click', '.film__bg, .film__x', function () { $v.remove(); unlockScroll(); });
  });

  /* ---------- A DAY AT THE ARENA (scroll rail) ---------- */
  (function () {
    var r = document.getElementById('dayRail');
    if (!r) return;
    function prog() {
      var max = r.scrollWidth - r.clientWidth;
      document.getElementById('dayProg').style.width = (max > 0 ? Math.max(8, r.scrollLeft / max * 100) : 100) + '%';
      $('#dayPrev').prop('disabled', r.scrollLeft < 4); $('#dayNext').prop('disabled', r.scrollLeft > max - 4);
    }
    function step(d) { r.scrollBy({ left: d * Math.max(260, r.clientWidth * .6), behavior: reduceMotion ? 'auto' : 'smooth' }); }
    $('#dayPrev').on('click', function () { step(-1); }); $('#dayNext').on('click', function () { step(1); });
    r.addEventListener('scroll', prog, { passive: true }); window.addEventListener('resize', prog); prog();
  })();

  /* ---------- FIXTURE TABLE ---------- */
  $('#fixBody').html(CONFIGS.map(function (c) {
    var plans = PLANS.filter(function (p) { return p.name === c.type; });
    return '<div class="fix__row" role="row"><b role="cell">' + esc(c.type) + '</b>' +
      '<span role="cell"><strong>' + esc(c.area) + '</strong> sq. ft.</span>' +
      '<span role="cell" class="fix__plans">' + plans.map(function (p) {
        return '<button type="button" class="fix__plan" data-enquire="Floor Plan — ' + esc(p.name + ' ' + p.area) + '"><img src="' + IMG + 'plans/' + p.id + '.webp" alt="" loading="lazy" decoding="async"><em>' + p.area + '</em></button>';
      }).join('') + '</span>' +
      '<span role="cell" class="fix__price">₹' + esc(c.price) + '</span>' +
      '<span role="cell"><button type="button" class="btn btn--ink btn--sm" data-enquire="Price — ' + esc(c.type) + '">Check price</button></span></div>';
  }).join(''));
  stagger('#fixBody');

  /* ---------- AMENITIES: FLIP CARDS ---------- */
  var BLURB = {
    'open-air-courts': 'Floodlit outdoor courts for football, tennis and pickleball.',
    'racquet-courts': 'Indoor courts for badminton, squash and racquet sports.',
    'gym': 'A large, fully equipped strength and cardio floor.',
    'cue-lounge': 'Snooker and pool tables in a relaxed lounge.',
    'sports-bar': 'Big-screen match nights with friends and neighbours.',
    'jacuzzi-deck': 'Jacuzzi and wet leisure deck for slow evenings.',
    'steam-sauna': 'Steam, sauna and recovery rooms after the game.',
    'cafe-lounge': 'Café lounges to meet, refuel and unwind.',
    'early-learning': 'A safe, playful early learning centre for kids.',
    'co-working': 'Quiet co-working desks a short walk from home.'
  };
  var CARDS = [];
  ZONES.forEach(function (z) { z.items.forEach(function (it) { if (!CARDS.some(function (c) { return c[0] === it[0]; })) CARDS.push([it[0], it[1], z.title]); }); });
  $('#deck').html(CARDS.map(function (c, i) {
    return '<button type="button" class="fc" data-ci="' + i + '" aria-label="' + esc(c[1]) + '"><span class="fc__in">' +
      '<span class="fc__front"><img src="' + IMG + 'amenities/' + c[0] + '-sm.webp" loading="lazy" decoding="async" alt=""><span class="fc__no">' + pad(i + 1) + '</span><span class="fc__name">' + esc(c[1]) + '</span></span>' +
      '<span class="fc__back"><small>' + esc(c[2]) + ' zone</small><b>' + esc(c[1]) + '</b><span>' + esc(BLURB[c[0]] || '') + '</span><em>View photo</em></span>' +
      '</span></button>';
  }).join(''));
  stagger('#deck');
  $('#deck').on('click', '.fc', function () {
    var i = +this.getAttribute('data-ci');
    if (window.matchMedia('(hover: none)').matches && !this.classList.contains('is-flip')) {
      $('#deck .fc').removeClass('is-flip'); this.classList.add('is-flip'); return;
    }
    lbOpen(CARDS.map(function (c) { return { src: IMG + 'amenities/' + c[0] + '.webp', cap: c[1] + ' · Artist\'s impression' }; }), i);
  });

  /* ---------- GALLERY: 3D COVERFLOW ---------- */
  var galItems = GALLERY.map(function (g) { return { src: IMG + 'gallery/' + g[0] + '.webp', sm: IMG + 'gallery/' + g[0] + '-sm.webp', cap: g[1] }; });
  var flowI = 0, flowTimer = null;
  $('#flowStage').html(galItems.map(function (g, i) {
    return '<button type="button" class="fl" data-fi="' + i + '" tabindex="-1"><img src="' + g.sm + '" ' + (i < 3 || i > galItems.length - 3 ? '' : 'loading="lazy" ') + 'decoding="async" alt="' + esc(g.cap) + '"></button>';
  }).join(''));
  $('#flowDots').html(galItems.map(function (_, i) { return '<i data-fi="' + i + '"></i>'; }).join(''));
  function flowGo(i) {
    var n = galItems.length;
    flowI = (i + n) % n;
    $('#flowStage .fl').each(function (k) {
      var d = k - flowI;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      var a = Math.abs(d);
      this.style.setProperty('--d', d);
      this.style.setProperty('--a', a);
      this.classList.toggle('is-on', d === 0);
      this.style.zIndex = 10 - a;
      this.style.opacity = a > 2 ? 0 : 1;
      this.style.pointerEvents = a > 2 ? 'none' : '';
    });
    $('#flowDots i').removeClass('is-on').eq(flowI).addClass('is-on');
    $('#flowNo').text(pad(flowI + 1) + ' / ' + pad(n));
    $('#flowCap').text(galItems[flowI].cap);
  }
  function flowAuto() {
    clearInterval(flowTimer);
    if (!reduceMotion) flowTimer = setInterval(function () { flowGo(flowI + 1); }, 4500);
  }
  $('#flowPrev').on('click', function () { flowGo(flowI - 1); flowAuto(); });
  $('#flowNext').on('click', function () { flowGo(flowI + 1); flowAuto(); });
  $('#flowDots').on('click', 'i', function () { flowGo(+this.getAttribute('data-fi')); flowAuto(); });
  $('#flowStage').on('click', '.fl', function () {
    var i = +this.getAttribute('data-fi');
    if (i === flowI) lbOpen(galItems, i); else { flowGo(i); flowAuto(); }
  });
  $('#flow').on('keydown', function (e) {
    if (e.key === 'ArrowLeft') { flowGo(flowI - 1); flowAuto(); }
    if (e.key === 'ArrowRight') { flowGo(flowI + 1); flowAuto(); }
  }).on('mouseenter', function () { clearInterval(flowTimer); }).on('mouseleave', flowAuto);
  (function () { // swipe
    var x0 = null, el = document.getElementById('flow');
    el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { flowGo(flowI + (dx < 0 ? 1 : -1)); flowAuto(); }
    });
  })();
  flowGo(0); flowAuto();

  /* ---------- LOCATION RINGS ---------- */
  var RMAX = 21;
  function ringR(km) { // 4 rings: 3, 6, 12, 21 km -> radius 25/50/75/100 %
    var stops = [[0, 6], [3, 25], [6, 50], [12, 75], [21, 100]];
    for (var k = 1; k < stops.length; k++) if (km <= stops[k][0]) { var a = stops[k - 1], b = stops[k]; return a[1] + (km - a[0]) / (b[0] - a[0]) * (b[1] - a[1]); }
    return 100;
  }
  $('#ringTabs').html(LOCATIONS.map(function (l, i) {
    return '<button type="button" role="tab" class="chip chip--dark' + (i ? '' : ' is-on') + '" aria-selected="' + !i + '" data-i="' + i + '">' + esc(l.title) + '</button>';
  }).join(''));
  function ringShow(i) {
    $('#ringTabs .chip').removeClass('is-on').attr('aria-selected', 'false').eq(i).addClass('is-on').attr('aria-selected', 'true');
    var items = LOCATIONS[i].items;
    $('#ringList').html(items.map(function (it, n) { return '<li data-n="' + n + '"><i>' + (n + 1) + '</i><span>' + esc(it[0]) + '</span><b>' + it[1] + ' km</b></li>'; }).join(''));
    $('#ringDots').html(items.map(function (it, n) {
      var ang = (-70 + n * (300 / items.length)) * Math.PI / 180, r = ringR(+it[1]) / 2;
      return '<span class="ring__dot" data-n="' + n + '" style="left:' + (50 + r * Math.cos(ang)) + '%;top:' + (50 + r * Math.sin(ang)) + '%;--d:' + (n * 80) + 'ms"><i>' + (n + 1) + '</i></span>';
    }).join(''));
  }
  $('#ringTabs').on('click', '.chip', function () { ringShow(+this.getAttribute('data-i')); });
  $('#ringList').on('mouseenter', 'li', function () { $('.ring__dot').removeClass('is-hot').filter('[data-n="' + this.getAttribute('data-n') + '"]').addClass('is-hot'); })
    .on('mouseleave', function () { $('.ring__dot').removeClass('is-hot'); });
  ringShow(0);
  $('#mapOpen').on('click', function () { lbOpen([{ src: IMG + 'misc/location-map-clean.webp', cap: 'The Arena · Finolex Chowk, Pimpri' }], 0); });

  /* ---------- COUNTERS ---------- */
  var counted = false;
  var statsEl = document.querySelector('.devstrip__stats');
  function runCount() {
    if (counted) return; counted = true;
    $('[data-count]').each(function () {
      var el = this, to = +el.getAttribute('data-count'), dec = +(el.getAttribute('data-dec') || 0), t0 = null;
      if (reduceMotion) return;
      function tick(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / 1400), v = to * (1 - Math.pow(1 - k, 3));
        el.textContent = dec ? v.toFixed(dec) : Math.round(v);
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  if (statsEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { runCount(); o.disconnect(); } }, { threshold: .4 }).observe(statsEl);
  }

  /* ---------- LIGHTBOX ---------- */
  var $lb = $('#lb'), lbList = [], lbI = 0;
  function lbShow(i) {
    lbI = (i + lbList.length) % lbList.length;
    $('#lbImg').attr({ src: lbList[lbI].src, alt: lbList[lbI].cap });
    $('#lbCap').text(lbList[lbI].cap);
    $lb.toggleClass('is-single', lbList.length < 2);
  }
  function lbOpen(list, i) { lbList = list; lbShow(i || 0); $lb.addClass('is-open').attr('aria-hidden', 'false'); lockScroll(); }
  function lbClose() { if (!$lb.hasClass('is-open')) return; $lb.removeClass('is-open').attr('aria-hidden', 'true'); unlockScroll(); }
  $lb.on('click', '[data-lb-close]', lbClose)
    .on('click', '[data-lb-prev]', function () { lbShow(lbI - 1); })
    .on('click', '[data-lb-next]', function () { lbShow(lbI + 1); })
    .on('click', function (e) { if (e.target === this) lbClose(); });

  /* ---------- LEAD MODAL ---------- */
  var $modal = $('#leadModal');
  function titleFor(src) {
    if (/visit/i.test(src)) return 'Book a site visit';
    if (/plan/i.test(src)) return 'Get the floor plan';
    if (/brochure|list/i.test(src)) return 'Get the brochure';
    if (/price/i.test(src)) return 'Get the price sheet';
    return 'Get pre-launch access';
  }
  function modalOpen(src) {
    menuClose();
    $('#modalTitle').text(titleFor(src || ''));
    $modal.find('.lead-form').attr('data-source', src || 'Popup Form');
    if (!$modal.hasClass('is-open')) { $modal.addClass('is-open').attr('aria-hidden', 'false'); lockScroll(); }
    store.set('arena_popup_seen', '1', true);
  }
  function modalClose() { if (!$modal.hasClass('is-open')) return; $modal.removeClass('is-open').attr('aria-hidden', 'true'); unlockScroll(); }
  $doc.on('click', '[data-enquire]', function (e) { e.preventDefault(); modalOpen($(this).attr('data-enquire')); });
  $modal.on('click', '[data-close]', modalClose);
  $doc.on('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($lb.hasClass('is-open')) lbClose(); else if ($modal.hasClass('is-open')) modalClose(); else menuClose();
  });
  setTimeout(function () {
    if (store.get('lim_lead') === '1' || store.get('arena_popup_seen', true)) return;
    if ($modal.hasClass('is-open') || $lb.hasClass('is-open') || $menu.hasClass('is-open')) return;
    modalOpen('Auto Popup');
  }, 20000);

  stagger('.devstrip__logos'); stagger('.spec__list');
  stagger('#tlTrack'); var tlEl = document.getElementById('tlTrack'); if (tlEl) { if (io) io.observe(tlEl); else tlEl.classList.add('is-in'); }

  /* ---------- DOCK NAV: scroll-spy pill ---------- */
  (function () {
    var dock = document.getElementById('dock'), pill = document.getElementById('dockPill');
    if (!dock) return;
    var links = [].slice.call(dock.querySelectorAll('a'));
    function movePill(a) {
      if (!a) { pill.style.opacity = 0; return; }
      pill.style.opacity = 1;
      pill.style.width = a.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
      links.forEach(function (l) { l.classList.toggle('is-on', l === a); });
    }
    function spy() {
      var y = window.scrollY + window.innerHeight * .35, cur = null;
      links.forEach(function (l) { var sec = document.querySelector(l.getAttribute('href')); if (sec && sec.offsetTop <= y) cur = l; });
      movePill(cur);
      dock.classList.toggle('is-up', window.scrollY > window.innerHeight * .5);
    }
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    spy();
  })();

})(jQuery);

/* Mobile swipe dots for eco point lists */
(function () {
  document.querySelectorAll('.eco__list, .spec__list, #deck').forEach(function (list) {
    var n = list.children.length, dots = document.createElement('div');
    dots.className = 'eco__dots'; dots.setAttribute('aria-hidden', 'true');
    dots.innerHTML = new Array(n + 1).join('<i></i>');
    list.parentNode.insertBefore(dots, list.nextSibling);
    function upd() {
      var w = list.children[0] ? list.children[0].getBoundingClientRect().width + 10 : 1;
      var k = Math.min(n - 1, Math.round(list.scrollLeft / w));
      [].forEach.call(dots.children, function (d, j) { d.classList.toggle('is-on', j === k); });
    }
    list.addEventListener('scroll', upd, { passive: true }); upd();
  });
})();

/* Mobile: move each section's CTA button to the end of its section */
(function () {
  var mq = window.matchMedia('(max-width: 900px)');
  var btns = [].slice.call(document.querySelectorAll('.about__btn, .sec__btn, .eco__btn, .spec__btn'));
  btns.forEach(function (b) {
    var home = document.createComment('cta-home');
    b.parentNode.insertBefore(home, b);
    b._home = home;
    var sec = b.closest('section');
    var wraps = sec.querySelectorAll(':scope > .wrap, :scope > div');
    b._end = wraps[wraps.length - 1] || sec;
  });
  function place() {
    btns.forEach(function (b) {
      if (mq.matches) { b._end.appendChild(b); b.classList.add('m-end'); }
      else { b._home.parentNode.insertBefore(b, b._home.nextSibling); b.classList.remove('m-end'); }
    });
  }
  place();
  (mq.addEventListener ? mq.addEventListener('change', place) : mq.addListener(place));
})();
