// Video Tracker API (Google Apps Script)
// Usage: <web app URL>?code=VID-XXXXXX
// Returns one client's progress as JSON, or {"found":false}.

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const searchCode = e.parameter.code;

  for (let i = 1; i < data.length; i++) {
    const val = data[i][0];
    if (val === searchCode) {
      const result = {
        found: true,
        name: data[i][1],
        project: data[i][2],
        shoot_status: data[i][3],
        shoot_date: formatDate(data[i][4]),
        delivery_date: formatDate(data[i][5]),
        delivery_note: data[i][6]
      };
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  const result = {
    found: false
  };
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Helper: turns a sheet date into plain "yyyy-MM-dd" text in the sheet's time zone.
// Non-date values (like empty cells) are returned unchanged.
function formatDate(value) {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    const tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
    return Utilities.formatDate(value, tz, "yyyy-MM-dd");
  }
  return value;
}
