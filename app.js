// =====================================================
// APLIKASI PELANGGARAN SISWA
// SMAN 2 RANGKASBITUNG
// =====================================================


import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";


import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================
//
// GANTI SEMUA NILAI DI BAWAH DENGAN CONFIG FIREBASE
// PROJECT ANDA.
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyDTvaRqqu4y2uBhRqsJBNYYKZKICukqJp4",
  authDomain: "pelanggaran-siswa-sman2-631d2.firebaseapp.com",
  projectId: "pelanggaran-siswa-sman2-631d2",
  storageBucket: "pelanggaran-siswa-sman2-631d2.firebasestorage.app",
  messagingSenderId: "1009050312279",
  appId: "1:1009050312279:web:e5abb8ab0edfb11d408d12"
};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);


// =====================================================
// ELEMENT
// =====================================================

const loadingPage =
  document.getElementById(
    "loadingPage"
  );

const loginPage =
  document.getElementById(
    "loginPage"
  );

const adminPage =
  document.getElementById(
    "adminPage"
  );

const gdsPage =
  document.getElementById(
    "gdsPage"
  );

const guruPage =
  document.getElementById(
    "guruPage"
  );

const loginForm =
  document.getElementById(
    "loginForm"
  );

const loginButton =
  document.getElementById(
    "loginButton"
  );

const loginMessage =
  document.getElementById(
    "loginMessage"
  );


// =====================================================
// HIDE ALL PAGES
// =====================================================

function hideAllPages() {

  loginPage.classList.add(
    "hidden"
  );

  adminPage.classList.add(
    "hidden"
  );

  gdsPage.classList.add(
    "hidden"
  );

  guruPage.classList.add(
    "hidden"
  );

}


// =====================================================
// SHOW PAGE
// =====================================================

function showPage(page) {

  hideAllPages();

  page.classList.remove(
    "hidden"
  );

}


// =====================================================
// LOGIN MESSAGE
// =====================================================

function showLoginMessage(
  message
) {

  loginMessage.textContent =
    message;

  loginMessage.classList.add(
    "show"
  );

}


function clearLoginMessage() {

  loginMessage.textContent =
    "";

  loginMessage.classList.remove(
    "show"
  );

}


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    clearLoginMessage();


    const email =
      document
        .getElementById("email")
        .value
        .trim();


    const password =
      document
        .getElementById("password")
        .value;


    if (
      !email ||
      !password
    ) {

      showLoginMessage(
        "Email dan password harus diisi."
      );

      return;

    }


    loginButton.disabled =
      true;

    loginButton.textContent =
      "Memproses...";


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    }

    catch(error) {

      console.error(
        "Login error:",
        error
      );


      let message =
        "Login gagal.";


      if (
        error.code ===
        "auth/invalid-credential"
      ) {

        message =
          "Email atau password salah.";

      }

      else if (
        error.code ===
        "auth/user-not-found"
      ) {

        message =
          "Akun tidak ditemukan.";

      }

      else if (
        error.code ===
        "auth/wrong-password"
      ) {

        message =
          "Password salah.";

      }

      else if (
        error.code ===
        "auth/too-many-requests"
      ) {

        message =
          "Terlalu banyak percobaan login.";

      }

      else {

        message =
          error.message;

      }


      showLoginMessage(
        message
      );


      loginButton.disabled =
        false;

      loginButton.textContent =
        "Login";

    }

  }
);


// =====================================================
// LOAD USER ROLE
// =====================================================

async function loadUserRole(
  user
) {

  try {

    const userRef =
      doc(
        db,
        "users",
        user.uid
      );


    const userSnapshot =
      await getDoc(
        userRef
      );


    if (
      !userSnapshot.exists()
    ) {

      throw new Error(
        "Data pengguna tidak ditemukan di Firestore."
      );

    }


    const data =
      userSnapshot.data();


    const role =
      String(
        data.role || ""
      )
      .trim()
      .toLowerCase();


    const nama =
      data.nama ||
      user.email ||
      "Pengguna";


    console.log(
      "User:",
      nama
    );

    console.log(
      "Role:",
      role
    );


    // ADMIN

    if (
      role === "admin"
    ) {

      document
        .getElementById(
          "adminName"
        )
        .textContent =
          nama;

      showPage(
        adminPage
      );

      return;

    }


    // GDS

    if (
      role === "gds"
    ) {

      document
        .getElementById(
          "gdsName"
        )
        .textContent =
          nama;

      showPage(
        gdsPage
      );

      return;

    }


    // GURU

    if (
      role === "guru"
    ) {

      document
        .getElementById(
          "guruName"
        )
        .textContent =
          nama;

      showPage(
        guruPage
      );

      return;

    }


    await signOut(
      auth
    );


    throw new Error(
      "Role pengguna tidak valid."
    );

  }

  catch(error) {

    console.error(
      "Gagal membaca role:",
      error
    );


    await signOut(
      auth
    );


    showPage(
      loginPage
    );


    showLoginMessage(
      error.message
    );

  }

}


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(
  auth,
  async function(user) {

    loadingPage.classList.add(
      "hidden"
    );


    if (user) {

      await loadUserRole(
        user
      );

    }

    else {

      showPage(
        loginPage
      );

    }

  }
);


// =====================================================
// LOGOUT
// =====================================================

document
  .getElementById(
    "logoutAdmin"
  )
  .addEventListener(
    "click",
    () => signOut(auth)
  );


document
  .getElementById(
    "logoutGds"
  )
  .addEventListener(
    "click",
    () => signOut(auth)
  );


document
  .getElementById(
    "logoutGuru"
  )
  .addEventListener(
    "click",
    () => signOut(auth)
  );


// =====================================================
// SERVICE WORKER
// =====================================================

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .then(
          registration => {

            console.log(
              "Service Worker aktif:",
              registration.scope
            );

          }
        )
        .catch(
          error => {

            console.error(
              "Service Worker gagal:",
              error
            );

          }
        );

    }
  );

}

// =====================================================
// Admin Dasbord
// =====================================================
async function loadDataSiswa() {

  const container = document.getElementById("tabelSiswa");

  if (!container) return;

  container.innerHTML = "Memuat data siswa...";

  try {

    const snapshot = await getDocs(
      collection(db, "siswa")
    );

    if (snapshot.empty) {

      container.innerHTML = `
        <p>Belum ada data siswa.</p>
      `;

      return;
    }

    let html = `
      <div class="table-wrapper">

      <table class="data-table">

        <thead>
          <tr>
            <th>No</th>
            <th>NISN</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
    `;

    let no = 1;

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      html += `
        <tr>

          <td>${no++}</td>

          <td>${escapeHTML(data.nisn || "")}</td>

          <td>${escapeHTML(data.nama || "")}</td>

          <td>${escapeHTML(data.kelas || "")}</td>

          <td>
            <button
              class="btn-danger"
              onclick="hapusSiswa('${docSnap.id}')"
            >
              Hapus
            </button>
          </td>

        </tr>
      `;
    });

    html += `
        </tbody>

      </table>

      </div>
    `;

    container.innerHTML = html;

  } catch (error) {

    console.error(error);

    container.innerHTML = `
      <p style="color:red">
        Gagal mengambil data siswa:
        ${escapeHTML(error.message)}
      </p>
    `;
  }
}

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.hapusSiswa = async function(id) {

  const yakin = confirm(
    "Apakah Anda yakin ingin menghapus siswa ini?"
  );

  if (!yakin) return;

  try {

    await deleteDoc(
      doc(db, "siswa", id)
    );

    alert("Data siswa berhasil dihapus.");

    loadDataSiswa();

  } catch (error) {

    console.error(error);

    alert(
      "Gagal menghapus data siswa:\n" +
      error.message
    );
  }
};

function parseCSV(text) {

  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter(line => line.trim() !== "");

  if (lines.length < 2) {
    throw new Error(
      "File CSV tidak memiliki data."
    );
  }

  const headers = lines[0]
    .split(";")
    .map(h => h.trim().toLowerCase());

  const requiredHeaders = [
    "nisn",
    "nama",
    "kelas"
  ];

  for (const header of requiredHeaders) {

    if (!headers.includes(header)) {

      throw new Error(
        `Kolom "${header}" tidak ditemukan. ` +
        `Header harus: nisn,nama,kelas`
      );
    }
  }

  const indexNISN = headers.indexOf("nisn");
  const indexNama = headers.indexOf("nama");
  const indexKelas = headers.indexOf("kelas");

  const data = [];

  for (let i = 1; i < lines.length; i++) {

    const columns = lines[i]
      .split(",")
      .map(value => value.trim());

    const nisn = columns[indexNISN] || "";
    const nama = columns[indexNama] || "";
    const kelas = columns[indexKelas] || "";

    if (!nisn && !nama && !kelas) {
      continue;
    }

    if (!nisn || !nama || !kelas) {

      throw new Error(
        `Data pada baris ${i + 1} tidak lengkap.`
      );
    }

    data.push({
      nisn,
      nama,
      kelas
    });
  }

  return data;
}

async function importDataSiswa() {

  const fileInput =
    document.getElementById("fileSiswa");

  const hasil =
    document.getElementById("hasilImportSiswa");

  if (!fileInput.files.length) {

    alert("Silakan pilih file CSV terlebih dahulu.");

    return;
  }

  const file = fileInput.files[0];

  try {

    hasil.innerHTML =
      "Membaca file...";

    const text = await file.text();

    const dataSiswa = parseCSV(text);

    hasil.innerHTML =
      `Ditemukan ${dataSiswa.length} data siswa. Mengimpor...`;

    let berhasil = 0;

    for (const siswa of dataSiswa) {

      await addDoc(
        collection(db, "siswa"),
        {
          nisn: String(siswa.nisn),
          nama: String(siswa.nama),
          kelas: String(siswa.kelas)
        }
      );

      berhasil++;
    }

    hasil.innerHTML = `
      <span style="color:green">
        Import berhasil.
        ${berhasil} data siswa berhasil dimasukkan.
      </span>
    `;

    fileInput.value = "";

    await loadDataSiswa();

  } catch (error) {

    console.error(error);

    hasil.innerHTML = `
      <span style="color:red">
        Import gagal:
        ${escapeHTML(error.message)}
      </span>
    `;
  }
}

const btnImportSiswa =
  document.getElementById("btnImportSiswa");

if (btnImportSiswa) {

  btnImportSiswa.addEventListener(
    "click",
    importDataSiswa
  );
}

if (role === "admin") {

  showPage("adminPage");

  loadDataSiswa();
}
