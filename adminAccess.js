(function () {
  const FALLBACK_ADMIN_EMAILS = new Set([
    "truebitforgenorth@gmail.com",
    "truebitbforgenorth@gmail.com"
  ]);
  const FALLBACK_ADMIN_USERNAMES = new Set([
    "test-tbfn"
  ]);

  const supportedAuthProtocols = new Set(["http:", "https:", "chrome-extension:"]);
  const authSupportedHere = supportedAuthProtocols.has(window.location.protocol) && typeof window.localStorage !== "undefined";

  const state = {
    ready: false,
    isAdmin: false,
    reason: "initializing",
    user: null
  };

  function publish(nextState) {
    Object.assign(state, nextState, { ready: true });
    window.gfgAdminState = { ...state };
    window.dispatchEvent(new CustomEvent("gfg-admin-state", { detail: window.gfgAdminState }));
  }

  async function lookupAdminStatus(db, user) {
    const email = (user?.email || "").trim().toLowerCase();
    if (!email) return false;

    if (FALLBACK_ADMIN_EMAILS.has(email)) {
      return true;
    }

    try {
      const profileSnap = await db.collection("users").doc(user.uid).get();
      const username = String(profileSnap.data()?.username || "").trim().toLowerCase();
      if (username && FALLBACK_ADMIN_USERNAMES.has(username)) {
        return true;
      }
    } catch (error) {
      console.warn("Admin username fallback lookup failed:", error);
    }

    const snapshot = await db
      .collection("siteData")
      .doc("adminConfig")
      .collection("adminUsers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) return false;

    return snapshot.docs.some((doc) => doc.data()?.active !== false);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!authSupportedHere || !window.firebase) {
      publish({ isAdmin: false, reason: "unsupported-environment", user: null });
      return;
    }

    const waitForFirebaseInit = () => {
      if (!firebase.apps || !firebase.apps.length) {
        window.setTimeout(waitForFirebaseInit, 50);
        return;
      }

      const auth = firebase.auth();
      const db = firebase.firestore();

      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          publish({ isAdmin: false, reason: "signed-out", user: null });
          return;
        }

        try {
          const isAdmin = await lookupAdminStatus(db, user);
          publish({
            isAdmin,
            reason: isAdmin ? "authorized" : "not-authorized",
            user: {
              uid: user.uid,
              email: user.email || ""
            }
          });
        } catch (error) {
          console.error("Admin status lookup failed:", error);
          publish({
            isAdmin: false,
            reason: "lookup-error",
            user: {
              uid: user.uid,
              email: user.email || ""
            }
          });
        }
      });
    };

    waitForFirebaseInit();
  });
})();
