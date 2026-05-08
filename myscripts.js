// Main login (global) - safe on all pages

const GFG_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAnfVHRG6zXhUHURD8-z_7Wiwy2pO4qxF8",
  authDomain: "fairway-fusion-3a4d4.firebaseapp.com",
  projectId: "fairway-fusion-3a4d4",
  storageBucket: "fairway-fusion-3a4d4.appspot.com",
  messagingSenderId: "161862648502",
  appId: "1:161862648502:web:3d59d3f6a8930197c26b16"
};

window.gfgEnsureFirebaseApp = function gfgEnsureFirebaseApp() {
  if (!window.firebase) return null;
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(GFG_FIREBASE_CONFIG);
  }
  window.db = firebase.firestore();
  return firebase.app();
};

try {
  window.gfgEnsureFirebaseApp();
  window.dispatchEvent(new CustomEvent("gfg-firebase-ready"));
} catch (error) {
  console.error("Global Firebase init failed:", error);
}

window.addEventListener("DOMContentLoaded", () => {
  try {
    if (window.emailjs) emailjs.init("CJRVHaDVYa2VCU89T");
  } catch (error) {
    console.warn("EmailJS init skipped:", error);
  }

  console.log("Firebase:", window.firebase);

  ensureFooterQuickLinks();
  window.requestAnimationFrame(() => ensureFooterQuickLinks());
  window.setTimeout(() => ensureFooterQuickLinks(), 0);

  window.gfgEnsureFirebaseApp?.();

  if (!window.firebase) {
    console.warn("Firebase scripts are not available on this page.");
    return;
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

  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
    console.error("Auth persistence setup failed:", error);
  });

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

  function getRootRelativePath(fileName) {
    const path = (window.location.pathname || "").toLowerCase();
    const isSubPage = ["/newsarticles/", "/games/", "/rounds/", "/other/", "/terms/", "/merch/"]
      .some((segment) => path.includes(segment));
    return `${isSubPage ? "../" : ""}${fileName}`;
  }

  function setFooterAdminLinksVisible(isVisible) {
    document.querySelectorAll(".gfg-footer-admin-link, #adminMerchFooterLink").forEach((link) => {
      link.classList.toggle("d-none", !isVisible);
    });
  }

  function buildFooterLinksMarkup() {
    return `
      <div class="gfg-footer-links">
        <a href="${getRootRelativePath("rounds/scorecard.html")}">The Scorecard</a>
        <a href="${getRootRelativePath("games/goodflightgames.html")}">GoodFlight Games</a>
        <a href="${getRootRelativePath("playerlog.html")}">The LabRoom</a>
        <a href="${getRootRelativePath("NewsArticles/social&news.html")}">The Clubhouse</a>
        <a href="${getRootRelativePath("other/about.html")}">About Us</a>
        <a href="${getRootRelativePath("merch/merch.html")}" class="gfg-footer-admin-link d-none">Custom Gear Shop</a>
      </div>
    `;
  }

  function ensureFooterQuickLinks() {
    const footerContainer = document.querySelector(".gfg-footer-container");
    const existingLinks = document.querySelector(".gfg-footer-links");

    if (footerContainer) {
      if (existingLinks) {
        footerContainer.prepend(existingLinks);
      } else {
        footerContainer.insertAdjacentHTML("afterbegin", buildFooterLinksMarkup());
      }
      return;
    }

    const footerContent = document.querySelector(".gfg-footer-content");
    if (footerContent) {
      if (!footerContent.querySelector(".gfg-footer-links")) {
        const ownershipBlock = footerContent.querySelector(".gfg-footer-ownership");
        ownershipBlock?.insertAdjacentHTML("beforebegin", buildFooterLinksMarkup());
      }
      return;
    }

    const legacyFooter = document.querySelector("footer#foot");
    if (legacyFooter && !legacyFooter.querySelector(".gfg-footer-links")) {
      legacyFooter.insertAdjacentHTML("afterbegin", `
        <div class="gfg-footer-links gfg-footer-links--legacy">
          <a href="${getRootRelativePath("rounds/scorecard.html")}">The Scorecard</a>
          <a href="${getRootRelativePath("games/goodflightgames.html")}">Games</a>
          <a href="${getRootRelativePath("playerlog.html")}">LabRoom</a>
          <a href="${getRootRelativePath("NewsArticles/social&news.html")}">Clubhouse</a>
          <a href="${getRootRelativePath("other/about.html")}">About</a>
          <a href="${getRootRelativePath("merch/merch.html")}" class="gfg-footer-admin-link d-none">Custom Gear Shop</a>
        </div>
      `);
    }
  }

  function ensureAccountNavLink() {
    const loginLink = document.getElementById("loginLink");
    const navList = loginLink?.closest("ul");
    if (!navList || document.getElementById("myAccountNavItem")) return;

    const item = document.createElement("li");
    item.id = "myAccountNavItem";
    item.className = "nav-item d-none";
    item.innerHTML = `
      <a class="nav-link" href="${getRootRelativePath("account.html")}">
        <span class="gfg-account-nav-label">
          My <span style="color:#fad02e;">Account</span>
          <span id="gfgAccountNavFriendBadge" class="gfg-friend-request-badge d-none" aria-label="Pending friend requests"></span>
        </span>
      </a>
    `;

    loginLink.closest("li")?.before(item);
  }

  function setAccountNavVisible(isVisible) {
    document.getElementById("myAccountNavItem")?.classList.toggle("d-none", !isVisible);
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
      const privateSnap = await db.collection("users").doc(user.uid).get();
      const privateData = privateSnap.data() || {};

      if (window.GFGLeaderboard?.syncCurrentUserProfile) {
        await window.GFGLeaderboard.syncCurrentUserProfile({
          user,
          db,
          userData: privateData,
          username: cleanUsername,
          photoURL: privateData.photoURL || ""
        });
        return;
      }

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
    const accountNavLink = document.querySelector("#myAccountNavItem .nav-link");

    [
      ensureFriendBadge(toggler, "gfgNavFriendBadge", "Pending friend requests"),
      ensureFriendBadge(accountNavLink, "gfgAccountNavFriendBadge", "Pending friend requests")
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
        .get();

      const pendingCount = snap.docs.filter((doc) => doc.data()?.status === "pending").length;
      setFriendBadgeCount(pendingCount);
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
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        const nameToSave = username || email;

        await db.collection("users").doc(cred.user.uid).set({
          username: nameToSave,
          usernameLower: normalizeUsername(nameToSave),
          leaderboardOptIn: false,
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

  ensureAccountNavLink();

  if (window.gfgAdminState?.ready) {
    setFooterAdminLinksVisible(!!window.gfgAdminState.isAdmin);
  }

  window.addEventListener("gfg-admin-state", (event) => {
    setFooterAdminLinksVisible(!!event.detail?.isAdmin);
  });

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      if (userEmail) {
        userEmail.textContent = "";
        userEmail.classList.add("d-none");
      }
      if (logoutBtn) logoutBtn.classList.add("d-none");
      if (loginBtnModal) loginBtnModal.classList.remove("d-none");
      setAccountNavVisible(false);

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
    setAccountNavVisible(true);

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
