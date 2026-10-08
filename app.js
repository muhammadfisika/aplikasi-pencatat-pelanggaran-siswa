// =====================================================
// APLIKASI PELANGGARAN SISWA
// SMAN 2 RANGKASBITUNG
// =====================================================


// =====================================================
// FIREBASE APP
// =====================================================

import {
  initializeApp
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";


// =====================================================
// FIREBASE AUTH
// =====================================================

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


// =====================================================
// FIRESTORE
// =====================================================

import {
  getFirestore,
  doc,
  getDoc
} from
"https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================
//
// GANTI DENGAN CONFIG FIREBASE ANDA
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
// SEMBUNYIKAN SEMUA HALAMAN
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
// TAMPILKAN HALAMAN
// =====================================================

function showPage(page) {

  hideAllPages();

  page.classList.remove(
    "hidden"
  );

}


// =====================================================
// PESAN LOGIN
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
        error
      );


      let message =
        "Login gagal.";


      switch(
        error.code
      ) {

        case
        "auth/invalid-credential":

          message =
            "Email atau password salah.";

          break;


        case
        "auth/user-not-found":

          message =
            "Akun tidak ditemukan.";

          break;


        case
        "auth/wrong-password":

          message =
            "Password salah.";

          break;


        case
        "auth/too-many-requests":

          message =
            "Terlalu banyak percobaan login.";

          break;


        default:

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
// BACA DATA USER FIRESTORE
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


    const userSnap =
      await getDoc(
        userRef
      );


    if (
      !userSnap.exists()
    ) {

      throw new Error(
        "Data pengguna belum dibuat di Firestore."
      );

    }


    const userData =
      userSnap.data();


    const role =
      String(
        userData.role || ""
      )
      .trim()
      .toLowerCase();


    const nama =
      userData.nama ||
      user.email ||
      "Pengguna";


    console.log(
      "Nama:",
      nama
    );


    console.log(
      "Role:",
      role
    );


    // =================================================
    // ADMIN
    // =================================================

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


    // =================================================
    // GDS
    // =================================================

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


    // =================================================
    // GURU
    // =================================================

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


    // =================================================
    // ROLE SALAH
    // =================================================

    await signOut(
      auth
    );


    throw new Error(
      "Role pengguna tidak valid."
    );

  }

  catch(error) {

    console.error(
      "Role error:",
      error
    );


    await signOut(
      auth
    );


    showPage(
      loginPage
    );


    showLoginMessage(
      error.message ||
      "Gagal membaca data pengguna."
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
    async function() {

      await signOut(
        auth
      );

    }
  );


document
  .getElementById(
    "logoutGds"
  )
  .addEventListener(
    "click",
    async function() {

      await signOut(
        auth
      );

    }
  );


document
  .getElementById(
    "logoutGuru"
  )
  .addEventListener(
    "click",
    async function() {

      await signOut(
        auth
      );

    }
  );


// =====================================================
// SERVICE WORKER
// =====================================================

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    function() {

      navigator.serviceWorker
        .register(
          "./sw.js"
        )
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
