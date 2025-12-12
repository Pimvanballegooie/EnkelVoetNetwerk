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

  // Marker labels
  function getLabel(discipline) {
    return {
      'Fysiotherapeut': 'F',
      'Pedicure': 'Pe',
      'Podotherapeut': 'Po',
      'Orthopedisch schoenmaker': 'O'
    }[discipline] || '?';
  }

  const praktijken = [
    {
      naam: 'Monné Zorg & Beweging – Belcrum (Hoofdlocatie)',
      adres: 'Industriekade 10, 4815 HD Breda',
      lat: 51.598725757929074,
      lng: 4.770189527371777,
      discipline: 'Fysiotherapeut'
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
    },
    {
      naam: 'Alewijnse Podotherapie',
      adres: 'Industriekade 10, 4815 HD Breda',
      lat: 51.598725757929074,
      lng: 4.770189527371777,
      discipline: 'Podotherapeut'
    },
   
  ];

  const markers = [];

  // Toevoegen markers
  praktijken.forEach(p => {
    const icon = L.divIcon({
      html: `<div class="discipline-marker">${getLabel(p.discipline)}</div>`,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    const marker = L.marker([p.lat, p.lng], { icon })
      .bindPopup(
        `<strong>${p.naam}</strong><br>${p.adres}<br>${p.discipline}`
      )
      .addTo(map);

    marker.discipline = p.discipline;
    markers.push(marker);
  });

  // Discipline-filters
  const checkboxes = document.querySelectorAll('.discipline-filters input[type="checkbox"]');

  function updateMarkers() {
    const active = new Set(
      [...checkboxes].filter(c => c.checked).map(c => c.value)
    );

    markers.forEach(marker => {
      if (active.has(marker.discipline)) {
        if (!map.hasLayer(marker)) marker.addTo(map);
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
      }
    });
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateMarkers));

  updateMarkers();
})();
