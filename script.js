// GANTI STRING DI BAWAH DENGAN URL WEB APP GAS ANDA DARI TAHAP 2
const scriptURL = 'https://script.google.com/macros/s/AKfycbzkI78o2IHLSiHKE7yQ2Ipcqch1awFzxZf_6VXOHUXb9ZreJReemeijRJnJ6iOP2Kx7/exec';

const form = document.getElementById('pendaftaranForm');
const kategoriSelect = document.getElementById('kategori');
const groupOrtu = document.getElementById('groupOrtu');
const inputOrtu = document.getElementById('namaOrtu');
const programSelect = document.getElementById('program');
const jenisKelasSelect = document.getElementById('jenisKelas');

// Elemen Khusus Anak
const optCalistung = document.getElementById('optCalistung');
const optTahfidz = document.getElementById('optTahfidz');
const optBimbelSD = document.getElementById('optBimbelSD');

// Elemen Tersembunyi Bersyarat
const groupAkademikSD = document.getElementById('groupAkademikSD');
const inputGrade = document.getElementById('grade');

const groupSekolah = document.getElementById('groupSekolah');
const inputSekolah = document.getElementById('sekolah');

const groupLokasi = document.getElementById('groupLokasi');
const inputLokasi = document.getElementById('lokasiBelajar');

const btnSubmit = document.getElementById('btnSubmit');
const statusMessage = document.getElementById('statusMessage');

// FUNGSI PUSAT EVALUASI LOGIKA
function evaluasiLogikaBersyarat() {
    const isSD = programSelect.value === 'Bimbingan Akademik Pelajaran Sekolah';
    const isGroup = jenisKelasSelect.value === 'Group';
    const isPrivat = jenisKelasSelect.value === 'Privat';

    // 1. Logika Grade SD
    if (isSD) {
        groupAkademikSD.style.display = 'block';
        inputGrade.required = true;
    } else {
        groupAkademikSD.style.display = 'none';
        inputGrade.required = false;
        inputGrade.value = '';
    }

    // 2. Logika Nama Sekolah
    if (isSD && isGroup) {
        groupSekolah.style.display = 'block';
        inputSekolah.required = true;
    } else {
        groupSekolah.style.display = 'none';
        inputSekolah.required = false;
        inputSekolah.value = '';
    }

    // 3. Logika Lokasi Belajar (Dinamis untuk Group dan Privat)
    // Simpan pilihan user saat ini (jika ada) agar tidak langsung hilang saat pindah opsi
    const currentLokasi = inputLokasi.value; 
    
    // Reset isi dropdown lokasi
    inputLokasi.innerHTML = '<option value="" disabled selected>-- Pilih Lokasi --</option>';

    if (isGroup) {
        groupLokasi.style.display = 'block';
        inputLokasi.required = true;
        // Suntikkan opsi untuk Group
        inputLokasi.add(new Option('Online', 'Online'));
        inputLokasi.add(new Option('Rumah Belajar Al Firdaus (Offline)', 'Rumah Belajar Al Firdaus (Offline)'));
    } else if (isPrivat) {
        groupLokasi.style.display = 'block';
        inputLokasi.required = true;
        // Suntikkan opsi untuk Privat
        inputLokasi.add(new Option('Online', 'Online'));
        inputLokasi.add(new Option('Rumah Belajar Al Firdaus (Offline)', 'Rumah Belajar Al Firdaus (Offline)'));
        inputLokasi.add(new Option('Rumah Peserta (Offline)', 'Rumah Peserta (Offline)'));
    } else {
        groupLokasi.style.display = 'none';
        inputLokasi.required = false;
    }

    // Kembalikan pilihan user sebelumnya jika opsi tersebut masih valid di menu yang baru
    let validOptions = Array.from(inputLokasi.options).map(opt => opt.value);
    if (currentLokasi && validOptions.includes(currentLokasi)) {
        inputLokasi.value = currentLokasi;
    }
}

// EVENT LISTENER
programSelect.addEventListener('change', evaluasiLogikaBersyarat);
jenisKelasSelect.addEventListener('change', evaluasiLogikaBersyarat);

kategoriSelect.addEventListener('change', function() {
    const kategori = this.value;

    if (kategori === 'Anak-anak') {
        groupOrtu.style.display = 'block';
        inputOrtu.required = true;
        
        optCalistung.style.display = 'block'; optCalistung.disabled = false;
        optTahfidz.style.display = 'block'; optTahfidz.disabled = false;
        optBimbelSD.style.display = 'block'; optBimbelSD.disabled = false;
        
    } else if (kategori === 'Dewasa') {
        groupOrtu.style.display = 'none';
        inputOrtu.required = false;
        inputOrtu.value = ''; 
        
        optCalistung.style.display = 'none'; optCalistung.disabled = true;
        optTahfidz.style.display = 'none'; optTahfidz.disabled = true;
        optBimbelSD.style.display = 'none'; optBimbelSD.disabled = true;

        const invalidDewasa = ['Calistung', 'Kelas Tahfidz', 'Bimbingan Akademik Usia TK', 'Bimbingan Akademik SD'];
        if (invalidDewasa.includes(programSelect.value)) {
            programSelect.value = '';
            evaluasiLogikaBersyarat(); // Reset UI terkait
        }
    }
});

// LOGIKA PENGIRIMAN DATA
form.addEventListener('submit', e => {
    e.preventDefault(); 
    
    btnSubmit.disabled = true;
    btnSubmit.innerText = 'Mengirim Data...';
    statusMessage.innerText = '';
    statusMessage.style.color = '#fff';

    let requestBody = new FormData(form);

    fetch(scriptURL, { method: 'POST', body: requestBody })
        .then(response => response.json())
        .then(data => {
            if(data.status === "success") {
                statusMessage.innerText = 'Pendaftaran Berhasil! Silakan cek WhatsApp Anda.';
                statusMessage.style.color = '#00f2fe';
                form.reset(); 
                groupOrtu.style.display = 'none'; 
                evaluasiLogikaBersyarat(); // Sembunyikan field tambahan setelah reset
            } else {
                statusMessage.innerText = 'Terjadi kesalahan sistem. Coba lagi.';
                statusMessage.style.color = '#ff6b6b';
            }
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Daftar Sekarang';
        })
        .catch(error => {
            console.error('Error!', error.message);
            statusMessage.innerText = 'Gagal terhubung ke server.';
            statusMessage.style.color = '#ff6b6b';
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Daftar Sekarang';
        });
});