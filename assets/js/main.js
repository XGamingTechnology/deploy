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


    // Peta functionality
    document.addEventListener('DOMContentLoaded', () => {
        // Inisialisasi peta dengan basemap OSM sebagai default
        var map = L.map('map').setView([-7.0631028, 107.4263623], 10);

        // Basemap options
        const basemaps = {
            osm: L.tileLayer.provider('OpenStreetMap.Mapnik'), // Default
            satellite: L.tileLayer.provider('Esri.WorldImagery').addTo(map),
            topo: L.tileLayer.provider('OpenTopoMap'),
            imagery: L.tileLayer.provider('Esri.WorldImagery'),
            outdoors: L.tileLayer.provider('Thunderforest.Outdoors')
        };

        // Fungsi untuk mengubah basemap berdasarkan pilihan radio button
        function switchBasemap(basemap) {
            map.eachLayer(layer => {
                if (layer.options && layer.options.attribution) {
                    map.removeLayer(layer);
                }
            });
            basemaps[basemap].addTo(map);
        }

        // Event listener untuk radio buttons
        document.querySelectorAll('input[name="basemap"]').forEach(radio => {
            radio.addEventListener('change', function () {
                switchBasemap(this.value);
            });
        });

        var markerLayer,markerLayer2, overallMarkerLayer, kecamatanLayer,kecamatanlayer2, kabupatenLayer, kabNew, titiknew, area, kabupaten2024 // Declare variables for layers

        // Fungsi untuk memberi style pada polygon berdasarkan singel
        function style_data_0_3() {
            return {
                color: 'black',  // Outline color
                weight: 2.0, 
                fill: true,
                fillOpacity: 1,
                fillColor: 'red',  // Fill color
                interactive: true,
            };
        }
        // Fungsi untuk memberi style pada polygon berdasarkan singel
        function style_data_0_1() {
            return {
                color: 'yellow',  // Outline color
                weight: 1.0, 
                fill: true,
                fillOpacity: 0.1,
                fillColor: 'grey',  // Fill color
                interactive: true,
            };
        }

        // Fungsi untuk memberi style pada polygon berdasarkan kategori
        function style_data_0_0(feature) {
            switch(String(feature.properties['Kategori'])) {
                case 'Rendah/Tidak banjir':
                    return {
                        color: 'grey',  // Outline color for 'Rendah/Tidak banjir'
                        weight: 1.0, 
                        fill: true,
                        fillOpacity: 0.7,
                        fillColor: 'grey',  // Fill color for 'Rendah/Tidak banjir'
                        interactive: true,
                    };
                case 'Sedang':
                    return {
                        color: 'grey',  // Outline color for 'Sedang'
                        weight: 1.0, 
                        fill: true,
                        fillOpacity: 0.7,
                        fillColor: 'yellow',  // Fill color for 'Sedang'
                        interactive: true,
                    };
                case 'Tinggi':
                    return {
                        color: 'yellow',  // Outline color for 'Tinggi'
                        weight: 1.0, 
                        fill: true,
                        fillOpacity: 0.7,
                        fillColor: 'red',  // Fill color for 'Tinggi'
                        interactive: true,
                    };
                default:
                    return {
                        color: 'yellow',  // Outline color for default case
                        weight: 2.0, 
                        fill: true,
                        fillOpacity: 0.7,
                        fillColor: 'rgba(218,178,35,1.0)',  // Default fill color
                        interactive: true,
                    };
            }
        }

        // Fungsi untuk memberi style pada polygon berdasarkan kategori
        function polygon_01(feature) {
            switch(String(feature.properties['Kategori'])) {
                case 'Rendah/Tidak banjir':
                    return {
                        color: 'grey',  // Outline color for 'Rendah/Tidak banjir'
                        weight: 1.0, 
                        fill: true,
                        fillOpacity: 0.7,
                        fillColor: 'grey',  // Fill color for 'Rendah/Tidak banjir'
                        interactive: true,
                    };
                case 'Sedang':
                    return {
                        color: 'grey',  // Outline color for 'Sedang'
                        weight: 1.0, 
                        fill: true,
                        fillOpacity: 0.7,
                        fillColor: 'yellow',  // Fill color for 'Sedang'
                        interactive: true,
                    };
                case 'Tinggi':
                    return {
                        color: 'yellow',  // Outline color for 'Tinggi'
                        weight: 1.0, 
                        fill: true,
                        fillOpacity: 0.7,
                        fillColor: 'red',  // Fill color for 'Tinggi'
                        interactive: true,
                    };
                default:
                    return {
                        color: 'yellow',  // Outline color for default case
                        weight: 2.0, 
                        fill: true,
                        fillOpacity: 0.7,
                        fillColor: 'green',  // Default fill color
                        interactive: true,
                    };
            }
        }

        // Fungsi untuk menambahkan pop-up dan label pada setiap fitur
        function onEachFeature(feature, layer) {
            const wadmkk = feature.properties.WADMKK || 'Tidak tersedia';
            const wadmkc = feature.properties.WADMKC || 'Tidak tersedia';
            const jalan = feature.properties.Jalan || 'Tidak tersedia';
            const titik = feature.properties.Titik || 'Tidak tersedia';
            const luasGenangan = feature.properties.Genangan ? `${feature.properties.Genangan} m²` : 'Tidak tersedia';
            const kategori = feature.properties.Kategori || 'Tidak tersedia';

            const popupContent = `
                <style>
                    .popup-table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .popup-table th, .popup-table td {
                        padding: 8px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    .popup-table th {
                        background-color: #f2f2f2;
                    }
                </style>
                <table class="popup-table">
                    <tr>
                        <th>Nama Kabupaten</th>
                        <td>${wadmkk}</td>
                    </tr>
                    <tr>
                        <th>Nama Kecamatan</th>
                        <td>${wadmkc}</td>
                    </tr>
                    <tr>
                        <th>Ruas Jalan</th>
                        <td>${jalan}</td>
                    </tr>
                    <tr>
                        <th>Jumlah Titik</th>
                        <td>${titik}</td>
                    </tr>
                    <tr>
                        <th>Luas Genangan</th>
                        <td>${luasGenangan}</td>
                    </tr>
                    <tr>
                        <th>Kategori</th>
                        <td>${kategori}</td>
                    </tr>
                </table>
            `;

            layer.bindPopup(popupContent);

            // Tambahkan label dengan nama kecamatan
            layer.bindTooltip(feature.properties.WADMKC, {
                permanent: true,
                direction: 'center',
                className: 'polygon-label'
            }).openTooltip();
        }

        // Fungsi untuk membuat marker layer dengan pop-up khusus
        function onEachMarkerFeature(feature, layer) {
            const desa = feature.properties.DESA || 'Tidak tersedia';
            const kecamatan = feature.properties.KECAMATAN || 'Tidak tersedia';
            const ruasJalan = feature.properties.NAMA_JALAN || 'Tidak tersedia';
            const luasGenangan = feature.properties.LUASAN_GEN ? `${feature.properties.LUASAN_GEN} m²` : 'Tidak tersedia';
            const tinggiGenangan = feature.properties.TINGGI_GEN ? `${feature.properties.TINGGI_GEN} m` : 'Tidak tersedia';
            const fotoUrl = feature.properties.FOTO || 'Tidak ada foto';
        
            let popupContent = `
                <style>
                    .popup-table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .popup-table th, .popup-table td {
                        padding: 8px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    .popup-table th {
                        background-color: #f2f2f2;
                    }
                </style>
                <table class="popup-table">
                    <tr>
                        <th>Desa</th>
                        <td>${desa}</td>
                    </tr>
                    <tr>
                        <th>Kecamatan</th>
                        <td>${kecamatan}</td>
                    </tr>
                    <tr>
                        <th>Ruas Jalan</th>
                        <td>${ruasJalan}</td>
                    </tr>
                    <tr>
                        <th>Luas Genangan</th>
                        <td>${luasGenangan}</td>
                    </tr>
                    <tr>
                        <th>Tinggi Genangan</th>
                        <td>${tinggiGenangan}</td> <!-- Gunakan nilai yang sesuai dari GeoJSON -->
                    </tr>
                    <tr>
                        <th>Foto</th>
                        <td>${fotoUrl !== 'Tidak ada foto' ? `<img src="${fotoUrl}" alt="Foto Genangan" style="width:100px;height:auto;">` : 'Tidak tersedia'}</td>
                    </tr>
                </table>
            `;
        
            layer.bindPopup(popupContent);
        }
        
        // Memuat data GeoJSON dan menambahkan ke peta
        function loadnewarea() {
            fetch('assets/data/area2024.geojson')
                .then(response => response.json())
                .then(data => {
                    area = L.geoJSON(data, {
                        style: style_data_0_3,
                        onEachFeature: onEachFeature
                    }).addTo(map);
                })
                .catch(error => console.error('Error loading the GeoJSON data:', error));
        }

        // Call the function to load the kabupaten layer initially
        // Memuat data GeoJSON dan menambahkan ke peta
        function loadkabNew() {
            fetch('assets/data/datacopy.geojson')
                .then(response => response.json())
                .then(data => {
                    kabNew = L.geoJSON(data, {
                        style: style_data_0_1,
                        onEachFeature: onEachFeature
                    }).addTo(map);
                })
                .catch(error => console.error('Error loading the GeoJSON data:', error));
        }

        // Call the function to load the kabupaten layer initially
    
        function kabNew2() {
            fetch('assets/data/kabupaten2024.geojson')
                .then(response => response.json())
                .then(data => {
                    kabupaten2024 = L.geoJSON(data, {
                        style: polygon_01,
                        onEachFeature: onEachFeature
                    }).addTo(map);
                })
                .catch(error => console.error('Error loading the GeoJSON data:', error));
        }


        // Memuat data GeoJSON dan menambahkan ke peta
        function loadKabupatenLayer() {
            fetch('assets/data/data.geojson')
                .then(response => response.json())
                .then(data => {
                    kabupatenLayer = L.geoJSON(data, {
                        style: style_data_0_0,
                        onEachFeature: onEachFeature
                    }).addTo(map);
                })
                .catch(error => console.error('Error loading the GeoJSON data:', error));
        }

        // Call the function to load the kabupaten layer initially
        

        // Fungsi untuk menambahkan semua marker
        function loadAllMarkers() {
            fetch('assets/data/titik2024.geojson')
                .then(response => response.json())
                .then(data => {
                    // Buat layer GeoJSON dengan warna berbeda berdasarkan kategori
                    titiknew = L.geoJSON(data, {
                        pointToLayer: function (feature, latlng) {
                            // Pilih warna berdasarkan kategori (sesuaikan atributnya)
                            const kategori = feature.properties.kategori; // Misalnya: 'Rendah', 'Sedang', 'Tinggi'
                            let fillColor;
        
                            // Tetapkan warna berdasarkan kategori
                            if (kategori === "Rendah/Tidak banjir") {
                                fillColor = "green"; // Hijau untuk kategori rendah
                            } else if (kategori === "Sedang") {
                                fillColor = "orange"; // Oranye untuk kategori sedang
                            } else if (kategori === "Tinggi") {
                                fillColor = "red"; // Merah untuk kategori tinggi
                            } else {
                                fillColor = "blue"; // Default (untuk kategori lain atau tidak ada kategori)
                            }
        
                            // Kembalikan circle marker dengan warna
                            return L.circleMarker(latlng, {
                                radius: 8,            // Ukuran marker
                                fillColor: fillColor, // Warna isi lingkaran
                                color: "#000",        // Warna border lingkaran
                                weight: 1,            // Ketebalan border
                                opacity: 1,           // Transparansi border
                                fillOpacity: 0.8      // Transparansi isi lingkaran
                            });
                        },
                        onEachFeature: onEachMarkerFeature // Menambahkan pop-up pada setiap marker
                    }).addTo(map);
        
                    // Menyesuaikan peta untuk menampilkan semua marker
                    if (data.features.length > 0) {
                        const bounds = titiknew.getBounds();
                        map.fitBounds(bounds); // Menyesuaikan peta untuk mencakup semua marker
                    }
                })
                .catch(error => console.error('Error loading the marker data:', error));
        }   
        // Fungsi untuk menambahkan marker berdasarkan Polygon_id yang dipilih
    function fetchMarkersForPolygon(polygonId) {
        if (markerLayer) {
            map.removeLayer(markerLayer);
            markerLayer = null;
        }

        fetch('assets/data/Titik.geojson')
            .then(response => response.json())
            .then(data => {
                const markerData = data.features.filter(feature => feature.properties.Polygon_id === polygonId);

                markerLayer = L.geoJSON(markerData, {
                    pointToLayer: (feature, latlng) => L.marker(latlng),
                    onEachFeature: onEachMarkerFeature,
                }).addTo(map);

                if (markerData.length > 0) {
                    const bounds = markerLayer.getBounds();
                    map.fitBounds(bounds);
                }
            })
            .catch(error => console.error('Error loading the marker data:', error));
    }

    // Fungsi untuk menambahkan polygon kecamatan ke peta berdasarkan Polygon_id
    function fetchPolygonForKecamatan(polygonId) {
        if (kecamatanLayer) {
            map.removeLayer(kecamatanLayer);
            kecamatanLayer = null;
        }

        fetch('assets/data/data.geojson')
            .then(response => response.json())
            .then(data => {
                const kecamatanData = data.features.filter(feature => feature.properties.Polygon_id === polygonId);

                kecamatanLayer = L.geoJSON(kecamatanData, {
                    style: style_data_0_0,
                    onEachFeature: onEachFeature,
                }).addTo(map);

                if (kecamatanData.length > 0) {
                    const bounds = kecamatanLayer.getBounds();
                    map.fitBounds(bounds);
                }
            })
            .catch(error => console.error('Error loading the GeoJSON data:', error));
    }

        // Fungsi untuk menambahkan marker berdasarkan Polygon_id yang dipilih
        function fetchMarkersForPolygon(polygonId) {
            if (markerLayer) {
                map.removeLayer(markerLayer);
                markerLayer = null;
            }
    
            fetch('assets/data/Titik.geojson')
                .then(response => response.json())
                .then(data => {
                    const markerData = data.features.filter(feature => feature.properties.Polygon_id === polygonId);
    
                    markerLayer = L.geoJSON(markerData, {
                        pointToLayer: (feature, latlng) => L.marker(latlng),
                        onEachFeature: onEachMarkerFeature,
                    }).addTo(map);
    
                    if (markerData.length > 0) {
                        const bounds = markerLayer.getBounds();
                        map.fitBounds(bounds);
                    }
                })
                .catch(error => console.error('Error loading the marker data:', error));
        }
    
        
     // Event listener untuk checkbox "area" layer
     document.getElementById('layer9').addEventListener('change', function () {
        if (this.checked) {
            if (!kabupaten2024) {
                kabNew2();
            }
        } else {
            if (kabupaten2024) {
                map.removeLayer(kabupaten2024);
                kabupaten2024 = null;
            }
        }
    });
    // Event listener untuk checkbox "area" layer
    document.getElementById('layer5').addEventListener('change', function () {
        if (this.checked) {
            if (!area) {
                loadnewarea();
            }
        } else {
            if (area) {
                map.removeLayer(area);
                area = null;
            }
        }
    });

    // Event listener untuk checkbox "kabupaten" layer
    document.getElementById('layer1').addEventListener('change', function () {
        if (this.checked) {
            if (!kabNew) {
                loadkabNew();
            }
        } else {
            if (kabNew) {
                map.removeLayer(kabNew);
                kabNew = null;
            }
        }
    });

    // Event listener untuk checkbox "kabupatenLayer"
    document.getElementById('layer6').addEventListener('change', function () {
        if (this.checked) {
            if (!kabupatenLayer) {
                loadKabupatenLayer();
            }
        } else {
            if (kabupatenLayer) {
                map.removeLayer(kabupatenLayer);
                kabupatenLayer = null;
            }
        }
    });

    // Event listener untuk checkbox "titik" layer
    document.getElementById('layer7').addEventListener('change', function () {
        if (this.checked) {
            if (!titiknew) {
                loadAllMarkers();
            }
        } else {
            if (titiknew) {
                map.removeLayer(titiknew);
                titiknew = null;
            }
        }
    });

    // Event listener untuk checkbox "overallMarkerLayer"
    document.getElementById('layer2').addEventListener('change', function () {
        if (this.checked) {
            fetch('assets/data/Titik.geojson')
                .then(response => response.json())
                .then(data => {
                    overallMarkerLayer = L.geoJSON(data, {
                        pointToLayer: (feature, latlng) => L.marker(latlng),
                        onEachFeature: onEachMarkerFeature,
                    }).addTo(map);
                })
                .catch(error => console.error('Error loading the marker data:', error));
        } else {
            if (overallMarkerLayer) {
                map.removeLayer(overallMarkerLayer);
                overallMarkerLayer = null;
            }
        }
    });

    // Mengisi dropdown kecamatan dan menambahkan event listener
    fetch('assets/data/data.geojson')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('layer1-dropdown');

            // Tambahkan opsi default
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '--Pilih Kecamatan--';
            select.add(defaultOption);

            const wadmkcList = [...new Set(data.features.map(feature => feature.properties.WADMKC))];

            wadmkcList.forEach(wadmkc => {
                const option = document.createElement('option');
                option.value = wadmkc;
                option.text = wadmkc;
                select.add(option);
            });

            // Event listener untuk dropdown kecamatan
            select.addEventListener('change', function () {
                const selectedWadmkc = this.value;

                if (selectedWadmkc === '') {
                    // Reset jika memilih opsi default
                    if (kecamatanLayer) map.removeLayer(kecamatanLayer);
                    if (markerLayer) map.removeLayer(markerLayer);
                    kecamatanLayer = null;
                    markerLayer = null;
                    return;
                }

                const selectedData = data.features.filter(feature => feature.properties.WADMKC === selectedWadmkc);

                if (selectedData.length > 0) {
                    const polygonId = selectedData[0].properties.Polygon_id;

                    fetchPolygonForKecamatan(polygonId);
                    fetchMarkersForPolygon(polygonId);
                }
            });
        })
        .catch(error => console.error('Error loading the GeoJSON data:', error));

    

    });


    })();
