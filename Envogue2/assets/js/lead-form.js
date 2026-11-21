/* =========================================================================
   LEAD FORMS
   Country-code picker (intl-tel-input), validation and submission to mail.php.
   Shared by every .lead-form on the page.
   ========================================================================= */
(function ($) {
  'use strict';

  /* ---------- Settings ---------- */
  var MAILER_URL = 'mailer-api/mail.php';
  var THANKYOU_URL = 'thank-you.html';
  var PHONE = '+919126264444';
  var PHONE_LABEL = '+91 91262 64444';

  var COUNTRY_ORDER = ['in', 'ae', 'us', 'gb', 'sg', 'qa', 'sa', 'kw', 'om', 'bh', 'au', 'ca', 'nz', 'de'];
  var TRACKING_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

  var ITI_JS = 'assets/js/vendor/intlTelInputWithUtils.min.js';

  /* ---------- Storage (fails silently in private mode) ---------- */
  var store = {
    get: function (key, session) {
      try { return (session ? sessionStorage : localStorage).getItem(key); } catch (e) { return null; }
    },
    set: function (key, value, session) {
      try { (session ? sessionStorage : localStorage).setItem(key, value); } catch (e) { /* ignore */ }
    }
  };

  /* =====================================================================
     PHONE PICKER
     ===================================================================== */

  /* Visitor's country from their IP — one lookup per session, India by default. */
  var geoPromise = null;

  function geoIpLookup(callback) {
    if (!geoPromise) {
      var cached = store.get('lead_geo_cc', true);

      geoPromise = cached ? Promise.resolve(cached) : Promise.race([
        fetch('https://ipapi.co/country/').then(function (res) { return res.ok ? res.text() : ''; }),
        new Promise(function (resolve) { setTimeout(function () { resolve(''); }, 3500); })
      ])
        .catch(function () { return ''; })
        .then(function (text) {
          text = $.trim(text || '');
          var code = /^[a-z]{2}$/i.test(text) ? text.toLowerCase() : 'in';
          store.set('lead_geo_cc', code, true);
          return code;
        });
    }
    geoPromise.then(callback);
  }

  function initPhone(input) {
    if (input._iti || typeof window.intlTelInput !== 'function') return;

    input.removeAttribute('maxlength');
    input._iti = window.intlTelInput(input, {
      initialCountry: 'auto',
      geoIpLookup: geoIpLookup,
      countryOrder: COUNTRY_ORDER,
      separateDialCode: true,
      strictMode: false,
      autoPlaceholder: 'off',
      dropdownContainer: document.body
    });

    // The floating label only works when it sits right after the input.
    var $field = $(input).closest('.field').addClass('field--iti');
    var $label = $field.find('label').first();
    if ($label.length) $(input).after($label);

    input.addEventListener('countrychange', function () { setError($field, ''); });
    input.addEventListener('open:countrydropdown', function () {
      // Let the dropdown scroll on its own instead of the page (Lenis).
      $('.iti--container, .iti__country-list').attr('data-lenis-prevent', '');
    });
  }

  function initAllPhones() {
    $('.lead-form input[name=phone]').each(function () { initPhone(this); });
  }

  /* The picker is ~300 KB, so load it only when needed:
     first form interaction, an enquiry click, or when the page is idle. */
  var itiState = 0; // 0 = not loaded, 1 = loading, 2 = ready

  function loadIti() {
    if (itiState) return;
    itiState = 1;

    var script = document.createElement('script');
    script.src = ITI_JS;
    script.async = true;
    script.onload = function () {
      itiState = 2;
      initAllPhones();
    };
    script.onerror = function () { itiState = 0; };
    document.head.appendChild(script);
  }

  $(document).one('focusin pointerdown touchstart', '.lead-form', loadIti);
  $(document).one('click', '[data-enquire]', loadIti);
  $(window).on('load', function () {
    var idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
    setTimeout(function () { idle(loadIti, { timeout: 2000 }); }, 3500);
  });

  /* =====================================================================
     VALIDATION
     ===================================================================== */
  /* Simple, friendly checks. Message is optional.
     The country code comes from the picker, so the phone only needs 6–15 digits
     (spaces, dashes and brackets are ignored). */
  var RULES = {
    name: function (v) {
      return v ? '' : 'Please enter your name.';
    },
    phone: function (v) {
      if (!v) return 'Please enter your mobile number.';
      var digits = v.replace(/\D/g, '').length;
      return digits >= 6 && digits <= 15 ? '' : 'Please enter a valid mobile number.';
    },
    email: function (v) {
      if (!v) return 'Please enter your email address.';
      return /^\S+@\S+\.\S+$/.test(v) ? '' : 'Please enter a valid email address.';
    }
  };

  /* Show (or clear, when msg is empty) the error under a field. */
  function setError($field, msg) {
    var $err = $field.find('.field-err');

    if (!msg) {
      $field.removeClass('is-invalid');
      $err.remove();
      return;
    }
    if (!$err.length) $err = $('<small class="field-err" role="alert"></small>').appendTo($field);
    $field.addClass('is-invalid');
    $err.text(msg);
  }

  /* Checks every field and marks the bad ones.
     Returns { ok, consent, phone (E.164 when possible), country }. */
  function validate($form) {
    var ok = true;
    var $firstBad = null;

    $.each(RULES, function (name, rule) {
      var $input = $form.find('[name=' + name + ']');
      if (!$input.length) return;

      var msg = rule($.trim($input.val() || ''), $input[0]);
      setError($input.closest('.field'), msg);
      if (msg) {
        ok = false;
        $firstBad = $firstBad || $input;
      }
    });

    var $consent = $form.find('[name=consent]');
    var consent = !$consent.length || $consent.is(':checked');
    if (!consent) ok = false;
    if ($firstBad) $firstBad.trigger('focus');

    var phoneInput = $form.find('[name=phone]')[0];
    var iti = phoneInput && phoneInput._iti;
    var rawPhone = phoneInput ? $.trim(phoneInput.value) : '';
    var country = iti ? iti.getSelectedCountryData() : {};

    return {
      ok: ok,
      consent: consent,
      phone: iti ? (iti.getNumber() || rawPhone) : rawPhone,
      country: country.name ? country.name + ' (+' + country.dialCode + ')' : ''
    };
  }

  // Clear a field's error as soon as the visitor edits it.
  function clearOwnError() {
    setError($(this).closest('.field'), '');
  }
  $(document).on('input', '.lead-form .field input', clearOwnError);
  $(document).on('change', '.lead-form .field select', clearOwnError);

  /* =====================================================================
     SUBMISSION
     ===================================================================== */

  /* Campaign parameters from the URL, kept for the whole session. */
  var tracking = (function () {
    var found = {};
    var query = new URLSearchParams(window.location.search);

    $.each(TRACKING_KEYS, function (_, key) {
      var value = query.get(key) || store.get('envogue_' + key, true);
      if (value) {
        found[key] = value;
        store.set('envogue_' + key, value, true);
      }
    });
    return found;
  })();

  $(document).on('submit', '.lead-form', function (e) {
    e.preventDefault();

    var $form = $(this);
    var $msg = $form.find('.form-msg');
    var $btn = $form.find('[type=submit]');
    var btnText = $btn.text();

    // 1. Spam trap: real visitors never fill this hidden field.
    if ($form.find('[name=_honey]').val()) return;

    // 2. Validate.
    var check = validate($form);
    if (!check.ok) {
      $msg.text(check.consent ? 'Please correct the fields marked above.' : 'Please accept the consent to continue.');
      return;
    }

    // 3. Collect the data (plus utm_source, gclid, etc. if present).
    var name = $.trim($form.find('[name=name]').val());
    var source = $form.attr('data-source') || 'Website';
    var data = $.extend({
      'Name': name,
      'Phone': check.phone,
      'Country': check.country,
      'Email': $.trim($form.find('[name=email]').val()),
      'Message': $.trim($form.find('[name=message]').val()),
      'Lead Source': source,
      'Page': location.href
    }, tracking);

    // 4. Show the loading state.
    clearResult($form);
    $form.addClass('is-loading');
    $btn.html('<span class="spin" aria-hidden="true"></span>Submitting…').prop('disabled', true);
    $msg.text('Please wait a moment — sending your details.');

    // 5. Send (no internet → fail fast; slow server → 20s timeout).
    if (navigator.onLine === false) return showError('offline');

    $.ajax({ url: MAILER_URL, type: 'POST', data: data, dataType: 'json', timeout: 20000 })
      .done(function (res) {
        if (!res || !res.success) return showError('server');
        showSuccess($form, name, function () { onSuccess(name, source); });
      })
      .fail(function (xhr, status) {
        showError(status === 'timeout' ? 'timeout' : (navigator.onLine === false ? 'offline' : 'server'));
      });

    function showError(kind) {
      $form.removeClass('is-loading');
      $btn.text(btnText).prop('disabled', false);
      $msg.text('');
      var text = {
        offline: ['You seem to be offline', 'Please check your internet connection and try again.'],
        timeout: ['This is taking longer than usual', "Our server didn't respond in time. Please try again in a moment."],
        server: ["We couldn't send your details", 'Something went wrong on our side. Please try again, or reach us directly.']
      }[kind] || ['', ''];
      var waText = 'Hi, I am ' + name + ' (' + check.phone + "). I'm interested in Envogue. Please share details.";
      var wa = 'https://wa.me/' + PHONE.replace(/\D/g, '') + '?text=' + encodeURIComponent(waText);
      var $card = $(
        '<div class="lf-result lf-result--err" role="alert">' +
          '<span class="lf-result__icon" aria-hidden="true">!</span>' +
          '<b class="lf-result__title"></b><p class="lf-result__text"></p>' +
          '<div class="lf-result__actions">' +
            '<button type="button" class="lf-btn lf-btn--primary" data-lf-retry>Try again</button>' +
            '<a class="lf-btn" href="tel:' + PHONE + '">Call ' + PHONE_LABEL + '</a>' +
            '<a class="lf-btn lf-btn--wa" href="' + wa + '" target="_blank" rel="noopener">WhatsApp us</a>' +
          '</div>' +
          '<button type="button" class="lf-result__x" data-lf-close aria-label="Close">×</button>' +
        '</div>');
      $card.find('.lf-result__title').text(text[0]);
      $card.find('.lf-result__text').text(text[1]);
      $form.append($card);
      requestAnimationFrame(function () { $card.addClass('is-in'); });
      $card.on('click', '[data-lf-close]', function () { clearResult($form); });
      $card.on('click', '[data-lf-retry]', function () { clearResult($form); $form.trigger('submit'); });
    }
  });

  /* Remove any success / error card from a form. */
  function clearResult($form) { $form.find('.lf-result').remove(); }

  /* Friendly confirmation shown briefly before going to the thank-you page. */
  function showSuccess($form, name, then) {
    $form.removeClass('is-loading');
    var first = $.trim(name).split(' ')[0];
    var $card = $(
      '<div class="lf-result lf-result--ok" role="status" aria-live="polite">' +
        '<span class="lf-result__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>' +
        '<b class="lf-result__title"></b>' +
        '<p class="lf-result__text">Your details are with us. Our relationship manager will call you shortly.</p>' +
        '<span class="lf-result__bar"><i></i></span>' +
      '</div>');
    $card.find('.lf-result__title').text('Thank you' + (first ? ', ' + first : '') + '!');
    $form.append($card);
    requestAnimationFrame(function () { $card.addClass('is-in'); });
    setTimeout(then, 1800);
  }

  /* Remember the lead, tell the page, fire tracking and go to the thank-you page. */
  function onSuccess(name, source) {
    store.set('envogue_lead', '1');
    $(document).trigger('lead:success');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'lead_submit', lead_source: source });
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead');

    location.href = THANKYOU_URL + '?name=' + encodeURIComponent(name.split(' ')[0]);
  }

  window.LeadForm = { validate: validate, initPhone: initPhone, store: store };
})(jQuery);
