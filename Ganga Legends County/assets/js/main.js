/* =========================================================================
   GANGA LEGENDS COUNTY — interactions (jQuery + Lenis + GSAP ScrollTrigger)
   ========================================================================= */
(function ($) {
  'use strict';
  var D = window.SITE, C = D.contact;
  var $win = $(window), $doc = $(document), $body = $('body');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DIR = { banner: 'banner', amenities: 'amenities' };
  var img = function (n, s) { return 'assets/images/' + DIR[n.split('-')[0]] + '/' + n + (s ? '-' + s : '') + '.webp'; };
  var store = {
    get: function (k, ses) { try { return (ses ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, ses) { try { (ses ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };
  var isLead = function () { return store.get('glc_lead') === '1'; };
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  var lenis = null;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else { var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  var lock = function () { lenis ? lenis.stop() : $('html').css('overflow', 'hidden'); };
  var unlock = function () { lenis ? lenis.start() : $('html').css('overflow', ''); };
  var hdH = function () { return document.getElementById('hd').offsetHeight; };
  var goTo = function (el, instant) {
    if (!el) return;
    var y = el.id === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY - hdH() + 1;
    if (lenis) { lenis.start(); lenis.scrollTo(y, { immediate: !!instant, force: true, duration: 1.4 }); } else window.scrollTo({ top: y, behavior: instant ? 'auto' : 'smooth' });
  };

  /* ---------- Contact settings → page ---------- */
  if (!C.whatsapp) $('[data-wa]').hide();
  $('[data-tel]').attr('href', C.phone ? 'tel:' + C.phone : '#contact');
  if (C.phoneLabel) $('[data-tel-label]').text(C.phoneLabel);
  if (!C.leadEmail) console.warn('[GLC] Set leadEmail in assets/js/data.js before going live.');
  $('#year').text(new Date().getFullYear());
  $('#ftMore').on('click', function () { var o = $('#ftDisc').toggleClass('is-open').hasClass('is-open'); $(this).text(o ? 'Read less' : 'Read more').attr('aria-expanded', o); if (hasGsap) ScrollTrigger.refresh(); });

  /* ---------- Header: in flow above banner, fixed bar after it ---------- */
  var heroEl = document.getElementById('home'), $hd = $('#hd');
  var secIds = ['overview', 'residences', 'wellness', 'amenities', 'location', 'gallery'], navCur = -2, navHover = false;
  function navInd(a) {
    var ind = document.getElementById('hdInd'); $('.hd__nav a').removeClass('is-ind');
    if (!a || !a.offsetWidth) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1; ind.style.width = a.offsetWidth + 'px'; ind.style.transform = 'translateX(' + a.offsetLeft + 'px)'; a.classList.add('is-ind');
  }
  $('#hdNav').on('mouseenter', 'a', function () { navHover = true; navInd(this); })
    .on('mouseleave', function () { navHover = false; navInd(navCur > -1 ? $('.hd__nav a')[navCur] : null); });
  function onScroll() {
    var y = window.scrollY;
    var past = y > heroEl.offsetTop + heroEl.offsetHeight - 10;
    if (!$body.hasClass('menu-open')) { $hd.toggleClass('is-fixed', past); $body.toggleClass('hd-compact', past); }
    var max = document.documentElement.scrollHeight - window.innerHeight, pct = max > 0 ? Math.min(100, Math.max(0, Math.round(y / max * 100))) : 0;
    document.documentElement.style.setProperty('--sp', pct); $('#toTopPct').text(pct + '%'); $('#toTop').toggleClass('is-on', y > heroEl.offsetHeight * .8);
    var cur = -1; secIds.forEach(function (id, i) { var s = document.getElementById(id); if (s && s.getBoundingClientRect().top < window.innerHeight * .4) cur = i; });
    if (cur !== navCur) { navCur = cur; $('.hd__nav a').removeClass('is-current'); if (cur > -1) $('.hd__nav a').eq(cur).addClass('is-current'); if (!navHover) navInd(cur > -1 ? $('.hd__nav a')[cur] : null); }
  }
  if (lenis) lenis.on('scroll', onScroll); else $win.on('scroll', onScroll);
  $win.on('resize', onScroll); onScroll();
  $('#toTop').on('click', function () { goTo(heroEl); });

  /* ---------- Menu ---------- */
  var $menu = $('#menu'), $burger = $('#burger');
  function menuOpen() { $menu.addClass('is-open').attr('aria-hidden', 'false'); $body.addClass('menu-open'); $burger.attr('aria-expanded', 'true'); lock(); }
  function menuClose() { $menu.removeClass('is-open').attr('aria-hidden', 'true'); $body.removeClass('menu-open'); $burger.attr('aria-expanded', 'false'); unlock(); onScroll(); }
  $burger.on('click', function () { $menu.hasClass('is-open') ? menuClose() : menuOpen(); });
  $menu.on('click', '.menu__links a', function (e) { e.preventDefault(); var el = document.querySelector($(this).attr('href')); menuClose(); goTo(el, true); });
  $doc.on('click', 'a[href^="#"]:not([data-tel])', function (e) {
    var h = $(this).attr('href'); if (h.length < 2 || $(this).closest('.menu').length) return; var el = document.querySelector(h); if (!el) return; e.preventDefault(); goTo(el);
  });

  /* ---------- Hero slider ---------- */
  var $slides = $('#heroSlides .hero__slide'), hIdx = 0, hTimer;
  $('#heroDots').html($slides.map(function (i) { return '<button type="button" class="hero__dot' + (i ? '' : ' is-on') + '" data-i="' + i + '"><span>0' + (i + 1) + ' · ' + $(this).data('label') + '</span><i></i></button>'; }).get().join(''));
  function hLoad(i) { var im = $slides.eq(i).find('img')[0]; if (im && im.getAttribute('data-src')) { im.srcset = im.getAttribute('data-srcset'); im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); } }
  function hGo(i) {
    i = (i + $slides.length) % $slides.length; if (i === hIdx) return; hLoad(i); hLoad((i + 1) % $slides.length);
    $slides.removeClass('is-on').eq(i).addClass('is-on');
    var $d = $('#heroDots .hero__dot').removeClass('is-on'); void $d[0].offsetWidth; $d.eq(i).addClass('is-on');
    hIdx = i; hAuto();
  }
  function hAuto() { clearTimeout(hTimer); if (!reduce) hTimer = setTimeout(function () { hGo(hIdx + 1); }, 6500); }
  $('#heroDots').on('click', '.hero__dot', function () { hGo(+$(this).data('i')); });
  $win.on('load', function () { hLoad(1); }); hAuto();

  /* ---------- Residences: tower selector ---------- */
  var FLOORS = 27, tIdx = -1;
  $('#twTabs').html($.map(D.towers, function (t, i) { return '<button type="button" role="tab" data-i="' + i + '">Tower ' + t.name + '<small>' + t.possession + '</small></button>'; }).join(''));
  $('#twBldg').html(new Array(FLOORS + 1).join('<i></i>'));
  function twShow(i) {
    if (i === tIdx) return; tIdx = i; var t = D.towers[i];
    $('#twTabs button').removeClass('is-on').attr('aria-selected', 'false').eq(i).addClass('is-on').attr('aria-selected', 'true');
    $('#twName').text(t.name); $('#twTag').text(t.tag); $('#twPos').text(t.possession);
    var built = Math.round(FLOORS * t.progress);
    $('#twBldg i').each(function (k) { var el = this; setTimeout(function () { el.classList.toggle('is-built', k < built); }, reduce ? 0 : k * 22); });
    $('#twRows').html($.map(t.units, function (u) {
      var cfg = 'Tower ' + t.name + ' — ' + u.type + ', ' + u.carpet + ' sq ft';
      return '<div class="tw__row"><span class="tw__type">' + u.type + '</span><span class="tw__area"><b>' + u.carpet.toLocaleString('en-IN') + '</b><small>sq ft</small></span><span class="tw__price"><b>₹' + u.price + '</b><small>Cr*</small></span><button type="button" class="btn btn--line" data-enquire="Cost Sheet — ' + cfg + '" data-config="' + cfg + '">Cost Sheet</button></div>';
    }).join(''));
    if (hasGsap && !reduce) gsap.from('#twRows .tw__row, .tw__meta > *', { y: 16, opacity: 0, duration: .5, stagger: .05, ease: 'power3.out' });
  }
  $('#twTabs').on('click', 'button', function () { twShow(+$(this).data('i')); });
  twShow(0);

  /* ---------- Wellness: orbit dial ---------- */
  var W = D.wellness, oIdx = -1, oTimer, oT0 = 0, O_DUR = 6000, oPaused = false, oInView = false;
  $('#orbNodes').html($.map(W, function (w, i) {
    var ang = -90 + i * 360 / W.length, rad = ang * Math.PI / 180, x = 50 + 46 * Math.cos(rad), y = 50 + 46 * Math.sin(rad);
    var side = Math.abs(x - 50) < 6 && y < 50 ? 'is-t' : (x < 50 ? 'is-l' : 'is-r');
    return '<button type="button" role="tab" class="orb__node ' + side + '" data-i="' + i + '" style="--x:' + x.toFixed(2) + '%;--y:' + y.toFixed(2) + '%" aria-label="' + w.title + '"><span>0' + (i + 1) + '</span><em>' + w.title + '</em></button>';
  }).join(''));
  $('#orbImgs').html($.map(W, function (w) { return '<img src="' + img(w.img, 'sm') + '" alt="' + w.title + ' — Ganga Legends County" loading="lazy" decoding="async">'; }).join(''));
  function orbShow(i) {
    i = (i + W.length) % W.length; if (i === oIdx) return; oIdx = i; var w = W[i];
    $('#orbNodes .orb__node').removeClass('is-on').attr('aria-selected', 'false').eq(i).addClass('is-on').attr('aria-selected', 'true');
    $('#orbImgs img').removeClass('is-on').eq(i).addClass('is-on');
    $('#orbNum, #orbCoreNum').text('0' + (i + 1)); $('#orbTitle').text(w.title); $('#orbStrap').text(w.strap); $('#orbMeans').text(w.means);
    $('#orbFeats').html($.map(w.feats, function (f) { return '<li>' + f + '</li>'; }).join(''));
    if (hasGsap && !reduce) gsap.fromTo('#orbCard h3, #orbStrap, #orbFeats li, .orb__means', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .045, ease: 'power3.out' });
    oT0 = performance.now();
  }
  (function orbTick(t) { // auto-advance with a progress ring; pauses on hover / out of view
    var p = 0;
    if (!reduce && oInView && !oPaused) { p = Math.min(1, (t - oT0) / O_DUR); if (p >= 1) orbShow(oIdx + 1); }
    else oT0 = t - (parseFloat(document.getElementById('orbProg').getAttribute('data-p')) || 0) * O_DUR;
    var prog = document.getElementById('orbProg'); prog.setAttribute('data-p', p); prog.style.strokeDashoffset = 100 - p * 100;
    requestAnimationFrame(orbTick);
  })(0);
  $('#orbNodes').on('click', '.orb__node', function () { orbShow(+$(this).data('i')); });
  $('#orbPrev').on('click', function () { orbShow(oIdx - 1); });
  $('#orbNext').on('click', function () { orbShow(oIdx + 1); });
  $('.orb').on('mouseenter', function () { oPaused = true; }).on('mouseleave', function () { oPaused = false; oT0 = performance.now(); });
  orbShow(0);

  /* ---------- Amenities: hover showcase ---------- */
  var A = D.amenities, sIdx = -1;
  $('#showList').html($.map(A, function (a, i) { return '<li><button type="button" data-i="' + i + '"><i>0' + (i + 1) + '</i><span><b>' + a.title + '</b><small>' + a.note + '</small></span><em>&#8594;</em></button></li>'; }).join('') + '<li class="show__more"><button type="button" data-enquire="Amenities — Full List Brochure"><i>07</i><span><b>Full list in the brochure</b><small>Request it — we&#8217;ll send it right away</small></span><em>&#8594;</em></button></li>');
  function showGo(i, auto) {
    i = (i + A.length) % A.length; if (i === sIdx) return; sIdx = i; var a = A[i];
    var $old = $('#showImgs img.is-on');
    var $im = $('<img alt="" decoding="async">').attr({ src: img(a.img, 'lg'), srcset: img(a.img, 'sm') + ' 800w, ' + img(a.img, 'lg') + ' 1600w', sizes: '(max-width: 1000px) 92vw, 60vw', alt: a.title + ' at Ganga Legends County' }).appendTo('#showImgs');
    if (reduce || !$old.length) $im.addClass('is-on'); else requestAnimationFrame(function () { requestAnimationFrame(function () { $im.addClass('is-on'); }); });
    setTimeout(function () { $old.remove(); }, 1100);
    $('#showNo').text('0' + (i + 1)); $('#showTitle').text(a.title);
    var $b = $('#showList button').removeClass('is-on'); void $b[0].offsetWidth; $b.eq(i).addClass('is-on');
    sLast = Date.now();
  }
  var sInView = false, sLast = 0, sHover = false;
  if (!reduce) setInterval(function () { if (sInView && !sHover && Date.now() - sLast > 5000) showGo(sIdx + 1); }, 400);
  $('.show').on('mouseenter', function () { sHover = true; }).on('mouseleave', function () { sHover = false; sLast = Date.now(); });
  $('#showList').on('click mouseenter', 'button[data-i]', function (e) { if (e.type === 'mouseenter' && window.matchMedia('(hover: none)').matches) return; showGo(+$(this).data('i')); });
  $('#showZoom, #showImgs').on('click', function () { lbOpen($.map(A, function (a) { return { src: img(a.img, 'lg'), title: a.title }; }), sIdx); });
  showGo(0);

  /* ---------- Location: live radar ---------- */
  var LC = D.location, COL = ['#B4703F', '#2C3D29', '#6F7D4E', '#D29B3C'], lIdx = 0, lTimer, lHot = 0;
  var toMin = function (v) { var n = parseFloat(v); return /km/i.test(v) ? n * 2.5 : n; }; // km → rough minutes, for plotting only
  $('#locTabs').html($.map(LC, function (c, i) { return '<button type="button" role="tab" data-i="' + i + '" style="--c:' + COL[i] + '"' + (i ? '' : ' class="is-on"') + '><i></i>' + c.cat + '</button>'; }).join(''));
  $('#radarPts').html($.map(LC, function (c, ci) {
    return $.map(c.items, function (it, k) {
      var m = toMin(it[1]), far = m > 15, r = 8 + Math.min(m, 15) / 15 * 38;
      var ang = (ci * 90 - 80 + (k + .5) * (70 / c.items.length)) * Math.PI / 180, x = 50 + r * Math.cos(ang), y = 50 + r * Math.sin(ang);
      return '<span class="radar__pt' + (x < 50 ? ' is-left' : '') + (far ? ' is-far' : '') + '" data-c="' + ci + '" data-k="' + k + '" style="--x:' + x.toFixed(2) + '%;--y:' + y.toFixed(2) + '%;--c:' + COL[ci] + ';--d:' + ((ci * 4 + k) * 70) + 'ms"><i></i><b>' + it[0] + ' · ' + it[1] + '</b></span>';
    }).join('');
  }).join(''));
  function locHot(k) {
    lHot = k; $('#radarPts .radar__pt').removeClass('is-hot').filter('[data-c="' + lIdx + '"][data-k="' + k + '"]').addClass('is-hot');
    $('#locList li').removeClass('is-hot').eq(k).addClass('is-hot');
  }
  function locShow(i) {
    lIdx = i; var c = LC[i];
    $('#locTabs button').removeClass('is-on').eq(i).addClass('is-on');
    $('#locList').css('--c', COL[i]).html($.map(c.items, function (it, k) {
      var m = /^([\d.]+)\s*(.*)$/.exec(it[1]);
      return '<li data-k="' + k + '"><span>' + it[0] + '</span><b>' + (m ? m[1] + '<small>' + m[2] + '</small>' : it[1]) + '</b></li>';
    }).join(''));
    $('#radarPts .radar__pt').each(function () { this.style.opacity = +this.getAttribute('data-c') === i ? '' : '.22'; });
    locHot(0);
    if (hasGsap && !reduce) gsap.from('#locList li', { x: -16, opacity: 0, duration: .45, stagger: .05, ease: 'power3.out' });
    clearInterval(lTimer); if (!reduce) lTimer = setInterval(function () { if (!lPaused) locHot((lHot + 1) % LC[lIdx].items.length); }, 2200);
  }
  var lPaused = false;
  $('#locTabs').on('click', 'button', function () { locShow(+$(this).data('i')); });
  $('#locList').on('mouseenter', 'li', function () { lPaused = true; locHot(+$(this).data('k')); }).on('mouseleave', function () { lPaused = false; });
  locShow(0);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) {
      oInView = e.isIntersecting; if (oInView) oT0 = performance.now();
    }); }, { threshold: .35 }).observe(document.getElementById('orbDial'));
    var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (e.target.id === 'showStage') { sInView = e.isIntersecting; if (sInView) sLast = Date.now(); }
      if (e.target.id === 'radar' && e.isIntersecting) e.target.classList.add('is-live');
    }); }, { threshold: .3 });
    io2.observe(document.getElementById('showStage')); io2.observe(document.getElementById('radar'));
  } else { oInView = sInView = true; $('#radar').addClass('is-live'); }

  /* ---------- Reveal + counters ---------- */
  function count(el) {
    var to = +el.getAttribute('data-count'), t0 = null;
    if (reduce) { el.textContent = to.toLocaleString('en-IN'); return; }
    requestAnimationFrame(function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN'); if (k < 1) requestAnimationFrame(step); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; if (e.target.hasAttribute('data-count')) count(e.target); else e.target.classList.add('is-in'); io.unobserve(e.target); }); }, { threshold: .12 });
    $('[data-rv], [data-count]').each(function () { io.observe(this); });
  } else { $('[data-rv]').addClass('is-in'); $('[data-count]').each(function () { this.textContent = this.getAttribute('data-count'); }); }

  /* ---------- GSAP: hero entrance + gentle parallax ---------- */
  if (hasGsap && !reduce) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero__stage', { clipPath: 'inset(8% 8% 8% 8% round 22px)', duration: 1.3, ease: 'power3.inOut' })
      .from('.hero__name > *, .hero__price, .hero__keys li', { y: 22, opacity: 0, duration: .7, stagger: .06 }, .5)
      .from('.hero__bar', { opacity: 0, y: 10, duration: .6 }, .9);
    gsap.to('.bp__pic img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.bp__pic', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.layers li', { x: 30, opacity: 0, stagger: .12, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.layers', start: 'top 80%' } });
    gsap.from('#orbNodes .orb__node > span', { scale: 0, duration: .6, stagger: .07, ease: 'back.out(2)', scrollTrigger: { trigger: '#orbDial', start: 'top 78%' } });
    gsap.from('#showList li', { x: 30, opacity: 0, duration: .6, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '#showList', start: 'top 82%' } });
  }

  /* ---------- Lightbox ---------- */
  var $lb = $('#lb'), lbList = [], lbI = 0;
  function lbShow(i) { lbI = (i + lbList.length) % lbList.length; var it = lbList[lbI]; $('#lbImg').attr({ src: it.src, alt: it.title }); $('#lbCap').text(it.title); $lb.find('.lb__nav').toggle(lbList.length > 1); }
  function lbOpen(list, i) { lbList = list; $lb.addClass('is-open').attr('aria-hidden', 'false'); lock(); lbShow(i || 0); }
  var G = []; for (var gi = 1; gi <= 17; gi++) G.push('assets/images/gallery/gallery-' + (gi < 10 ? '0' : '') + gi);
  var gOn = 0, gStart = 0, GW = 6, gMob = window.matchMedia('(max-width: 1000px)');
  $('#glGrid').html($.map(G, function (g, i) { return '<button type="button" class="gl__item" data-g="' + i + '"><img src="' + g + '-sm.webp" width="800" height="600" loading="lazy" decoding="async" alt="Ganga Legends County — image ' + (i + 1) + '"><span class="gl__no">' + (i < 9 ? '0' : '') + (i + 1) + '</span><span class="gl__zoom" aria-hidden="true">&#8599;</span></button>'; }).join(''));
  var $gi = $('#glGrid .gl__item');
  function glSet(i) {
    gOn = (i + G.length) % G.length;
    if (gOn < gStart || gOn >= gStart + GW) gStart = Math.min(Math.max(0, gOn - (gOn < gStart ? 0 : GW - 1)), G.length - GW);
    $gi.removeClass('is-on is-in').slice(gStart, gStart + GW).addClass('is-in'); $gi.eq(gOn).addClass('is-on');
    $('#glNo').text((gOn < 9 ? '0' : '') + (gOn + 1)); $('#glBar').css('width', ((gOn + 1) / G.length * 100) + '%');
  }
  glSet(0);
  $('[data-gl]').on('click', function () { var d = +$(this).data('gl'); if (gMob.matches) { var el = $('#glGrid')[0]; el.scrollBy({ left: d * el.clientWidth * .8, behavior: 'smooth' }); } glSet(gOn + d); });
  $('#glGrid').on('mouseenter', '.gl__item', function () { if (!gMob.matches) glSet(+$(this).data('g')); });
  $('#glGrid').on('click', '.gl__item', function () { lbOpen($.map(G, function (g, i) { return { src: g + '-lg.webp', title: 'Ganga Legends County · ' + (i + 1) + ' / ' + G.length }; }), +$(this).data('g')); });
  function lbClose() { $lb.removeClass('is-open').attr('aria-hidden', 'true'); if (!$('#leadModal').hasClass('is-open')) unlock(); }
  $lb.on('click', '[data-lb-close]', lbClose).on('click', '[data-lb-prev]', function () { lbShow(lbI - 1); }).on('click', '[data-lb-next]', function () { lbShow(lbI + 1); })
     .on('click', function (e) { if (e.target === this) lbClose(); });

  /* ---------- Lead popup ---------- */
  var $modal = $('#leadModal'), $mForm = $modal.find('.lead-form');
  function title(src) { return /leav/i.test(src) ? 'Before you go — get the price sheet' : /visit/i.test(src) ? 'Book a site visit' : /cost|price/i.test(src) ? 'Get the price sheet' : 'Enquire now'; }
  function mOpen(src, cfg) {
    if ($menu.hasClass('is-open')) menuClose();
    $mForm.attr('data-source', src || 'Popup Form'); $('#modalTitle').text(title(src || ''));
    $('#modalImg').attr('src', img(/visit/i.test(src) ? 'amenities-resort-pool' : /cost/i.test(src) ? 'banner-tower-facade' : 'banner-tower-sunset', 'sm'));
    $mForm.find('[name=message]').val(cfg ? 'Interested in ' + cfg : '');
    $modal.addClass('is-open').attr('aria-hidden', 'false'); lock(); store.set('glc_popup_seen', '1', true);
    if (hasGsap && !reduce) gsap.timeline()
      .fromTo('#leadModal .modal__box', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' })
      .fromTo('#leadModal .modal__media > img', { scale: 1.2 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
      .fromTo('#leadModal .modal__body > *', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .07, ease: 'power3.out' }, .25);
  }
  function mClose() { $modal.removeClass('is-open').attr('aria-hidden', 'true'); if (!$lb.hasClass('is-open')) unlock(); }
  $doc.on('click', '[data-enquire]', function (e) { e.preventDefault(); mOpen($(this).attr('data-enquire'), $(this).attr('data-config')); });
  $modal.on('click', '[data-close]', mClose);
  $doc.on('keydown', function (e) { if (e.key === 'Escape') { if ($lb.hasClass('is-open')) lbClose(); else if ($modal.hasClass('is-open')) mClose(); else if ($menu.hasClass('is-open')) menuClose(); } });
  var canPop = function () { return !isLead() && !store.get('glc_popup_seen', true) && !$modal.hasClass('is-open') && !$menu.hasClass('is-open') && !$lb.hasClass('is-open'); };
  // Once per session, never for existing leads: exit-intent on desktop, 55% scroll depth on touch
  $doc.on('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0 && window.scrollY > 300 && canPop()) mOpen('Leaving — Exit Intent'); });
  if (window.matchMedia('(hover: none)').matches) {
    var depthPop = function () { var h = document.documentElement.scrollHeight - window.innerHeight; if (h > 0 && window.scrollY / h > .55 && canPop()) { mOpen('Scroll Depth Popup'); $win.off('scroll', depthPop); } };
    $win.on('scroll', depthPop);
  }

  /* ---------- Forms → FormSubmit → thank-you page ---------- */
  var utm = (function () { var o = {}, q = new URLSearchParams(location.search); ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) { var v = q.get(k) || store.get('glc_' + k, true); if (v) { o[k] = v; store.set('glc_' + k, v, true); } }); return o; })();
  $doc.on('submit', '.lead-form', function (e) {
    e.preventDefault();
    var $f = $(this), $m = $f.find('.form-msg').text(''), v = function (n) { return $.trim($f.find('[name=' + n + ']').val() || ''); };
    if ($f.find('[name=_honey]').val()) return;
    var chk = window.LeadForm.validate($f);
    if (!chk.ok) { $m.text(chk.consent ? 'Please correct the fields marked above.' : 'Please accept the consent to continue.'); return; }
    if (!C.leadEmail) { $m.html('Please call us on <a href="tel:' + C.phone + '" style="text-decoration:underline">' + C.phoneLabel + '</a>.'); return; }
    var src = $f.attr('data-source') || 'Website';
    $f.addClass('is-loading'); $m.text('Sending…');
    $.ajax({ url: 'https://formsubmit.co/ajax/' + C.leadEmail, method: 'POST', dataType: 'json', contentType: 'application/json', timeout: 15000,
      data: JSON.stringify($.extend({ _subject: 'New Lead — Ganga Legends County TLB — ' + v('name') + ' (' + src + ')', _template: 'table', _captcha: 'false',
        Name: v('name'), Phone: chk.phone, Country: chk.country, Email: v('email'), Message: v('message'), 'Lead Source': src, Page: location.href,
        'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) }, utm)) })
      .done(function () {
        store.set('glc_lead', '1');
        window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'lead_submit', lead_source: src });
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
        setTimeout(function () { location.href = 'thank-you.html?name=' + encodeURIComponent(v('name').split(' ')[0]); }, 300);
      })
      .fail(function () { $m.html('Could not send right now — please call us on <a href="tel:' + C.phone + '" style="text-decoration:underline">' + C.phoneLabel + '</a>.'); })
      .always(function () { $f.removeClass('is-loading'); });
  });

  $win.on('load', function () { if (hasGsap) ScrollTrigger.refresh(); });
})(jQuery);
