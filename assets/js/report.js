document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggleBtn = document.querySelector('#dropdown-toggle');
  const dropdownsContainer = document.querySelector('#dropdowns-container');
  const kabupatenDropdown = document.querySelector('#kabupaten-dropdown');
  const kecamatanDropdown = document.querySelector('#kecamatan-dropdown');
  const imageContainer = document.querySelector('#image-container');
  const selectedImage = document.querySelector('#selected-image');
  const dataTableBody = document.querySelector('#data-table tbody');

  let kecamatanData = {};
  let geoJsonData = []; // Menyimpan data dari GeoJSON

  // Toggle dropdowns display
  dropdownToggleBtn.addEventListener('click', () => {
      dropdownsContainer.style.display = 
          (dropdownsContainer.style.display === 'none' || dropdownsContainer.style.display === '') ? 'block' : 'none';
      
      // Isi tabel dengan seluruh data kabupaten saat tombol ditekan
      populateKabupatenTable();
  });

  // Fetch JSON data untuk dropdown kabupaten dan kecamatan
  fetch('assets/data/kecamatan.json')
      .then(response => response.json())
      .then(data => {
          // Populate kabupaten dropdown
          for (const kabupaten in data) {
              const option = document.createElement('option');
              option.value = kabupaten;
              option.textContent = kabupaten;
              kabupatenDropdown.appendChild(option);
          }

          // Store kecamatan data for each kabupaten
          kecamatanData = data;
      })
      .catch(error => console.error('Error loading JSON:', error));

  // Fetch GeoJSON data untuk populasi tabel
  fetch('assets/data/data.geojson')
      .then(response => response.json())
      .then(data => {
          geoJsonData = data.features;
      })
      .catch(error => console.error('Error loading GeoJSON:', error));

  // Populate kecamatan dropdown based on selected kabupaten
  kabupatenDropdown.addEventListener('change', function() {
      const selectedKabupaten = this.value;
      kecamatanDropdown.innerHTML = '<option value="">Pilih Kecamatan</option>'; // Reset kecamatan dropdown

      if (selectedKabupaten && kecamatanData[selectedKabupaten]) {
          const kabupatenImage = kecamatanData[selectedKabupaten].image;
          selectedImage.src = kabupatenImage; // Set kabupaten image
          selectedImage.onload = () => imageContainer.style.display = 'block';
          selectedImage.onerror = () => {
              console.error('Error loading kabupaten image:', kabupatenImage);
              imageContainer.style.display = 'none';
          };

          const kecamatanOptions = kecamatanData[selectedKabupaten].kecamatan;
          kecamatanOptions.forEach(function(item) {
              const option = document.createElement('option');
              option.value = item.image; // Set image path as value
              option.textContent = item.name;
              kecamatanDropdown.appendChild(option);
          });

          // Populate table with data from selected kabupaten
          populateKabupatenTable(selectedKabupaten);
      }

      // Reset image container if no kabupaten selected
      if (!selectedKabupaten) {
          selectedImage.src = '';
          imageContainer.style.display = 'none';
          dataTableBody.innerHTML = ''; // Clear table
      }
  });

  // Populate table with data from selected kecamatan
  kecamatanDropdown.addEventListener('change', function() {
      const selectedImageSrc = this.value; // This should be the image path
      const selectedKecamatan = this.options[this.selectedIndex].text;
      const selectedKabupaten = kabupatenDropdown.value;

      if (selectedImageSrc) {
          selectedImage.src = selectedImageSrc;
          selectedImage.onload = () => imageContainer.style.display = 'block';
          selectedImage.onerror = () => {
              console.error('Error loading image:', selectedImageSrc);
              imageContainer.style.display = 'none';
          };

          // Populate table with data from selected kecamatan
          populateKecamatanTable(selectedKabupaten, selectedKecamatan);
      } else {
          imageContainer.style.display = 'none';
          dataTableBody.innerHTML = '';
      }
  });

  // Function to populate table with all kabupaten data
  function populateKabupatenTable(selectedKabupaten = '') {
      dataTableBody.innerHTML = ''; // Clear table

      let filteredData = geoJsonData;

      if (selectedKabupaten) {
          filteredData = geoJsonData.filter(feature => feature.properties.WADMKK === selectedKabupaten);
      }

      filteredData.forEach((feature, index) => {
          const wadmkk = feature.properties.WADMKK || 'Tidak tersedia';
          const wadmkc = feature.properties.WADMKC || 'Tidak tersedia';
          const kategori = feature.properties.Kategori || 'Tidak tersedia';

          const row = `
              <tr>
                  <td>${index + 1}</td>
                  <td>${wadmkk}</td>
                  <td>${wadmkc}</td>
                  <td>${kategori}</td>
              </tr>
          `;

          dataTableBody.insertAdjacentHTML('beforeend', row);
      });
  }

  // Function to populate table with data from selected kecamatan
  function populateKecamatanTable(selectedKabupaten, selectedKecamatan) {
      dataTableBody.innerHTML = ''; // Clear table

      const filteredData = geoJsonData.filter(feature =>
          feature.properties.WADMKK === selectedKabupaten && feature.properties.WADMKC === selectedKecamatan
      );

      filteredData.forEach((feature, index) => {
          const wadmkk = feature.properties.WADMKK || 'Tidak tersedia';
          const wadmkc = feature.properties.WADMKC || 'Tidak tersedia';
          const kategori = feature.properties.Kategori || 'Tidak tersedia';

          const row = `
              <tr>
                  <td>${index + 1}</td>
                  <td>${wadmkk}</td>
                  <td>${wadmkc}</td>
                  <td>${kategori}</td>
              </tr>
          `;

          dataTableBody.insertAdjacentHTML('beforeend', row);
      });
  }
});
