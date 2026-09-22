let currentUser = null;

let usersDb = JSON.parse(localStorage.getItem('sim_users')) || [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'kepegawaian', role: 'kepegawaian' },
    { id: 3, username: 'budi', role: 'pegawai' }
];

let pegawaiDb = JSON.parse(localStorage.getItem('sim_pegawai')) || [
    { id: 1, nip: '198507122010', nama: 'Dr. M. Ibrohim, M.Kom.', kategori: 'Dosen', jabatan: 'Kepala UPT PSI', unit: 'Teknik Informatika', riwayat: 3 },
    { id: 2, nip: '199801012022', nama: 'Budi Santoso', kategori: 'Pegawai', jabatan: 'Staff Infrastruktur', unit: 'JARVIS', riwayat: 1 }
];

let absensiDb = JSON.parse(localStorage.getItem('sim_absensi')) || [];
let cutiDb = JSON.parse(localStorage.getItem('sim_cuti')) || [];

// DOM Elements
const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const loginUsername = document.getElementById('login-username');
const btnLogout = document.getElementById('btn-logout');
const userBadge = document.getElementById('user-badge');
const pageTitle = document.getElementById('page-title');

// Sidebar Containers
const menuUserContainer = document.getElementById('menu-user-container');
const menuPegawaiContainer = document.getElementById('menu-pegawai-container');
const menuAbsensiContainer = document.getElementById('menu-absensi-container');
const menuRekapAbsensiContainer = document.getElementById('menu-rekap-absensi-container');
const menuCutiContainer = document.getElementById('menu-cuti-container');
const menuApprovalContainer = document.getElementById('menu-approval-container');

const menuLinks = document.querySelectorAll('.sidebar-menu a');
const contentPanels = document.querySelectorAll('.content-panel');

// Forms & Modals
const formCuti = document.getElementById('form-cuti');
const btnAbsenMasuk = document.getElementById('btn-absen-masuk');
const btnAbsenPulang = document.getElementById('btn-absen-pulang');

const pegawaiModal = document.getElementById('pegawai-modal');
const btnOpenPegawaiModal = document.getElementById('btn-open-pegawai-modal');
const closePegawaiModal = document.getElementById('close-pegawai-modal');
const formPegawai = document.getElementById('form-pegawai');

const userModal = document.getElementById('user-modal');
const btnOpenUserModal = document.getElementById('btn-open-user-modal');
const closeUserModal = document.getElementById('close-user-modal');
const formUser = document.getElementById('form-user');

// Login Handler
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const uname = loginUsername.value.trim().toLowerCase();

    let foundUser = usersDb.find(u => u.username === uname);
    if (!foundUser) {
        foundUser = { id: Date.now(), username: uname, role: 'pegawai' };
        usersDb.push(foundUser);
        localStorage.setItem('sim_users', JS
