// =====================================================
// THE SCORECARD - GoodFlightGolf
// =====================================================

const gfgCourses = [
  {
    id: "oneka-ridge",
    name: "Oneka Ridge Golf Course",
    city: "White Bear Lake",
    state: "MN",
    tees: [
      { name: "Black", slope: 135, rating: 72.5 },
      { name: "Blue", slope: 130, rating: 71.2 },
      { name: "White", slope: 125, rating: 69.8 },
      { name: "Gold", slope: 120, rating: 67.5 }
    ],
    parTotal: 72,
    holes: [
      { hole: 1, par: 5 },
      { hole: 2, par: 4 },
      { hole: 3, par: 3 },
      { hole: 4, par: 5 },
      { hole: 5, par: 4 },
      { hole: 6, par: 3 },
      { hole: 7, par: 5 },
      { hole: 8, par: 4 },
      { hole: 9, par: 4 },
      { hole: 10, par: 4 },
      { hole: 11, par: 4 },
      { hole: 12, par: 3 },
      { hole: 13, par: 5 },
      { hole: 14, par: 4 },
      { hole: 15, par: 3 },
      { hole: 16, par: 4 },
      { hole: 17, par: 4 },
      { hole: 18, par: 5 }
    ]
  },
  {
    id: "pheasant-hills",
    name: "Pheasant Hills Golf Course",
    city: "Hammond",
    state: "WI",
    tees: [
      { name: "Black", slope: 133, rating: 72.0 },
      { name: "Blue", slope: 128, rating: 70.5 },
      { name: "White", slope: 123, rating: 69.0 },
      { name: "Gold", slope: 118, rating: 67.0 }
    ],
    parTotal: 72,
    holes: [
      { hole: 1, par: 4 },
      { hole: 2, par: 5 },
      { hole: 3, par: 4 },
      { hole: 4, par: 5 },
      { hole: 5, par: 4 },
      { hole: 6, par: 3 },
      { hole: 7, par: 4 },
      { hole: 8, par: 3 },
      { hole: 9, par: 4 },
      { hole: 10, par: 4 },
      { hole: 11, par: 4 },
      { hole: 12, par: 3 },
      { hole: 13, par: 5 },
      { hole: 14, par: 4 },
      { hole: 15, par: 4 },
      { hole: 16, par: 4 },
      { hole: 17, par: 3 },
      { hole: 18, par: 5 }
    ]
  },
  {
    id: "eagle-valley",
    name: "Eagle Valley Golf Course",
    city: "Woodbury",
    state: "MN",
    tees: [
      { name: "Black", slope: 134, rating: 72.3 },
      { name: "Blue", slope: 129, rating: 71.0 },
      { name: "White", slope: 124, rating: 69.6 },
      { name: "Gold", slope: 119, rating: 67.8 }
    ],
    parTotal: 72,
    holes: [
      { hole: 1, par: 5 },
      { hole: 2, par: 4 },
      { hole: 3, par: 4 },
      { hole: 4, par: 4 },
      { hole: 5, par: 3 },
      { hole: 6, par: 4 },
      { hole: 7, par: 3 },
      { hole: 8, par: 4 },
      { hole: 9, par: 4 },
      { hole: 10, par: 5 },
      { hole: 11, par: 4 },
      { hole: 12, par: 4 },
      { hole: 13, par: 3 },
      { hole: 14, par: 5 },
      { hole: 15, par: 4 },
      { hole: 16, par: 3 },
      { hole: 17, par: 5 },
      { hole: 18, par: 4 }
    ]
  },
  {
    id: "custom-course",
    name: "Course Not Listed",
    city: "",
    state: "",
    tees: [],
    parTotal: 72,
    holes: []
  }
];

function $(id) {
  return document.getElementById(id);
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(max, num));
}

function formatVsPar(value) {
  if (value === 0) return "E";
  return value > 0 ? `+${value}` : `${value}`;
}

function resultLabelFromDiff(diff) {
  if (diff <= -3) return "Albatross+";
  if (diff === -2) return "Eagle";
  if (diff === -1) return "Birdie";
  if (diff === 0) return "Par";
  if (diff === 1) return "Bogey";
  if (diff === 2) return "Double";
  return `+${diff}`;
}

function isCustomCourse() {
  return currentCourseId === "custom-course";
}

const courseSelect = $("courseSelect");
const roundDate = $("roundDate");
const teeName = $("teeName");
const roundNotes = $("roundNotes");

const listedTeeWrap = $("listedTeeWrap");
const customCourseWrap = $("customCourseWrap");
const customCourseName = $("customCourseName");
const customTeeName = $("customTeeName");
const customCourseRating = $("customCourseRating");
const customSlopeRating = $("customSlopeRating");
const customParWrap = $("customParWrap");
const holeParSelect = $("holeParSelect");

const fullscreenBtn = $("fullscreenBtn");
const selectionWrapper = $("selectionWrapper");
const body = document.body;

const prevHoleBtn = $("prevHoleBtn");
const nextHoleBtn = $("nextHoleBtn");

const holeTitle = $("holeTitle");
const holeMeta = $("holeMeta");

const strokesMinus = $("strokesMinus");
const strokesPlus = $("strokesPlus");
const puttsMinus = $("puttsMinus");
const puttsPlus = $("puttsPlus");
const strokesValue = $("strokesValue");
const puttsValue = $("puttsValue");

const driveSelect = $("driveSelect");
const approachSelect = $("approachSelect");

const bunkerMinus = $("bunkerMinus");
const bunkerPlus = $("bunkerPlus");
const penaltyMinus = $("penaltyMinus");
const penaltyPlus = $("penaltyPlus");
const bunkerValue = $("bunkerValue");
const penaltyValue = $("penaltyValue");

const holeParValue = $("holeParValue");
const holeResultValue = $("holeResultValue");
const holeFirValue = $("holeFirValue");
const holeGirValue = $("holeGirValue");
const holeThreePuttValue = $("holeThreePuttValue");
const holePenaltyValue = $("holePenaltyValue");
const holeBunkerValue = $("holeBunkerValue");
const holePuttsSummaryValue = $("holePuttsSummaryValue");

const sumThru = $("sumThru");
const sumScore = $("sumScore");
const sumVsPar = $("sumVsPar");
const sumPutts = $("sumPutts");
const sumFir = $("sumFir");
const sumGir = $("sumGir");

const resultsCard = $("resultsCard");
const holeSetupCard = $("holeSetupCard");
const holeNavCard = $("holeNavCard");
const scoreboardCard = $("scoreboardCard");

let currentHole = 1;
let currentCourseId = "oneka-ridge";
let holes = {};

function createHoleData() {
  return {
    strokes: 4,
    putts: 2,
    drive: "",
    approach: "",
    bunker: 0,
    penalty: 0,
    customPar: 4
  };
}

function H(holeNumber = currentHole) {
  if (!holes[holeNumber]) {
    holes[holeNumber] = createHoleData();
  }
  return holes[holeNumber];
}

function getCurrentCourse() {
  return gfgCourses.find(course => course.id === currentCourseId) || gfgCourses[0];
}

function getSelectedTee() {
  const course = getCurrentCourse();

  if (isCustomCourse()) {
    return {
      name: customTeeName?.value || "White",
      slope: Number(customSlopeRating?.value) || 113,
      rating: Number(customCourseRating?.value) || 72
    };
  }

  return course.tees.find(tee => tee.name === teeName.value) || course.tees[0];
}

function getCourseDisplayName() {
  if (isCustomCourse()) {
    return customCourseName?.value?.trim() || "Custom Course";
  }

  return getCurrentCourse().name;
}

function getHolePar(holeNumber = currentHole) {
  if (isCustomCourse()) {
    return Number(H(holeNumber).customPar) || 4;
  }

  const course = getCurrentCourse();
  return course.holes[holeNumber - 1]?.par || 4;
}

function allHoleNumbers() {
  return Array.from({ length: 18 }, (_, index) => index + 1);
}

function isHoleActive(holeNumber) {
  const hole = H(holeNumber);

  return (
    hole.strokes !== 4 ||
    hole.putts !== 2 ||
    hole.drive !== "" ||
    hole.approach !== "" ||
    hole.bunker > 0 ||
    hole.penalty > 0 ||
    (isCustomCourse() && hole.customPar !== 4)
  );
}

function getCountedHoleNumbers() {
  const all = allHoleNumbers();

  if (!resultsCard?.classList.contains("hidden")) {
    return all;
  }

  return all.filter((holeNumber) => holeNumber <= currentHole);
}

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

function populateCourseSelect() {
  if (!courseSelect) return;

  courseSelect.innerHTML = gfgCourses
    .map(course => `<option value="${course.id}">${course.name}</option>`)
    .join("");

  courseSelect.value = currentCourseId;
}

function populateTeeSelect() {
  if (!teeName || isCustomCourse()) return;

  const course = getCurrentCourse();
  const tees = course.tees || [];

  teeName.innerHTML = tees
    .map(tee => `<option value="${tee.name}">${tee.name} (${tee.rating} / ${tee.slope})</option>`)
    .join("");

  const defaultTee = tees.find(tee => tee.name === "White") || tees[0];
  if (defaultTee) {
    teeName.value = defaultTee.name;
  }
}

function updateCourseModeUI() {
  const custom = isCustomCourse();

  customCourseWrap?.classList.toggle("hidden", !custom);
  customParWrap?.classList.toggle("hidden", !custom);

  if (listedTeeWrap) {
    listedTeeWrap.style.display = custom ? "none" : "block";
  }
}

function resetRoundForCourse() {
  currentHole = 1;
  holes = {};

  allHoleNumbers().forEach(holeNumber => {
    holes[holeNumber] = createHoleData();
  });

  hideResultsSummary();
  updateCourseModeUI();
  render();
  recalc();
}

function getHoleComputed(holeNumber) {
  const holeData = H(holeNumber);
  const par = getHolePar(holeNumber);
  const diff = holeData.strokes - par;

  const firEligible = par >= 4;
  let fir = null;

  if (firEligible) {
    if (holeData.drive === "fairway") fir = true;
    else if (holeData.drive === "none" || holeData.drive === "") fir = null;
    else fir = false;
  }

  const gir = holeData.approach === "green";
  const threePutt = holeData.putts >= 3;

  return {
    par,
    diff,
    resultLabel: resultLabelFromDiff(diff),
    fir,
    gir,
    threePutt
  };
}

function getRoundSummary() {
  let totalStrokes = 0;
  let totalPutts = 0;
  let totalPar = 0;
  let penalties = 0;
  let bunkers = 0;

  let firHits = 0;
  let firChances = 0;
  let girHits = 0;

  const driveCounts = {
    fairway: 0,
    left: 0,
    right: 0,
    bunker: 0,
    penalty: 0,
    none: 0
  };

  const approachCounts = {
    green: 0,
    short: 0,
    long: 0,
    left: 0,
    right: 0,
    bunker: 0
  };

  const holesToCount = getCountedHoleNumbers();

  holesToCount.forEach(holeNumber => {
    const holeData = H(holeNumber);
    const computed = getHoleComputed(holeNumber);
    const par = getHolePar(holeNumber);

    totalStrokes += holeData.strokes;
    totalPutts += holeData.putts;
    totalPar += par;

    penalties += holeData.penalty || 0;
    bunkers += holeData.bunker || 0;

    if (computed.fir !== null) {
      firChances += 1;
      if (computed.fir) firHits += 1;
    }

    if (computed.gir) {
      girHits += 1;
    }

    if (holeData.drive && driveCounts[holeData.drive] !== undefined) {
      driveCounts[holeData.drive] += 1;
    }

    if (holeData.approach && approachCounts[holeData.approach] !== undefined) {
      approachCounts[holeData.approach] += 1;
    }
  });

  const vsPar = totalStrokes - totalPar;
  const firPct = firChances ? Math.round((firHits / firChances) * 100) : 0;
  const girPct = holesToCount.length ? Math.round((girHits / holesToCount.length) * 100) : 0;

  return {
    totalStrokes,
    totalPutts,
    totalPar,
    vsPar,
    penalties,
    bunkers,
    firHits,
    firChances,
    firPct,
    girHits,
    girPct,
    driveCounts,
    approachCounts,
    holesCounted: holesToCount.length
  };
}

function getTopMiss(counts, excludeKeys = []) {
  let bestKey = "";
  let bestVal = -1;

  Object.entries(counts).forEach(([key, value]) => {
    if (excludeKeys.includes(key)) return;
    if (value > bestVal) {
      bestKey = key;
      bestVal = value;
    }
  });

  return { key: bestKey, value: bestVal };
}

function buildFeedback(summary) {
  const lines = [];

  if (summary.totalPutts <= 32 && summary.holesCounted > 0) {
    lines.push("Putting looked strong. You kept the total putts in a solid range.");
  } else if (summary.totalPutts >= 36) {
    lines.push("Putting may have cost you shots today. The putt total suggests room to clean up speed or first-putt proximity.");
  } else {
    lines.push("Putting was fairly neutral today. Not a disaster, but there is still room to tighten it up.");
  }

  if (summary.penalties === 0) {
    lines.push("You avoided penalties, which is a huge win and usually one of the fastest ways to lower scores.");
  } else {
    lines.push(`Penalty strokes totaled ${summary.penalties}. Cleaning that up could save shots fast.`);
  }

  if (summary.firPct >= 55) {
    lines.push("You drove it well enough to give yourself chances. Fairway percentage was solid.");
  } else {
    lines.push("Off-the-tee accuracy looks like a clear feedback point from this round.");
  }

  if (summary.girPct >= 45) {
    lines.push("Approach play looks like a strength from this round based on greens hit.");
  } else {
    lines.push("Approach shots were likely the biggest place to gain strokes today based on GIR.");
  }

  const topDriveMiss = getTopMiss(summary.driveCounts, ["fairway", "none"]);
  if (topDriveMiss.value > 0) {
    lines.push(`Your most common tee-shot miss was ${topDriveMiss.key}.`);
  }

  const topApproachMiss = getTopMiss(summary.approachCounts, ["green"]);
  if (topApproachMiss.value > 0) {
    lines.push(`Your most common approach miss was ${topApproachMiss.key}.`);
  }

  return lines;
}

function updateCounters() {
  const hole = H();

  if (strokesValue) strokesValue.textContent = hole.strokes;
  if (puttsValue) puttsValue.textContent = hole.putts;
  if (bunkerValue) bunkerValue.textContent = hole.bunker;
  if (penaltyValue) penaltyValue.textContent = hole.penalty;
}

function updateHoleMeta() {
  const par = getHolePar();
  const selectedTee = getSelectedTee();
  const courseName = getCourseDisplayName();

  if (holeTitle) holeTitle.textContent = `Hole ${currentHole}`;
  if (holeMeta) {
    holeMeta.textContent = `${courseName} - ${selectedTee.name} Tees - Par ${par}`;
  }
}

function updateSelects() {
  const hole = H();

  if (driveSelect) driveSelect.value = hole.drive || "";
  if (approachSelect) approachSelect.value = hole.approach || "";

  if (holeParSelect && isCustomCourse()) {
    holeParSelect.value = String(hole.customPar || 4);
  }
}

function updateHoleSummary() {
  const hole = H();
  const computed = getHoleComputed(currentHole);

  if (holeParValue) holeParValue.textContent = computed.par;
  if (holeResultValue) holeResultValue.textContent = computed.resultLabel;
  if (holeFirValue) holeFirValue.textContent = computed.fir === null ? "-" : (computed.fir ? "Yes" : "No");
  if (holeGirValue) holeGirValue.textContent = computed.gir ? "Yes" : "No";
  if (holeThreePuttValue) holeThreePuttValue.textContent = computed.threePutt ? "Yes" : "No";
  if (holePenaltyValue) holePenaltyValue.textContent = hole.penalty;
  if (holeBunkerValue) holeBunkerValue.textContent = hole.bunker;
  if (holePuttsSummaryValue) holePuttsSummaryValue.textContent = hole.putts;
}

function updateScoreboard() {
  const summary = getRoundSummary();

  if (sumThru) sumThru.textContent = summary.holesCounted;
  if (sumScore) sumScore.textContent = summary.totalStrokes;
  if (sumVsPar) sumVsPar.textContent = formatVsPar(summary.vsPar);
  if (sumPutts) sumPutts.textContent = summary.totalPutts;
  if (sumFir) sumFir.textContent = `${summary.firPct}%`;
  if (sumGir) sumGir.textContent = `${summary.girPct}%`;
}

function render() {
  updateCourseModeUI();
  updateHoleMeta();
  updateCounters();
  updateSelects();
  updateHoleSummary();
  updateScoreboard();

  if (nextHoleBtn) {
    nextHoleBtn.textContent = currentHole < 18 ? "Next >" : "Finish Round";
  }
}

function recalc() {
  updateHoleSummary();
  updateScoreboard();
}

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
  const duration = 4200;
  const end = Date.now() + duration;

  (function frame() {
    myConfetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 } });
    myConfetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 } });
    if (Date.now() < end) requestAnimationFrame(frame);
    else setTimeout(() => canvas.remove(), 900);
  })();
}

function hideResultsSummary() {
  if (resultsCard) {
    resultsCard.classList.add("hidden");
    resultsCard.innerHTML = "";
  }

  if (holeSetupCard) holeSetupCard.style.display = "block";
  if (holeNavCard) holeNavCard.style.display = "block";
  if (scoreboardCard) scoreboardCard.style.display = "block";
}

async function saveRoundToAccount(statusEl) {
  if (statusEl) statusEl.textContent = "";

  const user = firebase?.auth?.().currentUser;
  if (!user) {
    if (statusEl) statusEl.textContent = "Please log in to save your round.";
    return;
  }

  const course = getCurrentCourse();
  const selectedTee = getSelectedTee();
  const summary = getRoundSummary();
  const courseName = getCourseDisplayName();

  const handicapDifferential = Number(
    (((summary.totalStrokes - (selectedTee?.rating || 72)) * 113) / (selectedTee?.slope || 113)).toFixed(1)
  );

  const roundPayload = {
    roundType: "scoretracker",
    courseId: course.id,
    courseName,
    city: isCustomCourse() ? "" : course.city,
    state: isCustomCourse() ? "" : course.state,
    teeName: selectedTee?.name || "White",
    teeSlope: selectedTee?.slope || 113,
    teeRating: selectedTee?.rating || 72,
    handicapDifferential,
    isCustomCourse: isCustomCourse(),
    customCourseName: isCustomCourse() ? (customCourseName?.value?.trim() || "") : "",
    customTeeName: isCustomCourse() ? (customTeeName?.value || "") : "",
    customSlopeRating: isCustomCourse() ? (Number(customSlopeRating?.value) || 113) : null,
    customCourseRating: isCustomCourse() ? (Number(customCourseRating?.value) || 72) : null,
    roundDate: roundDate?.value || new Date().toISOString().slice(0, 10),
    roundNotes: roundNotes?.value?.trim() || "",
    totalScore: summary.totalStrokes,
    totalPar: summary.totalPar,
    vsPar: summary.vsPar,
    totalPutts: summary.totalPutts,
    firHits: summary.firHits,
    firChances: summary.firChances,
    firPct: summary.firPct,
    girHits: summary.girHits,
    girPct: summary.girPct,
    penalties: summary.penalties,
    bunkers: summary.bunkers,
    holes: allHoleNumbers().map((holeNumber) => {
      const holeData = H(holeNumber);
      const computed = getHoleComputed(holeNumber);

      return {
        hole: holeNumber,
        par: computed.par,
        customPar: holeData.customPar,
        strokes: holeData.strokes,
        putts: holeData.putts,
        drive: holeData.drive || "",
        approach: holeData.approach || "",
        bunker: holeData.bunker,
        penalty: holeData.penalty,
        fir: computed.fir,
        gir: computed.gir,
        threePutt: computed.threePutt,
        resultLabel: computed.resultLabel,
        diff: computed.diff,
        isActive: isHoleActive(holeNumber)
      };
    }),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    await firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .collection("savedRounds")
      .add(roundPayload);

    if (statusEl) statusEl.textContent = "Round saved to your account!";
  } catch (error) {
    console.error(error);
    if (statusEl) statusEl.textContent = "Error saving round.";
  }
}

function showResultsSummary() {
  const summary = getRoundSummary();
  const courseName = getCourseDisplayName();
  const insights = buildFeedback(summary);

  if (holeSetupCard) holeSetupCard.style.display = "none";
  if (holeNavCard) holeNavCard.style.display = "none";
  if (scoreboardCard) scoreboardCard.style.display = "none";

  if (!resultsCard) return;

  resultsCard.className = "card game-card p-4 mb-3";
  resultsCard.classList.remove("hidden");
  resultsCard.innerHTML = `
    <h2 class="text-center mb-3">Round Complete!</h2>

    <div class="row g-3 mb-3">
      <div class="col-6 col-md-3">
        <div class="round-finish-pill">
          <div class="small">Course</div>
          <div class="fw-bold">${courseName}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="round-finish-pill">
          <div class="small">Score</div>
          <div class="fw-bold">${summary.totalStrokes}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="round-finish-pill">
          <div class="small">vs Par</div>
          <div class="fw-bold">${formatVsPar(summary.vsPar)}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="round-finish-pill">
          <div class="small">Putts</div>
          <div class="fw-bold">${summary.totalPutts}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="round-finish-pill">
          <div class="small">FIR</div>
          <div class="fw-bold">${summary.firHits}/${summary.firChances} (${summary.firPct}%)</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="round-finish-pill">
          <div class="small">GIR</div>
          <div class="fw-bold">${summary.girHits}/${summary.holesCounted || 18} (${summary.girPct}%)</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="round-finish-pill">
          <div class="small">Penalty Strokes</div>
          <div class="fw-bold">${summary.penalties}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="round-finish-pill">
          <div class="small">Bunker Shots</div>
          <div class="fw-bold">${summary.bunkers}</div>
        </div>
      </div>
    </div>

    <div class="card p-3 mb-3 round-feedback-card">
      <h5 class="mb-2">Round Feedback</h5>
      <div id="resultsFeedbackInsights">
        ${insights.map((line) => `<div class="insight-line">${line}</div>`).join("")}
      </div>
    </div>

    <div class="round-results-actions">
      <p class="round-results-actions__title">What do you want to do with this round?</p>
      <div class="round-results-actions__buttons">
        <button id="resultsSaveRoundBtn" class="gfg-pill-btn round-results-btn" type="button">Save Round</button>
        <button id="resultsStartNewRoundBtn" class="gfg-pill-btn round-results-btn" type="button">Start New Round</button>
        <a href="../playerlog.html" class="gfg-pill-btn round-results-btn">Back to MyFlight</a>
      </div>
    </div>

    <div id="resultsSaveRoundStatus" class="text-center mt-3 fw-bold"></div>
  `;

  const resultsSaveRoundBtn = document.getElementById("resultsSaveRoundBtn");
  const resultsStartNewRoundBtn = document.getElementById("resultsStartNewRoundBtn");
  const resultsSaveRoundStatus = document.getElementById("resultsSaveRoundStatus");

  if (resultsStartNewRoundBtn) {
    resultsStartNewRoundBtn.onclick = () => {
      if (resultsSaveRoundStatus) resultsSaveRoundStatus.textContent = "";
      resetRoundForCourse();
    };
  }

  if (resultsSaveRoundBtn) {
    resultsSaveRoundBtn.onclick = async () => {
      await saveRoundToAccount(resultsSaveRoundStatus);
    };
  }

  runConfetti();
  resultsCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

courseSelect?.addEventListener("change", () => {
  currentCourseId = courseSelect.value;
  if (!isCustomCourse()) populateTeeSelect();
  resetRoundForCourse();
});

teeName?.addEventListener("change", render);

customCourseName?.addEventListener("input", render);
customTeeName?.addEventListener("change", render);
customCourseRating?.addEventListener("input", render);
customSlopeRating?.addEventListener("input", render);

holeParSelect?.addEventListener("change", () => {
  H().customPar = Number(holeParSelect.value) || 4;
  render();
});

strokesMinus?.addEventListener("click", () => {
  H().strokes = clamp(H().strokes - 1, 1, 15);
  render();
});

strokesPlus?.addEventListener("click", () => {
  H().strokes = clamp(H().strokes + 1, 1, 15);
  render();
});

puttsMinus?.addEventListener("click", () => {
  H().putts = clamp(H().putts - 1, 0, 10);
  render();
});

puttsPlus?.addEventListener("click", () => {
  H().putts = clamp(H().putts + 1, 0, 10);
  render();
});

bunkerMinus?.addEventListener("click", () => {
  H().bunker = clamp(H().bunker - 1, 0, 10);
  render();
});

bunkerPlus?.addEventListener("click", () => {
  H().bunker = clamp(H().bunker + 1, 0, 10);
  render();
});

penaltyMinus?.addEventListener("click", () => {
  H().penalty = clamp(H().penalty - 1, 0, 10);
  render();
});

penaltyPlus?.addEventListener("click", () => {
  H().penalty = clamp(H().penalty + 1, 0, 10);
  render();
});

driveSelect?.addEventListener("change", () => {
  H().drive = driveSelect.value;
  recalc();
});

approachSelect?.addEventListener("change", () => {
  H().approach = approachSelect.value;
  recalc();
});

prevHoleBtn?.addEventListener("click", () => {
  if (currentHole > 1) {
    currentHole -= 1;
    hideResultsSummary();
    render();
  }
});

nextHoleBtn?.addEventListener("click", () => {
  if (currentHole < 18) {
    currentHole += 1;
    hideResultsSummary();
    render();
  } else {
    showResultsSummary();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  populateCourseSelect();
  populateTeeSelect();

  if (roundDate) {
    roundDate.value = new Date().toISOString().slice(0, 10);
  }

  allHoleNumbers().forEach(holeNumber => {
    holes[holeNumber] = createHoleData();
  });

  render();
});
