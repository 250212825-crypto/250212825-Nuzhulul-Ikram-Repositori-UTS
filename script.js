// ============================================================
//  script.js — Portfolio Nuzhulul Ikram
//  Carousel, Typing Animation, Scroll Reveal,
//          Navbar Scroll Effect, Form Validation, Hamburger Menu
// ============================================================


// ===== 1. CAROUSEL PROJECT =====
// Dijalankan setelah seluruh DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function () {

    // Jumlah card yang tampil sekaligus di layar
    const VISIBLE = 3;

    // Ambil elemen carousel dari DOM
    const track = document.getElementById('carouselTrack');
    const cards = track.querySelectorAll('.project-card');
    const dots  = document.getElementById('carouselDots');

    // Hitung batas maksimum index yang bisa digeser
    const totalCards = cards.length;
    const maxIndex   = totalCards - VISIBLE;
    let   current    = 0;

    // Buat dot indicator secara dinamis sesuai jumlah langkah
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        if (i === 0) dot.classList.add('active'); // dot pertama aktif
        dot.addEventListener('click', () => goTo(i));
        dots.appendChild(dot);
    }

    // Fungsi utama: geser carousel ke index tertentu
    function goTo(index) {
        // Batasi index agar tidak keluar dari range
        current = Math.max(0, Math.min(index, maxIndex));

        // Hitung offset perpindahan berdasarkan lebar card + gap
        const cardWidth = cards[0].offsetWidth;
        const gap       = 24;
        const offset    = current * (cardWidth + gap);

        // Terapkan transformasi geser horizontal
        track.style.transform = `translateX(-${offset}px)`;

        // Update status dot aktif
        document.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });

        // Nonaktifkan tombol prev/next jika sudah di ujung
        document.querySelector('.carousel-btn.prev').disabled = current === 0;
        document.querySelector('.carousel-btn.next').disabled = current === maxIndex;
    }

    // Fungsi bantu untuk tombol prev/next (dipanggil dari HTML via onclick)
    function moveCarousel(direction) {
        goTo(current + direction);
    }

    // Ekspos ke global agar bisa dipanggil dari atribut onclick di HTML
    window.moveCarousel = moveCarousel;

    // Inisialisasi posisi awal carousel
    goTo(0);
});


// ===== 2. TYPING ANIMATION =====
// Mengetik dan menghapus teks role secara bergantian di hero section
(function () {
    const roles   = ["Web Developer", "UI/UX Designer", "Graphic Designer"];
    const target  = document.getElementById('typing-text');
    let roleIndex = 0;  // index role yang sedang ditampilkan
    let charIndex = 0;  // posisi karakter yang sedang diketik/dihapus
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];

        // Tambah atau kurangi karakter sesuai mode
        if (isDeleting) {
            target.textContent = currentRole.slice(0, charIndex--);
        } else {
            target.textContent = currentRole.slice(0, charIndex++);
        }

        // Kecepatan: menghapus lebih cepat dari mengetik
        let delay = isDeleting ? 60 : 100;

        if (!isDeleting && charIndex > currentRole.length) {
            // Selesai mengetik → jeda sebentar lalu mulai hapus
            delay      = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex < 0) {
            // Selesai menghapus → pindah ke role berikutnya
            isDeleting = false;
            charIndex  = 0;
            roleIndex  = (roleIndex + 1) % roles.length;
            delay      = 400;
        }

        setTimeout(type, delay);
    }

    // Mulai animasi
    type();
})();


// ===== 3. SCROLL REVEAL ANIMATION =====
// Elemen dengan class .reveal akan muncul saat masuk ke viewport
(function () {
    const reveals = document.querySelectorAll('.reveal');

    // IntersectionObserver memantau apakah elemen masuk ke layar
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // tambah class pemicu animasi
                observer.unobserve(entry.target);      // animasi hanya terjadi sekali
            }
        });
    }, { threshold: 0.15 }); // mulai saat 15% elemen terlihat

    // Pasang observer ke semua elemen .reveal
    reveals.forEach(el => observer.observe(el));
})();


// ===== 4. NAVBAR SCROLL EFFECT =====
// Tambahkan class .scrolled ke navbar saat pengguna scroll > 50px
(function () {
    const navWrapper = document.querySelector('.nav-wrapper');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navWrapper.classList.add('scrolled');    // navbar berubah gelap
        } else {
            navWrapper.classList.remove('scrolled'); // kembali transparan di hero
        }
    });
})();


// ===== 5. FORM VALIDATION =====
// Validasi input sebelum form contact dikirim
(function () {
    const form = document.querySelector('.contact-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // cegah reload halaman

        // Ambil elemen input
        const name    = form.querySelector('input[type="text"]');
        const email   = form.querySelector('input[type="email"]');
        const message = form.querySelector('textarea');

        // Bersihkan highlight error dari pengiriman sebelumnya
        [name, email, message].forEach(el => el.classList.remove('input-error'));

        let valid = true;

        // Validasi nama: tidak boleh kosong
        if (name.value.trim() === '') {
            name.classList.add('input-error');
            valid = false;
        }

        // Validasi email: harus sesuai format user@domain.tld
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            email.classList.add('input-error');
            valid = false;
        }

        // Validasi pesan: tidak boleh kosong
        if (message.value.trim() === '') {
            message.classList.add('input-error');
            valid = false;
        }

        // Jika semua valid, tampilkan toast dan reset form
        if (valid) {
            showSuccess();
            form.reset();
        }
    });

    // Tampilkan notifikasi toast di tengah atas layar
    function showSuccess() {
        const toast     = document.createElement('div');
        toast.className = 'toast-success';
        toast.innerHTML = 'Pesan terkirim! Saya akan segera menghubungi kamu.';

        // Tambahkan langsung ke body agar position:fixed bekerja dengan benar
        document.body.appendChild(toast);

        // Delay kecil agar transisi CSS bisa terpicu
        setTimeout(() => toast.classList.add('show'), 10);

        // Hilangkan toast setelah 3.5 detik
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // hapus dari DOM setelah animasi selesai
        }, 3500);
    }
})();


// ===== 6. HAMBURGER MENU =====
// Toggle menu fullscreen saat tombol hamburger diklik (mobile only)
(function () {
    const btn   = document.getElementById('hamburgerBtn');
    const menu  = document.querySelector('.my-nav-list');
    const links = document.querySelectorAll('.my-nav-link');

    // Toggle class active (animasi ☰ → ✕) dan open (tampilkan menu)
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        menu.classList.toggle('open');
    });

    // Tutup menu otomatis saat salah satu link diklik
    links.forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            menu.classList.remove('open');
        });
    });
})();
