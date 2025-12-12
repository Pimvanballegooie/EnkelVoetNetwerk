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
    });
  });

  // Protocol sluiten
  closeButton.addEventListener('click', function () {
    viewer.src = "";
    frameWrapper.style.display = 'none';
    placeholder.style.display = 'block';
  });
})();


// KAART MET PRAKTIJKEN
(function () {
  const map = L.map('praktijkMap').setView([51.589, 4.775], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap-bijdragers'
  }).addTo(map);

  const praktijken = [
    {
      naam: 'Monné Zorg & Beweging – Belcrum (Hoofdlocatie)',
      adres: 'Industriekade 10, Breda',
      lat: 51.5987,
      lng: 4.7701
    },
    {
      naam: 'Monné Zorg & Beweging – Ginneken',
      adres: 'Burgemeester Middelaerlaan 1, Breda',
      lat: 51.5686,
      lng: 4.7892
    },
    {
      naam: 'Monné Zorg & Beweging – Breda Noord',
      adres: 'Bernard de Wildestraat 400A, Breda',
      lat: 51.6083,
      lng: 4.7978
    },
    {
      naam: 'Monné Zorg & Beweging – Haagse Beemden',
      adres: 'Hondsdonk 58, Breda',
      lat: 51.6063,
      lng: 4.7440
    },
    {
      naam: 'Monné Zorg & Beweging – Oosterhout (Vrachelen)',
      adres: 'Merijntje Gijzenstraat 3e, Oosterhout',
      lat: 51.6520,
      lng: 4.8362
    }
  ];

  praktijken.forEach(p => {
    L.marker([p.lat, p.lng])
      .addTo(map)
      .bindPopup(`<strong>${p.naam}</strong><br>${p.adres}`);
  });
})();
