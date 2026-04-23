(function () {
  const $ = (id) => document.getElementById(id);

  const els = {
    loggedOut: $("friendsLoggedOut"),
    loggedIn: $("friendsLoggedIn"),
    searchInput: $("friendSearchInput"),
    searchBtn: $("friendSearchBtn"),
    status: $("friendSearchStatus"),
    friendsList: $("friendsList"),
    incomingList: $("incomingFriendsList"),
    outgoingList: $("outgoingFriendsList")
  };

  if (!els.loggedOut || !els.loggedIn) return;

  let currentUser = null;
  let currentUsername = "";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeUsername(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getDb() {
    return window.firebase?.firestore?.() || null;
  }

  function serverTimestamp() {
    return window.firebase?.firestore?.FieldValue?.serverTimestamp?.() || new Date();
  }

  function setStatus(message = "", type = "") {
    if (!els.status) return;
    els.status.textContent = message;
    els.status.className = `clubhouse-friends-status mb-0${type ? ` is-${type}` : ""}`;
  }

  function setLoading(target, message = "Loading...") {
    if (target) {
      target.innerHTML = `<div class="clubhouse-friends-empty">${escapeHtml(message)}</div>`;
    }
  }

  function requestId(fromUid, toUid) {
    return `${fromUid}_${toUid}`;
  }

  async function loadCurrentUsername(user) {
    const db = getDb();
    if (!db || !user) return "";

    try {
      const publicSnap = await db.collection("publicUsers").doc(user.uid).get();
      const publicUsername = String(publicSnap.data()?.username || "").trim();
      if (publicUsername) return publicUsername;

      const privateSnap = await db.collection("users").doc(user.uid).get();
      const privateUsername = String(privateSnap.data()?.username || "").trim();
      return privateUsername && !privateUsername.includes("@") ? privateUsername : "";
    } catch (error) {
      console.error("Could not load current friend username:", error);
      return "";
    }
  }

  async function ensurePublicProfile() {
    const db = getDb();
    if (!db || !currentUser || !currentUsername) return;

    await db.collection("publicUsers").doc(currentUser.uid).set({
      uid: currentUser.uid,
      username: currentUsername,
      usernameLower: normalizeUsername(currentUsername),
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  function friendRequestCard(doc, type) {
    const data = doc.data() || {};
    const otherName = type === "friend"
      ? data.fromUid === currentUser?.uid
        ? data.toUsername || "Golfer"
        : data.fromUsername || "Golfer"
      : type === "incoming"
        ? data.fromUsername || "Golfer"
        : data.toUsername || "Golfer";

    const actions = type === "incoming"
      ? `
        <div class="clubhouse-friends-actions">
          <button class="gfg-pill-btn gfg-pill-btn--sm" type="button" data-friend-action="accept" data-request-id="${doc.id}">Accept</button>
          <button class="gfg-pill-btn gfg-pill-btn--sm gfg-pill-btn--ghost" type="button" data-friend-action="reject" data-request-id="${doc.id}">Decline</button>
        </div>
      `
      : type === "outgoing"
        ? `
          <div class="clubhouse-friends-actions">
            <button class="gfg-pill-btn gfg-pill-btn--sm gfg-pill-btn--ghost" type="button" data-friend-action="cancel" data-request-id="${doc.id}">Cancel</button>
          </div>
        `
        : "";

    return `
      <div class="clubhouse-friend-item">
        <div>
          <div class="clubhouse-friend-name">${escapeHtml(otherName)}</div>
          <div class="clubhouse-friend-meta">${escapeHtml(type === "friend" ? "Friend" : data.status || "pending")}</div>
        </div>
        ${actions}
      </div>
    `;
  }

  function renderList(target, docs, emptyText, type) {
    if (!target) return;
    if (!docs.length) {
      target.innerHTML = `<div class="clubhouse-friends-empty">${escapeHtml(emptyText)}</div>`;
      return;
    }

    target.innerHTML = docs.map((doc) => friendRequestCard(doc, type)).join("");
  }

  async function loadFriendData() {
    const db = getDb();
    if (!db || !currentUser) return;

    setLoading(els.friendsList);
    setLoading(els.incomingList);
    setLoading(els.outgoingList);

    try {
      const requests = db.collection("friendRequests");
      const [incomingSnap, outgoingSnap, friendsFromSnap, friendsToSnap] = await Promise.all([
        requests.where("toUid", "==", currentUser.uid).where("status", "==", "pending").get(),
        requests.where("fromUid", "==", currentUser.uid).where("status", "==", "pending").get(),
        requests.where("fromUid", "==", currentUser.uid).where("status", "==", "accepted").get(),
        requests.where("toUid", "==", currentUser.uid).where("status", "==", "accepted").get()
      ]);

      const acceptedMap = new Map();
      friendsFromSnap.docs.concat(friendsToSnap.docs).forEach((doc) => acceptedMap.set(doc.id, doc));

      renderList(els.friendsList, [...acceptedMap.values()], "No friends yet. Search a username to send your first request.", "friend");
      renderList(els.incomingList, incomingSnap.docs, "No incoming requests.", "incoming");
      renderList(els.outgoingList, outgoingSnap.docs, "No sent requests.", "outgoing");
    } catch (error) {
      console.error("Could not load friends:", error);
      setLoading(els.friendsList, "Could not load friends.");
      setLoading(els.incomingList, "Could not load requests.");
      setLoading(els.outgoingList, "Could not load sent requests.");
    }
  }

  async function findPublicUser(usernameLower) {
    const db = getDb();
    if (!db) return null;

    const snap = await db
      .collection("publicUsers")
      .where("usernameLower", "==", usernameLower)
      .limit(5)
      .get();

    return snap.docs.find((doc) => doc.id !== currentUser?.uid) || null;
  }

  async function getExistingRequest(otherUid) {
    const db = getDb();
    if (!db || !currentUser || !otherUid) return null;

    const [sentSnap, receivedSnap] = await Promise.all([
      db.collection("friendRequests").doc(requestId(currentUser.uid, otherUid)).get(),
      db.collection("friendRequests").doc(requestId(otherUid, currentUser.uid)).get()
    ]);

    if (sentSnap.exists) return sentSnap;
    if (receivedSnap.exists) return receivedSnap;
    return null;
  }

  async function sendFriendRequest() {
    const db = getDb();
    if (!db || !currentUser) {
      setStatus("Log in to send a friend request.", "error");
      return;
    }

    const usernameLower = normalizeUsername(els.searchInput?.value);
    if (!usernameLower) {
      setStatus("Enter a username first.", "error");
      return;
    }

    if (!currentUsername) {
      setStatus("Your account needs a username before you can add friends.", "error");
      return;
    }

    try {
      setStatus("Searching...", "info");
      els.searchBtn.disabled = true;

      await ensurePublicProfile();
      const targetDoc = await findPublicUser(usernameLower);

      if (!targetDoc) {
        setStatus("No account found with that username yet.", "error");
        return;
      }

      const target = targetDoc.data() || {};
      if (target.uid === currentUser.uid || targetDoc.id === currentUser.uid) {
        setStatus("That is your own account.", "error");
        return;
      }

      const existing = await getExistingRequest(target.uid || targetDoc.id);
      if (existing?.exists) {
        const existingStatus = existing.data()?.status || "pending";
        setStatus(`A friend request between you two already exists (${existingStatus}).`, existingStatus === "accepted" ? "success" : "info");
        return;
      }

      await db.collection("friendRequests").doc(requestId(currentUser.uid, target.uid || targetDoc.id)).set({
        fromUid: currentUser.uid,
        toUid: target.uid || targetDoc.id,
        fromUsername: currentUsername,
        toUsername: target.username || els.searchInput.value.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      els.searchInput.value = "";
      setStatus("Friend request sent.", "success");
      await loadFriendData();
    } catch (error) {
      console.error("Friend request failed:", error);
      setStatus(error?.code === "permission-denied"
        ? "Friend request blocked by Firestore rules."
        : "Could not send that friend request.", "error");
    } finally {
      els.searchBtn.disabled = false;
    }
  }

  async function updateRequestStatus(requestIdValue, status) {
    const db = getDb();
    if (!db || !currentUser || !requestIdValue) return;

    await db.collection("friendRequests").doc(requestIdValue).update({
      status,
      updatedAt: serverTimestamp(),
      respondedAt: serverTimestamp()
    });
  }

  async function handleListClick(event) {
    const button = event.target.closest("[data-friend-action]");
    if (!button) return;

    const action = button.dataset.friendAction;
    const requestIdValue = button.dataset.requestId;
    const nextStatus = action === "accept"
      ? "accepted"
      : action === "reject"
        ? "rejected"
        : "cancelled";

    try {
      button.disabled = true;
      await updateRequestStatus(requestIdValue, nextStatus);
      setStatus(action === "accept" ? "Friend request accepted." : "Request updated.", action === "accept" ? "success" : "info");
      await loadFriendData();
    } catch (error) {
      console.error("Could not update friend request:", error);
      setStatus("Could not update that request.", "error");
      button.disabled = false;
    }
  }

  function setAuthView(user) {
    currentUser = user || null;
    els.loggedOut.classList.toggle("d-none", !!user);
    els.loggedIn.classList.toggle("d-none", !user);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.firebase?.auth || !window.firebase?.firestore) {
      setStatus("Firebase is not ready yet.", "error");
      return;
    }

    els.searchBtn?.addEventListener("click", sendFriendRequest);
    els.searchInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendFriendRequest();
      }
    });

    [els.incomingList, els.outgoingList].forEach((list) => {
      list?.addEventListener("click", handleListClick);
    });

    firebase.auth().onAuthStateChanged(async (user) => {
      setAuthView(user);
      if (!user) return;

      currentUsername = await loadCurrentUsername(user);
      await ensurePublicProfile();
      await loadFriendData();
    });
  });
})();
