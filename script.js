// GANTI STRING DI BAWAH DENGAN URL WEB APP GAS ANDA DARI TAHAP 2
const scriptURL = 'https://script.google.com/macros/s/AKfycbzkI78o2IHLSiHKE7yQ2Ipcqch1awFzxZf_6VXOHUXb9ZreJReemeijRJnJ6iOP2Kx7/exec';

const form = document.getElementById('pendaftaranForm');
const kategoriSelect = document.getElementById('kategori');
const groupOrtu = document.getElementById('groupOrtu');
const inputOrtu = document.getElementById('namaOrtu');
const programSelect = document.getElementById('program');
const optCalistung = document.getElementById('optCalistung');
const btnSubmit = document.getElementById('btnSubmit');
const statusMessage = document.getElementById('statusMessage');

// LOGIKA BERSYARAT (Conditional Logic)
kategoriSelect.addEventListener('change', function() {
    const kategori = this.value;

    if (kategori === 'Anak-anak') {
        // Munculkan kolom Nama Orang Tua dan wajibkan
        groupOrtu.style.display = 'block';
        inputOrtu.required = true;
        
        // Munculkan kembali opsi Calistung jika sebelumnya disembunyikan
        optCalistung.style.display = 'block';
        optCalistung.disabled = false;
    } else if (kategori === 'Dewasa') {
        // Sembunyikan kolom Nama Orang Tua dan hapus kewajibannya
        groupOrtu.style.display = 'none';
        inputOrtu.required = false;
        inputOrtu.value = ''; // Bersihkan isian
        
        // Sembunyikan opsi Calistung
        optCalistung.style.display = 'none';
        optCalistung.disabled = true;

        // Jika sebelumnya user memilih Calistung lalu ganti ke Dewasa, reset dropdown program
        if (programSelect.value === 'Calistung') {
            programSelect.value = '';
        }
    }
});

// LOGIKA PENGIRIMAN DATA KE GOOGLE SHEETS
form.addEventListener('submit', e => {
    e.preventDefault(); // Mencegah reload halaman
    
    // Ubah status tombol agar user tidak klik berkali-kali
    btnSubmit.disabled = true;
    btnSubmit.innerText = 'Mengirim Data...';
    statusMessage.innerText = '';
    statusMessage.style.color = '#fff';

    // Mengambil semua data dari form
    let requestBody = new FormData(form);

    fetch(scriptURL, { method: 'POST', body: requestBody })
        .then(response => response.json())
        .then(data => {
            if(data.status === "success") {
                statusMessage.innerText = 'Pendaftaran Berhasil! Silakan cek WhatsApp Anda.';
                statusMessage.style.color = '#00f2fe';
                form.reset(); // Kosongkan form
                groupOrtu.style.display = 'none'; // Kembalikan ke posisi semula
            } else {
                statusMessage.innerText = 'Terjadi kesalahan sistem. Coba lagi.';
                statusMessage.style.color = '#ff6b6b';
            }
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Daftar Sekarang';
        })
        .catch(error => {
            console.error('Error!', error.message);
            statusMessage.innerText = 'Gagal terhubung ke server. Pastikan koneksi internet stabil.';
            statusMessage.style.color = '#ff6b6b';
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Daftar Sekarang';
        });
});