/**
 * LEAD API — one Google Apps Script that, for every website form:
 *   1. saves the lead in this Google Sheet (one tab per project, created automatically)
 *   2. emails the lead to the people listed for that project
 *
 * Setup: see README.md. After any change here: Deploy → Manage deployments → Edit → New version.
 */

/* =====================================================================
   GLOBAL SETTINGS
   These are only the starting values. On first run they are copied into the
   "Settings" tab of the sheet — from then on change them THERE (no redeploy).
   Per-project recipients / on-off live in the "Projects" tab.
   ===================================================================== */
var DEFAULTS = {
  'Default recipients': 'officialdinesh1499@gmail.com',   // client list: shiv.buzz123@gmail.com, akasar77@gmail.com
  'Always CC':          '',                               // gets a copy of every project's leads
  'Sender name':        'Website Leads',
  'Email subject':      'New Lead - {project} - {name} ({source})',
  'Time zone':          'Asia/Kolkata',
  'Header colour':      '#3B2C6B',
  'Accent colour':      '#C29A55',
  'Background colour':  '#F4F1EA',
  'Send emails':        'Yes'                             // No = only save to sheet
};

var SETTINGS_TAB = 'Settings';
var PROJECTS_TAB = 'Projects';
var BASE_HEADERS = ['Received', 'Name', 'Phone', 'Email', 'Country', 'Message', 'Lead Source', 'Page'];

/* Settings tab → object. Creates the tab, and adds any missing keys, automatically. */
var _settings = null;
function settings() {
  if (_settings) return _settings;
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var tab = book.getSheetByName(SETTINGS_TAB);
  if (!tab) {
    tab = book.insertSheet(SETTINGS_TAB, 0);
    tab.appendRow(['Setting', 'Value']);
    tab.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground(DEFAULTS['Background colour']);
    tab.setFrozenRows(1);
    tab.setColumnWidth(1, 200).setColumnWidth(2, 420);
  }
  var found = {};
  tab.getDataRange().getValues().slice(1).forEach(function (r) {
    if (String(r[0]).trim()) found[String(r[0]).trim()] = String(r[1]).trim();
  });
  Object.keys(DEFAULTS).forEach(function (k) {
    if (!(k in found)) { tab.appendRow([k, DEFAULTS[k]]); found[k] = DEFAULTS[k]; }
  });
  _settings = found;
  return found;
}

function setting(key) {
  var v = settings()[key];
  return v === '' || v == null ? DEFAULTS[key] : v;
}

/* ---------- Entry points ---------- */

function doPost(e) {
  var data = (e && e.parameter) || {};
  try {
    if (data._honey) return reply({ success: true });          // spam bot
    var lead = normalise(data);
    if (!lead.Name || !lead.Phone) return reply({ success: false, error: 'Name and phone are required' });

    var project = getProject(lead.Project);
    if (!project.active) return reply({ success: false, error: 'Project is switched off' });

    saveLead(lead);              // saved first — kept even if the email fails
    try {
      sendMail(lead, project.to);
    } catch (mailErr) {
      console.error('Mail error: ' + mailErr);
    }
    return reply({ success: true });
  } catch (err) {
    console.error(err);
    return reply({ success: false, error: String(err) });
  }
}

function doGet() {
  return reply({ ok: true, service: 'lead-api' });
}

/* ---------- Lead clean-up ---------- */

function normalise(data) {
  var pick = function (keys) {
    for (var i = 0; i < keys.length; i++) if (data[keys[i]]) return String(data[keys[i]]).trim();
    return '';
  };
  var lead = {
    Project: pick(['Project', 'project']) || 'Website',
    Name: pick(['Name', 'name']),
    Phone: pick(['Phone', 'phone']),
    Email: pick(['Email', 'email']),
    Country: pick(['Country', 'country']),
    Message: pick(['Message', 'message']),
    'Lead Source': pick(['Lead Source', 'Lead_Source', 'source']) || 'Website',
    Page: pick(['Page', 'page'])
  };
  var known = ['_honey', 'consent', 'Project', 'project', 'Name', 'name', 'Phone', 'phone', 'Email', 'email',
    'Country', 'country', 'Message', 'message', 'Lead Source', 'Lead_Source', 'source', 'Page', 'page'];
  Object.keys(data).forEach(function (k) {                    // utm_source, gclid, custom fields...
    if (known.indexOf(k) === -1 && String(data[k]).trim()) lead[k] = String(data[k]).trim().slice(0, 500);
  });
  lead.Project = lead.Project.replace(/[\[\]\*\?\/\\:]/g, ' ').trim().slice(0, 90) || 'Website';
  return lead;
}

/* ---------- Projects tab (recipients + on/off per project) ---------- */

function getProject(name) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var tab = book.getSheetByName(PROJECTS_TAB);
  if (!tab) {
    tab = book.insertSheet(PROJECTS_TAB, 0);
    tab.appendRow(['Project', 'Send leads to (comma separated)', 'Active (Yes/No)', 'Added on']);
    styleHeader(tab, 4);
    tab.setColumnWidth(1, 220).setColumnWidth(2, 380);
  }
  var rows = tab.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() === name.toLowerCase()) {
      return {
        to: String(rows[i][1]).trim() || setting('Default recipients'),
        active: String(rows[i][2]).trim().toLowerCase() !== 'no'
      };
    }
  }
  tab.appendRow([name, setting('Default recipients'), 'Yes', new Date()]);   // new project → registered automatically
  return { to: setting('Default recipients'), active: true };
}

/* ---------- Sheet ---------- */

function saveLead(lead) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = book.getSheetByName(lead.Project);
    if (!sheet) {
      sheet = book.insertSheet(lead.Project);
      sheet.appendRow(BASE_HEADERS);
      styleHeader(sheet, BASE_HEADERS.length);
    }
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Object.keys(lead).forEach(function (key) {                // new field → new column
      if (key !== 'Project' && headers.indexOf(key) === -1) {
        headers.push(key);
        sheet.getRange(1, headers.length).setValue(key);
        styleHeader(sheet, headers.length);
      }
    });
    var row = headers.map(function (h) {
      if (h === 'Received') return new Date();
      var v = lead[h] == null ? '' : String(lead[h]);
      return /^[=+\-@]/.test(v) ? "'" + v : v;                // keep +91… as text, block formulas
    });
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function styleHeader(sheet, cols) {
  sheet.getRange(1, 1, 1, cols).setFontWeight('bold').setBackground(setting('Background colour'));
  sheet.setFrozenRows(1);
}

/* ---------- Email ---------- */

function sendMail(lead, to) {
  if (String(setting('Send emails')).toLowerCase() === 'no') return;
  var COLOR = { header: setting('Header colour'), accent: setting('Accent colour'), bg: setting('Background colour') };
  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.Email);
  var digits = lead.Phone.replace(/\D/g, '');
  var when = Utilities.formatDate(new Date(), setting('Time zone'), 'dd MMM yyyy, hh:mm a') + ' IST';

  var row = function (label, html) {
    return '<tr><td style="padding:10px 0;border-bottom:1px solid #EEE9E0;width:120px;color:' + COLOR.accent +
      ';font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;vertical-align:top">' + label +
      '</td><td style="padding:10px 0;border-bottom:1px solid #EEE9E0;color:#222;font-size:14px">' + html + '</td></tr>';
  };
  var rows = row('Phone', '<a href="tel:' + esc(lead.Phone) + '">' + esc(lead.Phone) + '</a>');
  if (hasEmail) rows += row('Email', '<a href="mailto:' + esc(lead.Email) + '">' + esc(lead.Email) + '</a>');
  ['Country', 'Message', 'Lead Source', 'Page'].concat(Object.keys(lead).filter(function (k) {
    return ['Project', 'Name', 'Phone', 'Email', 'Country', 'Message', 'Lead Source', 'Page'].indexOf(k) === -1;
  })).forEach(function (k) {
    if (lead[k]) rows += row(esc(k), esc(lead[k]).replace(/\n/g, '<br>'));
  });

  var btn = 'display:inline-block;margin:0 6px 8px 0;padding:11px 18px;border-radius:30px;font-size:14px;font-weight:bold;text-decoration:none;';
  var buttons = '<a href="tel:' + esc(lead.Phone) + '" style="' + btn + 'background:' + COLOR.accent + ';color:#fff">Call</a>';
  if (digits) buttons += '<a href="https://wa.me/' + digits + '?text=' +
    encodeURIComponent('Hi ' + lead.Name + ', thank you for your enquiry about ' + lead.Project + '.') +
    '" style="' + btn + 'background:#1F9D55;color:#fff">WhatsApp</a>';

  var html =
    '<div style="background:' + COLOR.bg + ';padding:24px 10px;font-family:Arial,Helvetica,sans-serif">' +
    '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">' +
    '<div style="background:' + COLOR.header + ';color:#fff;padding:20px 24px">' +
    '<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.8">New enquiry</div>' +
    '<div style="font-size:22px;font-weight:bold;margin-top:4px">' + esc(lead.Project) + '</div></div>' +
    '<div style="padding:22px 24px"><div style="font-size:20px;font-weight:bold;color:#222">' + esc(lead.Name) + '</div>' +
    '<table style="width:100%;border-collapse:collapse;margin:12px 0 18px">' + rows + '</table>' + buttons + '</div>' +
    '<div style="padding:14px 24px;border-top:3px solid ' + COLOR.accent + ';color:#888;font-size:12px">Received ' + when + '</div>' +
    '</div></div>';

  var options = { htmlBody: html, name: setting('Sender name') };
  if (hasEmail) options.replyTo = lead.Email;
  if (setting('Always CC')) options.cc = setting('Always CC');
  var subject = setting('Email subject').replace('{project}', lead.Project).replace('{name}', lead.Name)
    .replace('{source}', lead['Lead Source']).replace('{phone}', lead.Phone);
  MailApp.sendEmail(to, subject,
    'New enquiry for ' + lead.Project + '\nName: ' + lead.Name + '\nPhone: ' + lead.Phone, options);
}

/* ---------- Helpers ---------- */

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor (▶ Run → testSetup) to grant permissions and check everything works. */
function testSetup() {
  var res = doPost({ parameter: { Project: 'Test Project', Name: 'Test Lead', Phone: '+91 90000 00000', Message: 'Setup test' } });
  console.log(res.getContent());
}
