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
    fullscreenBtn.innerText = "❌ Close Fullscreen";
  } else {
    body.classList.remove("no-scroll");
    fullscreenBtn.innerText = "📱 Fullscreen Selection";
  }
});

// =====================================================
// INPUTS
// =====================================================

const baseInput = document.getElementById("base");
const dollarValueInput = document.getElementById("dollarValue");

const loneWinPointsInput = document.getElementById("loneWinPoints");
const loneLosePointsInput = document.getElementById("loneLosePoints");

const dumpWinPointsInput = document.getElementById("dumpWinPoints");
const dumpLosePointsInput = document.getElementById("dumpLosePoints");

const blindWinPointsInput = document.getElementById("blindWinPoints");
const blindLosePointsInput = document.getElementById("blindLosePoints");

const tieSetPointsInput = document.getElementById("tieSetPoints");

const potBanner = document.getElementById("potBanner");
const potValue = document.getElementById("potValue");

const holeTitle = document.getElementById("holeTitle");
const holeSetupSelect = document.getElementById("holeSetupSelect");
const wolfSelect = document.getElementById("wolfSelect");

const holeSetupCard = document.getElementById("holeSetupCard");
const holeNavCard = document.getElementById("holeNavCard");
const scoreboardCard = document.getElementById("scoreboardCard");

const teamBtns = document.getElementById("teamBtns");
const loneBtns = document.getElementById("loneBtns");
const dumpBtns = document.getElementById("dumpBtns");
const blindBtns = document.getElementById("blindBtns");

const pushBtn = document.getElementById("pushBtn");
const dumpModeBtn = document.getElementById("dumpModeBtn");

// =====================================================
// FEATURE TOGGLES
// =====================================================

const toggleLone = document.getElementById("toggleLone");
const toggleDump = document.getElementById("toggleDump");
const toggleBlind = document.getElementById("toggleBlind");
const toggleCarryover = document.getElementById("toggleCarryover");
const toggleBirdieDouble = document.getElementById("toggleBirdieDouble");

// =====================================================
// GAME STATE
// =====================================================

let hole = 1;
let players = ["Player 1", "Player 2", "Player 3", "Player 4"];
let totals = [0, 0, 0, 0];
let holes = {};
let currentPot = 0;
let currentWolfIndex = 0;

let pendingBirdieResult = null;
let pendingBirdieMode = null;

// =====================================================
// MONEY COUNT ANIMATION
// =====================================================

function animateMoney(element, start, end, duration = 1200) {
  if (!element) return;

  const range = end - start;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = start + range * progress;
    element.textContent = "$" + value.toFixed(2);

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// =====================================================
// HELPERS
// =====================================================

function toNumber(input) {
  return +(input?.value || 0);
}

function basePoints() {
  return toNumber(baseInput);
}

function teamSplitPoints() {
  return basePoints() / 2;
}

function loneWinPoints() {
  return toNumber(loneWinPointsInput);
}

function loneLosePoints() {
  return toNumber(loneLosePointsInput);
}

function dumpWinPoints() {
  return toNumber(dumpWinPointsInput);
}

function dumpLosePoints() {
  return toNumber(dumpLosePointsInput);
}

function blindWinPoints() {
  return toNumber(blindWinPointsInput);
}

function blindLosePoints() {
  return toNumber(blindLosePointsInput);
}

function tieCarryPoints() {
  return isCarryoverEnabled() ? toNumber(tieSetPointsInput) : 0;
}

function isLoneEnabled() {
  return toggleLone ? toggleLone.checked : true;
}

function isDumpEnabled() {
  return toggleDump ? toggleDump.checked : true;
}

function isBlindEnabled() {
  return toggleBlind ? toggleBlind.checked : true;
}

function isCarryoverEnabled() {
  return toggleCarryover ? toggleCarryover.checked : true;
}

function isBirdieDoubleEnabled() {
  return toggleBirdieDouble ? toggleBirdieDouble.checked : false;
}

function H() {
  return (holes[hole] ??= {
    wolf: currentWolfIndex,
    partner: null,
    mode: null,
    result: null,
    birdieDouble: false
  });
}

function getBirdieMultiplier(h) {
  return h?.birdieDouble ? 2 : 1;
}

function resetInvalidModeForCurrentHole() {
  const h = H();

  if (h.mode === "lone" && !isLoneEnabled()) {
    h.mode = null;
    h.partner = null;
    h.result = null;
    h.birdieDouble = false;
  }

  if (h.mode === "blind" && !isBlindEnabled()) {
    h.mode = null;
    h.partner = null;
    h.result = null;
    h.birdieDouble = false;
  }

  if (h.mode === "dump" && !isDumpEnabled()) {
    h.mode = "team";
    h.result = null;
    h.birdieDouble = false;
  }
}

function syncToggleControlledInputs() {
  if (loneWinPointsInput) loneWinPointsInput.disabled = !isLoneEnabled();
  if (loneLosePointsInput) loneLosePointsInput.disabled = !isLoneEnabled();

  if (dumpWinPointsInput) dumpWinPointsInput.disabled = !isDumpEnabled();
  if (dumpLosePointsInput) dumpLosePointsInput.disabled = !isDumpEnabled();

  if (blindWinPointsInput) blindWinPointsInput.disabled = !isBlindEnabled();
  if (blindLosePointsInput) blindLosePointsInput.disabled = !isBlindEnabled();

  if (tieSetPointsInput) tieSetPointsInput.disabled = !isCarryoverEnabled();
}

function clearPendingBirdie() {
  pendingBirdieResult = null;
  pendingBirdieMode = null;
}

function isBirdiePromptActive() {
  return !!pendingBirdieResult;
}

function hideAllResultGroups() {
  teamBtns?.classList.add("hidden");
  loneBtns?.classList.add("hidden");
  dumpBtns?.classList.add("hidden");
  blindBtns?.classList.add("hidden");
}

function resetResultButtonSelections() {
  document
    .querySelectorAll("#teamBtns .btn, #loneBtns .btn, #dumpBtns .btn, #blindBtns .btn, #pushBtn")
    .forEach(b => b.classList.remove("selected"));
}

function ensureBirdiePromptContainer() {
  let wrap = document.getElementById("birdiePromptBtns");

  if (!wrap && holeSetupCard) {
    wrap = document.createElement("div");
    wrap.id = "birdiePromptBtns";
    wrap.className = "d-grid gap-2 hidden";
    wrap.innerHTML = `
      <div id="birdiePromptLabel" class="text-center fw-bold mb-2">Birdie Double?</div>
      <button id="birdieYes" class="btn btn-success" type="button">Yes</button>
      <button id="birdieNo" class="btn btn-secondary" type="button">No</button>
    `;
    blindBtns?.insertAdjacentElement("afterend", wrap);

    document.getElementById("birdieYes")?.addEventListener("click", () => {
      finalizeBirdiePrompt(true);
    });

    document.getElementById("birdieNo")?.addEventListener("click", () => {
      finalizeBirdiePrompt(false);
    });
  }

  return wrap;
}

function showBirdiePrompt() {
  const wrap = ensureBirdiePromptContainer();
  if (!wrap) return;

  hideAllResultGroups();
  pushBtn?.classList.add("hidden");
  dumpModeBtn?.classList.add("hidden");
  wrap.classList.remove("hidden");
}

function hideBirdiePrompt() {
  const wrap = document.getElementById("birdiePromptBtns");
  if (wrap) wrap.classList.add("hidden");

  pushBtn?.classList.remove("hidden");
  dumpModeBtn?.classList.remove("hidden");
}

function finalizeBirdiePrompt(shouldDouble) {
  if (!pendingBirdieResult) return;

  H().result = pendingBirdieResult;
  H().mode = pendingBirdieMode ?? H().mode;
  H().birdieDouble = !!shouldDouble;

  hideBirdiePrompt();
  clearPendingBirdie();
  recalc();

  if (hole < 18) {
    nextHole();
  }
}

// =====================================================
// PLAYER NAMES
// =====================================================

document.querySelectorAll(".player").forEach((input, idx) => {
  input.oninput = () => {
    players[idx] = input.value || `Player ${idx + 1}`;
    render();
    recalc();
  };
});

// =====================================================
// RESULT SELECT
// =====================================================

function selectResult(btn, result) {
  resetResultButtonSelections();
  btn.classList.add("selected");

  if (result === "push") {
    hideBirdiePrompt();
    clearPendingBirdie();

    H().result = "push";
    H().birdieDouble = false;
    recalc();

    if (hole < 18) {
      nextHole();
    }
    return;
  }

  if (isBirdieDoubleEnabled()) {
    pendingBirdieResult = result;
    pendingBirdieMode = H().mode;
    H().result = null;
    H().birdieDouble = false;
    showBirdiePrompt();
    return;
  }

  hideBirdiePrompt();
  clearPendingBirdie();

  H().result = result;
  H().birdieDouble = false;
  recalc();

  if (hole < 18) {
    nextHole();
  }
}

function selectDump() {
  if (!isDumpEnabled()) return;
  if (H().partner === null) return;

  hideBirdiePrompt();
  clearPendingBirdie();

  H().mode = "dump";
  H().result = null;
  H().birdieDouble = false;

  resetResultButtonSelections();
  updateUI();
  recalc();
}

// =====================================================
// SHOW RESULT BUTTONS
// =====================================================

function updateUI() {
  if (isBirdiePromptActive()) {
    showBirdiePrompt();
    return;
  }

  hideBirdiePrompt();
  hideAllResultGroups();

  const mode = H().mode;

  if (mode === "team") teamBtns?.classList.remove("hidden");
  if (mode === "lone" && isLoneEnabled()) loneBtns?.classList.remove("hidden");
  if (mode === "dump" && isDumpEnabled()) dumpBtns?.classList.remove("hidden");
  if (mode === "blind" && isBlindEnabled()) blindBtns?.classList.remove("hidden");

  if (pushBtn) pushBtn.classList.remove("hidden");

  if (dumpModeBtn) {
    if (mode === "team" && isDumpEnabled() && H().partner !== null) {
      dumpModeBtn.classList.remove("hidden");
    } else {
      dumpModeBtn.classList.add("hidden");
    }
  }
}

// =====================================================
// POT DISPLAY
// =====================================================

function updatePotDisplay() {
  if (!potBanner || !potValue) return;

  if (currentPot > 0) {
    potValue.textContent = currentPot;
    potBanner.classList.remove("hidden");
  } else {
    potBanner.classList.add("hidden");
  }
}

// =====================================================
// RECALC
// =====================================================

function recalc() {
  totals = [0, 0, 0, 0];
  let carryover = 0;

  const orderedHoles = Object.keys(holes)
    .map(Number)
    .sort((a, b) => a - b);

  orderedHoles.forEach(holeNum => {
    const h = holes[holeNum];
    if (!h || !h.result) return;

    const allPlayers = [0, 1, 2, 3];
    const birdieMultiplier = getBirdieMultiplier(h);

    if (h.result === "push") {
      carryover += tieCarryPoints();
      return;
    }

    const pot = carryover;
    carryover = 0;

    if (h.result === "wolfTeam") {
      if (h.partner === null) return;

      const normalEach = teamSplitPoints() * birdieMultiplier;
      const each = normalEach + (pot / 2);

      totals[h.wolf] += each;
      totals[h.partner] += each;
      return;
    }

    if (h.result === "others") {
      const winners = allPlayers.filter(i => i !== h.wolf && i !== h.partner);
      const normalEach = teamSplitPoints() * birdieMultiplier;
      const each = normalEach + (pot / 2);

      winners.forEach(i => {
        totals[i] += each;
      });
      return;
    }

    if (h.result === "loneWin" && h.mode === "lone") {
      totals[h.wolf] += (loneWinPoints() * birdieMultiplier) + pot;
      return;
    }

    if (h.result === "loneLose" && h.mode === "lone") {
      const winners = allPlayers.filter(i => i !== h.wolf);
      const each = ((loneLosePoints() * birdieMultiplier) / 3) + (pot / 3);

      winners.forEach(i => {
        totals[i] += each;
      });
      return;
    }

    if (h.result === "loneWin" && h.mode === "blind") {
      totals[h.wolf] += (blindWinPoints() * birdieMultiplier) + pot;
      return;
    }

    if (h.result === "loneLose" && h.mode === "blind") {
      const winners = allPlayers.filter(i => i !== h.wolf);
      const each = ((blindLosePoints() * birdieMultiplier) / 3) + (pot / 3);

      winners.forEach(i => {
        totals[i] += each;
      });
      return;
    }

    if (h.result === "dumpWin") {
      const dumpPlayer = h.partner;
      if (dumpPlayer === null || dumpPlayer === undefined) return;

      totals[dumpPlayer] += (dumpWinPoints() * birdieMultiplier) + pot;
      return;
    }

    if (h.result === "dumpLose") {
      const dumpPlayer = h.partner;
      if (dumpPlayer === null || dumpPlayer === undefined) return;

      const winners = allPlayers.filter(i => i !== dumpPlayer);
      const each = ((dumpLosePoints() * birdieMultiplier) / 3) + (pot / 3);

      winners.forEach(i => {
        totals[i] += each;
      });
      return;
    }
  });

  currentPot = carryover;
  updatePotDisplay();
  updateTotals();
}

// =====================================================
// RENDER
// =====================================================

function render() {
  resetInvalidModeForCurrentHole();
  syncToggleControlledInputs();

  if (holeTitle) {
    holeTitle.innerText = `Hole ${hole}`;
  }

  if (wolfSelect) {
    wolfSelect.innerHTML = players
      .map((p, i) => `<option value="${i}">${p}</option>`)
      .join("");
    wolfSelect.value = H().wolf;
  }

  const setupOptions = [`<option value="">Select Partner/Play</option>`];

  players.forEach((p, i) => {
    if (i !== H().wolf) {
      setupOptions.push(`<option value="partner-${i}">Partner: ${p}</option>`);
    }
  });

  if (isLoneEnabled()) {
    setupOptions.push(`<option value="lone">Lone Wolf</option>`);
  }

  if (isBlindEnabled()) {
    setupOptions.push(`<option value="blind">Blind Wolf</option>`);
  }

  if (holeSetupSelect) {
    holeSetupSelect.innerHTML = setupOptions.join("");
  }

  let currentSetupValue = "";
  if ((H().mode === "team" || H().mode === "dump") && H().partner !== null) {
    currentSetupValue = `partner-${H().partner}`;
  } else if (H().mode === "lone" && isLoneEnabled()) {
    currentSetupValue = "lone";
  } else if (H().mode === "blind" && isBlindEnabled()) {
    currentSetupValue = "blind";
  }

  if (holeSetupSelect) {
    holeSetupSelect.value = currentSetupValue;
  }

  updateUI();
  updateTotals();
}

// =====================================================
// INPUT EVENTS
// =====================================================

wolfSelect?.addEventListener("change", () => {
  hideBirdiePrompt();
  clearPendingBirdie();

  H().wolf = +wolfSelect.value;
  H().partner = null;
  H().mode = null;
  H().result = null;
  H().birdieDouble = false;

  resetResultButtonSelections();
  render();
  recalc();
});

holeSetupSelect?.addEventListener("change", () => {
  hideBirdiePrompt();
  clearPendingBirdie();

  const value = holeSetupSelect.value;

  H().result = null;
  H().birdieDouble = false;

  resetResultButtonSelections();

  if (!value) {
    H().mode = null;
    H().partner = null;
  } else if (value.startsWith("partner-")) {
    H().mode = "team";
    H().partner = +value.split("-")[1];
  } else if (value === "lone" && isLoneEnabled()) {
    H().mode = "lone";
    H().partner = null;
  } else if (value === "blind" && isBlindEnabled()) {
    H().mode = "blind";
    H().partner = null;
  } else {
    H().mode = null;
    H().partner = null;
  }

  render();
  recalc();
});

[
  baseInput,
  dollarValueInput,
  loneWinPointsInput,
  loneLosePointsInput,
  dumpWinPointsInput,
  dumpLosePointsInput,
  blindWinPointsInput,
  blindLosePointsInput,
  tieSetPointsInput
].forEach(input => {
  input?.addEventListener("input", () => {
    recalc();
  });
});

[toggleLone, toggleDump, toggleBlind, toggleCarryover, toggleBirdieDouble].forEach(toggle => {
  toggle?.addEventListener("change", () => {
    hideBirdiePrompt();
    clearPendingBirdie();
    resetInvalidModeForCurrentHole();
    resetResultButtonSelections();
    render();
    recalc();
  });
});

// =====================================================
// HOLE NAV
// =====================================================

function prevHole() {
  if (hole > 1) {
    hideBirdiePrompt();
    clearPendingBirdie();

    hole--;
    currentWolfIndex = H().wolf ?? 0;
    render();
    recalc();
    hideResultsSummary();
  }
}

function nextHole() {
  if (hole < 19) {
    hideBirdiePrompt();
    clearPendingBirdie();

    hole++;
    currentWolfIndex = (currentWolfIndex + 1) % players.length;

    H().wolf = currentWolfIndex;
    H().partner = null;
    H().mode = null;
    H().result = null;
    H().birdieDouble = false;

    resetResultButtonSelections();
    render();
    recalc();

    if (hole === 19) {
      showResultsSummary();
    }
  }
}

// =====================================================
// SCOREBOARD
// =====================================================

function updateTotals() {
  const dollar = toNumber(dollarValueInput);

  players.forEach((p, i) => {
    const scoreEl = document.getElementById(`t${i}`);
    const moneyEl = document.getElementById(`m${i}`);

    if (scoreEl) {
      scoreEl.innerText = `${p}: ${totals[i]} pts`;
    }

    if (moneyEl) {
      const net = totals[i] * dollar;
      moneyEl.innerText = (net >= 0 ? "+" : "-") + "$" + Math.abs(net).toFixed(2);
      moneyEl.style.color = net >= 0 ? "#359447" : "#d9534f";
    }
  });
}

// =====================================================
// RESULTS SCREEN (HOLE 19)
// =====================================================

function hideResultsSummary() {
  const resultsCard = document.getElementById("resultsCard");
  if (resultsCard) resultsCard.style.display = "none";
  if (holeSetupCard) holeSetupCard.style.display = "block";
  if (holeNavCard) holeNavCard.style.display = "block";
  if (scoreboardCard) scoreboardCard.style.display = "block";
}

function showResultsSummary() {
  if (holeSetupCard) holeSetupCard.style.display = "none";
  if (holeNavCard) holeNavCard.style.display = "none";
  if (scoreboardCard) scoreboardCard.style.display = "none";

  let resultsCard = document.getElementById("resultsCard");

  if (!resultsCard) {
    resultsCard = document.createElement("div");
    resultsCard.id = "resultsCard";
    resultsCard.className = "card game-card p-4 mb-3 text-center";
    selectionWrapper?.appendChild(resultsCard);
  }

  const dollar = toNumber(dollarValueInput);
  const netMoney = totals.map(t => t * dollar);
  const maxMoney = Math.max(...netMoney);

  resultsCard.innerHTML = `
    <h2>🎉 Game Over! 🎉</h2>
    ${players.map((p, i) => `
      <div class="d-flex justify-content-center align-items-center my-2 fs-5">
        <span>${p}: ${totals[i]} pts — <span id="finalMoney${i}">$0.00</span></span>
        ${netMoney[i] === maxMoney ? '<span class="ms-2">🏆</span>' : ''}
      </div>
    `).join("")}
    <a id="saveGameBtn" class="gfg-pill-btn">💾 Save Game Data</a><br>
    <a href="goodflightgames.html" class="gfg-pill-btn">💸 Back to Games</a>
    <a href="../index.html" class="gfg-pill-btn" style="margin-top:10px;">🏠 Back to Home</a>
  `;

  players.forEach((_, i) => {
    const el = document.getElementById(`finalMoney${i}`);
    animateMoney(el, 0, netMoney[i]);
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

    try {
      await firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .collection("savedGames")
        .add({
          gameType: "wolf",
          hole,
          holes,
          totals,
          players,
          base: toNumber(baseInput),
          dollarValue: toNumber(dollarValueInput),
          loneWinPoints: toNumber(loneWinPointsInput),
          loneLosePoints: toNumber(loneLosePointsInput),
          dumpWinPoints: toNumber(dumpWinPointsInput),
          dumpLosePoints: toNumber(dumpLosePointsInput),
          blindWinPoints: toNumber(blindWinPointsInput),
          blindLosePoints: toNumber(blindLosePointsInput),
          tieSetPoints: toNumber(tieSetPointsInput),
          loneEnabled: isLoneEnabled(),
          dumpEnabled: isDumpEnabled(),
          blindEnabled: isBlindEnabled(),
          carryoverEnabled: isCarryoverEnabled(),
          birdieDoubleEnabled: isBirdieDoubleEnabled(),
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

      alert("✅ Wolf game saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving Wolf game.");
    }
  };
}

// =====================================================
// CONFETTI
// =====================================================

function runConfetti() {
  if (!window.confetti) {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
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
  const duration = 5000;
  const end = Date.now() + duration;

  (function frame() {
    myConfetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 } });
    myConfetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 } });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    } else {
      setTimeout(() => canvas.remove(), 1000);
    }
  })();
}

// =====================================================
// WOLF RULES MODAL CONTENT
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  ensureBirdiePromptContainer();

  const openBtn = document.getElementById("wolfRulesBtn");
  const modal = document.getElementById("wolfRulesModal");
  const closeBtn = document.getElementById("closeWolfRulesBtn");
  const bodyEl = document.getElementById("wolfRulesBody");

  if (openBtn && modal && closeBtn && bodyEl) {
    bodyEl.innerHTML = `
<h5 class="mt-2">🐺 Wolf Rules</h5>

<p>
  <strong>Wolf</strong> is a 4-player golf game played over 18 holes.
  On each hole, one player is designated as the <strong>Wolf</strong>.
  The Wolf rotates in order so that each player gets an equal number of turns.
</p>

<h5 class="mt-4">Player Rotation</h5>
<ul>
  <li>One player is the Wolf on each hole.</li>
  <li>The Wolf rotates hole by hole in order through all 4 players.</li>
  <li>After Player 4 is the Wolf, the rotation starts over again.</li>
</ul>

<h5 class="mt-4">How a Hole Works</h5>
<ol>
  <li>All 4 players tee off.</li>
  <li>After each other player’s drive, the Wolf decides whether to choose that player as a partner.</li>
  <li>If the Wolf chooses a partner, the hole becomes <strong>2 vs 2</strong>.</li>
  <li>If the Wolf does not choose any partner, the Wolf plays alone in a <strong>1 vs 3</strong> format.</li>
</ol>

<h5 class="mt-4">Main Play Options</h5>
<ul>
  <li><strong>Team Wolf:</strong> The Wolf chooses one partner and plays 2 vs 2.</li>
  <li><strong>Lone Wolf:</strong> The Wolf passes on all partners after seeing the drives and plays 1 vs 3.</li>
  <li><strong>Dump (Optional):</strong> This happens when the partner that the wolf has choosen declines them as a playing partner and becomes the new Wolf.</li>
  <li><strong>Blind Wolf (Optional):</strong> The Wolf declares before the other players tee off that they will play alone 1 vs 3.</li>
</ul>

<h5 class="mt-4">How the Hole is Won</h5>
<p>
  The winning side depends on the scoring format your group is using.
  Common formats include:
</p>
<ul>
  <li><strong>Best Ball:</strong> The lowest score from each side is compared.</li>
  <li><strong>Total Score:</strong> The combined team scores are compared.</li>
  <li><strong>Net Scoring:</strong> Handicaps are applied before determining the winner.</li>
</ul>

<h5 class="mt-4">Push / Tie</h5>
<ul>
  <li>If both sides tie the hole, the result is a <strong>push</strong>.</li>
  <li>A push may simply end the hole with no winner, or it may create a carryover pot for a later hole.</li>
</ul>

<h5 class="mt-4">End of Game</h5>
<ul>
  <li>The round is normally played over 18 holes.</li>
  <li>Points or money are totaled at the end based on the results of each hole.</li>
  <li>Your group decides the scoring and payout values before or during the round.</li>
</ul>

<div class="mt-4 p-3 rounded" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);">
  <strong>Note:</strong> This modal explains <strong>how Wolf is played</strong>.
  The <strong>Game Logic</strong> section on the page explains <strong>how payouts are handled in this app</strong>.
</div>
    `;

    const open = () => {
      modal.classList.remove("hidden");
      document.body.classList.add("no-scroll");
    };

    const close = () => {
      modal.classList.add("hidden");
      document.body.classList.remove("no-scroll");
    };

    modal.classList.add("hidden");

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
      if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
    });
  }
});

// =====================================================
// INIT
// =====================================================

syncToggleControlledInputs();
render();
recalc();
hideBirdiePrompt();
