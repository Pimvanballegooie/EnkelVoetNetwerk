/* ============================
   AUTOMATISCHE HEADER OFFSET
============================ */
(function () {
  const header = document.querySelector('header');
  if (!header) return;

  function updateHeaderOffset() {
    const height = header.offsetHeight;
    document.documentElement.style.setProperty('--header-offset', `${height + 10}px`);
  }

  updateHeaderOffset();
  window.addEventListener('resize', updateHeaderOffset);
})();

/* ============================
   HEADER SCROLL EFFECT
============================ */
(function () {
  const header = document.querySelector('header');
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
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('nav-toggle-open');
    mainNav.classList.toggle('nav-open');
  });
})();

/* ============================
   GOOGLE DOC VIEWER
============================ */
(function () {
  const viewer = document.getElementById('docViewer');
  const placeholder = document.querySelector('.viewer-placeholder');
  const frameWrapper = document.querySelector('.viewer-frame-wrapper');
  const closeButton = document.getElementById('closeProtocolButton');

  if (!viewer || !placeholder || !frameWrapper || !closeButton) return;

  const links = document.querySelectorAll('a.doc-link[data-doc-url]');

  // Protocol openen
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const url = link.getAttribute('data-doc-url');
      if (!url || url === '#') return;

      viewer.src = url;
      frameWrapper.style.display = 'block';
      placeholder.style.display = 'none';

      closeButton.classList.add('visible');
    });
  });

  // Protocol sluiten
  closeButton.addEventListener('click', () => {
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
============================ */
(function () {
  if (typeof L === 'undefined') return;

  const mapElement = document.getElementById('praktijkMap');
  if (!mapElement) return;

  const map = L.map('praktijkMap').setView([51.589, 4.775], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap-bijdragers'
  }).addTo(map);

  // Label op de blokjes
  function getLabel(discipline) {
    return {
      'Fysiotherapeut': 'F',
      'Pedicure': 'Pe',
      'Podotherapeut': 'Po',
      'Orthopedisch schoenmaker': 'O'
    }[discipline] || '?';
  }

  // CSS-klasse per discipline (voor kleur in CSS)
  function getDisciplineClass(discipline) {
    return {
      'Fysiotherapeut': 'fysio',
      'Pedicure': 'pedicure',
      'Podotherapeut': 'podo',
      'Orthopedisch schoenmaker': 'os'
    }[discipline] || 'default';
  }

  // ---- HIER JE LOCATIES ----
  // Je mag hier meerdere regels met dezelfde lat/lng hebben,
  // maar MET verschillende disciplines.
  const praktijken = [
    {
      naam: 'Monné Zorg & Beweging – Belcrum',
      adres: 'Industriekade 10, 4815 HD Breda',
      lat: 51.598725757929074,
      lng: 4.770189527371777,
      discipline: 'Fysiotherapeut'
    },
    // voorbeeld: zelfde locatie met extra discipline Podotherapeut
    // {
    //   naam: 'Monné Zorg & Beweging – Belcrum (Hoofdlocatie)',
    //   adres: 'Industriekade 10, 4815 HD Breda',
    //   lat: 51.598725757929074,
    //   lng: 4.770189527371777,
    //   discipline: 'Podotherapeut'
    // },

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
    {
      naam: 'Alewijnse Podotherapie - Belcrum',
      adres: 'Industriekade 10, 4815 HD Breda',
      lat: 51.598725757929074,
      lng: 4.770189527371777,
      discipline: 'Podotherapie'
    },
     
  ];

  // ---- GROEPEN MAKEN OP BASIS VAN LAT/LNG ----
  const groupsMap = new Map();

  praktijken.forEach(p => {
    const key = `${p.lat},${p.lng}`;
    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        lat: p.lat,
        lng: p.lng,
        items: []
      });
    }
    groupsMap.get(key).items.push(p);
  });

  const markers = [];

  // Voor elke unieke locatie één marker met blokjes naast elkaar
  groupsMap.forEach(group => {
    const { lat, lng, items } = group;

    // Alle disciplines voor deze locatie
    const disciplines = items.map(i => i.discipline);
    const uniqueDisciplines = [...new Set(disciplines)];

    // HTML voor het icoon: een "group" met blokjes naast elkaar
    const blocksHtml = uniqueDisciplines.map(d => {
      const label = getLabel(d);
      const dClass = getDisciplineClass(d);
      return `<div class="discipline-marker discipline-marker--${dClass}">${label}</div>`;
    }).join('');

    const iconHtml = `<div class="discipline-marker-group">${blocksHtml}</div>`;

    const icon = L.divIcon({
      html: iconHtml,
      className: '',
      iconSize: [uniqueDisciplines.length * 22 + 8, 26],
      iconAnchor: [ (uniqueDisciplines.length * 22 + 8) / 2, 26 ]
    });

    // Popuptekst met alle namen + disciplines
    const popupLines = items.map(i => {
      return `<strong>${i.naam}</strong><br>${i.adres}<br>${i.discipline}`;
    });
    const popupHtml = popupLines.join('<hr style="margin:4px 0;" />');

    const marker = L.marker([lat, lng], { icon })
      .bindPopup(popupHtml)
      .addTo(map);

    // Bewaar alle disciplines van deze marker voor filtering
    marker.disciplines = uniqueDisciplines;
    markers.push(marker);
  });

  // ---- DISCIPLINE-FILTERS ----
  const checkboxes = document.querySelectorAll('.discipline-filters input[type="checkbox"]');

  function updateMarkers() {
    const active = new Set(
      [...checkboxes].filter(c => c.checked).map(c => c.value)
    );

    markers.forEach(marker => {
      // Toon marker als minimaal één discipline actief is
      const hasActive = marker.disciplines.some(d => active.has(d));
      if (hasActive) {
        if (!map.hasLayer(marker)) marker.addTo(map);
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
      }
    });
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateMarkers));

  updateMarkers();
})();
