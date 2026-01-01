```js
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
    if (window.scrollY > 0) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
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
      // voorkom dubbel binden
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

        // viewer in beeld brengen (fijn voor toetsenbord/voorlezen)
        frameWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // init
  bindDocLinks(document);

  // Protocol sluiten
  closeButton.addEventListener('click', function () {
    viewer.src = "";
    frameWrapper.style.display = 'none';
    placeholder.style.display = 'block';
    closeButton.classList.remove('visible');
  });
})();

/* ============================
   KAART MET PRAKTIJKEN + FILTERS
   - Meerdere disciplines per locatie
   - Blokjes naast elkaar, verschillende kleuren
   - Per discipline aan/uit binnen hetzelfde icoon
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

  // ---- LOCATIES ----
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

  // ---- GROEPEN MAKEN OP BASIS VAN LAT/LNG ----
  var groupsByLocation = {};
  praktijken.forEach(function (p) {
    var key = p.lat + ',' + p.lng;
    if (!groupsByLocation[key]) {
      groupsByLocation[key] = { lat: p.lat, lng: p.lng, items: [] };
    }
    groupsByLocation[key].items.push(p);
  });

  var markers = [];

  Object.keys(groupsByLocation).forEach(function (key) {
    var group = groupsByLocation[key];
    var items = group.items;

    var uniqueDisciplines = [];
    items.forEach(function (item) {
      if (uniqueDisciplines.indexOf(item.discipline) === -1) {
        uniqueDisciplines.push(item.discipline);
      }
    });

    var blocksHtml = uniqueDisciplines.map(function (d) {
      var label = getLabel(d);
      var dClass = getDisciplineClass(d);
      return '<div class="discipline-marker discipline-marker--' + dClass + '">' + label + '</div>';
    }).join('');

    var iconHtml = '<div class="discipline-marker-group">' + blocksHtml + '</div>';
    var iconWidth = (uniqueDisciplines.length * 22) + 8;

    var icon = L.divIcon({
      html: iconHtml,
      className: '',
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

  // ---- DISCIPLINE-FILTERS ----
  var checkboxes = document.querySelectorAll('.discipline-filters input[type="checkbox"]');

  function updateMarkers() {
    if (!checkboxes.length) return;

    var active = [];
    checkboxes.forEach(function (cb) {
      if (cb.checked) active.push(cb.value);
    });
    var activeSet = new Set(active);

    markers.forEach(function (marker) {
      var activeForMarker = marker.disciplines.filter(function (d) {
        return activeSet.has(d);
      });

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

      var iconHtml = '<div class="discipline-marker-group">' + blocksHtml + '</div>';
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
```
