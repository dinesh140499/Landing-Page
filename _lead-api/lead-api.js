/* =========================================================================
   LEAD API — drop-in client. Every form with class "lead-form" is handled:
   validate → send to the Lead API (Google Sheet + email) → thank-you page.

   <script src="lead-api.js" data-project="My Project" defer></script>

   Optional attributes on the script tag:
     data-thankyou="thank-you.html"   page to open after success ("" = stay on page)
     data-auto="false"                don't bind forms; call LeadAPI.send(data) yourself
     data-endpoint="https://..."      override the URL below
   ========================================================================= */
(function () {
  'use strict';

  // Paste your Apps Script Web app URL here once — every project then uses it.
  var ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';

  var tag = document.currentScript || document.querySelector('script[src*="lead-api"]');
  var cfg = {
    endpoint: (tag && tag.getAttribute('data-endpoint')) || ENDPOINT,
    project: (tag && tag.getAttribute('data-project')) || document.title || location.hostname,
    thankyou: tag && tag.hasAttribute('data-thankyou') ? tag.getAttribute('data-thankyou') : 'thank-you.html',
    auto: !(tag && tag.getAttribute('data-auto') === 'false')
  };

  /* Campaign parameters, kept for the whole visit. */
  var TRACK = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  var tracking = {};
  var query = new URLSearchParams(location.search);
  TRACK.forEach(function (k) {
    var v = query.get(k);
    try { v = v || sessionStorage.getItem('lead_' + k); if (v) sessionStorage.setItem('lead_' + k, v); } catch (e) { /* private mode */ }
    if (v) tracking[k] = v;
  });

  /* Send one lead. Resolves {success:true} or rejects with an Error. */
  function send(data) {
    var body = new URLSearchParams();
    var all = Object.assign({ Project: cfg.project, Page: location.href }, tracking, data);
    Object.keys(all).forEach(function (k) { if (all[k] != null && all[k] !== '') body.append(k, all[k]); });

    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);

    return fetch(cfg.endpoint, { method: 'POST', body: body, signal: ctrl && ctrl.signal })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        clearTimeout(timer);
        if (!res || !res.success) throw new Error((res && res.error) || 'Lead API error');
        return res;
      }, function (err) { clearTimeout(timer); throw err; });
  }

  /* ---------- Automatic form handling ---------- */

  function field(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || '').trim() : '';
  }

  function onSubmit(e) {
    var form = e.target.closest && e.target.closest('form.lead-form');
    if (!form || form.hasAttribute('data-lead-busy')) return;
    e.preventDefault();

    var msg = form.querySelector('.form-msg');
    var btn = form.querySelector('[type=submit]');
    var say = function (t) { if (msg) msg.textContent = t; };

    if (field(form, '_honey')) return;                         // spam bot
    var name = field(form, 'name');
    var phone = field(form, 'phone');
    var email = field(form, 'email');
    var consent = form.querySelector('[name=consent]');
    if (name.length < 2) return say('Please enter your name.');
    if (phone.replace(/\D/g, '').length < 7) return say('Please enter a valid phone number.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return say('Please enter a valid email.');
    if (consent && !consent.checked) return say('Please accept the consent to continue.');

    // Full international number if intl-tel-input is used on the field
    var phoneEl = form.querySelector('[name=phone]');
    var iti = window.intlTelInput && window.intlTelInput.getInstance && phoneEl && window.intlTelInput.getInstance(phoneEl);
    if (iti && iti.getNumber()) phone = iti.getNumber();

    var data = {
      Name: name, Phone: phone, Email: email,
      Message: field(form, 'message'), Country: field(form, 'country'),
      'Lead Source': form.getAttribute('data-source') || 'Website'
    };
    Array.prototype.forEach.call(form.elements, function (el) {   // any extra named fields
      var k = el.name;
      if (!k || ['name', 'phone', 'email', 'message', 'country', 'consent', '_honey'].indexOf(k) !== -1) return;
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
      if (el.value) data[k] = el.value;
    });

    var btnText = btn ? btn.innerHTML : '';
    form.setAttribute('data-lead-busy', '');
    if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }
    say('Please wait — sending your details.');

    send(data).then(function () {
      say('Thank you! We will contact you shortly.');
      form.dispatchEvent(new CustomEvent('lead:success', { bubbles: true, detail: data }));
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'lead_submit', lead_source: data['Lead Source'] });
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
      if (cfg.thankyou) {
        setTimeout(function () { location.href = cfg.thankyou + '?name=' + encodeURIComponent(name.split(' ')[0]); }, 600);
      } else {
        form.reset();
      }
    }).catch(function (err) {
      console.error('[LeadAPI]', err);
      say(navigator.onLine === false ? 'You seem to be offline. Please try again.' : "Couldn't send your details. Please try again or call us.");
      form.dispatchEvent(new CustomEvent('lead:error', { bubbles: true, detail: err }));
    }).then(function () {
      form.removeAttribute('data-lead-busy');
      if (btn) { btn.disabled = false; btn.innerHTML = btnText; }
    });
  }

  if (cfg.auto) document.addEventListener('submit', onSubmit);

  window.LeadAPI = { send: send, config: cfg };
})();
