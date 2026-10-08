// =====================================================
// APLIKASI PELANGGARAN SISWA
// SMAN 2 RANGKASBITUNG
// FIREBASE
// =====================================================

// -----------------------------------------------------
// FIREBASE APP
// -----------------------------------------------------

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";


// -----------------------------------------------------
// FIREBASE AUTH
// -----------------------------------------------------

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


// -----------------------------------------------------
// FIRESTORE
// -----------------------------------------------------

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// =====================================================
// KONFIGURASI FIREBASE
// =====================================================
//
// GANTI BAGIAN INI DENGAN KONFIGURASI FIREBASE ANDA
//
// Firebase Console
// Project settings
// Your apps
// Web app
//
// =====================================================

const firebaseConfig = {

  apiKey: "GANTI_API_KEY",

  authDomain:
    "GANTI_PROJECT_ID.firebaseapp.com",

  projectId:
    "GANTI_PROJECT_ID",

  storageBucket:
    "GANTI_STORAGE_BUCKET",

  messagingSenderId:
    "GANTI_MESSAGING_SENDER_ID",

  appId:
    "GANTI_APP_ID"

};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// =====================================================
// ELEMENT
// =====================================================

const loadingPage =
  document.getElementById("loadingPage");

const loginPage =
  document.getElementById("loginPage");

const adminPage =
  document.getElementById("adminPage");

const gdsPage =
  document.getElementById("gdsPage");

const guruPage =
  document.getElementById("guruPage");

const loginForm =
  document.getElementById("loginForm");

const loginButton =
  document.getElementById("loginButton");

const loginMessage =
  document.getElementById("loginMessage");


// =====================================================
// HELPER: SEMBUNYIKAN SEMUA HALAMAN
// =====================================================

function hideAllPages() {

  loginPage.classList.add("hidden");

  adminPage.classList.add("hidden");

  gdsPage.classList.add("hidden");

  guruPage.classList.add("hidden");

}


// =====================================================
// HELPER: PESAN LOGIN
// =====================================================

function showLoginMessage(message) {

  loginMessage.textContent = message;

  loginMessage.classList.add("show");

}


// =====================================================
// HELPER: CLEAR LOGIN MESSAGE
// =====================================================

function clearLoginMessage() {

  loginMessage.textContent = "";

  loginMessage.classList.remove("show");

}


// =====================================================
// HELPER: TAMPILKAN HALAMAN
// =====================================================

function showPage(page) {

  hideAllPages();

  page.classList.remove("hidden");

}


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    clearLoginMessage();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;


    if (!email || !password) {

      showLoginMessage(
        "Email dan password harus diisi."
      );

      return;
    }


    loginButton.disabled = true;

    loginButton.textContent =
      "Memproses...";


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      let message =
        "Login gagal.";

      switch (error.code) {

        case "auth/invalid-credential":
          message =
            "Email atau password salah.";
          break;

        case "auth/user-not-found":
          message =
            "Akun tidak ditemukan.";
          break;

        case "auth/wrong-password":
          message =
            "Password salah.";
          break;

        case "auth/too-many-requests":
          message =
            "Terlalu banyak percobaan login. Coba lagi nanti.";
          break;

        default:
          message =
            error.message;
      }

      showLoginMessage(message);

      loginButton.disabled = false;

      loginButton.textContent =
        "Login";
    }

  }
);


// =====================================================
// CEK ROLE USER
// =====================================================

async function loadUserRole(user) {

  try {

    const userRef =
      doc(db, "users", user.uid);

    const userSnap =
      await getDoc(userRef);


    if (!userSnap.exists()) {

      throw new Error(
        "Data pengguna tidak ditemukan di Firestore."
      );
    }


    const userData =
      userSnap.data();


    const role =
      String(userData.role || "")
        .trim()
        .toLowerCase();


    const nama =
      userData.nama ||
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


    // -------------------------------------------------
    // ADMIN
    // -------------------------------------------------

    if (role === "admin") {

      document.getElementById(
        "adminName"
      ).textContent = nama;

      showPage(adminPage);

      return;
    }


    // -------------------------------------------------
    // GDS
    // -------------------------------------------------

    if (role === "gds") {

      document.getElementById(
        "gdsName"
      ).textContent = nama;

      showPage(gdsPage);

      return;
    }


    // -------------------------------------------------
    // GURU
    // -------------------------------------------------

    if (role === "guru") {

      document.getElementById(
        "guruName"
      ).textContent = nama;

      showPage(guruPage);

      return;
    }


    // -------------------------------------------------
    // ROLE TIDAK DIKENAL
    // -------------------------------------------------

    await signOut(auth);

    throw new Error(
      "Role pengguna tidak valid."
    );

  } catch (error) {

    console.error(
      "Gagal membaca role:",
      error
    );

    await signOut(auth);

    showPage(loginPage);

    showLoginMessage(
      error.message ||
      "Tidak dapat membaca data pengguna."
    );
  }
}


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(
  auth,
  async function (user) {

    loadingPage.classList.add(
      "hidden"
    );


    if (user) {

      await loadUserRole(user);

    } else {

      showPage(loginPage);

    }

  }
);


// =====================================================
// LOGOUT
// =====================================================

document
  .getElementById("logoutAdmin")
  .addEventListener(
    "click",
    () => signOut(auth)
  );


document
  .getElementById("logoutGds")
  .addEventListener(
    "click",
    () => signOut(auth)
  );


document
  .getElementById("logoutGuru")
  .addEventListener(
    "click",
    () => signOut(auth)
  );


// =====================================================
// SERVICE WORKER
// =====================================================

if ("serviceWorker" in navigator) {

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
