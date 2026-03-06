// =====================================================
// FULLSCREEN
// =====================================================

const fullscreenBtn = document.getElementById("fullscreenBtn");
const selectionWrapper = document.getElementById("selectionWrapper");
const body = document.body;

fullscreenBtn?.addEventListener("click", () => {
  selectionWrapper.classList.toggle("fullscreen");
  body.classList.toggle("fullscreen-active");

  if (selectionWrapper.classList.contains("fullscreen")) {
    fullscreenBtn.innerText = "❌ Close Fullscreen";
  } else {
    fullscreenBtn.innerText = "📱 Fullscreen Selection";
  }
});


// =====================================================
// INPUTS
// =====================================================

const baseInput = document.getElementById("base"),
  loneMultInput = document.getElementById("loneMult"),
  dumpMultInput = document.getElementById("dumpMult"),
  blindMultInput = document.getElementById("blindMult"),
  dollarValueInput = document.getElementById("dollarValue"),

  loneFixedInput = document.getElementById("loneFixed"),
  dumpFixedInput = document.getElementById("dumpFixed"),
  blindFixedInput = document.getElementById("blindFixed"),

  loneUseMultiplier = document.getElementById("loneUseMultiplier"),
  dumpUseMultiplier = document.getElementById("dumpUseMultiplier"),
  blindUseMultiplier = document.getElementById("blindUseMultiplier"),

  tieUseMultiplier = document.getElementById("tieUseMultiplier"),
  tieSetPoints = document.getElementById("tieSetPoints"),
  tieMultiplier = document.getElementById("tieMultiplier"),

  potBanner = document.getElementById("potBanner"),
  potValue = document.getElementById("potValue"),

  holeSetupSelect = document.getElementById("holeSetupSelect");


// =====================================================
// TOGGLE ENABLE/DISABLE INPUTS
// =====================================================

function syncToggleInputs() {
  // Lone
  if (loneUseMultiplier) {
    loneMultInput.disabled = !loneUseMultiplier.checked;
    loneFixedInput.disabled = loneUseMultiplier.checked;
  }
  // Dump
  if (dumpUseMultiplier) {
    dumpMultInput.disabled = !dumpUseMultiplier.checked;
    dumpFixedInput.disabled = dumpUseMultiplier.checked;
  }
  // Blind
  if (blindUseMultiplier) {
    blindMultInput.disabled = !blindUseMultiplier.checked;
    blindFixedInput.disabled = blindUseMultiplier.checked;
  }
  // Tie
  if (tieUseMultiplier) {
    tieMultiplier.disabled = !tieUseMultiplier.checked;
    tieSetPoints.disabled = tieUseMultiplier.checked;
  }
}

loneUseMultiplier?.addEventListener("change", () => { syncToggleInputs(); recalc(); });
dumpUseMultiplier?.addEventListener("change", () => { syncToggleInputs(); recalc(); });
blindUseMultiplier?.addEventListener("change", () => { syncToggleInputs(); recalc(); });
tieUseMultiplier?.addEventListener("change", () => { syncToggleInputs(); recalc(); });


// =====================================================
// GAME STATE
// =====================================================

let hole = 1,
  players = ["Player 1", "Player 2", "Player 3", "Player 4"],
  totals = [0, 0, 0, 0],
  holes = {},
  currentPot = 0;


// =====================================================
// MONEY COUNT ANIMATION
// =====================================================

function animateMoney(element, start, end, duration = 1200) {
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
// PLAYER NAMES
// =====================================================

document.querySelectorAll(".player").forEach((i, idx) => {
  i.oninput = () => {
    players[idx] = i.value || `Player ${idx + 1}`;
    render();
    recalc();
  };
});


// =====================================================
// HOLE DATA
// =====================================================

function H() {
  return holes[hole] ??= { wolf: 0, partner: null, mode: null, result: null };
}


// =====================================================
// RESULT SELECT
// =====================================================

function selectResult(btn, r) {
  btn.parentElement.querySelectorAll(".btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  H().result = r;
  recalc();
  if (hole < 18) nextHole();
}

function selectDump(btn) {
  if (H().partner === null) return;

  H().mode = "dump";
  H().result = null;

  document.querySelectorAll("#teamBtns .btn, #loneBtns .btn, #dumpBtns .btn, #blindBtns .btn")
    .forEach(b => b.classList.remove("selected"));

  updateUI();
  recalc();
}


// =====================================================
// SHOW RESULT BUTTONS
// =====================================================

function updateUI() {
  const mode = H().mode;

  teamBtns.classList.add("hidden");
  loneBtns.classList.add("hidden");
  dumpBtns.classList.add("hidden");
  blindBtns.classList.add("hidden");

  if (mode === "team") teamBtns.classList.remove("hidden");
  if (mode === "lone") loneBtns.classList.remove("hidden");
  if (mode === "blind") blindBtns.classList.remove("hidden");
  if (mode === "dump") dumpBtns.classList.remove("hidden");
}


// =====================================================
// HELPERS FOR NEW RULES
// =====================================================

// base = points per hole
// perPlayer = base/2 (team winners each get this)
function perPlayerPoints() {
  const base = +baseInput.value || 0;
  return base / 2;
}

// Get "win points" for lone/blind/dump based on toggle
function getSoloWinPoints(mode) {
  const baseUnit = perPlayerPoints(); // 1x unit = base/2

  if (mode === "lone") {
    if (loneUseMultiplier?.checked) return baseUnit * (+loneMultInput.value || 1);
    return +loneFixedInput.value || 0;
  }

  if (mode === "blind") {
    if (blindUseMultiplier?.checked) return baseUnit * (+blindMultInput.value || 1);
    return +blindFixedInput.value || 0;
  }

  if (mode === "dump") {
    if (dumpUseMultiplier?.checked) return baseUnit * (+dumpMultInput.value || 1);
    return +dumpFixedInput.value || 0;
  }

  return 0;
}

// Tie pot add amount (fixed OR multiplier)
// - Fixed: add tieSetPoints
// - Mult: add (base/2) * (tieMultiplier - 1)
function getTieAddAmount(stakeForHole) {
  if (tieUseMultiplier?.checked) {
    const tm = +tieMultiplier.value || 1;
    return stakeForHole * (tm - 1);
  }
  return +tieSetPoints.value || 0;
}


// =====================================================
// RECALC WITH PUSH POT
// =====================================================

function recalc() {
  totals = [0, 0, 0, 0];
  let carryover = 0;

  const orderedHoles = Object.keys(holes).map(n => +n).sort((a, b) => a - b);

  orderedHoles.forEach(holeNum => {
    const h = holes[holeNum];
    if (!h.result) return;

    const per = perPlayerPoints();

    let stakeForTie = per;
    if (h.mode === "lone" || h.mode === "blind" || h.mode === "dump") {
      stakeForTie = getSoloWinPoints(h.mode);
    }

    if (h.result === "push") {
      if (tieUseMultiplier?.checked) carryover += getTieAddAmount(stakeForTie);
      else carryover += +tieSetPoints.value || 0;
      return;
    }

    const pot = carryover;
    carryover = 0;

    // TEAM RESULTS
    if (h.result === "wolfTeam") {
      const potEach = pot / 2;
      totals[h.wolf] += per + potEach;
      totals[h.partner] += per + potEach;
      return;
    }

    if (h.result === "others") {
      const winners = [];
      players.forEach((_, i) => {
        if (i !== h.wolf && i !== h.partner) winners.push(i);
      });
      const potEach = winners.length ? pot / winners.length : 0;
      winners.forEach(i => { totals[i] += per + potEach; });
      return;
    }

    // LONE / BLIND RESULTS
    if (h.result === "loneWin") {
      const soloAmount = getSoloWinPoints(h.mode === "blind" ? "blind" : "lone");
      const others = [];
      players.forEach((_, i) => { if (i !== h.wolf) others.push(i); });

      totals[h.wolf] += (soloAmount * others.length) + pot;
      return;
    }

    if (h.result === "loneLose") {
      const soloAmount = getSoloWinPoints(h.mode === "blind" ? "blind" : "lone");
      const winners = [];
      players.forEach((_, i) => { if (i !== h.wolf) winners.push(i); });
      const potEach = winners.length ? pot / winners.length : 0;

      winners.forEach(i => { totals[i] += soloAmount + potEach; });
      return;
    }

    // DUMP RESULTS
    if (h.result === "dumpWin") {
      const soloAmount = getSoloWinPoints("dump");
      const dumpPlayer = h.partner;
      const others = [];
      players.forEach((_, i) => { if (i !== dumpPlayer) others.push(i); });

      totals[dumpPlayer] += (soloAmount * others.length) + pot;
      return;
    }

    if (h.result === "dumpLose") {
      const soloAmount = getSoloWinPoints("dump");
      const losersIndex = h.partner;
      const winners = [];
      players.forEach((_, i) => { if (i !== losersIndex) winners.push(i); });
      const potEach = winners.length ? pot / winners.length : 0;

      winners.forEach(i => { totals[i] += soloAmount + potEach; });
      return;
    }
  });

  currentPot = carryover;
  updatePotDisplay();
  updateTotals();
}


// =====================================================
// POT DISPLAY
// =====================================================

function updatePotDisplay() {
  if (currentPot > 0) {
    potValue.textContent = currentPot;
    potBanner.classList.remove("hidden");
  } else {
    potBanner.classList.add("hidden");
  }
}


// =====================================================
// RENDER
// =====================================================

function render() {
  holeTitle.innerText = `Hole ${hole}`;

  wolfSelect.innerHTML = players.map((p, i) => `<option value="${i}">${p}</option>`).join("");
  wolfSelect.value = H().wolf;

  const setupOptions = [`<option value="">-- Select Hole Setup --</option>`];

  players.forEach((p, i) => {
    if (i !== H().wolf) {
      setupOptions.push(`<option value="partner-${i}">Partner: ${p}</option>`);
    }
  });

  setupOptions.push(`<option value="lone">Lone Wolf</option>`);
  setupOptions.push(`<option value="blind">Blind Wolf</option>`);

  holeSetupSelect.innerHTML = setupOptions.join("");

  let currentSetupValue = "";
  if ((H().mode === "team" || H().mode === "dump") && H().partner !== null) {
    currentSetupValue = `partner-${H().partner}`;
  } else if (H().mode === "lone") {
    currentSetupValue = "lone";
  } else if (H().mode === "blind") {
    currentSetupValue = "blind";
  }

  holeSetupSelect.value = currentSetupValue;

  updateUI();
  updateTotals();
}

wolfSelect.onchange = () => {
  H().wolf = +wolfSelect.value;
  H().partner = null;
  H().mode = null;
  H().result = null;
  render();
  recalc();
};

holeSetupSelect.onchange = () => {
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
};

baseInput.oninput =
  loneMultInput.oninput =
  dumpMultInput.oninput =
  blindMultInput.oninput =
  dollarValueInput.oninput =
  loneFixedInput.oninput =
  dumpFixedInput.oninput =
  blindFixedInput.oninput =
  tieSetPoints.oninput =
  tieMultiplier.oninput = () => {
    syncToggleInputs();
    recalc();
  };


// =====================================================
// HOLE NAV
// =====================================================

function prevHole() {
  if (hole > 1) {
    hole--;
    render();
    recalc();
    hideResultsSummary();
  }
}

let currentWolfIndex = 0;

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
    if (hole === 19) showResultsSummary();
  }
}


// =====================================================
// SCOREBOARD
// =====================================================

function updateTotals() {
  const dollar = +dollarValueInput.value || 0;

  players.forEach((p, i) => {
    document.getElementById(`t${i}`).innerText = `${p}: ${totals[i]} pts`;
    const net = totals[i] * dollar;
    const moneyEl = document.getElementById(`m${i}`);
    moneyEl.innerText = (net >= 0 ? "+" : "-") + "$" + Math.abs(net).toFixed(2);
    moneyEl.style.color = net >= 0 ? "#359447" : "#d9534f";
  });
}


// =====================================================
// RESULTS SCREEN (HOLE 19)
// =====================================================

function hideResultsSummary() {
  const res = document.getElementById("resultsCard");
  if (res) res.style.display = "none";
  holeSetupCard.style.display = "block";
  holeNavCard.style.display = "flex";
}

function showResultsSummary() {
  holeSetupCard.style.display = "none";
  holeNavCard.style.display = "none";

  let resultsCard = document.getElementById("resultsCard");

  if (!resultsCard) {
    resultsCard = document.createElement("div");
    resultsCard.id = "resultsCard";
    resultsCard.className = "card game-card p-4 mb-3 text-center";
    selectionWrapper.appendChild(resultsCard);
  }

  const dollar = +dollarValueInput.value || 0;
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

  const saveBtn = document.getElementById("saveGameBtn");
  saveBtn.onclick = async () => {
    const user = firebase.auth().currentUser;
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
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

      alert("Game saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving game.");
    }
  };
}


// =====================================================
// CONFETTI
// =====================================================

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
  const duration = 5000;
  const end = Date.now() + duration;

  (function frame() {
    myConfetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 } });
    myConfetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
    else setTimeout(() => canvas.remove(), 1000);
  })();
}


// =====================================================
// WOLF RULES MODAL (content)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  syncToggleInputs();

  const openBtn = document.getElementById("wolfRulesBtn");
  const modal = document.getElementById("wolfRulesModal");
  const closeBtn = document.getElementById("closeWolfRulesBtn");
  const bodyEl = document.getElementById("wolfRulesBody");

  if (!openBtn || !modal || !closeBtn || !bodyEl) return;

bodyEl.innerHTML = `
<h5 class="mt-2">🐺 Wolf – Full Rules</h5>

<p>
Wolf is a 4-player golf betting game where one player becomes the <strong>Wolf</strong> each hole.
The Wolf decides whether to choose a partner or play the hole alone after watching tee shots.
Points are awarded based on the outcome of the hole.
</p>

<h5 class="mt-4">Rotation</h5>
<ul>
<li>The Wolf rotates each hole in order (Player 1 → Player 2 → Player 3 → Player 4).</li>
<li>After Player 4 is the Wolf, the rotation repeats.</li>
</ul>

<h5 class="mt-4">Points System</h5>
<ul>
<li><strong>Points Per Hole</strong> determines the total value of a hole.</li>
<li>When two players win together (team win), each player receives <strong>Points Per Hole ÷ 2</strong>.</li>
<li>Example: If the hole value is <strong>6 points</strong>, each winning team member earns <strong>3 points</strong>.</li>
</ul>

<h5 class="mt-4">Team Play</h5>
<ul>
<li>The Wolf watches the other players hit their tee shots.</li>
<li>The Wolf may choose one player as a <strong>partner</strong>.</li>
<li>The Wolf and partner play <strong>best ball</strong> against the other two players.</li>
<li>If the Wolf team wins, each player receives <strong>Points Per Hole ÷ 2</strong>.</li>
<li>If the other team wins, each of those players receives <strong>Points Per Hole ÷ 2</strong>.</li>
</ul>

<h5 class="mt-4">Lone Wolf</h5>
<ul>
<li>The Wolf may choose to play the hole alone against the other three players.</li>
<li>If the Wolf wins, they receive the configured Lone amount against all three opponents.</li>
<li>If the Wolf loses, the other three players each receive the configured Lone amount.</li>
</ul>

<h5 class="mt-4">Blind Wolf</h5>
<ul>
<li>The Wolf declares they are playing alone <strong>before any tee shots are hit</strong>.</li>
<li>This is riskier and usually pays more.</li>
<li>If the Wolf wins, they receive the configured Blind amount against all three opponents.</li>
<li>If the Wolf loses, the other three players each receive the configured Blind amount.</li>
</ul>

<h5 class="mt-4">Dump</h5>
<ul>
<li>If the chosen partner dumps the Wolf, use the <strong>Dump</strong> button.</li>
<li>The chosen player becomes the Dump player against the other three.</li>
<li>If Dump wins, the configured Dump amount is awarded against all three opponents.</li>
<li>If Dump loses, the other three players each receive the configured Dump amount.</li>
</ul>

<h5 class="mt-4">Push / Tie</h5>
<ul>
<li>If the hole is tied, it is recorded as a <strong>Push</strong>.</li>
<li>The hole value is added to a <strong>carryover pot</strong>.</li>
<li>The next hole winner receives the pot.</li>
<li>If a team wins the next hole, the pot is <strong>split between the two winners</strong>.</li>
<li>If a Lone, Blind, or Dump player wins the next hole, that player receives <strong>the entire pot</strong>.</li>
<li>If the solo player loses, the pot is <strong>split between the three winners</strong>.</li>
</ul>

<h5 class="mt-4">End of Game</h5>
<ul>
<li>The game is played for <strong>18 holes</strong>.</li>
<li>Total points are multiplied by <strong>$/Point</strong> to determine winnings.</li>
<li>The player with the highest total wins the round.</li>
</ul>
`;
});


// =====================================================
// INIT
// =====================================================

render();
recalc();