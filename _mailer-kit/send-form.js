/* =========================================================
   send-form.js — sends any <form class="lead-form"> to mail.php
   No jQuery needed. Just include this file on the page.
   ========================================================= */

// ===== SETTINGS (change these) =====
var MAILER_URL   = 'mail.php';          // path to mail.php
var THANKYOU_URL = 'thank-you.html';    // page to open after success ('' = stay on page)
var PHONE        = '+91 00000 00000';   // shown if sending fails
// ===================================

// Read utm_source, gclid etc. from the page URL (for ad tracking)
var trackingData = {};
new URLSearchParams(location.search).forEach(function (value, key) {
  if (key.indexOf('utm_') === 0 || key === 'gclid' || key === 'fbclid') trackingData[key] = value;
});

document.addEventListener('submit', function (e) {
  var form = e.target;
  if (!form.classList.contains('lead-form')) return;   // only our lead forms
  e.preventDefault();                                   // stop the page from reloading

  var msg = form.querySelector('.form-msg');
  var btn = form.querySelector('[type=submit]');
  var btnText = btn.textContent;
  var get = function (name) { var el = form.querySelector('[name=' + name + ']'); return el ? el.value.trim() : ''; };

  // 1. Spam bot trap: real visitors never fill this hidden field
  if (get('_honey')) return;

  // 2. Simple checks
  if (get('name') === '')                          { msg.textContent = 'Please enter your name.'; return; }
  if (!/^[0-9+ ]{10,15}$/.test(get('phone')))      { msg.textContent = 'Please enter a valid mobile number.'; return; }
  var consent = form.querySelector('[name=consent]');
  if (consent && !consent.checked)                  { msg.textContent = 'Please accept the consent to continue.'; return; }

  // 3. Collect the data to send
  var data = new FormData();
  data.append('Name', get('name'));
  data.append('Phone', get('phone'));
  data.append('Email', get('email'));
  data.append('Message', get('message'));
  data.append('Lead Source', form.getAttribute('data-source') || 'Website');
  data.append('Page', location.href);
  for (var key in trackingData) data.append(key, trackingData[key]);

  // 4. Show "sending…" and disable the button
  btn.disabled = true;
  btn.textContent = 'Submitting…';
  msg.textContent = 'Please wait a moment — sending your details.';

  // 5. Send to mail.php
  fetch(MAILER_URL, { method: 'POST', body: data })
    .then(function (res) { return res.json(); })
    .then(function (res) {
      if (!res.success) throw new Error('not sent');

      // 6. Success: tracking + thank-you page
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'lead_submit' });
      if (typeof fbq === 'function') fbq('track', 'Lead');

      if (THANKYOU_URL) {
        location.href = THANKYOU_URL + '?name=' + encodeURIComponent(get('name').split(' ')[0]);
      } else {
        form.reset();
        btn.disabled = false;
        btn.textContent = btnText;
        msg.textContent = 'Thank you! We will call you shortly.';
      }
    })
    .catch(function () {
      // Something went wrong: re-enable the button
      btn.disabled = false;
      btn.textContent = btnText;
      msg.textContent = 'Could not send right now. Please try again or call ' + PHONE + '.';
    });
});
