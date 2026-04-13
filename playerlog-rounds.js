// =====================================================
// MYFLIGHT - SAVED ROUND DATA + COURSE DATA
// =====================================================

const savedRoundsLoggedIn = document.getElementById("savedRoundsLoggedIn");
const savedRoundsList = document.getElementById("savedRoundsList");
const roundsSavedCount = document.getElementById("roundsSavedCount");
const latestDifferential = document.getElementById("latestDifferential");
const handicapPreview = document.getElementById("handicapPreview");

const courseDataLoggedIn = document.getElementById("courseDataLoggedIn");
const totalThruValue = document.getElementById("totalThruValue");
const avgScoreValue = document.getElementById("avgScoreValue");
const totalVsParValue = document.getElementById("totalVsParValue");
const avgPuttsValue = document.getElementById("avgPuttsValue");
const avgFirValue = document.getElementById("avgFirValue");
const avgGirValue = document.getElementById("avgGirValue");

const gameTotalsLoggedIn = document.getElementById("gameTotalsLoggedIn");
const gamesPlayedLoggedIn = document.getElementById("gamesPlayedLoggedIn");
const loginToUseGameData = document.getElementById("loginToUseGameData");
const savedGameDataShell = document.getElementById("savedGameDataShell");

const loginToUsePlayerData = document.getElementById("loginToUsePlayerData");
const playerDataShell = document.getElementById("playerDataShell");

function formatVsPar(value) {
  if (value === 0) return "E";
  return value > 0 ? `+${value}` : `${value}`;
}

function formatRoundDate(dateStr) {
  if (!dateStr) return "Unknown date";

  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString();
}

function getHandicapPreview(rounds) {
  const diffs = rounds
    .map(round => typeof round.handicapDifferential === "number" ? round.handicapDifferential : null)
    .filter(value => value !== null)
    .sort((a, b) => a - b);

  if (!diffs.length) return null;

  const sample = diffs.slice(0, Math.min(3, diffs.length));
  const average = sample.reduce((sum, value) => sum + value, 0) / sample.length;
  return Number(average.toFixed(1));
}

function getRoundHolesCount(round) {
  if (Array.isArray(round.holes) && round.holes.length) {
    const activeCount = round.holes.filter(hole => hole && hole.isActive !== false).length;
    return activeCount || round.holes.length;
  }

  if (typeof round.holesCounted === "number" && round.holesCounted > 0) {
    return round.holesCounted;
  }

  return 18;
}

function renderSavedRounds(rounds) {
  if (!savedRoundsList) return;

  if (!rounds.length) {
    savedRoundsList.innerHTML = `
      <div class="card">
        <div class="card-body">
          <p class="mb-0">No saved rounds yet. Finish a round in the Round Tracker and save it on the 19th Hole to see it here.</p>
        </div>
      </div>
    `;
    return;
  }

  savedRoundsList.innerHTML = rounds.map(round => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h5 class="mb-1">${round.courseName || "Unknown Course"}</h5>
            <div class="text-muted small">
              ${formatRoundDate(round.roundDate)} • ${round.teeName || "Tee not saved"}
            </div>
          </div>
          <div class="text-end">
            <div class="small text-muted">Round</div>
            <div class="fw-bold">${round.roundType === "scoretracker" ? "Round Tracker" : "Saved Round"}</div>
          </div>
        </div>

        <div class="row g-2 text-center">
          <div class="col-6 col-md-3">
            <div class="border rounded p-2 h-100">
              <div class="small text-muted">Total</div>
              <div class="fw-bold">${round.totalScore ?? 0}</div>
            </div>
          </div>

          <div class="col-6 col-md-3">
            <div class="border rounded p-2 h-100">
              <div class="small text-muted">vs Par</div>
              <div class="fw-bold">${typeof round.vsPar === "number" ? formatVsPar(round.vsPar) : "E"}</div>
            </div>
          </div>

          <div class="col-6 col-md-2">
            <div class="border rounded p-2 h-100">
              <div class="small text-muted">Putts</div>
              <div class="fw-bold">${round.totalPutts ?? 0}</div>
            </div>
          </div>

          <div class="col-6 col-md-2">
            <div class="border rounded p-2 h-100">
              <div class="small text-muted">FIR</div>
              <div class="fw-bold">${round.firPct ?? 0}%</div>
            </div>
          </div>

          <div class="col-6 col-md-2">
            <div class="border rounded p-2 h-100">
              <div class="small text-muted">GIR</div>
              <div class="fw-bold">${round.girPct ?? 0}%</div>
            </div>
          </div>
        </div>

        ${round.roundNotes ? `<p class="mt-3 mb-0"><strong>Notes:</strong> ${round.roundNotes}</p>` : ""}
      </div>
    </div>
  `).join("");
}

function renderCourseData(rounds) {
  if (!courseDataLoggedIn) return;

  if (!rounds.length) {
    if (totalThruValue) totalThruValue.textContent = "0";
    if (avgScoreValue) avgScoreValue.textContent = "0";
    if (totalVsParValue) totalVsParValue.textContent = "E";
    if (avgPuttsValue) avgPuttsValue.textContent = "0";
    if (avgFirValue) avgFirValue.textContent = "0%";
    if (avgGirValue) avgGirValue.textContent = "0%";
    return;
  }

  const totals = rounds.reduce((acc, round) => {
    acc.thru += getRoundHolesCount(round);
    acc.score += Number(round.totalScore) || 0;
    acc.vsPar += Number(round.vsPar) || 0;
    acc.putts += Number(round.totalPutts) || 0;
    acc.firHits += Number(round.firHits) || 0;
    acc.firChances += Number(round.firChances) || 0;
    acc.girHits += Number(round.girHits) || 0;
    return acc;
  }, {
    thru: 0,
    score: 0,
    vsPar: 0,
    putts: 0,
    firHits: 0,
    firChances: 0,
    girHits: 0
  });

  const firPct = totals.firChances ? Math.round((totals.firHits / totals.firChances) * 100) : 0;
  const girPct = totals.thru ? Math.round((totals.girHits / totals.thru) * 100) : 0;

  if (totalThruValue) totalThruValue.textContent = String(totals.thru);
  if (avgScoreValue) avgScoreValue.textContent = String(totals.score);
  if (totalVsParValue) totalVsParValue.textContent = formatVsPar(totals.vsPar);
  if (avgPuttsValue) avgPuttsValue.textContent = String(totals.putts);
  if (avgFirValue) avgFirValue.textContent = `${firPct}%`;
  if (avgGirValue) avgGirValue.textContent = `${girPct}%`;
}

async function loadSavedRounds(uid) {
  try {
    const snap = await firebase.firestore()
      .collection("users")
      .doc(uid)
      .collection("savedRounds")
      .orderBy("roundDate", "desc")
      .get();

    const rounds = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (roundsSavedCount) roundsSavedCount.textContent = String(rounds.length);

    if (latestDifferential) {
      const latest = rounds.find(round => typeof round.handicapDifferential === "number");
      latestDifferential.textContent = latest ? latest.handicapDifferential.toFixed(1) : "—";
    }

    if (handicapPreview) {
      const preview = getHandicapPreview(rounds);
      handicapPreview.textContent = preview !== null ? preview.toFixed(1) : "—";
    }

    renderSavedRounds(rounds);
    renderCourseData(rounds);
  } catch (error) {
    console.error("Error loading saved rounds:", error);

    if (savedRoundsList) {
      savedRoundsList.innerHTML = `
        <div class="card">
          <div class="card-body text-danger">
            Error loading saved rounds.
          </div>
        </div>
      `;
    }
  }
}

function updatePlayerDataLock(user) {
  const loggedIn = !!user;

  if (savedRoundsLoggedIn) savedRoundsLoggedIn.classList.toggle("d-none", !loggedIn);
  if (courseDataLoggedIn) courseDataLoggedIn.classList.toggle("d-none", !loggedIn);
  if (loginToUsePlayerData) loginToUsePlayerData.classList.toggle("d-none", loggedIn);
  if (playerDataShell) playerDataShell.classList.toggle("is-locked", !loggedIn);
}

function updateGameDataLock(user) {
  const loggedIn = !!user;

  if (gameTotalsLoggedIn) gameTotalsLoggedIn.classList.toggle("d-none", !loggedIn);
  if (gamesPlayedLoggedIn) gamesPlayedLoggedIn.classList.toggle("d-none", !loggedIn);
  if (loginToUseGameData) loginToUseGameData.classList.toggle("d-none", loggedIn);
  if (savedGameDataShell) savedGameDataShell.classList.toggle("is-locked", !loggedIn);
}

firebase.auth().onAuthStateChanged(user => {
  updatePlayerDataLock(user);
  updateGameDataLock(user);

  if (!user) return;

  loadSavedRounds(user.uid);
});
