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
      { hole: 3, par: 4 },
      { hole: 4, par: 3 },
      { hole: 5, par: 5 },
      { hole: 6, par: 4 },
      { hole: 7, par: 4 },
      { hole: 8, par: 4 },
      { hole: 9, par: 3 },
      { hole: 10, par: 4 },
      { hole: 11, par: 3 },
      { hole: 12, par: 4 },
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
    id: "river-falls-golf-club",
    name: "River Falls Golf Club",
    city: "River Falls",
    state: "WI",
    tees: [
      { name: "Blue", slope: 127, rating: 71.6 },
      { name: "Blue/White", slope: 124, rating: 70.2 },
      { name: "White", slope: 117, rating: 68.9 },
      { name: "White/Gold", slope: 114, rating: 67.7 },
      { name: "Gold", slope: 111, rating: 66.5 }
    ],
    parTotal: 71,
    holes: [
      { hole: 1, par: 4 },
      { hole: 2, par: 3 },
      { hole: 3, par: 4 },
      { hole: 4, par: 4 },
      { hole: 5, par: 4 },
      { hole: 6, par: 3 },
      { hole: 7, par: 4 },
      { hole: 8, par: 4 },
      { hole: 9, par: 5 },
      { hole: 10, par: 4 },
      { hole: 11, par: 3 },
      { hole: 12, par: 5 },
      { hole: 13, par: 4 },
      { hole: 14, par: 4 },
      { hole: 15, par: 5 },
      { hole: 16, par: 3 },
      { hole: 17, par: 4 },
      { hole: 18, par: 4 }
    ]
  },
  {
    id: "manitou-ridge",
    name: "Manitou Ridge Golf Course",
    city: "White Bear Lake",
    state: "MN",
    tees: [
      { name: "Black", slope: 127, rating: 70.7 },
      { name: "White", slope: 121, rating: 69.1 },
      { name: "Orange", slope: 118, rating: 68.2 },
      { name: "Silver", slope: 115, rating: 66.5 }
    ],
    parTotal: 71,
    holes: [
      { hole: 1, par: 4 },
      { hole: 2, par: 4 },
      { hole: 3, par: 4 },
      { hole: 4, par: 4 },
      { hole: 5, par: 5 },
      { hole: 6, par: 4 },
      { hole: 7, par: 3 },
      { hole: 8, par: 4 },
      { hole: 9, par: 4 },
      { hole: 10, par: 3 },
      { hole: 11, par: 4 },
      { hole: 12, par: 4 },
      { hole: 13, par: 3 },
      { hole: 14, par: 4 },
      { hole: 15, par: 4 },
      { hole: 16, par: 5 },
      { hole: 17, par: 3 },
      { hole: 18, par: 5 }
    ]
  },
  {
    id: "keller-golf-course",
    name: "Keller Golf Course",
    city: "Maplewood",
    state: "MN",
    tees: [
      { name: "Black", slope: 133, rating: 72.2 },
      { name: "Blue", slope: 131, rating: 70.0 },
      { name: "Blue/White", slope: 128, rating: 67.9 },
      { name: "White", slope: 123, rating: 66.2 },
      { name: "Green", slope: 118, rating: 63.8 }
    ],
    parTotal: 72,
    holes: [
      { hole: 1, par: 4 },
      { hole: 2, par: 4 },
      { hole: 3, par: 5 },
      { hole: 4, par: 3 },
      { hole: 5, par: 4 },
      { hole: 6, par: 3 },
      { hole: 7, par: 4 },
      { hole: 8, par: 4 },
      { hole: 9, par: 4 },
      { hole: 10, par: 5 },
      { hole: 11, par: 4 },
      { hole: 12, par: 5 },
      { hole: 13, par: 3 },
      { hole: 14, par: 4 },
      { hole: 15, par: 3 },
      { hole: 16, par: 5 },
      { hole: 17, par: 4 },
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
const roundSessionModalEl = $("roundSessionModal");
const openRoundSessionModalBtn = $("openRoundSessionModalBtn");
const sessionModeSelect = $("sessionModeSelect");
const linkedGameTypeWrap = $("linkedGameTypeWrap");
const linkedGameTypeSelect = $("linkedGameTypeSelect");
const saveRoundSessionBtn = $("saveRoundSessionBtn");
const launchLinkedGameBtn = $("launchLinkedGameBtn");
const continueLinkedGameBtn = $("continueLinkedGameBtn");
const clearRoundSessionBtn = $("clearRoundSessionBtn");
const roundSessionStatus = $("roundSessionStatus");
const sessionChoiceButtons = Array.from(document.querySelectorAll("[data-session-choice]"));
const linkedGameButtons = Array.from(document.querySelectorAll("[data-linked-game]"));
const inlineGameSetupCard = $("inlineGameSetupCard");
const inlineGameSetupTitle = $("inlineGameSetupTitle");
const inlineGameSetupMeta = $("inlineGameSetupMeta");
const inlineGameSetupShell = $("inlineGameSetupShell");
const inlineGameHoleCard = $("inlineGameHoleCard");
const inlineGameHoleTitle = $("inlineGameHoleTitle");
const inlineGameHoleMeta = $("inlineGameHoleMeta");
const inlineGameHoleShell = $("inlineGameHoleShell");
const inlineGameScoreboardCard = $("inlineGameScoreboardCard");
const inlineGameScoreboardTitle = $("inlineGameScoreboardTitle");
const inlineGameScoreboardMeta = $("inlineGameScoreboardMeta");
const inlineGameScoreboardShell = $("inlineGameScoreboardShell");

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
const fullscreenContent = $("fullscreenContent");
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
const sumCourseMeta = $("sumCourseMeta");

const resultsCard = $("resultsCard");
const roundResultsFeedbackCard = $("roundResultsFeedbackCard");
const roundResultsFeedbackInsights = $("roundResultsFeedbackInsights");
const holeSetupCard = $("holeSetupCard");
const holeNavCard = $("holeNavCard");
const scoreboardCard = $("scoreboardCard");

let currentHole = 1;
let currentCourseId = "oneka-ridge";
let holes = {};
let savedRoundDocId = null;
const sessionApi = window.GFGSession || null;
let activeRoundSessionId =
  sessionApi?.getSessionIdFromUrl() ||
  sessionApi?.getActiveSession()?.sessionId ||
  null;
let lastRoundSessionTriggerEl = null;
let inlineLinkedGameState = createDefaultInlineGameState();
let isRestoringRoundSession = false;

function getSessionModeValue() {
  return sessionModeSelect?.value === "roundGame" ? "round+game" : "round-only";
}

function getLinkedGameType() {
  return sessionApi?.normalizeGameType(linkedGameTypeSelect?.value) || "wolf";
}

function getLinkedGameLabel(gameType = getLinkedGameType()) {
  if (gameType === "666") return "Six-Six-Six";
  if (gameType === "bbb") return "Bingo Bango Bongo";
  return "Wolf";
}

function createDefaultInlineGameState(gameType = "wolf") {
  const normalized = sessionApi?.normalizeGameType(gameType) || gameType || "wolf";

  return {
    gameType: normalized,
    players: ["Player 1", "Player 2", "Player 3", "Player 4"],
    trackedPlayerIndex: null,
    totals: [0, 0, 0, 0],
    currentWolfIndex: 0,
    currentPot: 0,
    holes: {},
    base: 2,
    dollarValue: 0.25,
    tieSetPoints: normalized === "666" ? null : 0,
    tieMultiplier: 1,
    bet: 0.25,
    loneWinPoints: 6,
    loneLosePoints: 6,
    dumpWinPoints: 6,
    dumpLosePoints: 6,
    blindWinPoints: 8,
    blindLosePoints: 8,
    loneEnabled: true,
    dumpEnabled: true,
    blindEnabled: true,
    carryoverEnabled: true,
    birdieDoubleEnabled: false
  };
}

function syncInlineGameType(forceReset = false) {
  const nextType = getLinkedGameType();
  if (!forceReset && inlineLinkedGameState?.gameType === nextType) {
    return inlineLinkedGameState;
  }

  const previousPlayers = Array.isArray(inlineLinkedGameState?.players)
    ? [...inlineLinkedGameState.players]
    : ["Player 1", "Player 2", "Player 3", "Player 4"];
  const previousTrackedPlayer = Number.isInteger(inlineLinkedGameState?.trackedPlayerIndex)
    ? inlineLinkedGameState.trackedPlayerIndex
    : null;

  inlineLinkedGameState = createDefaultInlineGameState(nextType);
  inlineLinkedGameState.players = previousPlayers.slice(0, 4);
  while (inlineLinkedGameState.players.length < 4) {
    inlineLinkedGameState.players.push(`Player ${inlineLinkedGameState.players.length + 1}`);
  }
  inlineLinkedGameState.trackedPlayerIndex = previousTrackedPlayer;

  return inlineLinkedGameState;
}

function hasInlineGameData() {
  const state = inlineLinkedGameState;
  if (!state) return false;

  if (Array.isArray(state.players) && state.players.some((player, idx) => (player || "").trim() !== `Player ${idx + 1}`)) {
    return true;
  }

  return Object.keys(state.holes || {}).some((holeNum) => {
    const holeState = state.holes?.[holeNum];
    if (!holeState || typeof holeState !== "object") return false;

    if (state.gameType === "bbb") {
      return holeState.bingo !== null || holeState.bango !== null || holeState.bongo !== null;
    }

    if (state.gameType === "666") {
      return !!holeState.result;
    }

    return !!holeState.mode || !!holeState.result || !!holeState.birdieDouble || holeState.partner !== null;
  });
}

function getInlineGamePlayers() {
  const players = Array.isArray(inlineLinkedGameState?.players) ? [...inlineLinkedGameState.players] : [];
  while (players.length < 4) {
    players.push(`Player ${players.length + 1}`);
  }
  return players.slice(0, 4);
}

function getInlineGameSafePlayerName(index) {
  return getInlineGamePlayers()[index] || `Player ${index + 1}`;
}

function getInlineGameMoneyText(amount) {
  const sign = amount >= 0 ? "+" : "-";
  return `${sign}$${Math.abs(amount).toFixed(2)}`;
}

function getInlineGameStatusText() {
  const type = getLinkedGameType();
  if (type === "666") {
    return "Teams rotate every six holes. The linked game stays on the same hole number as the scorecard.";
  }
  if (type === "bbb") {
    return "Choose Bingo, Bango, and Bongo winners for the same hole you are scoring in the round.";
  }
  return "Set the Wolf play for this hole, then mark who won the hole. The game stays synced with the scorecard hole.";
}

function getInlineGameSetupMetaText() {
  return `${getLinkedGameLabel()} is built right into this round. One hole for the scorecard, one matching hole for the game.`;
}

function getInlineGameScoreboardMetaText() {
  if (getLinkedGameType() === "bbb") {
    return "Points x bet";
  }

  return "Running game totals";
}

function getLinkedGameSaveLabel(gameType = getLinkedGameType()) {
  const normalized = sessionApi?.normalizeGameType(gameType) || gameType || "wolf";
  if (normalized === "666") return "666";
  if (normalized === "bbb") return "BBB";
  return "Wolf";
}

function getInlineGameRoundMeta() {
  if (currentHole === 19) {
    return "Round complete. Review the linked game totals below before saving.";
  }

  return `Round Hole ${currentHole} | Game Hole ${currentHole}`;
}

function resetInlineGameForSelectedType() {
  syncInlineGameType(true);
  persistInlineGameDraft();
}

function getInlineWolfHole(holeNumber = currentHole) {
  if (!inlineLinkedGameState.holes[holeNumber]) {
    inlineLinkedGameState.holes[holeNumber] = {
      wolf: (holeNumber - 1) % 4,
      partner: null,
      mode: null,
      result: null,
      birdieDouble: false
    };
  }

  return inlineLinkedGameState.holes[holeNumber];
}

function getInline666Hole(holeNumber = currentHole) {
  if (!inlineLinkedGameState.holes[holeNumber]) {
    inlineLinkedGameState.holes[holeNumber] = { result: null };
  }

  return inlineLinkedGameState.holes[holeNumber];
}

function getInlineBBBHole(holeNumber = currentHole) {
  if (!inlineLinkedGameState.holes[holeNumber]) {
    inlineLinkedGameState.holes[holeNumber] = { bingo: null, bango: null, bongo: null };
  }

  return inlineLinkedGameState.holes[holeNumber];
}

function getInline666FormatForHole(holeNumber = currentHole) {
  if (holeNumber >= 1 && holeNumber <= 6) return "Best Ball";
  if (holeNumber >= 7 && holeNumber <= 12) return "Total Score";
  return "High / Low";
}

function getInline666TeamsForHole(holeNumber = currentHole) {
  if (holeNumber >= 1 && holeNumber <= 6) return { team1: [0, 1], team2: [2, 3] };
  if (holeNumber >= 7 && holeNumber <= 12) return { team1: [0, 2], team2: [1, 3] };
  return { team1: [0, 3], team2: [1, 2] };
}

function recalcInlineWolfGame() {
  const totals = [0, 0, 0, 0];
  let carryover = 0;

  Object.keys(inlineLinkedGameState.holes || {})
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((holeNumber) => {
      const holeState = inlineLinkedGameState.holes[holeNumber];
      if (!holeState?.result) return;

      const birdieMultiplier = holeState.birdieDouble ? 2 : 1;
      const allPlayers = [0, 1, 2, 3];

      if (holeState.result === "push") {
        carryover += inlineLinkedGameState.carryoverEnabled ? Number(inlineLinkedGameState.tieSetPoints) || 0 : 0;
        return;
      }

      const pot = carryover;
      carryover = 0;

      if (holeState.result === "wolfTeam") {
        if (holeState.partner === null || holeState.partner === undefined) return;
        const each = ((Number(inlineLinkedGameState.base) || 0) / 2) * birdieMultiplier + (pot / 2);
        totals[holeState.wolf] += each;
        totals[holeState.partner] += each;
        return;
      }

      if (holeState.result === "others") {
        const winners = allPlayers.filter((idx) => idx !== holeState.wolf && idx !== holeState.partner);
        const each = ((Number(inlineLinkedGameState.base) || 0) / 2) * birdieMultiplier + (pot / 2);
        winners.forEach((idx) => {
          totals[idx] += each;
        });
        return;
      }

      if (holeState.result === "loneWin" && holeState.mode === "lone") {
        totals[holeState.wolf] += ((Number(inlineLinkedGameState.loneWinPoints) || 0) * birdieMultiplier) + pot;
        return;
      }

      if (holeState.result === "loneLose" && holeState.mode === "lone") {
        const winners = allPlayers.filter((idx) => idx !== holeState.wolf);
        const each = (((Number(inlineLinkedGameState.loneLosePoints) || 0) * birdieMultiplier) / 3) + (pot / 3);
        winners.forEach((idx) => {
          totals[idx] += each;
        });
        return;
      }

      if (holeState.result === "loneWin" && holeState.mode === "blind") {
        totals[holeState.wolf] += ((Number(inlineLinkedGameState.blindWinPoints) || 0) * birdieMultiplier) + pot;
        return;
      }

      if (holeState.result === "loneLose" && holeState.mode === "blind") {
        const winners = allPlayers.filter((idx) => idx !== holeState.wolf);
        const each = (((Number(inlineLinkedGameState.blindLosePoints) || 0) * birdieMultiplier) / 3) + (pot / 3);
        winners.forEach((idx) => {
          totals[idx] += each;
        });
        return;
      }

      if (holeState.result === "dumpWin") {
        if (holeState.partner === null || holeState.partner === undefined) return;
        totals[holeState.partner] += ((Number(inlineLinkedGameState.dumpWinPoints) || 0) * birdieMultiplier) + pot;
        return;
      }

      if (holeState.result === "dumpLose") {
        if (holeState.partner === null || holeState.partner === undefined) return;
        const winners = allPlayers.filter((idx) => idx !== holeState.partner);
        const each = (((Number(inlineLinkedGameState.dumpLosePoints) || 0) * birdieMultiplier) / 3) + (pot / 3);
        winners.forEach((idx) => {
          totals[idx] += each;
        });
      }
    });

  inlineLinkedGameState.totals = totals;
  inlineLinkedGameState.currentPot = carryover;
}

function recalcInline666Game() {
  const totals = [0, 0, 0, 0];
  let carryover = 0;
  const base = Number(inlineLinkedGameState.base) || 0;

  Object.keys(inlineLinkedGameState.holes || {})
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((holeNumber) => {
      const holeState = inlineLinkedGameState.holes[holeNumber];
      if (!holeState?.result) return;

      if (holeState.result === "push") {
        if (inlineLinkedGameState.tieSetPoints !== null && inlineLinkedGameState.tieSetPoints !== undefined && inlineLinkedGameState.tieSetPoints !== "") {
          carryover += Number(inlineLinkedGameState.tieSetPoints) || 0;
        } else if ((Number(inlineLinkedGameState.tieMultiplier) || 1) > 1) {
          carryover += base * ((Number(inlineLinkedGameState.tieMultiplier) || 1) - 1);
        } else {
          carryover += base;
        }
        return;
      }

      const payout = base + carryover;
      carryover = 0;
      const { team1, team2 } = getInline666TeamsForHole(holeNumber);

      if (holeState.result === "team1") {
        team1.forEach((idx) => {
          totals[idx] += payout;
        });
      }

      if (holeState.result === "team2") {
        team2.forEach((idx) => {
          totals[idx] += payout;
        });
      }
    });

  inlineLinkedGameState.totals = totals;
  inlineLinkedGameState.currentPot = carryover;
}

function recalcInlineBBBGame() {
  const totals = [0, 0, 0, 0];

  Object.keys(inlineLinkedGameState.holes || {})
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((holeNumber) => {
      const holeState = inlineLinkedGameState.holes[holeNumber];
      if (!holeState) return;

      ["bingo", "bango", "bongo"].forEach((key) => {
        const playerIndex = holeState[key];
        if (playerIndex === 0 || playerIndex === 1 || playerIndex === 2 || playerIndex === 3) {
          totals[playerIndex] += 1;
        }
      });
    });

  inlineLinkedGameState.totals = totals;
  inlineLinkedGameState.currentPot = 0;
}

function recalcInlineLinkedGame() {
  syncInlineGameType();

  if (getLinkedGameType() === "666") {
    recalcInline666Game();
  } else if (getLinkedGameType() === "bbb") {
    recalcInlineBBBGame();
  } else {
    recalcInlineWolfGame();
  }

  persistInlineGameDraft();
}

function getInlineGameDraftPayload() {
  const players = getInlineGamePlayers();
  const trackedPlayerIndex = Number.isInteger(inlineLinkedGameState.trackedPlayerIndex)
    ? inlineLinkedGameState.trackedPlayerIndex
    : null;
  const payload = {
    sessionId: activeRoundSessionId,
    hole: currentHole,
    holes: JSON.parse(JSON.stringify(inlineLinkedGameState.holes || {})),
    totals: [...(inlineLinkedGameState.totals || [0, 0, 0, 0])],
    players,
    trackedPlayerIndex
  };

  if (getLinkedGameType() === "666") {
    payload.base = Number(inlineLinkedGameState.base) || 0;
    payload.dollarValue = Number(inlineLinkedGameState.dollarValue) || 0;
    payload.tieSetPoints =
      inlineLinkedGameState.tieSetPoints !== null &&
      inlineLinkedGameState.tieSetPoints !== undefined &&
      inlineLinkedGameState.tieSetPoints !== ""
        ? Number(inlineLinkedGameState.tieSetPoints) || 0
        : null;
    payload.tieMultiplier = Number(inlineLinkedGameState.tieMultiplier) || 1;
    return payload;
  }

  if (getLinkedGameType() === "bbb") {
    payload.bet = Number(inlineLinkedGameState.bet) || 0;
    return payload;
  }

  payload.currentWolfIndex = Number(inlineLinkedGameState.currentWolfIndex) || 0;
  payload.base = Number(inlineLinkedGameState.base) || 0;
  payload.dollarValue = Number(inlineLinkedGameState.dollarValue) || 0;
  payload.loneWinPoints = Number(inlineLinkedGameState.loneWinPoints) || 0;
  payload.loneLosePoints = Number(inlineLinkedGameState.loneLosePoints) || 0;
  payload.dumpWinPoints = Number(inlineLinkedGameState.dumpWinPoints) || 0;
  payload.dumpLosePoints = Number(inlineLinkedGameState.dumpLosePoints) || 0;
  payload.blindWinPoints = Number(inlineLinkedGameState.blindWinPoints) || 0;
  payload.blindLosePoints = Number(inlineLinkedGameState.blindLosePoints) || 0;
  payload.tieSetPoints = Number(inlineLinkedGameState.tieSetPoints) || 0;
  payload.loneEnabled = !!inlineLinkedGameState.loneEnabled;
  payload.dumpEnabled = !!inlineLinkedGameState.dumpEnabled;
  payload.blindEnabled = !!inlineLinkedGameState.blindEnabled;
  payload.carryoverEnabled = !!inlineLinkedGameState.carryoverEnabled;
  payload.birdieDoubleEnabled = !!inlineLinkedGameState.birdieDoubleEnabled;
  return payload;
}

function persistInlineGameDraft() {
  if (isRestoringRoundSession) return;
  if (!sessionApi || getSessionModeValue() !== "round+game") return;

  if (!activeRoundSessionId) {
    ensureInlineGameSessionTarget();
  }

  if (!activeRoundSessionId) return;

  sessionApi.saveGameDraft(getLinkedGameType(), activeRoundSessionId, getInlineGameDraftPayload());
  syncActiveRoundSession({ gameType: getLinkedGameType(), currentGameHole: currentHole });
}

function applyInlineGameDraft(draft) {
  if (!draft || typeof draft !== "object") {
    syncInlineGameType(true);
    recalcInlineLinkedGame();
    return false;
  }

  const nextType = getLinkedGameType();
  inlineLinkedGameState = createDefaultInlineGameState(nextType);
  inlineLinkedGameState.players = Array.isArray(draft.players) && draft.players.length
    ? draft.players.slice(0, 4)
    : inlineLinkedGameState.players;
  while (inlineLinkedGameState.players.length < 4) {
    inlineLinkedGameState.players.push(`Player ${inlineLinkedGameState.players.length + 1}`);
  }
  inlineLinkedGameState.trackedPlayerIndex = Number.isInteger(draft.trackedPlayerIndex) ? draft.trackedPlayerIndex : null;
  inlineLinkedGameState.holes = typeof draft.holes === "object" && draft.holes ? JSON.parse(JSON.stringify(draft.holes)) : {};
  inlineLinkedGameState.totals = Array.isArray(draft.totals) ? [...draft.totals] : [0, 0, 0, 0];

  if (nextType === "666") {
    inlineLinkedGameState.base = Number(draft.base) || 0;
    inlineLinkedGameState.dollarValue = Number(draft.dollarValue) || 0;
    inlineLinkedGameState.tieSetPoints = draft.tieSetPoints ?? null;
    inlineLinkedGameState.tieMultiplier = Number(draft.tieMultiplier) || 1;
  } else if (nextType === "bbb") {
    inlineLinkedGameState.bet = Number(draft.bet) || 0;
  } else {
    inlineLinkedGameState.currentWolfIndex = Number.isInteger(draft.currentWolfIndex) ? draft.currentWolfIndex : 0;
    inlineLinkedGameState.base = Number(draft.base) || 0;
    inlineLinkedGameState.dollarValue = Number(draft.dollarValue) || 0;
    inlineLinkedGameState.loneWinPoints = Number(draft.loneWinPoints) || 0;
    inlineLinkedGameState.loneLosePoints = Number(draft.loneLosePoints) || 0;
    inlineLinkedGameState.dumpWinPoints = Number(draft.dumpWinPoints) || 0;
    inlineLinkedGameState.dumpLosePoints = Number(draft.dumpLosePoints) || 0;
    inlineLinkedGameState.blindWinPoints = Number(draft.blindWinPoints) || 0;
    inlineLinkedGameState.blindLosePoints = Number(draft.blindLosePoints) || 0;
    inlineLinkedGameState.tieSetPoints = Number(draft.tieSetPoints) || 0;
    inlineLinkedGameState.loneEnabled = draft.loneEnabled !== false;
    inlineLinkedGameState.dumpEnabled = draft.dumpEnabled !== false;
    inlineLinkedGameState.blindEnabled = draft.blindEnabled !== false;
    inlineLinkedGameState.carryoverEnabled = draft.carryoverEnabled !== false;
    inlineLinkedGameState.birdieDoubleEnabled = !!draft.birdieDoubleEnabled;
  }

  recalcInlineLinkedGame();
  return true;
}

function restoreInlineGameDraft() {
  if (!sessionApi || !activeRoundSessionId || getSessionModeValue() !== "round+game") {
    syncInlineGameType(true);
    return false;
  }

  const draft = sessionApi.loadGameDraft(getLinkedGameType(), activeRoundSessionId);
  if (!draft) {
    syncInlineGameType(true);
    recalcInlineLinkedGame();
    return false;
  }

  return applyInlineGameDraft(draft);
}

function renderInlineGameSetupFields() {
  const players = getInlineGamePlayers();
  const trackedPlayerIndex = Number.isInteger(inlineLinkedGameState.trackedPlayerIndex)
    ? inlineLinkedGameState.trackedPlayerIndex
    : "";

  const playersHtml = players.map((playerName, idx) => `
    <div class="col-6">
      <input
        id="inlineGamePlayer${idx}"
        class="form-control"
        placeholder="Player ${idx + 1}"
        data-inline-player-index="${idx}"
        value="${playerName}">
    </div>
  `).join("");

  const trackedOptions = players.map((playerName, idx) => `
    <option value="${idx}" ${trackedPlayerIndex === idx ? "selected" : ""}>${playerName}</option>
  `).join("");

  if (getLinkedGameType() === "666") {
    return `
      <div class="inline-game-native-setup">
        <div class="row g-2 mb-3">
          ${playersHtml}
        </div>

        <div class="row g-2 mb-3">
          <div class="col-12 col-md-6">
            <label class="form-label small" for="inlineGameTrackedPlayer">Your Player Slot</label>
            <select id="inlineGameTrackedPlayer" class="form-select" data-inline-field="trackedPlayerIndex">
              <option value="">Choose your player slot</option>
              ${trackedOptions}
            </select>
          </div>
        </div>

        <div class="row g-2">
          <div class="col-6">
            <label class="form-label small" for="inline666Base">Points Per Player Per Hole</label>
            <input id="inline666Base" class="form-control" type="number" min="0" step="1" data-inline-field="base" value="${Number(inlineLinkedGameState.base) || 0}">
          </div>
          <div class="col-6">
            <label class="form-label small" for="inline666DollarValue">$/Point</label>
            <input id="inline666DollarValue" class="form-control" type="number" min="0" step="0.25" data-inline-field="dollarValue" value="${Number(inlineLinkedGameState.dollarValue) || 0}">
          </div>
          <div class="col-6 mt-2">
            <label class="form-label small" for="inline666TieSetPoints">Tie Points (Fixed)</label>
            <input id="inline666TieSetPoints" class="form-control" type="number" min="0" step="1" data-inline-field="tieSetPoints" value="${inlineLinkedGameState.tieSetPoints ?? ""}">
          </div>
          <div class="col-6 mt-2">
            <label class="form-label small" for="inline666TieMultiplier">Tie Multiplier</label>
            <input id="inline666TieMultiplier" class="form-control" type="number" min="1" step="1" data-inline-field="tieMultiplier" value="${Number(inlineLinkedGameState.tieMultiplier) || 1}">
          </div>
        </div>
      </div>
    `;
  }

  if (getLinkedGameType() === "bbb") {
    return `
      <div class="inline-game-native-setup">
        <div class="row g-2 mb-3">
          ${playersHtml}
        </div>

        <div class="row g-2 mb-3">
          <div class="col-12 col-md-6">
            <label class="form-label small" for="inlineGameTrackedPlayer">Your Player Slot</label>
            <select id="inlineGameTrackedPlayer" class="form-select" data-inline-field="trackedPlayerIndex">
              <option value="">Choose your player slot</option>
              ${trackedOptions}
            </select>
          </div>
        </div>

        <div class="row g-2">
          <div class="col-6 col-md-3">
            <label class="form-label small" for="inlineBBBBet">Bet Per Point ($)</label>
            <input id="inlineBBBBet" class="form-control" type="number" min="0" step="0.25" data-inline-field="bet" value="${Number(inlineLinkedGameState.bet) || 0}">
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="inline-game-native-setup">
      <div class="row g-2 mb-3">
        ${playersHtml}
      </div>

      <div class="row g-2 mb-3">
        <div class="col-12 col-md-6">
          <label class="form-label small" for="inlineGameTrackedPlayer">Your Player Slot</label>
          <select id="inlineGameTrackedPlayer" class="form-select" data-inline-field="trackedPlayerIndex">
            <option value="">Choose your player slot</option>
            ${trackedOptions}
          </select>
        </div>
      </div>

      <div class="game-options-card">
        <h3>Game Options</h3>

        <div class="option-row">
          <label for="inlineWolfToggleLone">Lone</label>
          <label class="switch">
            <input id="inlineWolfToggleLone" type="checkbox" data-inline-field="loneEnabled" ${inlineLinkedGameState.loneEnabled ? "checked" : ""}>
            <span class="slider"></span>
          </label>
        </div>

        <div class="option-row">
          <label for="inlineWolfToggleDump">Dump</label>
          <label class="switch">
            <input id="inlineWolfToggleDump" type="checkbox" data-inline-field="dumpEnabled" ${inlineLinkedGameState.dumpEnabled ? "checked" : ""}>
            <span class="slider"></span>
          </label>
        </div>

        <div class="option-row">
          <label for="inlineWolfToggleBlind">Blind</label>
          <label class="switch">
            <input id="inlineWolfToggleBlind" type="checkbox" data-inline-field="blindEnabled" ${inlineLinkedGameState.blindEnabled ? "checked" : ""}>
            <span class="slider"></span>
          </label>
        </div>

        <div class="option-row">
          <label for="inlineWolfToggleCarryover">Tie Carryover</label>
          <label class="switch">
            <input id="inlineWolfToggleCarryover" type="checkbox" data-inline-field="carryoverEnabled" ${inlineLinkedGameState.carryoverEnabled ? "checked" : ""}>
            <span class="slider"></span>
          </label>
        </div>

        <div class="option-row">
          <label for="inlineWolfToggleBirdieDouble">Birdie Double</label>
          <label class="switch">
            <input id="inlineWolfToggleBirdieDouble" type="checkbox" data-inline-field="birdieDoubleEnabled" ${inlineLinkedGameState.birdieDoubleEnabled ? "checked" : ""}>
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="row g-2 inline-game-point-pair">
        <div class="col-6">
          <label class="form-label small" for="inlineWolfBase">Base Points</label>
          <input id="inlineWolfBase" class="form-control" type="number" min="0" step="1" data-inline-field="base" value="${Number(inlineLinkedGameState.base) || 0}">
        </div>
        <div class="col-6">
          <label class="form-label small" for="inlineWolfDollarValue">$/Point</label>
          <input id="inlineWolfDollarValue" class="form-control" type="number" min="0" step="0.25" data-inline-field="dollarValue" value="${Number(inlineLinkedGameState.dollarValue) || 0}">
        </div>
      </div>

      <div class="row g-2 mt-2 inline-game-point-single">
        <div class="col-6">
          <label class="form-label small" for="inlineWolfTieSetPoints">Tie Carryover Points</label>
          <input id="inlineWolfTieSetPoints" class="form-control" type="number" min="0" step="1" data-inline-field="tieSetPoints" value="${Number(inlineLinkedGameState.tieSetPoints) || 0}">
        </div>
      </div>

      <div class="row g-2 mt-2 inline-game-point-pair">
        <div class="col-6">
          <label class="form-label small" for="inlineWolfLoneWinPoints">Lone Win Points</label>
          <input id="inlineWolfLoneWinPoints" class="form-control" type="number" min="0" step="1" data-inline-field="loneWinPoints" value="${Number(inlineLinkedGameState.loneWinPoints) || 0}">
        </div>
        <div class="col-6">
          <label class="form-label small" for="inlineWolfLoneLosePoints">Lone Lose Points</label>
          <input id="inlineWolfLoneLosePoints" class="form-control" type="number" min="0" step="1" data-inline-field="loneLosePoints" value="${Number(inlineLinkedGameState.loneLosePoints) || 0}">
        </div>
      </div>

      <div class="row g-2 mt-2 inline-game-point-pair">
        <div class="col-6">
          <label class="form-label small" for="inlineWolfDumpWinPoints">Dump Win Points</label>
          <input id="inlineWolfDumpWinPoints" class="form-control" type="number" min="0" step="1" data-inline-field="dumpWinPoints" value="${Number(inlineLinkedGameState.dumpWinPoints) || 0}">
        </div>
        <div class="col-6">
          <label class="form-label small" for="inlineWolfDumpLosePoints">Dump Lose Points</label>
          <input id="inlineWolfDumpLosePoints" class="form-control" type="number" min="0" step="1" data-inline-field="dumpLosePoints" value="${Number(inlineLinkedGameState.dumpLosePoints) || 0}">
        </div>
      </div>

      <div class="row g-2 mt-2 inline-game-point-pair">
        <div class="col-6">
          <label class="form-label small" for="inlineWolfBlindWinPoints">Blind Win Points</label>
          <input id="inlineWolfBlindWinPoints" class="form-control" type="number" min="0" step="1" data-inline-field="blindWinPoints" value="${Number(inlineLinkedGameState.blindWinPoints) || 0}">
        </div>
        <div class="col-6">
          <label class="form-label small" for="inlineWolfBlindLosePoints">Blind Lose Points</label>
          <input id="inlineWolfBlindLosePoints" class="form-control" type="number" min="0" step="1" data-inline-field="blindLosePoints" value="${Number(inlineLinkedGameState.blindLosePoints) || 0}">
        </div>
      </div>
    </div>
  `;
}

function renderInlineWolfHoleFields() {
  const players = getInlineGamePlayers();
  const holeState = getInlineWolfHole();
  inlineLinkedGameState.currentWolfIndex = Number(holeState.wolf) || 0;

  const setupOptions = [`<option value="">Select partner or play solo</option>`];
  players.forEach((playerName, idx) => {
    if (idx !== holeState.wolf) {
      setupOptions.push(`<option value="partner-${idx}">Partner: ${playerName}</option>`);
    }
  });

  if (inlineLinkedGameState.loneEnabled) {
    setupOptions.push(`<option value="lone">Lone Wolf</option>`);
  }

  if (inlineLinkedGameState.blindEnabled) {
    setupOptions.push(`<option value="blind">Blind Wolf</option>`);
  }

  let currentSetupValue = "";
  if ((holeState.mode === "team" || holeState.mode === "dump") && holeState.partner !== null && holeState.partner !== undefined) {
    currentSetupValue = `partner-${holeState.partner}`;
  } else if (holeState.mode === "lone") {
    currentSetupValue = "lone";
  } else if (holeState.mode === "blind") {
    currentSetupValue = "blind";
  }

  const selectedResult = holeState.result || "";
  const dumpAvailable = inlineLinkedGameState.dumpEnabled && holeState.partner !== null && holeState.partner !== undefined;
  const teamHidden = holeState.mode !== "team";
  const loneHidden = holeState.mode !== "lone";
  const dumpHidden = holeState.mode !== "dump";
  const blindHidden = holeState.mode !== "blind";
  const resultTextMap = {
    wolfTeam: "Wolf Team Wins",
    others: "Other Team Wins",
    loneWin: "Lone Wolf Wins",
    loneLose: "Lone Wolf Loses",
    dumpWin: "Dump Wins",
    dumpLose: "Others Win",
    push: "Push"
  };

  return `
    <div class="inline-game-native-hole">
      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="small" for="inlineWolfHoleWolf">Wolf</label>
          <select id="inlineWolfHoleWolf" class="form-select" data-inline-wolf-field="wolf">
            ${players.map((playerName, idx) => `<option value="${idx}" ${idx === holeState.wolf ? "selected" : ""}>${playerName}</option>`).join("")}
          </select>
        </div>
        <div class="col-6">
          <label class="small" for="inlineWolfHoleSetup">Hole Setup</label>
          <select id="inlineWolfHoleSetup" class="form-select" data-inline-wolf-field="setup">
            ${setupOptions.join("")}
          </select>
        </div>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-6">
          <button type="button" class="btn btn-warning w-100 ${selectedResult === "push" ? "selected" : ""}" data-inline-wolf-result="push">Push</button>
        </div>
        <div class="col-6">
          <button
            type="button"
            class="btn btn-dark w-100 ${holeState.mode === "dump" ? "selected" : ""}"
            data-inline-wolf-action="${holeState.mode === "dump" ? "team" : "dump"}"
            ${dumpAvailable || holeState.mode === "dump" ? "" : "disabled"}>
            Dump
          </button>
        </div>
      </div>

      <div class="d-grid gap-2 ${teamHidden ? "hidden" : ""}">
        <button type="button" class="btn team-win ${selectedResult === "wolfTeam" ? "selected" : ""}" data-inline-wolf-result="wolfTeam">Wolf Team Wins</button>
        <button type="button" class="btn team-lose ${selectedResult === "others" ? "selected" : ""}" data-inline-wolf-result="others">Other Team Wins</button>
      </div>

      <div class="d-grid gap-2 ${loneHidden ? "hidden" : ""}">
        <button type="button" class="btn lone-win ${selectedResult === "loneWin" ? "selected" : ""}" data-inline-wolf-result="loneWin">Lone Wolf Wins</button>
        <button type="button" class="btn lone-lose ${selectedResult === "loneLose" ? "selected" : ""}" data-inline-wolf-result="loneLose">Lone Wolf Loses</button>
      </div>

      <div class="d-grid gap-2 ${dumpHidden ? "hidden" : ""}">
        <button type="button" class="btn dump-win ${selectedResult === "dumpWin" ? "selected" : ""}" data-inline-wolf-result="dumpWin">Dump Wins</button>
        <button type="button" class="btn dump-lose ${selectedResult === "dumpLose" ? "selected" : ""}" data-inline-wolf-result="dumpLose">Others Win</button>
      </div>

      <div class="d-grid gap-2 ${blindHidden ? "hidden" : ""}">
        <button type="button" class="btn lone-win ${selectedResult === "loneWin" ? "selected" : ""}" data-inline-wolf-result="loneWin">Blind Wolf Wins</button>
        <button type="button" class="btn lone-lose ${selectedResult === "loneLose" ? "selected" : ""}" data-inline-wolf-result="loneLose">Blind Wolf Loses</button>
      </div>

      ${inlineLinkedGameState.birdieDoubleEnabled ? `
        <div class="inline-birdie-question-wrap">
          <div class="text-center fw-bold mb-2">Birdie Double?</div>
          <div class="birdie-question-buttons">
            <button type="button" class="btn btn-success ${holeState.birdieDouble ? "selected" : ""}" data-inline-wolf-birdie="yes">Yes</button>
            <button type="button" class="btn btn-secondary ${holeState.birdieDouble ? "" : "selected"}" data-inline-wolf-birdie="no">No</button>
          </div>
        </div>
      ` : ""}

      <div class="inline-game-footer-row">
        <div class="inline-game-status-pill">${selectedResult ? (resultTextMap[selectedResult] || selectedResult) : "No result set yet"}</div>
        <div class="inline-game-pot">POT: ${inlineLinkedGameState.currentPot || 0} pts</div>
      </div>
    </div>
  `;
}

function renderInline666HoleFields() {
  const { team1, team2 } = getInline666TeamsForHole();
  const holeState = getInline666Hole();

  return `
    <div class="inline-game-native-hole">
      <div class="gfg-team-box mb-3">
        <div class="gfg-team-row">
          <div class="gfg-team-pill gfg-team-pill--one">
            <strong>Team 1</strong>
            <span>${getInlineGameSafePlayerName(team1[0])} + ${getInlineGameSafePlayerName(team1[1])}</span>
          </div>
          <div class="gfg-team-pill gfg-team-pill--two">
            <strong>Team 2</strong>
            <span>${getInlineGameSafePlayerName(team2[0])} + ${getInlineGameSafePlayerName(team2[1])}</span>
          </div>
        </div>
      </div>

      <div class="inline-game-note mb-3">${getInline666FormatForHole(currentHole)}</div>

      <div class="row g-2 mode-group">
        <div class="col-6">
          <button type="button" class="btn team-win inline-666-win w-100 ${holeState.result === "team1" ? "selected" : ""}" data-inline-666-result="team1">Team 1 Wins</button>
        </div>
        <div class="col-6">
          <button type="button" class="btn team-lose inline-666-lose w-100 ${holeState.result === "team2" ? "selected" : ""}" data-inline-666-result="team2">Team 2 Wins</button>
        </div>
        <div class="col-12">
          <button type="button" class="btn btn-warning w-100 ${holeState.result === "push" ? "selected" : ""}" data-inline-666-result="push">Push</button>
        </div>
      </div>
    </div>
  `;
}

function renderInlineBBBHoleFields() {
  const holeState = getInlineBBBHole();
  const players = getInlineGamePlayers();
  const options = players.map((playerName, idx) => `<option value="${idx}">${playerName}</option>`).join("");

  return `
    <div class="inline-game-native-hole">
      <div class="row g-2 mb-2">
        <div class="col-12 col-md-4">
          <label class="form-label small" for="inlineBBBBingo">Bingo</label>
          <select id="inlineBBBBingo" class="form-select" data-inline-bbb-field="bingo">
            <option value="">-</option>
            ${options}
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small" for="inlineBBBBango">Bango</label>
          <select id="inlineBBBBango" class="form-select" data-inline-bbb-field="bango">
            <option value="">-</option>
            ${options}
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small" for="inlineBBBBongo">Bongo</label>
          <select id="inlineBBBBongo" class="form-select" data-inline-bbb-field="bongo">
            <option value="">-</option>
            ${options}
          </select>
        </div>
      </div>
    </div>
  `;
}

function renderInlineGameScoreboard() {
  if (!inlineGameScoreboardCard || !inlineGameScoreboardTitle || !inlineGameScoreboardShell) return;

  const shouldShow = getSessionModeValue() === "round+game";
  inlineGameScoreboardCard.classList.toggle("hidden", !shouldShow);
  if (!shouldShow) return;

  const players = getInlineGamePlayers();
  const totals = Array.isArray(inlineLinkedGameState.totals) ? inlineLinkedGameState.totals : [0, 0, 0, 0];
  const moneyMultiplier = getLinkedGameType() === "bbb"
    ? Number(inlineLinkedGameState.bet) || 0
    : Number(inlineLinkedGameState.dollarValue) || 0;

  inlineGameScoreboardTitle.textContent =
    getLinkedGameType() === "bbb"
      ? "🪘 BBB Scoreboard"
      : getLinkedGameType() === "666"
        ? "666 Scoreboard"
        : "🐺 Wolf Scoreboard";
  if (inlineGameScoreboardMeta) {
    inlineGameScoreboardMeta.textContent = getInlineGameScoreboardMetaText();
  }

  const renderScoreCell = (idx, spacerClass) => {
    const net = (Number(totals[idx]) || 0) * moneyMultiplier;
    return `
      <div class="border rounded p-1 flex-fill ${spacerClass}">
        <div class="fw-bold fs-6">${players[idx]}: ${Number(totals[idx]) || 0} pts</div>
        <div class="fs-6 fw-bold" style="color:${net >= 0 ? "#359447" : "#d9534f"}">${getInlineGameMoneyText(net)}</div>
      </div>
    `;
  };

  inlineGameScoreboardShell.innerHTML = `
    ${getLinkedGameType() !== "bbb" ? `
      <div class="pot-banner inline-game-pot-banner ${inlineLinkedGameState.currentPot ? "" : "hidden"}">
        POT: <span>${inlineLinkedGameState.currentPot || 0}</span> pts
      </div>
    ` : ""}
    <div class="d-flex mb-1 text-center inline-game-score-row">
      ${renderScoreCell(0, "me-1")}
      ${renderScoreCell(1, "ms-1")}
    </div>
    <div class="d-flex text-center inline-game-score-row">
      ${renderScoreCell(2, "me-1")}
      ${renderScoreCell(3, "ms-1")}
    </div>
  `;
}

function renderInlineLinkedGameUI() {
  const shouldShow = getSessionModeValue() === "round+game";

  inlineGameSetupCard?.classList.toggle("hidden", !shouldShow);
  inlineGameHoleCard?.classList.toggle("hidden", !shouldShow || currentHole === 19);
  inlineGameScoreboardCard?.classList.toggle("hidden", !shouldShow);

  if (!shouldShow) {
    return;
  }

  syncInlineGameType();
  recalcInlineLinkedGame();

  if (inlineGameSetupTitle) {
    inlineGameSetupTitle.textContent = getLinkedGameType() === "bbb" ? "Players & Bet" : "Players & Payouts";
  }
  if (inlineGameSetupMeta) {
    inlineGameSetupMeta.textContent = getLinkedGameType() === "wolf"
      ? "Use the same player, option, and payout layout as the Wolf page."
      : getLinkedGameType() === "666"
        ? "Use the same player and payout layout as the Six-Six-Six page."
        : "Use the same player and bet layout as the BBB page.";
  }
  if (inlineGameSetupShell) {
    inlineGameSetupShell.innerHTML = renderInlineGameSetupFields();
  }

  if (inlineGameHoleTitle) {
    inlineGameHoleTitle.textContent = "Hole Setup & Results";
  }
  if (inlineGameHoleMeta) {
    inlineGameHoleMeta.textContent = getInlineGameRoundMeta();
  }

  if (inlineGameHoleShell) {
    if (getLinkedGameType() === "666") {
      inlineGameHoleShell.innerHTML = renderInline666HoleFields();
    } else if (getLinkedGameType() === "bbb") {
      inlineGameHoleShell.innerHTML = renderInlineBBBHoleFields();
      const holeState = getInlineBBBHole();
      const bingoSelect = document.getElementById("inlineBBBBingo");
      const bangoSelect = document.getElementById("inlineBBBBango");
      const bongoSelect = document.getElementById("inlineBBBBongo");
      if (bingoSelect) bingoSelect.value = holeState.bingo === null ? "" : String(holeState.bingo);
      if (bangoSelect) bangoSelect.value = holeState.bango === null ? "" : String(holeState.bango);
      if (bongoSelect) bongoSelect.value = holeState.bongo === null ? "" : String(holeState.bongo);
    } else {
      inlineGameHoleShell.innerHTML = renderInlineWolfHoleFields();
      const holeState = getInlineWolfHole();
      const setupSelect = document.getElementById("inlineWolfHoleSetup");
      let currentSetupValue = "";
      if ((holeState.mode === "team" || holeState.mode === "dump") && holeState.partner !== null && holeState.partner !== undefined) {
        currentSetupValue = `partner-${holeState.partner}`;
      } else if (holeState.mode === "lone") {
        currentSetupValue = "lone";
      } else if (holeState.mode === "blind") {
        currentSetupValue = "blind";
      }
      if (setupSelect) setupSelect.value = currentSetupValue;
    }
  }

  renderInlineGameScoreboard();
}

function handleInlineGameSetupEvent(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement) || getSessionModeValue() !== "round+game") return;

  syncInlineGameType();

  if (target instanceof HTMLInputElement && target.dataset.inlinePlayerIndex) {
    const playerIndex = Number(target.dataset.inlinePlayerIndex);
    inlineLinkedGameState.players[playerIndex] = target.value.trim() || `Player ${playerIndex + 1}`;
    recalcInlineLinkedGame();
    renderInlineLinkedGameUI();
    return;
  }

  if (!("dataset" in target) || !target.dataset.inlineField) return;

  const field = target.dataset.inlineField;
  if (field === "trackedPlayerIndex") {
    inlineLinkedGameState.trackedPlayerIndex = target.value === "" ? null : Number(target.value);
  } else if (target instanceof HTMLInputElement && target.type === "checkbox") {
    inlineLinkedGameState[field] = target.checked;
  } else if (field === "tieSetPoints") {
    inlineLinkedGameState[field] = target.value === "" ? null : Number(target.value);
  } else if (field === "bet" || field === "dollarValue") {
    inlineLinkedGameState[field] = Number(target.value) || 0;
  } else {
    inlineLinkedGameState[field] = Number(target.value) || 0;
  }

  recalcInlineLinkedGame();
  renderInlineLinkedGameUI();

  if (currentHole === 19 && isResultsSummaryVisible()) {
    showResultsSummary();
  }
}

function handleInlineWolfHoleEvent(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const holeState = getInlineWolfHole();
  const isChangeEvent = event.type === "change";

  if (target instanceof HTMLSelectElement && target.dataset.inlineWolfField === "wolf") {
    if (!isChangeEvent) return;
    holeState.wolf = Number(target.value) || 0;
    holeState.partner = null;
    holeState.mode = null;
    holeState.result = null;
    inlineLinkedGameState.currentWolfIndex = holeState.wolf;
    recalcInlineLinkedGame();
    renderInlineLinkedGameUI();
    return;
  }

  if (target instanceof HTMLSelectElement && target.dataset.inlineWolfField === "setup") {
    if (!isChangeEvent) return;
    const value = target.value;
    holeState.result = null;

    if (!value) {
      holeState.mode = null;
      holeState.partner = null;
    } else if (value.startsWith("partner-")) {
      holeState.mode = "team";
      holeState.partner = Number(value.split("-")[1]);
    } else if (value === "lone" && inlineLinkedGameState.loneEnabled) {
      holeState.mode = "lone";
      holeState.partner = null;
    } else if (value === "blind" && inlineLinkedGameState.blindEnabled) {
      holeState.mode = "blind";
      holeState.partner = null;
    } else {
      holeState.mode = null;
      holeState.partner = null;
    }

    recalcInlineLinkedGame();
    renderInlineLinkedGameUI();
    return;
  }

  if (target instanceof HTMLInputElement && target.dataset.inlineWolfField === "birdieDouble") {
    if (!isChangeEvent) return;
    holeState.birdieDouble = target.checked;
    recalcInlineLinkedGame();
    renderInlineGameScoreboard();
    return;
  }

  if (target instanceof HTMLElement && target.dataset.inlineWolfBirdie) {
    if (isChangeEvent) return;
    holeState.birdieDouble = target.dataset.inlineWolfBirdie === "yes";
    recalcInlineLinkedGame();
    renderInlineLinkedGameUI();
    return;
  }

  if (target instanceof HTMLElement && target.dataset.inlineWolfAction) {
    if (isChangeEvent) return;
    holeState.mode = target.dataset.inlineWolfAction === "dump" ? "dump" : "team";
    holeState.result = null;
    recalcInlineLinkedGame();
    renderInlineLinkedGameUI();
    return;
  }

  if (target instanceof HTMLElement && target.dataset.inlineWolfResult) {
    if (isChangeEvent) return;
    holeState.result = target.dataset.inlineWolfResult;
    recalcInlineLinkedGame();
    renderInlineLinkedGameUI();
  }
}

function handleInline666HoleEvent(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.inline666Result) {
    getInline666Hole().result = target.dataset.inline666Result;
    recalcInlineLinkedGame();
    renderInlineLinkedGameUI();
  }
}

function handleInlineBBBHoleEvent(event) {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement) || !target.dataset.inlineBbbField) return;

  const field = target.dataset.inlineBbbField;
  getInlineBBBHole()[field] = target.value === "" ? null : Number(target.value);
  recalcInlineLinkedGame();
  renderInlineLinkedGameUI();
}

function getLinkedGameDraftSummary() {
  if (!sessionApi || !activeRoundSessionId || getSessionModeValue() !== "round+game") {
    return null;
  }

  return sessionApi.getGameDraftSummary?.(getLinkedGameType(), activeRoundSessionId) || null;
}

function closeRoundSessionModal() {
  if (!roundSessionModalEl || !window.bootstrap?.Modal) return;

  const activeEl = document.activeElement;
  if (activeEl instanceof HTMLElement && roundSessionModalEl.contains(activeEl)) {
    activeEl.blur();
  }

  window.bootstrap.Modal.getOrCreateInstance(roundSessionModalEl).hide();
}

function syncRoundSessionPickerState() {
  const sessionChoice = sessionModeSelect?.value || "roundOnly";
  const gameType = linkedGameTypeSelect?.value || "wolf";

  sessionChoiceButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sessionChoice === sessionChoice);
  });

  linkedGameButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.linkedGame === gameType);
  });
}

function cloneHoleState(source) {
  return JSON.parse(JSON.stringify(source || {}));
}

function getRoundSessionMeta() {
  const selectedTee = getSelectedTee();
  return {
    courseId: currentCourseId,
    courseName: getCourseDisplayName(),
    teeName: selectedTee?.name || customTeeName?.value || teeName?.value || "White",
    roundDate: roundDate?.value || new Date().toISOString().slice(0, 10),
    roundNotes: roundNotes?.value?.trim() || "",
    currentHole
  };
}

function getRoundDraftPayload() {
  return {
    sessionId: activeRoundSessionId,
    sessionMode: sessionModeSelect?.value || "roundOnly",
    linkedGameType: getLinkedGameType(),
    currentHole,
    currentCourseId,
    roundDate: roundDate?.value || "",
    teeName: teeName?.value || "",
    roundNotes: roundNotes?.value || "",
    customCourseName: customCourseName?.value || "",
    customTeeName: customTeeName?.value || "",
    customCourseRating: customCourseRating?.value || "",
    customSlopeRating: customSlopeRating?.value || "",
    holes: cloneHoleState(holes),
    savedRoundDocId
  };
}

function persistRoundDraft() {
  if (!sessionApi || !activeRoundSessionId) return;
  sessionApi.saveRoundDraft(activeRoundSessionId, getRoundDraftPayload());
}

function ensureInlineGameSessionTarget() {
  if (!sessionApi || getSessionModeValue() !== "round+game") return null;

  if (activeRoundSessionId) {
    return sessionApi.getActiveSession?.() || { sessionId: activeRoundSessionId };
  }

  const nextSession = sessionApi.startRoundSession({
    mode: "round+game",
    gameType: getLinkedGameType(),
    roundSaved: false,
    gameSaved: false,
    ...getRoundSessionMeta()
  });

  activeRoundSessionId = nextSession?.sessionId || null;

  if (activeRoundSessionId) {
    persistRoundDraft();
  }

  return nextSession || null;
}

function syncActiveRoundSession(patch = {}) {
  if (!sessionApi || !activeRoundSessionId) return null;

  const nextSession = sessionApi.updateActiveSession({
    sessionId: activeRoundSessionId,
    mode: "round+game",
    gameType: getLinkedGameType(),
    ...getRoundSessionMeta(),
    ...patch
  });

  activeRoundSessionId = nextSession?.sessionId || activeRoundSessionId;
  return nextSession;
}

function renderRoundSessionUI() {
  const isRoundGame = getSessionModeValue() === "round+game";
  const activeSession = sessionApi?.getActiveSession();
  const linkedSession = !!activeRoundSessionId;
  const activeGameType = activeSession?.gameType || getLinkedGameType();

  syncRoundSessionPickerState();
  linkedGameTypeWrap?.classList.toggle("hidden", !isRoundGame);
  continueLinkedGameBtn?.classList.add("hidden");
  clearRoundSessionBtn?.classList.toggle("hidden", !linkedSession);

  if (saveRoundSessionBtn) {
    saveRoundSessionBtn.textContent = isRoundGame ? "Save Session Setup" : "Keep Round Only";
  }

  if (openRoundSessionModalBtn) {
    openRoundSessionModalBtn.textContent = linkedSession ? "Manage Linked Session" : "Round + Game Options";
  }

  if (launchLinkedGameBtn) {
    launchLinkedGameBtn.classList.add("hidden");
  }

  if (!roundSessionStatus) return;

  if (linkedSession) {
    roundSessionStatus.textContent =
      `${getLinkedGameLabel(activeGameType)} is linked to this round and now runs directly inside the scorecard below.`;
    renderInlineLinkedGameUI();
    return;
  }

  roundSessionStatus.textContent = isRoundGame
    ? `${getLinkedGameLabel()} will appear right under Round Setup and use the same hole number as the scorecard.`
    : "Round only keeps your scorecard by itself. Round + Game links this round to Wolf, 666, or BBB.";
  renderInlineLinkedGameUI();
}

function applyRoundDraft(draft) {
  if (!draft || typeof draft !== "object") return false;

  currentHole = Number(draft.currentHole) || 1;
  currentCourseId = draft.currentCourseId || currentCourseId;
  savedRoundDocId = draft.savedRoundDocId || null;
  holes = cloneHoleState(draft.holes || {});

  allHoleNumbers().forEach((holeNumber) => {
    if (!holes[holeNumber]) {
      holes[holeNumber] = createHoleData();
    }
  });

  populateCourseSelect();
  courseSelect.value = currentCourseId;
  updateCourseModeUI();

  if (!isCustomCourse()) {
    populateTeeSelect();
    if (teeName && draft.teeName) teeName.value = draft.teeName;
  }

  if (roundDate && draft.roundDate) roundDate.value = draft.roundDate;
  if (roundNotes) roundNotes.value = draft.roundNotes || "";
  if (customCourseName) customCourseName.value = draft.customCourseName || "";
  if (customTeeName && draft.customTeeName) customTeeName.value = draft.customTeeName;
  if (customCourseRating) customCourseRating.value = draft.customCourseRating || "";
  if (customSlopeRating) customSlopeRating.value = draft.customSlopeRating || "";
  if (sessionModeSelect && draft.sessionMode) sessionModeSelect.value = draft.sessionMode;
  if (linkedGameTypeSelect && draft.linkedGameType) linkedGameTypeSelect.value = draft.linkedGameType;

  if (currentHole === 19) {
    showResultsSummary();
  } else {
    hideResultsSummary();
    render();
  }

  renderRoundSessionUI();
  return true;
}

function isFinishedRoundDraft(draft) {
  return Number(draft?.currentHole) === 19;
}

function clearActiveRoundDraftState() {
  if (!sessionApi || !activeRoundSessionId) return;

  sessionApi.clearRoundDraft(activeRoundSessionId);
  ["wolf", "666", "bbb"].forEach((gameType) => {
    sessionApi.clearGameDraft?.(gameType, activeRoundSessionId);
  });
  sessionApi.clearActiveSession?.();
  activeRoundSessionId = null;
}

function restoreActiveRoundSession() {
  if (!sessionApi || !activeRoundSessionId) return false;

  isRestoringRoundSession = true;
  const activeSession = sessionApi.getActiveSession();
  if (sessionModeSelect) sessionModeSelect.value = "roundGame";
  if (linkedGameTypeSelect && activeSession?.gameType) {
    linkedGameTypeSelect.value = activeSession.gameType;
  }

  const draft = sessionApi.loadRoundDraft(activeRoundSessionId);
  if (draft) {
    if (isFinishedRoundDraft(draft)) {
      clearActiveRoundDraftState();
      isRestoringRoundSession = false;
      return false;
    }

    const restored = applyRoundDraft(draft);
    restoreInlineGameDraft();
    isRestoringRoundSession = false;
    if (currentHole === 19 && isResultsSummaryVisible()) {
      showResultsSummary();
    } else {
      render();
    }
    return restored;
  }

  restoreInlineGameDraft();
  isRestoringRoundSession = false;
  renderRoundSessionUI();
  return false;
}

function ensureLinkedRoundSession() {
  if (!sessionApi) return null;

  const nextSession = sessionApi.startRoundSession({
    sessionId: activeRoundSessionId || undefined,
    mode: "round+game",
    gameType: getLinkedGameType(),
    roundSaved: false,
    gameSaved: false,
    ...getRoundSessionMeta()
  });

  activeRoundSessionId = nextSession.sessionId;
  persistRoundDraft();
  restoreInlineGameDraft();
  renderRoundSessionUI();
  return nextSession;
}

function saveRoundSessionChoice() {
  if (!sessionApi) {
    closeRoundSessionModal();
    return true;
  }

  if (getSessionModeValue() !== "round+game") {
    if (activeRoundSessionId) {
      const confirmed = window.confirm("Switch back to round only and clear the linked round + game session?");
      if (!confirmed) return false;

      sessionApi.clearSessionArtifacts(activeRoundSessionId);
      activeRoundSessionId = null;
    }

    syncInlineGameType(true);
    renderRoundSessionUI();
    closeRoundSessionModal();
    return true;
  }

  ensureLinkedRoundSession();
  restoreInlineGameDraft();
  closeRoundSessionModal();
  return true;
}

function startOrContinueLinkedGame() {
  ensureLinkedRoundSession();
  renderInlineLinkedGameUI();
  inlineGameSetupCard?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setRoundPrevButtonLabel() {
  if (!prevHoleBtn) return;
  prevHoleBtn.innerHTML = `<span class="nav-arrow" aria-hidden="true">&larr;</span><span>Back</span>`;
}

function setRoundNextButtonLabel(mode = "next") {
  if (!nextHoleBtn) return;

  if (mode === "finish") {
    nextHoleBtn.innerHTML = `<span>Finish</span>`;
    return;
  }

  if (mode === "results") {
    nextHoleBtn.innerHTML = `<span>Results</span>`;
    return;
  }

  nextHoleBtn.innerHTML = `<span>Next</span><span class="nav-arrow" aria-hidden="true">&rarr;</span>`;
}

function renderFullscreenSessionSwitchTab() {
  document.getElementById("roundFullscreenSessionTab")?.remove();
}

function syncFullscreenScrollLock() {
  const fullscreen = selectionWrapper?.classList.contains("fullscreen");
  document.documentElement.classList.toggle("gfg-round-fullscreen-lock", !!fullscreen);
  body.classList.toggle("fullscreen-active", !!fullscreen);
  body.classList.toggle("no-scroll", !!fullscreen);

  if (fullscreenContent) {
    fullscreenContent.style.pointerEvents = "auto";
  }

  if (!fullscreen) {
    renderFullscreenSessionSwitchTab();
    return;
  }

  renderFullscreenSessionSwitchTab();
}

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
  const fullscreen = selectionWrapper?.classList.contains("fullscreen");

  if (fullscreen) {
    fullscreenBtn.innerText = "Close Fullscreen";
  } else {
    fullscreenBtn.innerText = "Fullscreen Selection";
  }

  syncFullscreenScrollLock();
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
  savedRoundDocId = null;

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
  if (holeTitle) holeTitle.textContent = `Hole ${currentHole}`;
  if (holeMeta) holeMeta.textContent = "";
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
  const selectedTee = getSelectedTee();
  const courseName = getCourseDisplayName();

  if (sumThru) sumThru.textContent = summary.holesCounted;
  if (sumScore) sumScore.textContent = summary.totalStrokes;
  if (sumVsPar) sumVsPar.textContent = formatVsPar(summary.vsPar);
  if (sumPutts) sumPutts.textContent = summary.totalPutts;
  if (sumFir) sumFir.textContent = `${summary.firPct}%`;
  if (sumGir) sumGir.textContent = `${summary.girPct}%`;
  if (sumCourseMeta) sumCourseMeta.textContent = `${courseName} - ${selectedTee.name} Tees`;
}

function render() {
  setRoundPrevButtonLabel();
  renderRoundSessionUI();
  if (activeRoundSessionId) {
    syncActiveRoundSession();
  }

  if (currentHole === 19) {
    if (holeTitle) holeTitle.textContent = "19th Hole";
    if (holeMeta) holeMeta.textContent = "Round Results";
    setRoundNextButtonLabel("results");
    updateScoreboard();
    renderInlineLinkedGameUI();
    persistInlineGameDraft();
    persistRoundDraft();
    return;
  }

  updateCourseModeUI();
  updateHoleMeta();
  updateCounters();
  updateSelects();
  updateHoleSummary();
  updateScoreboard();

  setRoundNextButtonLabel(currentHole < 18 ? "next" : "finish");
  renderInlineLinkedGameUI();
  persistRoundDraft();
}

function recalc() {
  updateHoleSummary();
  updateScoreboard();
  renderInlineLinkedGameUI();
  persistRoundDraft();
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
    selectionWrapper?.appendChild(resultsCard);
  }

  if (roundResultsFeedbackCard) {
    roundResultsFeedbackCard.classList.add("hidden");
  }

  if (roundResultsFeedbackInsights) {
    roundResultsFeedbackInsights.innerHTML = "";
  }

  if (holeSetupCard) holeSetupCard.style.display = "block";
  if (holeNavCard) holeNavCard.style.display = "block";
  if (scoreboardCard) scoreboardCard.style.display = "block";
  if (inlineGameHoleCard && getSessionModeValue() === "round+game") inlineGameHoleCard.style.display = "block";
  if (inlineGameScoreboardCard && getSessionModeValue() === "round+game") inlineGameScoreboardCard.style.display = "block";
  syncFullscreenScrollLock();
}

function isResultsSummaryVisible() {
  return !!resultsCard && !resultsCard.classList.contains("hidden");
}

async function saveRoundToAccount(statusEl) {
  if (statusEl) statusEl.textContent = "";

  const user = firebase?.auth?.().currentUser;
  if (!user) {
    if (statusEl) statusEl.textContent = "Please log in to save your round.";
    return null;
  }

  if (savedRoundDocId) {
    if (statusEl) statusEl.textContent = "Round already saved to your account.";
    return savedRoundDocId;
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
    sessionId: getSessionModeValue() === "round+game" ? activeRoundSessionId : null,
    sessionMode: getSessionModeValue(),
    linkedGameType: getSessionModeValue() === "round+game" ? getLinkedGameType() : null,
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
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    const docRef = await firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .collection("savedRounds")
      .add(roundPayload);

    savedRoundDocId = docRef.id;
    if (activeRoundSessionId && getSessionModeValue() === "round+game" && sessionApi) {
      const completion = sessionApi.completeSessionPart("round", { docId: docRef.id });
      if (completion.completed) {
        activeRoundSessionId = null;
        renderRoundSessionUI();
      } else {
        sessionApi.clearRoundDraft(activeRoundSessionId);
        syncActiveRoundSession({ roundSaved: true, roundDocId: docRef.id });
      }
    }
    if (statusEl) statusEl.textContent = "Round saved to your account!";
    return docRef.id;
  } catch (error) {
    console.error(error);
    if (statusEl) statusEl.textContent = "Error saving round.";
    return null;
  }
}

async function saveRoundAndLinkedGame(statusEl) {
  if (statusEl) statusEl.textContent = "";

  persistInlineGameDraft();

  const user = firebase?.auth?.().currentUser;
  if (!user) {
    if (statusEl) statusEl.textContent = "Please log in to save the game!";
    return null;
  }

  const linkedSummary = getLinkedGameDraftSummary();
  if (!linkedSummary?.exists) {
    if (statusEl) statusEl.textContent = "Enter the linked game scores in the scorecard first.";
    return null;
  }

  if (!linkedSummary.finished) {
    if (statusEl) statusEl.textContent = `Finish ${getLinkedGameLabel(linkedSummary.gameType)} before saving both.`;
    return null;
  }

  if (!linkedSummary.hasTrackedPlayer) {
    if (statusEl) statusEl.textContent = `Choose your player slot in ${getLinkedGameLabel(linkedSummary.gameType)} before saving both.`;
    return null;
  }

  if (statusEl) statusEl.textContent = "Saving round data...";
  const roundDocId = await saveRoundToAccount(statusEl);
  if (!roundDocId) return null;

  if (statusEl) statusEl.textContent = `Saving ${getLinkedGameLabel(linkedSummary.gameType)} data...`;
  try {
    const result = await sessionApi.saveLinkedGameForCurrentUser?.(linkedSummary.gameType, activeRoundSessionId);
    if (!result?.ok) {
      if (statusEl) statusEl.textContent = result?.message || "Error saving linked game.";
      return null;
    }

    activeRoundSessionId = null;
    renderRoundSessionUI();
    syncFullscreenScrollLock();
    if (statusEl) {
      statusEl.textContent = `${getLinkedGameSaveLabel(linkedSummary.gameType)} game saved! Round + game session complete.`;
    }
    return { roundDocId, gameDocId: result.docId };
  } catch (error) {
    console.error(error);
    if (statusEl) statusEl.textContent = "Round saved, but there was an error saving the linked game.";
    return null;
  }
}

async function handleResultsSaveAction(statusEl, options = {}) {
  const redirectToLockerRoom = !!options.redirectToLockerRoom;
  const requiresJointSave = getSessionModeValue() === "round+game";

  const saveResult = requiresJointSave
    ? await saveRoundAndLinkedGame(statusEl)
    : await saveRoundToAccount(statusEl);

  if (redirectToLockerRoom && saveResult) {
    window.location.href = "../playerlog.html";
  }

  return saveResult;
}

function showResultsSummary() {
  persistInlineGameDraft();

  const summary = getRoundSummary();
  const courseName = getCourseDisplayName();
  const insights = buildFeedback(summary);
  const linkedGameSummary = getLinkedGameDraftSummary();
  const isRoundGame = getSessionModeValue() === "round+game";
  const canSaveBoth = !!linkedGameSummary?.readyToSave;
  const linkedGameStatus = isRoundGame
    ? linkedGameSummary?.exists
      ? linkedGameSummary.readyToSave
        ? `${getLinkedGameLabel(linkedGameSummary.gameType)} is finished and ready to save with this round.`
        : linkedGameSummary.finished
          ? `Choose your player slot in ${getLinkedGameLabel(linkedGameSummary.gameType)} before saving both.`
          : `Finish ${getLinkedGameLabel(linkedGameSummary.gameType)} to unlock one-tap save for both.`
      : `Finish setting up ${getLinkedGameLabel()} below before saving both.`
    : "";

  if (holeSetupCard) holeSetupCard.style.display = "none";
  if (holeNavCard) holeNavCard.style.display = "none";
  if (scoreboardCard) scoreboardCard.style.display = "none";
  if (inlineGameHoleCard) inlineGameHoleCard.style.display = "none";
  if (inlineGameScoreboardCard) inlineGameScoreboardCard.style.display = "none";

  if (!resultsCard) return;

  selectionWrapper?.appendChild(resultsCard);
  resultsCard.className = "card game-card p-4 mb-3 text-center gfg-finish-card round-results-card";
  resultsCard.classList.remove("hidden");
  resultsCard.innerHTML = `
    <div class="gfg-finish-shell">
      <div class="gfg-finish-confetti" aria-hidden="true"></div>

      <div class="gfg-finish-inner">
        <h2 class="mb-2 gfg-finish-title">&#127881; 19th Hole - Round Complete! &#127881;</h2>
        <p class="gfg-finish-subtitle mb-4">${courseName}</p>

        <div class="row g-3 mb-4 gfg-finish-grid round-results-grid">
          <div class="col-6">
            <div class="gfg-finish-pill">
              <span class="gfg-finish-label">Total</span>
              <div class="gfg-finish-value">${summary.totalStrokes}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="gfg-finish-pill">
              <span class="gfg-finish-label">vs Par</span>
              <div class="gfg-finish-value">${formatVsPar(summary.vsPar)}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="gfg-finish-pill">
              <span class="gfg-finish-label">Putts</span>
              <div class="gfg-finish-value">${summary.totalPutts}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="gfg-finish-pill">
              <span class="gfg-finish-label">FIR</span>
              <div class="gfg-finish-value">${summary.firHits}/${summary.firChances} (${summary.firPct}%)</div>
            </div>
          </div>
          <div class="col-6">
            <div class="gfg-finish-pill">
              <span class="gfg-finish-label">GIR</span>
              <div class="gfg-finish-value">${summary.girHits}/${summary.holesCounted || 18} (${summary.girPct}%)</div>
            </div>
          </div>
          <div class="col-6">
            <div class="gfg-finish-pill">
              <span class="gfg-finish-label">Penalty Strokes</span>
              <div class="gfg-finish-value">${summary.penalties}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="gfg-finish-pill">
              <span class="gfg-finish-label">Bunker Shots</span>
              <div class="gfg-finish-value">${summary.bunkers}</div>
            </div>
          </div>
        </div>

        ${linkedGameStatus ? `<div class="round-linked-game-note mb-3">${linkedGameStatus}</div>` : ""}

        <div class="gfg-results-actions round-results-actions mb-4">
          <button id="resultsSaveRoundBtn" type="button" class="gfg-pill-btn" ${isRoundGame && !canSaveBoth ? "disabled" : ""}>${isRoundGame ? "Save Round + Game To LabRoom" : "Save Round Data"}</button>
          <button id="resultsBackToLockerRoomBtn" type="button" class="gfg-pill-btn" ${isRoundGame && !canSaveBoth ? "disabled" : ""}>${isRoundGame ? "LabRoom" : "Back to LabRoom"}</button>
          <a href="../index.html" class="gfg-pill-btn">Back to Home</a>
        </div>
        <div id="resultsSaveRoundStatus" class="text-center mb-4 fw-bold"></div>
      </div>
    </div>
  `;

  if (roundResultsFeedbackInsights) {
    roundResultsFeedbackInsights.innerHTML = insights
      .map((line) => `<div class="insight-line">${line}</div>`)
      .join("");
  }

  if (roundResultsFeedbackCard) {
    roundResultsFeedbackCard.classList.remove("hidden");
  }

  const resultsSaveRoundBtn = document.getElementById("resultsSaveRoundBtn");
  const resultsBackToLockerRoomBtn = document.getElementById("resultsBackToLockerRoomBtn");
  const resultsSaveRoundStatus = document.getElementById("resultsSaveRoundStatus");

  if (resultsSaveRoundStatus) resultsSaveRoundStatus.textContent = "";

  if (resultsSaveRoundBtn) {
    resultsSaveRoundBtn.onclick = async () => {
      resultsSaveRoundBtn.setAttribute("disabled", "disabled");
      resultsBackToLockerRoomBtn?.setAttribute("disabled", "disabled");
      await handleResultsSaveAction(resultsSaveRoundStatus, {
        redirectToLockerRoom: isRoundGame
      });
      resultsSaveRoundBtn.removeAttribute("disabled");
      resultsBackToLockerRoomBtn?.removeAttribute("disabled");
    };
  }

  if (resultsBackToLockerRoomBtn) {
    resultsBackToLockerRoomBtn.onclick = async (event) => {
      event.preventDefault();
      resultsSaveRoundBtn?.setAttribute("disabled", "disabled");
      resultsBackToLockerRoomBtn.setAttribute("disabled", "disabled");
      await handleResultsSaveAction(resultsSaveRoundStatus, {
        redirectToLockerRoom: true
      });
      resultsSaveRoundBtn?.removeAttribute("disabled");
      resultsBackToLockerRoomBtn.removeAttribute("disabled");
    };
  }

  runConfetti();
  syncFullscreenScrollLock();
  resultsCard.scrollIntoView({ behavior: "smooth", block: "start" });
}
courseSelect?.addEventListener("change", () => {
  currentCourseId = courseSelect.value;
  if (!isCustomCourse()) populateTeeSelect();
  resetRoundForCourse();
});

teeName?.addEventListener("change", render);
roundDate?.addEventListener("change", () => {
  if (activeRoundSessionId) {
    syncActiveRoundSession();
    persistRoundDraft();
  }
});
roundNotes?.addEventListener("input", () => {
  if (activeRoundSessionId) {
    syncActiveRoundSession();
    persistRoundDraft();
  }
});

customCourseName?.addEventListener("input", render);
customTeeName?.addEventListener("change", render);
customCourseRating?.addEventListener("input", render);
customSlopeRating?.addEventListener("input", render);
openRoundSessionModalBtn?.addEventListener("click", () => {
  lastRoundSessionTriggerEl = openRoundSessionModalBtn;
  renderRoundSessionUI();
});
sessionChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (sessionModeSelect) {
      sessionModeSelect.value = button.dataset.sessionChoice === "roundGame" ? "roundGame" : "roundOnly";
    }
    renderRoundSessionUI();
  });
});
linkedGameButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const previousType = getLinkedGameType();
    const nextType = sessionApi?.normalizeGameType(button.dataset.linkedGame || "wolf") || "wolf";

    if (activeRoundSessionId && previousType !== nextType && hasInlineGameData()) {
      const confirmed = window.confirm(`Switch linked game from ${getLinkedGameLabel(previousType)} to ${getLinkedGameLabel(nextType)} and clear the current linked game entries?`);
      if (!confirmed) return;
      sessionApi?.clearGameDraft(previousType, activeRoundSessionId);
    }

    if (linkedGameTypeSelect) {
      linkedGameTypeSelect.value = nextType;
    }

    syncInlineGameType(previousType !== nextType);

    if (activeRoundSessionId) {
      syncActiveRoundSession({ gameType: getLinkedGameType(), gameSaved: false, gameDocId: null });
      if (previousType !== nextType) {
        persistInlineGameDraft();
      }
      persistRoundDraft();
    }

    renderRoundSessionUI();
  });
});
sessionModeSelect?.addEventListener("change", () => {
  if (getSessionModeValue() !== "round+game") {
    renderRoundSessionUI();
    return;
  }

  if (activeRoundSessionId) {
    syncActiveRoundSession();
  }
  renderRoundSessionUI();
});
linkedGameTypeSelect?.addEventListener("change", () => {
  const nextType = getLinkedGameType();
  syncInlineGameType(true);
  if (activeRoundSessionId) {
    syncActiveRoundSession({ gameType: nextType, gameSaved: false, gameDocId: null });
    persistInlineGameDraft();
    persistRoundDraft();
  }
  renderRoundSessionUI();
});
saveRoundSessionBtn?.addEventListener("click", () => {
  saveRoundSessionChoice();
});
launchLinkedGameBtn?.addEventListener("click", () => {
  startOrContinueLinkedGame();
});
continueLinkedGameBtn?.addEventListener("click", (event) => {
  if (!activeRoundSessionId) return;
  event.preventDefault();
  startOrContinueLinkedGame();
});
clearRoundSessionBtn?.addEventListener("click", () => {
  if (!sessionApi || !activeRoundSessionId) return;

  const confirmed = window.confirm("Clear this linked round session and remove the in-progress shared draft?");
  if (!confirmed) return;

  sessionApi.clearSessionArtifacts(activeRoundSessionId);
  activeRoundSessionId = null;
  syncInlineGameType(true);
  if (sessionModeSelect) sessionModeSelect.value = "roundOnly";
  renderRoundSessionUI();
  closeRoundSessionModal();
});

inlineGameSetupShell?.addEventListener("change", handleInlineGameSetupEvent);
inlineGameHoleShell?.addEventListener("click", (event) => {
  if (getLinkedGameType() === "666") {
    handleInline666HoleEvent(event);
    return;
  }

  if (getLinkedGameType() === "bbb") {
    return;
  }

  handleInlineWolfHoleEvent(event);
});
inlineGameHoleShell?.addEventListener("change", (event) => {
  if (getLinkedGameType() === "bbb") {
    handleInlineBBBHoleEvent(event);
    return;
  }

  if (getLinkedGameType() === "666") {
    return;
  }

  handleInlineWolfHoleEvent(event);
});

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
    return;
  }

  if (currentHole === 18) {
    currentHole = 19;
    render();
    showResultsSummary();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  roundSessionModalEl?.addEventListener("show.bs.modal", (event) => {
    lastRoundSessionTriggerEl =
      event.relatedTarget instanceof HTMLElement
        ? event.relatedTarget
        : openRoundSessionModalBtn;
  });

  roundSessionModalEl?.addEventListener("hidden.bs.modal", () => {
    const fallbackTarget = lastRoundSessionTriggerEl || openRoundSessionModalBtn;
    if (fallbackTarget instanceof HTMLElement) {
      window.setTimeout(() => fallbackTarget.focus(), 0);
    }
  });

  populateCourseSelect();
  populateTeeSelect();

  if (roundDate) {
    roundDate.value = new Date().toISOString().slice(0, 10);
  }

  allHoleNumbers().forEach(holeNumber => {
    holes[holeNumber] = createHoleData();
  });

  const restored = restoreActiveRoundSession();
  if (!restored) {
    render();
    renderRoundSessionUI();
  }

  syncFullscreenScrollLock();
});
