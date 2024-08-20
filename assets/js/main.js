/**
* Template Name: NiceAdmin
* Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
* Updated: Apr 20 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Sidebar toggle
   */
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function(e) {
      select('body').classList.toggle('toggle-sidebar')
    })
  }

  /**
   * Search bar toggle
   */
  if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function(e) {
      select('.search-bar').classList.toggle('search-bar-show')
    })
  }

  /**
   * Navbar links active state on scroll
   */
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

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
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

  /**
   * Back to top button
   */
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

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  /**
   * Initiate quill editors
   */
  if (select('.quill-editor-default')) {
    new Quill('.quill-editor-default', {
      theme: 'snow'
    });
  }

  if (select('.quill-editor-bubble')) {
    new Quill('.quill-editor-bubble', {
      theme: 'bubble'
    });
  }

  if (select('.quill-editor-full')) {
    new Quill(".quill-editor-full", {
      modules: {
        toolbar: [
          [{
            font: []
          }, {
            size: []
          }],
          ["bold", "italic", "underline", "strike"],
          [{
              color: []
            },
            {
              background: []
            }
          ],
          [{
              script: "super"
            },
            {
              script: "sub"
            }
          ],
          [{
              list: "ordered"
            },
            {
              list: "bullet"
            },
            {
              indent: "-1"
            },
            {
              indent: "+1"
            }
          ],
          ["direction", {
            align: []
          }],
          ["link", "image", "video"],
          ["clean"]
        ]
      },
      theme: "snow"
    });
  }

  /**
   * Initiate TinyMCE Editor
   */

  const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;

  tinymce.init({
    selector: 'textarea.tinymce-editor',
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
    editimage_cors_hosts: ['picsum.photos'],
    menubar: 'file edit view insert format tools table help',
    toolbar: "undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl",
    autosave_ask_before_unload: true,
    autosave_interval: '30s',
    autosave_prefix: '{path}{query}-{id}-',
    autosave_restore_when_empty: false,
    autosave_retention: '2m',
    image_advtab: true,
    link_list: [{
        title: 'My page 1',
        value: 'https://www.tiny.cloud'
      },
      {
        title: 'My page 2',
        value: 'http://www.moxiecode.com'
      }
    ],
    image_list: [{
        title: 'My page 1',
        value: 'https://www.tiny.cloud'
      },
      {
        title: 'My page 2',
        value: 'http://www.moxiecode.com'
      }
    ],
    image_class_list: [{
        title: 'None',
        value: ''
      },
      {
        title: 'Some class',
        value: 'class-name'
      }
    ],
    importcss_append: true,
    file_picker_callback: (callback, value, meta) => {
      /* Provide file and text for the link dialog */
      if (meta.filetype === 'file') {
        callback('https://www.google.com/logos/google.jpg', {
          text: 'My text'
        });
      }

      /* Provide image and alt text for the image dialog */
      if (meta.filetype === 'image') {
        callback('https://www.google.com/logos/google.jpg', {
          alt: 'My alt text'
        });
      }

      /* Provide alternative source and posted for the media dialog */
      if (meta.filetype === 'media') {
        callback('movie.mp4', {
          source2: 'alt.ogg',
          poster: 'https://www.google.com/logos/google.jpg'
        });
      }
    },
    height: 600,
    image_caption: true,
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    noneditable_class: 'mceNonEditable',
    toolbar_mode: 'sliding',
    contextmenu: 'link image table',
    skin: useDarkMode ? 'oxide-dark' : 'oxide',
    content_css: useDarkMode ? 'dark' : 'default',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
  });

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(needsValidation)
    .forEach(function(form) {
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

  /**
   * Initiate Datatables
   */
  const datatables = select('.datatable', true)
  datatables.forEach(datatable => {
    new simpleDatatables.DataTable(datatable, {
      perPageSelect: [5, 10, 15, ["All", -1]],
      columns: [{
          select: 2,
          sortSequence: ["desc", "asc"]
        },
        {
          select: 3,
          sortSequence: ["desc"]
        },
        {
          select: 4,
          cellClass: "green",
          headerClass: "red"
        }
      ]
    });
  })

  /**
   * Autoresize echart charts
   */
  const mainContainer = select('#main');
  if (mainContainer) {
    setTimeout(() => {
      new ResizeObserver(function() {
        select('.echart', true).forEach(getEchart => {
          echarts.getInstanceByDom(getEchart).resize();
        })
      }).observe(mainContainer);
    }, 200);
  }
  

})();
// peta
document.addEventListener('DOMContentLoaded', () => {
  var map = L.map('map').setView([-7.0631028, 107.4263623], 10); // Koordinat awal peta

  // Tambahkan basemap default (OSM)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Fungsi untuk memberi style pada polygon berdasarkan kategori
  function style_data_0_0(feature) {
    switch(String(feature.properties['Kategori'])) {
      case 'Banjir':
        return {
          color: 'yellow',  // Outline color
          weight: 2.0, 
          fill: true,
          fillOpacity: 0.7,
          fillColor: 'red',  // Fill color for 'Banjir'
          interactive: true,
        };
      case 'tidak banjir':
        return {
          color: 'yellow',  // Outline color
          weight: 2.0, 
          fill: true,
          fillOpacity: 0.7,
          fillColor: 'grey',  // Fill color for 'tidak banjir'
          interactive: true,
        };
      default:
        return {
          color: 'yellow',  // Outline color
          weight: 2.0, 
          fill: true,
          fillOpacity: 0.7,
          fillColor: 'rgba(218,178,35,1.0)',  // Default fill color
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
  const luasGenangan = feature.properties.LuasGenangan || 'Tidak tersedia';
  const kategori = feature.properties.Kategori || 'Tidak tersedia';

  console.log("Adding tooltip for:", wadmkc);  // Debug

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

  // Menghubungkan checkbox Layer 1 dengan GeoJSON layer
  document.getElementById('layer1').addEventListener('change', function() {
    if (this.checked) {
      fetch('assets/data/data.geojson')
        .then(response => response.json())
        .then(data => {
          const geojsonLayer = L.geoJSON(data, {
            style: style_data_0_0,
            onEachFeature: onEachFeature // Menambahkan pop-up dan label ke setiap fitur
          }).addTo(map);
          this.geojsonLayer = geojsonLayer;
        })
        .catch(error => console.error('Error loading the GeoJSON data:', error));
    } else {
      if (this.geojsonLayer) {
        map.removeLayer(this.geojsonLayer);
        this.geojsonLayer = null;
      }
    }
  });

  // Default: Menampilkan Layer 1 saat pertama kali halaman dibuka
  document.getElementById('layer1').dispatchEvent(new Event('change'));

  // Menghubungkan checkbox Layer 2 dengan marker layer
  document.getElementById('layer2').addEventListener('change', function() {
    if (this.checked) {
      fetch('assets/data/Kabupaten.geojson')
      .then(response => response.json())
      .then(data => {
          const markerLayer = L.geoJSON(data, {
              pointToLayer: function (feature, latlng) {
                  return L.marker(latlng);
              },
              onEachFeature: function(feature, layer) {
                  const popupContent = `<b>Nama Kabupaten:</b> ${feature.properties.NamaKabupaten}`;
                  layer.bindPopup(popupContent);
              }
          }).addTo(map);

          this.markerLayer = markerLayer;
      })
      .catch(error => console.error('Error loading the GeoJSON data:', error));
    } else {
      if (this.markerLayer) {
        map.removeLayer(this.markerLayer);
        this.markerLayer = null;
      }
    }
  });

  // Mengisi Dropdown dengan WADMKC dari data.geojson
  fetch('assets/data/data.geojson')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('layer1-dropdown');
        const wadmkcList = [...new Set(data.features.map(feature => feature.properties.WADMKC))];

        wadmkcList.forEach(wadmkc => {
            const option = document.createElement('option');
            option.value = wadmkc;
            option.text = wadmkc;
            select.add(option);
        });

        // Menambahkan event listener untuk dropdown
        select.addEventListener('change', function() {
            const selectedWadmkc = this.value;

            if (this.selectedLayer) {
                map.removeLayer(this.selectedLayer);
                this.selectedLayer = null;
            }

            const selectedData = data.features.filter(feature => feature.properties.WADMKC === selectedWadmkc);
            const selectedLayer = L.geoJSON(selectedData, {
                style: style_data_0_0, // Menggunakan style yang sudah dibuat sebelumnya
                onEachFeature: onEachFeature // Menambahkan pop-up dan label seperti sebelumnya
            }).addTo(map);

            // Meng-zoom ke extent kecamatan yang dipilih
            if (selectedData.length > 0) {
                const bounds = L.geoJSON(selectedData).getBounds();
                map.fitBounds(bounds);

                // Menambahkan marker hanya dari area kecamatan yang dipilih
                addMarkersForSelectedArea(bounds);
            }

            this.selectedLayer = selectedLayer;
        });
    })
    .catch(error => console.error('Error loading the GeoJSON data:', error));

  // Fungsi untuk menambahkan marker berdasarkan kecamatan yang dipilih
  function addMarkersForSelectedArea(bounds) {
    // Hapus marker layer sebelumnya jika ada
    if (this.markerLayer) {
      map.removeLayer(this.markerLayer);
      this.markerLayer = null;
    }

    // Muat dan filter marker berdasarkan kecamatan yang dipilih
    fetch('assets/data/Kabupaten.geojson')
      .then(response => response.json())
      .then(data => {
        const markerData = data.features.filter(feature => {
          // Ambil koordinat titik marker
          if (feature.geometry.type === "Point") {
            const latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
            return bounds.contains(latlng);
          }
          return false;
        });

        this.markerLayer = L.geoJSON(markerData, {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng);
          },
          onEachFeature: function(feature, layer) {
            const popupContent = `<b>Nama Kabupaten:</b> ${feature.properties.NamaKabupaten}`;
            layer.bindPopup(popupContent);
          }
        }).addTo(map);
      })
      .catch(error => console.error('Error loading the marker data:', error));
  }
});









