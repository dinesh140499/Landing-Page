/* =========================================================================
   RUNWAL THE CENTRAL PARK — interactions (jQuery + Lenis + GSAP)
   ========================================================================= */
(function ($) {
  'use strict';

  var site = window.SITE;
  var contact = site.contact;
  var $win = $(window);
  var $doc = $(document);
  var $body = $('body');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  // Shared storage helper from lead-form.js (loaded before this file).
  var store = window.LeadForm.store;

  /* ---------- Image paths ---------- */
  // Image name prefix → folder, e.g. 'amenities-skydeck' → assets/images/amenities/
  var IMAGE_DIRS = {
    banner: 'banner',
    overview: 'overview',
    residences: 'residences',
    amenities: 'amenities',
    gallery: 'gallery',
    location: 'location',
    brand: 'brand',
    icon: 'icons'
  };

  /* Path to a .webp image; size is 'sm' or 'lg' (default). */
  function imagePath(name, size) {
    return 'assets/images/' + IMAGE_DIRS[name.split('-')[0]] + '/' + name + '-' + (size || 'lg') + '.webp';
  }

  function isLead() {
    return store.get('tcp_lead') === '1';
  }

  /* Ignore the "play() was interrupted" promise rejection. */
  function playQuietly(video) {
    var promise = video.play();
    if (promise && promise.catch) promise.catch(function () {});
  }

  /* =====================================================================
     SMOOTH SCROLL
     ===================================================================== */
  var lenis = null;

  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });

    if (hasGsap) {
      gsap.registerPlugin(ScrollTrigger);
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
  } else if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function lockScroll() {
    if (lenis) lenis.stop();
    else $('html').css('overflow', 'hidden');
  }

  function unlockScroll() {
    if (lenis) lenis.start();
    else $('html').css('overflow', '');
  }

  /* Scroll to an element, leaving room for the header. */
  function goTo(el, instant) {
    if (!el) return;

    var headerHeight = document.getElementById('hd').offsetHeight;
    var y = el.id === 'home' ? 0 : el.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

    if (lenis) {
      lenis.start();
      lenis.scrollTo(y, { immediate: !!instant, force: true, duration: 1.4 });
    } else {
      window.scrollTo({ top: y, behavior: instant ? 'auto' : 'smooth' });
    }
    if (instant) window.scrollTo(0, y);
  }

  /* =====================================================================
     CONTACT SETTINGS → PAGE
     ===================================================================== */
  // IVR only until a WhatsApp number is set.
  if (!contact.whatsapp) {
    $('[data-wa]').closest('li').hide();
    $('[data-wa]').hide();
    $body.addClass('no-wa');
  }

  $('[data-wa]').each(function () {
    if (contact.whatsapp) {
      $(this).attr({
        href: 'https://wa.me/' + contact.whatsapp + '?text=' + encodeURIComponent(contact.whatsappText),
        target: '_blank',
        rel: 'noopener'
      });
    } else {
      $(this).attr('href', '#contact');
    }
  });

  $('[data-tel]').attr('href', contact.phone ? 'tel:' + contact.phone : '#contact');
  if (contact.phoneLabel) $('[data-tel-label]').text(contact.phoneLabel);
  if (contact.cpFirm) $('[data-cp-firm]').text(contact.cpFirm);
  if (contact.cpRera) $('[data-cp-rera]').text(contact.cpRera);
  if (!contact.cpRera) console.warn('[Runwal TCP] Fill cpRera in assets/js/data.js before going live.');

  $('#year').text(new Date().getFullYear());

  // Footer disclaimer "Read more" toggle.
  $('#ftMore').on('click', function () {
    var isOpen = $('#ftDisc').toggleClass('is-open').hasClass('is-open');
    $(this).text(isOpen ? 'Read less' : 'Read more').attr('aria-expanded', isOpen);
    if (hasGsap) ScrollTrigger.refresh();
  });

  /* =====================================================================
     HEADER + FLOATING CONTACT
     ===================================================================== */
  var heroEl = document.getElementById('home');

  function onScroll() {
    var y = window.scrollY;
    // The header scrolls away with the banner and returns as a sticky bar after it.
    var pastHero = y > heroEl.offsetTop + heroEl.offsetHeight - 10;
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var percent = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round(y / maxScroll * 100))) : 0;

    document.documentElement.style.setProperty('--sp', percent);
    $('#toTopPct').text(percent + '%');
    $('#toTop').toggleClass('is-on', y > heroEl.offsetHeight * .8);
    $('#hd').toggleClass('is-fixed', pastHero).toggleClass('is-scrolled', pastHero);
    $body.toggleClass('hd-compact', pastHero);
  }

  if (lenis) lenis.on('scroll', onScroll);
  else $win.on('scroll', onScroll);
  onScroll();

  $('#toTop').on('click', function () { goTo(heroEl); });

  /* =====================================================================
     MENU (circular reveal)
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
  }

  $burger.on('click', function () {
    if ($menu.hasClass('is-open')) menuClose();
    else menuOpen();
  });

  $menu.on('click', '.menu__links a', function (e) {
    e.preventDefault();
    var el = document.querySelector($(this).attr('href'));
    menuClose();
    goTo(el, true);
  });

  // Hovering a menu link swaps the preview image (fade out, swap, fade in).
  $menu.on('mouseenter', '.menu__links a', function () {
    var $img = $('#menuImg img');
    var src = imagePath($(this).data('img'), 'sm');
    if ($img.attr('src') === src) return;

    $img.addClass('is-out');
    setTimeout(function () { $img.attr('src', src).removeClass('is-out'); }, 280);
  });

  // In-page anchor links scroll smoothly (menu links are handled above).
  $doc.on('click', 'a[href^="#"]:not([data-wa]):not([data-tel])', function (e) {
    var hash = $(this).attr('href');
    if (hash.length < 2 || $(this).closest('.menu').length) return;

    var el = document.querySelector(hash);
    if (!el) return;

    e.preventDefault();
    goTo(el);
  });

  // Highlight the menu link of the section currently in view.
  var sections = ['home', 'overview', 'residences', 'amenities', 'gallery', 'location'].map(function (id) {
    return document.getElementById(id);
  });

  setInterval(function () {
    var current = 0;
    sections.forEach(function (section, i) {
      if (section.getBoundingClientRect().top < window.innerHeight * .4) current = i;
    });
    $menu.find('.menu__links a').removeClass('is-current').eq(current).addClass('is-current');
  }, 500);

  /* =====================================================================
     HERO SLIDER
     ===================================================================== */
  var $slides = $('#heroSlides .hero__slide');
  var heroIndex = 0;
  var heroTimer;

  $('#heroDots').html($slides.map(function (i) {
    var label = $(this).data('label');
    return '<button class="hero__dot' + (i ? '' : ' is-on') + '" data-i="' + i + '" aria-label="' + label + '"><span>' + label + '</span><i></i></button>';
  }).get().join(''));

  /* Slides after the first are lazy: copy data-src/data-srcset in when needed. */
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
    $('#heroDots .hero__dot').removeClass('is-on').eq(i).addClass('is-on');
    $('#heroDisc').text($slides.eq(i).data('disc'));

    heroIndex = i;
    heroAutoplay();
  }

  function heroAutoplay() {
    clearTimeout(heroTimer);
    if (!reduceMotion) heroTimer = setTimeout(function () { heroGo(heroIndex + 1); }, 6500);
  }

  $('#heroDots').on('click', '.hero__dot', function () { heroGo(+$(this).data('i')); });
  $win.on('load', function () { heroLoad(1); });
  heroAutoplay();

  /* =====================================================================
     RESIDENCES: plan viewer
     ===================================================================== */
  var residenceIndex = 0;

  /* 1314 → "1,314"; text ranges are returned as-is. */
  function formatArea(area) {
    return typeof area === 'number' ? area.toLocaleString('en-IN') : area;
  }

  $('#rvList').html($.map(site.residences, function (residence, i) {
    var bhk = residence.tab.replace(' BHK', '');
    return '<button class="rx__tab' + (i ? '' : ' is-on') + '" data-i="' + i + '" role="tab"><b>' + bhk + '</b><span>BHK<small>' + formatArea(residence.area) + ' sq ft</small></span></button>';
  }).join(''));

  function showResidence(i, instant) {
    residenceIndex = i;
    var residence = site.residences[i];
    var config = residence.tab + ' — ' + residence.area + ' sq ft';

    // Activate the tab and scroll it into view when the list overflows (mobile).
    var $tab = $('#rvList .rx__tab').removeClass('is-on').eq(i).addClass('is-on');
    var list = $('#rvList')[0];
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: $tab[0].offsetLeft - 16, behavior: instant ? 'auto' : 'smooth' });
    }

    $('#rvImg').attr({
      src: imagePath(residence.img, 'sm'),
      srcset: imagePath(residence.img, 'sm') + ' 760w, ' + imagePath(residence.img, 'lg') + ' 1400w',
      sizes: '(max-width: 1100px) 92vw, 50vw',
      alt: residence.tab + ' floor plan, ' + residence.area + ' sq ft RERA carpet — Runwal The Central Park'
    });
    $('#rxTwr').text(residence.tower + ' · Residence 0' + (i + 1));
    $('#rxType').text(residence.tab);
    $('#rxArea').text(formatArea(residence.area));
    $('#rxSqm').text(residence.sqm + ' sq m');

    // Price per floor band, or "on request" when there are no bands.
    $('#rvBands').html(!residence.bands
      ? '<li><span>All floors</span><i></i><b>Price on request</b></li>'
      : ['G – 10', '11 – 20', '21 – 30'].map(function (band, k) {
        return '<li><span>Floors ' + band + '</span><i></i><b>₹' + residence.bands[k] + ' Cr</b></li>';
      }).join(''));

    $('#rvUnlock').attr({ 'data-enquire': 'Unlock Plan — ' + residence.tab, 'data-config': config });
    $('#rvCost').attr({ 'data-enquire': 'Cost Sheet — ' + residence.tab, 'data-config': config });
    $('#rvView').addClass('is-locked'); /* floor plans always stay blurred */

    if (hasGsap && !reduceMotion && !instant) {
      gsap.fromTo('#rvImg',
        { clipPath: 'inset(0 0 0 100%)', scale: 1.08 },
        { clipPath: 'inset(0 0 0 0%)', scale: 1, duration: .9, ease: 'power3.inOut' });
      gsap.from('#rxType, .rx__area, #rvBands li', { y: 18, opacity: 0, duration: .55, stagger: .06, ease: 'power3.out' });
    }
  }

  $('#rvList').on('click', '.rx__tab', function () {
    var i = +$(this).data('i');
    if (i !== residenceIndex) showResidence(i);
  });
  showResidence(0, true);

  /* =====================================================================
     AMENITIES: lift ride (G -> Club -> 45th-floor Skydeck)
     ===================================================================== */
  // Each stop shows three amenities (indexes into site.amenities).
  var LIFT_STOPS = [
    { floor: 0, label: 'G', name: 'Greens & Arrival', items: [7, 8, 2] },
    { floor: 1, label: 'C', name: 'The Grand Club', items: [0, 1, 3] },
    { floor: 45, label: '45', name: 'The Skydeck', items: [4, 5, 6] }
  ];
  var liftStop = 0;        // current stop (index into LIFT_STOPS)
  var liftAmenity = -1;    // amenity on screen (index into site.amenities)
  var liftRiding = false;
  var $lift = $('#lift');
  var $liftView = $('#liftView');

  /* Move the little car in the shaft next to the stop's button. */
  function liftCarTo(stop, instant) {
    var button = $('#liftBtns button[data-z="' + stop + '"]')[0];
    if (!button) return;

    $('#liftCar').css({
      transition: instant ? 'none' : '',
      transform: 'translateY(' + (button.offsetTop + button.offsetHeight / 2 - 9) + 'px)'
    });
  }

  /* Cross-fade to an amenity image and update the caption. */
  function liftShow(k, instant) {
    if (k === liftAmenity) return;
    liftAmenity = k;
    var amenity = site.amenities[k];

    var $image = $('<img alt="">').attr({
      src: imagePath(amenity.img, 'lg'),
      alt: amenity.title + ' at Runwal The Central Park',
      decoding: 'async'
    }).appendTo('#liftImgs');

    if (instant || reduceMotion) {
      $image.addClass('is-on').prevAll().remove();
    } else {
      // Two frames so the transition starts from the hidden state.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { $image.addClass('is-on'); });
      });
      setTimeout(function () { $image.prevAll().remove(); }, 900);
    }

    $('#liftCap').html('<small>' + amenity.line + '</small><b>' + amenity.title + '</b><span>' + amenity.note + '</span>');
    $('#liftThumbs button').removeClass('is-on').filter('[data-k="' + k + '"]').addClass('is-on');
  }

  /* Build the thumbnails for a stop and show its first amenity. */
  function liftFloor(stop) {
    var liftStopData = LIFT_STOPS[stop];

    $('#liftThumbs').html($.map(liftStopData.items, function (k) {
      var amenity = site.amenities[k];
      return '<button type="button" data-k="' + k + '"><img src="' + imagePath(amenity.img, 'sm') + '" width="800" height="450" loading="lazy" decoding="async" alt=""><span>' + amenity.title + '</span></button>';
    }).join(''));

    liftAmenity = -1;
    liftShow(liftStopData.items[0], true);
    $('#liftZone').text(liftStopData.name);
  }

  /* Doors close, the floor counter runs, then a "ding" and the doors open. */
  function liftRide(stop) {
    if (liftRiding || stop === liftStop) return;
    liftRiding = true;

    var fromFloor = LIFT_STOPS[liftStop].floor;
    var toFloor = LIFT_STOPS[stop].floor;
    var goingUp = toFloor > fromFloor;
    var startTime = null;
    var duration = reduceMotion ? 0 : 1500;

    $('#liftBtns button').removeClass('is-on').filter('[data-z="' + stop + '"]').addClass('is-on');
    $('#liftDir').html(goingUp ? '&#9650;' : '&#9660;');
    $lift.addClass('is-riding');
    $liftView.addClass('is-closed');
    liftCarTo(stop);

    setTimeout(function () {
      liftFloor(stop);

      requestAnimationFrame(function step(time) {
        if (!startTime) startTime = time;
        var progress = duration ? Math.min(1, (time - startTime) / duration) : 1;
        // ease-in-out (quad)
        var eased = progress < .5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        var floor = Math.round(fromFloor + (toFloor - fromFloor) * eased);

        $('#liftNo').text(progress < 1 ? (floor === 0 ? 'G' : (floor < 10 ? '0' : '') + floor) : LIFT_STOPS[stop].label);
        if (progress < 1) return requestAnimationFrame(step);

        liftStop = stop;
        $lift.removeClass('is-riding').addClass('is-ding');
        setTimeout(function () {
          $liftView.removeClass('is-closed');
          $lift.removeClass('is-ding');
          liftRiding = false;
        }, reduceMotion ? 0 : 350);
      });
    }, reduceMotion ? 0 : 650);
  }

  $('#liftBtns').on('click', 'button', function () { liftRide(+$(this).data('z')); });
  $('#liftThumbs').on('click', 'button', function () { liftShow(+$(this).data('k')); });
  $liftView.on('click', '#liftImgs img', function () {
    lightboxOpen($.map(site.amenities, function (amenity) {
      return { src: imagePath(amenity.img, 'lg'), title: amenity.title };
    }), liftAmenity);
  });

  liftFloor(0);
  liftCarTo(0, true);
  $win.on('resize load', function () { liftCarTo(liftStop, true); });

  // Doors start closed and open with a "ding" when the lift comes into view.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    $liftView.addClass('is-closed');

    var liftObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      liftObserver.disconnect();
      $lift.addClass('is-ding');
      setTimeout(function () {
        $liftView.removeClass('is-closed');
        $lift.removeClass('is-ding');
      }, 700);
    }, { threshold: .45 });

    liftObserver.observe($liftView[0]);
  }

  /* =====================================================================
     FILM: ambient loop (lazy, plays only in view) + full film with sound
     ===================================================================== */
  (function () {
    var bgVideo = document.getElementById('filmBg');
    var filmVideo = document.getElementById('filmVideo');
    var $filmModal = $('#filmModal');

    if (bgVideo && !reduceMotion && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (!bgVideo.src) bgVideo.src = bgVideo.getAttribute('data-src');
          playQuietly(bgVideo);
        } else if (bgVideo.src) {
          bgVideo.pause();
        }
      }, { rootMargin: '200px 0px' }).observe(bgVideo);
    }

    // Not called at the moment: the play button opens the lead popup instead.
    function filmOpen() {
      if (!filmVideo.src) filmVideo.src = filmVideo.getAttribute('data-src');
      $filmModal.addClass('is-open').attr('aria-hidden', 'false');
      lockScroll();
      if (bgVideo) bgVideo.pause();
      filmVideo.currentTime = 0;
      playQuietly(filmVideo);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'film_play' });
    }

    function filmClose() {
      filmVideo.pause();
      $filmModal.removeClass('is-open').attr('aria-hidden', 'true');
      unlockScroll();
    }

    $('#filmPlay').on('click', function () { modalOpen('Film — Play Video'); });

    $filmModal
      .on('click', '[data-film-close]', filmClose)
      .on('click', function (e) { if (e.target === this) filmClose(); });

    $doc.on('keydown', function (e) {
      if (e.key === 'Escape' && $filmModal.hasClass('is-open')) filmClose();
    });

    $(filmVideo).on('ended', function () {
      filmClose();
      modalOpen('Film — Watched Till End');
    });
  })();

  /* =====================================================================
     GALLERY: twin marquee
     ===================================================================== */
  // Portrait photos get a taller card.
  var TALL_IMAGES = {
    'gallery-residence-bathroom': 1,
    'gallery-residence-kitchen': 1,
    'gallery-residence-reading-corner': 1,
    'gallery-residence-lounge': 1
  };

  function marqueeItem(photo, i) {
    return '<button class="mq__item' + (TALL_IMAGES[photo.img] ? ' is-tall' : '') + '" data-i="' + i + '">' +
      '<img src="' + imagePath(photo.img, 'sm') + '" width="800" height="600" decoding="async" alt="' + photo.title + ' — Runwal The Central Park">' +
      '<b>' + photo.title + '</b>' +
      '<span class="disc">' + (photo.disc || 'Representational Image') + '</span>' +
      '</button>';
  }

  var marqueeRow = site.gallery.map(function (photo, i) { return marqueeItem(photo, i); }).join('');
  $('#mqA').html(marqueeRow + marqueeRow); // two copies = seamless loop; all 9 photos are distinct on screen

  (function () {
    var track = document.getElementById('mqA');
    var offsetX = 0;
    var paused = false;
    var speed = .45;

    $('#mq')
      .on('mouseenter', function () { paused = true; })
      .on('mouseleave', function () { paused = false; });

    function tick() {
      var loopWidth = track.scrollWidth / 2;
      if (!paused && !reduceMotion && loopWidth) {
        offsetX -= speed;
        if (-offsetX >= loopWidth) offsetX += loopWidth;
        track.style.transform = 'translate3d(' + offsetX.toFixed(1) + 'px,0,0)';
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  $('#mq').on('click', '.mq__item', function () {
    lightboxOpen($.map(site.gallery, function (photo) {
      return { src: imagePath(photo.img, 'lg'), title: photo.title };
    }), +$(this).data('i'));
  });

  /* =====================================================================
     LOCATION: category tabs + distance bars
     ===================================================================== */
  var LOCATION_ICONS = {
    'Metro & Rail': 'metro',
    'Work Hubs': 'work',
    'Schools': 'school',
    'Hospitals': 'hospital',
    'Shopping & Leisure': 'shopping'
  };

  $('#locTabs').html($.map(site.location, function (category, i) {
    return '<button type="button" role="tab" data-i="' + i + '"' + (i ? '' : ' class="is-on"') + '><img src="assets/images/icons/icon-' + (LOCATION_ICONS[category.cat] || 'star') + '.webp" width="48" height="48" alt="">' + category.cat + '</button>';
  }).join(''));

  function showLocation(i) {
    $('#locTabs button').removeClass('is-on').eq(i).addClass('is-on');

    var $list = $('#locList').removeClass('is-in');
    $list.html($.map(site.location[i].items, function (item) {
      var km = parseFloat(item[1]);
      var isNumber = !isNaN(km);
      var inTownship = /within/i.test(item[1]);
      // Bar width: 15 km = full bar; words get a short fixed bar.
      var barWidth = isNumber ? Math.max(6, Math.min(100, km / 15 * 100)) : (inTownship ? 3 : 12);
      var distance = isNumber
        ? '<b>' + km + '</b><small>km</small>'
        : '<b class="is-word">' + (inTownship ? 'In' : 'Near') + '</b><small>' + (inTownship ? 'township' : 'by') + '</small>';

      return '<li><span class="lc__d">' + distance + '</span><span class="lc__n">' + item[0] + '<i><s style="--w:' + barWidth + '%"></s></i></span></li>';
    }).join(''));

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { $list.addClass('is-in'); });
    });
    if (hasGsap && !reduceMotion) gsap.from('#locList li', { x: -20, opacity: 0, duration: .5, stagger: .06, ease: 'power3.out' });
  }

  $('#locTabs').on('click', 'button', function () { showLocation(+$(this).data('i')); });
  showLocation(0);

  /* =====================================================================
     HIGHLIGHTS: point list swaps the feature image
     ===================================================================== */
  $('#hlpList').on('mouseenter focusin click', '.hlp__i', function () {
    var i = +$(this).data('i');
    $(this).addClass('is-on').siblings().removeClass('is-on');
    $('#highlights .hlp__img').removeClass('is-on').eq(i).addClass('is-on');
  });

  /* =====================================================================
     REVEAL + COUNTERS
     ===================================================================== */
  /* Count up from 0 to data-count (ease-out cubic, 1.6 s). */
  function countUp(el) {
    var target = +el.getAttribute('data-count');
    var startTime = null;

    if (reduceMotion) {
      el.textContent = target;
      return;
    }

    requestAnimationFrame(function step(time) {
      if (!startTime) startTime = time;
      var progress = Math.min(1, (time - startTime) / 1600);
      el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(step);
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
    }, { threshold: .15 });

    $('[data-rv], [data-count]').each(function () { revealObserver.observe(this); });
  } else {
    $('[data-rv]').addClass('is-in');
    $('[data-count]').each(function () { this.textContent = this.getAttribute('data-count'); });
  }

  /* =====================================================================
     GSAP: hero entrance
     ===================================================================== */
  if (hasGsap && !reduceMotion) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero__frame', { x: -30, opacity: 0, duration: 1.1 })
      .from('.hero__badge, .hero__brand, .hero h1, .hero__price, .hero__keys li, .hero__cta', { y: 24, opacity: 0, duration: .7, stagger: .06 }, .3)
      .from('.hero__dots', { opacity: 0, x: 20, duration: .8 }, .8);
  }

  /* =====================================================================
     LIGHTBOX
     ===================================================================== */
  var $lightbox = $('#lb');
  var lightboxItems = [];
  var lightboxIndex = 0;

  function lightboxShow(i) {
    lightboxIndex = (i + lightboxItems.length) % lightboxItems.length;
    var item = lightboxItems[lightboxIndex];

    $('#lbImg').attr({ src: item.src, alt: item.title });
    $('#lbCap').text(item.title);
    $lightbox.find('.lb__nav').toggle(lightboxItems.length > 1);
  }

  /* items: [{ src, title }] */
  function lightboxOpen(items, i) {
    lightboxItems = items;
    $lightbox.addClass('is-open').attr('aria-hidden', 'false');
    lockScroll();
    lightboxShow(i || 0);
  }

  function lightboxClose() {
    $lightbox.removeClass('is-open').attr('aria-hidden', 'true');
    if (!$('#leadModal').hasClass('is-open')) unlockScroll();
  }

  $doc.on('click', '[data-lightbox]', function () {
    lightboxOpen([{ src: imagePath($(this).data('lightbox'), 'lg'), title: $(this).data('title') }], 0);
  });

  $lightbox
    .on('click', '[data-lb-close]', lightboxClose)
    .on('click', '[data-lb-prev]', function () { lightboxShow(lightboxIndex - 1); })
    .on('click', '[data-lb-next]', function () { lightboxShow(lightboxIndex + 1); })
    .on('click', function (e) { if (e.target === this) lightboxClose(); });

  /* =====================================================================
     LEAD POPUP
     ===================================================================== */
  var $modal = $('#leadModal');
  var $modalForm = $modal.find('.lead-form');

  /* Popup heading based on what the visitor clicked. */
  function modalTitleFor(source) {
    if (/leav/i.test(source)) return 'Before you go — get the price sheet';
    if (/visit/i.test(source)) return 'Book a site visit';
    if (/amenit/i.test(source)) return 'Get the 50+ amenities list';
    if (/layout/i.test(source)) return 'Get the master layout';
    if (/brochure|list/i.test(source)) return 'Download the brochure';
    if (/unlock|plan/i.test(source)) return 'Unlock floor plans';
    if (/cost|price/i.test(source)) return 'Get the price sheet';
    return 'Enquire now';
  }

  /* Popup side image based on what the visitor clicked. */
  function modalImageFor(source) {
    if (/visit/i.test(source)) return 'overview-central-greens-view';
    if (/unlock|plan/i.test(source)) return 'gallery-residence-living-room';
    if (/cost|price|leav/i.test(source)) return 'banner-towers-daylight';
    return 'amenities-skydeck';
  }

  /* source → the form's data-source; config (optional) pre-fills the message. */
  function modalOpen(source, config) {
    if ($menu.hasClass('is-open')) menuClose();

    $modalForm.attr('data-source', source || 'Popup Form');
    $('#modalTitle').text(modalTitleFor(source || ''));
    $('#modalImg').attr('src', imagePath(modalImageFor(source), 'sm'));
    $modalForm.find('[name=message]').val(config ? 'Interested in ' + config : '');

    $modal.addClass('is-open').attr('aria-hidden', 'false');
    lockScroll();
    store.set('tcp_popup_seen', '1', true);

    if (hasGsap && !reduceMotion) {
      gsap.timeline()
        .fromTo('#leadModal .modal__box',
          { clipPath: 'inset(0 50% 0 50% round 24px)' },
          { clipPath: 'inset(0 0% 0 0% round 24px)', duration: .8, ease: 'power3.inOut' })
        .fromTo('#leadModal .modal__media img',
          { scale: 1.2 },
          { scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
        .fromTo('#leadModal .modal__body > *',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: .5, stagger: .07, ease: 'power3.out' }, .35);
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

  // Escape closes the top-most layer.
  $doc.on('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($lightbox.hasClass('is-open')) lightboxClose();
    else if ($modal.hasClass('is-open')) modalClose();
    else if ($menu.hasClass('is-open')) menuClose();
  });

  /* Smart popup: once per session, never for existing leads,
     and never on top of another layer. */
  function canAutoPopup() {
    return !isLead() &&
      !store.get('tcp_popup_seen', true) &&
      !$modal.hasClass('is-open') &&
      !$menu.hasClass('is-open') &&
      !$lightbox.hasClass('is-open');
  }

  // Desktop: exit intent (mouse leaves through the top of the window).
  $doc.on('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 0 && window.scrollY > 300 && canAutoPopup()) modalOpen('Leaving — Exit Intent');
  });

  // Touch devices: after 55% scroll depth.
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

  $win.on('load', function () { if (hasGsap) ScrollTrigger.refresh(); });
})(jQuery);
