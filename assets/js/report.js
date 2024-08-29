document.addEventListener('DOMContentLoaded', () => {
    const dropdownToggleBtn = document.querySelector('#dropdown-toggle');
    const dropdownsContainer = document.querySelector('#dropdowns-container');
    const kabupatenDropdown = document.querySelector('#kabupaten-dropdown');
    const kecamatanDropdown = document.querySelector('#kecamatan-dropdown');
    const imageContainer = document.querySelector('#image-container');
    const selectedImage = document.querySelector('#selected-image');
    const dataTableBody = document.querySelector('#data-table tbody');
    const downloadButton = document.getElementById('download-pdf');

    let kecamatanData = {};
    let geoJsonData = []; // Menyimpan data dari GeoJSON

    // Inisialisasi Zooming pada gambar
    const zooming = new Zooming({
        scaleBase: 0.9, // Ukuran skala awal untuk zoom
        scaleExtra: 1.5, // Besar perbesaran zoom
    });
    zooming.listen('#selected-image'); // Aktifkan zooming pada gambar

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

    // Event listener untuk tombol unduh PDF
    downloadButton.addEventListener('click', function() {
        const imgUrl = selectedImage.src;
        if (imgUrl && selectedImage.complete && selectedImage.naturalWidth !== 0) {
            const { jsPDF } = window.jspdf; // Proper initialization of jsPDF using UMD
            const pdf = new jsPDF();
            const img = new Image();
            img.src = imgUrl;
            img.crossOrigin = 'Anonymous'; // Enable cross-origin request
    
            img.onload = function() {
                // Menggunakan ukuran gambar asli
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let imgWidth = img.width;
                let imgHeight = img.height;
    
                // Pastikan kanvas sama dengan ukuran gambar asli
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    
                // Gunakan format PNG tanpa kompresi untuk mempertahankan kualitas
                const compressedImgUrl = canvas.toDataURL('image/png');
    
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                const x = (pageWidth - imgWidth * ratio) / 2;
                const y = (pageHeight - imgHeight * ratio) / 2;
    
                pdf.addImage(compressedImgUrl, 'PNG', x, y, imgWidth * ratio, imgHeight * ratio);
                pdf.save('download.pdf');
            };
    
            img.onerror = function() {
                console.error('Error loading image for PDF:', imgUrl);
                alert('Error loading image. Please try again.');
            };
        } else {
            alert('Gambar belum dimuat sepenuhnya. Silakan tunggu hingga gambar selesai dimuat.');
        }
    });
    

});
