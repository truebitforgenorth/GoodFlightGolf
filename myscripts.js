// Main login (global) - safe on all pages

window.addEventListener("DOMContentLoaded", () => {
  try {
    if (window.emailjs) emailjs.init("CJRVHaDVYa2VCU89T");
  } catch (error) {
    console.warn("EmailJS init skipped:", error);
  }

  console.log("Firebase:", firebase);

  const firebaseConfig = {
    apiKey: "AIzaSyAnfVHRG6zXhUHURD8-z_7Wiwy2pO4qxF8",
    authDomain: "fairway-fusion-3a4d4.firebaseapp.com",
    projectId: "fairway-fusion-3a4d4",
    storageBucket: "fairway-fusion-3a4d4.appspot.com",
    messagingSenderId: "161862648502",
    appId: "1:161862648502:web:3d59d3f6a8930197c26b16"
  };

  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  window.db = firebase.firestore();

  const supportedAuthProtocols = new Set(["http:", "https:", "chrome-extension:"]);
  const authSupportedHere = supportedAuthProtocols.has(window.location.protocol) && typeof window.localStorage !== "undefined";

  if (!authSupportedHere) {
    console.warn("Firebase Auth disabled in local file preview. Open the site over http:// or https:// to use login and signup.");
    return;
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userEmail = document.getElementById("userEmail");
  const loginBtnModal = document.getElementById("loginLink");
  const welcomeEl = document.getElementById("welcomeMessage");

  const loginMessageEl = document.getElementById("loginMessage");
  const signupMessageEl = document.getElementById("signupMessage");

  function normalizeUsername(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setAuthMessage(el, message = "", type = "") {
    if (!el) return;

    el.textContent = message;
    el.classList.remove("gfg-auth-message", "is-error", "is-success");

    if (!message) return;

    el.classList.add("gfg-auth-message");
    el.classList.add(type === "success" ? "is-success" : "is-error");
  }

  function getAuthToastHost() {
    let host = document.getElementById("gfgAuthToastHost");

    if (!host) {
      host = document.createElement("div");
      host.id = "gfgAuthToastHost";
      host.className = "gfg-auth-toast-host";
      document.body.appendChild(host);
    }

    return host;
  }

  function showAuthToast(message, type = "success") {
    if (!message) return;

    const host = getAuthToastHost();
    const toast = document.createElement("div");
    toast.className = `gfg-auth-toast gfg-auth-toast--${type}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = message;

    host.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => toast.remove(), 260);
    }, 2800);
  }

  async function getDisplayNameForUser(user) {
    if (!user) return "Golfer";

    let displayName = user.email || "Golfer";

    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists && doc.data().username) {
        displayName = doc.data().username;
      }
    } catch (error) {
      console.error("Error getting username:", error);
    }

    return displayName;
  }

  async function syncPublicUserProfile(user, username) {
    if (!user) return;

    const cleanUsername = String(username || "").trim();
    const usernameLower = normalizeUsername(cleanUsername);

    // Public profiles are username-only so friends can find each other without exposing emails.
    if (!cleanUsername || cleanUsername.includes("@")) return;

    try {
      await db.collection("publicUsers").doc(user.uid).set({
        uid: user.uid,
        username: cleanUsername,
        usernameLower,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error syncing public profile:", error);
    }
  }

  function ensureFriendBadge(target, id, label) {
    if (!target) return null;

    let badge = document.getElementById(id);
    if (!badge) {
      badge = document.createElement("span");
      badge.id = id;
      badge.className = "gfg-friend-request-badge d-none";
      badge.setAttribute("aria-label", label);
      target.appendChild(badge);
    }

    return badge;
  }

  function setFriendBadgeCount(count) {
    const safeCount = Math.max(0, Number(count) || 0);
    const display = safeCount > 9 ? "9+" : String(safeCount);

    const toggler = document.querySelector(".gfg-navbar .navbar-toggler");
    const clubhouseLink = Array.from(document.querySelectorAll(".gfg-navbar .nav-link"))
      .find((link) => (link.getAttribute("href") || "").includes("social&news.html"));
    const clubhouseHeader = document.querySelector(".clubhouse-friends-card .card-header");

    [
      ensureFriendBadge(toggler, "gfgNavFriendBadge", "Pending friend requests"),
      ensureFriendBadge(clubhouseLink, "gfgClubhouseNavFriendBadge", "Pending friend requests"),
      ensureFriendBadge(clubhouseHeader, "gfgClubhouseHeaderFriendBadge", "Pending friend requests")
    ].forEach((badge) => {
      if (!badge) return;
      badge.textContent = display;
      badge.classList.toggle("d-none", safeCount <= 0);
      badge.setAttribute("title", `${safeCount} pending friend request${safeCount === 1 ? "" : "s"}`);
    });
  }

  async function refreshFriendRequestBadge(user) {
    if (!user) {
      setFriendBadgeCount(0);
      return;
    }

    try {
      const snap = await db
        .collection("friendRequests")
        .where("toUid", "==", user.uid)
        .where("status", "==", "pending")
        .get();

      setFriendBadgeCount(snap.size);
    } catch (error) {
      console.error("Error loading friend request badge:", error);
      setFriendBadgeCount(0);
    }
  }

  window.addEventListener("gfg-friend-requests-changed", () => {
    refreshFriendRequestBadge(auth.currentUser);
  });

  let authModal = null;
  const authModalEl = document.getElementById("authModal");
  if (authModalEl && window.bootstrap) {
    authModal = new bootstrap.Modal(authModalEl);
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const emailEl = document.getElementById("loginEmail");
      const passEl = document.getElementById("loginPassword");

      const email = emailEl ? emailEl.value : "";
      const password = passEl ? passEl.value : "";

      try {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        const displayName = await getDisplayNameForUser(cred.user);

        setAuthMessage(loginMessageEl, "Welcome back. You are logged in.", "success");
        if (authModal) authModal.hide();
        showAuthToast(`Welcome back, ${displayName}!`);
      } catch (error) {
        setAuthMessage(loginMessageEl, error.message, "error");
        if (!loginMessageEl) alert(error.message);
      }
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const usernameInput = document.getElementById("signupUsername");
      const emailEl = document.getElementById("signupEmail");
      const passEl = document.getElementById("signupPassword");
      const tosCheckbox = document.getElementById("signupTosCheckbox");

      const email = emailEl ? emailEl.value : "";
      const password = passEl ? passEl.value : "";
      const username = usernameInput ? usernameInput.value.trim() : "";

      if (usernameInput && !username) {
        setAuthMessage(signupMessageEl, "Please enter a username.", "error");
        return;
      }

      if (!tosCheckbox || !tosCheckbox.checked) {
        setAuthMessage(signupMessageEl, "You must agree to the Terms of Service before creating an account.", "error");
        return;
      }

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        const nameToSave = username || email;

        await db.collection("users").doc(cred.user.uid).set({
          username: nameToSave,
          usernameLower: normalizeUsername(nameToSave),
          tosAccepted: true,
          privacyAccepted: true,
          disclaimerAccepted: true,
          legalVersion: "2026-03-15",
          legalAcceptedAt: new Date().toISOString()
        });

        await syncPublicUserProfile(cred.user, nameToSave);

        if (window.emailjs) {
          await emailjs.send("service_6j5b7jm", "template_gtko0rj", {
            to_email: email,
            to_name: nameToSave,
            site_name: "GoodFlightGolf"
          });
        }

        setAuthMessage(signupMessageEl, "Account created successfully.", "success");
        if (authModal) authModal.hide();
        showAuthToast(`Congrats, ${nameToSave}! Your account is ready.`);
      } catch (error) {
        setAuthMessage(signupMessageEl, error.message, "error");
        if (!signupMessageEl) alert(error.message);
        console.error("Signup error:", error);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => auth.signOut());
  }

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
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
      await refreshFriendRequestBadge(null);
      return;
    }

    const displayName = await getDisplayNameForUser(user);
    await syncPublicUserProfile(user, displayName);
    await refreshFriendRequestBadge(user);

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

const mybutton = document.getElementById("btn-back-to-top");

window.addEventListener("scroll", () => {
  if (!mybutton) return;
  mybutton.style.display = document.documentElement.scrollTop > 300 ? "flex" : "none";
});

mybutton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
