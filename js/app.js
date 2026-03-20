/* =========================================================================
   DRM2 Survey - App Logic
   ========================================================================= */

(function () {
  'use strict';

  var MIN_ACTIVITIES = 3;
  var MAX_ACTIVITIES = 10;

  var TIME_OPTIONS = [
    '교과시간(국어)',
    '교과시간(수학)',
    '교과시간(영어)',
    '교과시간(사회/역사)',
    '교과시간(과학)',
    '교과시간(음악)',
    '교과시간(미술)',
    '교과시간(체육)',
    '교과시간(정보)',
    '교과시간(한국사)',
    '교과시간(제2외국어)',
    '교과시간(진로선택과목)',
    '교과시간(기타과목)',
    '점심시간',
    '학교방과후시간',
    '동아리시간',
    '상담시간',
    '학원시간',
    '아침시간(등교 전)',
    '오전(주말/휴일)',
    '오후(주말/휴일)',
    '저녁시간',
    '야간/취침 전',
    '귀가후시간',
    '기타'
  ];

  var COMPANION_OPTIONS = [
    '혼자서',
    '교사와 함께',
    '친구와 함께',
    '선후배와 함께',
    '가족과 함께',
    '교사이외의 성인(학원강사포함)',
    '이웃/지인과 함께',
    '온라인 친구와 함께',
    'AI',
    '기타'
  ];

  var LOCATION_OPTIONS = [
    '교실',
    '도서실',
    '운동장/체육관',
    '학원',
    '집',
    '카페/식당',
    '공원/야외',
    '종교시설(교회/성당/절 등)',
    '문화시설(영화관/공연장 등)',
    '교통수단(버스/지하철 등)',
    '스마트기기(컴퓨터포함)',
    '기타'
  ];

  var EMOTIONS = [
    { group: 'positive', label: '\uAE0D\uC815 \uC815\uC11C', icon: '\uD83D\uDE0A', color: 'positive', items: [
      { key: 'emo_joyful', label: '\uC990\uAC70\uC6B4' },
      { key: 'emo_happy', label: '\uD589\uBCF5\uD55C' },
      { key: 'emo_comfortable', label: '\uD3B8\uC548\uD55C' }
    ]},
    { group: 'negative', label: '\uBD80\uC815 \uC815\uC11C', icon: '\uD83D\uDE1E', color: 'negative', items: [
      { key: 'emo_annoyed', label: '\uC9DC\uC99D\uB098\uB294' },
      { key: 'emo_negative', label: '\uBD80\uC815\uC801\uC778' },
      { key: 'emo_lethargic', label: '\uBB34\uAE30\uB825\uD55C' }
    ]},
    { group: 'meaning', label: '\uC758\uBBF8\u00B7\uBCF4\uB78C', icon: '\u2728', color: 'meaning', items: [
      { key: 'emo_meaning', label: '\uC758\uBBF8' },
      { key: 'emo_rewarding', label: '\uBCF4\uB78C' }
    ]}
  ];

  var POSITIVE_EXAMPLE = {
    time: '\uC0C1\uB2F4\uC2DC\uAC04',
    activity: '\uC9C4\uB85C \uC0C1\uB2F4 \uC2DC\uAC04\uC5D0 \uC120\uC0DD\uB2D8\uACFC \uBBF8\uB798 \uD76C\uB9DD \uBC0F \uC804\uACF5 \uD0D0\uC0C9\uC5D0 \uB300\uD574 \uC774\uC57C\uAE30\uD588\uB2E4. \uB0B4\uAC00 \uAD00\uC2EC \uC788\uB294 \uBD84\uC57C\uC758 \uB300\uD559 \uD559\uACFC\uC640 \uAD50\uC721\uACFC\uC815 \uACFC\uBAA9\uC120\uD0DD\uC5D0 \uB300\uD55C \uAD6C\uCCB4\uC801\uC778 \uC124\uBA85\uC744 \uB4E4\uC5C8\uB2E4. \uB098 \uC790\uC2E0\uC5D0 \uB300\uD55C \uC774\uD574\uAC00 \uB192\uC544\uC9C0\uACE0 \uC9C4\uB85C \uBC29\uD5A5\uC774 \uC880 \uB354 \uBA85\uD655\uD574\uC9C4 \uB290\uB08C\uC774\uC5C8\uB2E4.',
    companion: '\uAD50\uC0AC\uC640 \uD568\uAED8',
    location: '\uAE30\uD0C0',
    reason: '\uB9C9\uC5F0\uD588\uB358 \uBBF8\uB798\uC5D0 \uB300\uD55C \uACE0\uBBFC\uC774 \uC870\uAE08\uC529 \uC815\uB9AC\uB418\uB294 \uB290\uB08C\uC774\uC5C8\uB2E4. \uC120\uC0DD\uB2D8\uC774 \uB0B4 \uC774\uC57C\uAE30\uB97C \uC9C4\uC9C0\uD558\uAC8C \uB4E4\uC5B4\uC8FC\uC154\uC11C \uC874\uC911\uBC1B\uB294 \uAE30\uBD84\uC774 \uB4E4\uC5C8\uB2E4. \uC55E\uC73C\uB85C \uC5B4\uB5A4 \uACFC\uBAA9\uC744 \uC120\uD0DD\uD558\uACE0 \uC5B4\uB5A4 \uD65C\uB3D9\uC744 \uD574\uC57C \uD560\uC9C0 \uBC29\uD5A5\uC774 \uBCF4\uC5EC\uC11C \uC758\uC695\uC774 \uC0DD\uACBC\uB2E4.'
  };

  var NEGATIVE_EXAMPLE = {
    time: '\uAD50\uACFC\uC2DC\uAC04(\uC218\uD559)',
    activity: '\uC218\uD559 \uC2DC\uAC04\uC5D0 \uC5B4\uB824\uC6B4 \uBBF8\uC801\uBD84 \uBB38\uC81C\uB97C \uD480\uC5C8\uB294\uB370 \uC804\uD600 \uC774\uD574\uAC00 \uB418\uC9C0 \uC54A\uC558\uB2E4. \uB300\uD559 \uC785\uC2DC \uC900\uBE44(\uC0DD\uAE30\uBD80 \uC900\uBE44)\uC5D0 \uC218\uD559\uC774 \uC911\uC694\uD558\uB2E4\uACE0 \uD558\uB294\uB370 \uC790\uC2E0\uAC10\uC774 \uB5A8\uC5B4\uC84C\uB2E4. \uBBF8\uB798\uC9C1\uC5C5\uACFC \uAD00\uB828\uB41C \uACFC\uBAA9\uC778\uB370\uB3C4 \uD765\uBBF8\uAC00 \uC0DD\uAE30\uC9C0 \uC54A\uC544 \uB2F5\uB2F5\uD588\uB2E4.',
    companion: '\uAD50\uC0AC\uC640 \uD568\uAED8',
    location: '\uAD50\uC2E4',
    reason: '\uB0B4\uC6A9\uC774 \uB108\uBB34 \uC5B4\uB824\uC6CC\uC11C \uC218\uC5C5 \uB0B4\uB0B4 \uB4A4\uCC98\uC9C0\uB294 \uAE30\uBD84\uC774\uC5C8\uB2E4. \uC9C8\uBB38\uD558\uACE0 \uC2F6\uC5C8\uC9C0\uB9CC \uB2E4\uB978 \uC560\uB4E4 \uC55E\uC5D0\uC11C \uBAA8\uB974\uB294 \uAC83\uC744 \uB4DC\uB7EC\uB0B4\uAE30\uAC00 \uBD80\uB2F4\uC2A4\uB7EC\uC6E0\uB2E4. \uACB0\uAD6D \uD63C\uC790 \uB0A8\uACA8\uC9C4 \uB290\uB08C\uC774 \uB4E4\uC5B4 \uBB34\uAE30\uB825\uD574\uC84C\uB2E4.'
  };

  var PLACEHOLDERS = {
    positive: {
      activity: '\uC608: \uC9C4\uB85C \uD0D0\uC0C9 \uC218\uC5C5\uC5D0\uC11C \uAD00\uC2EC \uC788\uB294 \uC9C1\uC5C5\uAD70\uC5D0 \uB300\uD574 \uC870\uC0AC \uBC1C\uD45C\uB97C \uD588\uB2E4. \uBBF8\uB798 \uD76C\uB9DD \uBC0F \uC804\uACF5\uC5D0 \uB300\uD574 \uAD6C\uCCB4\uC801\uC73C\uB85C \uC0DD\uAC01\uD574 \uBCFC \uC218 \uC788\uC5C8\uB2E4. \uCE5C\uAD6C\uB4E4\uC758 \uBC1C\uD45C\uB3C4 \uB4E4\uC73C\uBA70 \uB2E4\uC591\uD55C \uC9C4\uB85C\uB97C \uC54C\uAC8C \uB418\uC5C8\uB2E4.',
      reason: '\uC608: \uB9C9\uC5F0\uD588\uB358 \uBBF8\uB798\uC5D0 \uB300\uD55C \uACE0\uBBFC\uC774 \uC870\uAE08\uC529 \uC815\uB9AC\uB418\uB294 \uB290\uB08C\uC774\uC5C8\uB2E4. \uB098 \uC790\uC2E0\uC5D0 \uB300\uD55C \uC774\uD574\uAC00 \uB192\uC544\uC838\uC11C \uC758\uC695\uC774 \uC0DD\uACBC\uB2E4. \uC9C4\uB85C \uBC29\uD5A5\uC774 \uBA85\uD655\uD574\uC838\uC11C \uBCF4\uB78C\uC744 \uB290\uAF08\uB2E4.'
    },
    negative: {
      activity: '\uC608: \uAD50\uC721\uACFC\uC815 \uACFC\uBAA9\uC120\uD0DD \uC124\uBA85\uD68C\uC5D0 \uCC38\uC11D\uD588\uC9C0\uB9CC \uC815\uBCF4\uAC00 \uB108\uBB34 \uB9CE\uC544\uC11C \uD63C\uB780\uC2A4\uB7EC\uC6E0\uB2E4. \uB300\uD559 \uC785\uC2DC \uC900\uBE44(\uC0DD\uAE30\uBD80)\uC5D0 \uC5B4\uB5A4 \uACFC\uBAA9\uC774 \uC720\uB9AC\uD55C\uC9C0 \uD310\uB2E8\uC774 \uC548 \uB418\uC5C8\uB2E4. \uBBF8\uB798\uC9C1\uC5C5 \uAD00\uB828 \uD0D0\uC0C9\uC774 \uBD80\uC871\uD574 \uB9C9\uB9C9\uD55C \uAE30\uBD84\uC774\uC5C8\uB2E4.',
      reason: '\uC608: \uB0B4\uC6A9\uC774 \uB108\uBB34 \uC5B4\uB824\uC6CC\uC11C \uC218\uC5C5 \uB0B4\uB0B4 \uB4A4\uCC98\uC9C0\uB294 \uAE30\uBD84\uC774\uC5C8\uB2E4. \uC785\uC2DC \uC900\uBE44\uC5D0 \uC911\uC694\uD55C \uACFC\uBAA9\uC778\uB370 \uC790\uC2E0\uAC10\uC774 \uB5A8\uC5B4\uC838 \uB2F5\uB2F5\uD588\uB2E4. \uBBF8\uB798\uC9C1\uC5C5\uACFC \uC5F0\uACB0\uC774 \uC548 \uB418\uC5B4 \uD765\uBBF8\uAC00 \uC0DD\uAE30\uC9C0 \uC54A\uC558\uB2E4.'
    }
  };

  var positiveActivities = [];
  var negativeActivities = [];
  var positiveIdCounter = 0;
  var negativeIdCounter = 0;

  var $id = function(id) { return document.getElementById(id); };
  var pages = ['pageIntro', 'pagePositive', 'pageNegative', 'pageDemo', 'completionScreen'];

  document.addEventListener('DOMContentLoaded', function() {
    $id('phoneNumber').addEventListener('input', formatPhoneNumber);

    $id('startSurveyBtn').addEventListener('click', function() {
      var phone = $id('phoneNumber').value.trim();
      if (!phone || phone.replace(/-/g, '').length < 10) {
        showToast('\u26A0\uFE0F \uD578\uB4DC\uD3F0 \uBC88\uD638\uB97C \uC815\uD655\uD788 \uC785\uB825\uD574 \uC8FC\uC138\uC694.');
        $id('phoneNumber').focus();
        return;
      }
      navigateTo('pagePositive');
    });

    $id('backToIntroBtn').addEventListener('click', function() { navigateTo('pageIntro'); });
    $id('toNegativeBtn').addEventListener('click', function() {
      if (positiveActivities.length < MIN_ACTIVITIES) {
        showToast('\u26A0\uFE0F \uAE0D\uC815 \uD65C\uB3D9\uC744 \uCD5C\uC18C ' + MIN_ACTIVITIES + '\uAC1C \uC785\uB825\uD574 \uC8FC\uC138\uC694. (\uD604\uC7AC ' + positiveActivities.length + '\uAC1C)');
        return;
      }
      if (!validateActivities('positive')) return;
      navigateTo('pageNegative');
    });

    $id('backToPositiveBtn').addEventListener('click', function() { navigateTo('pagePositive'); });
    $id('toDemoBtn').addEventListener('click', function() {
      if (negativeActivities.length < MIN_ACTIVITIES) {
        showToast('\u26A0\uFE0F \uBD80\uC815 \uD65C\uB3D9\uC744 \uCD5C\uC18C ' + MIN_ACTIVITIES + '\uAC1C \uC785\uB825\uD574 \uC8FC\uC138\uC694. (\uD604\uC7AC ' + negativeActivities.length + '\uAC1C)');
        return;
      }
      if (!validateActivities('negative')) return;
      navigateTo('pageDemo');
    });

    $id('submitFromNegativeBtn').addEventListener('click', function() {
      if (negativeActivities.length < MIN_ACTIVITIES) {
        showToast('\u26A0\uFE0F \uBD80\uC815 \uD65C\uB3D9\uC744 \uCD5C\uC18C ' + MIN_ACTIVITIES + '\uAC1C \uC785\uB825\uD574 \uC8FC\uC138\uC694. (\uD604\uC7AC ' + negativeActivities.length + '\uAC1C)');
        return;
      }
      if (!validateActivities('negative')) return;
      handleComplete(true);
    });

    $id('backToNegativeBtn').addEventListener('click', function() { navigateTo('pageNegative'); });
    $id('completeBtn').addEventListener('click', function() { handleComplete(false); });

    $id('addPositiveBtn').addEventListener('click', function() { addActivity('positive'); });
    $id('addNegativeBtn').addEventListener('click', function() { addActivity('negative'); });

    addActivity('positive', POSITIVE_EXAMPLE);
    addActivity('negative', NEGATIVE_EXAMPLE);
  });

  function navigateTo(pageId) {
    pages.forEach(function(id) {
      var el = $id(id);
      if (el) el.classList.remove('active');
    });
    var target = $id(pageId);
    if (target) target.classList.add('active');
    updateProgressBar(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgressBar(pageId) {
    var stepMap = { 'pageIntro': 1, 'pagePositive': 2, 'pageNegative': 3, 'pageDemo': 4, 'completionScreen': 5 };
    var current = stepMap[pageId] || 1;
    document.querySelectorAll('.progress-step').forEach(function(step) {
      step.classList.remove('active', 'completed');
      var stepData = step.dataset.step;
      if (!stepData) return;
      if (stepData.includes('-')) {
        var from = parseInt(stepData.split('-')[0]);
        if (from < current) { var line = step.querySelector('.progress-step__line'); if (line) line.classList.add('completed'); }
        else { var line2 = step.querySelector('.progress-step__line'); if (line2) line2.classList.remove('completed'); }
        return;
      }
      var stepNum = parseInt(stepData);
      if (stepNum === current) step.classList.add('active');
      else if (stepNum < current) step.classList.add('completed');
    });
  }

  function addActivity(type, prefill) {
    var list = type === 'positive' ? positiveActivities : negativeActivities;
    if (list.length >= MAX_ACTIVITIES) {
      showToast('\u26A0\uFE0F \uCD5C\uB300 ' + MAX_ACTIVITIES + '\uAC1C\uAE4C\uC9C0 \uC785\uB825\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.');
      return;
    }
    var id = type === 'positive' ? ++positiveIdCounter : ++negativeIdCounter;
    list.push({ id: id, type: type });
    var container = $id(type === 'positive' ? 'positiveList' : 'negativeList');
    var card = createActivityCard(id, type, list.length, prefill || null);
    container.appendChild(card);
    updateActivityCount(type);
    updateAddButton(type);
  }

  function removeActivity(type, id) {
    var list = type === 'positive' ? positiveActivities : negativeActivities;
    var idx = list.findIndex(function(a) { return a.id === id; });
    if (idx === -1) return;
    list.splice(idx, 1);
    var card = document.querySelector('.activity-card[data-id="' + type + '-' + id + '"]');
    if (card) {
      card.style.animation = 'fadeSlideIn 0.3s ease reverse';
      setTimeout(function() { card.remove(); renumberCards(type); }, 280);
    }
    updateActivityCount(type);
    updateAddButton(type);
  }

  function renumberCards(type) {
    var container = $id(type === 'positive' ? 'positiveList' : 'negativeList');
    var cards = container.querySelectorAll('.activity-card');
    cards.forEach(function(card, i) {
      var badge = card.querySelector('.activity-card__number-badge');
      if (badge) badge.textContent = i + 1;
      var label = card.querySelector('.activity-card__number-label');
      if (label) label.textContent = '\uD65C\uB3D9 ' + (i + 1);
    });
  }

  function updateActivityCount(type) {
    var list = type === 'positive' ? positiveActivities : negativeActivities;
    var textEl = $id(type === 'positive' ? 'positiveCountText' : 'negativeCountText');
    if (textEl) textEl.textContent = '\uD65C\uB3D9 ' + list.length + '\uAC1C';
  }

  function updateAddButton(type) {
    var list = type === 'positive' ? positiveActivities : negativeActivities;
    var btn = $id(type === 'positive' ? 'addPositiveBtn' : 'addNegativeBtn');
    if (btn) btn.disabled = list.length >= MAX_ACTIVITIES;
  }

  function createActivityCard(id, type, num, prefill) {
    var card = document.createElement('div');
    card.className = 'activity-card activity-card--' + type;
    card.dataset.id = type + '-' + id;
    var isExample = !!prefill;
    var ph = PLACEHOLDERS[type];

    card.innerHTML =
      '<div class="activity-card__header">' +
        '<div class="activity-card__number">' +
          '<div class="activity-card__number-badge">' + num + '</div>' +
          '<span class="activity-card__number-label">\uD65C\uB3D9 ' + num + '</span>' +
          (isExample ? '<span style="font-size:0.7rem; color:var(--text-muted); margin-left:0.3rem;">(\uC608\uC2DC)</span>' : '') +
        '</div>' +
        '<button class="activity-card__delete" type="button" title="\uC0AD\uC81C" data-type="' + type + '" data-id="' + id + '">\u2715</button>' +
      '</div>' +
      '<div class="activity-card__grid">' +
        '<div class="form-group">' +
          '<label class="form-label">\u23F0 \uC2DC\uAC04</label>' +
          buildSelect(type + '_time_' + id, TIME_OPTIONS, prefill ? prefill.time : null) +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">\uD83D\uDC65 \uB204\uAD6C(\uAD00\uACC4)</label>' +
          buildSelect(type + '_companion_' + id, COMPANION_OPTIONS, prefill ? prefill.companion : null) +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">\uD83D\uDCCD \uC5B4\uB514\uC11C</label>' +
          buildSelect(type + '_location_' + id, LOCATION_OPTIONS, prefill ? prefill.location : null) +
        '</div>' +
        '<div class="form-group" style="grid-column: 1 / -1;">' +
          '<label class="form-label">\uD83D\uDCDD \uD65C\uB3D9\uB0B4\uC6A9 (\uBB34\uC5C7\uC744 \uD588\uB098\uC694?)</label>' +
          '<textarea class="form-textarea" id="' + type + '_activity_' + id + '" placeholder="' + ph.activity + '" rows="3">' + (prefill ? prefill.activity : '') + '</textarea>' +
        '</div>' +
      '</div>' +
      '<div class="emotion-group">' +
        '<div class="likert-hint"><span>1 = \uC804\uD600 \uC544\uB2C8\uB2E4</span><span>7 = \uB9E4\uC6B0 \uADF8\uB807\uB2E4</span></div>' +
        EMOTIONS.map(function(group) {
          return '<div style="margin-bottom: 0.5rem;">' +
            '<div class="emotion-group__title emotion-group__title--' + group.color + '">' + group.icon + ' ' + group.label + '</div>' +
            group.items.map(function(emo) {
              return '<div class="likert-item">' +
                '<span class="likert-item__label">' + emo.label + '</span>' +
                '<div class="likert-scale">' +
                [1,2,3,4,5,6,7].map(function(v) {
                  return '<label class="likert-radio"><input type="radio" name="' + type + '_' + emo.key + '_' + id + '" value="' + v + '"><span>' + v + '</span></label>';
                }).join('') +
                '</div></div>';
            }).join('') +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="form-group" style="margin-top: 0.8rem;">' +
        '<label class="form-label">\uD83D\uDCAC \uADF8\uB807\uAC8C \uB290\uB080 \uC774\uC720</label>' +
        '<textarea class="form-textarea" id="' + type + '_reason_' + id + '" placeholder="' + ph.reason + '" rows="2">' + (prefill ? prefill.reason : '') + '</textarea>' +
      '</div>';

    card.querySelector('.activity-card__delete').addEventListener('click', function(e) {
      var t = e.currentTarget.dataset.type;
      var aid = parseInt(e.currentTarget.dataset.id);
      removeActivity(t, aid);
    });
    return card;
  }

  function buildSelect(name, options, selectedValue) {
    var opts = options.map(function(opt) {
      var selected = opt === selectedValue ? 'selected' : '';
      return '<option value="' + opt + '" ' + selected + '>' + opt + '</option>';
    }).join('');
    return '<select class="form-select" id="' + name + '" onchange="document.getElementById(\'' + name + '_etc\').style.display = this.value === \'\uAE30\uD0C0\' ? \'block\' : \'none\'">' +
      '<option value="">\uC120\uD0DD</option>' + opts + '</select>' +
      '<input type="text" class="form-input" id="' + name + '_etc" placeholder="\uC9C1\uC811 \uC785\uB825\uD574 \uC8FC\uC138\uC694" style="display:' + (selectedValue === '\uAE30\uD0C0' ? 'block' : 'none') + '; margin-top:0.4rem; font-size:0.85rem;" />';
  }

  function validateActivities(type) {
    var list = type === 'positive' ? positiveActivities : negativeActivities;
    for (var i = 0; i < list.length; i++) {
      var a = list[i];
      var prefix = type + '_';
      var id = a.id;
      var time = document.getElementById(prefix + 'time_' + id);
      var activity = document.getElementById(prefix + 'activity_' + id);
      if (!time || !time.value) {
        showToast('\u26A0\uFE0F \uD65C\uB3D9 ' + (i + 1) + '\uC758 \uC2DC\uAC04\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.');
        return false;
      }
      if (!activity || !activity.value.trim()) {
        showToast('\u26A0\uFE0F \uD65C\uB3D9 ' + (i + 1) + '\uC758 \uD65C\uB3D9\uB0B4\uC6A9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.');
        if (activity) activity.focus();
        return false;
      }
      var hasEmotion = false;
      for (var g = 0; g < EMOTIONS.length; g++) {
        for (var e = 0; e < EMOTIONS[g].items.length; e++) {
          var val = document.querySelector('input[name="' + prefix + EMOTIONS[g].items[e].key + '_' + id + '"]:checked');
          if (val) { hasEmotion = true; break; }
        }
        if (hasEmotion) break;
      }
      if (!hasEmotion) {
        showToast('\u26A0\uFE0F \uD65C\uB3D9 ' + (i + 1) + '\uC758 \uC815\uC11C\uB97C \uCD5C\uC18C 1\uAC1C \uC774\uC0C1 \uC751\uB2F5\uD574 \uC8FC\uC138\uC694.');
        return false;
      }
    }
    return true;
  }

  function collectActivityData(type) {
    var list = type === 'positive' ? positiveActivities : negativeActivities;
    return list.map(function(a, idx) {
      var prefix = type + '_';
      var id = a.id;
      function getVal(field) {
        var sel = document.getElementById(prefix + field + '_' + id);
        var etc = document.getElementById(prefix + field + '_' + id + '_etc');
        if (sel && sel.value === '\uAE30\uD0C0' && etc && etc.value.trim()) return '\uAE30\uD0C0: ' + etc.value.trim();
        return sel ? sel.value : '';
      }
      var data = {
        activityNum: idx + 1,
        time: getVal('time'),
        activity: (document.getElementById(prefix + 'activity_' + id) || {}).value || '',
        companion: getVal('companion'),
        location: getVal('location'),
        reason: (document.getElementById(prefix + 'reason_' + id) || {}).value || ''
      };
      for (var g = 0; g < EMOTIONS.length; g++) {
        for (var e = 0; e < EMOTIONS[g].items.length; e++) {
          var emo = EMOTIONS[g].items[e];
          var checked = document.querySelector('input[name="' + prefix + emo.key + '_' + id + '"]:checked');
          data[emo.key] = checked ? parseInt(checked.value) : '';
        }
      }
      return data;
    });
  }

  function handleComplete(skipDemo) {
    var gender = '', schoolLocation = '', schoolType = '', careerDecision = '';
    if (!skipDemo) {
      var genderEl = document.querySelector('input[name="gender"]:checked');
      var locEl = $id('schoolLocation');
      var typeEl = $id('schoolType');
      var careerEl = document.querySelector('input[name="careerDecision"]:checked');
      gender = genderEl ? genderEl.value : '';
      schoolLocation = locEl ? locEl.value : '';
      schoolType = typeEl ? typeEl.value : '';
      careerDecision = careerEl ? careerEl.value : '';
      if (!gender) { showToast('\u26A0\uFE0F \uC131\uBCC4\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.'); return; }
      if (!schoolLocation) { showToast('\u26A0\uFE0F \uD559\uAD50 \uC18C\uC7AC\uC9C0\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.'); return; }
      if (!schoolType) { showToast('\u26A0\uFE0F \uD559\uAD50 \uC720\uD615\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.'); return; }
      if (!careerDecision) { showToast('\u26A0\uFE0F \uC9C4\uB85C \uACB0\uC815 \uC5EC\uBD80\uB97C \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.'); return; }
    }
    navigateTo('completionScreen');
    var payload = {
      phoneNumber: $id('phoneNumber').value.trim(),
      positiveActivities: collectActivityData('positive'),
      negativeActivities: collectActivityData('negative'),
      demographics: { gender: gender, schoolLocation: schoolLocation, schoolType: schoolType, careerDecision: careerDecision }
    };
    fetch(APP_CONFIG.GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function() {
      var statusEl = $id('submitStatus');
      statusEl.classList.add('submit-status--success');
      statusEl.innerHTML = '<span style="font-size:1.2rem;">\u2705</span><span class="submit-status__text">\uC751\uB2F5\uC774 \uC131\uACF5\uC801\uC73C\uB85C \uC81C\uCD9C\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAC10\uC0AC\uD569\uB2C8\uB2E4!</span>';
    }).catch(function(err) {
      console.error('Submit error:', err);
      var statusEl = $id('submitStatus');
      statusEl.classList.add('submit-status--error');
      statusEl.innerHTML = '<span style="font-size:1.2rem;">\u274C</span><span class="submit-status__text">\uC81C\uCD9C \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.</span>';
    });
  }

  function formatPhoneNumber(e) {
    var val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    if (val.length > 7) val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7);
    else if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3);
    e.target.value = val;
  }

  var toastTimer;
  function showToast(msg) {
    var toast = $id('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 3000);
  }

})();
