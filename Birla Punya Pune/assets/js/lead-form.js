/* =========================================================================
   LEAD FORMS — country-code picker (intl-tel-input), validation + PHP submission
   Shared by every .lead-form on the page. Sends to mail.php after validation.
   ========================================================================= */
(function ($) {
  'use strict';

  /* ---------- submission settings ---------- */
  var MAILER_URL = 'mail.php';
  var THANKYOU_URL = 'thank-you.html';
  var PHONE = '+919126264444';
  var PHONE_LABEL = '+91 91262 64444';
  var store = {
    get: function (k, ses) { try { return (ses ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, ses) { try { (ses ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };

  var COUNTRY_ORDER = ['in', 'ae', 'us', 'gb', 'sg', 'qa', 'sa', 'kw', 'om', 'bh', 'au', 'ca', 'nz', 'de'];

  /* Visitor's country via IP (one lookup per session, falls back to India) */
  var geoPromise = null;
  function geoIpLookup(success) {
    if (!geoPromise) {
      var cached = null;
      try { cached = sessionStorage.getItem('lead_geo_cc'); } catch (e) {}
      geoPromise = cached ? Promise.resolve(cached) : Promise.race([
        fetch('https://ipapi.co/country/').then(function (r) { return r.ok ? r.text() : ''; }),
        new Promise(function (resolve) { setTimeout(function () { resolve(''); }, 3500); })
      ]).catch(function () { return ''; }).then(function (t) {
        t = $.trim(t || '');
        var cc = /^[a-z]{2}$/i.test(t) ? t.toLowerCase() : 'in';
        try { sessionStorage.setItem('lead_geo_cc', cc); } catch (e) {}
        return cc;
      });
    }
    geoPromise.then(success);
  }

  function initPhone(input) {
    if (input._iti || typeof window.intlTelInput !== 'function') return;
    input.removeAttribute('maxlength');
    var iti = window.intlTelInput(input, {
      initialCountry: 'auto',
      geoIpLookup: geoIpLookup,
      countryOrder: COUNTRY_ORDER,
      separateDialCode: true,
      strictMode: false,
      autoPlaceholder: 'off',
      dropdownContainer: document.body
    });
    input._iti = iti;

    // keep the floating label working: label must sit right after the input
    var $field = $(input).closest('.field').addClass('field--iti');
    var $label = $field.find('label').first();
    if ($label.length) $(input).after($label);
    input.addEventListener('countrychange', function () { setError($field, ''); });
    input.addEventListener('open:countrydropdown', function () {
      $('.iti--container, .iti__country-list').attr('data-lenis-prevent', '');
    });
  }

  function setError($field, msg) {
    var $err = $field.find('.field-err');
    if (!msg) { $field.removeClass('is-invalid'); $err.remove(); return; }
    if (!$err.length) $err = $('<small class="field-err" role="alert"></small>').appendTo($field);
    $field.addClass('is-invalid');
    $err.text(msg);
  }

  var RULES = {
    name: function (v) {
      if (!v) return 'Please enter your name.';
      if (v.length < 2 || !/^[\p{L} .'-]+$/u.test(v)) return 'Please enter a valid name (letters only).';
      return '';
    },
    phone: function (v) {
      if (!v) return 'Please enter your mobile number.';
      var valid = /^\+?[\d\s-]{7,18}$/.test(v);
      return valid ? '' : 'Please enter a valid mobile number.';
    },
    email: function (v) {
      if (!v) return 'Please enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Please enter a valid email address.';
    },
    message: function (v) {
      if (!v) return 'Please enter a short message.';
      return v.length < 2 ? 'Message is too short.' : '';
    }
  };

  /* Returns { ok, phone (E.164), country } and shows an error under each bad field */
  function validate($f) {
    var ok = true, $first = null;
    $.each(RULES, function (name, rule) {
      var $in = $f.find('[name=' + name + ']');
      if (!$in.length) return;
      var msg = rule($.trim($in.val() || ''), $in[0]);
      setError($in.closest('.field'), msg);
      if (msg) { ok = false; $first = $first || $in; }
    });
    var $consent = $f.find('[name=consent]');
    if ($consent.length && !$consent.is(':checked')) ok = false;
    if ($first) $first.trigger('focus');

    var input = $f.find('[name=phone]')[0], iti = input && input._iti;
    var data = iti ? iti.getSelectedCountryData() : {};
    return {
      ok: ok,
      consent: !$consent.length || $consent.is(':checked'),
      phone: iti ? (iti.getNumber() || $.trim(input.value)) : $.trim(input ? input.value : ''),
      country: data.name ? data.name + ' (+' + data.dialCode + ')' : ''
    };
  }

  // clear a field's error as soon as the visitor edits it
  $(document).on('input', '.lead-form .field input', clearOwnError);
  $(document).on('change', '.lead-form .field select', clearOwnError);
  function clearOwnError() {
    setError($(this).closest('.field'), '');
  }

  /* Load the 300 KB phone picker only when needed: first form interaction, enquiry click, or idle after page load */
  var itiReq = false;
  function loadIti() {
    if (itiReq) return; itiReq = true;
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'assets/css/intlTelInput.min.css'; document.head.appendChild(css);
    var sc = document.createElement('script'); sc.src = 'assets/js/vendor/intlTelInputWithUtils.min.js'; sc.async = true;
    sc.onload = function () { $('.lead-form input[name=phone]').each(function () { initPhone(this); }); };
    document.head.appendChild(sc);
  }
  ['focusin', 'pointerdown', 'touchstart', 'click'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (e.target.closest && e.target.closest('.lead-form, [data-enquire]')) loadIti(); }, { capture: true, passive: true });
  });
  $(window).on('load', function () { setTimeout(function () { if ('requestIdleCallback' in window) requestIdleCallback(loadIti, { timeout: 4000 }); else loadIti(); }, 3500); });

  /* ---------- PHP mailer submission ---------- */
  var utm = (function () { var o = {}, q = new URLSearchParams(location.search); ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) { var v = q.get(k) || store.get('bp_' + k, true); if (v) { o[k] = v; store.set('bp_' + k, v, true); } }); return o; })();
  $(document).on('submit', '.lead-form', function (e) {
    e.preventDefault();                   // stop the page from reloading
    var form = $(this);
    var msg = form.find('.form-msg');
    var btn = form.find('[type=submit]');
    var btnText = btn.text();

    // 1. Spam bot trap: real visitors never fill this hidden field
    if (form.find('[name=_honey]').val()) return;

    // 2. Check the fields (name, phone, email, consent)
    var check = validate(form);
    if (!check.ok) {
      msg.text(check.consent ? 'Please correct the fields marked above.' : 'Please accept the consent to continue.');
      return;
    }

    // 3. Collect the data to send
    var name = $.trim(form.find('[name=name]').val());
    var source = form.attr('data-source') || 'Website';
    var data = {
      'Name': name,
      'Phone': check.phone,
      'Country': check.country,
      'Email': $.trim(form.find('[name=email]').val()),
      'Message': $.trim(form.find('[name=message]').val()),
      'Lead Source': source,
      'Page': location.href
    };
    $.extend(data, utm);                  // add utm_source, gclid, etc. if present

    // 4. Show "sending…" and disable the button
    form.addClass('is-loading');
    btn.html('<span class="spin" aria-hidden="true"></span>Submitting…').prop('disabled', true);
    msg.text('Please wait a moment — sending your details.');

    // 5. Send to mail.php
    $.post(MAILER_URL, data, null, 'json')
      .done(function (res) {
        if (!res || !res.success) { showError(); return; }
        // 6. Success: remember the lead, fire tracking, go to thank-you page
        store.set('bp_lead', '1');
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'lead_submit', lead_source: source });
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
        location.href = THANKYOU_URL + '?name=' + encodeURIComponent(name.split(' ')[0]);
      })
      .fail(showError);

    // Something went wrong: re-enable the button and show the phone number
    function showError() {
      form.removeClass('is-loading');
      btn.text(btnText).prop('disabled', false);
      msg.html('Could not send right now. Please try again or call <a href="tel:' + PHONE + '" style="text-decoration:underline">' + PHONE_LABEL + '</a>.');
    }
  });

  window.LeadForm = { validate: validate, initPhone: initPhone };
})(jQuery);
