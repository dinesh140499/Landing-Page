# Mailer kit — set up a form on a new site in 3 steps

## 1. Copy files
Copy `mail.php`, `mail-config.php` and `send-form.js` into the new site's main folder (next to `index.html`).

## 2. Change settings
- `mail-config.php` → your email, project name, colours, log on/off (the only PHP file you edit)
- `send-form.js` → top 3 lines: `MAILER_URL`, `THANKYOU_URL`, `PHONE`

## 3. Add the form + script to your HTML
```html
<form class="lead-form" data-source="Banner Form">
  <input type="text"  name="name"    placeholder="Full Name">
  <input type="tel"   name="phone"   placeholder="Mobile Number">
  <input type="email" name="email"   placeholder="Email Address">
  <input type="text"  name="message" placeholder="Your Message">

  <!-- spam trap: keep hidden -->
  <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">

  <label><input type="checkbox" name="consent" checked> I agree to be contacted.</label>
  <button type="submit">Submit</button>
  <p class="form-msg"></p>
</form>

<script src="send-form.js"></script>
```

- You can have many forms on one page — give each a different `data-source` so you know which form the lead came from.
- Upload to PHP hosting (Hostinger / cPanel). It will **not** work on Netlify, GitHub Pages, or by opening the file on your computer.
- First test: check your **spam folder**.

