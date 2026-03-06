window.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const hitPercentSelect = document.getElementById("hitPercentSelect");
  const clubSelect = document.getElementById("clubSelect");
  const dist1 = document.getElementById("clubDistance1");
  const dist2 = document.getElementById("clubDistance2");
  const dist3 = document.getElementById("clubDistance3");
  const saveBtn = document.getElementById("saveClubDistance");
  const saveOrderBtn = document.getElementById("saveClubOrderBtn");
  const avgOutput = document.getElementById("averageDistance");
  const savedClubsList = document.getElementById("savedClubsList");
  const mobileInfoMessage = document.getElementById("mobileInfoMessage");

  let currentUser = null;
  let sortableInstance = null;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  // ================= Helpers =================
  function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
  function escapeHtmlAttr(s) { return String(s).replace(/"/g, "&quot;"); }

  function updateDeleteButtonVisibility() {
    const deleteButtons = savedClubsList.querySelectorAll(".delete-btn");
    deleteButtons.forEach(btn => btn.style.display = "inline-block");
    mobileInfoMessage.textContent = isMobile ? "⚠️ On mobile, deleting is enabled — please confirm carefully." : "";
  }

  function makeListSortable() {
    if (sortableInstance) try { sortableInstance.destroy(); } catch (e) { }
    if (!isMobile && typeof Sortable !== "undefined") {
      sortableInstance = Sortable.create(savedClubsList, {
        animation: 150,
        handle: ".card",
        ghostClass: "sortable-ghost"
      });
    }
  }

  // ================= Auth =================
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      document.getElementById("clubCalculatorSection").classList.remove("d-none");
      document.getElementById("loginToUseClubs").classList.add("d-none");
      loadOrderedClubs();
    } else {
      currentUser = null;
      document.getElementById("clubCalculatorSection").classList.add("d-none");
      document.getElementById("loginToUseClubs").classList.remove("d-none");
      savedClubsList.innerHTML = "";
      updateClubTable({});
    }
  });

  // ================= Save Club =================
  saveBtn.addEventListener("click", async () => {
    const club = clubSelect.value;
    const hitPercent = hitPercentSelect.value;
    const d1v = parseFloat(dist1.value);
    const d2v = parseFloat(dist2.value);
    const d3v = parseFloat(dist3.value);

    if (!club || !hitPercent || isNaN(d1v) || isNaN(d2v) || isNaN(d3v)) {
      avgOutput.textContent = "❌ Please fill in all distances and select a hit %.";
      return;
    }

    const average = ((d1v + d2v + d3v) / 3).toFixed(1);
    if (!currentUser) { avgOutput.textContent = "❌ You must be logged in to save."; return; }

    try {
      const clubRef = db.collection("users").doc(currentUser.uid).collection("clubDistances").doc(club);
      const clubDoc = await clubRef.get();
      let data = clubDoc.exists ? clubDoc.data() : {};
      if (!data.hitPercents) data.hitPercents = {};
      data.hitPercents[hitPercent] = { distances: [d1v, d2v, d3v], average: Number(average), comment: "" };
      data.updated = firebase.firestore.FieldValue.serverTimestamp();
      await clubRef.set(data);

      const orderedRef = db.collection("users").doc(currentUser.uid).collection("clubDistancesOrdered").doc("data");
      const orderedDoc = await orderedRef.get();
      let clubsArray = orderedDoc.exists && Array.isArray(orderedDoc.data().clubs) ? orderedDoc.data().clubs : [];
      clubsArray = clubsArray.filter(c => !(c.club === club && c.hitPercent == hitPercent));
      clubsArray.push({ club, hitPercent: Number(hitPercent), distances: [d1v, d2v, d3v], average: Number(average), comment: "" });
      await orderedRef.set({ clubs: clubsArray });

      avgOutput.textContent = `✅ Saved ${club} (${hitPercent}%) — Average: ${average} yards`;
      loadOrderedClubs();
    } catch (err) {
      console.error("Error saving club:", err);
      avgOutput.textContent = "❌ Failed to save club distance.";
    }
  });

  // ================= Save Order =================
  saveOrderBtn.addEventListener("click", async () => {
    if (!currentUser) return;

    const cards = savedClubsList.querySelectorAll(".card");
    const clubsArray = [];

    cards.forEach(card => {
      const club = card.querySelector(".club-info strong").textContent;
      const avgMatches = card.querySelector(".club-info").innerText.match(/(\d+)% (\d+(\.\d+)?) yards/g) || [];
      const hitsMatches = card.querySelector(".club-info small").innerText.replace("Hits: ", "").split(" / ");

      avgMatches.forEach((a, i) => {
        const percent = a.match(/(\d+)%/)[1];
        const avg = parseFloat(a.match(/(\d+(\.\d+)?) yards/)[1]);
        const distances = hitsMatches[i].split(":")[1].trim().split(",").map(s => parseFloat(s.trim()));
        clubsArray.push({ club, hitPercent: Number(percent), distances, average: avg, comment: "" });
      });
    });

    try {
      await db.collection("users").doc(currentUser.uid).collection("clubDistancesOrdered").doc("data").set({ clubs: clubsArray });
      alert("✅ Club order saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save club order.");
    }
  });

  // ================= Load Clubs =================
  async function loadOrderedClubs() {
    if (!currentUser) return;
    savedClubsList.innerHTML = "";

    try {
      const doc = await db.collection("users").doc(currentUser.uid).collection("clubDistancesOrdered").doc("data").get();
      const clubs = doc.exists && Array.isArray(doc.data().clubs) ? doc.data().clubs : [];

      const grouped = {};
      clubs.forEach(d => {
        if (!grouped[d.club]) grouped[d.club] = {};
        grouped[d.club][d.hitPercent] = d;
      });

      for (const clubName in grouped) {
        addClubCardMultiPercents(clubName, grouped[clubName]);
      }

      updateDeleteButtonVisibility();
      makeListSortable();
      updateClubTable(grouped);

    } catch (err) {
      console.error("Error loading clubs:", err);
    }
  }

  // ================= Add Card =================
  function addClubCardMultiPercents(clubName, hitPercentsData) {
    const div = document.createElement("div");
    div.className = "card mb-2";

    let displayText = [], hitsText = [];
    for (const percent in hitPercentsData) {
      const d = hitPercentsData[percent];
      displayText.push(`${percent}% ${d.average} yards`);
      hitsText.push(`${percent}%: ${d.distances.join(", ")}`);
    }

    div.innerHTML = `
    <div class="card-body p-2">
      <div class="club-info">
        <strong>${escapeHtml(clubName)}</strong>: ${displayText.join(" / ")}<br>
        <small class="text-muted">Hits: ${escapeHtml(hitsText.join(" / "))}</small>
      </div>

      <div class="button-group mt-2">
        ${Object.keys(hitPercentsData).map(percent => `
          <button class="btn btn-sm delete-btn"
            data-club="${escapeHtmlAttr(clubName)}"
            data-percent="${percent}">
            🗑 Delete ${percent}%
          </button>
        `).join("")}

        <div class="reorder-controls" style="display:flex; gap:6px;">
          <button class="btn btn-sm reorder-up">▲</button>
          <button class="btn btn-sm reorder-down">▼</button>
        </div>
      </div>
    </div>
  `;

    const btnGroup = div.querySelector(".button-group");
    btnGroup.style.display = "flex";
    btnGroup.style.justifyContent = "flex-end"; // delete buttons on right
    btnGroup.style.gap = "5px";

    savedClubsList.appendChild(div);
  }

  // ================= Event Delegation =================
  savedClubsList.addEventListener("click", async e => {
    const target = e.target;
    const card = target.closest(".card");
    if (!card) return;

    // Delete
    if (target.classList.contains("delete-btn")) {
      const club = target.getAttribute("data-club");
      const hitPercent = target.getAttribute("data-percent");
      if (!confirm(`Delete ${club} (${hitPercent}%)?`)) return;

      try {
        const clubRef = db.collection("users").doc(currentUser.uid).collection("clubDistances").doc(club);
        const clubDoc = await clubRef.get();
        if (clubDoc.exists) {
          const data = clubDoc.data();
          if (data.hitPercents && data.hitPercents[hitPercent]) delete data.hitPercents[hitPercent];
          await clubRef.set(data);
        }

        const orderedRef = db.collection("users").doc(currentUser.uid).collection("clubDistancesOrdered").doc("data");
        const orderedDoc = await orderedRef.get();
        if (orderedDoc.exists) {
          let arr = orderedDoc.data().clubs.filter(c => !(c.club === club && c.hitPercent == hitPercent));
          await orderedRef.set({ clubs: arr });
        }

        loadOrderedClubs();
      } catch (err) { console.error(err); alert("Failed to delete."); }
      return;
    }

    // ================= Reorder =================
    if (target.classList.contains("reorder-up")) {
      const prev = card.previousElementSibling;
      if (prev) savedClubsList.insertBefore(card, prev);
    }
    if (target.classList.contains("reorder-down")) {
      const next = card.nextElementSibling;
      if (next) savedClubsList.insertBefore(card, next.nextElementSibling || null);
    }
  });

  // ================= Excel Table =================
  function updateClubTable(grouped) {
    const tbody = document.querySelector("#clubDistancesTable tbody");
    tbody.innerHTML = "";

    Object.keys(grouped).forEach(club => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td><strong>${club}</strong></td>
        <td>${grouped[club]["25"] ? grouped[club]["25"].average + " yds" : "-"}</td>
        <td>${grouped[club]["50"] ? grouped[club]["50"].average + " yds" : "-"}</td>
        <td>${grouped[club]["75"] ? grouped[club]["75"].average + " yds" : "-"}</td>
        <td>${grouped[club]["100"] ? grouped[club]["100"].average + " yds" : "-"}</td>
      `;

      tbody.appendChild(row);
    });
  }
});
