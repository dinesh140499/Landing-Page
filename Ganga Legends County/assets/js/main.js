/* =========================================================================
   GANGA LEGENDS COUNTY — interactions (jQuery + Lenis + GSAP ScrollTrigger)
   Page content and settings live in data.js (window.SITE).
   ========================================================================= */
(function ($) {
  'use strict';

  /* =====================================================================
     SHARED HELPERS
     ===================================================================== */
  var SITE = window.SITE;
  var CONTACT = SITE.contact;

  var $win = $(window);
  var $doc = $(document);
  var $body = $('body');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  /* Image path from a slug: 'amenities-gymnasium' + 'sm' →
     assets/images/amenities/amenities-gymnasium-sm.webp */
  var IMAGE_DIRS = { banner: 'banner', amenities: 'amenities' };
  function imagePath(name, size) {
    return 'assets/images/' + IMAGE_DIRS[name.split('-')[0]] + '/' + name + (size ? '-' + size : '') + '.webp';
  }

  /* Storage helper from lead-form.js (loaded first), with a local fallback. */
  var store = (window.LeadForm && window.LeadForm.store) || {
    get: function (key, session) {
      try { return (session ? sessionStorage : localStorage).getItem(key); } catch (e) { return null; }
    },
    set: function (key, value, session) {
      try { (session ? sessionStorage : localStorage).setItem(key, value); } catch (e) { /* ignore */ }
    }
  };

  function isLead() {
    return store.get('glc_lead') === '1';
  }

  /* Two-digit number for display: 1 → '01'. */
  function pad2(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /* =====================================================================
     SMOOTH SCROLL
     ===================================================================== */
  var lenis = null;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });

    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  function lockScroll() {
    if (lenis) lenis.stop();
    else $('html').css('overflow', 'hidden');
  }

  function unlockScroll() {
    if (lenis) lenis.start();
    else $('html').css('overflow', '');
  }

  function headerHeight() {
    return document.getElementById('hd').offsetHeight;
  }

  /* Scroll to a section, leaving room for the fixed header. */
  function scrollToEl(el, instant) {
    if (!el) return;
    var y = el.id === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY - headerHeight() + 1;

    if (lenis) {
      lenis.start();
      lenis.scrollTo(y, { immediate: !!instant, force: true, duration: 1.4 });
    } else {
      window.scrollTo({ top: y, behavior: instant ? 'auto' : 'smooth' });
    }
  }

  /* =====================================================================
     CONTACT SETTINGS → PAGE
     ===================================================================== */
  if (!CONTACT.whatsapp) $('[data-wa]').hide();
  $('[data-tel]').attr('href', CONTACT.phone ? 'tel:' + CONTACT.phone : '#contact');
  if (CONTACT.phoneLabel) $('[data-tel-label]').text(CONTACT.phoneLabel);
  $('#year').text(new Date().getFullYear());

  // Footer disclaimer "Read more" toggle
  $('#ftMore').on('click', function () {
    var isOpen = $('#ftDisc').toggleClass('is-open').hasClass('is-open');
    $(this).text(isOpen ? 'Read less' : 'Read more').attr('aria-expanded', isOpen);
    if (hasGsap) ScrollTrigger.refresh();
  });

  /* =====================================================================
     HEADER — in flow above the banner, fixed bar after it
     ===================================================================== */
  var heroEl = document.getElementById('home');
  var $header = $('#hd');
  var SECTION_IDS = ['overview', 'residences', 'wellness', 'amenities', 'location', 'gallery'];
  var navCurrent = -2;
  var navHover = false;

  /* Slide the nav underline to a link (or hide it when there is none). */
  function navIndicator(link) {
    var indicator = document.getElementById('hdInd');
    $('.hd__nav a').removeClass('is-ind');

    if (!link || !link.offsetWidth) {
      indicator.style.opacity = 0;
      return;
    }
    indicator.style.opacity = 1;
    indicator.style.width = link.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
    link.classList.add('is-ind');
  }

  $('#hdNav')
    .on('mouseenter', 'a', function () {
      navHover = true;
      navIndicator(this);
    })
    .on('mouseleave', function () {
      navHover = false;
      navIndicator(navCurrent > -1 ? $('.hd__nav a')[navCurrent] : null);
    });

  function onScroll() {
    var y = window.scrollY;
    var pastHero = y > heroEl.offsetTop + heroEl.offsetHeight - 10;

    if (!$body.hasClass('menu-open')) {
      $header.toggleClass('is-fixed', pastHero);
      $body.toggleClass('hd-compact', pastHero);
    }

    // Scroll progress (back-to-top ring)
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var percent = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round(y / maxScroll * 100))) : 0;
    document.documentElement.style.setProperty('--sp', percent);
    $('#toTopPct').text(percent + '%');
    $('#toTop').toggleClass('is-on', y > heroEl.offsetHeight * .8);

    // Highlight the nav link of the section in view
    var current = -1;
    SECTION_IDS.forEach(function (id, i) {
      var section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top < window.innerHeight * .4) current = i;
    });

    if (current !== navCurrent) {
      navCurrent = current;
      $('.hd__nav a').removeClass('is-current');
      if (current > -1) $('.hd__nav a').eq(current).addClass('is-current');
      if (!navHover) navIndicator(current > -1 ? $('.hd__nav a')[current] : null);
    }
  }

  if (lenis) lenis.on('scroll', onScroll);
  else $win.on('scroll', onScroll);
  $win.on('resize', onScroll);
  onScroll();

  $('#toTop').on('click', function () { scrollToEl(heroEl); });

  /* =====================================================================
     MENU
     ===================================================================== */
  var $menu = $('#menu');
  var $burger = $('#burger');

  function menuOpen() {
    $menu.addClass('is-open').attr('aria-hidden', 'false');
    $body.addClass('menu-open');
    $burger.attr('aria-expanded', 'true');
    lockScroll();
  }

  function menuClose() {
    $menu.removeClass('is-open').attr('aria-hidden', 'true');
    $body.removeClass('menu-open');
    $burger.attr('aria-expanded', 'false');
    unlockScroll();
    onScroll();
  }

  $burger.on('click', function () {
    if ($menu.hasClass('is-open')) menuClose();
    else menuOpen();
  });

  $menu.on('click', '.menu__links a', function (e) {
    e.preventDefault();
    var target = document.querySelector($(this).attr('href'));
    menuClose();
    scrollToEl(target, true);
  });

  // In-page anchor links (menu links are handled above)
  $doc.on('click', 'a[href^="#"]:not([data-tel])', function (e) {
    var href = $(this).attr('href');
    if (href.length < 2 || $(this).closest('.menu').length) return;

    var target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    scrollToEl(target);
  });

  /* =====================================================================
     HERO SLIDER
     ===================================================================== */
  var $slides = $('#heroSlides .hero__slide');
  var heroIndex = 0;
  var heroTimer;

  $('#heroDots').html($slides.map(function (i) {
    return '<button type="button" class="hero__dot' + (i ? '' : ' is-on') + '" data-i="' + i + '">' +
      '<span>0' + (i + 1) + ' · ' + $(this).data('label') + '</span><i></i></button>';
  }).get().join(''));

  /* Swap in the real image source the first time a slide is needed. */
  function heroLoad(i) {
    var image = $slides.eq(i).find('img')[0];
    if (image && image.getAttribute('data-src')) {
      image.srcset = image.getAttribute('data-srcset');
      image.src = image.getAttribute('data-src');
      image.removeAttribute('data-src');
    }
  }

  function heroGo(i) {
    i = (i + $slides.length) % $slides.length;
    if (i === heroIndex) return;

    heroLoad(i);
    heroLoad((i + 1) % $slides.length);
    $slides.removeClass('is-on').eq(i).addClass('is-on');

    // Restart the dot's progress animation (reflow between remove and add)
    var $dots = $('#heroDots .hero__dot').removeClass('is-on');
    void $dots[0].offsetWidth;
    $dots.eq(i).addClass('is-on');

    heroIndex = i;
    heroAuto();
  }

  function heroAuto() {
    clearTimeout(heroTimer);
    if (!reduceMotion) heroTimer = setTimeout(function () { heroGo(heroIndex + 1); }, 6500);
  }

  $('#heroDots').on('click', '.hero__dot', function () { heroGo(+$(this).data('i')); });
  $win.on('load', function () { heroLoad(1); });
  heroAuto();

  /* =====================================================================
     RESIDENCES — tower selector
     ===================================================================== */
  var FLOORS = 27;
  var towerIndex = -1;

  $('#twTabs').html($.map(SITE.towers, function (tower, i) {
    return '<button type="button" role="tab" data-i="' + i + '">Tower ' + tower.name + '<small>' + tower.possession + '</small></button>';
  }).join(''));

  // One <i> per floor in the building graphic
  $('#twBldg').html(new Array(FLOORS + 1).join('<i></i>'));

  function towerShow(i) {
    if (i === towerIndex) return;
    towerIndex = i;
    var tower = SITE.towers[i];

    $('#twTabs button')
      .removeClass('is-on').attr('aria-selected', 'false')
      .eq(i).addClass('is-on').attr('aria-selected', 'true');
    $('#twName').text(tower.name);
    $('#twTag').text(tower.tag);
    $('#twPos').text(tower.possession);

    // Light up built floors one by one
    var builtFloors = Math.round(FLOORS * tower.progress);
    $('#twBldg i').each(function (k) {
      var floor = this;
      setTimeout(function () { floor.classList.toggle('is-built', k < builtFloors); }, reduceMotion ? 0 : k * 22);
    });

    $('#twRows').html($.map(tower.units, function (unit) {
      var config = 'Tower ' + tower.name + ' — ' + unit.type + ', ' + unit.carpet + ' sq ft';
      return '<div class="tw__row">' +
        '<span class="tw__type">' + unit.type + '</span>' +
        '<span class="tw__area"><b>' + unit.carpet.toLocaleString('en-IN') + '</b><small>sq ft</small></span>' +
        '<span class="tw__price"><b>₹' + unit.price + '</b><small>Cr*</small></span>' +
        '<button type="button" class="btn btn--line" data-enquire="Cost Sheet — ' + config + '" data-config="' + config + '">Cost Sheet</button>' +
        '</div>';
    }).join(''));

    if (hasGsap && !reduceMotion) {
      gsap.from('#twRows .tw__row, .tw__meta > *', { y: 16, opacity: 0, duration: .5, stagger: .05, ease: 'power3.out' });
    }
  }

  $('#twTabs').on('click', 'button', function () { towerShow(+$(this).data('i')); });
  towerShow(0);

  /* =====================================================================
     WELLNESS — orbit dial
     ===================================================================== */
  var WELLNESS = SITE.wellness;
  var ORBIT_DURATION = 6000;
  var orbitIndex = -1;
  var orbitStart = 0;
  var orbitPaused = false;
  var orbitInView = false;

  // Nodes placed around a circle, starting at the top
  $('#orbNodes').html($.map(WELLNESS, function (layer, i) {
    var angle = -90 + i * 360 / WELLNESS.length;
    var radians = angle * Math.PI / 180;
    var x = 50 + 46 * Math.cos(radians);
    var y = 50 + 46 * Math.sin(radians);
    var side = Math.abs(x - 50) < 6 && y < 50 ? 'is-t' : (x < 50 ? 'is-l' : 'is-r');

    return '<button type="button" role="tab" class="orb__node ' + side + '" data-i="' + i + '" ' +
      'style="--x:' + x.toFixed(2) + '%;--y:' + y.toFixed(2) + '%" aria-label="' + layer.title + '">' +
      '<span>0' + (i + 1) + '</span><em>' + layer.title + '</em></button>';
  }).join(''));

  $('#orbImgs').html($.map(WELLNESS, function (layer) {
    return '<img src="' + imagePath(layer.img, 'sm') + '" alt="' + layer.title + ' — Ganga Legends County" loading="lazy" decoding="async">';
  }).join(''));

  function orbitShow(i) {
    i = (i + WELLNESS.length) % WELLNESS.length;
    if (i === orbitIndex) return;
    orbitIndex = i;
    var layer = WELLNESS[i];

    $('#orbNodes .orb__node')
      .removeClass('is-on').attr('aria-selected', 'false')
      .eq(i).addClass('is-on').attr('aria-selected', 'true');
    $('#orbImgs img').removeClass('is-on').eq(i).addClass('is-on');

    $('#orbNum, #orbCoreNum').text('0' + (i + 1));
    $('#orbTitle').text(layer.title);
    $('#orbStrap').text(layer.strap);
    $('#orbMeans').text(layer.means);
    $('#orbFeats').html($.map(layer.feats, function (feat) { return '<li>' + feat + '</li>'; }).join(''));

    if (hasGsap && !reduceMotion) {
      gsap.fromTo('#orbCard h3, #orbStrap, #orbFeats li, .orb__means',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: .5, stagger: .045, ease: 'power3.out' });
    }
    orbitStart = performance.now();
  }

  /* Auto-advance with a progress ring; pauses on hover / out of view. */
  (function orbitTick(time) {
    var progress = 0;

    if (!reduceMotion && orbitInView && !orbitPaused) {
      progress = Math.min(1, (time - orbitStart) / ORBIT_DURATION);
      if (progress >= 1) orbitShow(orbitIndex + 1);
    } else {
      // Paused: keep the ring where it was by shifting the start time
      orbitStart = time - (parseFloat(document.getElementById('orbProg').getAttribute('data-p')) || 0) * ORBIT_DURATION;
    }

    var ring = document.getElementById('orbProg');
    ring.setAttribute('data-p', progress);
    ring.style.strokeDashoffset = 100 - progress * 100;

    requestAnimationFrame(orbitTick);
  })(0);

  $('#orbNodes').on('click', '.orb__node', function () { orbitShow(+$(this).data('i')); });
  $('#orbPrev').on('click', function () { orbitShow(orbitIndex - 1); });
  $('#orbNext').on('click', function () { orbitShow(orbitIndex + 1); });
  $('.orb')
    .on('mouseenter', function () { orbitPaused = true; })
    .on('mouseleave', function () {
      orbitPaused = false;
      orbitStart = performance.now();
    });
  orbitShow(0);

  /* =====================================================================
     AMENITIES — hover showcase
     ===================================================================== */
  var AMENITIES = SITE.amenities;
  var showIndex = -1;
  var showInView = false;
  var showLast = 0;   // time of the last change, for auto-advance
  var showHover = false;

  $('#showList').html($.map(AMENITIES, function (amenity, i) {
    return '<li><button type="button" data-i="' + i + '"><i>0' + (i + 1) + '</i>' +
      '<span><b>' + amenity.title + '</b><small>' + amenity.note + '</small></span><em>&#8594;</em></button></li>';
  }).join('') +
    '<li class="show__more"><button type="button" data-enquire="Amenities — Full List Brochure"><i>07</i>' +
    '<span><b>Full list in the brochure</b><small>Request it — we&#8217;ll send it right away</small></span><em>&#8594;</em></button></li>');

  function showGo(i) {
    i = (i + AMENITIES.length) % AMENITIES.length;
    if (i === showIndex) return;
    showIndex = i;
    var amenity = AMENITIES[i];

    // Cross-fade: add the new image on top, then drop the old one
    var $oldImage = $('#showImgs img.is-on');
    var $image = $('<img alt="" decoding="async">').attr({
      src: imagePath(amenity.img, 'lg'),
      srcset: imagePath(amenity.img, 'sm') + ' 800w, ' + imagePath(amenity.img, 'lg') + ' 1600w',
      sizes: '(max-width: 1000px) 92vw, 60vw',
      alt: amenity.title + ' at Ganga Legends County'
    }).appendTo('#showImgs');

    if (reduceMotion || !$oldImage.length) {
      $image.addClass('is-on');
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { $image.addClass('is-on'); });
      });
    }
    setTimeout(function () { $oldImage.remove(); }, 1100);

    $('#showNo').text('0' + (i + 1));
    $('#showTitle').text(amenity.title);

    // Restart the button's progress animation
    var $buttons = $('#showList button').removeClass('is-on');
    void $buttons[0].offsetWidth;
    $buttons.eq(i).addClass('is-on');

    showLast = Date.now();
  }

  if (!reduceMotion) {
    setInterval(function () {
      if (showInView && !showHover && Date.now() - showLast > 5000) showGo(showIndex + 1);
    }, 400);
  }

  $('.show')
    .on('mouseenter', function () { showHover = true; })
    .on('mouseleave', function () {
      showHover = false;
      showLast = Date.now();
    });

  $('#showList').on('click mouseenter', 'button[data-i]', function (e) {
    if (e.type === 'mouseenter' && window.matchMedia('(hover: none)').matches) return;
    showGo(+$(this).data('i'));
  });

  $('#showZoom, #showImgs').on('click', function () {
    lightboxOpen($.map(AMENITIES, function (amenity) {
      return { src: imagePath(amenity.img, 'lg'), title: amenity.title };
    }), showIndex);
  });

  showGo(0);

  /* =====================================================================
     LOCATION — live radar
     ===================================================================== */
  var LOCATIONS = SITE.location;
  var CATEGORY_COLORS = ['#B4703F', '#2C3D29', '#6F7D4E', '#D29B3C'];
  var locationIndex = 0;
  var locationTimer;
  var locationHot = 0;
  var locationPaused = false;

  /* km → rough minutes, for plotting only. */
  function toMinutes(value) {
    var n = parseFloat(value);
    return /km/i.test(value) ? n * 2.5 : n;
  }

  $('#locTabs').html($.map(LOCATIONS, function (category, i) {
    return '<button type="button" role="tab" data-i="' + i + '" style="--c:' + CATEGORY_COLORS[i] + '"' + (i ? '' : ' class="is-on"') + '>' +
      '<i></i>' + category.cat + '</button>';
  }).join(''));

  // Each category gets a quarter of the radar; distance sets the radius
  $('#radarPts').html($.map(LOCATIONS, function (category, ci) {
    return $.map(category.items, function (item, k) {
      var minutes = toMinutes(item[1]);
      var far = minutes > 15;
      var radius = 8 + Math.min(minutes, 15) / 15 * 38;
      var angle = (ci * 90 - 80 + (k + .5) * (70 / category.items.length)) * Math.PI / 180;
      var x = 50 + radius * Math.cos(angle);
      var y = 50 + radius * Math.sin(angle);

      return '<span class="radar__pt' + (x < 50 ? ' is-left' : '') + (far ? ' is-far' : '') + '" data-c="' + ci + '" data-k="' + k + '" ' +
        'style="--x:' + x.toFixed(2) + '%;--y:' + y.toFixed(2) + '%;--c:' + CATEGORY_COLORS[ci] + ';--d:' + ((ci * 4 + k) * 70) + 'ms">' +
        '<i></i><b>' + item[0] + ' · ' + item[1] + '</b></span>';
    }).join('');
  }).join(''));

  /* Highlight one place in both the radar and the list. */
  function locationHighlight(k) {
    locationHot = k;
    $('#radarPts .radar__pt')
      .removeClass('is-hot')
      .filter('[data-c="' + locationIndex + '"][data-k="' + k + '"]').addClass('is-hot');
    $('#locList li').removeClass('is-hot').eq(k).addClass('is-hot');
  }

  function locationShow(i) {
    locationIndex = i;
    var category = LOCATIONS[i];

    $('#locTabs button').removeClass('is-on').eq(i).addClass('is-on');

    $('#locList').css('--c', CATEGORY_COLORS[i]).html($.map(category.items, function (item, k) {
      var parts = /^([\d.]+)\s*(.*)$/.exec(item[1]); // "5 min" → 5 + <small>min</small>
      return '<li data-k="' + k + '"><span>' + item[0] + '</span><b>' + (parts ? parts[1] + '<small>' + parts[2] + '</small>' : item[1]) + '</b></li>';
    }).join(''));

    // Dim points from other categories
    $('#radarPts .radar__pt').each(function () {
      this.style.opacity = +this.getAttribute('data-c') === i ? '' : '.22';
    });

    locationHighlight(0);

    if (hasGsap && !reduceMotion) {
      gsap.from('#locList li', { x: -16, opacity: 0, duration: .45, stagger: .05, ease: 'power3.out' });
    }

    // Cycle the highlight through the list
    clearInterval(locationTimer);
    if (!reduceMotion) {
      locationTimer = setInterval(function () {
        if (!locationPaused) locationHighlight((locationHot + 1) % LOCATIONS[locationIndex].items.length);
      }, 2200);
    }
  }

  $('#locTabs').on('click', 'button', function () { locationShow(+$(this).data('i')); });
  $('#locList')
    .on('mouseenter', 'li', function () {
      locationPaused = true;
      locationHighlight(+$(this).data('k'));
    })
    .on('mouseleave', function () { locationPaused = false; });
  locationShow(0);

  /* ---------- Auto-play only while in view ---------- */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        orbitInView = entry.isIntersecting;
        if (orbitInView) orbitStart = performance.now();
      });
    }, { threshold: .35 }).observe(document.getElementById('orbDial'));

    var stageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target.id === 'showStage') {
          showInView = entry.isIntersecting;
          if (showInView) showLast = Date.now();
        }
        if (entry.target.id === 'radar' && entry.isIntersecting) entry.target.classList.add('is-live');
      });
    }, { threshold: .3 });
    stageObserver.observe(document.getElementById('showStage'));
    stageObserver.observe(document.getElementById('radar'));
  } else {
    orbitInView = showInView = true;
    $('#radar').addClass('is-live');
  }

  /* =====================================================================
     REVEAL + COUNTERS
     ===================================================================== */
  /* Count up to data-count with an ease-out curve. */
  function countUp(el) {
    var target = +el.getAttribute('data-count');
    var startTime = null;

    if (reduceMotion) {
      el.textContent = target.toLocaleString('en-IN');
      return;
    }
    requestAnimationFrame(function step(time) {
      if (!startTime) startTime = time;
      var k = Math.min(1, (time - startTime) / 1600);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN');
      if (k < 1) requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (entry.target.hasAttribute('data-count')) countUp(entry.target);
        else entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12 });
    $('[data-rv], [data-count]').each(function () { revealObserver.observe(this); });
  } else {
    $('[data-rv]').addClass('is-in');
    $('[data-count]').each(function () { this.textContent = this.getAttribute('data-count'); });
  }

  /* =====================================================================
     GSAP — hero entrance + gentle parallax
     ===================================================================== */
  if (hasGsap && !reduceMotion) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero__stage', { clipPath: 'inset(8% 8% 8% 8% round 22px)', duration: 1.3, ease: 'power3.inOut' })
      .from('.hero__name > *, .hero__price, .hero__keys li', { y: 22, opacity: 0, duration: .7, stagger: .06 }, .5)
      .from('.hero__bar', { opacity: 0, y: 10, duration: .6 }, .9);

    gsap.to('.bp__pic img', {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: { trigger: '.bp__pic', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.from('.layers li', {
      x: 30, opacity: 0, stagger: .12, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: '.layers', start: 'top 80%' }
    });
    gsap.from('#orbNodes .orb__node > span', {
      scale: 0, duration: .6, stagger: .07, ease: 'back.out(2)',
      scrollTrigger: { trigger: '#orbDial', start: 'top 78%' }
    });
    gsap.from('#showList li', {
      x: 30, opacity: 0, duration: .6, stagger: .06, ease: 'power3.out',
      scrollTrigger: { trigger: '#showList', start: 'top 82%' }
    });
  }

  /* =====================================================================
     LIGHTBOX + GALLERY
     ===================================================================== */
  var $lightbox = $('#lb');
  var lightboxList = [];
  var lightboxIndex = 0;

  function lightboxShow(i) {
    lightboxIndex = (i + lightboxList.length) % lightboxList.length;
    var item = lightboxList[lightboxIndex];
    $('#lbImg').attr({ src: item.src, alt: item.title });
    $('#lbCap').text(item.title);
    $lightbox.find('.lb__nav').toggle(lightboxList.length > 1);
  }

  function lightboxOpen(list, i) {
    lightboxList = list;
    $lightbox.addClass('is-open').attr('aria-hidden', 'false');
    lockScroll();
    lightboxShow(i || 0);
  }

  function lightboxClose() {
    $lightbox.removeClass('is-open').attr('aria-hidden', 'true');
    if (!$('#leadModal').hasClass('is-open')) unlockScroll();
  }

  $lightbox
    .on('click', '[data-lb-close]', lightboxClose)
    .on('click', '[data-lb-prev]', function () { lightboxShow(lightboxIndex - 1); })
    .on('click', '[data-lb-next]', function () { lightboxShow(lightboxIndex + 1); })
    .on('click', function (e) { if (e.target === this) lightboxClose(); });

  /* Gallery: gallery-01 … gallery-17, a window of 6 visible on desktop. */
  var GALLERY = [];
  for (var g = 1; g <= 17; g++) GALLERY.push('assets/images/gallery/gallery-' + pad2(g));

  var GALLERY_WINDOW = 6;
  var galleryCurrent = 0;
  var galleryStart = 0;
  var galleryMobile = window.matchMedia('(max-width: 1000px)');

  $('#glGrid').html($.map(GALLERY, function (path, i) {
    return '<button type="button" class="gl__item" data-g="' + i + '">' +
      '<img src="' + path + '-sm.webp" width="800" height="600" loading="lazy" decoding="async" alt="Ganga Legends County — image ' + (i + 1) + '">' +
      '<span class="gl__no">' + pad2(i + 1) + '</span><span class="gl__zoom" aria-hidden="true">&#8599;</span></button>';
  }).join(''));

  var $galleryItems = $('#glGrid .gl__item');

  function gallerySet(i) {
    galleryCurrent = (i + GALLERY.length) % GALLERY.length;

    // Shift the visible window so the current item stays inside it
    if (galleryCurrent < galleryStart || galleryCurrent >= galleryStart + GALLERY_WINDOW) {
      galleryStart = Math.min(
        Math.max(0, galleryCurrent - (galleryCurrent < galleryStart ? 0 : GALLERY_WINDOW - 1)),
        GALLERY.length - GALLERY_WINDOW
      );
    }

    $galleryItems.removeClass('is-on is-in').slice(galleryStart, galleryStart + GALLERY_WINDOW).addClass('is-in');
    $galleryItems.eq(galleryCurrent).addClass('is-on');
    $('#glNo').text(pad2(galleryCurrent + 1));
    $('#glBar').css('width', ((galleryCurrent + 1) / GALLERY.length * 100) + '%');
  }

  gallerySet(0);

  $('[data-gl]').on('click', function () {
    var step = +$(this).data('gl');
    if (galleryMobile.matches) {
      var grid = $('#glGrid')[0];
      grid.scrollBy({ left: step * grid.clientWidth * .8, behavior: 'smooth' });
    }
    gallerySet(galleryCurrent + step);
  });

  $('#glGrid').on('mouseenter', '.gl__item', function () {
    if (!galleryMobile.matches) gallerySet(+$(this).data('g'));
  });

  $('#glGrid').on('click', '.gl__item', function () {
    lightboxOpen($.map(GALLERY, function (path, i) {
      return { src: path + '-lg.webp', title: 'Ganga Legends County · ' + (i + 1) + ' / ' + GALLERY.length };
    }), +$(this).data('g'));
  });

  /* =====================================================================
     LEAD POPUP
     ===================================================================== */
  var $modal = $('#leadModal');
  var $modalForm = $modal.find('.lead-form');

  /* Popup heading based on where it was opened from. */
  function modalTitle(source) {
    if (/leav/i.test(source)) return 'Before you go — get the price sheet';
    if (/visit/i.test(source)) return 'Book a site visit';
    if (/cost|price/i.test(source)) return 'Get the price sheet';
    return 'Enquire now';
  }

  function modalOpen(source, config) {
    if ($menu.hasClass('is-open')) menuClose();

    $modalForm.attr('data-source', source || 'Popup Form');
    $('#modalTitle').text(modalTitle(source || ''));
    $('#modalImg').attr('src', imagePath(
      /visit/i.test(source) ? 'amenities-resort-pool' : /cost/i.test(source) ? 'banner-tower-facade' : 'banner-tower-sunset',
      'sm'
    ));
    $modalForm.find('[name=message]').val(config ? 'Interested in ' + config : '');

    $modal.addClass('is-open').attr('aria-hidden', 'false');
    lockScroll();
    store.set('glc_popup_seen', '1', true);

    if (hasGsap && !reduceMotion) {
      gsap.timeline()
        .fromTo('#leadModal .modal__box', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' })
        .fromTo('#leadModal .modal__media > img', { scale: 1.2 }, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
        .fromTo('#leadModal .modal__body > *', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .07, ease: 'power3.out' }, .25);
    }
  }

  function modalClose() {
    $modal.removeClass('is-open').attr('aria-hidden', 'true');
    if (!$lightbox.hasClass('is-open')) unlockScroll();
  }

  $doc.on('click', '[data-enquire]', function (e) {
    e.preventDefault();
    modalOpen($(this).attr('data-enquire'), $(this).attr('data-config'));
  });
  $modal.on('click', '[data-close]', modalClose);

  // Escape closes the top-most layer
  $doc.on('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($lightbox.hasClass('is-open')) lightboxClose();
    else if ($modal.hasClass('is-open')) modalClose();
    else if ($menu.hasClass('is-open')) menuClose();
  });

  /* Auto popup: once per session, never for existing leads —
     exit-intent on desktop, 55% scroll depth on touch. */
  function canAutoPopup() {
    return !isLead() &&
      !store.get('glc_popup_seen', true) &&
      !$modal.hasClass('is-open') &&
      !$menu.hasClass('is-open') &&
      !$lightbox.hasClass('is-open');
  }

  $doc.on('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 0 && window.scrollY > 300 && canAutoPopup()) modalOpen('Leaving — Exit Intent');
  });

  if (window.matchMedia('(hover: none)').matches) {
    var depthPopup = function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable > .55 && canAutoPopup()) {
        modalOpen('Scroll Depth Popup');
        $win.off('scroll', depthPopup);
      }
    };
    $win.on('scroll', depthPopup);
  }

  /* Forms → PHP mailer → thank-you page: see lead-form.js */

  $win.on('load', function () {
    if (hasGsap) ScrollTrigger.refresh();
  });
})(jQuery);
