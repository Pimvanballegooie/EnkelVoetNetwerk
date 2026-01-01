/* script.js */

/* ============================
   AUTOMATISCHE HEADER OFFSET
============================ */
(function () {
  var header = document.querySelector('header');
  if (!header) return;

  function updateHeaderOffset() {
    var height = header.offsetHeight;
    document.documentElement.style.setProperty('--header-offset', (height + 10) + 'px');
  }

  updateHeaderOffset();
  window.addEventListener('resize', updateHeaderOffset);
})();

/* ============================
   HEADER SCROLL EFFECT
============================ */
(function () {
  var header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) header.classList.add('header-scrolled');
    else header.classList.remove('header-scrolled');
  });
})();

/* ============================
   MOBIEL NAVIGATIE MENU
============================ */
(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('nav-toggle-open');
    mainNav.classList.toggle('nav-open');
  });
})();

/* ============================
   GOOGLE DOC VIEWER
============================ */
(function () {
  var viewer = document.getElementById('docViewer');
  var placeholder = document.querySelector('.viewer-placeholder');
  var frameWrapper = document.querySelector('.viewer-frame-wrapper');
  var closeButton = document.getElementById('closeProtocolButton');

  if (!viewer || !placeholder || !frameWrapper || !closeButton) return;

  function bindDocLinks(root) {
    var links = root.querySelectorAll('a.doc-link[data-doc-url]');
    links.forEach(function (link) {
      if (link.dataset.bound === '1') return;
      link.dataset.bound = '1';

      link.addEventListener('click', function (e) {
        e.preventDefault();
        var url = link.getAttribute('data-doc-url');
        if (!url || url === '#') return;

        viewer.src = url;
        frameWrapper.style.display = 'block';
        placeholder.style.display = 'none';
        closeButton.classList.add('visible');

        frameWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  bindDocLinks(document);

  closeButton.addEventListener('click', function () {
    viewer.src = '';
    frameWrapper.style.display = 'none';
    placeholder.style.display = 'block';
    closeButton.classList.remove('visible');
  });
})();

/* ============================
   KAART MET PRAKTIJKEN + FILTERS
============================ */
(function () {
  if (typeof L === 'undefined') return;

  var mapElement = document.getElementById('praktijkMap');
  if (!mapElement) return;

  var map = L.map('praktijkMap').setView([51.589, 4.775], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap-bijdragers'
  }).addTo(map);

  function getLabel(discipline) {
    var mapDisc = {
      'Fysiotherapeut': 'F',
      'Pedicure': 'Pe',
      'Podotherapeut': 'Po',
      'Orthopedisch schoenmaker': 'O'
    };
    return mapDisc[discipline] || '?';
  }

  function getDisciplineClass(discipline) {
    var mapClass = {
      'Fysiotherapeut': 'fysio',
      'Pedicure': 'pedicure',
      'Podotherapeut': 'podo',
      'Orthopedisch schoenmaker': 'os'
    };
    return mapClass[discipline] || 'default';
  }

  var praktijken = [
    {
      naam: 'Monné Zorg & Beweging – Belcrum (Hoofdlocatie)',
      adres: 'Industriekade 10, 4815 HD Breda',
      lat: 51.598725757929074,
      lng: 4.770189527371777,
      discipline: 'Fysiotherapeut'
    },
    {
      naam: 'Alewijnse Podotherapie – Belcrum',
      adres: 'Industriekade 10, 4815 HD Breda',
      lat: 51.598725757929074,
      lng: 4.770189527371777,
      discipline: 'Podotherapeut'
    },
    {
      naam: 'Monné Zorg & Beweging – Ginneken',
      adres: 'Burgemeester Middelaerlaan 1, 4835 EK Breda',
      lat: 51.568638372658555,
      lng: 4.789287581342219,
      discipline: 'Fysiotherapeut'
    },
    {
      naam: 'Monné Zorg & Beweging – Breda Noord',
      adres: 'Bernard de Wildestraat 400A, 4827 EG Breda',
      lat: 51.60827779458874,
      lng: 4.797783781344767,
      discipline: 'Fysiotherapeut'
    },
    {
      naam: 'Monné Zorg & Beweging – Haagse Beemden',
      adres: 'Hondsdonk 58, 4824 CG Breda',
      lat: 51.60639160124465,
      lng: 4.744034407824659,
      discipline: 'Fysiotherapeut'
    },
    {
      naam: 'Monné Zorg & Beweging – Oosterhout (Vrachelen)',
      adres: 'Merijntje Gijzenstraat 3e, 4906 EA Oosterhout',
      lat: 51.6520346736143,
      lng: 4.836288659875928,
      discipline: 'Fysiotherapeut'
    }
  ];

  var groupsByLocation = {};
  praktijken.forEach(function (p) {
    var key = p.lat + ',' + p.lng;
    if (!groupsByLocation[key]) groupsByLocation[key] = { lat: p.lat, lng: p.lng, items: [] };
    groupsByLocation[key].items.push(p);
  });

  var markers = [];

  Object.keys(groupsByLocation).forEach(function (key) {
    var group = groupsByLocation[key];
    var items = group.items;

    var uniqueDisciplines = [];
    items.forEach(function (item) {
      if (uniqueDisciplines.indexOf(item.discipline) === -1) uniqueDisciplines.push(item.discipline);
    });

    var blocksHtml = uniqueDisciplines.map(function (d) {
      var label = getLabel(d);
      var dClass = getDisciplineClass(d);
      return '<div class="discipline-marker discipline-marker--' + dClass + '">' + label + '</div>';
    }).join('');

    var iconHtml = '<div class="discipline-marker-group" role="img" aria-label="Disciplines">' + blocksHtml + '</div>';
    var iconWidth = (uniqueDisciplines.length * 22) + 8;

    var icon = L.divIcon({
      html: iconHtml,
      className: '', // bewust leeg: we stylen via .discipline-marker*
      iconSize: [iconWidth, 26],
      iconAnchor: [iconWidth / 2, 26]
    });

    var popupLines = items.map(function (i) {
      return '<strong>' + i.naam + '</strong><br>' + i.adres + '<br>' + i.discipline;
    });
    var popupHtml = popupLines.join('<hr style="margin:4px 0;" />');

    var marker = L.marker([group.lat, group.lng], { icon: icon })
      .bindPopup(popupHtml)
      .addTo(map);

    marker.disciplines = uniqueDisciplines;
    markers.push(marker);
  });

  var checkboxes = document.querySelectorAll('.discipline-filters input[type="checkbox"]');

  function updateMarkers() {
    if (!checkboxes.length) return;

    var active = [];
    checkboxes.forEach(function (cb) { if (cb.checked) active.push(cb.value); });
    var activeSet = new Set(active);

    markers.forEach(function (marker) {
      var activeForMarker = marker.disciplines.filter(function (d) { return activeSet.has(d); });

      if (activeForMarker.length === 0) {
        if (map.hasLayer(marker)) map.removeLayer(marker);
        return;
      }

      if (!map.hasLayer(marker)) marker.addTo(map);

      var blocksHtml = activeForMarker.map(function (d) {
        var label = getLabel(d);
        var dClass = getDisciplineClass(d);
        return '<div class="discipline-marker discipline-marker--' + dClass + '">' + label + '</div>';
      }).join('');

      var iconHtml = '<div class="discipline-marker-group" role="img" aria-label="Disciplines">' + blocksHtml + '</div>';
      var iconWidth = (activeForMarker.length * 22) + 8;

      var newIcon = L.divIcon({
        html: iconHtml,
        className: '',
        iconSize: [iconWidth, 26],
        iconAnchor: [iconWidth / 2, 26]
      });

      marker.setIcon(newIcon);
    });
  }

  checkboxes.forEach(function (cb) {
    cb.addEventListener('change', updateMarkers);
  });

  updateMarkers();
})();

/* ============================
   VOORLEZEN (Web Speech API)
   Verwacht standaard:
   - #speakPageButton
   - #stopSpeakButton
   - #speechRate  (input[type="range"])
   Alternatief (als je liever classes gebruikt):
   - .tts-speak
   - .tts-stop
   - .tts-rate
============================ */
(function () {
  var speakBtn =
    document.getElementById('speakPageButton') ||
    document.querySelector('.tts-speak');

  var stopBtn =
    document.getElementById('stopSpeakButton') ||
    document.querySelector('.tts-stop');

  var rateInput =
    document.getElementById('speechRate') ||
    document.querySelector('.tts-rate');

  // Als de knoppen niet bestaan: niets doen (pagina blijft werken)
  if (!speakBtn || !stopBtn || !rateInput) return;

  function supported() {
    return (
      typeof window.speechSynthesis !== 'undefined' &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    );
  }

  function getReadableText() {
    // Lees alleen de hoofdinhoud, niet de header/navigatie
    var main = document.querySelector('main');
    if (!main) return (document.body && document.body.innerText) ? document.body.innerText : '';
    return main.innerText || '';
  }

  function pickDutchVoice() {
    var voices = window.speechSynthesis.getVoices() || [];
    // voorkeur: nl-* voice
    var v = voices.find(function (x) {
      return (x.lang || '').toLowerCase().indexOf('nl') === 0;
    });
    return v || null;
  }

  function setUi(isSpeaking) {
    speakBtn.disabled = !!isSpeaking;
    stopBtn.disabled = !isSpeaking;
  }

  function speakNow() {
    if (!supported()) {
      alert('Voorlezen wordt niet ondersteund in deze browser. Probeer Chrome, Edge of Safari.');
      return;
    }

    window.speechSynthesis.cancel();

    var text = (getReadableText() || '').trim();
    if (!text) return;

    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'nl-NL';

    var rate = parseFloat(rateInput.value || '1');
    if (isNaN(rate)) rate = 1;
    utter.rate = Math.max(0.6, Math.min(1.4, rate));

    var voice = pickDutchVoice();
    if (voice) utter.voice = voice;

    utter.onend = function () { setUi(false); };
    utter.onerror = function () { setUi(false); };

    setUi(true);
    window.speechSynthesis.speak(utter);
  }

  // Sommige browsers laden voices pas later
  if (supported()) {
    window.speechSynthesis.onvoiceschanged = function () {
      pickDutchVoice();
    };
  }

  speakBtn.addEventListener('click', function () {
    if (!supported()) return;
    // "warm-up" voices (helpt in o.a. Chrome/Edge)
    window.speechSynthesis.getVoices();
    speakNow();
  });

  stopBtn.addEventListener('click', function () {
    if (!supported()) return;
    window.speechSynthesis.cancel();
    setUi(false);
  });

  // init state
  setUi(false);
})();
