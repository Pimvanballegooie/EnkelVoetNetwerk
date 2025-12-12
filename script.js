// GOOGLE DOC VIEWER + SLUITKNOP
(function () {
  const viewer = document.getElementById('docViewer');
  const placeholder = document.querySelector('.viewer-placeholder');
  const frameWrapper = document.querySelector('.viewer-frame-wrapper');
  const closeButton = document.getElementById('closeProtocolButton');

  const links = document.querySelectorAll('a.doc-link[data-doc-url]');

  // Protocol openen
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const url = this.getAttribute('data-doc-url');
      if (!url || url === '#') return;

      viewer.src = url;
      frameWrapper.style.display = 'block';
      placeholder.style.display = 'none';

      // Sluit-knop zichtbaar maken
      if (closeButton) {
        closeButton.classList.add('visible');
      }
    });
  });

  // Protocol sluiten
  if (closeButton) {
    closeButton.addEventListener('click', function () {
      viewer.src = "";
      frameWrapper.style.display = 'none';
      placeholder.style.display = 'block';

      // Sluit-knop weer verbergen
      closeButton.classList.remove('visible');
    });
  }
})();


// KAART MET PRAKTIJKEN + DISCIPLINE-FILTERS
(function () {
  const map = L.map('praktijkMap').setView([51.589, 4.775], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap-bijdragers'
  }).addTo(map);

  // Mapping discipline -> label in marker
  function getDisciplineLabel(discipline) {
    switch (discipline) {
      case 'Fysiotherapeut':
        return 'F';
      case 'Pedicure':
        return 'Pe';
      case 'Podotherapeut':
        return 'Po';
      case 'Orthopedisch schoenmaker':
        return 'O';
      default:
        return '?';
    }
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
    }
  ];

  const markers = [];

  praktijken.forEach(p => {
    const label = getDisciplineLabel(p.discipline);

    const icon = L.divIcon({
      className: 'discipline-marker-wrapper',
      html: `<div class="discipline-marker">${label}</div>`,
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
    const activeDisciplines = new Set();
    checkboxes.forEach(cb => {
      if (cb.checked) {
        activeDisciplines.add(cb.value);
      }
    });

    markers.forEach(marker => {
      if (activeDisciplines.has(marker.discipline)) {
        if (!map.hasLayer(marker)) {
          marker.addTo(map);
        }
      } else {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      }
    });
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateMarkers);
  });

  // Initiale sync
  updateMarkers();
})();
