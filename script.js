// GOOGLE DOC VIEWER
(function () {
  const viewer = document.getElementById('docViewer');
  const placeholder = document.querySelector('.viewer-placeholder');
  const frameWrapper = document.querySelector('.viewer-frame-wrapper');

  const links = document.querySelectorAll('a.doc-link[data-doc-url]');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const url = this.getAttribute('data-doc-url');
      if (!url || url === '#') return;

      viewer.src = url;
      placeholder.style.display = 'none';
      frameWrapper.style.display = 'block';
    });
  });
})();

// KAART MET PRAKTIJKEN
(function () {
  // Maak de kaart, gecentreerd rond Breda
  const map = L.map('praktijkMap').setView([51.589, 4.775], 11);

  // OpenStreetMap tegel-laag
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap-bijdragers'
  }).addTo(map);

  // Lijst van Monné-locaties
  const praktijken = [
    {
      naam: 'Monné Zorg & Beweging – Belcrum (Hoofdlocatie)',
      adres: 'Industriekade 10, 4815 HD Breda',
      lat: 51.598725757929074,
      lng: 4.770189527371777
    },
    {
      naam: 'Monné Zorg & Beweging – Ginneken',
      adres: 'Burgemeester Middelaerlaan 1, 4835 EK Breda',
      lat: 51.568638372658555,
      lng: 4.789287581342219
    },
    {
      naam: 'Monné Zorg & Beweging – Breda Noord',
      adres: 'Bernard de Wildestraat 400A, 4827 EG Breda',
      lat: 51.60827779458874,
      lng: 4.797783781344767
    },
    {
      naam: 'Monné Zorg & Beweging – Haagse Beemden',
      adres: 'Hondsdonk 58, 4824 CG Breda',
      lat: 51.60639160124465,
      lng: 4.744034407824659
    },
    {
      naam: 'Monné Zorg & Beweging – Oosterhout (Vrachelen)',
      adres: 'Merijntje Gijzenstraat 3e, 4906 EA Oosterhout',
      lat: 51.6520346736143,
      lng: 4.836288659875928
    }
  ];

  praktijken.forEach(p => {
    const marker = L.marker([p.lat, p.lng]).addTo(map);
    marker.bindPopup(
      '<strong>' + p.naam + '</strong><br/>' +
      p.adres
    );
  });
})();
