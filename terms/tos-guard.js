console.log("TOS GUARD LOADED");

document.addEventListener("DOMContentLoaded", function () {

  const overlay = document.getElementById("tosOverlay");
  const acceptBtn = document.getElementById("tosAcceptBtn");
  const declineBtn = document.getElementById("tosDeclineBtn");
  const checkbox = document.getElementById("tosAgreeCheckbox");
  const message = document.getElementById("tosMessage");

  if (!overlay) return;

  const userAccepted = sessionStorage.getItem("tosAccepted");

  if (!userAccepted) {
    overlay.style.display = "flex";
    document.body.classList.add("tos-lock");
  }

  acceptBtn?.addEventListener("click", function () {
    if (!checkbox.checked) {
      message.textContent = "You must agree before continuing.";
      message.style.color = "red";
      return;
    }

    sessionStorage.setItem("tosAccepted", "true");
    overlay.style.display = "none";
    document.body.classList.remove("tos-lock");
  });

  declineBtn?.addEventListener("click", function () {
    window.location.href = "../index.html";
  });

});