document.addEventListener('DOMContentLoaded', () => {
    const dropdownToggleBtn = document.querySelector('#dropdown-toggle');
    const dropdownsContainer = document.querySelector('#dropdowns-container');
    const kabupatenDropdown = document.querySelector('#kabupaten-dropdown');
    const kecamatanDropdown = document.querySelector('#kecamatan-dropdown');
    const imageContainer = document.querySelector('#image-container');
    const selectedImage = document.querySelector('#selected-image');
    const dataTableBody = document.querySelector('#data-table tbody');
  
    let kecamatanData = {};
  
    // Toggle dropdowns display
    dropdownToggleBtn.addEventListener('click', () => {
      dropdownsContainer.style.display = 
        (dropdownsContainer.style.display === 'none' || dropdownsContainer.style.display === '') ? 'block' : 'none';
    });
  
    // Fetch JSON data
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
  
        // Reset table
        dataTableBody.innerHTML = '';
      }
  
      // Reset image container if no kabupaten selected
      if (!selectedKabupaten) {
        selectedImage.src = '';
        imageContainer.style.display = 'none';
      }
    });
  
    // Display image and populate table based on selected kecamatan
    kecamatanDropdown.addEventListener('change', function() {
      const selectedImageSrc = this.value;
      console.log('Selected Image Path:', selectedImageSrc); // Log the path
      const selectedKecamatan = this.options[this.selectedIndex].text;
      const selectedKabupaten = kabupatenDropdown.value;
  
      if (selectedImageSrc) {
        selectedImage.src = selectedImageSrc;
        selectedImage.onload = () => imageContainer.style.display = 'block';
        selectedImage.onerror = () => {
          console.error('Error loading image:', selectedImageSrc);
          imageContainer.style.display = 'none';
        };
  
        // Populate table with data
        const kecamatanDataArray = kecamatanData[selectedKabupaten].kecamatan;
        const kecamatan = kecamatanDataArray.find(item => item.name === selectedKecamatan);
        if (kecamatan) {
          dataTableBody.innerHTML = `
            <tr>
              <td>${kecamatan.id}</td>
              <td>${kecamatan.name}</td>
              <td>${kecamatan.email}</td>
            </tr>
          `;
        }
      } else {
        imageContainer.style.display = 'none';
        dataTableBody.innerHTML = '';
      }
    });
  });