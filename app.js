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
  doc,
  getDoc
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
