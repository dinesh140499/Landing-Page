/* =========================================================================
   THE ARENA, PIMPRI — data + interactions (jQuery + GSAP)
   Sources: project opportunity document, A3 sales brochure, campaign creatives
   ========================================================================= */
(function ($) {
  'use strict';

  /* ---------- SETTINGS — check before going live ---------- */
  var C = {
    phone: '+919126264444',                    // IVR — same as other project sites
    phoneLabel: '+91 91262 64444',
    rera: ''                                   // MahaRERA no. — fill in when issued (shown in footer)
  };
  var IMG = 'assets/images/';

  /* Configurations — add a line to add a typology everywhere (banner chips + price list).
     area = total RERA carpet range in sq. ft. (brochure tower directory) */
  var CONFIGS = [
    { type: '2 BHK', area: '728 – 1,248' },
    { type: '3 BHK', area: '1,232 – 2,463' },
    { type: '4 BHK', area: '1,590 – 3,050' }
  ];

  /* Unit plans (Tower A2, sales brochure) */
  var PLANS = [
    { id: '2bhk-994', bhk: '2', name: '2 BHK', area: '994' },
    { id: '2bhk-1206', bhk: '2', name: '2 BHK', area: '1,206' },
    { id: '3bhk-1232', bhk: '3', name: '3 BHK', area: '1,232' },
    { id: '3bhk-1594', bhk: '3', name: '3 BHK', area: '1,594' },
    { id: '4bhk-1625', bhk: '4', name: '4 BHK', area: '1,625' },
    { id: '4bhk-1944', bhk: '4', name: '4 BHK', area: '1,944' }
  ];

  var SPORTS = [
    { t: 'Play', items: [['open-air-courts', 'Open-air courts'], ['racquet-courts', 'Indoor racquet courts'], ['gym', 'Expansive gym floor'], ['cue-lounge', 'Cue sports lounge'], ['sports-bar', 'Premium sports bar']] },
    { t: 'Recover', items: [['jacuzzi-deck', 'Jacuzzi & wet leisure deck'], ['steam-sauna', 'Steam, sauna & recovery'], ['cafe-lounge', 'Café lounges']] },
    { t: 'Learn & Work', items: [['early-learning', 'Early learning centre'], ['co-working', 'Co-working spaces'], ['cafe-lounge', 'Café lounges']] }
  ];

  var GAL = [
    ['r-revised-view-01', 'The township'], ['r-9', 'Lake edge'], ['r-6', 'Elevated walkway'], ['rooftop-pool', 'Rooftop pool'],
    ['r-8', 'Amphitheatre deck'], ['r-3', 'Water body at dusk'], ['r-4', 'Jogging track'], ['r-11', 'Sculpted pavilion'], ['r-2a', 'Landscaped park']
  ];

  var LOC = [
    { t: 'Connectivity', items: [['Pune Metro Line 1', '2.4'], ['Chinchwad Railway Station', '2.5'], ['Pimpri Railway Station', '3.5'], ['Pune Railway Station', '17.2'], ['Pune International Airport', '20.4']] },
    { t: 'Workplaces', items: [['KWT (Kohinoor World Towers)', '2'], ['Chakan MIDC', '3.4'], ['MIDC Pimpri–Chinchwad', '4.4'], ['Bhosari Industrial Area', '7.8'], ['Hinjewadi IT Park', '9.9']] },
    { t: 'Education', items: [['Podar International School', '3.8'], ['St. Ursula High School', '4'], ['City Pride School', '4.5'], ['SNBP International School', '4.7'], ['D. Y. Patil International University', '5.7']] },
    { t: 'Healthcare', items: [['Aditya Birla Memorial Hospital', '4.1'], ['Lokmanya Hospital', '5'], ['Sterling Multispecialty Hospital', '5'], ['Dr. D.Y. Patil Hospital', '5.9'], ['Ruby Hall Clinic, Hinjewadi', '11.4']] }
  ];

  /* ---------- helpers ---------- */
  var $win = $(window), $doc = $(document), $html = $('html');
  var store = {
    get: function (k, ses) { try { return (ses ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, ses) { try { (ses ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };
  /* ---------- smooth scrolling (Lenis, synced with GSAP ScrollTrigger) ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches, lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    if (window.gsap && window.ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(); }
  }
  var lock = function () { lenis ? lenis.stop() : $html.css('overflow', 'hidden'); }, unlock = function () { lenis ? lenis.start() : $html.css('overflow', ''); };
  var hdOffset = function () { var hd = document.getElementById('hd'); return hd ? hd.offsetHeight : 0; };
  $(document).on('click', 'a[href^="#"]', function (e) {
    var id = this.getAttribute('href'); if (id.length < 2) return;
    var el = document.querySelector(id); if (!el) return;
    e.preventDefault();
    if ($('#menu').hasClass('is-open')) { $('#menu').removeClass('is-open').attr('aria-hidden', 'true'); $('#burger').attr('aria-expanded', 'false'); unlock(); }
    if (lenis) lenis.scrollTo(el, { offset: -hdOffset(), duration: 1.3 }); else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - hdOffset(), behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  });
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  $('[data-tel]').attr('href', 'tel:' + C.phone);
  if (C.rera) $('[data-rera]').text(C.rera);
  $('#year').text(new Date().getFullYear());

  /* ---------- menu ---------- */
  var $menu = $('#menu'), $burger = $('#burger');
  function menuClose() { $menu.removeClass('is-open').attr('aria-hidden', 'true'); $burger.attr('aria-expanded', 'false'); unlock(); }
  $burger.on('click', function () { var o = !$menu.hasClass('is-open'); $menu.toggleClass('is-open', o).attr('aria-hidden', String(!o)); $burger.attr('aria-expanded', String(o)); o ? lock() : unlock(); });
  $menu.on('click', 'a', menuClose);

  /* ---------- hero slider + typology chips ---------- */
  $('#heroTypes').text($.map(CONFIGS, function (c) { return c.type.replace(/\s*BHK/i, ''); }).join(', ').replace(/, ([^,]*)$/, ' & $1') + ' BHK');
  /* ---------- hero slider ---------- */
  var $hs = $('#heroSlides img'), hI = 0;
  $('#heroDots').html($hs.map(function (i) { return '<button type="button" aria-label="Slide ' + (i + 1) + '"' + (i ? '' : ' class="is-on"') + '></button>'; }).get().join(''));
  function heroGo(i) { hI = (i + $hs.length) % $hs.length; var el = $hs[hI]; if (el.dataset.src) { if (el.dataset.srcset) { el.srcset = el.dataset.srcset; el.removeAttribute('data-srcset'); } el.src = el.dataset.src; el.removeAttribute('data-src'); } $hs.removeClass('is-on').eq(hI).addClass('is-on'); $('#heroDots button').removeClass('is-on').eq(hI).addClass('is-on'); }
  $('#heroDots').on('click', 'button', function () { heroGo($(this).index()); });
  setInterval(function () { if (!document.hidden) heroGo(hI + 1); }, 5500);

  /* ---------- film (portrait reel) ---------- */
  var vd = document.getElementById('vdPlayer');
  if (vd && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (vd.preload === 'none') { vd.preload = 'auto'; vd.load(); } var p = vd.play(); if (p && p.catch) p.catch(function () {}); } else vd.pause(); }); }, { threshold: .35 }).observe(vd);
  }

  /* ---------- master plan / floor plate ---------- */

  var hdEl = document.getElementById('hd');
  function hdSolid() { hdEl.classList.toggle('is-solid', window.scrollY > 40 || $('#menu').hasClass('is-open')); }
  $win.on('scroll', hdSolid); hdSolid();
  $('[data-tel-label]').text(C.phoneLabel);

  /* ---------- price list + plans ---------- */
  $('#prList').html($.map(CONFIGS, function (c) { return '<div class="prr"><b>' + esc(c.type) + '</b><span><strong>' + esc(c.area) + '</strong> sq. ft. RERA carpet</span><em>Price on request</em><button type="button" class="btn btn--violet" data-enquire="Price — ' + esc(c.type) + '">Check Price</button></div>'; }).join(''));
  var fpList = PLANS, fpI = 0;
  $('#fpTabs').html('<button type="button" class="tab is-on" data-f="">All</button>' + $.map(CONFIGS, function (c) { var n = c.type.charAt(0); return '<button type="button" class="tab" data-f="' + n + '">' + esc(c.type) + '</button>'; }).join('') + '<button type="button" class="tab" data-site="master-plan">Master plan</button><button type="button" class="tab" data-site="typical-floor">Floor plate</button>');
  function fpRender() {
    var p = fpList[fpI];
    $('#fpView').html('<button type="button" class="fp__img" data-enquire="Floor Plan — ' + esc(p.name) + ' ' + p.area + '"><img src="' + IMG + 'plans/' + p.id + '.webp" width="720" height="450" alt="' + esc(p.name) + ' floor plan preview"><span class="fp__lock">View ' + esc(p.name) + ' plan</span></button>' +
      '<div class="fp__body"><div><h3>' + esc(p.name) + '</h3><p><b>' + p.area + '</b> sq. ft. RERA carpet · Plan ' + (fpI + 1) + ' / ' + fpList.length + '</p></div><div class="fp__nav"><button type="button" data-fp="-1" aria-label="Previous plan">&#8592;</button><button type="button" data-fp="1" aria-label="Next plan">&#8594;</button></div></div>');
  }
  $('#fpTabs').on('click', '[data-site]', function (e) {
    e.stopImmediatePropagation();
    var s = $(this).data('site'), t = $(this).text();
    $('#fpTabs .tab').removeClass('is-on'); $(this).addClass('is-on');
    $('#fpView').html('<button type="button" class="fp__img fp__img--site" data-site-img="' + s + '"><img src="' + IMG + 'plans/' + s + '.webp" alt="' + esc(t) + '"><span class="fp__lock">View full screen</span></button><div class="fp__body"><div><h3>' + esc(t) + '</h3><p>' + (s === 'master-plan' ? '11 towers around a central park &amp; water body, with the sports zone on the western edge.' : 'Typical floor layout · Tower A2') + '</p></div></div>');
  });
  $('#fpView').on('click', '[data-site-img]', function () { var $i = $(this).find('img'); lbOpen([{ src: $i.attr('src'), title: $i.attr('alt') }], 0); });
  $('#fpTabs').on('click', '.tab[data-f]', function () { var f = $(this).data('f') + ''; $('#fpTabs .tab').removeClass('is-on'); $(this).addClass('is-on'); fpList = f ? $.grep(PLANS, function (p) { return p.bhk === f; }) : PLANS; fpI = 0; fpRender(); });
  $('#fpView').on('click', '[data-fp]', function () { fpI = (fpI + +$(this).data('fp') + fpList.length) % fpList.length; fpRender(); });
  fpRender();

  /* ---------- amenities showcase ---------- */
  var AM = [];
  $.each(SPORTS, function (_, s) { $.each(s.items, function (_, it) { if (!$.grep(AM, function (x) { return x[0] === it[0]; }).length) AM.push(it); }); });
  /* pinned horizontal amenities */
  $('#hsTrack').html($.map(AM, function (a, i) { return '<button type="button" class="hs__card' + (i % 3 === 0 ? ' hs__card--w' : '') + '" data-i="' + i + '"><img src="' + IMG + 'amenities/' + a[0] + '-sm.webp" loading="lazy" decoding="async" alt="' + esc(a[1]) + '"><span><i>' + (i < 9 ? '0' : '') + (i + 1) + '</i>' + esc(a[1]) + '</span></button>'; }).join(''));
  $('#hsTrack').on('click', '.hs__card', function () { lbOpen($.map(AM, function (a) { return { src: IMG + 'amenities/' + a[0] + '.webp', title: a[1] + ' · Artist\'s impression' }; }), +$(this).data('i')); });

  /* ---------- sliding tab indicator ---------- */
  function tabInk($wrap) { var $on = $wrap.find('.tab.is-on'); if (!$on.length) return; var $ink = $wrap.children('.tab-ink'); if (!$ink.length) $ink = $('<span class="tab-ink"></span>').appendTo($wrap); $ink.css({ left: $on[0].offsetLeft, top: $on[0].offsetTop, width: $on.outerWidth(), height: $on.outerHeight() }); }
  var tabWraps = '#fpTabs, #lcTabs';
  $(tabWraps).addClass('tabs-ink');
  $(document).on('click', '.tabs-ink .tab', function () { var $w = $(this).closest('.tabs-ink'); setTimeout(function () { tabInk($w); }, 0); });
  $win.on('load resize', function () { $(tabWraps).each(function () { tabInk($(this)); }); });
  setTimeout(function () { $(tabWraps).each(function () { tabInk($(this)); }); }, 300);

  /* ---------- gallery ---------- */
  /* card deck gallery */
  var dkOrder = GAL.map(function (_, i) { return i; }), dkLast = Date.now(), dkBusy = false;
  $('#dkDeck').html($.map(GAL, function (g, i) { return '<button type="button" class="dk__card" data-i="' + i + '"><img src="' + IMG + 'gallery/' + g[0] + '-sm.webp" ' + (i > 2 ? 'loading="lazy" ' : '') + 'decoding="async" alt="' + esc(g[1]) + '"></button>'; }).join(''));
  $('#dkTot').text((GAL.length < 10 ? '0' : '') + GAL.length);
  var tilt = [0, -4, 3.5, -2.5, 2, -1.5, 1, -1, .5];
  function dkLayout() {
    $.each(dkOrder, function (pos, gi) {
      var $c = $('#dkDeck .dk__card[data-i="' + gi + '"]');
      $c.css({ zIndex: GAL.length - pos, transform: 'translate(' + (pos * 10) + 'px,' + (pos * 8) + 'px) rotate(' + (pos ? tilt[pos % tilt.length] : 0) + 'deg) scale(' + (1 - Math.min(pos, 4) * .03) + ')', opacity: pos > 4 ? 0 : 1 }).toggleClass('is-top', pos === 0);
    });
    var top = dkOrder[0]; $('#dkNo').text((top < 9 ? '0' : '') + (top + 1)); $('#dkCap').text(GAL[top][1]);
  }
  function dkStep(dir) {
    if (dkBusy) return; dkBusy = true; dkLast = Date.now();
    if (dir > 0) {
      var $top = $('#dkDeck .dk__card[data-i="' + dkOrder[0] + '"]').addClass('is-out');
      setTimeout(function () { $top.removeClass('is-out'); dkOrder.push(dkOrder.shift()); dkLayout(); dkBusy = false; }, 420);
    } else { dkOrder.unshift(dkOrder.pop()); dkLayout(); setTimeout(function () { dkBusy = false; }, 420); }
  }
  dkLayout();
  $('[data-dk]').on('click', function () { dkStep(+$(this).data('dk')); });
  $('#dkDeck').on('click', '.dk__card', function () { if ($(this).hasClass('is-top')) lbOpen($.map(GAL, function (g) { return { src: IMG + 'gallery/' + g[0] + '.webp', title: g[1] + ' · Artist\'s impression' }; }), +$(this).data('i')); else dkStep(1); });
  var dkX = null; $('#dkDeck').on('touchstart', function (e) { dkX = e.originalEvent.touches[0].clientX; }).on('touchend', function (e) { if (dkX === null) return; var d = e.originalEvent.changedTouches[0].clientX - dkX; if (Math.abs(d) > 40) dkStep(d < 0 ? 1 : -1); dkX = null; });
  setInterval(function () { if (!document.hidden && Date.now() - dkLast > 5000) dkStep(1); }, 400);

  /* ---------- location ---------- */
  $('#lcTabs').html($.map(LOC, function (l, i) { return '<button type="button" class="tab' + (i ? '' : ' is-on') + '" data-i="' + i + '">' + esc(l.t) + '</button>'; }).join(''));
  function lcShow(i) {
    $('#lcTabs .tab').removeClass('is-on').eq(i).addClass('is-on');
    $('#lcList').html('<li class="route__start"><b>The Arena</b><span>Finolex Chowk, Pimpri</span></li>' + $.map(LOC[i].items, function (x, k) { return '<li style="animation-delay:' + (k * .07) + 's"><span>' + esc(x[0]) + '</span><b>' + x[1] + ' <small>km</small></b></li>'; }).join(''));
  }
  $('#lcTabs').on('click', '.tab', function () { lcShow(+$(this).data('i')); });
  lcShow(0);
  $('[data-map]').on('click', function () { lbOpen([{ src: IMG + 'misc/location-map-clean.webp', title: 'Location map · not to scale' }], 0); });

  /* ---------- subtle effects: counters + parallax ---------- */
  function countUp(el) {
    var t = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), pad = +(el.dataset.pad || 0), suf = el.dataset.suffix || '', t0 = null;
    function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1400), v = t * (1 - Math.pow(1 - p, 3));
      var str = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-IN'); if (pad) str = String(str).padStart(pad, '0'); el.textContent = str + suf; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }); }, { threshold: .6 });
    $('[data-count]').each(function () { cio.observe(this); });
  }
  if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger);
    $('.ov__side, .fp, .lc__map--d button').each(function () {
      gsap.fromTo(this, { clipPath: 'inset(12% 12% 12% 12% round 16px)', opacity: .4 }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: this, start: 'top 88%' } });
    });
    gsap.utils.toArray('.secno').forEach(function (el) { gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }); });
    ScrollTrigger.matchMedia({
      '(min-width: 901px)': function () {
        var tr = document.getElementById('hsTrack'), view = tr && tr.parentNode;
        if (!tr) return;
        var dist = function () { return Math.max(0, tr.scrollWidth - view.clientWidth); };
        gsap.to(tr, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '#amenities', start: 'top top', end: function () { return '+=' + dist(); }, pin: '.hs__pin', scrub: .6, invalidateOnRefresh: true, onUpdate: function (s) { var p = document.getElementById('hsProg'); if (p) p.style.width = (s.progress * 100) + '%'; } } });
      }
    });
    $('[data-parallax]').each(function () { gsap.fromTo(this, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: this.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } }); });
  }

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -40px 0px' });
    $('[data-rv]').each(function () { io.observe(this); });
  } else $('[data-rv]').addClass('is-in');

  /* ---------- lightbox ---------- */
  var $lb = $('#lb'), lbList = [], lbI = 0;
  function lbShow(i) { lbI = (i + lbList.length) % lbList.length; var it = lbList[lbI]; $('#lbImg').attr({ src: it.src, alt: it.title }); $('#lbCap').text(it.title); $lb.find('.lb__nav').toggle(lbList.length > 1); }
  function lbOpen(list, i) { lbList = list; $lb.addClass('is-open').attr('aria-hidden', 'false'); lock(); lbShow(i || 0); }
  function lbClose() { $lb.removeClass('is-open').attr('aria-hidden', 'true'); if (!$modal.hasClass('is-open')) unlock(); }
  $lb.on('click', '[data-lb-close]', lbClose).on('click', '[data-lb-prev]', function () { lbShow(lbI - 1); }).on('click', '[data-lb-next]', function () { lbShow(lbI + 1); }).on('click', function (e) { if (e.target === this) lbClose(); });

  /* ---------- lead modal ---------- */
  var $modal = $('#leadModal');
  function mOpen(src) {
    $('#modalTitle').text(/visit/i.test(src) ? 'Book a site visit' : /plan/i.test(src) ? 'Get the floor plan' : /brochure|list/i.test(src) ? 'Get the brochure' : /price/i.test(src) ? 'Get the price sheet' : 'Get pre-launch access');
    $modal.find('.lead-form').attr('data-source', src || 'Popup Form');
    $modal.addClass('is-open').attr('aria-hidden', 'false'); lock(); store.set('lim_popup_seen', '1', true);
    if ($menu.hasClass('is-open')) menuClose();
  }
  function mClose() { $modal.removeClass('is-open').attr('aria-hidden', 'true'); if (!$lb.hasClass('is-open')) unlock(); }
  $doc.on('click', '[data-enquire]', function (e) { e.preventDefault(); mOpen($(this).attr('data-enquire')); });
  $modal.on('click', '[data-close]', mClose);
  $doc.on('keydown', function (e) { if (e.key === 'Escape') { if ($lb.hasClass('is-open')) lbClose(); else if ($modal.hasClass('is-open')) mClose(); else if ($menu.hasClass('is-open')) menuClose(); } });
  setTimeout(function () { if (store.get('lim_lead') !== '1' && !store.get('lim_popup_seen', true) && !$modal.hasClass('is-open') && !$lb.hasClass('is-open') && !$menu.hasClass('is-open')) mOpen('Auto Popup'); }, 20000);

})(jQuery);
