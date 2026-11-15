/* =========================================================================
   LEAD FORMS — country-code picker (intl-tel-input) + basic validation
   Shared by every .lead-form on the page. main.js calls LeadForm.validate($form).
   ========================================================================= */
(function ($) {
  'use strict';

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
      strictMode: true,
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
    phone: function (v, input) {
      if (!v) return 'Please enter your mobile number.';
      var iti = input && input._iti;
      var valid = iti ? iti.isValidNumber() : /^\+?[\d\s-]{7,18}$/.test(v);
      return valid ? '' : 'Please enter a valid mobile number for the selected country.';
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

  $('.lead-form input[name=phone]').each(function () { initPhone(this); });

  window.LeadForm = { validate: validate, initPhone: initPhone };
})(jQuery);
