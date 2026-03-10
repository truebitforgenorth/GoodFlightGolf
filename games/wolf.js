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

const teamBtns = document.getElementById("teamBtns");
const loneBtns = document.getElementById("loneBtns");
const dumpBtns = document.getElementById("dumpBtns");
const blindBtns = document.getElementById("blindBtns");

// =====================================================
// GAME STATE
// =====================================================

let hole = 1;
let players = ["Player 1", "Player 2", "Player 3", "Player 4"];
let totals = [0, 0, 0, 0];
let holes = {};
let currentPot = 0;
let currentWolfIndex = 0;

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
  return toNumber(tieSetPointsInput);
}

function H() {
  return (holes[hole] ??= {
    wolf: currentWolfIndex,
    partner: null,
    mode: null,
    result: null
  });
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
  btn.parentElement?.querySelectorAll(".btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");

  H().result = result;
  recalc();

  if (hole < 18) {
    nextHole();
  }
}

function selectDump() {
  if (H().partner === null) return;

  H().mode = "dump";
  H().result = null;

  document
    .querySelectorAll("#teamBtns .btn, #loneBtns .btn, #dumpBtns .btn, #blindBtns .btn")
    .forEach(b => b.classList.remove("selected"));

  updateUI();
  recalc();
}

// =====================================================
// SHOW RESULT BUTTONS
// =====================================================

function updateUI() {
  const mode = H().mode;

  teamBtns?.classList.add("hidden");
  loneBtns?.classList.add("hidden");
  dumpBtns?.classList.add("hidden");
  blindBtns?.classList.add("hidden");

  if (mode === "team") teamBtns?.classList.remove("hidden");
  if (mode === "lone") loneBtns?.classList.remove("hidden");
  if (mode === "dump") dumpBtns?.classList.remove("hidden");
  if (mode === "blind") blindBtns?.classList.remove("hidden");
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

    // Push / tie
    if (h.result === "push") {
      carryover += tieCarryPoints();
      return;
    }

    const pot = carryover;
    carryover = 0;

    // ---------------------------------
    // TEAM WIN: Wolf + Partner
    // Base is total amount, split by 2
    // Pot is split by 2
    // ---------------------------------
    if (h.result === "wolfTeam") {
      if (h.partner === null) return;

      const each = teamSplitPoints() + (pot / 2);
      totals[h.wolf] += each;
      totals[h.partner] += each;
      return;
    }

    // ---------------------------------
    // TEAM LOSE: Other 2 players win
    // Base is total amount, split by 2
    // Pot is split by 2
    // ---------------------------------
    if (h.result === "others") {
      const winners = allPlayers.filter(i => i !== h.wolf && i !== h.partner);
      const each = teamSplitPoints() + (pot / 2);

      winners.forEach(i => {
        totals[i] += each;
      });
      return;
    }

    // ---------------------------------
    // LONE WIN
    // Exact fixed amount to lone wolf
    // No extra math on configured amount
    // ---------------------------------
    if (h.result === "loneWin" && h.mode === "lone") {
      totals[h.wolf] += loneWinPoints() + pot;
      return;
    }

    // ---------------------------------
    // LONE LOSE
    // Configured amount is TOTAL
    // Split by 3
    // Pot is split by 3
    // ---------------------------------
    if (h.result === "loneLose" && h.mode === "lone") {
      const winners = allPlayers.filter(i => i !== h.wolf);
      const each = (loneLosePoints() / 3) + (pot / 3);

      winners.forEach(i => {
        totals[i] += each;
      });
      return;
    }

    // ---------------------------------
    // BLIND WIN
    // Exact fixed amount to blind wolf
    // ---------------------------------
    if (h.result === "loneWin" && h.mode === "blind") {
      totals[h.wolf] += blindWinPoints() + pot;
      return;
    }

    // ---------------------------------
    // BLIND LOSE
    // Configured amount is TOTAL
    // Split by 3
    // Pot is split by 3
    // ---------------------------------
    if (h.result === "loneLose" && h.mode === "blind") {
      const winners = allPlayers.filter(i => i !== h.wolf);
      const each = (blindLosePoints() / 3) + (pot / 3);

      winners.forEach(i => {
        totals[i] += each;
      });
      return;
    }

    // ---------------------------------
    // DUMP WIN
    // Exact fixed amount to dump player
    // ---------------------------------
    if (h.result === "dumpWin") {
      const dumpPlayer = h.partner;
      if (dumpPlayer === null || dumpPlayer === undefined) return;

      totals[dumpPlayer] += dumpWinPoints() + pot;
      return;
    }

    // ---------------------------------
    // DUMP LOSE
    // Configured amount is TOTAL
    // Split by 3
    // Pot is split by 3
    // ---------------------------------
    if (h.result === "dumpLose") {
      const dumpPlayer = h.partner;
      if (dumpPlayer === null || dumpPlayer === undefined) return;

      const winners = allPlayers.filter(i => i !== dumpPlayer);
      const each = (dumpLosePoints() / 3) + (pot / 3);

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

  setupOptions.push(`<option value="lone">Lone Wolf</option>`);
  setupOptions.push(`<option value="blind">Blind Wolf</option>`);

  if (holeSetupSelect) {
    holeSetupSelect.innerHTML = setupOptions.join("");
  }

  let currentSetupValue = "";
  if ((H().mode === "team" || H().mode === "dump") && H().partner !== null) {
    currentSetupValue = `partner-${H().partner}`;
  } else if (H().mode === "lone") {
    currentSetupValue = "lone";
  } else if (H().mode === "blind") {
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
  H().wolf = +wolfSelect.value;
  H().partner = null;
  H().mode = null;
  H().result = null;
  render();
  recalc();
});

holeSetupSelect?.addEventListener("change", () => {
  const value = holeSetupSelect.value;

  H().result = null;

  if (!value) {
    H().mode = null;
    H().partner = null;
  } else if (value.startsWith("partner-")) {
    H().mode = "team";
    H().partner = +value.split("-")[1];
  } else if (value === "lone") {
    H().mode = "lone";
    H().partner = null;
  } else if (value === "blind") {
    H().mode = "blind";
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

// =====================================================
// HOLE NAV
// =====================================================

function prevHole() {
  if (hole > 1) {
    hole--;
    currentWolfIndex = H().wolf ?? 0;
    render();
    recalc();
    hideResultsSummary();
  }
}

function nextHole() {
  if (hole < 19) {
    hole++;
    currentWolfIndex = (currentWolfIndex + 1) % players.length;

    H().wolf = currentWolfIndex;
    H().partner = null;
    H().mode = null;
    H().result = null;

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
  if (holeNavCard) holeNavCard.style.display = "flex";
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
    <a href="greenflightgames.html" class="gfg-pill-btn">💸 Back to Games</a>
    <a href="../index.html" class="gfg-pill-btn" style="margin-top:10px;">🏠 Back to Home</a>
  `;

  players.forEach((_, i) => {
    const el = document.getElementById(`finalMoney${i}`);
    animateMoney(el, 0, netMoney[i]);
  });

  runConfetti();
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
        <li><strong>Lone Wolf:</strong> The Wolf passes on all partners and plays 1 vs 3.</li>
        <li><strong>Blind Wolf:</strong> The Wolf declares before the other players tee off that they will play alone 1 vs 3.</li>
        <li><strong>Dump:</strong> In this app, Dump is treated as its own scoring mode and payout option.</li>
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
        <li>Depending on your settings, a push may simply end the hole with no winner, or it may create a carryover pot for a later hole.</li>
      </ul>

      <h5 class="mt-4">End of Game</h5>
      <ul>
        <li>The round is normally played over 18 holes.</li>
        <li>Points or money are totaled at the end based on the results of each hole.</li>
        <li>This app calculates those payouts for you using the values you set.</li>
      </ul>

      <div class="mt-4 p-3 rounded" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);">
        <strong>Note:</strong> This modal explains <strong>how Wolf is played</strong>.
        The <strong>Game Logic</strong> section on the page explains <strong>how the app pays out points or money</strong>.
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

render();
recalc();