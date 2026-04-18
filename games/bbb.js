// =====================================================
// BBB - Bingo Bango Bongo (GoodFlight Games)
// Page-scoped IDs (BBB-specific) to avoid collisions
// - Tracks Bingo/Bango/Bongo selections per hole
// - Totals points per player
// - Money display = points * bet per point
// - Hole 19 results + Firestore save
// - Back to Games + Back to Home buttons work
// =====================================================

// ---------------------------
// SAFETY GUARDS
// ---------------------------
function $(id) { return document.getElementById(id); }
function on(el, evt, fn) { if (el) el.addEventListener(evt, fn); else console.warn('[BBB] missing element for', evt, el); }

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
});

// ---------------------------
// INPUTS (BBB-specific IDs)
// ---------------------------
const betInput = $("bbbBet");
const selfPlayerSelect = $("bbbSelfPlayerSelect");

// ---------------------------
// UI (some shared IDs, some BBB-specific)
// ---------------------------
const holeTitle = $("bbbHoleTitle");

const holeSetupCard = $("holeSetupCard");
const holeNavCard = $("holeNavCard");
const scoreboardCard = $("scoreboardCard");

const prevHoleBtn = $("prevHoleBtn");
const nextHoleBtn = $("nextHoleBtn");

const bingoSelect = $("bbbBingoSelect");
const bangoSelect = $("bbbBangoSelect");
const bongoSelect = $("bbbBongoSelect");

// Scoreboard slots reuse Wolf IDs for consistent styling
const tEls = [0, 1, 2, 3].map(i => $(`t${i}`));
const mEls = [0, 1, 2, 3].map(i => $(`m${i}`));

// ---------------------------
// GAME STATE
// ---------------------------
let hole = 1;
let players = ["Player 1", "Player 2", "Player 3", "Player 4"];
let totals = [0, 0, 0, 0];
let selectedSelfPlayerIndex = null;
const sessionApi = window.GFGSession || null;
let linkedSessionId = sessionApi?.getSessionIdFromUrl() || "";
let loadedFromSavedGame = false;

// holes[n] = { bingo: idx|null, bango: idx|null, bongo: idx|null }
let holes = {};

function getLinkedSession() {
  if (!sessionApi) return null;

  const activeSession = sessionApi.getActiveSession();
  if (linkedSessionId) {
    return activeSession?.sessionId === linkedSessionId
      ? activeSession
      : { sessionId: linkedSessionId };
  }

  if (loadedFromSavedGame) {
    return null;
  }

  if (activeSession?.sessionId && sessionApi.normalizeGameType(activeSession.gameType) === "bbb") {
    linkedSessionId = activeSession.sessionId;
    return activeSession;
  }

  return null;
}

function renderLinkedSessionBanner() {
  let banner = document.getElementById("gfgLinkedRoundBanner");
  const linkedSession = getLinkedSession();

  if (!linkedSession?.sessionId) {
    banner?.remove();
    return;
  }

  if (!banner) {
    banner = document.createElement("div");
    banner.id = "gfgLinkedRoundBanner";
    banner.className = "card game-card p-3 mb-3";
    selectionWrapper?.parentElement?.insertBefore(banner, selectionWrapper);
  }

  const course = linkedSession.courseName || "Linked Round Session";
  const tee = linkedSession.teeName ? ` - ${linkedSession.teeName}` : "";
  banner.innerHTML = `
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
      <div>
        <h5 class="mb-1">Linked Round Session</h5>
        <div class="small text-muted">${course}${tee}</div>
      </div>

      <div class="d-flex flex-wrap gap-2">
        <a class="gfg-pill-btn" href="../rounds/scorecard.html?sessionId=${encodeURIComponent(linkedSession.sessionId)}">Back to Scorecard</a>
        <button type="button" class="gfg-pill-btn game-session-clear-btn" id="clearLinkedGameSessionBtn">Clear Session</button>
      </div>
    </div>
  `;

  document.getElementById("clearLinkedGameSessionBtn")?.addEventListener("click", () => {
    const confirmed = window.confirm("Clear this linked round session and remove the in-progress shared drafts?");
    if (!confirmed) return;

    sessionApi?.clearSessionArtifacts(linkedSession.sessionId);
    linkedSessionId = "";
    renderLinkedSessionBanner();
  });
}

function getGameDraftPayload() {
  return {
    sessionId: linkedSessionId,
    hole,
    holes,
    totals,
    players,
    trackedPlayerIndex: selectedSelfPlayerIndex,
    bet: +betInput?.value || 0
  };
}

function persistLinkedGameDraft() {
  if (!sessionApi || !linkedSessionId) return;

  sessionApi.saveGameDraft("bbb", linkedSessionId, getGameDraftPayload());
  sessionApi.updateActiveSession({
    sessionId: linkedSessionId,
    mode: "round+game",
    gameType: "bbb",
    currentGameHole: hole
  });
}

function restoreLinkedGameDraft() {
  if (!sessionApi || loadedFromSavedGame) return false;

  const linkedSession = getLinkedSession();
  if (!linkedSession?.sessionId) return false;

  linkedSessionId = linkedSession.sessionId;
  const draft = sessionApi.loadGameDraft("bbb", linkedSessionId);
  if (!draft) {
    renderLinkedSessionBanner();
    return false;
  }

  loadGameData(draft);
  renderLinkedSessionBanner();
  return true;
}

// Per-hole state helper
function H() {
  return holes[hole] ??= { bingo: null, bango: null, bongo: null };
}

function safeName(i) {
  return players[i] || `Player ${i + 1}`;
}

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

// ---------------------------
// PLAYER NAMES (bbb.html uses .bbb-player)
// ---------------------------
document.querySelectorAll(".bbb-player").forEach((input, idx) => {
  input.addEventListener("input", () => {
    players[idx] = input.value || `Player ${idx + 1}`;
    syncSelfPlayerOptions();
    render();
    recalc();
  });
});

selfPlayerSelect?.addEventListener("change", () => {
  selectedSelfPlayerIndex = getSelectedSelfPlayerIndex();
});

// ---------------------------
// SELECT OPTIONS + BINDINGS
// ---------------------------
function buildSelectOptions() {
  const base = `<option value="">-</option>`;
  const opts = players.map((_, i) => `<option value="${i}">${safeName(i)}</option>`).join("");
  const html = base + opts;

  if (bingoSelect) bingoSelect.innerHTML = html;
  if (bangoSelect) bangoSelect.innerHTML = html;
  if (bongoSelect) bongoSelect.innerHTML = html;
}

function syncSelectsFromState() {
  const h = H();
  if (bingoSelect) bingoSelect.value = h.bingo === null ? "" : String(h.bingo);
  if (bangoSelect) bangoSelect.value = h.bango === null ? "" : String(h.bango);
  if (bongoSelect) bongoSelect.value = h.bongo === null ? "" : String(h.bongo);
}

function readSelectValue(sel) {
  if (!sel) return null;
  if (sel.value === "") return null;
  const n = Number(sel.value);
  return Number.isFinite(n) ? n : null;
}

on(bingoSelect, "change", () => { H().bingo = readSelectValue(bingoSelect); recalc(); });
on(bangoSelect, "change", () => { H().bango = readSelectValue(bangoSelect); recalc(); });
on(bongoSelect, "change", () => { H().bongo = readSelectValue(bongoSelect); recalc(); });

on(betInput, "input", () => recalc());

// ---------------------------
// TOTALS RECALC
// ---------------------------
function recalc() {
  totals = [0, 0, 0, 0];

  const ordered = Object.keys(holes).map(n => +n).sort((a, b) => a - b);

  ordered.forEach(holeNum => {
    const h = holes[holeNum];
    if (!h) return;

    ["bingo", "bango", "bongo"].forEach(key => {
      const idx = h[key];
      if (idx === 0 || idx === 1 || idx === 2 || idx === 3) totals[idx] += 1;
    });
  });

  updateTotals();
  persistLinkedGameDraft();
}

function updateTotals() {
  const bet = +betInput?.value || 0;

  for (let i = 0; i < 4; i++) {
    if (tEls[i]) tEls[i].innerText = `${safeName(i)}: ${totals[i]} pts`;

    const net = totals[i] * bet;
    if (mEls[i]) {
      mEls[i].innerText = (net >= 0 ? "+" : "-") + "$" + Math.abs(net).toFixed(2);
      mEls[i].style.color = net >= 0 ? "#359447" : "#d9534f";
    }
  }
}

// ---------------------------
// RENDER
// ---------------------------
function render() {
  if (holeTitle) holeTitle.innerText = `Hole ${hole}`;
  renderLinkedSessionBanner();
  buildSelectOptions();
  syncSelectsFromState();
  updateTotals();
  persistLinkedGameDraft();
}

// ---------------------------
// HOLE NAV
// ---------------------------
function hideResultsSummary() {
  const res = $("resultsCardBBB");
  if (res) res.style.display = "none";
  if (holeSetupCard) holeSetupCard.style.display = "block";
  if (holeNavCard) holeNavCard.style.display = "block";
  if (scoreboardCard) scoreboardCard.style.display = "block";
}

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

on(prevHoleBtn, "click", prevHole);
on(nextHoleBtn, "click", nextHole);

// ---------------------------
// CONFETTI (same as Wolf/666)
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

function animateMoney(element, start, end, duration = 1200) {
  if (!element) return;

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

// ---------------------------
// RESULTS (HOLE 19) + SAVE
// ---------------------------
function showResultsSummary() {
  if (holeSetupCard) holeSetupCard.style.display = "none";
  if (holeNavCard) holeNavCard.style.display = "none";
  if (scoreboardCard) scoreboardCard.style.display = "none";

  let resultsCard = document.getElementById("resultsCardBBB");
  if (!resultsCard) {
    resultsCard = document.createElement("div");
    resultsCard.id = "resultsCardBBB";
    resultsCard.className = "card game-card p-4 mb-3 text-center gfg-finish-card";
    selectionWrapper?.appendChild(resultsCard);
  }

  const dollar = +betInput?.value || 0;
  const netMoney = totals.map(t => t * dollar);
  const maxMoney = Math.max(...netMoney);

  resultsCard.innerHTML = `
    <div class="gfg-finish-shell">
      <div class="gfg-finish-confetti" aria-hidden="true"></div>
      <div class="gfg-finish-inner">
        <h2 class="gfg-finish-title mb-2">&#127881; 19th Hole - Game Complete! &#127881;</h2>
        <p class="gfg-finish-subtitle mb-4">Bingo Bango Bongo</p>
        <div class="row g-3 mb-4 gfg-finish-grid">
          ${players.map((p, i) => `
            <div class="col-6">
              <div class="gfg-finish-pill">
                <span class="gfg-finish-label">${p}${netMoney[i] === maxMoney ? " Winner" : ""}</span>
                <div class="gfg-finish-value">${totals[i]} pts</div>
                <div class="gfg-finish-value" id="finalMoneyBBB_${i}">+$0.00</div>
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
    const el = document.getElementById(`finalMoneyBBB_${i}`);
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
      const linkedSession = getLinkedSession();
      const docRef = await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("savedGames")
        .add({
          gameType: "bbb",
          sessionId: linkedSession?.sessionId || null,
          sessionMode: linkedSession?.sessionId ? "round+game" : "game-only",
          linkedCourseName: linkedSession?.courseName || null,
          linkedTeeName: linkedSession?.teeName || null,
          linkedRoundDate: linkedSession?.roundDate || null,
          hole,
          holes,
          totals,
          players,
          trackedPlayerIndex: selectedSelfPlayerIndex,
          trackedPlayerName: selectedSelfPlayerIndex !== null ? (players[selectedSelfPlayerIndex] || `Player ${selectedSelfPlayerIndex + 1}`) : null,
          trackedUserUid: user.uid,
          bet: +betInput?.value || 0,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

      let message = "BBB game saved!";
      if (linkedSession?.sessionId && sessionApi) {
        const completion = sessionApi.completeSessionPart("game", { docId: docRef.id });
        if (completion.completed) {
          linkedSessionId = "";
          renderLinkedSessionBanner();
          message = "BBB game saved! Round + game session complete.";
        } else {
          sessionApi.clearGameDraft("bbb", linkedSession.sessionId);
          sessionApi.updateActiveSession({
            sessionId: linkedSession.sessionId,
            gameSaved: true,
            gameDocId: docRef.id,
            gameType: "bbb"
          });
        }
      }

      alert(message);
    } catch (err) {
      console.error(err);
      alert("Error saving BBB game.");
    }
  };
}

// ---------------------------
// AUTOLOAD FROM HOME (optional, same sessionStorage key as other games)
// ---------------------------
function loadGameData(data) {
  if (data?.sessionId) {
    linkedSessionId = data.sessionId;
  }

  hole = data?.hole || 1;
  holes = data?.holes || {};
  totals = data?.totals || [0, 0, 0, 0];
  players = data?.players || ["Player 1", "Player 2", "Player 3", "Player 4"];
  selectedSelfPlayerIndex = Number.isInteger(data?.trackedPlayerIndex) ? data.trackedPlayerIndex : null;

  if (typeof data?.bet === "number" && betInput) betInput.value = data.bet;

  document.querySelectorAll(".bbb-player").forEach((input, idx) => {
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

  renderLinkedSessionBanner();
}

// ---------------------------
// AUTOLOAD FROM HOME (optional, same sessionStorage key as other games)
// ---------------------------
(function autoLoadFromHomePage() {
  try {
    const raw = sessionStorage.getItem("gfg_savedGame");
    if (!raw) return;

    const payload = JSON.parse(raw);
    if (!payload || !payload.data) return;

    const gameType = (payload.gameType || "").toLowerCase();
    if (gameType !== "bbb") return;

    loadedFromSavedGame = true;
    loadGameData(payload.data);
    sessionStorage.removeItem("gfg_savedGame");
    alert("Loaded saved BBB game!");
  } catch (e) {
    console.error("BBB Auto-load failed:", e);
  }
})();

// ---------------------------
// RULES MODAL (uses your existing .hidden class)
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = $("bbbRulesBtn");
  const modal = $("bbbRulesModal");
  const closeBtn = $("closeBBBRulesBtn");
  const bodyEl = $("bbbRulesBody");

  if (!openBtn || !modal || !closeBtn || !bodyEl) return;

  bodyEl.innerHTML = `
    <p><strong>Bingo</strong> = first on the green</p>
    <p><strong>Bango</strong> = closest to the pin</p>
    <p><strong>Bongo</strong> = first in the hole</p>
    <p>Each pick is worth <strong>1 point</strong>. Money is <strong>points Ã— bet</strong>.</p>
    <p class="mb-0">Tip: You can leave any category blank (-) and fill it later.</p>
  `;

  const open = () => {
    modal.classList.remove("hidden");
    document.body.classList.add("no-scroll");
  };

  const close = () => {
    modal.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  };

  // Force closed state on boot
  close();

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

  // click outside closes
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
  });
});

// ---------------------------
// INIT
// ---------------------------
syncSelfPlayerOptions();
render();
recalc();
restoreLinkedGameDraft();
renderLinkedSessionBanner();

sessionApi?.attachLinkedFullscreenSwipe?.({
  surface: selectionWrapper,
  direction: "left",
  isEnabled: () => selectionWrapper?.classList.contains("fullscreen") && !!getLinkedSession()?.sessionId,
  getTargetUrl: () => {
    const linkedSession = getLinkedSession();
    return linkedSession?.sessionId ? sessionApi.getScorecardUrl(linkedSession.sessionId) : "";
  }
});

// Expose for debugging
window.GFG_BBB = { loadGameData };

