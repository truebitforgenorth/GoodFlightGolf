// =====================================================
// MYFLIGHT - SAVED ROUND DATA + COURSE DATA + SAVED GAMES
// Adds:
// 1) Individual round delete
// 2) Show More / Show Less for long round history
// 3) Saved game totals + saved game history on playerlog.html
// =====================================================

window.addEventListener("DOMContentLoaded", () => {
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
  const shotPatternLoggedIn = document.getElementById("shotPatternLoggedIn");
  const shotPatternSummary = document.getElementById("shotPatternSummary");
  const shotPatternStatus = document.getElementById("shotPatternStatus");
  const shotPatternChartCanvas = document.getElementById("shotPatternChart");
  const shotPatternTabs = Array.from(document.querySelectorAll(".shot-pattern-tab"));

  const gameTotalsLoggedIn = document.getElementById("gameTotalsLoggedIn");
  const gamesPlayedLoggedIn = document.getElementById("gamesPlayedLoggedIn");
  const loginToUseGameData = document.getElementById("loginToUseGameData");
  const savedGameDataShell = document.getElementById("savedGameDataShell");

  const wolfMoneyTotal = document.getElementById("wolfMoneyTotal");
  const wolfPointsTotal = document.getElementById("wolfPointsTotal");
  const sixesMoneyTotal = document.getElementById("sixesMoneyTotal");
  const sixesPointsTotal = document.getElementById("sixesPointsTotal");
  const bbbMoneyTotal = document.getElementById("bbbMoneyTotal");
  const bbbPointsTotal = document.getElementById("bbbPointsTotal");
  const gamesPlayedList = document.getElementById("gamesPlayedList");

  const loginToUsePlayerData = document.getElementById("loginToUsePlayerData");
  const playerDataShell = document.getElementById("playerDataShell");

  const INITIAL_ROUNDS_TO_SHOW = 4;
  const INITIAL_GAMES_TO_SHOW = 5;

  let currentUser = null;
  let allRounds = [];
  let allGames = [];
  let roundsExpanded = false;
  let gamesExpanded = false;
  let activeShotPatternView = "drive";
  let shotPatternChartInstance = null;

  function formatVsPar(value) {
    if (value === 0) return "E";
    return value > 0 ? `+${value}` : `${value}`;
  }

  function formatMoney(value) {
    const num = Number(value) || 0;
    const sign = num >= 0 ? "+" : "-";
    return `${sign}$${Math.abs(num).toFixed(2)}`;
  }

  function formatRoundDate(dateStr) {
    if (!dateStr) return "Unknown date";

    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString();
  }

  function formatTimestamp(timestamp) {
    try {
      if (timestamp?.toDate) return timestamp.toDate().toLocaleString();
      if (timestamp?.seconds) return new Date(timestamp.seconds * 1000).toLocaleString();
      if (typeof timestamp === "number") return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.warn("Could not format timestamp:", error);
    }
    return "Unknown time";
  }

  function getDocTimeValue(value) {
    try {
      if (value?.toDate) return value.toDate().getTime();
      if (typeof value?.seconds === "number") return value.seconds * 1000;
      if (typeof value === "number") return value;
    } catch (error) {
      console.warn("Could not read timestamp value:", error);
    }
    return 0;
  }

  function getRoundSortValue(round) {
    const explicitTime =
      getDocTimeValue(round?.timestamp) ||
      getDocTimeValue(round?.createdAt);

    if (explicitTime) return explicitTime;

    if (round?.roundDate) {
      const parsed = new Date(`${round.roundDate}T00:00:00`).getTime();
      if (!Number.isNaN(parsed)) return parsed;
    }

    return 0;
  }

  function getHandicapPreview(rounds) {
    const diffs = rounds
      .map((round) =>
        typeof round.handicapDifferential === "number"
          ? round.handicapDifferential
          : null
      )
      .filter((value) => value !== null)
      .sort((a, b) => a - b);

    if (!diffs.length) return null;

    const sample = diffs.slice(0, Math.min(3, diffs.length));
    const average =
      sample.reduce((sum, value) => sum + value, 0) / sample.length;

    return Number(average.toFixed(1));
  }

  function getRoundHolesCount(round) {
    if (Array.isArray(round.holes) && round.holes.length) {
      const activeCount = round.holes.filter(
        (hole) => hole && hole.isActive !== false
      ).length;
      return activeCount || round.holes.length;
    }

    if (typeof round.holesCounted === "number" && round.holesCounted > 0) {
      return round.holesCounted;
    }

    return 18;
  }

  function getShotPatternConfig(view, rounds) {
    const driveConfig = {
      title: "Driving Miss Pattern",
      emptyLabel: "tracked drives",
      labels: ["Missed Left", "Hit Fairway", "Missed Right", "Drive Bunker", "Penalty"],
      chartLabels: [["Missed", "Left"], ["Hit", "Fairway"], ["Missed", "Right"], ["Drive", "Bunker"], "Penalty"],
      keys: ["left", "fairway", "right", "bunker", "penalty"],
      colors: ["#c85746", "#359447", "#d97706", "#7c3aed", "#1f2937"],
      valueGetter: (hole) => String(hole?.drive || "").toLowerCase(),
      ignoreValues: ["", "none"]
    };

    const approachConfig = {
      title: "Approach Pattern",
      emptyLabel: "tracked approaches",
      labels: ["Left", "Hit Green", "Right", "Short", "Long", "Bunker"],
      chartLabels: ["Left", ["Hit", "Green"], "Right", "Short", "Long", "Bunker"],
      keys: ["left", "green", "right", "short", "long", "bunker"],
      colors: ["#c85746", "#359447", "#d97706", "#0ea5e9", "#8b5cf6", "#1f2937"],
      valueGetter: (hole) => String(hole?.approach || "").toLowerCase(),
      ignoreValues: [""]
    };

    const config = view === "approach" ? approachConfig : driveConfig;
    const counts = Object.fromEntries(config.keys.map((key) => [key, 0]));

    rounds.forEach((round) => {
      const holes = Array.isArray(round?.holes) ? round.holes : [];

      holes.forEach((hole) => {
        if (!hole || hole.isActive === false) return;

        const value = config.valueGetter(hole);
        if (config.ignoreValues.includes(value)) return;
        if (!Object.prototype.hasOwnProperty.call(counts, value)) return;

        counts[value] += 1;
      });
    });

    const total = config.keys.reduce((sum, key) => sum + counts[key], 0);
    const percentages = config.keys.map((key) =>
      total ? Number(((counts[key] / total) * 100).toFixed(1)) : 0
    );

    const topKey = config.keys.reduce((bestKey, key) => {
      if (!bestKey) return key;
      return counts[key] > counts[bestKey] ? key : bestKey;
    }, config.keys[0] || "");

    return {
      ...config,
      counts,
      total,
      percentages,
      topLabel: total ? config.labels[config.keys.indexOf(topKey)] : ""
    };
  }

  function updateShotPatternTabState() {
    shotPatternTabs.forEach((button) => {
      const isActive = button.dataset.shotView === activeShotPatternView;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function renderShotPatternChart(rounds) {
    if (!shotPatternChartCanvas || !shotPatternSummary || !shotPatternStatus) return;

    updateShotPatternTabState();

    if (typeof Chart === "undefined") {
      shotPatternSummary.textContent = "Chart library unavailable.";
      shotPatternStatus.textContent = "Chart.js did not load on this page.";
      return;
    }

    const config = getShotPatternConfig(activeShotPatternView, rounds);
    const isMobileChart = window.innerWidth <= 767;

    if (shotPatternChartInstance) {
      shotPatternChartInstance.destroy();
      shotPatternChartInstance = null;
    }

    if (!config.total) {
      shotPatternSummary.textContent = `No ${config.emptyLabel} yet.`;
      shotPatternStatus.textContent = `Save rounds with ${activeShotPatternView === "drive" ? "drive" : "approach"} results to build this chart.`;
    } else {
      shotPatternSummary.textContent =
        `${config.title} - ${config.total} ${config.emptyLabel} across ${rounds.length} saved round${rounds.length === 1 ? "" : "s"}.`;
      shotPatternStatus.textContent =
        `${config.topLabel} is currently your most common ${activeShotPatternView === "drive" ? "driving" : "approach"} outcome.`;
    }

    const ctx = shotPatternChartCanvas.getContext("2d");
    const valueLabelPlugin = {
      id: "shotPatternValueLabels",
      afterDatasetsDraw(chart) {
        const { ctx: chartCtx } = chart;
        const meta = chart.getDatasetMeta(0);

        chartCtx.save();
        chartCtx.textAlign = "center";
        chartCtx.textBaseline = "middle";
        chartCtx.font = `${isMobileChart ? "700 10px" : "700 12px"} Poppins, sans-serif`;

        meta.data.forEach((bar, index) => {
          const value = config.percentages[index] || 0;
          if (!value) return;

          const x = bar.x;
          let y = bar.y + 14;
          let fill = "#ffffff";

          if (value < 8) {
            y = bar.y - 10;
            fill = "#1f2937";
          }

          chartCtx.fillStyle = fill;
          chartCtx.fillText(`${value}%`, x, y);
        });

        chartCtx.restore();
      }
    };

    shotPatternChartInstance = new Chart(ctx, {
      type: "bar",
      plugins: [valueLabelPlugin],
      data: {
        labels: config.chartLabels || config.labels,
        datasets: [
          {
            label: "% of tracked shots",
            data: config.percentages,
            backgroundColor: config.colors,
            borderRadius: 12,
            borderSkipped: false,
            maxBarThickness: isMobileChart ? 38 : 56
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: !isMobileChart,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            titleFont: {
              size: isMobileChart ? 12 : 14
            },
            bodyFont: {
              size: isMobileChart ? 12 : 13
            },
            callbacks: {
              title(items) {
                const idx = items?.[0]?.dataIndex ?? 0;
                return config.labels[idx] || "";
              },
              label(context) {
                const idx = context.dataIndex;
                const key = config.keys[idx];
                const count = config.counts[key] || 0;
                const pct = config.percentages[idx] || 0;
                return `${count} shot${count === 1 ? "" : "s"} (${pct}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              font: {
                size: isMobileChart ? 10 : 12
              },
              callback(value) {
                return `${value}%`;
              }
            },
            title: {
              display: true,
              text: "Percentage",
              font: {
                size: isMobileChart ? 11 : 12
              }
            }
          },
          x: {
            ticks: {
              maxRotation: 0,
              autoSkip: false,
              font: {
                size: isMobileChart ? 10 : 12
              },
              padding: isMobileChart ? 6 : 8
            }
          }
        }
      }
    });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeGameType(data) {
    const raw = (data?.gameType || data?.gameName || "").toString().toLowerCase();

    if (raw.includes("wolf")) return "wolf";
    if (raw.includes("666") || raw.includes("six") || raw.includes("sixes")) return "666";
    if (raw.includes("bbb") || raw.includes("bingo")) return "bbb";

    return "unknown";
  }

  function getGameLabel(data) {
    const type = normalizeGameType(data);
    if (type === "wolf") return "Wolf";
    if (type === "666") return "Six-Six-Six";
    if (type === "bbb") return "Bingo · Bango · Bongo";
    return "Saved Game";
  }

  function getGameMoneyFromData(game) {
    const points = getTrackedGamePoints(game);

    const type = normalizeGameType(game);

    if (type === "bbb") {
      const bet = Number(game?.bet) || 0;
      return points * bet;
    }

    const dollarValue = Number(game?.dollarValue) || 0;
    return points * dollarValue;
  }

  function getTrackedPlayerIndex(game) {
    const trackedIndex = Number(game?.trackedPlayerIndex);
    if (Number.isInteger(trackedIndex) && trackedIndex >= 0) {
      return trackedIndex;
    }

    return null;
  }

  function getTrackedGamePoints(game) {
    const totals = Array.isArray(game?.totals) ? game.totals : [];
    const trackedIndex = getTrackedPlayerIndex(game);

    if (trackedIndex !== null && trackedIndex < totals.length) {
      return Number(totals[trackedIndex]) || 0;
    }

    return totals.reduce((sum, value) => sum + (Number(value) || 0), 0);
  }

  function updateSummaryStats(rounds) {
    if (roundsSavedCount) roundsSavedCount.textContent = String(rounds.length);

    if (latestDifferential) {
      const latest = rounds.find(
        (round) => typeof round.handicapDifferential === "number"
      );
      latestDifferential.textContent = latest
        ? latest.handicapDifferential.toFixed(1)
        : "—";
    }

    if (handicapPreview) {
      const preview = getHandicapPreview(rounds);
      handicapPreview.textContent = preview !== null ? preview.toFixed(1) : "—";
    }
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

    const totals = rounds.reduce(
      (acc, round) => {
        acc.thru += getRoundHolesCount(round);
        acc.score += Number(round.totalScore) || 0;
        acc.vsPar += Number(round.vsPar) || 0;
        acc.putts += Number(round.totalPutts) || 0;
        acc.firHits += Number(round.firHits) || 0;
        acc.firChances += Number(round.firChances) || 0;
        acc.girHits += Number(round.girHits) || 0;
        return acc;
      },
      {
        thru: 0,
        score: 0,
        vsPar: 0,
        putts: 0,
        firHits: 0,
        firChances: 0,
        girHits: 0
      }
    );

    const firPct = totals.firChances
      ? Math.round((totals.firHits / totals.firChances) * 100)
      : 0;
    const girPct = totals.thru
      ? Math.round((totals.girHits / totals.thru) * 100)
      : 0;

    if (totalThruValue) totalThruValue.textContent = String(totals.thru);
    if (avgScoreValue) avgScoreValue.textContent = String(totals.score);
    if (totalVsParValue) totalVsParValue.textContent = formatVsPar(totals.vsPar);
    if (avgPuttsValue) avgPuttsValue.textContent = String(totals.putts);
    if (avgFirValue) avgFirValue.textContent = `${firPct}%`;
    if (avgGirValue) avgGirValue.textContent = `${girPct}%`;
  }

  function getVisibleRounds() {
    if (roundsExpanded) return allRounds;
    return allRounds.slice(0, INITIAL_ROUNDS_TO_SHOW);
  }

  function renderSavedRounds() {
    if (!savedRoundsList) return;

    if (!allRounds.length) {
      savedRoundsList.innerHTML = `
        <div class="card">
          <div class="card-body">
            <p class="mb-0">No saved rounds yet. Finish a round in The Scorecard and save it at the end of the round to see it here.</p>
          </div>
        </div>
      `;
      return;
    }

    const visibleRounds = getVisibleRounds();

    const roundsMarkup = visibleRounds
      .map(
        (round) => `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
              <div>
                <h5 class="mb-1">${escapeHtml(round.courseName || "Unknown Course")}</h5>
                <div class="text-muted small">
                  ${escapeHtml(formatRoundDate(round.roundDate))} - ${escapeHtml(round.teeName || "Tee not saved")}
                </div>
              </div>

              <div class="text-end">
                <div class="small text-muted">Round</div>
                <div class="fw-bold mb-2">${
                  round.roundType === "scoretracker" ? "The Scorecard" : "Saved Round"
                }</div>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger delete-round-btn"
                  data-round-id="${escapeHtml(round.id)}"
                >
                  Delete
                </button>
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
                  <div class="fw-bold">${
                    typeof round.vsPar === "number" ? formatVsPar(round.vsPar) : "E"
                  }</div>
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

            ${
              round.roundNotes
                ? `<p class="mt-3 mb-0"><strong>Notes:</strong> ${escapeHtml(round.roundNotes)}</p>`
                : ""
            }
          </div>
        </div>
      `
      )
      .join("");

    const toggleMarkup =
      allRounds.length > INITIAL_ROUNDS_TO_SHOW
        ? `
        <div class="d-flex justify-content-center mt-3">
          <button type="button" id="toggleRoundsBtn" class="gfg-pill-btn">
            ${roundsExpanded ? "Show Less Rounds" : `Show More Rounds (${allRounds.length - INITIAL_ROUNDS_TO_SHOW} more)`}
          </button>
        </div>
      `
        : "";

    savedRoundsList.innerHTML = `
      <div class="mb-3">
        <div class="small text-muted">
          Showing ${visibleRounds.length} of ${allRounds.length} saved rounds
        </div>
      </div>
      ${roundsMarkup}
      ${toggleMarkup}
    `;

    bindRoundButtons();
  }

  function updateGameTotals(games) {
    const totals = {
      wolf: { points: 0, money: 0 },
      "666": { points: 0, money: 0 },
      bbb: { points: 0, money: 0 }
    };

    games.forEach((game) => {
      const type = normalizeGameType(game);
      if (!totals[type]) return;

      const points = getTrackedGamePoints(game);

      const money = getGameMoneyFromData(game);

      totals[type].points += points;
      totals[type].money += money;
    });

    if (wolfMoneyTotal) wolfMoneyTotal.textContent = formatMoney(totals.wolf.money);
    if (wolfPointsTotal) wolfPointsTotal.textContent = `${totals.wolf.points} pts`;

    if (sixesMoneyTotal) sixesMoneyTotal.textContent = formatMoney(totals["666"].money);
    if (sixesPointsTotal) sixesPointsTotal.textContent = `${totals["666"].points} pts`;

    if (bbbMoneyTotal) bbbMoneyTotal.textContent = formatMoney(totals.bbb.money);
    if (bbbPointsTotal) bbbPointsTotal.textContent = `${totals.bbb.points} pts`;
  }

  function getVisibleGames() {
    if (gamesExpanded) return allGames;
    return allGames.slice(0, INITIAL_GAMES_TO_SHOW);
  }

  function renderSavedGames() {
    if (!gamesPlayedList) return;

    if (!allGames.length) {
      gamesPlayedList.innerHTML = `
        <div class="card">
          <div class="card-body">
            <p class="mb-0">No saved games yet. Finish a Wolf, Six-Six-Six, or BBB game and save it to see it here.</p>
          </div>
        </div>
      `;
      return;
    }

    const visibleGames = getVisibleGames();

    const html = visibleGames.map((game) => {
      const type = normalizeGameType(game);
      const label = getGameLabel(game);
      const totals = Array.isArray(game?.totals) ? game.totals : [];
      const players = Array.isArray(game?.players) ? game.players : [];
      const points = getTrackedGamePoints(game);
      const money = getGameMoneyFromData(game);

      let extraLine = "";
      if (type === "bbb") {
        extraLine = `<div class="small text-muted">Bet: $${(Number(game?.bet) || 0).toFixed(2)} / point</div>`;
      } else {
        extraLine = `<div class="small text-muted">$/Point: $${(Number(game?.dollarValue) || 0).toFixed(2)}</div>`;
      }

      return `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
              <div>
                <h5 class="mb-1">${escapeHtml(label)}</h5>
                <div class="small text-muted">${escapeHtml(formatTimestamp(game.timestamp))}</div>
                ${extraLine}
              </div>
              <div class="text-end">
                <div class="small text-muted">Saved Hole</div>
                <div class="fw-bold">${escapeHtml(game.hole ?? "—")}</div>
              </div>
            </div>

            <div class="row g-2 text-center mb-3">
              <div class="col-6 col-md-6">
                <div class="border rounded p-2 h-100">
                  <div class="small text-muted">Total Points</div>
                  <div class="fw-bold">${points}</div>
                </div>
              </div>
              <div class="col-6 col-md-6">
                <div class="border rounded p-2 h-100">
                  <div class="small text-muted">Total Money</div>
                  <div class="fw-bold">${formatMoney(money)}</div>
                </div>
              </div>
            </div>

            <div class="small text-muted mb-1">Players</div>
            <div class="mb-3">
              ${
                players.length
                  ? players.map((player, idx) => `
                    <div class="small">
                      • ${escapeHtml(player || `Player ${idx + 1}`)} — ${Number(totals[idx]) || 0} pts
                    </div>
                  `).join("")
                  : `<div class="small">No players saved.</div>`
              }
            </div>

            <button
              type="button"
              class="btn btn-sm btn-outline-danger delete-game-btn"
              data-game-id="${escapeHtml(game.id)}"
            >
              Delete
            </button>
          </div>
        </div>
      `;
    }).join("");

    const toggleMarkup =
      allGames.length > INITIAL_GAMES_TO_SHOW
        ? `
          <div class="d-flex justify-content-center mt-3">
            <button type="button" id="toggleGamesBtn" class="gfg-pill-btn">
              ${gamesExpanded ? "Show Less Games" : `Show More Games (${allGames.length - INITIAL_GAMES_TO_SHOW} more)`}
            </button>
          </div>
        `
        : "";

    gamesPlayedList.innerHTML = `
      <div class="mb-3">
        <div class="small text-muted">
          Showing ${visibleGames.length} of ${allGames.length} saved games
        </div>
      </div>
      ${html}
      ${toggleMarkup}
    `;

    bindGameButtons();
  }

  function bindRoundButtons() {
    const toggleBtn = document.getElementById("toggleRoundsBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        roundsExpanded = !roundsExpanded;
        renderSavedRounds();

        const section = document.getElementById("savedRoundsSection");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    const deleteButtons = document.querySelectorAll(".delete-round-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const roundId = button.getAttribute("data-round-id");
        if (!roundId || !currentUser) return;

        const confirmed = window.confirm(
          "Are you sure you want to delete this saved round?"
        );
        if (!confirmed) return;

        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = "Deleting...";

        try {
          await firebase
            .firestore()
            .collection("users")
            .doc(currentUser.uid)
            .collection("savedRounds")
            .doc(roundId)
            .delete();

          allRounds = allRounds.filter((round) => round.id !== roundId);

          if (allRounds.length <= INITIAL_ROUNDS_TO_SHOW) {
            roundsExpanded = false;
          }

          updateSummaryStats(allRounds);
          renderSavedRounds();
          renderCourseData(allRounds);
          renderShotPatternChart(allRounds);
        } catch (error) {
          console.error("Error deleting round:", error);
          window.alert("There was an error deleting that round.");
          button.disabled = false;
          button.textContent = originalText;
        }
      });
    });
  }

  function bindGameButtons() {
    const toggleBtn = document.getElementById("toggleGamesBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        gamesExpanded = !gamesExpanded;
        renderSavedGames();

        const section = document.getElementById("savedGameDataSection");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    const deleteButtons = document.querySelectorAll(".delete-game-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const gameId = button.getAttribute("data-game-id");
        if (!gameId || !currentUser) return;

        const confirmed = window.confirm(
          "Are you sure you want to delete this saved game?"
        );
        if (!confirmed) return;

        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = "Deleting...";

        try {
          await firebase
            .firestore()
            .collection("users")
            .doc(currentUser.uid)
            .collection("savedGames")
            .doc(gameId)
            .delete();

          allGames = allGames.filter((game) => game.id !== gameId);

          if (allGames.length <= INITIAL_GAMES_TO_SHOW) {
            gamesExpanded = false;
          }

          updateGameTotals(allGames);
          renderSavedGames();
        } catch (error) {
          console.error("Error deleting game:", error);
          window.alert("There was an error deleting that saved game.");
          button.disabled = false;
          button.textContent = originalText;
        }
      });
    });
  }

  async function loadSavedRounds(uid) {
    try {
      const snap = await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("savedRounds")
        .get();

      allRounds = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => getRoundSortValue(b) - getRoundSortValue(a));

      updateSummaryStats(allRounds);
      renderSavedRounds();
      renderCourseData(allRounds);
      renderShotPatternChart(allRounds);
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

  async function loadSavedGames(uid) {
    try {
      const snap = await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("savedGames")
        .orderBy("timestamp", "desc")
        .get();

      allGames = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      updateGameTotals(allGames);
      renderSavedGames();
    } catch (error) {
      console.error("Error loading saved games:", error);

      if (gamesPlayedList) {
        gamesPlayedList.innerHTML = `
          <div class="card">
            <div class="card-body text-danger">
              Error loading saved games.
            </div>
          </div>
        `;
      }

      if (wolfMoneyTotal) wolfMoneyTotal.textContent = "—";
      if (wolfPointsTotal) wolfPointsTotal.textContent = "—";
      if (sixesMoneyTotal) sixesMoneyTotal.textContent = "—";
      if (sixesPointsTotal) sixesPointsTotal.textContent = "—";
      if (bbbMoneyTotal) bbbMoneyTotal.textContent = "—";
      if (bbbPointsTotal) bbbPointsTotal.textContent = "—";
    }
  }

  function updatePlayerDataLock(user) {
    const loggedIn = !!user;

    if (savedRoundsLoggedIn) savedRoundsLoggedIn.classList.toggle("d-none", !loggedIn);
    if (courseDataLoggedIn) courseDataLoggedIn.classList.toggle("d-none", !loggedIn);
    if (shotPatternLoggedIn) shotPatternLoggedIn.classList.toggle("d-none", !loggedIn);
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

  function resetGameDisplays() {
    allGames = [];
    gamesExpanded = false;

    if (wolfMoneyTotal) wolfMoneyTotal.textContent = "—";
    if (wolfPointsTotal) wolfPointsTotal.textContent = "—";
    if (sixesMoneyTotal) sixesMoneyTotal.textContent = "—";
    if (sixesPointsTotal) sixesPointsTotal.textContent = "—";
    if (bbbMoneyTotal) bbbMoneyTotal.textContent = "—";
    if (bbbPointsTotal) bbbPointsTotal.textContent = "—";

    renderSavedGames();
  }

  function initPlayerLogRounds() {
    if (!window.firebase || !firebase.apps || !firebase.apps.length) {
      window.setTimeout(initPlayerLogRounds, 150);
      return;
    }

    firebase.auth().onAuthStateChanged((user) => {
      currentUser = user;
      updatePlayerDataLock(user);
      updateGameDataLock(user);

      if (!user) {
        allRounds = [];
        roundsExpanded = false;
        updateSummaryStats([]);
        renderSavedRounds();
        renderCourseData([]);
        renderShotPatternChart([]);
        resetGameDisplays();
        return;
      }

      loadSavedRounds(user.uid);
      loadSavedGames(user.uid);
    });
  }

  initPlayerLogRounds();

  shotPatternTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.shotView;
      if (!nextView || nextView === activeShotPatternView) return;

      activeShotPatternView = nextView;
      renderShotPatternChart(allRounds);
    });
  });

  let shotPatternResizeTimeout = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(shotPatternResizeTimeout);
    shotPatternResizeTimeout = window.setTimeout(() => {
      renderShotPatternChart(allRounds);
    }, 120);
  });
});
