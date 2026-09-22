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
        localStorage.setItem('sim_users', JSON.stringify(usersDb));
    }

    currentUser = foundUser;
    loginSection.classList.add('hidden');
    appSection.classList.remove('hidden');

    applyRoleAccess();
    refreshAllData();
});

btnLogout.addEventListener('click', function() {
    currentUser = null;
    loginForm.reset();
    appSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Pembatasan Fitur Berdasarkan Role
function applyRoleAccess() {
    userBadge.innerText = `Role: ${currentUser.role.toUpperCase()} (${currentUser.username})`;

    menuUserContainer.classList.add('hidden');
    menuPegawaiContainer.classList.add('hidden');
    menuAbsensiContainer.classList.add('hidden');
    menuRekapAbsensiContainer.classList.add('hidden');
    menuCutiContainer.classList.add('hidden');
    menuApprovalContainer.classList.add('hidden');

    if (currentUser.role === 'admin') {
        menuUserContainer.classList.remove('hidden');
        menuPegawaiContainer.classList.remove('hidden');
        menuApprovalContainer.classList.remove('hidden');
        menuRekapAbsensiContainer.classList.remove('hidden');
        switchPanel('panel-dashboard');
    } else if (currentUser.role === 'kepegawaian') {
        menuPegawaiContainer.classList.remove('hidden');
        menuApprovalContainer.classList.remove('hidden');
        menuRekapAbsensiContainer.classList.remove('hidden');
        switchPanel('panel-approval');
    } else if (currentUser.role === 'pegawai') {
        menuAbsensiContainer.classList.remove('hidden');
        menuCutiContainer.classList.remove('hidden');
        switchPanel('panel-absensi');
    }
}

// Navigasi Tab
function switchPanel(targetId) {
    menuLinks.forEach(l => l.classList.remove('active'));
    contentPanels.forEach(p => p.classList.add('hidden'));

    const targetPanel = document.getElementById(targetId);
    if (targetPanel) targetPanel.classList.remove('hidden');

    const activeLink = document.querySelector(`.sidebar-menu a[data-target="${targetId}"]`);
    if (activeLink) activeLink.classList.add('active');

    if (targetId === 'panel-dashboard') pageTitle.innerText = "Dashboard Utama";
    if (targetId === 'panel-user') pageTitle.innerText = "Manajemen Akun User";
    if (targetId === 'panel-pegawai') pageTitle.innerText = "Manajemen Data Dosen dan Pegawai";
    if (targetId === 'panel-absensi') pageTitle.innerText = "Absensi Harian Pegawai";
    if (targetId === 'panel-rekap-absensi') pageTitle.innerText = "Rekapitulasi Absensi Pegawai";
    if (targetId === 'panel-cuti') pageTitle.innerText = "Form & Histori Pengajuan Cuti";
    if (targetId === 'panel-approval') pageTitle.innerText = "Validasi Pengajuan Cuti (Bagian Kepegawaian)";
}

menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        switchPanel(this.getAttribute('data-target'));
    });
});

// Kontrol Modal Tambah/Edit Pegawai
if (btnOpenPegawaiModal) {
    btnOpenPegawaiModal.addEventListener('click', () => {
        document.getElementById('pegawai-modal-title').innerText = "Tambah Data Dosen / Pegawai";
        formPegawai.reset();
        document.getElementById('pegawai-id').value = "";
        pegawaiModal.classList.remove('hidden');
    });
}

if (closePegawaiModal) {
    closePegawaiModal.addEventListener('click', () => pegawaiModal.classList.add('hidden'));
}

formPegawai.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('pegawai-id').value;
    const nip = document.getElementById('input-nip').value;
    const nama = document.getElementById('input-nama').value;
    const kategori = document.getElementById('input-kategori').value;
    const jabatan = document.getElementById('input-jabatan').value;
    const unit = document.getElementById('input-unit').value;
    const riwayat = parseInt(document.getElementById('input-riwayat').value);

    if (id) {
        let item = pegawaiDb.find(p => p.id == id);
        if (item) {
            item.nip = nip; item.nama = nama; item.kategori = kategori; item.jabatan = jabatan; item.unit = unit; item.riwayat = riwayat;
        }
    } else {
        pegawaiDb.push({ id: Date.now(), nip, nama, kategori, jabatan, unit, riwayat });
    }

    localStorage.setItem('sim_pegawai', JSON.stringify(pegawaiDb));
    pegawaiModal.classList.add('hidden');
    refreshAllData();
});

// Kontrol Modal Tambah User (Akun Baru)
if (btnOpenUserModal) {
    btnOpenUserModal.addEventListener('click', () => {
        formUser.reset();
        userModal.classList.remove('hidden');
    });
}

if (closeUserModal) {
    closeUserModal.addEventListener('click', () => userModal.classList.add('hidden'));
}

formUser.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value;
    const role = document.getElementById('new-role').value;

    if (usersDb.some(u => u.username === username)) {
        alert('Username sudah terdaftar di sistem!');
        return;
    }

    usersDb.push({ id: Date.now(), username, role });
    localStorage.setItem('sim_users', JSON.stringify(usersDb));
    userModal.classList.add('hidden');
    alert('Akun pengguna baru berhasil dibuat!');
    refreshAllData();
});

// Hapus User & Pegawai
window.hapusPegawai = function(id) {
    if (confirm('Yakin ingin menghapus data SDM ini?')) {
        pegawaiDb = pegawaiDb.filter(p => p.id != id);
        localStorage.setItem('sim_pegawai', JSON.stringify(pegawaiDb));
        refreshAllData();
    }
};

window.hapusUser = function(id) {
    if (confirm('Yakin ingin menghapus akun ini?')) {
        usersDb = usersDb.filter(u => u.id != id);
        localStorage.setItem('sim_users', JSON.stringify(usersDb));
        refreshAllData();
    }
};

window.editPegawai = function(id) {
    const item = pegawaiDb.find(p => p.id == id);
    if (!item) return;

    document.getElementById('pegawai-modal-title').innerText = "Edit Data Dosen / Pegawai";
    document.getElementById('pegawai-id').value = item.id;
    document.getElementById('input-nip').value = item.nip;
    document.getElementById('input-nama').value = item.nama;
    document.getElementById('input-kategori').value = item.kategori;
    document.getElementById('input-jabatan').value = item.jabatan;
    document.getElementById('input-unit').value = item.unit;
    document.getElementById('input-riwayat').value = item.riwayat;

    pegawaiModal.classList.remove('hidden');
};

// Absen Masuk
if (btnAbsenMasuk) {
    btnAbsenMasuk.addEventListener('click', function() {
        const today = new Date().toISOString().slice(0, 10);
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let existingRecord = absensiDb.find(a => a.username === currentUser.username && a.tanggal === today);
        
        if (existingRecord) {
            if (existingRecord.masuk) {
                alert('Anda sudah melakukan absen masuk hari ini!');
                return;
            }
            existingRecord.masuk = now;
        } else {
            absensiDb.push({
                id: Date.now(),
                username: currentUser.username,
                tanggal: today,
                masuk: now,
                pulang: null,
                status: 'Hadir Tepat Waktu'
            });
        }
        
        localStorage.setItem('sim_absensi', JSON.stringify(absensiDb));
        alert('Absen masuk berhasil dicatat!');
        refreshAllData();
    });
}

// Absen Pulang
if (btnAbsenPulang) {
    btnAbsenPulang.addEventListener('click', function() {
        const today = new Date().toISOString().slice(0, 10);
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let existingRecord = absensiDb.find(a => a.username === currentUser.username && a.tanggal === today);
        
        if (!existingRecord || !existingRecord.masuk) {
            alert('Anda belum melakukan absen masuk hari ini!');
            return;
        }
        
        if (existingRecord.pulang) {
            alert('Anda sudah melakukan absen pulang hari ini!');
            return;
        }
        
        existingRecord.pulang = now;
        localStorage.setItem('sim_absensi', JSON.stringify(absensiDb));
        alert('Absen pulang berhasil dicatat!');
        refreshAllData();
    });
}

// Cuti & Upload File
if (formCuti) {
    formCuti.addEventListener('submit', function(e) {
        e.preventDefault();
        const jenis = document.getElementById('cuti-jenis').value;
        const mulai = document.getElementById('cuti-mulai').value;
        const selesai = document.getElementById('cuti-selesai').value;
        const alasan = document.getElementById('cuti-alasan').value;
        const fileInput = document.getElementById('cuti-file');

        let lampiranNama = "Tidak ada";
        let lampiranData = null;

        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            lampiranNama = file.name;
            const reader = new FileReader();
            reader.onload = function(e) {
                lampiranData = e.target.result;
                simpanCutiData(jenis, mulai, selesai, alasan, lampiranNama, lampiranData);
            };
            reader.readAsDataURL(file);
        } else {
            simpanCutiData(jenis, mulai, selesai, alasan, lampiranNama, lampiranData);
        }
    });
}

function simpanCutiData(jenis, mulai, selesai, alasan, lampiranNama, lampiranData) {
    cutiDb.push({
        id: Date.now(),
        pemohon: currentUser.username,
        jenis, mulai, selesai, alasan,
        lampiranNama, lampiranData,
        status: 'Menunggu Persetujuan Kepegawaian'
    });
    localStorage.setItem('sim_cuti', JSON.stringify(cutiDb));
    formCuti.reset();
    alert('Pengajuan cuti berhasil dikirim ke bagian kepegawaian!');
    refreshAllData();
}

window.ubahStatusCuti = function(id, statusAksi) {
    const item = cutiDb.find(c => c.id == id);
    if (item) {
        item.status = statusAksi;
        localStorage.setItem('sim_cuti', JSON.stringify(cutiDb));
        refreshAllData();
    }
};

// Refresh Tampilan Data
function refreshAllData() {
    document.getElementById('total-dosen').innerText = pegawaiDb.filter(p => p.kategori === 'Dosen').length;
    document.getElementById('total-pegawai').innerText = pegawaiDb.filter(p => p.kategori === 'Pegawai').length;
    document.getElementById('total-sdm').innerText = pegawaiDb.length;

    // Absensi Table (Khusus Panel Pegawai)
    const absensiBody = document.getElementById('absensi-table-body');
    if (absensiBody) {
        absensiBody.innerHTML = "";
        absensiDb.filter(a => a.username === currentUser.username).forEach((a, idx) => {
            let waktuPulang = a.pulang ? a.pulang : '<span style="color: var(--danger-color);">Belum Absen Pulang</span>';
            absensiBody.innerHTML += `
                <tr>
                    <td>${idx+1}</td>
                    <td>${a.masuk || '-'}</td>
                    <td>${waktuPulang}</td>
                    <td><span class="badge">${a.status}</span></td>
                </tr>
            `;
        });
    }

    // Rekap Absensi Table (Khusus Panel Kepegawaian / Admin)
    const rekapAbsensiBody = document.getElementById('rekap-absensi-table-body');
    if (rekapAbsensiBody) {
        rekapAbsensiBody.innerHTML = "";
        absensiDb.forEach((a, idx) => {
            let waktuMasuk = a.masuk || '-';
            let waktuPulang = a.pulang ? a.pulang : '<span style="color: var(--danger-color);">Belum Absen Pulang</span>';
            rekapAbsensiBody.innerHTML += `
                <tr>
                    <td>${idx+1}</td>
                    <td><strong>${a.username}</strong></td>
                    <td>${a.tanggal || '-'}</td>
                    <td>${waktuMasuk}</td>
                    <td>${waktuPulang}</td>
                    <td><span class="badge">${a.status}</span></td>
                </tr>
            `;
        });
    }

    // Riwayat Cuti
    const riwayatCutiBody = document.getElementById('riwayat-cuti-pegawai-body');
    if (riwayatCutiBody) {
        riwayatCutiBody.innerHTML = "";
        cutiDb.filter(c => c.pemohon === currentUser.username).forEach(c => {
            let fileLink = c.lampiranData ? `<a href="${c.lampiranData}" target="_blank" download="${c.lampiranNama}">📥 ${c.lampiranNama}</a>` : '<i>Tidak ada</i>';
            riwayatCutiBody.innerHTML += `<tr><td>${c.jenis}</td><td>${c.mulai} s/d ${c.selesai}</td><td>${c.alasan}</td><td>${fileLink}</td><td><strong>${c.status}</strong></td></tr>`;
        });
    }

    // Approval Cuti Kepegawaian
    const approvalBody = document.getElementById('approval-table-body');
    if (approvalBody) {
        approvalBody.innerHTML = "";
        cutiDb.forEach(c => {
            let fileLink = c.lampiranData ? `<a href="${c.lampiranData}" target="_blank" download="${c.lampiranNama}">📥 ${c.lampiranNama}</a>` : '<i>Tidak ada</i>';
            approvalBody.innerHTML += `
                <tr>
                    <td>${c.pemohon}</td>
                    <td>${c.jenis}</td>
                    <td>${c.mulai} s/d ${c.selesai}</td>
                    <td>${c.alasan}</td>
                    <td>${fileLink}</td>
                    <td><strong>${c.status}</strong></td>
                    <td>
                        <button class="btn btn-success" style="padding:4px 8px; font-size:12px;" onclick="ubahStatusCuti(${c.id}, 'Disetujui Kepegawaian')">Setujui</button>
                        <button class="btn btn-danger" style="padding:4px 8px; font-size:12px;" onclick="ubahStatusCuti(${c.id}, 'Ditolak Kepegawaian')">Tolak</button>
                    </td>
                </tr>
            `;
        });
    }

    // Master Pegawai Table
    const pegawaiTableBody = document.getElementById('pegawai-table-body');
    if (pegawaiTableBody) {
        pegawaiTableBody.innerHTML = "";
        pegawaiDb.forEach((p, idx) => {
            pegawaiTableBody.innerHTML += `
                <tr>
                    <td>${idx+1}</td>
                    <td>${p.nip}</td>
                    <td>${p.nama}</td>
                    <td><span class="badge">${p.kategori}</span></td>
                    <td>${p.jabatan}</td>
                    <td>${p.unit}</td>
                    <td><strong>${p.riwayat} Jenjang</strong></td>
                    <td>
                        <button class="btn btn-primary" style="padding:4px 8px; font-size:12px;" onclick="editPegawai(${p.id})">Edit</button>
                        <button class="btn btn-danger" style="padding:4px 8px; font-size:12px;" onclick="hapusPegawai(${p.id})">Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    // User Table
    const userTableBody = document.getElementById('user-table-body');
    if (userTableBody) {
        userTableBody.innerHTML = "";
        usersDb.forEach((u, idx) => {
            userTableBody.innerHTML += `
                <tr>
                    <td>${idx+1}</td>
                    <td>${u.username}</td>
                    <td><span class="badge">${u.role}</span></td>
                    <td>${u.username !== 'admin' ? `<button class="btn btn-danger" style="padding:4px 8px; font-size:12px;" onclick="hapusUser(${u.id})">Hapus</button>` : '<i>Utama</i>'}</td>
                </tr>
            `;
        });
    }
}
