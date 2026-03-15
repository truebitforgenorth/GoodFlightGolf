// Main login (global) — SAFE on all pages

window.addEventListener("DOMContentLoaded", () => {
  // EmailJS init (only if loaded)
  try {
    if (window.emailjs) emailjs.init("CJRVHaDVYa2VCU89T");
  } catch (e) {
    console.warn("EmailJS init skipped:", e);
  }

  console.log("Firebase:", firebase);

// --- Firebase init (ONE place for entire site) ---
const firebaseConfig = {
  apiKey: "AIzaSyAnfVHRG6zXhUHURD8-z_7Wiwy2pO4qxF8",
  authDomain: "fairway-fusion-3a4d4.firebaseapp.com",
  projectId: "fairway-fusion-3a4d4",
  storageBucket: "fairway-fusion-3a4d4.appspot.com",
  messagingSenderId: "161862648502",
  appId: "1:161862648502:web:3d59d3f6a8930197c26b16"
};

// Prevent "Firebase App named '[DEFAULT]' already exists"
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Optional: expose db globally if your pages use it
window.db = firebase.firestore();

  const auth = firebase.auth();
  const db = firebase.firestore();

  // DOM Elements (may not exist on every page)
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userEmail = document.getElementById("userEmail");
  const loginBtnModal = document.getElementById("loginLink");
  const welcomeEl = document.getElementById("welcomeMessage");

  const loginMessageEl = document.getElementById("loginMessage");
  const signupMessageEl = document.getElementById("signupMessage");

  // Bootstrap modal (only if exists on page)
  let authModal = null;
  const authModalEl = document.getElementById("authModal");
  if (authModalEl && window.bootstrap) {
    authModal = new bootstrap.Modal(authModalEl);
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const emailEl = document.getElementById("loginEmail");
      const passEl = document.getElementById("loginPassword");

      const email = emailEl ? emailEl.value : "";
      const password = passEl ? passEl.value : "";

      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          if (loginMessageEl) loginMessageEl.textContent = "";
          if (authModal) authModal.hide();
        })
        .catch(err => {
          if (loginMessageEl) loginMessageEl.textContent = err.message;
          else alert(err.message);
        });
    });
  }

// -----------------------------
// SIGNUP
// -----------------------------
if (signupBtn) {
  signupBtn.addEventListener("click", () => {

    const usernameInput = document.getElementById("signupUsername");
    const emailEl = document.getElementById("signupEmail");
    const passEl = document.getElementById("signupPassword");
    const tosCheckbox = document.getElementById("signupTosCheckbox");

    const email = emailEl ? emailEl.value : "";
    const password = passEl ? passEl.value : "";
    const username = usernameInput ? usernameInput.value.trim() : "";

    // Require username if field exists
    if (usernameInput && !username) {
      if (signupMessageEl) signupMessageEl.textContent = "Please enter a username.";
      return;
    }

    // 🚨 Require Terms agreement
    if (!tosCheckbox || !tosCheckbox.checked) {
      if (signupMessageEl) {
        signupMessageEl.textContent = "You must agree to the Terms of Service before creating an account.";
      }
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then((cred) => {

        const nameToSave = username || email;

        // 🔐 Save user + legal agreement
        return db.collection("users").doc(cred.user.uid).set({
          username: nameToSave,
          tosAccepted: true,
          privacyAccepted: true,
          disclaimerAccepted: true,
          legalVersion: "2026-03-15",
          legalAcceptedAt: new Date().toISOString()
        });
      })
      .then(() => {

        // 📧 Send welcome email (GOODFLIGHTGOLF fixed)
        if (window.emailjs) {
          return emailjs.send("service_6j5b7jm", "template_gtko0rj", {
            to_email: email,
            to_name: username || email,
            site_name: "GoodFlightGolf"
          });
        }
      })
      .then(() => {
        if (signupMessageEl) signupMessageEl.textContent = "";
        if (authModal) authModal.hide();
      })
      .catch(err => {
        if (signupMessageEl) signupMessageEl.textContent = err.message;
        else alert(err.message);
        console.error("Signup error:", err);
      });
  });
}

  // -----------------------------
  // LOGOUT
  // -----------------------------
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => auth.signOut());
  }

  // -----------------------------
  // AUTH STATE (ONE LISTENER)
  // -----------------------------
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      // Logged out UI
      if (userEmail) {
        userEmail.textContent = "";
        userEmail.classList.add("d-none");
      }
      if (logoutBtn) logoutBtn.classList.add("d-none");
      if (loginBtnModal) loginBtnModal.classList.remove("d-none");

      if (welcomeEl) {
        welcomeEl.textContent = "";
        welcomeEl.classList.add("d-none");
      }
      return;
    }

    // Logged in UI
    let displayName = user.email;

    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists && doc.data().username) {
        displayName = doc.data().username;
      }
    } catch (err) {
      console.error("Error getting username:", err);
    }

    if (userEmail) {
      userEmail.textContent = displayName;
      userEmail.classList.remove("d-none");
    }
    if (logoutBtn) logoutBtn.classList.remove("d-none");
    if (loginBtnModal) loginBtnModal.classList.add("d-none");

    if (welcomeEl) {
      welcomeEl.textContent = `Welcome back, ${displayName}!`;
      welcomeEl.classList.remove("d-none");
    }
  });
});



// Back to top
    const mybutton = document.getElementById("btn-back-to-top");

    window.addEventListener("scroll", () => {
      if (!mybutton) return;
      mybutton.style.display = (document.documentElement.scrollTop > 300) ? "flex" : "none";
    });

    mybutton?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
