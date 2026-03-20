/* =========================================================================
   DRM2 Survey - Google Apps Script Backend
   Sheets: Responses, PositiveActivities, NegativeActivities
   - 정서: 리커트 7점 (즐거운, 행복한, 편안한, 짜증나는, 부정적인, 무기력한, 의미, 보람)
   ========================================================================= */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById('1zA6qzFt3qc2URxd97PPOZbDCgFl1lIGWQYXA9YZtfx8');
    var respondentId = Utilities.getUuid();
    var timestamp = new Date().toISOString();

    var positiveActivities = data.positiveActivities || [];
    var negativeActivities = data.negativeActivities || [];
    var demo = data.demographics || {};

    // 1. Responses Sheet
    var respHeaders = [
      'Timestamp', 'RespondentID', 'PhoneNumber',
      'PositiveCount', 'NegativeCount',
      'Gender', 'SchoolLocation', 'SchoolType', 'CareerDecision'
    ];

    var respSheet = getOrCreateSheet(ss, 'Responses', respHeaders);

    respSheet.appendRow([
      timestamp,
      respondentId,
      data.phoneNumber || '',
      positiveActivities.length,
      negativeActivities.length,
      demo.gender || '',
      demo.schoolLocation || '',
      demo.schoolType || '',
      demo.careerDecision || ''
    ]);

    // 2. PositiveActivities Sheet
    var actHeaders = [
      'RespondentID', 'ActivityNum', 'Time', 'Activity', 'Companion', 'Location',
      'EmoJoyful', 'EmoHappy', 'EmoComfortable',
      'EmoAnnoyed', 'EmoNegative', 'EmoLethargic',
      'EmoMeaning', 'EmoRewarding',
      'Reason'
    ];

    var posSheet = getOrCreateSheet(ss, 'PositiveActivities', actHeaders);
    positiveActivities.forEach(function(a) {
      posSheet.appendRow([
        respondentId, a.activityNum || '',
        a.time || '', a.activity || '', a.companion || '', a.location || '',
        a.emo_joyful || '', a.emo_happy || '', a.emo_comfortable || '',
        a.emo_annoyed || '', a.emo_negative || '', a.emo_lethargic || '',
        a.emo_meaning || '', a.emo_rewarding || '',
        a.reason || ''
      ]);
    });

    // 3. NegativeActivities Sheet
    var negSheet = getOrCreateSheet(ss, 'NegativeActivities', actHeaders);
    negativeActivities.forEach(function(a) {
      negSheet.appendRow([
        respondentId, a.activityNum || '',
        a.time || '', a.activity || '', a.companion || '', a.location || '',
        a.emo_joyful || '', a.emo_happy || '', a.emo_comfortable || '',
        a.emo_annoyed || '', a.emo_negative || '', a.emo_lethargic || '',
        a.emo_meaning || '', a.emo_rewarding || '',
        a.reason || ''
      ]);
    });

    return createJsonResponse({ success: true, respondentId: respondentId });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.openById('1zA6qzFt3qc2URxd97PPOZbDCgFl1lIGWQYXA9YZtfx8');
  var result = {};
  ['Responses', 'PositiveActivities', 'NegativeActivities'].forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (sheet) result[name] = sheet.getDataRange().getValues();
  });
  return createJsonResponse(result);
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#f3f3f3');
  }
  return sheet;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
