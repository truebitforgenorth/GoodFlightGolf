document.addEventListener("DOMContentLoaded", () => {
  console.log("TOS GUARD LOADED");

  const tosOverlay = document.getElementById("tosOverlay");
  const tosAgreeCheckbox = document.getElementById("tosAgreeCheckbox");
  const tosAcceptBtn = document.getElementById("tosAcceptBtn");
  const tosDeclineBtn = document.getElementById("tosDeclineBtn");
  const tosMessage = document.getElementById("tosMessage");

  if (!tosOverlay || !tosAgreeCheckbox || !tosAcceptBtn || !tosDeclineBtn) {
    console.warn("TOS modal elements not found.");
    return;
  }

  function showOverlay() {
    tosOverlay.style.display = "flex";
    document.body.classList.add("tos-lock");
  }

  function hideOverlay() {
    tosOverlay.style.display = "none";
    document.body.classList.remove("tos-lock");
  }

  function setMessage(msg) {
    if (tosMessage) tosMessage.textContent = msg;
  }

  function startGuard() {
    if (!window.firebase || !firebase.apps || !firebase.apps.length) {
      console.warn("Firebase not ready yet for TOS guard.");
      showOverlay();
      return;
    }

    const auth = firebase.auth();

    auth.onAuthStateChanged((user) => {
      if (user) {
        hideOverlay();
      } else {
        showOverlay();
      }
    });
  }

  tosAcceptBtn.addEventListener("click", () => {
    if (!tosAgreeCheckbox.checked) {
      setMessage("You must agree before continuing.");
      return;
    }

    setMessage("");
    hideOverlay();
  });

  tosDeclineBtn.addEventListener("click", () => {
    window.location.href = "../games/goodflightgames.html";
  });

  // Small delay so myscripts.js can initialize Firebase first
  setTimeout(startGuard, 100);
});