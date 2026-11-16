/* =========================================================================
   ENVOGUE 2.0 — Interactions (jQuery + Lenis smooth scroll)
   ========================================================================= */
(function ($) {
  'use strict';

  var D = window.ENVOGUE;
  var C = D.contact;
  var $win = $(window), $doc = $(document), $body = $('body'), $html = $('html');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = function () { return window.innerWidth <= 900; };
  var vh = window.innerHeight;
  var IMG_DIR = { banner: 'banner', overview: 'overview', residences: 'residences', amenities: 'amenities', gallery: 'gallery', location: 'location', brand: 'brand', pattern: 'patterns', icon: 'icons' };
  var img = function (name, size) { return 'assets/images/' + (IMG_DIR[name.split('-')[0]] || '') + '/' + name + '-' + (size || 'lg') + '.webp'; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- Safe storage (works in private mode too) ---------- */
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) { /* ignore */ } }
  };
  var isLead = function () { return store.get('envogue_lead') === '1'; };

  /* =====================================================================
     SMOOTH SCROLL (Lenis)
     ===================================================================== */
  var lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.25, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap && !lenis) gsap.registerPlugin(ScrollTrigger);
  var lockScroll = function () { if (lenis) lenis.stop(); else $html.css('overflow', 'hidden'); };
  var unlockScroll = function () { if (lenis) lenis.start(); else $html.css('overflow', ''); };
  var scrollToTarget = function (target, immediate) {
    var $t = $(target); if (!$t.length) return;
    if (lenis) { lenis.start(); lenis.scrollTo($t[0], { offset: 0, immediate: !!immediate, duration: 1.6 }); }
    else { window.scrollTo({ top: $t.offset().top, behavior: immediate ? 'auto' : 'smooth' }); }
  };

  /* =====================================================================
     RENDER DYNAMIC SECTIONS
     ===================================================================== */
  var lockSvg = '<img class="ico" src="assets/images/icons/icon-lock.webp" width="48" height="48" alt="" loading="lazy" decoding="async">';
  var configLabel = function (r) { return r.tab + ' — ' + r.area + ' sq.ft'; };

  // --- Residences: compact GSAP price list with cursor-following plan preview
  function renderPlist() {
    var lead = isLead();
    $('#plistRows').html($.map(D.residences, function (r, i) {
      var cfg = configLabel(r);
      var planBtn = lead
        ? '<button class="prow__plan" data-lightbox="' + r.img + '" data-title="' + r.name + ' — ' + r.area + ' sq.ft">View Plan</button>'
        : '<button class="prow__plan" data-enquire="Unlock Plan — ' + r.tab + '" data-config="' + cfg + '">View Plan</button>';
      return '<div class="prow" data-i="' + i + '">' +
        '<span class="prow__no">0' + (i + 1) + '</span>' +
        '<span class="prow__type">' + r.tab + '</span>' +
        '<span class="prow__area">' + r.area.toLocaleString('en-IN') + ' <small>sq.ft</small></span>' +
        '<span class="prow__wing">' + r.wing + '</span>' +
        '<span class="prow__price">' + r.price + '</span>' +
        '<span class="prow__act">' + planBtn + '<button class="prow__cost" data-enquire="Cost Sheet — ' + r.tab + '" data-config="' + cfg + '">Cost Sheet <i aria-hidden="true">→</i></button></span>' +
      '</div>';
    }).join(''));
    $('#plistFloat').toggleClass('is-locked', !lead);
  }
  renderPlist();

  // --- Amenities: 3D coverflow cards (main amenities only)
  (function renderAmenities() {
    $('#cflow').html($.map(D.amenities, function (a, i) {
      return '<button class="cfc" data-i="' + i + '" aria-label="' + a.title + '">' +
        '<img src="' + img(a.img, 'sm') + '" srcset="' + img(a.img, 'sm') + ' 800w, ' + img(a.img, 'lg') + ' 1600w" sizes="(max-width: 900px) 80vw, 46vw" width="1600" height="800" loading="lazy" decoding="async" alt="' + a.title + ' at Envogue 2.0, Akurdi">' +
        '<span class="cfc__txt"><small>' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</small><b>' + a.title + '</b></span></button>';
    }).join(''));
    $('#cfTot').text((D.amenities.length < 10 ? '0' : '') + D.amenities.length);
  })();

  // --- Location: category cards with icons
  (function renderLocation() {
    var ico = {
      'Metro & Rail': 'icon-metro', 'Schools': 'icon-school', 'Hospitals': 'icon-hospital',
      'Shopping & Leisure': 'icon-shopping', 'Work Hubs': 'icon-work'
    };
    $('#locTabs').html($.map(D.location, function (c, i) {
      return '<button class="' + (i === 0 ? 'is-on' : '') + '" data-i="' + i + '"><img class="ico" src="assets/images/icons/' + (ico[c.cat] || 'icon-metro') + '.webp" width="48" height="48" alt="" decoding="async">' + c.cat.replace(' & Leisure', '') + '</button>';
    }).join(''));
    showLoc(0, true);
  })();
  function showLoc(i, instant) {
    var html = $.map(D.location[i].items, function (x) { return '<li><span>' + x[0] + '</span><b>' + x[1] + '</b></li>'; }).join('');
    $('#locRows').html(html);
    if (!instant && window.gsap && !reduceMotion) gsap.from('#locRows li', { x: -24, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
  }
  $('#locTabs').on('click', 'button', function () {
    if ($(this).hasClass('is-on')) return;
    $(this).addClass('is-on').siblings().removeClass('is-on');
    showLoc(+$(this).data('i'));
  });

  /* =====================================================================
     TABS (shared sliding indicator)
     ===================================================================== */
  function moveInd($tabs) {
    var $a = $tabs.find('.is-active'); if (!$a.length) return;
    $tabs.find('.tabs__ind').css({ width: $a.outerWidth(), transform: 'translateX(' + $a[0].offsetLeft + 'px)' });
  }
  /* =====================================================================
     GALLERY — film + sample-flat photos in one stage
     ===================================================================== */
  var gxItems = $.grep(D.gallery, function (g) { return g.cat === 'interiors'; });
  var gxIdx = -1, gxFilmOn = false, gxTimer = null;
  var ytUrl = function (extra) { return 'https://www.youtube-nocookie.com/embed/' + C.youtubeId + '?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3' + extra; };
  $('#gxThumbs').html('<button class="gx__thumb gx__thumb--film is-on" data-i="-1"><img src="' + img('amenities-grand-arrival-lobby', 'sm') + '" width="800" height="400" loading="lazy" decoding="async" alt=""><span>▶ Film</span></button>' +
    $.map(gxItems, function (g, i) {
      return '<button class="gx__thumb" data-i="' + i + '"><img src="' + img(g.img, 'sm') + '" width="800" height="441" loading="lazy" decoding="async" alt="' + g.title + '"></button>';
    }).join(''));
  $('#gxTot').text((gxItems.length < 10 ? '0' : '') + gxItems.length);
  function gxCenterThumb() {
    var strip = document.getElementById('gxThumbs'), on = strip && strip.querySelector('.is-on');
    if (!on) return;
    strip.scrollTo({ left: on.offsetLeft - strip.clientWidth / 2 + on.clientWidth / 2, behavior: 'smooth' });
  }
  function gxFilm(withSound) {
    var src = withSound ? ytUrl('&autoplay=1&controls=1') : ytUrl('&autoplay=1&mute=1&loop=1&playlist=' + C.youtubeId + '&controls=0&disablekb=1&fs=0');
    $('#gxMedia').html('<img class="gx__poster" src="' + img('amenities-grand-arrival-lobby', 'lg') + '" alt=""><iframe class="gx__frame' + (withSound ? ' gx__frame--full' : '') + '" src="' + src + '" title="Envogue 2.0 film" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>');
    $('#gxStage').toggleClass('is-sound', !!withSound).addClass('is-film');
    $('#gxKicker').text(withSound ? 'Playing with sound' : 'Now playing'); $('#gxTitle').text('The Envogue 2.0 Film');
    $('#gxNum').text('00'); gxIdx = -1; gxFilmOn = true;
    $('#gxThumbs .gx__thumb').removeClass('is-on').first().addClass('is-on'); gxCenterThumb();
  }
  function gxShow(i) {
    i = (i + gxItems.length) % gxItems.length; gxIdx = i;
    var g = gxItems[i];
    var $img = $('<img class="gx__photo" alt="">').attr({ src: img(g.img, 'lg'), alt: g.title });
    $('#gxStage').removeClass('is-film is-sound');
    $('#gxMedia').append($img);
    if (hasGsap && !reduceMotion) {
      gsap.fromTo($img[0], { clipPath: 'inset(0 0 0 100%)', scale: 1.15 }, { clipPath: 'inset(0 0 0 0%)', scale: 1, duration: 1.1, ease: 'power3.inOut',
        onComplete: function () { $img.prevAll().remove(); } });
    } else $img.prevAll().remove();
    $('#gxKicker').text('Sample Flat'); $('#gxTitle').text(g.title);
    $('#gxNum').text((i + 1 < 10 ? '0' : '') + (i + 1));
    $('#gxThumbs .gx__thumb').removeClass('is-on').eq(i + 1).addClass('is-on'); gxCenterThumb();
    gxFilmOn = false;
  }
  $('#gxThumbs').on('click', '.gx__thumb', function () { var i = +$(this).data('i'); if (i < 0) gxFilm(false); else gxShow(i); });
  $('#gxNext').on('click', function () { gxShow(gxIdx + 1); });
  $('#gxPrev').on('click', function () { gxShow(gxIdx - 1); });
  // Full film is lead-gated: visitors who haven't enquired get the popup form instead
  $('#gxSound').on('click', function () { if (isLead()) gxFilm(true); else openModal('Gallery — Play Film'); });
  $('#gxMedia').on('click', function (e) { if ($(e.target).is('.gx__photo') || !$('#gxStage').hasClass('is-film') || $('#gxStage').hasClass('is-sound')) return; if (isLead()) gxFilm(true); else openModal('Gallery — Play Film'); });
  $('#gxMedia').on('click', '.gx__photo', function () {
    lbOpen($.map(gxItems, function (g) { return { src: img(g.img, 'lg'), title: g.title }; }), gxIdx);
  });
  // start the muted film only when the gallery is near (keeps first load fast)
  if ('IntersectionObserver' in window && !reduceMotion) {
    var gxIO = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { gxFilm(false); gxIO.disconnect(); } }, { rootMargin: '300px 0px' });
    gxIO.observe(document.getElementById('gx'));
  } else gxShow(0);

  /* =====================================================================
     HEADER + PAPER MENU
     ===================================================================== */
  var $header = $('#header'), $menu = $('#menu'), $burger = $('#burger'), menuTimer;
  function openMenu() {
    clearTimeout(menuTimer);
    $menu.removeClass('is-closing').addClass('is-open').attr('aria-hidden', 'false');
    $body.addClass('menu-open'); $burger.attr({ 'aria-expanded': 'true', 'aria-label': 'Close menu' });
    lockScroll();
  }
  function closeMenu() {
    if (!$menu.hasClass('is-open')) return;
    $menu.removeClass('is-open').addClass('is-closing').attr('aria-hidden', 'true');
    $body.removeClass('menu-open'); $burger.attr({ 'aria-expanded': 'false', 'aria-label': 'Open menu' });
    unlockScroll();
    menuTimer = setTimeout(function () { $menu.removeClass('is-closing'); }, 1150);
  }
  $burger.on('click', function () { $menu.hasClass('is-open') ? closeMenu() : openMenu(); });

  // Menu links: jump behind the paper, then peel the paper away
  $menu.on('click', '.menu__links a', function (e) {
    e.preventDefault();
    var el = document.querySelector($(this).attr('href')); if (!el) return;
    closeMenu();
    var y = el.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
    if (lenis) { lenis.start(); lenis.scrollTo(y, { immediate: true, force: true }); }
    window.scrollTo(0, y);
    requestAnimationFrame(function () { if (Math.abs((window.scrollY || 0) - y) > 4) window.scrollTo(0, y); });
  });
  // Hover preview image swap
  var $prev = $menu.find('.menu__preview'), swapT;
  $menu.on('mouseenter', '.menu__links a', function () {
    var src = img($(this).data('img'), 'sm'), $im = $prev.find('img');
    if ($im.attr('src') === src) return;
    clearTimeout(swapT); $prev.addClass('is-swapping');
    swapT = setTimeout(function () { $im.attr('src', src); $prev.removeClass('is-swapping'); }, 250);
  });

  // In-page anchor links (logo, scroll cue, etc.)
  $doc.on('click', 'a[href^="#"]:not(.menu__links a)', function (e) {
    var h = $(this).attr('href'); if (h.length < 2 || !$(h).length) return;
    e.preventDefault(); scrollToTarget(h);
  });

  /* =====================================================================
     SCROLL-DRIVEN EFFECTS
     ===================================================================== */
  var statements = $('.statement').get();
  var parallax = $('[data-parallax]').map(function () {
    return { el: this, f: parseFloat($(this).data('parallax')) || 0.1, mask: !!$(this).closest('[data-reveal="mask"]').length };
  }).get();
  var sections = $.map(['home', 'overview', 'residences', 'amenities', 'gallery', 'location'], function (id) { return document.getElementById(id); });
  var $menuLinks = $menu.find('.menu__links a');
  var lastY = 0;

  // Residences stacked cards
  // Manifesto words (each word lights up as you scroll)

  function layoutDynamic() {
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    // header state
    $header.toggleClass('is-scrolled', y > 60);
    $body.toggleClass('show-float', y > vh * 0.55);
    lastY = y;

    if (!reduceMotion) {
      // statement panels: rounded inset image grows to full-bleed as it arrives
      for (var si = 0; si < statements.length; si++) {
        var sr = statements[si].getBoundingClientRect();
        if (sr.top > vh || sr.bottom < 0) continue;
        statements[si].style.setProperty('--q', clamp(sr.top / vh, 0, 1).toFixed(4));
      }
    }

    // generic parallax
    if (!reduceMotion) {
      for (var i = 0; i < parallax.length; i++) {
        var p = parallax[i], r = p.el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        var off = -((r.top + r.height / 2) - vh / 2) * p.f;
        if (p.mask) p.el.style.setProperty('--py', off.toFixed(1) + 'px');
        else p.el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      }
    }

    // current section in menu
    var cur = 0;
    for (var s = 0; s < sections.length; s++) if (sections[s] && sections[s].getBoundingClientRect().top <= vh * 0.4) cur = s;
    $menuLinks.removeClass('is-current').eq(cur).addClass('is-current');
  }

  if (lenis) lenis.on('scroll', onScroll);
  else { var ticking = false; $win.on('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); } }); }

  /* =====================================================================
     REVEAL ANIMATIONS, SPLIT HEADINGS, COUNTERS
     ===================================================================== */
  // Split section titles into words for a line-by-line rise
  function splitNode(node, state) {
    $(node).contents().each(function () {
      if (this.nodeType === 3) {
        var parts = this.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
        $.each(parts, function (_, w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
          var o = document.createElement('span'); o.className = 'w';
          var inner = document.createElement('span'); inner.textContent = w;
          inner.style.transitionDelay = (state.i++ * 0.05).toFixed(2) + 's';
          o.appendChild(inner); frag.appendChild(o);
        });
        this.parentNode.replaceChild(frag, this);
      } else if (this.nodeType === 1 && this.tagName !== 'BR') {
        if ($(this).is('[data-count]')) {
          var o2 = document.createElement('span'); o2.className = 'w';
          var in2 = document.createElement('span'); in2.style.transitionDelay = (state.i++ * 0.05).toFixed(2) + 's';
          this.parentNode.insertBefore(o2, this); in2.appendChild(this); o2.appendChild(in2);
        } else splitNode(this, state);
      }
    });
  }
  if (!reduceMotion) {
    $('.sec-title, .statement__title, .ebar__title').each(function () { $(this).removeAttr('data-reveal').addClass('split'); splitNode(this, { i: 0 }); });
  }

  function countUp(el) {
    var $el = $(el), to = +$el.data('count'), suf = $el.data('suffix') || '', start = null, dur = 2000;
    if (reduceMotion) { $el.text(to.toLocaleString('en-IN') + suf); return; }
    var step = function (t) {
      if (!start) start = t;
      var k = Math.min(1, (t - start) / dur), e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
      $el.text(Math.round(to * e).toLocaleString('en-IN') + suf);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.hasAttribute('data-count')) countUp(el); else el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $('[data-reveal], .split, [data-count]').each(function () { io.observe(this); });

    // Lazy-load images inside horizontally-moving tracks just before they arrive
    var lazyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $(en.target).find('img[data-src]').each(function () {
          if (this.getAttribute('data-srcset')) this.srcset = this.getAttribute('data-srcset');
          this.src = this.getAttribute('data-src'); this.removeAttribute('data-src');
        });
        lazyIO.unobserve(en.target);
      });
    }, { rootMargin: '700px 0px' });

  } else {
    $('[data-reveal], .split').addClass('is-in');
    $('[data-count]').each(function () { countUp(this); });
    $('img[data-src]').each(function () { this.src = this.getAttribute('data-src'); });
  }

  /* =====================================================================
     GALLERY + LIGHTBOX
     ===================================================================== */
  var $lb = $('#lightbox'), $lbImg = $('#lbImg'), $lbCap = $('#lbCap'), lbList = [], lbIdx = 0;
  function lbShow(i) {
    lbIdx = (i + lbList.length) % lbList.length;
    var it = lbList[lbIdx];
    $lbImg.removeClass('is-loaded');
    var pre = new Image();
    pre.onload = function () { $lbImg.attr({ src: it.src, alt: it.title }).addClass('is-loaded'); };
    pre.src = it.src;
    $lbCap.text(it.title);
    $lb.find('.lightbox__nav').toggle(lbList.length > 1);
  }
  function lbOpen(list, i) { lbList = list; $lb.addClass('is-open').attr('aria-hidden', 'false'); lockScroll(); lbShow(i || 0); }
  function lbClose() { $lb.removeClass('is-open').attr('aria-hidden', 'true'); if (!$('#leadModal').hasClass('is-open') && !$menu.hasClass('is-open')) unlockScroll(); }

  /* ---------- Amenities coverflow (GSAP) ---------- */
  var $cfc = $('#cflow .cfc'), cfN = $cfc.length, cfCur = 0, cfTimer = null;
  function cfLayout(instant) {
    var w = $('#cflow').width(), cardW = $cfc.first().outerWidth() || 500, gap = Math.min(cardW * 0.62, w * 0.3);
    $cfc.each(function (i) {
      var o = i - cfCur; if (o > cfN / 2) o -= cfN; if (o < -cfN / 2) o += cfN;
      var a = Math.abs(o), vis = a <= 2;
      var props = { x: o * gap, scale: 1 - a * 0.16, rotationY: o * -24, opacity: vis ? 1 - a * 0.22 : 0, zIndex: 10 - a, filter: 'brightness(' + (1 - a * 0.25) + ')' };
      this.classList.toggle('is-on', o === 0);
      this.style.pointerEvents = vis ? 'auto' : 'none';
      if (hasGsap && !instant && !reduceMotion) gsap.to(this, $.extend({ duration: 0.9, ease: 'power3.out', overwrite: 'auto' }, props));
      else if (hasGsap) gsap.set(this, props);
      else { this.style.transform = 'translateX(' + props.x + 'px) scale(' + props.scale + ')'; this.style.opacity = props.opacity; this.style.zIndex = props.zIndex; }
    });
    var a = D.amenities[cfCur];
    $('#cfNum').text((cfCur + 1 < 10 ? '0' : '') + (cfCur + 1));
    $('#cfLine').html('<b>' + a.title + '</b><span>' + a.line + '</span> — ' + a.note);
  }
  function cfGo(i) { cfCur = (i + cfN) % cfN; cfLayout(); cfAuto(true); }
  function cfAuto(on) { clearInterval(cfTimer); if (on && !reduceMotion) cfTimer = setInterval(function () { cfCur = (cfCur + 1) % cfN; cfLayout(); }, 3400); }
  $('#cfNext').on('click', function () { cfGo(cfCur + 1); });
  $('#cfPrev').on('click', function () { cfGo(cfCur - 1); });
  $('#cflow').on('click', '.cfc', function () {
    var i = +$(this).data('i');
    if (i === cfCur) lbOpen($.map(D.amenities, function (a) { return { src: img(a.img, 'lg'), title: a.title }; }), i);
    else cfGo(i);
  }).on('mouseenter', function () { cfAuto(false); }).on('mouseleave', function () { cfAuto(true); });
  (function () { // swipe
    var sx = 0, on = false;
    $('#cflow').on('pointerdown', function (e) { on = true; sx = e.clientX; })
      .on('pointerup pointercancel pointerleave', function (e) { if (!on) return; on = false; var dx = e.clientX - sx; if (Math.abs(dx) > 50) cfGo(cfCur + (dx < 0 ? 1 : -1)); });
  })();
  cfLayout(true);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { cfAuto(en[0].isIntersecting); }, { threshold: 0.3 }).observe(document.getElementById('cflow'));

  $doc.on('click', '[data-lightbox]', function () { lbOpen([{ src: img($(this).data('lightbox'), 'lg'), title: $(this).data('title') }], 0); });
  $('#plist').on('click', '.plan:not(.is-locked) .plan__img', function () {
    var $p = $(this).closest('.plan');
    lbOpen([{ src: img($p.data('plan'), 'lg'), title: $p.data('title') }], 0);
  });
  $lb.on('click', '[data-lb-close]', lbClose)
     .on('click', '[data-lb-prev]', function () { lbShow(lbIdx - 1); })
     .on('click', '[data-lb-next]', function () { lbShow(lbIdx + 1); })
     .on('click', function (e) { if (e.target === this) lbClose(); });
  var tx = 0;
  $lb.on('touchstart', function (e) { tx = e.originalEvent.touches[0].clientX; })
     .on('touchend', function (e) { var dx = e.originalEvent.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50 && lbList.length > 1) lbShow(lbIdx + (dx < 0 ? 1 : -1)); });

  /* =====================================================================
     LEAD MODAL
     ===================================================================== */
  var $modal = $('#leadModal'), $modalForm = $modal.find('.lead-form');
  function titleFor(src) {
    if (/site visit/i.test(src)) return 'Book a private site visit';
    if (/brochure/i.test(src)) return 'Download the e-brochure';
    if (/unlock/i.test(src)) return 'Unlock all floor plans';
    if (/cost|price/i.test(src)) return 'Get the price sheet';
    return 'Enquire now';
  }
  function openModal(source, config) {
    if ($menu.hasClass('is-open')) closeMenu();
    $modalForm.attr('data-source', source || 'Popup Form');
    $('#modalTitle').text(titleFor(source || ''));
    $modalForm.find('[name=message]').val(config ? 'Interested in ' + config : '');
    $modal.addClass('is-open').attr('aria-hidden', 'false'); lockScroll();
    if (hasGsap && !reduceMotion) {
      gsap.timeline()
        .fromTo('#leadModal .mv', { y: 60, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo('#leadModal .mv__img', { scale: 1.25 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0)
        .fromTo('#leadModal .mv__splash', { scale: 0.3, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 0.16, duration: 1.1, ease: 'power3.out' }, 0.15)
        .fromTo('#leadModal .mv__copy > *, #leadModal .mv__form > *', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, 0.2);
    }
    store.set('envogue_popup_seen', '1', true);
    setTimeout(function () { if (!isMobile()) $modalForm.find('input[name=name]').trigger('focus'); }, 500);
  }
  function closeModal() { $modal.removeClass('is-open').attr('aria-hidden', 'true'); if (!$lb.hasClass('is-open')) unlockScroll(); }
  $doc.on('click', '[data-enquire]', function (e) { e.preventDefault(); openModal($(this).data('enquire'), $(this).data('config')); });
  $modal.on('click', '[data-close]', closeModal);

  $doc.on('keydown', function (e) {
    if (e.key === 'Escape') { if ($lb.hasClass('is-open')) lbClose(); else if ($modal.hasClass('is-open')) closeModal(); else closeMenu(); }
    if ($lb.hasClass('is-open')) { if (e.key === 'ArrowRight') lbShow(lbIdx + 1); if (e.key === 'ArrowLeft') lbShow(lbIdx - 1); }
  });

  // Auto popup once per session (after 25s), plus desktop exit-intent
  function canAutoPop() { return !isLead() && !store.get('envogue_popup_seen', true) && !$modal.hasClass('is-open') && !$menu.hasClass('is-open') && !$lb.hasClass('is-open'); }
  setTimeout(function () { if (canAutoPop()) openModal('Auto Popup (25s)'); }, 25000);
  // Exit intent: only after 12s on page and some real scrolling, when the cursor leaves through the top edge
  var pageStart = Date.now();
  $(document.documentElement).on('mouseleave', function (e) {
    if (e.clientY > 5 || isMobile() || Date.now() - pageStart < 12000) return;
    if ((window.scrollY || 0) < window.innerHeight * 0.8) return;
    if (canAutoPop()) openModal('Exit Intent Popup');
  });

  /* =====================================================================
     LEAD FORMS → email via FormSubmit (AJAX)
     ===================================================================== */
  var utm = (function () {
    var out = {}, q = new URLSearchParams(window.location.search);
    $.each(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'], function (_, k) {
      var v = q.get(k) || store.get('envogue_' + k, true); if (v) { out[k] = v; store.set('envogue_' + k, v, true); }
    });
    return out;
  })();

  function unlockPlans() { $('.plan').removeClass('is-locked'); renderPlist(); }
  if (isLead()) unlockPlans();


  $doc.on('submit', '.lead-form', function (e) {
    e.preventDefault();
    var $f = $(this), $msg = $f.find('.form-msg').text('');
    var v = function (n) { return $.trim($f.find('[name=' + n + ']').val() || ''); };
    if ($f.find('[name=_honey]').val()) return; // bot

    var chk = window.LeadForm.validate($f);
    if (!chk.ok) { $msg.text(chk.consent ? 'Please correct the fields marked above.' : 'Please accept the consent to continue.'); return; }

    var source = $f.attr('data-source') || 'Website';
    var payload = $.extend({
      _subject: 'New Lead — Envogue 2.0 — ' + v('name') + ' (' + source + ')',
      _template: 'table',
      _captcha: 'false',
      Name: v('name'),
      Phone: chk.phone,
      Country: chk.country,
      Email: v('email'),
      Message: v('message'),
      'Lead Source': source,
      Page: window.location.href,
      'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    }, utm);

    $f.addClass('is-loading'); $msg.text('Sending…');
    $.ajax({
      url: 'https://formsubmit.co/ajax/' + C.leadEmail,
      method: 'POST', dataType: 'json', contentType: 'application/json',
      data: JSON.stringify(payload), timeout: 15000
    }).done(function () {
      store.set('envogue_lead', '1');
      unlockPlans();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'lead_submit', lead_source: source });
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
      // Redirect to the thank-you (conversion) page with the visitor's first name & choice
      var tyUrl = 'thank-you.html?name=' + encodeURIComponent(v('name').split(' ')[0]);
      setTimeout(function () { window.location.href = tyUrl; }, 350);
      $f.hide().after(
        '<div class="thanks"><div class="thanks__ico">✓</div><h4>Thank you, ' + $('<i>').text(v('name').split(' ')[0]).html() + '!</h4>' +
        '<p>Our Envogue 2.0 expert will call you shortly. All floor plans are now unlocked.</p>' +
        '<a class="btn btn--accent" href="tel:' + C.phone + '">Call now ' + C.phoneLabel + '</a></div>'
      );
    }).fail(function () {
      $msg.html('We couldn\'t send that right now. Please call <a href="tel:' + C.phone + '" style="text-decoration:underline">' + C.phoneLabel + '</a>.');
    }).always(function () { $f.removeClass('is-loading'); });
  });

  /* =====================================================================
     VIDEO, MAP, MISC
     ===================================================================== */



  $('#year').text(new Date().getFullYear());

  /* =====================================================================
     BANNER — project slider (complete images) with timed thumbnails
     ===================================================================== */
  var $bSlides = $('#bSlides .bslide'), bIdx = 0, bTimer = null, bDur = 5.5;
  $('#bThumbs').html($bSlides.map(function (i) {
    return '<button class="bthumb' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '"><i></i>' + $(this).data('label') + '</button>';
  }).get().join(''));
  function bLoad(i) {
    var im = $bSlides.eq(i).find('img')[0];
    if (im && im.getAttribute('data-src')) { im.srcset = im.getAttribute('data-srcset'); im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }
  }
  function bProgress(i) {
    $('#bThumbs .bthumb i').stop(true).css('width', 0);
    if (hasGsap) { gsap.killTweensOf('#bThumbs .bthumb i'); gsap.fromTo($('#bThumbs .bthumb i').eq(i), { width: '0%' }, { width: '100%', duration: bDur, ease: 'none' }); }
  }
  function bGo(i) {
    if (i === bIdx) return;
    var $cur = $bSlides.eq(bIdx), $next = $bSlides.eq(i);
    bLoad(i); bLoad((i + 1) % $bSlides.length);
    $('#bThumbs .bthumb').removeClass('is-active').eq(i).addClass('is-active');
    $('#bNum').text('0' + (i + 1));
    if (hasGsap && !reduceMotion) {
      $next.addClass('is-in');
      gsap.timeline({ onComplete: function () { $cur.removeClass('is-active'); $next.removeClass('is-in').addClass('is-active'); } })
        .fromTo($next[0], { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.25, ease: 'power3.inOut' })
        .fromTo($next.find('img')[0], { scale: 1.2, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 1.6, ease: 'power3.out' }, 0)
        .to($cur.find('img')[0], { scale: 1.06, xPercent: -6, duration: 1.25, ease: 'power3.inOut' }, 0)
        .set($cur.find('img')[0], { clearProps: 'all' });
    } else { $cur.removeClass('is-active'); $next.addClass('is-active'); }
    bIdx = i; bProgress(i); bAuto();
  }
  function bAuto() { clearTimeout(bTimer); bTimer = setTimeout(function () { bGo((bIdx + 1) % $bSlides.length); }, bDur * 1000); }
  $('#bThumbs').on('click', '.bthumb', function () { bGo(+$(this).data('i')); });
  $win.on('load', function () { bLoad(1); });
  if (!reduceMotion) { bProgress(0); bAuto(); }

  /* =====================================================================
     GSAP SCENES
     ===================================================================== */
  if (hasGsap && !reduceMotion) {
    // Banner entrance
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.banner__splash', { scale: 0.4, rotation: -60, opacity: 0, duration: 1.8 })
      .from('.banner__logo-img', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.3 }, 0.15)
      .from('.banner__by, .banner__title > span, .banner__price, .banner__cta', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.45)
      .from('.banner__hl li', { y: 24, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.7)
      .from('.banner__slides', { clipPath: 'inset(100% 0 0 0 round 24px)', duration: 1.4, ease: 'power3.inOut' }, 0.2)
      .from('.banner__slides .bslide.is-active img', { scale: 1.25, duration: 2, ease: 'power3.out' }, 0.2)
      .from('.banner__thumbs, .banner__count', { opacity: 0, y: 14, duration: 0.8 }, 1.1)
      .from('.banner__rules i', { scaleY: 0, transformOrigin: 'top', duration: 1.2, stagger: 0.12, ease: 'power3.inOut' }, 0.4);
    // Banner parallax as you leave
    // Desktop only: on mobile the banner is tall and would fade while still being read
    if (window.matchMedia('(min-width: 1101px)').matches) gsap.to('.banner__grid', { yPercent: -10, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.banner', start: 'top top', end: 'bottom top', scrub: true } });

    // Overview: image stage wipes up, pins pop, text rises
    gsap.timeline({ scrollTrigger: { trigger: '#overview', start: 'top 70%' } })
      .from('#ovVisual', { clipPath: 'inset(100% 0 0 0 round 24px)', duration: 1.3, ease: 'power3.inOut' })
      .from('#ovVisual .ov__fig.is-on img', { scale: 1.3, duration: 1.8, ease: 'power3.out' }, 0)
      .from('.ov__text > *', { y: 36, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.2)
      .from('#ovVisual .pin', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(2.2)' }, 1)
      .from('.ov-splash', { scale: 0.3, rotation: -50, opacity: 0, duration: 1.4, ease: 'power3.out' }, 0.1);
    // Amenities: coverflow rises in
    gsap.from('#cflow .cfc', { y: 120, opacity: 0, duration: 1.1, stagger: 0.05, ease: 'power3.out', scrollTrigger: { trigger: '#cflow', start: 'top 85%' }, onComplete: function () { cfLayout(true); } });

    // Price list: lines draw, rows slide in
    gsap.from('#plist .prow', { y: 40, opacity: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: '#plist', start: 'top 82%' } });
    gsap.from('#plist .plist__head, #plist .prow', { '--line': 0, duration: 1.2, stagger: 0.09, ease: 'power3.inOut', scrollTrigger: { trigger: '#plist', start: 'top 82%' } });
    // Cursor-following plan preview
    (function () {
      var fl = document.getElementById('plistFloat'), box = document.getElementById('plist');
      if (!fl || !window.matchMedia('(hover: hover)').matches) return;
      var xTo = gsap.quickTo(fl, 'x', { duration: 0.6, ease: 'power3' }), yTo = gsap.quickTo(fl, 'y', { duration: 0.6, ease: 'power3' });
      var $img = $(fl).find('img'), cur = -1;
      $(box).on('mousemove', function (e) { var b = box.getBoundingClientRect(); xTo(e.clientX - b.left + 26); yTo(e.clientY - b.top - 120); });
      $(box).on('mouseenter', '.prow', function () {
        var i = +$(this).data('i'), r = D.residences[i];
        if (i !== cur) { cur = i; $img.attr('src', img(r.img, 'sm')); $(fl).find('b').text(r.tab + ' · ' + r.area + ' sq.ft'); }
        gsap.to(fl, { autoAlpha: 1, scale: 1, rotation: i % 2 ? 3 : -3, duration: 0.45, ease: 'power3.out' });
      });
      $(box).on('mouseleave', function () { gsap.to(fl, { autoAlpha: 0, scale: 0.8, duration: 0.35 }); });
    })();

    $win.on('load', function () { ScrollTrigger.refresh(); });
  }

  // Overview tabs: text pane + image stage switch together
  $('#ovTabs').on('click', 'button', function () {
    var p = $(this).data('p'); if ($(this).hasClass('is-on')) return;
    $(this).addClass('is-on').siblings().removeClass('is-on');
    $('.ov__pane').removeClass('is-on').filter('[data-p="' + p + '"]').addClass('is-on');
    var $fig = $('.ov__fig[data-p="' + p + '"]');
    $('.ov__fig').removeClass('is-top'); $fig.addClass('is-on is-top');
    if (hasGsap && !reduceMotion) {
      gsap.fromTo($fig[0], { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1, ease: 'power3.inOut', onComplete: function () { $('.ov__fig').not($fig).removeClass('is-on'); } });
      gsap.fromTo($fig.find('img')[0], { scale: 1.2 }, { scale: 1, duration: 1.4, ease: 'power3.out' });
      gsap.from('.ov__pane.is-on > *', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' });
    } else $('.ov__fig').not($fig).removeClass('is-on');
  });

  /* ---------- Layout on load / resize ---------- */
  function relayout() {
    vh = window.innerHeight;
    layoutDynamic();
    if (typeof cfLayout === 'function') cfLayout(true);
    if (lenis) lenis.resize();
    if (hasGsap) ScrollTrigger.refresh();
    onScroll();
  }
  var rT; $win.on('resize orientationchange', function () { clearTimeout(rT); rT = setTimeout(relayout, 150); });
  $win.on('load', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  relayout();

})(jQuery);
