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

  var ITI_CSS = 'assets/css/intlTelInput.min.css';
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

  /* The picker is ~300 KB, so load it only when needed:
     first form interaction, an enquiry click, or when the browser is idle. */
  var itiRequested = false;

  function loadIti() {
    if (itiRequested) return;
    itiRequested = true;

    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = ITI_CSS;
    document.head.appendChild(css);

    var script = document.createElement('script');
    script.src = ITI_JS;
    script.async = true;
    script.onload = function () {
      $('.lead-form input[name=phone]').each(function () { initPhone(this); });
    };
    document.head.appendChild(script);
  }

  ['focusin', 'pointerdown', 'touchstart', 'click'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      if (e.target.closest && e.target.closest('.lead-form, [data-enquire]')) loadIti();
    }, { capture: true, passive: true });
  });

  $(window).on('load', function () {
    setTimeout(function () {
      if ('requestIdleCallback' in window) requestIdleCallback(loadIti, { timeout: 4000 });
      else loadIti();
    }, 3500);
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
    var query = new URLSearchParams(location.search);

    TRACKING_KEYS.forEach(function (key) {
      var value = query.get(key) || store.get('lim_' + key, true);
      if (value) {
        found[key] = value;
        store.set('lim_' + key, value, true);
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

    // 3. Collect the data.
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
    $form.addClass('is-loading');
    $btn.html('<span class="spin" aria-hidden="true"></span>Submitting…').prop('disabled', true);
    $msg.text('Please wait a moment — sending your details.');

    // 5. Send.
    $.post(MAILER_URL, data, null, 'json')
      .done(function (res) {
        if (!res || !res.success) return showError();
        onSuccess(name, source);
      })
      .fail(showError);

    function showError() {
      $form.removeClass('is-loading');
      $btn.text(btnText).prop('disabled', false);
      $msg.html('Could not send right now. Please try again or call <a href="tel:' + PHONE + '" style="text-decoration:underline">' + PHONE_LABEL + '</a>.');
    }
  });

  /* Remember the lead, fire tracking and go to the thank-you page. */
  function onSuccess(name, source) {
    store.set('lim_lead', '1');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'lead_submit', lead_source: source });
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead');

    location.href = THANKYOU_URL + '?name=' + encodeURIComponent(name.split(' ')[0]);
  }

  window.LeadForm = { validate: validate, initPhone: initPhone, store: store };
})(jQuery);
