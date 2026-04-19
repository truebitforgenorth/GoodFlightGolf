// =====================================================
// 666 - uses Wolf IDs so main2.css "wolf-page" styles apply
// Two-team winner buttons + Push pot carryover
// Hole 19 results + Firestore save + Home-page auto-load
// =====================================================

// ---------------------------
// SAFETY GUARDS
// ---------------------------
function $(id){ return document.getElementById(id); }
function on(el, evt, fn){ if(el) el.addEventListener(evt, fn); else console.warn('[666] missing element for', evt); }

// =====================================================
// FULLSCREEN
// =====================================================

const fullscreenBtn = document.getElementById("fullscreenBtn");
const selectionWrapper = document.getElementById("selectionWrapper");
const body = document.body;

fullscreenBtn?.addEventListener("click", () => {
  selectionWrapper?.classList.toggle("fullscreen");
  body.classList.toggle("fullscreen-active");

  if (selectionWrapper?.classList.contains("fullscreen")) {
    body.classList.add("no-scroll");
    fullscreenBtn.innerText = "Close Fullscreen";
  } else {
    body.classList.remove("no-scroll");
    fullscreenBtn.innerText = "Fullscreen Selection";
  }

  renderFullscreenSessionSwitchTab();
});

// ---------------------------
// INPUTS (same IDs as Wolf)
// ---------------------------
const baseInput = document.getElementById("base");
const dollarValueInput = document.getElementById("dollarValue");
const tieSetPoints = document.getElementById("tieSetPoints");
const tieMultiplier = document.getElementById("tieMultiplier");
const selfPlayerSelect = document.getElementById("sixesSelfPlayerSelect");
const potBanner = document.getElementById("potBanner");
const potValue = document.getElementById("potValue");

// ---------------------------
// UI (mostly Wolf IDs)
// ---------------------------
const holeTitle = document.getElementById("holeTitle");
const formatLabel = document.getElementById("formatLabel666");
const teamDisplay = document.getElementById("teamDisplay666");

const holeSetupCard = document.getElementById("holeSetupCard");
const holeNavCard = document.getElementById("holeNavCard");
const scoreboardCard = document.getElementById("scoreboardCard");

const prevHoleBtn = document.getElementById("prevHoleBtn");
const nextHoleBtn = document.getElementById("nextHoleBtn");

const team1WinBtn = document.getElementById("team1WinBtn");
const team2WinBtn = document.getElementById("team2WinBtn");
const pushBtn = document.getElementById("pushBtn");

// Scoreboard slots reuse Wolf IDs for names/money
const tEls = [0, 1, 2, 3].map(i => document.getElementById(`t${i}`));
const mEls = [0, 1, 2, 3].map(i => document.getElementById(`m${i}`));


// ---------------------------
// GAME STATE
// ---------------------------
let hole = 1;
let players = ["Player 1", "Player 2", "Player 3", "Player 4"];
let totals = [0, 0, 0, 0];
let holes = {}; // holes[n] = { result: "team1" | "team2" | "push" }
let currentPot = 0;
let selectedSelfPlayerIndex = null;
const sessionApi = window.GFGSession || null;
let loadedFromSavedGame = false;

function getLinkedSession() {
  return null;
}

function renderFullscreenSessionSwitchTab() {
  document.getElementById("gameFullscreenSessionTab")?.remove();
}

function renderLinkedSessionBanner() {
  document.getElementById("gfgLinkedRoundBanner")?.remove();
  renderFullscreenSessionSwitchTab();
}

function getGameDraftPayload() {
  return {
    sessionId: null,
    hole,
    holes,
    totals,
    players,
    trackedPlayerIndex: selectedSelfPlayerIndex,
    base: +baseInput.value || 0,
    dollarValue: +dollarValueInput.value || 0,
    tieSetPoints: tieSetPoints.value !== "" ? +tieSetPoints.value : null,
    tieMultiplier: +tieMultiplier.value || 1
  };
}

function persistLinkedGameDraft() {
  return;
}

function restoreLinkedGameDraft() {
  return true;
}

// ---------------------------
// TIE INPUTS - MUTUALLY EXCLUSIVE
// ---------------------------
if (tieSetPoints && tieMultiplier) {
  tieSetPoints.addEventListener("input", () => {
    tieMultiplier.disabled = tieSetPoints.value !== "";
  });
  tieMultiplier.addEventListener("input", () => {
    tieSetPoints.disabled = tieMultiplier.value && tieMultiplier.value != 1;
  });
}

// ---------------------------
// PLAYER NAMES
// ---------------------------
function getSelectedSelfPlayerIndex() {
  const value = Number(selfPlayerSelect?.value);
  return Number.isInteger(value) && value >= 0 && value < players.length ? value : null;
}

function syncSelfPlayerOptions() {
  if (!selfPlayerSelect) return;

  const previousValue = selfPlayerSelect.value;
  selfPlayerSelect.innerHTML = `
    <option value="">Choose your player slot</option>
    ${players.map((player, idx) => `<option value="${idx}">${player || `Player ${idx + 1}`}</option>`).join("")}
  `;

  if (previousValue !== "" && Number(previousValue) < players.length) {
    selfPlayerSelect.value = previousValue;
  }

  selectedSelfPlayerIndex = getSelectedSelfPlayerIndex();
}

document.querySelectorAll(".player666").forEach((i, idx) => {
  i.oninput = () => {
    players[idx] = i.value || `Player ${idx + 1}`;
    syncSelfPlayerOptions();
    render();
    recalc();
  };
});

selfPlayerSelect?.addEventListener("change", () => {
  selectedSelfPlayerIndex = getSelectedSelfPlayerIndex();
});

function safeName(i) {
  return players[i] || `Player ${i + 1}`;
}

function H() {
  return holes[hole] ??= { result: null };
}

// ---------------------------
// FORMAT + TEAMS
// ---------------------------
function getFormatForHole(h) {
  if (h >= 1 && h <= 6) return "Best Ball (1-6)";
  if (h >= 7 && h <= 12) return "Total Score (7-12)";
  if (h >= 13 && h <= 18) return "High/Low (13-18)";
  return "Results";
}

function getTeamsForHole(h) {
  if (h >= 1 && h <= 6) return { team1: [0, 1], team2: [2, 3] };
  if (h >= 7 && h <= 12) return { team1: [0, 2], team2: [1, 3] };
  return { team1: [0, 3], team2: [1, 2] };
}

// ---------------------------
// POT + TOTALS RECALC
// ---------------------------
function recalc() {
  totals = [0, 0, 0, 0];
  let carryover = 0;

  const ordered = Object.keys(holes).map(n => +n).sort((a, b) => a - b);

  ordered.forEach(holeNum => {
    const h = holes[holeNum];
    if (!h?.result) return;

    const base = +baseInput.value || 0;
    const stake = base;

    if (h.result === "push") {
      if (tieSetPoints.value !== "") {
        carryover += +tieSetPoints.value;
      } else if ((+tieMultiplier.value || 1) > 1) {
        carryover += stake * ((+tieMultiplier.value || 1) - 1);
      } else {
        carryover += stake;
      }
      return;
    }

    const payout = stake + carryover;
    carryover = 0;

    const { team1, team2 } = getTeamsForHole(holeNum);

    if (h.result === "team1") team1.forEach(i => totals[i] += payout);
    if (h.result === "team2") team2.forEach(i => totals[i] += payout);
  });

  currentPot = carryover;
  updatePotDisplay();
  updateTotals();
  persistLinkedGameDraft();
}

function updatePotDisplay() {
  if (!potBanner || !potValue) return;

  if (currentPot > 0) {
    potValue.textContent = currentPot;
    potBanner.classList.remove("hidden");
  } else {
    potBanner.classList.add("hidden");
  }
}

// ---------------------------
// RENDER
// ---------------------------
function render() {
  if (holeTitle) holeTitle.innerText = `Hole ${hole}`;
  if (formatLabel) formatLabel.textContent = getFormatForHole(hole);
  renderLinkedSessionBanner();

  if (hole >= 1 && hole <= 18) {
    const { team1, team2 } = getTeamsForHole(hole);

    if (teamDisplay) teamDisplay.innerHTML = `
      <div class="gfg-team-row">
        <div class="gfg-team-pill gfg-team-pill--one">
          <div class="fw-bold">Team 1</div>
          <div>${safeName(team1[0])} + ${safeName(team1[1])}</div>
        </div>
        <div class="gfg-team-pill gfg-team-pill--two">
          <div class="fw-bold">Team 2</div>
          <div>${safeName(team2[0])} + ${safeName(team2[1])}</div>
        </div>
      </div>
    `;
  } else {
    if (teamDisplay) teamDisplay.innerHTML = "";
  }

  updateTotals();
  persistLinkedGameDraft();
}

function updateTotals() {
  const dollar = +dollarValueInput.value || 0;

  for (let i = 0; i < 4; i++) {
    if (tEls[i]) tEls[i].innerText = `${safeName(i)}: ${totals[i]} pts`;

    const net = totals[i] * dollar;
    if (mEls[i]) {
      mEls[i].innerText = (net >= 0 ? "+" : "-") + "$" + Math.abs(net).toFixed(2);
      mEls[i].style.color = net >= 0 ? "#359447" : "#d9534f";
    }
  }
}

// ---------------------------
// SELECT RESULT
// ---------------------------
function clearSelected() {
  [team1WinBtn, team2WinBtn, pushBtn].forEach(b => b.classList.remove("selected"));
}

function selectResult(result) {
  if (hole > 18) return;

  H().result = result;
  clearSelected();

  if (result === "team1") team1WinBtn.classList.add("selected");
  if (result === "team2") team2WinBtn.classList.add("selected");
  if (result === "push") pushBtn.classList.add("selected");

  recalc();
  nextHole();
}

on(team1WinBtn, "click", (e) => { e.preventDefault(); selectResult("team1"); });
on(team2WinBtn, "click", (e) => { e.preventDefault(); selectResult("team2"); });
on(pushBtn, "click", (e) => { e.preventDefault(); selectResult("push"); });

// ---------------------------
// HOLE NAV
// ---------------------------
function prevHole() {
  if (hole > 1) {
    hole--;
    render();
    recalc();
    hideResultsSummary();
  }
}

function nextHole() {
  if (hole < 19) {
    hole++;
    render();
    recalc();
    if (hole === 19) showResultsSummary();
  }
}

on(prevHoleBtn, "click", (e) => { e.preventDefault(); prevHole(); });
on(nextHoleBtn, "click", (e) => { e.preventDefault(); nextHole(); });

// ---------------------------
// RESULTS + SAVE
// ---------------------------
function animateMoney(element, start, end, duration = 1200) {
  const range = end - start;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = start + range * progress;
    element.textContent = (value >= 0 ? "+" : "-") + "$" + Math.abs(value).toFixed(2);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function hideResultsSummary() {
  const res = document.getElementById("resultsCard666");
  if (res) res.style.display = "none";
  if (holeSetupCard) holeSetupCard.style.display = "block";
  if (holeNavCard) holeNavCard.style.display = "block";
  if (scoreboardCard) scoreboardCard.style.display = "block";
}

function showResultsSummary() {
  if (holeSetupCard) holeSetupCard.style.display = "none";
  if (holeNavCard) holeNavCard.style.display = "none";
  if (scoreboardCard) scoreboardCard.style.display = "none";

  let resultsCard = document.getElementById("resultsCard666");
  if (!resultsCard) {
    resultsCard = document.createElement("div");
    resultsCard.id = "resultsCard666";
    resultsCard.className = "card game-card p-4 mb-3 text-center gfg-finish-card";
    selectionWrapper.appendChild(resultsCard);
  }

  const dollar = +dollarValueInput.value || 0;
  const netMoney = totals.map(t => t * dollar);
  const maxMoney = Math.max(...netMoney);

  resultsCard.innerHTML = `
    <div class="gfg-finish-shell">
      <div class="gfg-finish-confetti" aria-hidden="true"></div>
      <div class="gfg-finish-inner">
        <h2 class="gfg-finish-title mb-2">&#127881; 19th Hole - Game Complete! &#127881;</h2>
        <p class="gfg-finish-subtitle mb-4">Six-Six-Six</p>
        <div class="row g-3 mb-4 gfg-finish-grid">
          ${players.map((p, i) => `
            <div class="col-6">
              <div class="gfg-finish-pill">
                <span class="gfg-finish-label">${safeName(i)}${netMoney[i] === maxMoney ? " Winner" : ""}</span>
                <div class="gfg-finish-value">${totals[i]} pts</div>
                <div class="gfg-finish-value" id="finalMoney666_${i}">+$0.00</div>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="gfg-results-actions">
          <a id="saveGameBtn" class="gfg-pill-btn">Save Game Data</a>
          <a href="goodflightgames.html" class="gfg-pill-btn">Back to Games</a>
          <a href="../index.html" class="gfg-pill-btn">Back to Home</a>
        </div>
      </div>
    </div>
  `;
  resultsCard.style.display = "block";
  players.forEach((_, i) => {
    const el = document.getElementById(`finalMoney666_${i}`);
    if (el) animateMoney(el, 0, netMoney[i]);
  });

  runConfetti();

  const saveBtn = document.getElementById("saveGameBtn");
  if (!saveBtn) return;

  saveBtn.onclick = async () => {
    const user = firebase?.auth?.().currentUser;
    if (!user) {
      alert("Please log in to save the game!");
      return;
    }

    selectedSelfPlayerIndex = getSelectedSelfPlayerIndex();
    if (selectedSelfPlayerIndex === null) {
      alert("Please select which player slot is yours before saving.");
      selfPlayerSelect?.focus();
      return;
    }

    try {
      const docRef = await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("savedGames")
        .add({
          gameType: "666",
          sessionId: null,
          sessionMode: "game-only",
          linkedCourseName: null,
          linkedTeeName: null,
          linkedRoundDate: null,
          hole,
          holes,
          totals,
          players,
          trackedPlayerIndex: selectedSelfPlayerIndex,
          trackedPlayerName: selectedSelfPlayerIndex !== null ? (players[selectedSelfPlayerIndex] || `Player ${selectedSelfPlayerIndex + 1}`) : null,
          trackedUserUid: user.uid,
          base: +baseInput.value || 0,
          dollarValue: +dollarValueInput.value || 0,
          tieSetPoints: tieSetPoints.value !== "" ? +tieSetPoints.value : null,
          tieMultiplier: +tieMultiplier.value || 1,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

      alert("666 game saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving 666 game.");
    }
  };
}

// ---------------------------
// CONFETTI
// ---------------------------
function runConfetti() {
  if (!window.confetti) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.onload = runConfetti;
    document.body.appendChild(script);
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 999999;
  document.body.appendChild(canvas);

  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
  const duration = 4500;
  const end = Date.now() + duration;

  (function frame() {
    myConfetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 } });
    myConfetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
    else setTimeout(() => canvas.remove(), 900);
  })();
}

// ---------------------------
// AUTOLOAD
// ---------------------------
function loadGameData(data) {
  hole = data?.hole || 1;
  holes = data?.holes || {};
  totals = data?.totals || [0, 0, 0, 0];
  players = data?.players || ["Player 1", "Player 2", "Player 3", "Player 4"];
  selectedSelfPlayerIndex = Number.isInteger(data?.trackedPlayerIndex) ? data.trackedPlayerIndex : null;

  if (typeof data?.base === "number") baseInput.value = data.base;
  if (typeof data?.dollarValue === "number") dollarValueInput.value = data.dollarValue;
  if (data?.tieSetPoints !== undefined && data?.tieSetPoints !== null) tieSetPoints.value = data.tieSetPoints;
  if (typeof data?.tieMultiplier === "number") tieMultiplier.value = data.tieMultiplier;

  document.querySelectorAll(".player666").forEach((input, idx) => {
    input.value = players[idx] || `Player ${idx + 1}`;
  });

  syncSelfPlayerOptions();
  if (selfPlayerSelect && selectedSelfPlayerIndex !== null) {
    selfPlayerSelect.value = String(selectedSelfPlayerIndex);
  }

  render();
  recalc();

  if (hole === 19) {
    showResultsSummary();
  } else {
    hideResultsSummary();
  }
}

(function autoLoadFromHomePage() {
  try {
    const raw = sessionStorage.getItem("gfg_savedGame");
    if (!raw) return;

    const payload = JSON.parse(raw);
    if (!payload || !payload.data) return;

    const gameType = (payload.gameType || "").toLowerCase();
    if (gameType !== "666") return;

    loadedFromSavedGame = true;
    loadGameData(payload.data);
    sessionStorage.removeItem("gfg_savedGame");
    alert("Loaded saved 666 game!");
  } catch (e) {
    console.error("666 Auto-load failed:", e);
  }
})();

// ---------------------------
// RULES MODAL
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("sixesRulesBtn");
  const modal = document.getElementById("sixesRulesModal");
  const closeBtn = document.getElementById("closeSixesRulesBtn");
  const bodyEl = document.getElementById("sixesRulesBody");

  if (!openBtn || !modal || !closeBtn || !bodyEl) return;

  bodyEl.innerHTML = `
    <h5 class="mt-2">Team Rotations</h5>
    <ul>
      <li><strong>Holes 1-6:</strong> P1 + P2 vs P3 + P4</li>
      <li><strong>Holes 7-12:</strong> P1 + P3 vs P2 + P4</li>
      <li><strong>Holes 13-18:</strong> P1 + P4 vs P2 + P3</li>
    </ul>
    <h5 class="mt-4">This Tracker</h5>
    <p>
      Two buttons per hole (<strong>Team 1</strong> / <strong>Team 2</strong>) plus <strong>Push</strong>.
      Push carries a pot forward using your Tie settings.
    </p>
  `;

  modal.classList.add("hidden");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");

  const open = () => {
    modal.classList.remove("hidden");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    open();
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
});

// ---------------------------
// INIT
// ---------------------------
render();
recalc();
syncSelfPlayerOptions();

window.GFG_666 = { loadGameData };



