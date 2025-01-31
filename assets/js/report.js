(function() {
    "use strict";
  
    // Helper functions
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }
  
    const on = (type, el, listener, all = false) => {
      if (all) {
        select(el, all).forEach(e => e.addEventListener(type, listener))
      } else {
        select(el, all).addEventListener(type, listener)
      }
    }
  
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }
  
    // Sidebar toggle
    if (select('.toggle-sidebar-btn')) {
      on('click', '.toggle-sidebar-btn', function(e) {
        select('body').classList.toggle('toggle-sidebar')
      })
    }
  
    // Search bar toggle
    if (select('.search-bar-toggle')) {
      on('click', '.search-bar-toggle', function(e) {
        select('.search-bar').classList.toggle('search-bar-show')
      })
    }
  
    // Navbar links active state on scroll
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)
  
    // Toggle .header-scrolled class to #header when page is scrolled
    let selectHeader = select('#header')
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled')
        } else {
          selectHeader.classList.remove('header-scrolled')
        }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
    }
  
    // Back to top button
    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }
  
    document.addEventListener('DOMContentLoaded', () => {
        const dropdownToggleBtn = document.querySelector('#dropdown-toggle');
        const dropdownsContainer = document.querySelector('#dropdowns-container');
        const kabupatenDropdown = document.querySelector('#kabupaten-dropdown');
        const kecamatanDropdown = document.querySelector('#kecamatan-dropdown');
        const tahunDropdown = document.querySelector('#tahun-dropdown');
        const imageContainer = document.querySelector('#image-container');
        const selectedImage = document.querySelector('#selected-image');
        const dataTableBody = document.querySelector('#data-table tbody');
        const dataTableHead = document.querySelector('#data-table thead');
        const downloadButton = document.getElementById('download-pdf');
    
        let kecamatanData = {};
        let geoJsonData = [];
        let titikGeoJsonData = [];
    
        // Inisialisasi Zooming pada gambar
        const zooming = new Zooming({
            scaleBase: 0.9,
            scaleExtra: 1.5,
        });
        zooming.listen('#selected-image');
    
        // Toggle dropdowns display
        dropdownToggleBtn.addEventListener('click', () => {
            dropdownsContainer.style.display = 
                (dropdownsContainer.style.display === 'none' || dropdownsContainer.style.display === '') ? 'block' : 'none';
        });
    
        // Fetch JSON data untuk dropdown kabupaten dan kecamatan
fetch('assets/data/kecamatan.json')
.then(response => response.json())
.then(data => {
    for (const kabupaten in data) {
        const option = document.createElement('option');
        option.value = kabupaten;
        option.textContent = kabupaten;
        kabupatenDropdown.appendChild(option);
    }
    kecamatanData = data;
})
.catch(error => console.error('Error loading JSON:', error));

// Fetch GeoJSON data
fetch('assets/data/titiktabelupdate_04.geojson')
.then(response => response.json())
.then(data => {
    geoJsonData = data.features;
})
.catch(error => console.error('Error loading GeoJSON:', error));

fetch('assets/data/titikupdate.geojson')
.then(response => response.json())
.then(data => {
    titikGeoJsonData = data.features;
})
.catch(error => console.error('Error loading Titik GeoJSON:', error));

kabupatenDropdown.addEventListener('change', function () {
const selectedKabupaten = this.value;
tahunDropdown.innerHTML = '<option value="">Semua Tahun</option>';
kecamatanDropdown.innerHTML = '<option value="">Pilih Kecamatan</option>';
selectedImage.src = '';
imageContainer.style.display = 'none';

if (selectedKabupaten && kecamatanData[selectedKabupaten]) {
    const tahunOptions = Object.keys(kecamatanData[selectedKabupaten]);
    tahunOptions.forEach(tahun => {
        const option = document.createElement('option');
        option.value = tahun;
        option.textContent = tahun;
        tahunDropdown.appendChild(option);
    });
}
});

tahunDropdown.addEventListener('change', function () {
const selectedKabupaten = kabupatenDropdown.value;
const selectedTahun = this.value;
kecamatanDropdown.innerHTML = '<option value="">Pilih Kecamatan</option>';
selectedImage.src = '';
imageContainer.style.display = 'none';

if (selectedKabupaten && selectedTahun && kecamatanData[selectedKabupaten][selectedTahun]) {
    const kabupatenImage = kecamatanData[selectedKabupaten][selectedTahun].image;
    fetch(kabupatenImage, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                selectedImage.src = kabupatenImage;
                selectedImage.onload = () => imageContainer.style.display = 'block';
            } else {
                throw new Error('Image not found');
            }
        })
        .catch(error => {
            console.error('Error loading kabupaten image:', error);
        });

    const kecamatanOptions = kecamatanData[selectedKabupaten][selectedTahun].kecamatan;
    kecamatanOptions.forEach(function (item) {
        const option = document.createElement('option');
        option.value = item.image;
        option.textContent = item.name;
        kecamatanDropdown.appendChild(option);
    });
}
populateKabupatenTable(selectedKabupaten, selectedTahun);
});

kecamatanDropdown.addEventListener('change', function () {
const kecamatanImage = this.value;
const selectedKabupaten = kabupatenDropdown.value;
const selectedKecamatan = this.options[this.selectedIndex].text;
const selectedTahun = tahunDropdown.value;

if (kecamatanImage) {
    fetch(kecamatanImage, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                selectedImage.src = kecamatanImage;
                selectedImage.onload = () => imageContainer.style.display = 'block';
            } else {
                throw new Error('Image not found');
            }
        })
        .catch(error => {
            console.error('Error loading kecamatan image:', error);
        });

    updateTableHeadersForKecamatan();
    populateKecamatanTable(selectedKabupaten, selectedKecamatan, selectedTahun);
} else {
    resetTableHeaders();
    imageContainer.style.display = 'none';
    dataTableBody.innerHTML = '';
}
});

function updateTableHeadersForKecamatan() {
dataTableHead.innerHTML = `
    <tr>
        <th>No</th>
        <th>Nama Kabupaten</th>
        <th>Nama Kecamatan</th>
        <th>Desa</th>
        <th>Ruas Jalan</th>
        <th>Tinggi Genangan</th>
        <th>Luas Genangan</th>
        <th>Kategori</th>
        <th>Tahun</th>
        <th>X</th>
        <th>Y</th>
    </tr>
`;
}

function resetTableHeaders() {
dataTableHead.innerHTML = `
    <tr>
        <th>No</th>
        <th>Kabupaten</th>
        <th>Kecamatan</th>
        <th>Kategori</th>
        <th>Tahun</th>
    </tr>
`;
}

function populateKabupatenTable(selectedKabupaten = '', selectedTahun = '') {
dataTableBody.innerHTML = '';
let filteredData = geoJsonData;

if (selectedKabupaten) {
    filteredData = filteredData.filter(feature => feature.properties.WADMKK === selectedKabupaten);
}
if (selectedTahun) {
    filteredData = filteredData.filter(feature => feature.properties[`Tahun ${selectedTahun}`] === 'Ada');
}

filteredData.forEach((feature, index) => {
    const wadmkk = feature.properties.WADMKK || 'Tidak tersedia';
    const wadmkc = feature.properties.WADMKC || 'Tidak tersedia';
    const kategori = feature.properties.Kategori || 'Tidak tersedia';
    const tahun = feature.properties[`Tahun ${selectedTahun}`] || 'Tidak tersedia';

    const row = `
        <tr>
            <td>${index + 1}</td>
            <td>${wadmkk}</td>
            <td>${wadmkc}</td>
            <td>${kategori}</td>
            <td>${tahun}</td>
        </tr>
    `;
    dataTableBody.insertAdjacentHTML('beforeend', row);
});
}

function populateKecamatanTable(selectedKabupaten, selectedKecamatan, selectedTahun) {
dataTableBody.innerHTML = '';
let filteredData = titikGeoJsonData.filter(feature => 
    feature.properties.KABUPATEN === selectedKabupaten && 
    feature.properties.KECAMATAN === selectedKecamatan
);

if (selectedTahun) {
    filteredData = filteredData.filter(feature => feature.properties.Tahun === parseInt(selectedTahun));
}

if (filteredData.length === 0) {
    const defaultData = geoJsonData.find(feature => 
        feature.properties.WADMKK === selectedKabupaten && 
        feature.properties.WADMKC === selectedKecamatan
    );

    if (defaultData) {
        const kabupaten = defaultData.properties.WADMKK || 'Tidak tersedia';
        const kecamatan = defaultData.properties.WADMKC || 'Tidak tersedia';
        const kategori = defaultData.properties.Kategori || 'Tidak tersedia';
    
        // Gunakan selectedTahun langsung untuk kolom tahun
        const tahun = selectedTahun || 'Tidak tersedia';
    
        const row = `
            <tr>
                <td>1</td>
                <td>${kabupaten}</td>
                <td>${kecamatan}</td>
                <td colspan="4">Tidak ada data</td>
                <td>${kategori}</td>
                <td>${tahun}</td>
            </tr>
        `;
        dataTableBody.insertAdjacentHTML('beforeend', row);
    } else {
        // Jika tidak ada defaultData, tampilkan kabupaten/kecamatan kosong tetapi tetap gunakan selectedTahun
        const row = `
            <tr>
                <td>1</td>
                <td>${selectedKabupaten || 'Tidak tersedia'}</td>
                <td>${selectedKecamatan || 'Tidak tersedia'}</td>
                <td colspan="4">Tidak ada data</td>
                <td>Tidak tersedia</td>
                <td>${selectedTahun || 'Tidak tersedia'}</td>
            </tr>
        `;
        dataTableBody.insertAdjacentHTML('beforeend', row);
    }
    

} else {
    filteredData.forEach((feature, index) => {
        const kabupaten = feature.properties.KABUPATEN || 'Tidak tersedia';
        const kecamatan = feature.properties.KECAMATAN || 'Tidak tersedia';
        const namaJalan = feature.properties.NAMA_JALAN || 'Tidak tersedia';
        const desa = feature.properties.DESA || 'Tidak tersedia';
        const x = feature.properties.x || 'Tidak tersedia';
        const y = feature.properties.Y || 'Tidak tersedia';
        const tinggiGenangan = feature.properties.TINGGI_GEN ? `${feature.properties.TINGGI_GEN} m` : 'Tidak tersedia';
        const luasGenangan = feature.properties.LUASAN_GEN ? `${feature.properties.LUASAN_GEN} m²` : 'Tidak tersedia';
        const kategori = feature.properties.Kategori || 'Tidak tersedia';
        const tahun = feature.properties.Tahun || 'Tidak tersedia';

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${kabupaten}</td>
                <td>${kecamatan}</td>
                <td>${desa}</td>
                <td>${namaJalan}</td>
                <td>${tinggiGenangan}</td>
                <td>${luasGenangan}</td>
                <td>${kategori}</td>
                <td>${tahun}</td>
                <td>${x}</td>
                <td>${y}</td>
            </tr>
        `;
        dataTableBody.insertAdjacentHTML('beforeend', row);
    });
}
}

// Function to reset data to default
function resetData() {
    // Kosongkan tabel
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = "";

    // Reset peta
    resetMap(); // Buat fungsi ini sesuai kebutuhan Anda
}

// Tambahkan listener ke setiap dropdown
document.querySelector("#kabupaten").addEventListener("change", resetData);
document.querySelector("#tahun").addEventListener("change", resetData);
document.querySelector("#kecamatan").addEventListener("change", () => {
    const selectedKecamatan = document.querySelector("#kecamatan").value;
    if (selectedKecamatan === "all") {
        displayAllData(); // Menampilkan semua data kecamatan
    } else {
        resetData(); // Reset data jika dropdown berubah
    }
});

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

                // Set canvas size to the original image size
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

                // Use PNG format without compression to maintain quality
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

})();
