/* =========================================================================
   THE ARENA, PIMPRI — data + interactions (jQuery + GSAP)
   Sources: project opportunity document, A3 sales brochure, campaign creatives
   ========================================================================= */
(function ($) {
  'use strict';

  /* =====================================================================
     SETTINGS — check before going live
     ===================================================================== */
  var SETTINGS = {
    phone: '+919126264444',                    // IVR — same as other project sites
    phoneLabel: '+91 91262 64444',
    rera: ''                                   // MahaRERA no. — fill in when issued (shown in footer)
  };
  var IMG = 'assets/images/';

  /* =====================================================================
     DATA
     ===================================================================== */

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

  /* Amenity groups: [image file name, label] */
  var SPORTS = [
    { title: 'Play', items: [['open-air-courts', 'Open-air courts'], ['racquet-courts', 'Indoor racquet courts'], ['gym', 'Expansive gym floor'], ['cue-lounge', 'Cue sports lounge'], ['sports-bar', 'Premium sports bar']] },
    { title: 'Recover', items: [['jacuzzi-deck', 'Jacuzzi & wet leisure deck'], ['steam-sauna', 'Steam, sauna & recovery'], ['cafe-lounge', 'Café lounges']] },
    { title: 'Learn & Work', items: [['early-learning', 'Early learning centre'], ['co-working', 'Co-working spaces'], ['cafe-lounge', 'Café lounges']] }
  ];

  /* Gallery: [image file name, caption] */
  var GALLERY = [
    ['r-revised-view-01', 'The township'], ['r-9', 'Lake edge'], ['r-6', 'Elevated walkway'], ['rooftop-pool', 'Rooftop pool'],
    ['r-8', 'Amphitheatre deck'], ['r-3', 'Water body at dusk'], ['r-4', 'Jogging track'], ['r-11', 'Sculpted pavilion'], ['r-2a', 'Landscaped park']
  ];

  /* Location tabs: [place, distance in km] */
  var LOCATIONS = [
    { title: 'Connectivity', items: [['Pune Metro Line 1', '2.4'], ['Chinchwad Railway Station', '2.5'], ['Pimpri Railway Station', '3.5'], ['Pune Railway Station', '17.2'], ['Pune International Airport', '20.4']] },
    { title: 'Workplaces', items: [['KWT (Kohinoor World Towers)', '2'], ['Chakan MIDC', '3.4'], ['MIDC Pimpri–Chinchwad', '4.4'], ['Bhosari Industrial Area', '7.8'], ['Hinjewadi IT Park', '9.9']] },
    { title: 'Education', items: [['Podar International School', '3.8'], ['St. Ursula High School', '4'], ['City Pride School', '4.5'], ['SNBP International School', '4.7'], ['D. Y. Patil International University', '5.7']] },
    { title: 'Healthcare', items: [['Aditya Birla Memorial Hospital', '4.1'], ['Lokmanya Hospital', '5'], ['Sterling Multispecialty Hospital', '5'], ['Dr. D.Y. Patil Hospital', '5.9'], ['Ruby Hall Clinic, Hinjewadi', '11.4']] }
  ];

  /* =====================================================================
     HELPERS
     ===================================================================== */
  var $win = $(window);
  var $doc = $(document);
  var $html = $('html');

  /* Safe local/session storage — shared with lead-form.js (loaded first). */
  var store = window.LeadForm.store;

  /* Escape text for use inside HTML strings. */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* "7" → "07" for one-digit counters */
  function twoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /* =====================================================================
     SMOOTH SCROLLING (Lenis, synced with GSAP ScrollTrigger)
     ===================================================================== */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;

  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      })();
    }
  }

  /* Stop / restart page scrolling while an overlay is open. */
  function lockScroll() {
    if (lenis) lenis.stop();
    else $html.css('overflow', 'hidden');
  }
  function unlockScroll() {
    if (lenis) lenis.start();
    else $html.css('overflow', '');
  }

  function headerOffset() {
    var header = document.getElementById('hd');
    return header ? header.offsetHeight : 0;
  }

  /* In-page anchor links: close the menu, then scroll below the fixed header. */
  $(document).on('click', 'a[href^="#"]', function (e) {
    var id = this.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    if ($('#menu').hasClass('is-open')) menuClose();

    if (lenis) {
      lenis.scrollTo(target, { offset: -headerOffset(), duration: 1.3 });
    } else {
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - headerOffset(),
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }
    history.replaceState(null, '', id);
  });

  /* =====================================================================
     CONTACT DETAILS + FOOTER
     ===================================================================== */
  $('[data-tel]').attr('href', 'tel:' + SETTINGS.phone);
  if (SETTINGS.rera) $('[data-rera]').text(SETTINGS.rera);
  $('#year').text(new Date().getFullYear());

  /* =====================================================================
     MENU
     ===================================================================== */
  var $menu = $('#menu');
  var $burger = $('#burger');

  function menuClose() {
    $menu.removeClass('is-open').attr('aria-hidden', 'true');
    $burger.attr('aria-expanded', 'false');
    unlockScroll();
  }

  $burger.on('click', function () {
    var open = !$menu.hasClass('is-open');
    $menu.toggleClass('is-open', open).attr('aria-hidden', String(!open));
    $burger.attr('aria-expanded', String(open));
    if (open) lockScroll();
    else unlockScroll();
  });
  $menu.on('click', 'a', menuClose);

  /* =====================================================================
     HERO — typology text + slider
     ===================================================================== */

  // "2, 3 & 4 BHK"
  $('#heroTypes').text(
    $.map(CONFIGS, function (c) { return c.type.replace(/\s*BHK/i, ''); })
      .join(', ')
      .replace(/, ([^,]*)$/, ' & $1') + ' BHK'
  );

  var $heroSlides = $('#heroSlides img');
  var heroIndex = 0;

  $('#heroDots').html($heroSlides.map(function (i) {
    return '<button type="button" aria-label="Slide ' + (i + 1) + '"' + (i ? '' : ' class="is-on"') + '></button>';
  }).get().join(''));

  function heroGo(i) {
    heroIndex = (i + $heroSlides.length) % $heroSlides.length;
    var img = $heroSlides[heroIndex];

    // Slides after the first are lazy: swap in their real source on first show.
    if (img.dataset.src) {
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
      }
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    $heroSlides.removeClass('is-on').eq(heroIndex).addClass('is-on');
    $('#heroDots button').removeClass('is-on').eq(heroIndex).addClass('is-on');
  }

  $('#heroDots').on('click', 'button', function () { heroGo($(this).index()); });
  setInterval(function () {
    if (!document.hidden) heroGo(heroIndex + 1);
  }, 5500);

  /* =====================================================================
     FILM (portrait reel) — play only while on screen
     ===================================================================== */
  var video = document.getElementById('vdPlayer');
  if (video && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (video.preload === 'none') {
            video.preload = 'auto';
            video.load();
          }
          var playing = video.play();
          if (playing && playing.catch) playing.catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: .35 }).observe(video);
  }

  /* =====================================================================
     HEADER — solid background once scrolled
     ===================================================================== */
  var headerEl = document.getElementById('hd');
  function headerSolid() {
    headerEl.classList.toggle('is-solid', window.scrollY > 40 || $('#menu').hasClass('is-open'));
  }
  $win.on('scroll', headerSolid);
  headerSolid();
  $('[data-tel-label]').text(SETTINGS.phoneLabel);

  /* =====================================================================
     PRICE LIST + FLOOR PLANS (+ master plan / floor plate tabs)
     ===================================================================== */
  $('#prList').html($.map(CONFIGS, function (c) {
    return '<div class="prr"><b>' + esc(c.type) + '</b><span><strong>' + esc(c.area) + '</strong> sq. ft. RERA carpet</span><em>Price on request</em><button type="button" class="btn btn--violet" data-enquire="Price — ' + esc(c.type) + '">Check Price</button></div>';
  }).join(''));

  var planList = PLANS;
  var planIndex = 0;

  $('#fpTabs').html(
    '<button type="button" class="tab is-on" data-f="">All</button>' +
    $.map(CONFIGS, function (c) {
      var bhk = c.type.charAt(0);
      return '<button type="button" class="tab" data-f="' + bhk + '">' + esc(c.type) + '</button>';
    }).join('') +
    '<button type="button" class="tab" data-site="master-plan">Master plan</button><button type="button" class="tab" data-site="typical-floor">Floor plate</button>'
  );

  function planRender() {
    var plan = planList[planIndex];
    $('#fpView').html(
      '<button type="button" class="fp__img" data-enquire="Floor Plan — ' + esc(plan.name) + ' ' + plan.area + '"><img src="' + IMG + 'plans/' + plan.id + '.webp" width="720" height="450" alt="' + esc(plan.name) + ' floor plan preview"><span class="fp__lock">View ' + esc(plan.name) + ' plan</span></button>' +
      '<div class="fp__body"><div><h3>' + esc(plan.name) + '</h3><p><b>' + plan.area + '</b> sq. ft. RERA carpet · Plan ' + (planIndex + 1) + ' / ' + planList.length + '</p></div><div class="fp__nav"><button type="button" data-fp="-1" aria-label="Previous plan">&#8592;</button><button type="button" data-fp="1" aria-label="Next plan">&#8594;</button></div></div>'
    );
  }

  // Master plan / floor plate tabs show a single site image instead of a unit plan.
  $('#fpTabs').on('click', '[data-site]', function (e) {
    e.stopImmediatePropagation();
    var site = $(this).data('site');
    var title = $(this).text();
    var note = site === 'master-plan'
      ? '11 towers around a central park &amp; water body, with the sports zone on the western edge.'
      : 'Typical floor layout · Tower A2';

    $('#fpTabs .tab').removeClass('is-on');
    $(this).addClass('is-on');
    $('#fpView').html('<button type="button" class="fp__img fp__img--site" data-site-img="' + site + '"><img src="' + IMG + 'plans/' + site + '.webp" alt="' + esc(title) + '"><span class="fp__lock">View full screen</span></button><div class="fp__body"><div><h3>' + esc(title) + '</h3><p>' + note + '</p></div></div>');
  });

  $('#fpView').on('click', '[data-site-img]', function () {
    var $img = $(this).find('img');
    lightboxOpen([{ src: $img.attr('src'), title: $img.attr('alt') }], 0);
  });

  $('#fpTabs').on('click', '.tab[data-f]', function () {
    var filter = $(this).data('f') + '';
    $('#fpTabs .tab').removeClass('is-on');
    $(this).addClass('is-on');
    planList = filter ? $.grep(PLANS, function (p) { return p.bhk === filter; }) : PLANS;
    planIndex = 0;
    planRender();
  });

  $('#fpView').on('click', '[data-fp]', function () {
    planIndex = (planIndex + +$(this).data('fp') + planList.length) % planList.length;
    planRender();
  });
  planRender();

  /* =====================================================================
     AMENITIES — pinned horizontal track
     ===================================================================== */

  // Flatten the groups, skipping repeats (same image file).
  var amenities = [];
  $.each(SPORTS, function (_, group) {
    $.each(group.items, function (_, item) {
      var seen = $.grep(amenities, function (a) { return a[0] === item[0]; }).length;
      if (!seen) amenities.push(item);
    });
  });

  $('#hsTrack').html($.map(amenities, function (a, i) {
    return '<button type="button" class="hs__card' + (i % 3 === 0 ? ' hs__card--w' : '') + '" data-i="' + i + '"><img src="' + IMG + 'amenities/' + a[0] + '-sm.webp" loading="lazy" decoding="async" alt="' + esc(a[1]) + '"><span><i>' + (i < 9 ? '0' : '') + (i + 1) + '</i>' + esc(a[1]) + '</span></button>';
  }).join(''));

  $('#hsTrack').on('click', '.hs__card', function () {
    lightboxOpen($.map(amenities, function (a) {
      return { src: IMG + 'amenities/' + a[0] + '.webp', title: a[1] + ' · Artist\'s impression' };
    }), +$(this).data('i'));
  });

  /* =====================================================================
     SLIDING TAB INDICATOR
     ===================================================================== */
  function tabInk($wrap) {
    var $active = $wrap.find('.tab.is-on');
    if (!$active.length) return;

    var $ink = $wrap.children('.tab-ink');
    if (!$ink.length) $ink = $('<span class="tab-ink"></span>').appendTo($wrap);
    $ink.css({
      left: $active[0].offsetLeft,
      top: $active[0].offsetTop,
      width: $active.outerWidth(),
      height: $active.outerHeight()
    });
  }

  function tabInkAll() {
    $(TAB_WRAPS).each(function () { tabInk($(this)); });
  }

  var TAB_WRAPS = '#fpTabs, #lcTabs';
  $(TAB_WRAPS).addClass('tabs-ink');
  $(document).on('click', '.tabs-ink .tab', function () {
    var $wrap = $(this).closest('.tabs-ink');
    setTimeout(function () { tabInk($wrap); }, 0);
  });
  $win.on('load resize', tabInkAll);
  setTimeout(tabInkAll, 300);

  /* =====================================================================
     GALLERY — card deck
     ===================================================================== */
  var deckOrder = GALLERY.map(function (_, i) { return i; });  // gallery indexes, top card first
  var deckLastMove = Date.now();
  var deckBusy = false;
  var DECK_TILT = [0, -4, 3.5, -2.5, 2, -1.5, 1, -1, .5];

  $('#dkDeck').html($.map(GALLERY, function (g, i) {
    return '<button type="button" class="dk__card" data-i="' + i + '"><img src="' + IMG + 'gallery/' + g[0] + '-sm.webp" ' + (i > 2 ? 'loading="lazy" ' : '') + 'decoding="async" alt="' + esc(g[1]) + '"></button>';
  }).join(''));
  $('#dkTot').text(twoDigits(GALLERY.length));

  function deckLayout() {
    $.each(deckOrder, function (pos, galleryIndex) {
      var $card = $('#dkDeck .dk__card[data-i="' + galleryIndex + '"]');
      $card.css({
        zIndex: GALLERY.length - pos,
        transform: 'translate(' + (pos * 10) + 'px,' + (pos * 8) + 'px) rotate(' + (pos ? DECK_TILT[pos % DECK_TILT.length] : 0) + 'deg) scale(' + (1 - Math.min(pos, 4) * .03) + ')',
        opacity: pos > 4 ? 0 : 1
      }).toggleClass('is-top', pos === 0);
    });

    var top = deckOrder[0];
    $('#dkNo').text((top < 9 ? '0' : '') + (top + 1));
    $('#dkCap').text(GALLERY[top][1]);
  }

  /* dir > 0: throw the top card to the back; otherwise bring the last card to the top. */
  function deckStep(dir) {
    if (deckBusy) return;
    deckBusy = true;
    deckLastMove = Date.now();

    if (dir > 0) {
      var $top = $('#dkDeck .dk__card[data-i="' + deckOrder[0] + '"]').addClass('is-out');
      setTimeout(function () {
        $top.removeClass('is-out');
        deckOrder.push(deckOrder.shift());
        deckLayout();
        deckBusy = false;
      }, 420);
    } else {
      deckOrder.unshift(deckOrder.pop());
      deckLayout();
      setTimeout(function () { deckBusy = false; }, 420);
    }
  }

  deckLayout();
  $('[data-dk]').on('click', function () { deckStep(+$(this).data('dk')); });

  $('#dkDeck').on('click', '.dk__card', function () {
    if ($(this).hasClass('is-top')) {
      lightboxOpen($.map(GALLERY, function (g) {
        return { src: IMG + 'gallery/' + g[0] + '.webp', title: g[1] + ' · Artist\'s impression' };
      }), +$(this).data('i'));
    } else {
      deckStep(1);
    }
  });

  // Swipe left / right on touch screens.
  var deckTouchX = null;
  $('#dkDeck')
    .on('touchstart', function (e) {
      deckTouchX = e.originalEvent.touches[0].clientX;
    })
    .on('touchend', function (e) {
      if (deckTouchX === null) return;
      var delta = e.originalEvent.changedTouches[0].clientX - deckTouchX;
      if (Math.abs(delta) > 40) deckStep(delta < 0 ? 1 : -1);
      deckTouchX = null;
    });

  // Autoplay after 5 s without interaction.
  setInterval(function () {
    if (!document.hidden && Date.now() - deckLastMove > 5000) deckStep(1);
  }, 400);

  /* =====================================================================
     LOCATION
     ===================================================================== */
  $('#lcTabs').html($.map(LOCATIONS, function (l, i) {
    return '<button type="button" class="tab' + (i ? '' : ' is-on') + '" data-i="' + i + '">' + esc(l.title) + '</button>';
  }).join(''));

  function locationShow(i) {
    $('#lcTabs .tab').removeClass('is-on').eq(i).addClass('is-on');
    $('#lcList').html(
      '<li class="route__start"><b>The Arena</b><span>Finolex Chowk, Pimpri</span></li>' +
      $.map(LOCATIONS[i].items, function (place, k) {
        return '<li style="animation-delay:' + (k * .07) + 's"><span>' + esc(place[0]) + '</span><b>' + place[1] + ' <small>km</small></b></li>';
      }).join('')
    );
  }

  $('#lcTabs').on('click', '.tab', function () { locationShow(+$(this).data('i')); });
  locationShow(0);
  $('[data-map]').on('click', function () {
    lightboxOpen([{ src: IMG + 'misc/location-map-clean.webp', title: 'Location map · not to scale' }], 0);
  });

  /* =====================================================================
     SUBTLE EFFECTS — counters + scroll animations
     ===================================================================== */

  /* Count a number up from 0 (ease-out, 1.4 s). Reads data-count/-dec/-pad/-suffix. */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = +(el.dataset.dec || 0);
    var pad = +(el.dataset.pad || 0);
    var suffix = el.dataset.suffix || '';
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min(1, (timestamp - start) / 1400);
      var value = target * (1 - Math.pow(1 - progress, 3));
      var text = decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-IN');

      if (pad) text = String(text).padStart(pad, '0');
      el.textContent = text + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .6 });
    $('[data-count]').each(function () { counterObserver.observe(this); });
  }

  if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger);

    // Image panels open up from a rounded inset.
    $('.ov__side, .fp, .lc__map--d button').each(function () {
      gsap.fromTo(this,
        { clipPath: 'inset(12% 12% 12% 12% round 16px)', opacity: .4 },
        { clipPath: 'inset(0% 0% 0% 0% round 16px)', opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: this, start: 'top 88%' } }
      );
    });

    // Section numbers slide up.
    gsap.utils.toArray('.secno').forEach(function (el) {
      gsap.fromTo(el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }
      );
    });

    // Desktop: pin the amenities section and scroll its track sideways.
    ScrollTrigger.matchMedia({
      '(min-width: 901px)': function () {
        var track = document.getElementById('hsTrack');
        var view = track && track.parentNode;
        if (!track) return;

        var distance = function () { return Math.max(0, track.scrollWidth - view.clientWidth); };
        gsap.to(track, {
          x: function () { return -distance(); },
          ease: 'none',
          scrollTrigger: {
            trigger: '#amenities',
            start: 'top top',
            end: function () { return '+=' + distance(); },
            pin: '.hs__pin',
            scrub: .6,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              var progressBar = document.getElementById('hsProg');
              if (progressBar) progressBar.style.width = (self.progress * 100) + '%';
            }
          }
        });
      }
    });

    $('[data-parallax]').each(function () {
      gsap.fromTo(this,
        { yPercent: -6 },
        { yPercent: 6, ease: 'none', scrollTrigger: { trigger: this.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } }
      );
    });
  }

  /* =====================================================================
     REVEAL ON SCROLL
     ===================================================================== */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    $('[data-rv]').each(function () { revealObserver.observe(this); });
  } else {
    $('[data-rv]').addClass('is-in');
  }

  /* =====================================================================
     LIGHTBOX
     ===================================================================== */
  var $lightbox = $('#lb');
  var lightboxList = [];   // [{ src, title }]
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
    if (!$modal.hasClass('is-open')) unlockScroll();
  }

  $lightbox
    .on('click', '[data-lb-close]', lightboxClose)
    .on('click', '[data-lb-prev]', function () { lightboxShow(lightboxIndex - 1); })
    .on('click', '[data-lb-next]', function () { lightboxShow(lightboxIndex + 1); })
    .on('click', function (e) {
      if (e.target === this) lightboxClose();   // click on the backdrop
    });

  /* =====================================================================
     LEAD MODAL
     ===================================================================== */
  var $modal = $('#leadModal');

  /* Modal heading depends on what was clicked (data-enquire text). */
  function modalTitleFor(source) {
    if (/visit/i.test(source)) return 'Book a site visit';
    if (/plan/i.test(source)) return 'Get the floor plan';
    if (/brochure|list/i.test(source)) return 'Get the brochure';
    if (/price/i.test(source)) return 'Get the price sheet';
    return 'Get pre-launch access';
  }

  function modalOpen(source) {
    $('#modalTitle').text(modalTitleFor(source));
    $modal.find('.lead-form').attr('data-source', source || 'Popup Form');
    $modal.addClass('is-open').attr('aria-hidden', 'false');
    lockScroll();
    store.set('lim_popup_seen', '1', true);
    if ($menu.hasClass('is-open')) menuClose();
  }

  function modalClose() {
    $modal.removeClass('is-open').attr('aria-hidden', 'true');
    if (!$lightbox.hasClass('is-open')) unlockScroll();
  }

  $doc.on('click', '[data-enquire]', function (e) {
    e.preventDefault();
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

  // Auto popup after 20 s — once per session, never after a lead, never over another overlay.
  setTimeout(function () {
    var alreadyLead = store.get('lim_lead') === '1';
    var alreadySeen = store.get('lim_popup_seen', true);
    var overlayOpen = $modal.hasClass('is-open') || $lightbox.hasClass('is-open') || $menu.hasClass('is-open');
    if (!alreadyLead && !alreadySeen && !overlayOpen) modalOpen('Auto Popup');
  }, 20000);

})(jQuery);
