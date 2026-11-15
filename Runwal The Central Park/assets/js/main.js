/* =========================================================================
   RUNWAL THE CENTRAL PARK — interactions (jQuery + Lenis + GSAP)
   ========================================================================= */
(function ($) {
  'use strict';
  var D = window.SITE, C = D.contact;
  var $win = $(window), $doc = $(document), $body = $('body');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DIR = { banner: 'banner', overview: 'overview', residences: 'residences', amenities: 'amenities', gallery: 'gallery', location: 'location', brand: 'brand', icon: 'icons' };
  var img = function (n, s) { return 'assets/images/' + DIR[n.split('-')[0]] + '/' + n + '-' + (s || 'lg') + '.webp'; };
  var store = {
    get: function (k, ses) { try { return (ses ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, ses) { try { (ses ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };
  var isLead = function () { return store.get('tcp_lead') === '1'; };
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGsap) { gsap.registerPlugin(ScrollTrigger); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else { var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  } else if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  var lock = function () { lenis ? lenis.stop() : $('html').css('overflow', 'hidden'); };
  var unlock = function () { lenis ? lenis.start() : $('html').css('overflow', ''); };
  var goTo = function (el, instant) {
    if (!el) return;
    var hd = document.getElementById('hd').offsetHeight;
    var y = el.id === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY - hd + 1;
    if (lenis) { lenis.start(); lenis.scrollTo(y, { immediate: !!instant, force: true, duration: 1.4 }); } else window.scrollTo({ top: y, behavior: instant ? 'auto' : 'smooth' });
    if (instant) window.scrollTo(0, y);
  };

  /* ---------- Contact settings → page ---------- */
  if (!C.whatsapp) { $('[data-wa]').closest('li').hide(); $('[data-wa]').hide(); $body.addClass('no-wa'); } // IVR only until a WhatsApp number is set
  $('[data-wa]').each(function () { if (C.whatsapp) $(this).attr({ href: 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(C.whatsappText), target: '_blank', rel: 'noopener' }); else $(this).attr('href', '#contact'); });
  $('[data-tel]').attr('href', C.phone ? 'tel:' + C.phone : '#contact');
  if (C.phoneLabel) $('[data-tel-label]').text(C.phoneLabel);
  if (C.cpFirm) $('[data-cp-firm]').text(C.cpFirm);
  if (C.cpRera) $('[data-cp-rera]').text(C.cpRera);
  if (!C.leadEmail || !C.cpRera) console.warn('[Runwal TCP] Fill leadEmail and cpRera in assets/js/data.js before going live.');
  $('#year').text(new Date().getFullYear());
  $('#ftMore').on('click', function () { var o = $('#ftDisc').toggleClass('is-open').hasClass('is-open'); $(this).text(o ? 'Read less' : 'Read more').attr('aria-expanded', o); if (hasGsap) ScrollTrigger.refresh(); });

  /* ---------- Header + floating contact ---------- */
  var heroEl = document.getElementById('home');
  function onScroll() {
    var y = window.scrollY;
    var past = y > heroEl.offsetTop + heroEl.offsetHeight - 10; // header scrolls away with the banner, returns as a sticky bar after it
    var max = document.documentElement.scrollHeight - window.innerHeight, pct = max > 0 ? Math.min(100, Math.max(0, Math.round(y / max * 100))) : 0;
    document.documentElement.style.setProperty('--sp', pct); $('#toTopPct').text(pct + '%'); $('#toTop').toggleClass('is-on', y > heroEl.offsetHeight * .8);
    $('#hd').toggleClass('is-fixed', past).toggleClass('is-scrolled', past); $body.toggleClass('hd-compact', past);
  }
  if (lenis) lenis.on('scroll', onScroll); else $win.on('scroll', onScroll);
  onScroll();

  $('#toTop').on('click', function () { goTo(heroEl); });

  /* ---------- Menu (circular reveal) ---------- */
  var $menu = $('#menu'), $burger = $('#burger');
  function menuOpen() { $menu.addClass('is-open').attr('aria-hidden', 'false'); $body.addClass('menu-open'); $burger.attr('aria-expanded', 'true'); lock(); }
  function menuClose() { $menu.removeClass('is-open').attr('aria-hidden', 'true'); $body.removeClass('menu-open'); $burger.attr('aria-expanded', 'false'); unlock(); }
  $burger.on('click', function () { $menu.hasClass('is-open') ? menuClose() : menuOpen(); });
  $menu.on('click', '.menu__links a', function (e) { e.preventDefault(); var el = document.querySelector($(this).attr('href')); menuClose(); goTo(el, true); });
  $menu.on('mouseenter', '.menu__links a', function () {
    var $i = $('#menuImg img'), src = img($(this).data('img'), 'sm'); if ($i.attr('src') === src) return;
    $i.addClass('is-out'); setTimeout(function () { $i.attr('src', src).removeClass('is-out'); }, 280);
  });
  $doc.on('click', 'a[href^="#"]:not([data-wa]):not([data-tel])', function (e) {
    var h = $(this).attr('href'); if (h.length < 2 || $(this).closest('.menu').length) return; var el = document.querySelector(h); if (!el) return; e.preventDefault(); goTo(el);
  });
  var sections = ['home', 'overview', 'residences', 'amenities', 'gallery', 'location'].map(function (id) { return document.getElementById(id); });
  setInterval(function () { var cur = 0; sections.forEach(function (s, i) { if (s.getBoundingClientRect().top < window.innerHeight * .4) cur = i; }); $menu.find('.menu__links a').removeClass('is-current').eq(cur).addClass('is-current'); }, 500);

  /* ---------- Hero slider ---------- */
  var $slides = $('#heroSlides .hero__slide'), hIdx = 0, hTimer;
  $('#heroDots').html($slides.map(function (i) { return '<button class="hero__dot' + (i ? '' : ' is-on') + '" data-i="' + i + '" aria-label="' + $(this).data('label') + '"><span>' + $(this).data('label') + '</span><i></i></button>'; }).get().join(''));
  function hLoad(i) { var im = $slides.eq(i).find('img')[0]; if (im && im.getAttribute('data-src')) { im.srcset = im.getAttribute('data-srcset'); im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); } }
  function hGo(i) {
    i = (i + $slides.length) % $slides.length; if (i === hIdx) return; hLoad(i); hLoad((i + 1) % $slides.length);
    $slides.removeClass('is-on').eq(i).addClass('is-on'); $('#heroDots .hero__dot').removeClass('is-on').eq(i).addClass('is-on');
    $('#heroDisc').text($slides.eq(i).data('disc')); hIdx = i; hAuto();
  }
  function hAuto() { clearTimeout(hTimer); if (!reduce) hTimer = setTimeout(function () { hGo(hIdx + 1); }, 6500); }
  $('#heroDots').on('click', '.hero__dot', function () { hGo(+$(this).data('i')); });
  $win.on('load', function () { hLoad(1); }); hAuto();

  /* ---------- Residences: plan viewer ---------- */
  var rIdx = 0;
  $('#rvList').html($.map(D.residences, function (r, i) {
    var n = r.tab.replace(' BHK', '');
    return '<button class="rx__tab' + (i ? '' : ' is-on') + '" data-i="' + i + '" role="tab"><b>' + n + '</b><span>BHK<small>' + r.area.toLocaleString('en-IN') + ' sq ft</small></span></button>';
  }).join(''));
  function rShow(i, instant) {
    rIdx = i; var r = D.residences[i], cfg = r.tab + ' — ' + r.area + ' sq ft';
    $('#rvList .rx__tab').removeClass('is-on').eq(i).addClass('is-on');
    $('#rvImg').attr({ src: img(r.img, 'sm'), srcset: img(r.img, 'sm') + ' 760w, ' + img(r.img, 'lg') + ' 1400w', sizes: '(max-width: 1100px) 92vw, 50vw', alt: r.tab + ' floor plan, ' + r.area + ' sq ft RERA carpet — Runwal The Central Park' });
    $('#rxTwr').text(r.tower + ' · Residence 0' + (i + 1));
    $('#rxType').text(r.tab);
    $('#rxArea').text(r.area.toLocaleString('en-IN')); $('#rxSqm').text(r.sqm.toFixed(2) + ' sq m');
    $('#rvBands').html(['G – 10', '11 – 20', '21 – 30'].map(function (b, k) { return '<li><span>Floors ' + b + '</span><i></i><b>₹' + r.bands[k] + ' Cr</b></li>'; }).join(''));
    $('#rvUnlock').attr({ 'data-enquire': 'Unlock Plan — ' + r.tab, 'data-config': cfg });
    $('#rvCost').attr({ 'data-enquire': 'Cost Sheet — ' + r.tab, 'data-config': cfg });
    $('#rvView').addClass('is-locked'); /* floor plans always stay blurred */
    if (hasGsap && !reduce && !instant) {
      gsap.fromTo('#rvImg', { clipPath: 'inset(0 0 0 100%)', scale: 1.08 }, { clipPath: 'inset(0 0 0 0%)', scale: 1, duration: .9, ease: 'power3.inOut' });
      gsap.from('#rxType, .rx__area, #rvBands li', { y: 18, opacity: 0, duration: .55, stagger: .06, ease: 'power3.out' });
    }
  }
  $('#rvList').on('click', '.rx__tab', function () { var i = +$(this).data('i'); if (i !== rIdx) rShow(i); });
  rShow(0, true);

  /* ---------- Amenities: lift ride (G -> Club -> 45th-floor Skydeck) ---------- */
  var LIFT = [{ n: 0, label: 'G', name: 'Greens & Arrival', items: [7, 8, 2] }, { n: 1, label: 'C', name: 'The Grand Club', items: [0, 1, 3] }, { n: 45, label: '45', name: 'The Skydeck', items: [4, 5, 6] }];
  var lCur = 0, lK = -1, lRiding = false, $lift = $('#lift'), $view = $('#liftView');
  function liftCarTo(z, instant) {
    var b = $('#liftBtns button[data-z="' + z + '"]')[0]; if (!b) return;
    $('#liftCar').css({ transition: instant ? 'none' : '', transform: 'translateY(' + (b.offsetTop + b.offsetHeight / 2 - 9) + 'px)' });
  }
  function liftShow(k, instant) {
    if (k === lK) return; lK = k; var a = D.amenities[k];
    var $im = $('<img alt="">').attr({ src: img(a.img, 'lg'), alt: a.title + ' at Runwal The Central Park', decoding: 'async' }).appendTo('#liftImgs');
    if (instant || reduce) $im.addClass('is-on').prevAll().remove();
    else { requestAnimationFrame(function () { requestAnimationFrame(function () { $im.addClass('is-on'); }); }); setTimeout(function () { $im.prevAll().remove(); }, 900); }
    $('#liftCap').html('<small>' + a.line + '</small><b>' + a.title + '</b><span>' + a.note + '</span>');
    $('#liftThumbs button').removeClass('is-on').filter('[data-k="' + k + '"]').addClass('is-on');
  }
  function liftFloor(z) {
    var L = LIFT[z];
    $('#liftThumbs').html($.map(L.items, function (k) { var a = D.amenities[k]; return '<button type="button" data-k="' + k + '"><img src="' + img(a.img, 'sm') + '" width="800" height="450" loading="lazy" decoding="async" alt=""><span>' + a.title + '</span></button>'; }).join(''));
    lK = -1; liftShow(L.items[0], true); $('#liftZone').text(L.name);
  }
  function liftRide(z) {
    if (lRiding || z === lCur) return; lRiding = true;
    var from = LIFT[lCur].n, to = LIFT[z].n, up = to > from, t0 = null, dur = reduce ? 0 : 1500;
    $('#liftBtns button').removeClass('is-on').filter('[data-z="' + z + '"]').addClass('is-on');
    $('#liftDir').html(up ? '&#9650;' : '&#9660;'); $lift.addClass('is-riding'); $view.addClass('is-closed');
    liftCarTo(z);
    setTimeout(function () {
      liftFloor(z);
      requestAnimationFrame(function step(t) {
        if (!t0) t0 = t; var p = dur ? Math.min(1, (t - t0) / dur) : 1, e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        var n = Math.round(from + (to - from) * e);
        $('#liftNo').text(p < 1 ? (n === 0 ? 'G' : (n < 10 ? '0' : '') + n) : LIFT[z].label);
        if (p < 1) return requestAnimationFrame(step);
        lCur = z; $lift.removeClass('is-riding').addClass('is-ding');
        setTimeout(function () { $view.removeClass('is-closed'); $lift.removeClass('is-ding'); lRiding = false; }, reduce ? 0 : 350);
      });
    }, reduce ? 0 : 650);
  }
  $('#liftBtns').on('click', 'button', function () { liftRide(+$(this).data('z')); });
  $('#liftThumbs').on('click', 'button', function () { liftShow(+$(this).data('k')); });
  $view.on('click', '#liftImgs img', function () { lbOpen($.map(D.amenities, function (a) { return { src: img(a.img, 'lg'), title: a.title }; }), lK); });
  liftFloor(0); liftCarTo(0, true); $win.on('resize load', function () { liftCarTo(lCur, true); });
  if (!reduce && 'IntersectionObserver' in window) { // doors start closed and open with a "ding" when the lift comes into view
    $view.addClass('is-closed');
    var lio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { lio.disconnect(); $lift.addClass('is-ding'); setTimeout(function () { $view.removeClass('is-closed'); $lift.removeClass('is-ding'); }, 700); } }, { threshold: .45 });
    lio.observe($view[0]);
  }

  /* ---------- Film: ambient loop (lazy, plays only in view) + full film with sound ---------- */
  (function () {
    var bg = document.getElementById('filmBg'), fv = document.getElementById('filmVideo'), $fm = $('#filmModal');
    if (bg && !reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { if (!bg.src) bg.src = bg.getAttribute('data-src'); var p = bg.play(); if (p && p.catch) p.catch(function () {}); } else if (bg.src) bg.pause();
      }, { rootMargin: '200px 0px' }).observe(bg);
    }
    function fOpen() { if (!fv.src) fv.src = fv.getAttribute('data-src'); $fm.addClass('is-open').attr('aria-hidden', 'false'); lock(); if (bg) bg.pause(); fv.currentTime = 0; var p = fv.play(); if (p && p.catch) p.catch(function () {}); window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'film_play' }); }
    function fClose() { fv.pause(); $fm.removeClass('is-open').attr('aria-hidden', 'true'); unlock(); }
    $('#filmPlay').on('click', fOpen);
    $fm.on('click', '[data-film-close]', fClose).on('click', function (e) { if (e.target === this) fClose(); });
    $doc.on('keydown', function (e) { if (e.key === 'Escape' && $fm.hasClass('is-open')) fClose(); });
    $(fv).on('ended', function () { fClose(); mOpen('Film — Watched Till End'); });
  })();

  /* ---------- Gallery: twin marquee ---------- */
  var tallSet = { 'gallery-residence-bathroom': 1, 'gallery-residence-kitchen': 1, 'gallery-residence-reading-corner': 1, 'gallery-residence-lounge': 1 };
  var mqItem = function (g, i) { return '<button class="mq__item' + (tallSet[g.img] ? ' is-tall' : '') + '" data-i="' + i + '"><img src="' + img(g.img, 'sm') + '" width="800" height="600" decoding="async" alt="' + g.title + ' — Runwal The Central Park"><b>' + g.title + '</b><span class="disc">' + (g.disc || 'Representational Image') + '</span></button>'; };
  var row = D.gallery.map(function (g, i) { return mqItem(g, i); }).join('');
  $('#mqA').html(row + row); // two copies = seamless loop; all 9 photos are distinct on screen
  (function () {
    var a = document.getElementById('mqA'), xa = 0, paused = false, speed = .45;
    $('#mq').on('mouseenter', function () { paused = true; }).on('mouseleave', function () { paused = false; });
    function tick() {
      var wa = a.scrollWidth / 2;
      if (!paused && !reduce && wa) { xa -= speed; if (-xa >= wa) xa += wa; a.style.transform = 'translate3d(' + xa.toFixed(1) + 'px,0,0)'; }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();
  $('#mq').on('click', '.mq__item', function () { lbOpen($.map(D.gallery, function (g) { return { src: img(g.img, 'lg'), title: g.title }; }), +$(this).data('i')); });

  /* ---------- Location: category tabs + distance bars ---------- */
  var LOC_ICO = { 'Metro & Rail': 'metro', 'Work Hubs': 'work', 'Schools': 'school', 'Hospitals': 'hospital', 'Shopping & Leisure': 'shopping' };
  $('#locTabs').html($.map(D.location, function (c, i) { return '<button type="button" role="tab" data-i="' + i + '"' + (i ? '' : ' class="is-on"') + '><img src="assets/images/icons/icon-' + (LOC_ICO[c.cat] || 'star') + '.webp" width="48" height="48" alt="">' + c.cat + '</button>'; }).join(''));
  function locShow(i) {
    $('#locTabs button').removeClass('is-on').eq(i).addClass('is-on');
    var $l = $('#locList').removeClass('is-in');
    $l.html($.map(D.location[i].items, function (it) {
      var km = parseFloat(it[1]), num = !isNaN(km), inT = /within/i.test(it[1]);
      var w = num ? Math.max(6, Math.min(100, km / 15 * 100)) : (inT ? 3 : 12);
      var d = num ? '<b>' + km + '</b><small>km</small>' : '<b class="is-word">' + (inT ? 'In' : 'Near') + '</b><small>' + (inT ? 'township' : 'by') + '</small>';
      return '<li><span class="lc__d">' + d + '</span><span class="lc__n">' + it[0] + '<i><s style="--w:' + w + '%"></s></i></span></li>';
    }).join(''));
    requestAnimationFrame(function () { requestAnimationFrame(function () { $l.addClass('is-in'); }); });
    if (hasGsap && !reduce) gsap.from('#locList li', { x: -20, opacity: 0, duration: .5, stagger: .06, ease: 'power3.out' });
  }
  $('#locTabs').on('click', 'button', function () { locShow(+$(this).data('i')); });
  locShow(0);

  /* ---------- Highlights: point list swaps the feature image ---------- */
  $('#hlpList').on('mouseenter focusin click', '.hlp__i', function () {
    var i = +$(this).data('i');
    $(this).addClass('is-on').siblings().removeClass('is-on');
    $('#highlights .hlp__img').removeClass('is-on').eq(i).addClass('is-on');
  });

  /* ---------- Reveal + counters ---------- */
  function count(el) {
    var to = +el.getAttribute('data-count'), t0 = null;
    if (reduce) { el.textContent = to; return; }
    requestAnimationFrame(function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; if (e.target.hasAttribute('data-count')) count(e.target); else e.target.classList.add('is-in'); io.unobserve(e.target); }); }, { threshold: .15 });
    $('[data-rv], [data-count]').each(function () { io.observe(this); });
  } else { $('[data-rv]').addClass('is-in'); $('[data-count]').each(function () { this.textContent = this.getAttribute('data-count'); }); }

  /* ---------- GSAP: hero entrance ---------- */
  if (hasGsap && !reduce) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero__frame', { x: -30, opacity: 0, duration: 1.1 })
      .from('.hero__badge, .hero__brand, .hero h1, .hero__price, .hero__keys li, .hero__cta', { y: 24, opacity: 0, duration: .7, stagger: .06 }, .3)
      .from('.hero__dots', { opacity: 0, x: 20, duration: .8 }, .8);
  }

  /* ---------- Lightbox ---------- */
  var $lb = $('#lb'), lbList = [], lbI = 0;
  function lbShow(i) { lbI = (i + lbList.length) % lbList.length; var it = lbList[lbI]; $('#lbImg').attr({ src: it.src, alt: it.title }); $('#lbCap').text(it.title); $lb.find('.lb__nav').toggle(lbList.length > 1); }
  function lbOpen(list, i) { lbList = list; $lb.addClass('is-open').attr('aria-hidden', 'false'); lock(); lbShow(i || 0); }
  function lbClose() { $lb.removeClass('is-open').attr('aria-hidden', 'true'); if (!$('#leadModal').hasClass('is-open')) unlock(); }
  $doc.on('click', '[data-lightbox]', function () { lbOpen([{ src: img($(this).data('lightbox'), 'lg'), title: $(this).data('title') }], 0); });
  $lb.on('click', '[data-lb-close]', lbClose).on('click', '[data-lb-prev]', function () { lbShow(lbI - 1); }).on('click', '[data-lb-next]', function () { lbShow(lbI + 1); })
     .on('click', function (e) { if (e.target === this) lbClose(); });

  /* ---------- Lead popup ---------- */
  var $modal = $('#leadModal'), $mForm = $modal.find('.lead-form');
  function title(src) { return /leav/i.test(src) ? 'Before you go — get the price sheet' : /visit/i.test(src) ? 'Book a site visit' : /amenit/i.test(src) ? 'Get the 50+ amenities list' : /layout/i.test(src) ? 'Get the master layout' : /brochure|list/i.test(src) ? 'Download the brochure' : /unlock|plan/i.test(src) ? 'Unlock floor plans' : /cost|price/i.test(src) ? 'Get the price sheet' : 'Enquire now'; }
  function mOpen(src, cfg) {
    if ($menu.hasClass('is-open')) menuClose();
    $mForm.attr('data-source', src || 'Popup Form'); $('#modalTitle').text(title(src || ''));
    $('#modalImg').attr('src', img(/visit/i.test(src) ? 'overview-central-greens-view' : /unlock|plan/i.test(src) ? 'gallery-residence-living-room' : /cost|price|leav/i.test(src) ? 'banner-towers-daylight' : 'amenities-skydeck', 'sm'));
    $mForm.find('[name=message]').val(cfg ? 'Interested in ' + cfg : '');
    $modal.addClass('is-open').attr('aria-hidden', 'false'); lock(); store.set('tcp_popup_seen', '1', true);
    if (hasGsap && !reduce) gsap.timeline()
      .fromTo('#leadModal .modal__box', { clipPath: 'inset(0 50% 0 50% round 24px)' }, { clipPath: 'inset(0 0% 0 0% round 24px)', duration: .8, ease: 'power3.inOut' })
      .fromTo('#leadModal .modal__media img', { scale: 1.2 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
      .fromTo('#leadModal .modal__body > *', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .07, ease: 'power3.out' }, .35);
  }
  function mClose() { $modal.removeClass('is-open').attr('aria-hidden', 'true'); if (!$lb.hasClass('is-open')) unlock(); }
  $doc.on('click', '[data-enquire]', function (e) { e.preventDefault(); mOpen($(this).attr('data-enquire'), $(this).attr('data-config')); });
  $modal.on('click', '[data-close]', mClose);
  $doc.on('keydown', function (e) { if (e.key === 'Escape') { if ($lb.hasClass('is-open')) lbClose(); else if ($modal.hasClass('is-open')) mClose(); else if ($menu.hasClass('is-open')) menuClose(); } });
  var canPop = function () { return !isLead() && !store.get('tcp_popup_seen', true) && !$modal.hasClass('is-open') && !$menu.hasClass('is-open') && !$lb.hasClass('is-open'); };
  // Smart popup (once per session, never for existing leads): exit-intent on desktop, or after 55% scroll depth on touch devices
  $doc.on('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0 && window.scrollY > 300 && canPop()) mOpen('Leaving — Exit Intent'); });
  if (window.matchMedia('(hover: none)').matches) {
    var depthPop = function () { var h = document.documentElement.scrollHeight - window.innerHeight; if (h > 0 && window.scrollY / h > .55 && canPop()) { mOpen('Scroll Depth Popup'); $win.off('scroll', depthPop); } };
    $win.on('scroll', depthPop);
  }

  /* ---------- Forms → FormSubmit → thank-you page ---------- */
  var utm = (function () { var o = {}, q = new URLSearchParams(location.search); ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) { var v = q.get(k) || store.get('tcp_' + k, true); if (v) { o[k] = v; store.set('tcp_' + k, v, true); } }); return o; })();
  $doc.on('submit', '.lead-form', function (e) {
    e.preventDefault();
    var $f = $(this), $m = $f.find('.form-msg').text(''), v = function (n) { return $.trim($f.find('[name=' + n + ']').val() || ''); };
    if ($f.find('[name=_honey]').val()) return;
    var chk = window.LeadForm.validate($f);
    if (!chk.ok) { $m.text(chk.consent ? 'Please correct the fields marked above.' : 'Please accept the consent to continue.'); return; }
    if (!C.leadEmail) {
      var wt = 'Hi, I am ' + v('name') + ' (' + v('phone') + ', ' + v('email') + '). Interested in Runwal The Central Park. ' + v('message');
      $m.html(C.whatsapp ? 'Please send your enquiry on <a href="https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(wt) + '" target="_blank" rel="noopener" style="text-decoration:underline">WhatsApp</a>.' : 'Please call us on <a href="tel:' + C.phone + '" style="text-decoration:underline">' + (C.phoneLabel || C.phone) + '</a>.');
      return;
    }
    var src = $f.attr('data-source') || 'Website';
    $f.addClass('is-loading'); $m.text('Sending…');
    $.ajax({ url: 'https://formsubmit.co/ajax/' + C.leadEmail, method: 'POST', dataType: 'json', contentType: 'application/json', timeout: 15000,
      data: JSON.stringify($.extend({ _subject: 'New Lead — Runwal The Central Park — ' + v('name') + ' (' + src + ')', _template: 'table', _captcha: 'false',
        Name: v('name'), Phone: chk.phone, Country: chk.country, Email: v('email'), Message: v('message'), 'Lead Source': src, Page: location.href,
        'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) }, utm)) })
      .done(function () {
        store.set('tcp_lead', '1');
        window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'lead_submit', lead_source: src });
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
        setTimeout(function () { location.href = 'thank-you.html?name=' + encodeURIComponent(v('name').split(' ')[0]); }, 300);
      })
      .fail(function () { $m.html('Could not send right now — please ' + (C.whatsapp ? '<a href="https://wa.me/' + C.whatsapp + '" target="_blank" rel="noopener" style="text-decoration:underline">WhatsApp us</a>' : 'call us on <a href="tel:' + C.phone + '" style="text-decoration:underline">' + C.phoneLabel + '</a>') + '.'); })
      .always(function () { $f.removeClass('is-loading'); });
  });

  $win.on('load', function () { if (hasGsap) ScrollTrigger.refresh(); });
})(jQuery);
