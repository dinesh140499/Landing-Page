# Lead API — email + Google Sheet for every project

One Google Apps Script does everything: it saves each lead in a Google Sheet (one tab per project) and emails it.
No PHP, no PHPMailer, no server mail setup. It works on any hosting, including static hosts like Netlify.

## One-time setup (about 5 minutes)
1. Create a Google Sheet, e.g. "Website Leads".
2. **Extensions → Apps Script**. Delete what's there, paste `Code.gs`, and save.
3. Optional: change `DEFAULT_TO` at the top (who gets emails for new projects).
4. Select `testSetup` in the toolbar and press **▶ Run**. Allow the permissions.
   A "Test Project" tab appears and a test email arrives. You can delete that tab and its row in **Projects**.
5. **Deploy → New deployment → ⚙ Web app**. Set Execute as **Me** and Who has access **Anyone**, then **Deploy**.
6. Copy the Web app URL into `ENDPOINT` at the top of `lead-api.js`.

## Add to any new project (2 steps)
1. Copy `lead-api.js` into the site's folder.
2. Add this before `</body>`:
```html
<script src="lead-api.js" data-project="Project Name" defer></script>
```
Every `<form class="lead-form">` now works. Use input names `name`, `phone`, `email`, `message`. Add `data-source="Banner Form"` to tell forms apart.
Optional: `<input name="_honey" style="display:none">` (spam trap), a `consent` checkbox, and `<p class="form-msg"></p>` for status text.

The first lead from a new project automatically:
- creates its own tab in the sheet
- adds it to the **Projects** tab, using the default recipients

## Global config: the sheet is the settings panel (no code, no redeploy)
**Settings** tab (applies to all projects):

| Setting | What it does |
|---|---|
| Default recipients | who gets emails for a new project |
| Always CC | gets a copy of every lead from every project |
| Sender name | the "From" name in the inbox |
| Email subject | template using `{project}`, `{name}`, `{source}`, `{phone}` |
| Time zone | time format in the email |
| Header / Accent / Background colour | email design |
| Send emails | `No` = save to the sheet only |

**Projects** tab (per project): who receives its emails (comma separated), and Active `Yes`/`No`.

Code is edited only once: `ENDPOINT` in `lead-api.js`.

## Using your own form script
Add `data-auto="false"` to the script tag, then call:
```js
LeadAPI.send({ Name, Phone, Email, Message, 'Lead Source': 'Popup Form' })
  .then(() => /* success */)
  .catch(() => /* error */);
```

## Notes
- After editing `Code.gs`: **Deploy → Manage deployments → Edit → Version: New version**. The URL stays the same.
- A free Gmail account can send about 100 emails per day (Workspace accounts: 1,500). Leads are always saved to the sheet, even past that limit.
