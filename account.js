(function () {
  const $ = (id) => document.getElementById(id);

  const els = {
    loggedOut: $("accountLoggedOut"),
    loggedIn: $("accountLoggedIn"),
    avatarPreview: $("accountAvatarPreview"),
    usernameInput: $("accountUsername"),
    emailText: $("accountEmail"),
    photoInput: $("accountPhotoInput"),
    uploadBtn: $("accountUploadBtn"),
    saveBtn: $("accountSaveBtn"),
    status: $("accountStatus")
  };

  let currentUser = null;
  let selectedFile = null;
  let currentPhotoURL = "";

  function setStatus(message = "", type = "") {
    if (!els.status) return;
    els.status.textContent = message;
    els.status.className = `gfg-account-status${type ? ` is-${type}` : ""}`;
  }

  function normalizeUsername(value) {
    return String(value || "").trim().toLowerCase();
  }

  function setAvatar(url, username = "G") {
    if (!els.avatarPreview) return;
    const initial = String(username || "G").trim().charAt(0).toUpperCase() || "G";
    if (url) {
      els.avatarPreview.innerHTML = `<img src="${url}" alt="Profile picture">`;
    } else {
      els.avatarPreview.innerHTML = `<span>${initial}</span>`;
    }
  }

  async function loadAccount(user) {
    const db = firebase.firestore();
    currentUser = user;
    selectedFile = null;
    currentPhotoURL = user?.photoURL || "";

    els.loggedOut?.classList.toggle("d-none", !!user);
    els.loggedIn?.classList.toggle("d-none", !user);

    if (!user) return;

    els.emailText.textContent = user.email || "";
    setStatus("Loading your account...", "info");

    try {
      const [privateSnap, publicSnap] = await Promise.all([
        db.collection("users").doc(user.uid).get(),
        db.collection("publicUsers").doc(user.uid).get()
      ]);

      const privateData = privateSnap.data() || {};
      const publicData = publicSnap.data() || {};
      const username = privateData.username || publicData.username || user.displayName || "";
      currentPhotoURL = publicData.photoURL || privateData.photoURL || user.photoURL || "";

      els.usernameInput.value = username;
      setAvatar(currentPhotoURL, username);
      setStatus("Your profile is ready.", "success");
    } catch (error) {
      console.error("Account load failed:", error);
      setStatus("Could not load your account details.", "error");
    }
  }

  function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Could not read that image."));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error("Could not read that file."));
      reader.readAsDataURL(file);
    });
  }

  async function buildProfilePhotoDataUrl(file) {
    if (!file) return currentPhotoURL;

    if (!file.type.startsWith("image/")) {
      throw new Error("Please choose an image file.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Please choose an image under 5 MB.");
    }

    const img = await loadImageFromFile(file);
    const size = 360;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    const sourceSize = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
    const sourceX = ((img.naturalWidth || img.width) - sourceSize) / 2;
    const sourceY = ((img.naturalHeight || img.height) - sourceSize) / 2;

    ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
    return canvas.toDataURL("image/jpeg", 0.82);
  }

  async function saveAccount() {
    if (!currentUser) {
      setStatus("Log in before saving your account.", "error");
      return;
    }

    const username = String(els.usernameInput.value || "").trim();
    if (!username || username.includes("@")) {
      setStatus("Enter a public username, not an email address.", "error");
      return;
    }

    try {
      els.saveBtn.disabled = true;
      els.uploadBtn.disabled = true;
      setStatus(selectedFile ? "Preparing profile picture..." : "Saving profile...", "info");

      const photoURL = await buildProfilePhotoDataUrl(selectedFile);
      currentPhotoURL = photoURL || "";

      await currentUser.updateProfile({
        displayName: username,
        photoURL: null
      });

      const payload = {
        username,
        usernameLower: normalizeUsername(username),
        photoURL: currentPhotoURL,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await Promise.all([
        firebase.firestore().collection("users").doc(currentUser.uid).set(payload, { merge: true }),
        firebase.firestore().collection("publicUsers").doc(currentUser.uid).set({
          uid: currentUser.uid,
          ...payload
        }, { merge: true })
      ]);

      selectedFile = null;
      setAvatar(currentPhotoURL, username);
      window.dispatchEvent(new CustomEvent("gfg-friend-requests-changed"));
      setStatus("Account saved. Your profile picture will show for friends.", "success");
    } catch (error) {
      console.error("Account save failed:", error);
      setStatus(error.message || "Could not save your account.", "error");
    } finally {
      els.saveBtn.disabled = false;
      els.uploadBtn.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.firebase?.auth || !window.firebase?.firestore) {
      setStatus("Firebase is not ready yet.", "error");
      return;
    }

    els.uploadBtn?.addEventListener("click", () => els.photoInput?.click());
    els.photoInput?.addEventListener("change", () => {
      selectedFile = els.photoInput.files?.[0] || null;
      if (!selectedFile) return;

      const previewUrl = URL.createObjectURL(selectedFile);
      setAvatar(previewUrl, els.usernameInput?.value || "G");
      setStatus("Preview ready. Save your account to upload it.", "info");
    });
    els.saveBtn?.addEventListener("click", saveAccount);

    firebase.auth().onAuthStateChanged(loadAccount);
  });
})();
