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
    outgoingList: $("outgoingFriendsList"),
    blockedList: $("blockedFriendsList")
  };

  if (!els.loggedOut || !els.loggedIn) return;

  let currentUser = null;
  let currentUsername = "";
  let currentPhotoURL = "";

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

  function isInactiveStatus(status) {
    return ["removed", "rejected", "cancelled"].includes(String(status || "").toLowerCase());
  }

  function getOtherProfile(data, type) {
    if (type === "friend" || type === "blocked") {
      return data.fromUid === currentUser?.uid
        ? {
            name: data.toUsername || "Golfer",
            photoURL: data.toPhotoURL || ""
          }
        : {
            name: data.fromUsername || "Golfer",
            photoURL: data.fromPhotoURL || ""
          };
    }

    if (type === "incoming") {
      return {
        name: data.fromUsername || "Golfer",
        photoURL: data.fromPhotoURL || ""
      };
    }

    return {
      name: data.toUsername || "Golfer",
      photoURL: data.toPhotoURL || ""
    };
  }

  async function loadCurrentUsername(user) {
    const db = getDb();
    if (!db || !user) return "";

    try {
      const publicSnap = await db.collection("publicUsers").doc(user.uid).get();
      const publicData = publicSnap.data() || {};
      currentPhotoURL = publicData.photoURL || "";
      const publicUsername = String(publicData.username || "").trim();
      if (publicUsername) return publicUsername;

      const privateSnap = await db.collection("users").doc(user.uid).get();
      const privateData = privateSnap.data() || {};
      currentPhotoURL = currentPhotoURL || privateData.photoURL || user.photoURL || "";
      const privateUsername = String(privateData.username || "").trim();
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
    const otherProfile = getOtherProfile(data, type);
    const otherName = otherProfile.name;
    const otherPhotoUrl = otherProfile.photoURL;
    const initial = escapeHtml(String(otherName || "G").trim().charAt(0).toUpperCase() || "G");
    const avatar = otherPhotoUrl
      ? `<img class="gfg-profile-avatar gfg-profile-avatar--sm" src="${escapeHtml(otherPhotoUrl)}" alt="${escapeHtml(otherName)} profile picture">`
      : `<div class="gfg-profile-avatar gfg-profile-avatar--sm gfg-profile-avatar--fallback" aria-hidden="true">${initial}</div>`;

    const actions = type === "incoming"
      ? `
        <div class="clubhouse-friends-actions">
          <button class="gfg-pill-btn gfg-pill-btn--sm" type="button" data-friend-action="accept" data-request-id="${doc.id}">Accept</button>
          <button class="gfg-pill-btn gfg-pill-btn--sm clubhouse-friends-decline-btn" type="button" data-friend-action="reject" data-request-id="${doc.id}">Decline</button>
          <button class="gfg-pill-btn gfg-pill-btn--sm clubhouse-friends-block-btn" type="button" data-friend-action="block" data-request-id="${doc.id}">Block</button>
        </div>
      `
      : type === "outgoing"
        ? `
          <div class="clubhouse-friends-actions">
            <button class="gfg-pill-btn gfg-pill-btn--sm clubhouse-friends-decline-btn" type="button" data-friend-action="cancel" data-request-id="${doc.id}">Cancel</button>
            <button class="gfg-pill-btn gfg-pill-btn--sm clubhouse-friends-block-btn" type="button" data-friend-action="block" data-request-id="${doc.id}">Block</button>
          </div>
        `
        : type === "friend"
          ? `
            <div class="clubhouse-friends-actions">
              <button class="gfg-pill-btn gfg-pill-btn--sm clubhouse-friends-remove-btn" type="button" data-friend-action="remove" data-request-id="${doc.id}">Remove</button>
              <button class="gfg-pill-btn gfg-pill-btn--sm clubhouse-friends-block-btn" type="button" data-friend-action="block" data-request-id="${doc.id}">Block</button>
            </div>
          `
          : type === "blocked"
            ? `
              <div class="clubhouse-friends-actions">
                <button class="gfg-pill-btn gfg-pill-btn--sm clubhouse-friends-unblock-btn" type="button" data-friend-action="unblock" data-request-id="${doc.id}">Unblock</button>
              </div>
            `
            : "";

    return `
      <div class="clubhouse-friend-item">
        <div class="clubhouse-friend-person">
          ${avatar}
          <div>
            <div class="clubhouse-friend-name">${escapeHtml(otherName)}</div>
            <div class="clubhouse-friend-meta">${escapeHtml(type === "friend" ? "Friend" : type === "blocked" ? "Blocked" : data.status || "pending")}</div>
          </div>
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
    setLoading(els.blockedList);

    try {
      const requests = db.collection("friendRequests");
      const [incomingSnap, outgoingSnap, friendsFromSnap, friendsToSnap, blockedSnap] = await Promise.all([
        requests.where("toUid", "==", currentUser.uid).where("status", "==", "pending").get(),
        requests.where("fromUid", "==", currentUser.uid).where("status", "==", "pending").get(),
        requests.where("fromUid", "==", currentUser.uid).where("status", "==", "accepted").get(),
        requests.where("toUid", "==", currentUser.uid).where("status", "==", "accepted").get(),
        requests.where("blockedByUid", "==", currentUser.uid).where("status", "==", "blocked").get()
      ]);

      const acceptedMap = new Map();
      friendsFromSnap.docs.concat(friendsToSnap.docs).forEach((doc) => acceptedMap.set(doc.id, doc));

      renderList(els.friendsList, [...acceptedMap.values()], "No friends yet. Search a username to send your first request.", "friend");
      renderList(els.incomingList, incomingSnap.docs, "No incoming requests.", "incoming");
      renderList(els.outgoingList, outgoingSnap.docs, "No sent requests.", "outgoing");
      renderList(els.blockedList, blockedSnap.docs, "No blocked golfers.", "blocked");
    } catch (error) {
      console.error("Could not load friends:", error);
      setLoading(els.friendsList, "Could not load friends.");
      setLoading(els.incomingList, "Could not load requests.");
      setLoading(els.outgoingList, "Could not load sent requests.");
      setLoading(els.blockedList, "Could not load blocked golfers.");
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

    if (usernameLower === normalizeUsername(currentUsername)) {
      setStatus("That is your own username. Search a different GoodFlightGolf account.", "error");
      return;
    }

    try {
      setStatus("Searching...", "info");
      els.searchBtn.disabled = true;

      await ensurePublicProfile();
      const targetDoc = await findPublicUser(usernameLower);

      if (!targetDoc) {
        setStatus("No account found with that username yet. If this is an older account, have that golfer log in once so their username becomes searchable.", "error");
        return;
      }

      const target = targetDoc.data() || {};
      if (target.uid === currentUser.uid || targetDoc.id === currentUser.uid) {
        setStatus("That is your own account.", "error");
        return;
      }

      const targetUid = target.uid || targetDoc.id;
      const existing = await getExistingRequest(targetUid);
      if (existing?.exists) {
        const existingStatus = existing.data()?.status || "pending";
        const blockedByUid = existing.data()?.blockedByUid || "";

        if (existingStatus === "blocked") {
          setStatus(blockedByUid === currentUser.uid
            ? "You blocked this golfer. Unblock them before sending a new request."
            : "That golfer is not available for friend requests right now.", "error");
          return;
        }

        if (!isInactiveStatus(existingStatus)) {
          setStatus(`A friend request between you two already exists (${existingStatus}).`, existingStatus === "accepted" ? "success" : "info");
          return;
        }
      }

      const payload = {
        fromUid: currentUser.uid,
        toUid: targetUid,
        fromUsername: currentUsername,
        toUsername: target.username || els.searchInput.value.trim(),
        fromPhotoURL: currentPhotoURL || "",
        toPhotoURL: target.photoURL || "",
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (existing?.exists && isInactiveStatus(existing.data()?.status)) {
        await existing.ref.set(payload);
      } else {
        await db.collection("friendRequests").doc(requestId(currentUser.uid, targetUid)).set(payload);
      }

      els.searchInput.value = "";
      setStatus("Friend request sent.", "success");
      await loadFriendData();
      window.dispatchEvent(new CustomEvent("gfg-friend-requests-changed"));
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

    const patch = {
      status,
      updatedAt: serverTimestamp(),
      respondedAt: serverTimestamp()
    };

    if (status === "blocked") {
      patch.blockedByUid = currentUser.uid;
    }

    await db.collection("friendRequests").doc(requestIdValue).update(patch);
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
        : action === "remove"
          ? "removed"
          : action === "block"
            ? "blocked"
            : action === "unblock"
              ? "removed"
          : "cancelled";

    if (action === "remove" && !window.confirm("Remove this golfer from your friends?")) {
      return;
    }

    if (action === "block" && !window.confirm("Block this golfer? They will not be able to send you friend requests until you unblock them.")) {
      return;
    }

    try {
      button.disabled = true;
      await updateRequestStatus(requestIdValue, nextStatus);
      setStatus(
        action === "accept"
          ? "Friend request accepted."
          : action === "remove"
            ? "Friend removed."
            : action === "block"
              ? "Golfer blocked."
              : action === "unblock"
                ? "Golfer unblocked. Either of you can send a new friend request."
            : "Request updated.",
        action === "accept" ? "success" : "info"
      );
      await loadFriendData();
      window.dispatchEvent(new CustomEvent("gfg-friend-requests-changed"));
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

    [els.friendsList, els.incomingList, els.outgoingList, els.blockedList].forEach((list) => {
      list?.addEventListener("click", handleListClick);
    });

    firebase.auth().onAuthStateChanged(async (user) => {
      setAuthView(user);
      if (!user) return;

      currentUsername = await loadCurrentUsername(user);
      await ensurePublicProfile();
      if (currentUsername) {
        setStatus(`Your searchable username is ${currentUsername}. Search a different golfer to send a request.`, "info");
      }
      await loadFriendData();
    });
  });
})();
