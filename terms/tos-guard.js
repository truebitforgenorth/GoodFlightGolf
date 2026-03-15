console.log("TOS GUARD LOADED");

(function initTosGuard() {
  function runGuard() {
    const overlay = document.getElementById("tosOverlay");
    const acceptBtn = document.getElementById("tosAcceptBtn");
    const declineBtn = document.getElementById("tosDeclineBtn");
    const checkbox = document.getElementById("tosAgreeCheckbox");
    const message = document.getElementById("tosMessage");

    if (!overlay) {
      console.warn("TOS GUARD: #tosOverlay not found on this page.");
      return;
    }

    function showOverlay(msg = "") {
      overlay.style.display = "flex";
      document.body.classList.add("tos-lock");

      if (message) {
        message.textContent = msg;
        message.style.color = "#dc3545";
      }

      if (checkbox) checkbox.checked = false;
    }

    function hideOverlay() {
      overlay.style.display = "none";
      document.body.classList.remove("tos-lock");

      if (message) message.textContent = "";
    }

    function bindButtons() {
      acceptBtn?.addEventListener("click", function () {
        if (!checkbox?.checked) {
          showOverlay("You must agree before continuing.");
          return;
        }

        hideOverlay();
      });

      declineBtn?.addEventListener("click", function () {
        window.location.href = "goodflightgames.html";
      });
    }

    async function handleAuthState() {
      // Firebase may not be ready instantly
      const waitForFirebase = setInterval(() => {
        if (window.firebase && firebase.auth) {
          clearInterval(waitForFirebase);

          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // Logged in users already accepted during signup
              hideOverlay();
            } else {
              // Logged out users must agree every time they visit a game page
              showOverlay("Please review and agree before continuing.");
            }
          });
        }
      }, 100);

      setTimeout(() => clearInterval(waitForFirebase), 5000);
    }

    bindButtons();
    showOverlay("Please review and agree before continuing.");
    handleAuthState();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runGuard);
  } else {
    runGuard();
  }
})();