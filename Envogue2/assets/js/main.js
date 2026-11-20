/* =========================================================================
   ENVOGUE 2.0 — Interactions (jQuery + Lenis smooth scroll + GSAP)
   Page content comes from data.js (window.ENVOGUE).
   ========================================================================= */
(function ($) {
  'use strict';

  /* =====================================================================
     SETUP + HELPERS
     ===================================================================== */
  var DATA = window.ENVOGUE;
  var CONTACT = DATA.contact;

  var $win = $(window);
  var $doc = $(document);
  var $body = $('body');
  var $html = $('html');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var viewportHeight = window.innerHeight;

  function isMobile() {
    return window.innerWidth <= 900;
  }

  /* Image folder for each file-name prefix, e.g. "gallery-…" → assets/images/gallery/ */
  var IMG_DIR = {
    banner: 'banner',
    overview: 'overview',
    residences: 'residences',
    amenities: 'amenities',
    gallery: 'gallery',
    location: 'location',
    brand: 'brand',
    pattern: 'patterns',
    icon: 'icons'
  };

  /* Path of a .webp image in the given size ('sm' or 'lg', default 'lg'). */
  function img(name, size) {
    return 'assets/images/' + (IMG_DIR[name.split('-')[0]] || '') + '/' + name + '-' + (size || 'lg') + '.webp';
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /* Two-digit counter text: 3 → "03". */
  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /* Lightbox list ({ src, title }) from data items with an img + title. */
  function photoList(items) {
    return $.map(items, function (item) {
      return { src: img(item.img, 'lg'), title: item.title };
    });
  }

  /* Storage helper shared with lead-form.js (loaded first). */
  var store = (window.LeadForm && window.LeadForm.store) || {
    get: function () { return null; },
    set: function () {}
  };

  /* Has this visitor already submitted a lead form? */
  function isLead() {
    return store.get('envogue_lead') === '1';
  }

  /* =====================================================================
     SMOOTH SCROLL (Lenis)
     ===================================================================== */
  var lenis = null;

  if (!reduceMotion && window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.25,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });

    if (window.gsap && window.ScrollTrigger) {
      // Drive Lenis from GSAP's ticker so ScrollTrigger stays in sync.
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
  }

  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap && !lenis) gsap.registerPlugin(ScrollTrigger);

  /* Block page scrolling while an overlay is open. */
  function lockScroll() {
    if (lenis) lenis.stop();
    else $html.css('overflow', 'hidden');
  }
  function unlockScroll() {
    if (lenis) lenis.start();
    else $html.css('overflow', '');
  }

  function scrollToTarget(target, immediate) {
    var $target = $(target);
    if (!$target.length) return;

    if (lenis) {
      lenis.start();
      lenis.scrollTo($target[0], { offset: 0, immediate: !!immediate, duration: 1.6 });
    } else {
      window.scrollTo({ top: $target.offset().top, behavior: immediate ? 'auto' : 'smooth' });
    }
  }

  /* =====================================================================
     RENDER DYNAMIC SECTIONS
     ===================================================================== */
  function configLabel(residence) {
    return residence.tab + ' — ' + residence.area + ' sq.ft';
  }

  var LOCKED_PRICE_HTML =
    '<span class="vault"><i class="vault__lock" aria-hidden="true">' +
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path class="vault__shackle" d="M8 11V7.5a4 4 0 0 1 8 0V11"/></svg></i>' +
    '<span class="vault__val" aria-hidden="true">₹1.88 Cr*</span></span>';

  /* ---------- Residences: price list (plans unlock after a lead) ---------- */
  function renderPriceList() {
    var lead = isLead();

    $('#plistRows').html($.map(DATA.residences, function (r, i) {
      var config = configLabel(r);

      var planBtn = lead
        ? '<button class="prow__plan" data-lightbox="' + r.img + '" data-title="' + r.name + ' — ' + r.area + ' sq.ft">View Plan</button>'
        : '<button class="prow__plan" data-enquire="Unlock Plan — ' + r.tab + '" data-config="' + config + '">View Plan</button>';

      // Prices written as "₹xxx" in data.js are shown locked ("price on request").
      var price = /x{2,}/i.test(r.price)
        ? '<span class="prow__price prow__price--locked" data-enquire="Price on Request — ' + r.tab + '" data-config="' + config + '" role="button" tabindex="0" aria-label="Unlock price for ' + r.tab + '">' + LOCKED_PRICE_HTML + '</span>'
        : '<span class="prow__price">' + r.price + '</span>';

      return '<div class="prow" data-i="' + i + '">' +
        '<span class="prow__no">0' + (i + 1) + '</span>' +
        '<span class="prow__type">' + r.tab + '</span>' +
        '<span class="prow__area">' + r.area.toLocaleString('en-IN') + ' <small>sq.ft</small></span>' +
        '<span class="prow__wing">' + r.wing + '</span>' +
        price +
        '<span class="prow__act">' + planBtn +
          '<button class="prow__cost" data-enquire="Cost Sheet — ' + r.tab + '" data-config="' + config + '">Cost Sheet <i aria-hidden="true">→</i></button>' +
        '</span>' +
      '</div>';
    }).join(''));

    $('#plistFloat').toggleClass('is-locked', !lead);
  }
  renderPriceList();

  /* ---------- Amenities: 3D coverflow cards ---------- */
  $('#cflow').html($.map(DATA.amenities, function (a, i) {
    return '<button class="cfc" data-i="' + i + '" aria-label="' + a.title + '">' +
      '<img src="' + img(a.img, 'sm') + '" srcset="' + img(a.img, 'sm') + ' 800w, ' + img(a.img, 'lg') + ' 1600w" sizes="(max-width: 900px) 80vw, 46vw" width="1600" height="800" loading="lazy" decoding="async" alt="' + a.title + ' at Envogue 2.0, Akurdi">' +
      '<span class="cfc__txt"><small>' + pad(i + 1) + '</small><b>' + a.title + '</b></span></button>';
  }).join(''));
  $('#cfTot').text(pad(DATA.amenities.length));

  /* ---------- Location: category tabs with icons ---------- */
  var LOCATION_ICONS = {
    'Metro & Rail': 'icon-metro',
    'Schools': 'icon-school',
    'Hospitals': 'icon-hospital',
    'Shopping & Leisure': 'icon-shopping',
    'Work Hubs': 'icon-work'
  };

  function showLocation(index, instant) {
    var rows = $.map(DATA.location[index].items, function (place) {
      return '<li><span>' + place[0] + '</span><b>' + place[1] + '</b></li>';
    }).join('');
    $('#locRows').html(rows);

    if (!instant && window.gsap && !reduceMotion) {
      gsap.from('#locRows li', { x: -24, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
    }
  }

  $('#locTabs').html($.map(DATA.location, function (c, i) {
    return '<button class="' + (i === 0 ? 'is-on' : '') + '" data-i="' + i + '">' +
      '<img class="ico" src="assets/images/icons/' + (LOCATION_ICONS[c.cat] || 'icon-metro') + '.webp" width="48" height="48" alt="" decoding="async">' +
      c.cat.replace(' & Leisure', '') + '</button>';
  }).join(''));
  showLocation(0, true);

  $('#locTabs').on('click', 'button', function () {
    if ($(this).hasClass('is-on')) return;
    $(this).addClass('is-on').siblings().removeClass('is-on');
    showLocation(+$(this).data('i'));
  });

  /* =====================================================================
     GALLERY — film + sample-flat photos in one stage
     ===================================================================== */
  var galleryItems = $.grep(DATA.gallery, function (g) { return g.cat === 'interiors'; });
  var galleryIndex = -1; // -1 = the film is showing

  function youtubeUrl(extra) {
    return 'https://www.youtube-nocookie.com/embed/' + CONTACT.youtubeId + '?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3' + extra;
  }

  // Thumbnail strip: the film first, then the photos.
  $('#gxThumbs').html(
    '<button class="gx__thumb gx__thumb--film is-on" data-i="-1"><img src="' + img('amenities-grand-arrival-lobby', 'sm') + '" width="800" height="400" loading="lazy" decoding="async" alt=""><span>▶ Film</span></button>' +
    $.map(galleryItems, function (g, i) {
      return '<button class="gx__thumb" data-i="' + i + '"><img src="' + img(g.img, 'sm') + '" width="800" height="441" loading="lazy" decoding="async" alt="' + g.title + '"></button>';
    }).join('')
  );
  $('#gxTot').text(pad(galleryItems.length));

  /* Scroll the thumbnail strip so the active thumb is centred. */
  function galleryCenterThumb() {
    var strip = document.getElementById('gxThumbs');
    var active = strip && strip.querySelector('.is-on');
    if (!active) return;
    strip.scrollTo({ left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2, behavior: 'smooth' });
  }

  /* Muted looping background film, or the full film with sound and controls. */
  function galleryFilm(withSound) {
    var src = withSound
      ? youtubeUrl('&autoplay=1&controls=1')
      : youtubeUrl('&autoplay=1&mute=1&loop=1&playlist=' + CONTACT.youtubeId + '&controls=0&disablekb=1&fs=0');

    $('#gxMedia').html(
      '<img class="gx__poster" src="' + img('amenities-grand-arrival-lobby', 'lg') + '" alt="">' +
      '<iframe class="gx__frame' + (withSound ? ' gx__frame--full' : '') + '" src="' + src + '" title="Envogue 2.0 film" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>'
    );
    $('#gxStage').toggleClass('is-sound', !!withSound).addClass('is-film');
    $('#gxKicker').text(withSound ? 'Playing with sound' : 'Now playing');
    $('#gxTitle').text('The Envogue 2.0 Film');
    $('#gxNum').text('00');
    galleryIndex = -1;
    $('#gxThumbs .gx__thumb').removeClass('is-on').first().addClass('is-on');
    galleryCenterThumb();
  }

  function galleryShow(index) {
    index = (index + galleryItems.length) % galleryItems.length;
    galleryIndex = index;

    var item = galleryItems[index];
    var $photo = $('<img class="gx__photo" alt="">').attr({ src: img(item.img, 'lg'), alt: item.title });

    $('#gxStage').removeClass('is-film is-sound');
    $('#gxMedia').append($photo);

    // Wipe the new photo in over the old one, then drop the old one.
    if (hasGsap && !reduceMotion) {
      gsap.fromTo($photo[0],
        { clipPath: 'inset(0 0 0 100%)', scale: 1.15 },
        {
          clipPath: 'inset(0 0 0 0%)',
          scale: 1,
          duration: 1.1,
          ease: 'power3.inOut',
          onComplete: function () { $photo.prevAll().remove(); }
        });
    } else {
      $photo.prevAll().remove();
    }

    $('#gxKicker').text('Sample Flat');
    $('#gxTitle').text(item.title);
    $('#gxNum').text(pad(index + 1));
    $('#gxThumbs .gx__thumb').removeClass('is-on').eq(index + 1).addClass('is-on');
    galleryCenterThumb();
  }

  /* The full film is lead-gated: visitors who haven't enquired get the popup form. */
  function playFilmWithSound() {
    if (isLead()) galleryFilm(true);
    else openModal('Gallery — Play Film');
  }

  $('#gxThumbs').on('click', '.gx__thumb', function () {
    var index = +$(this).data('i');
    if (index < 0) galleryFilm(false);
    else galleryShow(index);
  });
  $('#gxNext').on('click', function () { galleryShow(galleryIndex + 1); });
  $('#gxPrev').on('click', function () { galleryShow(galleryIndex - 1); });
  $('#gxSound').on('click', playFilmWithSound);

  $('#gxMedia').on('click', function (e) {
    // Only the muted background film reacts here (photos open the lightbox below).
    if ($(e.target).is('.gx__photo') || !$('#gxStage').hasClass('is-film') || $('#gxStage').hasClass('is-sound')) return;
    playFilmWithSound();
  });
  $('#gxMedia').on('click', '.gx__photo', function () {
    lightboxOpen(photoList(galleryItems), galleryIndex);
  });

  // Start the muted film only when the gallery is near (keeps first load fast).
  if ('IntersectionObserver' in window && !reduceMotion) {
    var galleryObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        galleryFilm(false);
        galleryObserver.disconnect();
      }
    }, { rootMargin: '300px 0px' });
    galleryObserver.observe(document.getElementById('gx'));
  } else {
    galleryShow(0);
  }

  /* =====================================================================
     HEADER + PAPER MENU
     ===================================================================== */
  var $header = $('#header');
  var $menu = $('#menu');
  var $burger = $('#burger');
  var menuTimer;

  function openMenu() {
    clearTimeout(menuTimer);
    $menu.removeClass('is-closing').addClass('is-open').attr('aria-hidden', 'false');
    $body.addClass('menu-open');
    $burger.attr({ 'aria-expanded': 'true', 'aria-label': 'Close menu' });
    lockScroll();
  }

  function closeMenu() {
    if (!$menu.hasClass('is-open')) return;
    $menu.removeClass('is-open').addClass('is-closing').attr('aria-hidden', 'true');
    $body.removeClass('menu-open');
    $burger.attr({ 'aria-expanded': 'false', 'aria-label': 'Open menu' });
    unlockScroll();
    // Keep the closing (paper peel) class until its CSS animation ends.
    menuTimer = setTimeout(function () { $menu.removeClass('is-closing'); }, 1150);
  }

  $burger.on('click', function () {
    if ($menu.hasClass('is-open')) closeMenu();
    else openMenu();
  });

  // Menu links: jump behind the paper, then peel the paper away.
  $menu.on('click', '.menu__links a', function (e) {
    e.preventDefault();
    var target = document.querySelector($(this).attr('href'));
    if (!target) return;

    closeMenu();
    var y = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
    if (lenis) {
      lenis.start();
      lenis.scrollTo(y, { immediate: true, force: true });
    }
    window.scrollTo(0, y);
    requestAnimationFrame(function () {
      if (Math.abs((window.scrollY || 0) - y) > 4) window.scrollTo(0, y);
    });
  });

  // Hover preview: swap the menu's preview image.
  var $menuPreview = $menu.find('.menu__preview');
  var previewTimer;
  $menu.on('mouseenter', '.menu__links a', function () {
    var src = img($(this).data('img'), 'sm');
    var $previewImg = $menuPreview.find('img');
    if ($previewImg.attr('src') === src) return;

    clearTimeout(previewTimer);
    $menuPreview.addClass('is-swapping');
    previewTimer = setTimeout(function () {
      $previewImg.attr('src', src);
      $menuPreview.removeClass('is-swapping');
    }, 250);
  });

  // In-page anchor links (logo, scroll cue, etc.).
  $doc.on('click', 'a[href^="#"]:not(.menu__links a)', function (e) {
    var hash = $(this).attr('href');
    if (hash.length < 2 || !$(hash).length) return;
    e.preventDefault();
    scrollToTarget(hash);
  });

  /* =====================================================================
     SCROLL-DRIVEN EFFECTS
     ===================================================================== */
  var statements = $('.statement').get();
  var parallaxItems = $('[data-parallax]').map(function () {
    return {
      el: this,
      factor: parseFloat($(this).data('parallax')) || 0.1,
      mask: !!$(this).closest('[data-reveal="mask"]').length
    };
  }).get();
  var sections = $.map(['home', 'overview', 'residences', 'amenities', 'gallery', 'location'], function (id) {
    return document.getElementById(id);
  });
  var $menuLinks = $menu.find('.menu__links a');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    // Header state + floating buttons.
    $header.toggleClass('is-scrolled', y > 60);
    $body.toggleClass('show-float', y > viewportHeight * 0.55);

    if (!reduceMotion) {
      // Statement panels: the rounded inset image grows to full-bleed as it arrives.
      for (var s = 0; s < statements.length; s++) {
        var rect = statements[s].getBoundingClientRect();
        if (rect.top > viewportHeight || rect.bottom < 0) continue;
        statements[s].style.setProperty('--q', clamp(rect.top / viewportHeight, 0, 1).toFixed(4));
      }

      // Generic parallax.
      for (var i = 0; i < parallaxItems.length; i++) {
        var item = parallaxItems[i];
        var box = item.el.parentElement.getBoundingClientRect();
        if (box.bottom < -100 || box.top > viewportHeight + 100) continue;

        var offset = -((box.top + box.height / 2) - viewportHeight / 2) * item.factor;
        if (item.mask) item.el.style.setProperty('--py', offset.toFixed(1) + 'px');
        else item.el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      }
    }

    // Highlight the current section in the menu.
    var current = 0;
    for (var n = 0; n < sections.length; n++) {
      if (sections[n] && sections[n].getBoundingClientRect().top <= viewportHeight * 0.4) current = n;
    }
    $menuLinks.removeClass('is-current').eq(current).addClass('is-current');
  }

  if (lenis) {
    lenis.on('scroll', onScroll);
  } else {
    var ticking = false;
    $win.on('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    });
  }

  /* =====================================================================
     REVEAL ANIMATIONS, SPLIT HEADINGS, COUNTERS
     ===================================================================== */

  /* Wrap a word (or a counter element) in <span class="w"><span>…</span></span>
     with a staggered transition delay. */
  function wordWrapper(state) {
    var outer = document.createElement('span');
    outer.className = 'w';
    var inner = document.createElement('span');
    inner.style.transitionDelay = (state.i++ * 0.05).toFixed(2) + 's';
    return { outer: outer, inner: inner };
  }

  // Split section titles into words for a line-by-line rise.
  function splitNode(node, state) {
    $(node).contents().each(function () {
      if (this.nodeType === 3) {
        var parts = this.textContent.split(/(\s+)/);
        var fragment = document.createDocumentFragment();

        $.each(parts, function (_, word) {
          if (!word) return;
          if (/^\s+$/.test(word)) {
            fragment.appendChild(document.createTextNode(' '));
            return;
          }
          var outer = document.createElement('span');
          outer.className = 'w';
          var inner = document.createElement('span');
          inner.textContent = word;
          inner.style.transitionDelay = (state.i++ * 0.05).toFixed(2) + 's';
          outer.appendChild(inner);
          fragment.appendChild(outer);
        });
        this.parentNode.replaceChild(fragment, this);
      } else if (this.nodeType === 1 && this.tagName !== 'BR') {
        if ($(this).is('[data-count]')) {
          // Keep counters intact: wrap the whole element as one "word".
          var wrap = wordWrapper(state);
          this.parentNode.insertBefore(wrap.outer, this);
          wrap.inner.appendChild(this);
          wrap.outer.appendChild(wrap.inner);
        } else {
          splitNode(this, state);
        }
      }
    });
  }

  if (!reduceMotion) {
    $('.sec-title, .statement__title, .ebar__title').each(function () {
      $(this).removeAttr('data-reveal').addClass('split');
      splitNode(this, { i: 0 });
    });
  }

  /* Count a [data-count] number up from 0 (ease-out over 2s). */
  function countUp(el) {
    var $el = $(el);
    var to = +$el.data('count');
    var suffix = $el.data('suffix') || '';
    var start = null;
    var duration = 2000;

    if (reduceMotion) {
      $el.text(to.toLocaleString('en-IN') + suffix);
      return;
    }

    var step = function (time) {
      if (!start) start = time;
      var progress = Math.min(1, (time - start) / duration);
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      $el.text(Math.round(to * eased).toLocaleString('en-IN') + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute('data-count')) countUp(el);
        else el.classList.add('is-in');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    $('[data-reveal], .split, [data-count]').each(function () { revealObserver.observe(this); });
  } else {
    $('[data-reveal], .split').addClass('is-in');
    $('[data-count]').each(function () { countUp(this); });
    $('img[data-src]').each(function () { this.src = this.getAttribute('data-src'); });
  }

  /* =====================================================================
     LIGHTBOX
     ===================================================================== */
  var $lightbox = $('#lightbox');
  var $lightboxImg = $('#lbImg');
  var $lightboxCaption = $('#lbCap');
  var lightboxList = [];
  var lightboxIndex = 0;

  function lightboxShow(index) {
    lightboxIndex = (index + lightboxList.length) % lightboxList.length;
    var item = lightboxList[lightboxIndex];

    // Preload, then swap the image in.
    $lightboxImg.removeClass('is-loaded');
    var preload = new Image();
    preload.onload = function () {
      $lightboxImg.attr({ src: item.src, alt: item.title }).addClass('is-loaded');
    };
    preload.src = item.src;

    $lightboxCaption.text(item.title);
    $lightbox.find('.lightbox__nav').toggle(lightboxList.length > 1);
  }

  function lightboxOpen(list, index) {
    lightboxList = list;
    $lightbox.addClass('is-open').attr('aria-hidden', 'false');
    lockScroll();
    lightboxShow(index || 0);
  }

  function lightboxClose() {
    $lightbox.removeClass('is-open').attr('aria-hidden', 'true');
    if (!$('#leadModal').hasClass('is-open') && !$menu.hasClass('is-open')) unlockScroll();
  }

  /* =====================================================================
     AMENITIES COVERFLOW (GSAP)
     ===================================================================== */
  var $coverflowCards = $('#cflow .cfc');
  var coverflowCount = $coverflowCards.length;
  var coverflowIndex = 0;
  var coverflowTimer = null;

  function coverflowLayout(instant) {
    var width = $('#cflow').width();
    var cardWidth = $coverflowCards.first().outerWidth() || 500;
    var gap = Math.min(cardWidth * 0.62, width * 0.3);

    $coverflowCards.each(function (i) {
      // Offset from the active card, wrapped so the ring is continuous.
      var offset = i - coverflowIndex;
      if (offset > coverflowCount / 2) offset -= coverflowCount;
      if (offset < -coverflowCount / 2) offset += coverflowCount;

      var distance = Math.abs(offset);
      var visible = distance <= 2;
      var props = {
        x: offset * gap,
        scale: 1 - distance * 0.16,
        rotationY: offset * -24,
        opacity: visible ? 1 - distance * 0.22 : 0,
        zIndex: 10 - distance,
        filter: 'brightness(' + (1 - distance * 0.25) + ')'
      };

      this.classList.toggle('is-on', offset === 0);
      this.style.pointerEvents = visible ? 'auto' : 'none';

      if (hasGsap && !instant && !reduceMotion) {
        gsap.to(this, $.extend({ duration: 0.9, ease: 'power3.out', overwrite: 'auto' }, props));
      } else if (hasGsap) {
        gsap.set(this, props);
      } else {
        this.style.transform = 'translateX(' + props.x + 'px) scale(' + props.scale + ')';
        this.style.opacity = props.opacity;
        this.style.zIndex = props.zIndex;
      }
    });

    var amenity = DATA.amenities[coverflowIndex];
    $('#cfNum').text(pad(coverflowIndex + 1));
    $('#cfLine').html('<b>' + amenity.title + '</b><span>' + amenity.line + '</span> — ' + amenity.note);
  }

  function coverflowGo(index) {
    coverflowIndex = (index + coverflowCount) % coverflowCount;
    coverflowLayout();
    coverflowAutoplay(true);
  }

  function coverflowAutoplay(on) {
    clearInterval(coverflowTimer);
    if (on && !reduceMotion) {
      coverflowTimer = setInterval(function () {
        coverflowIndex = (coverflowIndex + 1) % coverflowCount;
        coverflowLayout();
      }, 3400);
    }
  }

  $('#cfNext').on('click', function () { coverflowGo(coverflowIndex + 1); });
  $('#cfPrev').on('click', function () { coverflowGo(coverflowIndex - 1); });

  // Clicking the active card opens it big; any other card becomes active.
  $('#cflow')
    .on('click', '.cfc', function () {
      var index = +$(this).data('i');
      if (index === coverflowIndex) lightboxOpen(photoList(DATA.amenities), index);
      else coverflowGo(index);
    })
    .on('mouseenter', function () { coverflowAutoplay(false); })
    .on('mouseleave', function () { coverflowAutoplay(true); });

  // Swipe.
  (function () {
    var startX = 0;
    var pressed = false;

    $('#cflow')
      .on('pointerdown', function (e) {
        pressed = true;
        startX = e.clientX;
      })
      .on('pointerup pointercancel pointerleave', function (e) {
        if (!pressed) return;
        pressed = false;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 50) coverflowGo(coverflowIndex + (dx < 0 ? 1 : -1));
      });
  })();

  coverflowLayout(true);

  // Autoplay only while the coverflow is on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      coverflowAutoplay(entries[0].isIntersecting);
    }, { threshold: 0.3 }).observe(document.getElementById('cflow'));
  }

  /* ---------- Lightbox triggers + controls ---------- */
  $doc.on('click', '[data-lightbox]', function () {
    lightboxOpen([{ src: img($(this).data('lightbox'), 'lg'), title: $(this).data('title') }], 0);
  });

  $('#plist').on('click', '.plan:not(.is-locked) .plan__img', function () {
    var $plan = $(this).closest('.plan');
    lightboxOpen([{ src: img($plan.data('plan'), 'lg'), title: $plan.data('title') }], 0);
  });

  $lightbox
    .on('click', '[data-lb-close]', lightboxClose)
    .on('click', '[data-lb-prev]', function () { lightboxShow(lightboxIndex - 1); })
    .on('click', '[data-lb-next]', function () { lightboxShow(lightboxIndex + 1); })
    .on('click', function (e) { if (e.target === this) lightboxClose(); });

  // Swipe.
  var touchStartX = 0;
  $lightbox
    .on('touchstart', function (e) {
      touchStartX = e.originalEvent.touches[0].clientX;
    })
    .on('touchend', function (e) {
      var dx = e.originalEvent.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50 && lightboxList.length > 1) lightboxShow(lightboxIndex + (dx < 0 ? 1 : -1));
    });

  /* =====================================================================
     LEAD MODAL
     ===================================================================== */
  var $modal = $('#leadModal');
  var $modalForm = $modal.find('.lead-form');

  /* Modal heading for the button/source that opened it. */
  function titleFor(source) {
    var unit = (source.split(' — ')[1] || '').trim(); // e.g. "3 BHK" for per-residence buttons

    if (/^Price on Request/i.test(source)) return unit ? 'Unlock price for ' + unit : 'Unlock the launch price';
    if (/^Unlock Plan/i.test(source)) return unit ? 'View the ' + unit + ' floor plan' : 'Unlock all floor plans';
    if (/^Cost Sheet/i.test(source)) return unit ? 'Get the ' + unit + ' cost sheet' : 'Get the cost sheet';
    if (/book now/i.test(source)) return 'Book your home at ₹5 Lacs';
    if (/unlock price/i.test(source)) return 'Unlock the launch price';
    if (/full cost sheet/i.test(source)) return 'Download the full cost sheet';
    if (/price sheet/i.test(source)) return 'Get the price sheet';
    if (/site visit/i.test(source)) return 'Book a private site visit';
    if (/brochure/i.test(source)) return 'Download the e-brochure';
    if (/video/i.test(source)) return 'Watch the sample flat video';
    if (/film/i.test(source)) return 'Watch the project film';
    if (/exit intent/i.test(source)) return 'Before you go — get the launch offer';
    if (/auto popup/i.test(source)) return 'Tower K4 now launching — enquire today';
    if (/cost|price/i.test(source)) return 'Get the price sheet';
    return 'Enquire now';
  }

  function openModal(source, config) {
    if ($menu.hasClass('is-open')) closeMenu();

    $modalForm.attr('data-source', source || 'Popup Form');
    $('#modalTitle').text(titleFor(source || ''));
    $modalForm.find('[name=message]').val(config ? 'Interested in ' + config : '');
    $modal.addClass('is-open').attr('aria-hidden', 'false');
    lockScroll();

    if (hasGsap && !reduceMotion) {
      gsap.timeline()
        .fromTo('#leadModal .mv', { y: 60, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo('#leadModal .mv__img', { scale: 1.25 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0)
        .fromTo('#leadModal .mv__splash', { scale: 0.3, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 0.16, duration: 1.1, ease: 'power3.out' }, 0.15)
        .fromTo('#leadModal .mv__copy > *, #leadModal .mv__form > *', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, 0.2);
    }

    store.set('envogue_popup_seen', '1', true);
    setTimeout(function () {
      if (!isMobile()) $modalForm.find('input[name=name]').trigger('focus');
    }, 500);
  }

  function closeModal() {
    $modal.removeClass('is-open').attr('aria-hidden', 'true');
    if (!$lightbox.hasClass('is-open')) unlockScroll();
  }

  $doc.on('click', '[data-enquire]', function (e) {
    e.preventDefault();
    openModal($(this).data('enquire'), $(this).data('config'));
  });
  $modal.on('click', '[data-close]', closeModal);

  // Escape closes the top-most overlay; arrows page the lightbox.
  $doc.on('keydown', function (e) {
    if (e.key === 'Escape') {
      if ($lightbox.hasClass('is-open')) lightboxClose();
      else if ($modal.hasClass('is-open')) closeModal();
      else closeMenu();
    }
    if ($lightbox.hasClass('is-open')) {
      if (e.key === 'ArrowRight') lightboxShow(lightboxIndex + 1);
      if (e.key === 'ArrowLeft') lightboxShow(lightboxIndex - 1);
    }
  });

  /* Auto popup once per session (after 25s), plus desktop exit intent. */
  function canAutoPop() {
    return !isLead() &&
      !store.get('envogue_popup_seen', true) &&
      !$modal.hasClass('is-open') &&
      !$menu.hasClass('is-open') &&
      !$lightbox.hasClass('is-open');
  }

  setTimeout(function () {
    if (canAutoPop()) openModal('Auto Popup (25s)');
  }, 25000);

  // Exit intent: only after 12s on the page and some real scrolling,
  // when the cursor leaves through the top edge.
  var pageStart = Date.now();
  $(document.documentElement).on('mouseleave', function (e) {
    if (e.clientY > 5 || isMobile() || Date.now() - pageStart < 12000) return;
    if ((window.scrollY || 0) < window.innerHeight * 0.8) return;
    if (canAutoPop()) openModal('Exit Intent Popup');
  });

  /* ---------- After a lead: unlock plans (submission lives in lead-form.js) ---------- */
  function unlockPlans() {
    $('.plan').removeClass('is-locked');
    renderPriceList();
  }
  if (isLead()) unlockPlans();
  $doc.on('lead:success', unlockPlans);

  $('#year').text(new Date().getFullYear());

  /* =====================================================================
     BANNER — project slider with timed thumbnails
     ===================================================================== */
  var $bannerSlides = $('#bSlides .bslide');
  var bannerIndex = 0;
  var bannerTimer = null;
  var BANNER_SECONDS = 5.5; // time per slide

  $('#bThumbs').html($bannerSlides.map(function (i) {
    return '<button class="bthumb' + (i === 0 ? ' is-active' : '') + '" data-i="' + i + '"><i></i>' + $(this).data('label') + '</button>';
  }).get().join(''));

  /* Slides after the first are lazy: copy data-src/srcset in when needed. */
  function bannerLoad(index) {
    var image = $bannerSlides.eq(index).find('img')[0];
    if (image && image.getAttribute('data-src')) {
      image.srcset = image.getAttribute('data-srcset');
      image.src = image.getAttribute('data-src');
      image.removeAttribute('data-src');
    }
  }

  /* Fill the active thumbnail's progress bar over the slide's duration. */
  function bannerProgress(index) {
    $('#bThumbs .bthumb i').stop(true).css('width', 0);
    if (hasGsap) {
      gsap.killTweensOf('#bThumbs .bthumb i');
      gsap.fromTo($('#bThumbs .bthumb i').eq(index), { width: '0%' }, { width: '100%', duration: BANNER_SECONDS, ease: 'none' });
    }
  }

  function bannerGo(index) {
    if (index === bannerIndex) return;

    var $current = $bannerSlides.eq(bannerIndex);
    var $next = $bannerSlides.eq(index);

    bannerLoad(index);
    bannerLoad((index + 1) % $bannerSlides.length);
    $('#bThumbs .bthumb').removeClass('is-active').eq(index).addClass('is-active');
    $('#bNum').text('0' + (index + 1));

    if (hasGsap && !reduceMotion) {
      $next.addClass('is-in');
      gsap.timeline({
        onComplete: function () {
          $current.removeClass('is-active');
          $next.removeClass('is-in').addClass('is-active');
        }
      })
        .fromTo($next[0], { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.25, ease: 'power3.inOut' })
        .fromTo($next.find('img')[0], { scale: 1.2, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 1.6, ease: 'power3.out' }, 0)
        .to($current.find('img')[0], { scale: 1.06, xPercent: -6, duration: 1.25, ease: 'power3.inOut' }, 0)
        .set($current.find('img')[0], { clearProps: 'all' });
    } else {
      $current.removeClass('is-active');
      $next.addClass('is-active');
    }

    bannerIndex = index;
    bannerProgress(index);
    bannerAutoplay();
  }

  function bannerAutoplay() {
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(function () {
      bannerGo((bannerIndex + 1) % $bannerSlides.length);
    }, BANNER_SECONDS * 1000);
  }

  $('#bThumbs').on('click', '.bthumb', function () { bannerGo(+$(this).data('i')); });
  $win.on('load', function () { bannerLoad(1); });
  if (!reduceMotion) {
    bannerProgress(0);
    bannerAutoplay();
  }

  /* =====================================================================
     GSAP SCENES
     ===================================================================== */
  if (hasGsap && !reduceMotion) {
    // Banner entrance.
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.banner__splash', { scale: 0.4, rotation: -60, opacity: 0, duration: 1.8 })
      .from('.banner__logo-img', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.3 }, 0.15)
      .from('.banner__by, .banner__title > span, .banner__price, .banner__cta', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.45)
      .from('.banner__hl li', { y: 24, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.7)
      .from('.banner__slides', { clipPath: 'inset(100% 0 0 0 round 24px)', duration: 1.4, ease: 'power3.inOut' }, 0.2)
      .from('.banner__slides .bslide.is-active img', { scale: 1.25, duration: 2, ease: 'power3.out' }, 0.2)
      .from('.banner__thumbs, .banner__count', { opacity: 0, y: 14, duration: 0.8 }, 1.1)
      .from('.banner__rules i', { scaleY: 0, transformOrigin: 'top', duration: 1.2, stagger: 0.12, ease: 'power3.inOut' }, 0.4);

    // Banner parallax as you leave — desktop only: on mobile the banner is
    // tall and would fade while still being read.
    if (window.matchMedia('(min-width: 1101px)').matches) {
      gsap.to('.banner__grid', {
        yPercent: -10,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: '.banner', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    // Overview: image stage wipes up, pins pop, text rises.
    gsap.timeline({ scrollTrigger: { trigger: '#overview', start: 'top 70%' } })
      .from('#ovVisual', { clipPath: 'inset(100% 0 0 0 round 24px)', duration: 1.3, ease: 'power3.inOut' })
      .from('#ovVisual .ov__fig.is-on img', { scale: 1.3, duration: 1.8, ease: 'power3.out' }, 0)
      .from('.ov__text > *', { y: 36, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.2)
      .from('#ovVisual .pin', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(2.2)' }, 1)
      .from('.ov-splash', { scale: 0.3, rotation: -50, opacity: 0, duration: 1.4, ease: 'power3.out' }, 0.1);

    // Amenities: coverflow rises in.
    gsap.from('#cflow .cfc', {
      y: 120,
      opacity: 0,
      duration: 1.1,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#cflow', start: 'top 85%' },
      onComplete: function () { coverflowLayout(true); }
    });

    // Price list: lines draw, rows slide in.
    gsap.from('#plist .prow', { y: 40, opacity: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: '#plist', start: 'top 82%' } });
    gsap.from('#plist .plist__head, #plist .prow', { '--line': 0, duration: 1.2, stagger: 0.09, ease: 'power3.inOut', scrollTrigger: { trigger: '#plist', start: 'top 82%' } });

    // Cursor-following plan preview (mouse devices only).
    (function () {
      var floatEl = document.getElementById('plistFloat');
      var listEl = document.getElementById('plist');
      if (!floatEl || !window.matchMedia('(hover: hover)').matches) return;

      var xTo = gsap.quickTo(floatEl, 'x', { duration: 0.6, ease: 'power3' });
      var yTo = gsap.quickTo(floatEl, 'y', { duration: 0.6, ease: 'power3' });
      var $floatImg = $(floatEl).find('img');
      var shownIndex = -1;

      $(listEl).on('mousemove', function (e) {
        var bounds = listEl.getBoundingClientRect();
        xTo(e.clientX - bounds.left + 26);
        yTo(e.clientY - bounds.top - 120);
      });

      $(listEl).on('mouseenter', '.prow', function () {
        var index = +$(this).data('i');
        var residence = DATA.residences[index];
        if (index !== shownIndex) {
          shownIndex = index;
          $floatImg.attr('src', img(residence.img, 'sm'));
          $(floatEl).find('b').text(residence.tab + ' · ' + residence.area + ' sq.ft');
        }
        gsap.to(floatEl, { autoAlpha: 1, scale: 1, rotation: index % 2 ? 3 : -3, duration: 0.45, ease: 'power3.out' });
      });

      $(listEl).on('mouseleave', function () {
        gsap.to(floatEl, { autoAlpha: 0, scale: 0.8, duration: 0.35 });
      });
    })();

    $win.on('load', function () { ScrollTrigger.refresh(); });
  }

  /* =====================================================================
     OVERVIEW TABS — text pane + image stage switch together
     ===================================================================== */
  $('#ovTabs').on('click', 'button', function () {
    var pane = $(this).data('p');
    if ($(this).hasClass('is-on')) return;

    $(this).addClass('is-on').siblings().removeClass('is-on');
    $('.ov__pane').removeClass('is-on').filter('[data-p="' + pane + '"]').addClass('is-on');

    var $figure = $('.ov__fig[data-p="' + pane + '"]');
    $('.ov__fig').removeClass('is-top');
    $figure.addClass('is-on is-top');

    if (hasGsap && !reduceMotion) {
      gsap.fromTo($figure[0],
        { clipPath: 'inset(0 0 0 100%)' },
        {
          clipPath: 'inset(0 0 0 0%)',
          duration: 1,
          ease: 'power3.inOut',
          onComplete: function () { $('.ov__fig').not($figure).removeClass('is-on'); }
        });
      gsap.fromTo($figure.find('img')[0], { scale: 1.2 }, { scale: 1, duration: 1.4, ease: 'power3.out' });
      gsap.from('.ov__pane.is-on > *', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' });
    } else {
      $('.ov__fig').not($figure).removeClass('is-on');
    }
  });

  /* =====================================================================
     LAYOUT ON LOAD / RESIZE
     ===================================================================== */
  function relayout() {
    viewportHeight = window.innerHeight;
    coverflowLayout(true);
    if (lenis) lenis.resize();
    if (hasGsap) ScrollTrigger.refresh();
    onScroll();
  }

  var resizeTimer;
  $win.on('resize orientationchange', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(relayout, 150);
  });
  $win.on('load', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  relayout();

})(jQuery);
