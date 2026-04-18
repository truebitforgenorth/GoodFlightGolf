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
  const analyticsLoggedIn = document.getElementById("analyticsLoggedIn");
  const analyticsSummary = document.getElementById("analyticsSummary");
  const analyticsStatus = document.getElementById("analyticsStatus");
  const analyticsChartCanvas = document.getElementById("analyticsChart");
  const analyticsTabs = Array.from(document.querySelectorAll(".analytics-tab"));
  const gameAnalyticsLoggedIn = document.getElementById("gameAnalyticsLoggedIn");
  const gameAnalyticsSummary = document.getElementById("gameAnalyticsSummary");
  const gameAnalyticsStatus = document.getElementById("gameAnalyticsStatus");
  const gameAnalyticsChartCanvas = document.getElementById("gameAnalyticsChart");
  const gameAnalyticsTabs = Array.from(document.querySelectorAll(".game-analytics-tab"));

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
  let activeAnalyticsView = "drive";
  let analyticsChartInstance = null;
  let analyticsResizeTimeout = null;
  let activeGameAnalyticsView = "moneyTime";
  let gameAnalyticsChartInstance = null;
  let gameAnalyticsResizeTimeout = null;

  const gameTotalsHeader = gameTotalsLoggedIn?.closest(".card")?.querySelector(".card-header");
  const gamesPlayedHeader = gamesPlayedLoggedIn?.closest(".card")?.querySelector(".card-header");
  const gameDataLockIcon = loginToUseGameData?.querySelector(".gfg-lock-icon");

  if (gameTotalsHeader) {
    gameTotalsHeader.textContent = `${String.fromCodePoint(0x1F4B0)} Game Totals`;
  }

  if (gamesPlayedHeader) {
    gamesPlayedHeader.textContent = `${String.fromCodePoint(0x1F4DD)} Games Played`;
  }

  if (gameDataLockIcon) {
    gameDataLockIcon.textContent = String.fromCodePoint(0x1F512);
  }

  [
    wolfMoneyTotal,
    wolfPointsTotal,
    sixesMoneyTotal,
    sixesPointsTotal,
    bbbMoneyTotal,
    bbbPointsTotal
  ].forEach((element) => {
    if (element && /â€”/.test(element.textContent || "")) {
      element.textContent = "-";
    }
  });

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

  function getLegacyShotPatternCounts(round, view, allowedKeys) {
    const source = view === "approach" ? round?.approachCounts : round?.driveCounts;
    if (!source || typeof source !== "object") return null;

    const counts = Object.fromEntries(allowedKeys.map((key) => [key, 0]));
    let hasTrackedData = false;

    allowedKeys.forEach((key) => {
      const value = Number(source[key]) || 0;
      counts[key] = value;
      if (value > 0) hasTrackedData = true;
    });

    return hasTrackedData ? counts : null;
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
      const legacyCounts = getLegacyShotPatternCounts(round, view, config.keys);
      if (legacyCounts) {
        config.keys.forEach((key) => {
          counts[key] += legacyCounts[key];
        });
        return;
      }

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
        maintainAspectRatio: false,
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

  function formatTrendRoundLabel(round, index) {
    if (round?.roundDate) {
      const parsed = new Date(`${round.roundDate}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString(undefined, {
          month: "numeric",
          day: "numeric"
        });
      }
    }

    return `R${index + 1}`;
  }

  function getRoundFirPctValue(round) {
    if (typeof round?.firPct === "number") return round.firPct;

    if (typeof round?.firHits === "number" && typeof round?.firChances === "number") {
      return round.firChances ? Math.round((round.firHits / round.firChances) * 100) : 0;
    }

    if (Array.isArray(round?.holes) && round.holes.length) {
      const activeHoles = round.holes.filter((hole) => hole && hole.isActive !== false);
      const firChances = activeHoles.filter((hole) => Number(hole?.par) > 3).length;
      const firHits = activeHoles.filter((hole) => hole?.fir === true).length;
      return firChances ? Math.round((firHits / firChances) * 100) : 0;
    }

    return 0;
  }

  function getRoundGirPctValue(round) {
    if (typeof round?.girPct === "number") return round.girPct;

    if (typeof round?.girHits === "number") {
      const holesCount = getRoundHolesCount(round);
      return holesCount ? Math.round((round.girHits / holesCount) * 100) : 0;
    }

    if (Array.isArray(round?.holes) && round.holes.length) {
      const activeHoles = round.holes.filter((hole) => hole && hole.isActive !== false);
      const girHits = activeHoles.filter((hole) => hole?.gir === true).length;
      return activeHoles.length ? Math.round((girHits / activeHoles.length) * 100) : 0;
    }

    return 0;
  }

  function getRoundFirAggregate(round) {
    const explicitHits = Number(round?.firHits);
    const explicitChances = Number(round?.firChances);
    if (Number.isFinite(explicitHits) && Number.isFinite(explicitChances) && explicitChances >= 0) {
      return {
        hits: explicitHits,
        chances: explicitChances
      };
    }

    if (Array.isArray(round?.holes) && round.holes.length) {
      const activeHoles = round.holes.filter((hole) => hole && hole.isActive !== false);
      const firChances = activeHoles.filter((hole) => Number(hole?.par) > 3).length;
      const firHits = activeHoles.filter((hole) => hole?.fir === true).length;
      return {
        hits: firHits,
        chances: firChances
      };
    }

    return {
      hits: 0,
      chances: 0
    };
  }

  function getRoundGirAggregate(round) {
    const explicitHits = Number(round?.girHits);
    const holesCount = getRoundHolesCount(round);
    if (Number.isFinite(explicitHits) && holesCount >= 0) {
      return {
        hits: explicitHits,
        chances: holesCount
      };
    }

    if (Array.isArray(round?.holes) && round.holes.length) {
      const activeHoles = round.holes.filter((hole) => hole && hole.isActive !== false);
      const girHits = activeHoles.filter((hole) => hole?.gir === true).length;
      return {
        hits: girHits,
        chances: activeHoles.length
      };
    }

    return {
      hits: 0,
      chances: 0
    };
  }

  function getFirGirTrendData(rounds) {
    const orderedRounds = [...rounds].sort((a, b) => getRoundSortValue(a) - getRoundSortValue(b));

    return {
      orderedRounds,
      labels: orderedRounds.map((round, index) => formatTrendRoundLabel(round, index)),
      firValues: orderedRounds.map((round) => getRoundFirPctValue(round)),
      girValues: orderedRounds.map((round) => getRoundGirPctValue(round))
    };
  }

  function renderFirGirTrendChart(rounds) {
    if (!firGirTrendChartCanvas || !firGirTrendSummary || !firGirTrendStatus) return;

    if (typeof Chart === "undefined") {
      firGirTrendSummary.textContent = "Chart library unavailable.";
      firGirTrendStatus.textContent = "Chart.js did not load on this page.";
      return;
    }

    const isMobileChart = window.innerWidth <= 767;
    const trendData = getFirGirTrendData(rounds);

    if (firGirTrendChartInstance) {
      firGirTrendChartInstance.destroy();
      firGirTrendChartInstance = null;
    }

    if (!trendData.orderedRounds.length) {
      firGirTrendSummary.textContent = "Save rounds to build your FIR and GIR trend chart.";
      firGirTrendStatus.textContent = "Each point tracks the FIR and GIR percentage from one saved round.";
    } else {
      const latestRound = trendData.orderedRounds[trendData.orderedRounds.length - 1];
      const latestFir = trendData.firValues[trendData.firValues.length - 1] ?? 0;
      const latestGir = trendData.girValues[trendData.girValues.length - 1] ?? 0;
      const latestCourse = latestRound?.courseName ? ` at ${latestRound.courseName}` : "";

      firGirTrendSummary.textContent =
        `Tracking FIR and GIR across ${trendData.orderedRounds.length} saved round${trendData.orderedRounds.length === 1 ? "" : "s"} from oldest to newest.`;
      firGirTrendStatus.textContent =
        `Latest round${latestCourse}: FIR ${latestFir}% and GIR ${latestGir}%.`;
    }

    const ctx = firGirTrendChartCanvas.getContext("2d");
    firGirTrendChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: trendData.labels,
        datasets: [
          {
            label: "FIR",
            data: trendData.firValues,
            borderColor: "#359447",
            backgroundColor: "rgba(53, 148, 71, 0.14)",
            pointBackgroundColor: "#359447",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: isMobileChart ? 3.5 : 4.5,
            pointHoverRadius: isMobileChart ? 5 : 6,
            borderWidth: 3,
            tension: 0.32,
            fill: false
          },
          {
            label: "GIR",
            data: trendData.girValues,
            borderColor: "#0ea5e9",
            backgroundColor: "rgba(14, 165, 233, 0.14)",
            pointBackgroundColor: "#0ea5e9",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: isMobileChart ? 3.5 : 4.5,
            pointHoverRadius: isMobileChart ? 5 : 6,
            borderWidth: 3,
            tension: 0.32,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              padding: isMobileChart ? 12 : 16,
              font: {
                size: isMobileChart ? 11 : 12
              }
            }
          },
          tooltip: {
            titleFont: {
              size: isMobileChart ? 12 : 13
            },
            bodyFont: {
              size: isMobileChart ? 12 : 13
            },
            callbacks: {
              title(items) {
                const idx = items?.[0]?.dataIndex ?? 0;
                const round = trendData.orderedRounds[idx];
                const titleParts = [trendData.labels[idx] || `Round ${idx + 1}`];
                if (round?.courseName) titleParts.push(round.courseName);
                return titleParts;
              },
              label(context) {
                return `${context.dataset.label}: ${context.parsed.y ?? 0}%`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
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
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0,
              maxTicksLimit: isMobileChart ? 6 : 10,
              font: {
                size: isMobileChart ? 10 : 12
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  function updateAnalyticsTabState() {
    analyticsTabs.forEach((button) => {
      const isActive = button.dataset.analyticsView === activeAnalyticsView;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function getOrderedRounds(rounds) {
    return [...rounds].sort((a, b) => getRoundSortValue(a) - getRoundSortValue(b));
  }

  function getRoundPuttsValue(round) {
    if (typeof round?.totalPutts === "number") return round.totalPutts;

    if (Array.isArray(round?.holes) && round.holes.length) {
      return round.holes
        .filter((hole) => hole && hole.isActive !== false)
        .reduce((sum, hole) => sum + (Number(hole?.putts) || 0), 0);
    }

    return 0;
  }

  function getRoundScoreSlices(round) {
    if (Array.isArray(round?.holes) && round.holes.length) {
      const activeHoles = round.holes.filter((hole) => hole && hole.isActive !== false);
      let front9 = 0;
      let back9 = 0;

      activeHoles.forEach((hole, index) => {
        const holeNumber = Number(hole?.hole) || (index + 1);
        const strokes = Number(hole?.strokes) || 0;
        if (holeNumber <= 9) front9 += strokes;
        else back9 += strokes;
      });

      return {
        total: front9 + back9,
        front9,
        back9
      };
    }

    return {
      total: Number(round?.totalScore) || 0,
      front9: null,
      back9: null
    };
  }

  function getScoreBreakdownData(rounds) {
    const counts = {
      birdies: 0,
      pars: 0,
      bogeys: 0,
      doublesPlus: 0
    };

    rounds.forEach((round) => {
      const holes = Array.isArray(round?.holes) ? round.holes : [];
      holes.forEach((hole) => {
        if (!hole || hole.isActive === false) return;

        let diff = Number.isFinite(Number(hole?.diff)) ? Number(hole.diff) : null;
        if (diff === null) {
          const strokes = Number(hole?.strokes);
          const par = Number(hole?.par);
          if (Number.isFinite(strokes) && Number.isFinite(par)) diff = strokes - par;
        }
        if (diff === null) return;

        if (diff <= -1) counts.birdies += 1;
        else if (diff === 0) counts.pars += 1;
        else if (diff === 1) counts.bogeys += 1;
        else counts.doublesPlus += 1;
      });
    });

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
    return { counts, total };
  }

  function destroyAnalyticsChart() {
    if (analyticsChartInstance) {
      analyticsChartInstance.destroy();
      analyticsChartInstance = null;
    }
  }

  function createAnalyticsLineChart(ctx, labels, datasets, yTitle, maxY, isMobileChart) {
    analyticsChartInstance = new Chart(ctx, {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              padding: isMobileChart ? 12 : 16,
              font: {
                size: isMobileChart ? 11 : 12
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: maxY,
            ticks: {
              stepSize: maxY === 100 ? 20 : undefined,
              font: {
                size: isMobileChart ? 10 : 12
              }
            },
            title: {
              display: true,
              text: yTitle,
              font: {
                size: isMobileChart ? 11 : 12
              }
            }
          },
          x: {
            ticks: {
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0,
              maxTicksLimit: isMobileChart ? 6 : 10,
              font: {
                size: isMobileChart ? 10 : 12
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  function createAnalyticsPieChart(ctx, values, isMobileChart) {
    analyticsChartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Birdies", "Pars", "Bogeys", "Doubles+"],
        datasets: [
          {
            data: values,
            backgroundColor: ["#359447", "#0ea5e9", "#d97706", "#c85746"],
            borderColor: "#ffffff",
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: isMobileChart ? "bottom" : "right",
            labels: {
              usePointStyle: true,
              padding: isMobileChart ? 12 : 16,
              font: {
                size: isMobileChart ? 11 : 12
              }
            }
          }
        }
      }
    });
  }

  function renderAnalyticsChart(rounds) {
    if (!analyticsChartCanvas || !analyticsSummary || !analyticsStatus) return;

    updateAnalyticsTabState();

    if (typeof Chart === "undefined") {
      analyticsSummary.textContent = "Chart library unavailable.";
      analyticsStatus.textContent = "Chart.js did not load on this page.";
      return;
    }

    destroyAnalyticsChart();

    const ctx = analyticsChartCanvas.getContext("2d");
    const isMobileChart = window.innerWidth <= 767;
    const orderedRounds = getOrderedRounds(rounds);
    const labels = orderedRounds.map((round, index) => formatTrendRoundLabel(round, index));

    if (activeAnalyticsView === "drive" || activeAnalyticsView === "approach") {
      const config = getShotPatternConfig(activeAnalyticsView, rounds);
      analyticsSummary.textContent = !config.total
        ? `No ${config.emptyLabel} yet.`
        : `${config.title} - ${config.total} ${config.emptyLabel} across ${rounds.length} saved round${rounds.length === 1 ? "" : "s"}.`;
      analyticsStatus.textContent = !config.total
        ? `Save rounds with ${activeAnalyticsView === "drive" ? "drive" : "approach"} results to build this chart.`
        : `${config.topLabel} is currently your most common ${activeAnalyticsView === "drive" ? "driving" : "approach"} outcome.`;

      const valueLabelPlugin = {
        id: "analyticsValueLabels",
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

      analyticsChartInstance = new Chart(ctx, {
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
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
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
      return;
    }

    if (activeAnalyticsView === "firGir") {
      const firValues = orderedRounds.map((round) => getRoundFirPctValue(round));
      const girValues = orderedRounds.map((round) => getRoundGirPctValue(round));
      analyticsSummary.textContent = orderedRounds.length
        ? `Tracking FIR and GIR across ${orderedRounds.length} saved round${orderedRounds.length === 1 ? "" : "s"} from oldest to newest.`
        : "Save rounds to build your FIR and GIR trend chart.";
      analyticsStatus.textContent = orderedRounds.length
        ? `Latest round: FIR ${firValues[firValues.length - 1] ?? 0}% and GIR ${girValues[girValues.length - 1] ?? 0}%.`
        : "Each point tracks the FIR and GIR percentage from one saved round.";
      createAnalyticsLineChart(
        ctx,
        labels,
        [
          {
            label: "FIR",
            data: firValues,
            borderColor: "#359447",
            backgroundColor: "rgba(53, 148, 71, 0.14)",
            pointBackgroundColor: "#359447",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: isMobileChart ? 3.5 : 4.5,
            pointHoverRadius: isMobileChart ? 5 : 6,
            borderWidth: 3,
            tension: 0.32,
            fill: false
          },
          {
            label: "GIR",
            data: girValues,
            borderColor: "#0ea5e9",
            backgroundColor: "rgba(14, 165, 233, 0.14)",
            pointBackgroundColor: "#0ea5e9",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: isMobileChart ? 3.5 : 4.5,
            pointHoverRadius: isMobileChart ? 5 : 6,
            borderWidth: 3,
            tension: 0.32,
            fill: false
          }
        ],
        "Percentage",
        100,
        isMobileChart
      );
      return;
    }

    if (activeAnalyticsView === "putts") {
      const puttsValues = orderedRounds.map((round) => getRoundPuttsValue(round));
      analyticsSummary.textContent = orderedRounds.length
        ? `Tracking total putts across ${orderedRounds.length} saved round${orderedRounds.length === 1 ? "" : "s"}.`
        : "Save rounds to build your putts-per-round chart.";
      analyticsStatus.textContent = orderedRounds.length
        ? `Latest round putts: ${puttsValues[puttsValues.length - 1] ?? 0}.`
        : "Each point will show total putts from one saved round.";
      createAnalyticsLineChart(
        ctx,
        labels,
        [
          {
            label: "Putts",
            data: puttsValues,
            borderColor: "#f0b429",
            backgroundColor: "rgba(240, 180, 41, 0.16)",
            pointBackgroundColor: "#f0b429",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: isMobileChart ? 3.5 : 4.5,
            pointHoverRadius: isMobileChart ? 5 : 6,
            borderWidth: 3,
            tension: 0.32,
            fill: false
          }
        ],
        "Putts",
        Math.max(36, ...puttsValues, 0),
        isMobileChart
      );
      return;
    }

    if (activeAnalyticsView === "scoreTotals") {
      const slices = orderedRounds.map((round) => getRoundScoreSlices(round));
      const totalValues = slices.map((slice) => slice.total);
      const frontValues = slices.map((slice) => slice.front9);
      const backValues = slices.map((slice) => slice.back9);
      analyticsSummary.textContent = orderedRounds.length
        ? `Tracking total, front 9, and back 9 scores across ${orderedRounds.length} saved round${orderedRounds.length === 1 ? "" : "s"}.`
        : "Save rounds to build your scorecard totals chart.";
      analyticsStatus.textContent = orderedRounds.length
        ? `Latest round total: ${totalValues[totalValues.length - 1] ?? 0}.`
        : "Front 9 and back 9 lines appear when hole-by-hole saved data exists.";
      createAnalyticsLineChart(
        ctx,
        labels,
        [
          {
            label: "Total",
            data: totalValues,
            borderColor: "#132033",
            backgroundColor: "rgba(19, 32, 51, 0.14)",
            pointBackgroundColor: "#132033",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: isMobileChart ? 3.5 : 4.5,
            pointHoverRadius: isMobileChart ? 5 : 6,
            borderWidth: 3,
            tension: 0.28,
            fill: false
          },
          {
            label: "Front 9",
            data: frontValues,
            borderColor: "#359447",
            backgroundColor: "rgba(53, 148, 71, 0.14)",
            pointBackgroundColor: "#359447",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: isMobileChart ? 3.5 : 4.5,
            pointHoverRadius: isMobileChart ? 5 : 6,
            borderWidth: 3,
            tension: 0.28,
            fill: false,
            spanGaps: true
          },
          {
            label: "Back 9",
            data: backValues,
            borderColor: "#0ea5e9",
            backgroundColor: "rgba(14, 165, 233, 0.14)",
            pointBackgroundColor: "#0ea5e9",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: isMobileChart ? 3.5 : 4.5,
            pointHoverRadius: isMobileChart ? 5 : 6,
            borderWidth: 3,
            tension: 0.28,
            fill: false,
            spanGaps: true
          }
        ],
        "Strokes",
        Math.max(72, ...totalValues.filter((value) => typeof value === "number"), 0),
        isMobileChart
      );
      return;
    }

    const breakdown = getScoreBreakdownData(rounds);
    analyticsSummary.textContent = breakdown.total
      ? `Score breakdown built from ${breakdown.total} saved hole${breakdown.total === 1 ? "" : "s"}.`
      : "Save rounds with hole-by-hole scores to build your Birdies / Pars / Bogeys / Doubles+ pie chart.";
    analyticsStatus.textContent = breakdown.total
      ? "Birdies, pars, bogeys, and doubles+ are grouped from all saved hole results."
      : "This chart needs saved hole results from your rounds.";
    createAnalyticsPieChart(
      ctx,
      [
        breakdown.counts.birdies,
        breakdown.counts.pars,
        breakdown.counts.bogeys,
        breakdown.counts.doublesPlus
      ],
      isMobileChart
    );
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

  function scheduleAnalyticsRender(delay = 90) {
    window.clearTimeout(analyticsResizeTimeout);
    analyticsResizeTimeout = window.setTimeout(() => {
      renderAnalyticsChart(allRounds);
    }, delay);
  }

  function getSafeGameLabel(data) {
    const type = normalizeGameType(data);
    if (type === "bbb") return "Bingo Bango Bongo";
    return getGameLabel(data);
  }

  function scheduleGameAnalyticsRender(delay = 90) {
    window.clearTimeout(gameAnalyticsResizeTimeout);
    gameAnalyticsResizeTimeout = window.setTimeout(() => {
      renderGameAnalyticsChart(allGames, allRounds);
    }, delay);
  }

  function getGameSortValue(game) {
    return getDocTimeValue(game?.timestamp) || getDocTimeValue(game?.createdAt) || 0;
  }

  function getOrderedGames(games) {
    return [...games].sort((a, b) => getGameSortValue(a) - getGameSortValue(b));
  }

  function formatGameTrendLabel(game, index) {
    const type = normalizeGameType(game);
    const shortType =
      type === "wolf" ? "Wolf" :
      type === "666" ? "666" :
      type === "bbb" ? "BBB" :
      "Game";

    const timeValue = getGameSortValue(game);
    if (!timeValue) return `${shortType} ${index + 1}`;

    const shortDate = new Date(timeValue).toLocaleDateString(undefined, {
      month: "numeric",
      day: "numeric"
    });

    return `${shortType} ${shortDate}`;
  }

  function getGameHoleEntries(game) {
    const source = game?.holes;
    if (Array.isArray(source)) {
      return source.filter(Boolean);
    }

    if (!source || typeof source !== "object") {
      return [];
    }

    return Object.keys(source)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => source[key])
      .filter(Boolean);
  }

  function getTrackedWolfEventStats(game) {
    const trackedIndex = getTrackedPlayerIndex(game);
    const holes = getGameHoleEntries(game);
    const stats = { wins: 0, losses: 0, pushes: 0, opportunities: 0 };

    if (trackedIndex === null) return stats;

    holes.forEach((hole) => {
      const result = String(hole?.result || "");
      if (!result) return;

      stats.opportunities += 1;

      if (result === "push") {
        stats.pushes += 1;
        return;
      }

      let winners = [];

      if (result === "wolfTeam") {
        winners = [hole?.wolf, hole?.partner].filter((value) => Number.isInteger(value));
      } else if (result === "others") {
        winners = [0, 1, 2, 3].filter((value) => value !== hole?.wolf && value !== hole?.partner);
      } else if (result === "loneWin") {
        winners = Number.isInteger(hole?.wolf) ? [hole.wolf] : [];
      } else if (result === "loneLose") {
        winners = [0, 1, 2, 3].filter((value) => value !== hole?.wolf);
      } else if (result === "dumpWin") {
        winners = Number.isInteger(hole?.partner) ? [hole.partner] : [];
      } else if (result === "dumpLose") {
        winners = [0, 1, 2, 3].filter((value) => value !== hole?.partner);
      }

      if (!winners.length) return;

      if (winners.includes(trackedIndex)) {
        stats.wins += 1;
      } else {
        stats.losses += 1;
      }
    });

    return stats;
  }

  function getTrackedSixesEventStats(game) {
    const trackedIndex = getTrackedPlayerIndex(game);
    const holes = getGameHoleEntries(game);
    const stats = { wins: 0, losses: 0, pushes: 0, opportunities: 0 };

    if (trackedIndex === null) return stats;

    holes.forEach((hole, index) => {
      const result = String(hole?.result || "");
      if (!result) return;

      stats.opportunities += 1;

      if (result === "push") {
        stats.pushes += 1;
        return;
      }

      const holeNumber = index + 1;
      const teams =
        holeNumber >= 1 && holeNumber <= 6 ? { team1: [0, 1], team2: [2, 3] } :
        holeNumber >= 7 && holeNumber <= 12 ? { team1: [0, 2], team2: [1, 3] } :
        { team1: [0, 3], team2: [1, 2] };

      const winners = result === "team1" ? teams.team1 : result === "team2" ? teams.team2 : [];
      if (!winners.length) return;

      if (winners.includes(trackedIndex)) {
        stats.wins += 1;
      } else {
        stats.losses += 1;
      }
    });

    return stats;
  }

  function getTrackedBBBEventStats(game) {
    const trackedIndex = getTrackedPlayerIndex(game);
    const holes = getGameHoleEntries(game);
    const stats = { wins: 0, losses: 0, pushes: 0, opportunities: 0 };

    if (trackedIndex === null) return stats;

    holes.forEach((hole) => {
      ["bingo", "bango", "bongo"].forEach((key) => {
        const winnerIndex = Number(hole?.[key]);
        if (!Number.isInteger(winnerIndex) || winnerIndex < 0) return;

        stats.opportunities += 1;
        if (winnerIndex === trackedIndex) {
          stats.wins += 1;
        } else {
          stats.losses += 1;
        }
      });
    });

    return stats;
  }

  function getTrackedGameEventStats(game) {
    const type = normalizeGameType(game);
    if (type === "wolf") return getTrackedWolfEventStats(game);
    if (type === "666") return getTrackedSixesEventStats(game);
    if (type === "bbb") return getTrackedBBBEventStats(game);
    return { wins: 0, losses: 0, pushes: 0, opportunities: 0 };
  }

  function getGameOutcomeCode(game) {
    const money = getGameMoneyFromData(game);
    if (money > 0) return 1;
    if (money < 0) return -1;
    return 0;
  }

  function getGameOutcomeLabel(game) {
    const code = getGameOutcomeCode(game);
    if (code > 0) return "Win";
    if (code < 0) return "Loss";
    return "Push";
  }

  function getGameStreakStats(games) {
    const orderedGames = getOrderedGames(games);
    let bestWin = 0;
    let bestLoss = 0;
    let runningWin = 0;
    let runningLoss = 0;

    orderedGames.forEach((game) => {
      const outcome = getGameOutcomeCode(game);

      if (outcome > 0) {
        runningWin += 1;
        runningLoss = 0;
        bestWin = Math.max(bestWin, runningWin);
        return;
      }

      if (outcome < 0) {
        runningLoss += 1;
        runningWin = 0;
        bestLoss = Math.max(bestLoss, runningLoss);
        return;
      }

      runningWin = 0;
      runningLoss = 0;
    });

    let currentWin = 0;
    let currentLoss = 0;

    for (let index = orderedGames.length - 1; index >= 0; index -= 1) {
      const outcome = getGameOutcomeCode(orderedGames[index]);
      if (outcome > 0 && currentLoss === 0) {
        currentWin += 1;
        continue;
      }
      if (outcome < 0 && currentWin === 0) {
        currentLoss += 1;
        continue;
      }
      break;
    }

    return {
      currentWin,
      bestWin,
      currentLoss,
      bestLoss
    };
  }

  function getGameDistributionBuckets(games) {
    const values = games.map((game) => getGameMoneyFromData(game));
    const nonZeroAbsValues = values
      .filter((value) => value !== 0)
      .map((value) => Math.abs(value))
      .sort((a, b) => a - b);

    const threshold = nonZeroAbsValues.length
      ? nonZeroAbsValues[Math.floor(nonZeroAbsValues.length / 2)]
      : 1;

    const buckets = {
      bigLosses: 0,
      smallLosses: 0,
      pushes: 0,
      smallWins: 0,
      bigWins: 0
    };

    values.forEach((value) => {
      if (value === 0) {
        buckets.pushes += 1;
      } else if (value > 0) {
        if (Math.abs(value) > threshold) buckets.bigWins += 1;
        else buckets.smallWins += 1;
      } else if (Math.abs(value) > threshold) {
        buckets.bigLosses += 1;
      } else {
        buckets.smallLosses += 1;
      }
    });

    return {
      threshold,
      buckets
    };
  }

  function getRoundDateKey(round) {
    if (round?.roundDate) return String(round.roundDate);

    const timeValue = getRoundSortValue(round);
    if (!timeValue) return "";

    return new Date(timeValue).toLocaleDateString("en-CA");
  }

  function getGameDateKey(game) {
    const timeValue = getGameSortValue(game);
    if (!timeValue) return "";
    return new Date(timeValue).toLocaleDateString("en-CA");
  }

  function getScoreMoneyPairs(games, rounds) {
    const roundBuckets = rounds.reduce((map, round) => {
      const key = String(round?.sessionId || "").trim();
      const score = Number(round?.totalScore);
      if (!key || !Number.isFinite(score) || score <= 0) return map;

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key).push(score);
      return map;
    }, new Map());

    return getOrderedGames(games).reduce((pairs, game, index) => {
      const key = String(game?.sessionId || "").trim();
      const scores = roundBuckets.get(key);
      if (!key || !scores?.length) return pairs;

      const averageScore = scores.reduce((sum, value) => sum + value, 0) / scores.length;
      pairs.push({
        x: Number(averageScore.toFixed(1)),
        y: Number(getGameMoneyFromData(game).toFixed(2)),
        label: formatGameTrendLabel(game, index),
        type: getSafeGameLabel(game)
      });
      return pairs;
    }, []);
  }

  function updateGameAnalyticsTabState() {
    gameAnalyticsTabs.forEach((button) => {
      const isActive = button.dataset.gameAnalyticsView === activeGameAnalyticsView;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function destroyGameAnalyticsChart() {
    if (!gameAnalyticsChartInstance) return;
    gameAnalyticsChartInstance.destroy();
    gameAnalyticsChartInstance = null;
  }

  function createGameAnalyticsBarChart(ctx, labels, datasets, isMobileChart, yTitle, extraOptions = {}) {
    gameAnalyticsChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: datasets.length > 1,
            position: isMobileChart ? "bottom" : "top",
            labels: {
              usePointStyle: true,
              padding: isMobileChart ? 10 : 14,
              font: {
                size: isMobileChart ? 10 : 12
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: isMobileChart ? 10 : 12
              },
              callback: extraOptions.yTickFormatter
            },
            title: {
              display: true,
              text: yTitle,
              font: {
                size: isMobileChart ? 11 : 12
              }
            },
            suggestedMin: extraOptions.suggestedMin,
            suggestedMax: extraOptions.suggestedMax
          },
          x: {
            ticks: {
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0,
              maxTicksLimit: isMobileChart ? 6 : 10,
              font: {
                size: isMobileChart ? 10 : 12
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  function createGameAnalyticsLineChart(ctx, labels, datasets, isMobileChart, yTitle, suggestedMax, extraOptions = {}) {
    gameAnalyticsChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          legend: {
            position: isMobileChart ? "bottom" : "top",
            labels: {
              usePointStyle: true,
              padding: isMobileChart ? 10 : 14,
              font: {
                size: isMobileChart ? 10 : 12
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: extraOptions.beginAtZero !== false,
            suggestedMax,
            ticks: {
              font: {
                size: isMobileChart ? 10 : 12
              },
              callback: extraOptions.yTickFormatter
            },
            title: {
              display: true,
              text: yTitle,
              font: {
                size: isMobileChart ? 11 : 12
              }
            }
          },
          x: {
            ticks: {
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0,
              maxTicksLimit: isMobileChart ? 6 : 10,
              font: {
                size: isMobileChart ? 10 : 12
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  function renderGameAnalyticsChart(games, rounds) {
    if (!gameAnalyticsChartCanvas || !gameAnalyticsSummary || !gameAnalyticsStatus) return;

    updateGameAnalyticsTabState();

    if (typeof Chart === "undefined") {
      gameAnalyticsSummary.textContent = "Chart library unavailable.";
      gameAnalyticsStatus.textContent = "Chart.js did not load on this page.";
      return;
    }

    destroyGameAnalyticsChart();

    const ctx = gameAnalyticsChartCanvas.getContext("2d");
    const isMobileChart = window.innerWidth <= 767;
    const orderedGames = getOrderedGames(games);
    const labels = orderedGames.map((game, index) => formatGameTrendLabel(game, index));
    const moneyValues = orderedGames.map((game) => Number(getGameMoneyFromData(game).toFixed(2)));
    const totalMoney = moneyValues.reduce((sum, value) => sum + value, 0);

    if (activeGameAnalyticsView === "moneyTime") {
      const runningTotals = moneyValues.reduce((values, value) => {
        const lastValue = values.length ? values[values.length - 1] : 0;
        values.push(Number((lastValue + value).toFixed(2)));
        return values;
      }, []);

      gameAnalyticsSummary.textContent = orderedGames.length
        ? `Tracking per-game profit and your running total across ${orderedGames.length} saved game${orderedGames.length === 1 ? "" : "s"}.`
        : "Save games to build your money-over-time chart.";
      gameAnalyticsStatus.textContent = orderedGames.length
        ? `Current tracked total: ${formatMoney(totalMoney)}.`
        : "Each save adds one profit/loss bar and updates the running-total line.";

      gameAnalyticsChartInstance = new Chart(ctx, {
        data: {
          labels,
          datasets: [
            {
              type: "bar",
              label: "Per Game Profit/Loss",
              data: moneyValues,
              backgroundColor: moneyValues.map((value) =>
                value > 0 ? "rgba(53, 148, 71, 0.82)" :
                value < 0 ? "rgba(200, 87, 70, 0.82)" :
                "rgba(107, 114, 128, 0.72)"
              ),
              borderRadius: 12,
              borderSkipped: false,
              maxBarThickness: isMobileChart ? 34 : 48
            },
            {
              type: "line",
              label: "Running Total",
              data: runningTotals,
              borderColor: "#132033",
              backgroundColor: "rgba(19, 32, 51, 0.12)",
              pointBackgroundColor: "#132033",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: isMobileChart ? 3.5 : 4.5,
              pointHoverRadius: isMobileChart ? 5 : 6,
              borderWidth: 3,
              tension: 0.28,
              yAxisID: "y"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false
          },
          plugins: {
            legend: {
              position: isMobileChart ? "bottom" : "top",
              labels: {
                usePointStyle: true,
                padding: isMobileChart ? 10 : 14,
                font: {
                  size: isMobileChart ? 10 : 12
                }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                font: {
                  size: isMobileChart ? 10 : 12
                },
                callback(value) {
                  return `$${value}`;
                }
              },
              title: {
                display: true,
                text: "Money",
                font: {
                  size: isMobileChart ? 11 : 12
                }
              }
            },
            x: {
              ticks: {
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0,
                maxTicksLimit: isMobileChart ? 6 : 10,
                font: {
                  size: isMobileChart ? 10 : 12
                }
              },
              grid: {
                display: false
              }
            }
          }
        }
      });
      return;
    }

    if (activeGameAnalyticsView === "gameTypeMoney") {
      const totals = {
        Wolf: 0,
        "666": 0,
        BBB: 0
      };

      orderedGames.forEach((game) => {
        const type = normalizeGameType(game);
        const money = getGameMoneyFromData(game);
        if (type === "wolf") totals.Wolf += money;
        if (type === "666") totals["666"] += money;
        if (type === "bbb") totals.BBB += money;
      });

      gameAnalyticsSummary.textContent = orderedGames.length
        ? "See which game formats are making you money and which ones are costing you."
        : "Save games to compare earnings across Wolf, 666, and BBB.";
      gameAnalyticsStatus.textContent = orderedGames.length
        ? `Best current game type: ${Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"}.`
        : "Totals are calculated from the player slot you selected as yourself in each saved game.";

      createGameAnalyticsBarChart(
        ctx,
        Object.keys(totals),
        [
          {
            label: "Total Earnings",
            data: Object.values(totals).map((value) => Number(value.toFixed(2))),
            backgroundColor: ["#359447", "#0ea5e9", "#f0b429"],
            borderRadius: 14,
            borderSkipped: false,
            maxBarThickness: isMobileChart ? 52 : 70
          }
        ],
        isMobileChart,
        "Money",
        {
          yTickFormatter(value) {
            return `$${value}`;
          }
        }
      );
      return;
    }

    if (activeGameAnalyticsView === "winRate") {
      const eventStats = orderedGames.reduce(
        (totals, game) => {
          const stats = getTrackedGameEventStats(game);
          totals.wins += stats.wins;
          totals.losses += stats.losses;
          totals.pushes += stats.pushes;
          totals.opportunities += stats.opportunities;
          return totals;
        },
        { wins: 0, losses: 0, pushes: 0, opportunities: 0 }
      );

      const roundWins = orderedGames.filter((game) => getGameOutcomeCode(game) > 0).length;
      const roundPushes = orderedGames.filter((game) => getGameOutcomeCode(game) === 0).length;
      const scoringRate = eventStats.wins + eventStats.losses
        ? Number(((eventStats.wins / (eventStats.wins + eventStats.losses)) * 100).toFixed(1))
        : 0;
      const roundRate = orderedGames.length
        ? Number(((roundWins / orderedGames.length) * 100).toFixed(1))
        : 0;
      const pushRate = orderedGames.length
        ? Number(((roundPushes / orderedGames.length) * 100).toFixed(1))
        : 0;

      gameAnalyticsSummary.textContent = orderedGames.length
        ? `Personal win rate built from ${eventStats.opportunities} tracked scoring chances and ${orderedGames.length} saved game${orderedGames.length === 1 ? "" : "s"}.`
        : "Save games to calculate your scoring win rate and round win rate.";
      gameAnalyticsStatus.textContent = orderedGames.length
        ? "BBB uses Bingo / Bango / Bongo scoring chances when calculating the scoring win rate."
        : "Round win rate is based on finishing the saved game up money, down money, or at a push.";

      createGameAnalyticsBarChart(
        ctx,
        ["Scoring Win %", "Round Win %", "Round Push %"],
        [
          {
            label: "Rate",
            data: [scoringRate, roundRate, pushRate],
            backgroundColor: ["#359447", "#132033", "#f0b429"],
            borderRadius: 14,
            borderSkipped: false,
            maxBarThickness: isMobileChart ? 48 : 64
          }
        ],
        isMobileChart,
        "Percentage",
        {
          suggestedMax: 100,
          yTickFormatter(value) {
            return `${value}%`;
          }
        }
      );
      return;
    }

    if (activeGameAnalyticsView === "outcomeTrend") {
      const outcomeValues = orderedGames.map((game) => getGameOutcomeCode(game));
      gameAnalyticsSummary.textContent = orderedGames.length
        ? `Track win, loss, and push results from oldest to newest across ${orderedGames.length} saved game${orderedGames.length === 1 ? "" : "s"}.`
        : "Save games to build your round-outcome trend.";
      gameAnalyticsStatus.textContent = orderedGames.length
        ? `Latest result: ${getGameOutcomeLabel(orderedGames[orderedGames.length - 1])}.`
        : "Wins plot above zero, pushes stay at zero, and losses plot below zero.";

      createGameAnalyticsBarChart(
        ctx,
        labels,
        [
          {
            label: "Outcome",
            data: outcomeValues,
            backgroundColor: outcomeValues.map((value) =>
              value > 0 ? "#359447" : value < 0 ? "#c85746" : "#f0b429"
            ),
            borderRadius: 12,
            borderSkipped: false,
            maxBarThickness: isMobileChart ? 32 : 40
          }
        ],
        isMobileChart,
        "Outcome",
        {
          suggestedMin: -1,
          suggestedMax: 1,
          yTickFormatter(value) {
            if (value === 1) return "Win";
            if (value === 0) return "Push";
            if (value === -1) return "Loss";
            return "";
          }
        }
      );
      return;
    }

    if (activeGameAnalyticsView === "streaks") {
      const streaks = getGameStreakStats(orderedGames);

      gameAnalyticsSummary.textContent = orderedGames.length
        ? "Hot streaks and cold streaks can stack up fast when you track games consistently."
        : "Save games to build your win and loss streak tracker.";
      gameAnalyticsStatus.textContent = orderedGames.length
        ? `Current streaks: ${streaks.currentWin} win${streaks.currentWin === 1 ? "" : "s"} / ${streaks.currentLoss} loss${streaks.currentLoss === 1 ? "" : "es"}.`
        : "Pushes reset the current streak counters.";

      createGameAnalyticsBarChart(
        ctx,
        ["Current Win", "Best Win", "Current Loss", "Best Loss"],
        [
          {
            label: "Games",
            data: [streaks.currentWin, streaks.bestWin, streaks.currentLoss, streaks.bestLoss],
            backgroundColor: ["#359447", "#1c7c31", "#d97706", "#c85746"],
            borderRadius: 14,
            borderSkipped: false,
            maxBarThickness: isMobileChart ? 42 : 56
          }
        ],
        isMobileChart,
        "Games"
      );
      return;
    }

    if (activeGameAnalyticsView === "distribution") {
      const distribution = getGameDistributionBuckets(orderedGames);
      const bucketValues = distribution.buckets;

      gameAnalyticsSummary.textContent = orderedGames.length
        ? "See how often you stack big wins, grind out small wins, push, or take losses."
        : "Save games to build your earnings-distribution chart.";
      gameAnalyticsStatus.textContent = orderedGames.length
        ? `Big win / loss threshold is currently ${formatMoney(distribution.threshold)} in absolute value.`
        : "Buckets are split into big wins, small wins, pushes, small losses, and big losses.";

      createGameAnalyticsBarChart(
        ctx,
        ["Big Losses", "Small Losses", "Pushes", "Small Wins", "Big Wins"],
        [
          {
            label: "Saved Games",
            data: [
              bucketValues.bigLosses,
              bucketValues.smallLosses,
              bucketValues.pushes,
              bucketValues.smallWins,
              bucketValues.bigWins
            ],
            backgroundColor: ["#c85746", "#d97706", "#6b7280", "#0ea5e9", "#359447"],
            borderRadius: 14,
            borderSkipped: false,
            maxBarThickness: isMobileChart ? 40 : 54
          }
        ],
        isMobileChart,
        "Games"
      );
      return;
    }

    const scoreMoneyPairs = getScoreMoneyPairs(orderedGames, rounds);
    gameAnalyticsSummary.textContent = scoreMoneyPairs.length
      ? `Comparing saved round scores against game money across ${scoreMoneyPairs.length} linked round + game session${scoreMoneyPairs.length === 1 ? "" : "s"}.`
      : "Start a Round + Game session to build your score-vs-money correlation chart.";
    gameAnalyticsStatus.textContent = scoreMoneyPairs.length
      ? "Lower round scores paired with higher money will cluster toward the bottom-right of this chart."
      : "This chart only uses rounds and games that were saved under the same shared session.";

    gameAnalyticsChartInstance = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Score vs Money",
            data: scoreMoneyPairs,
            backgroundColor: "rgba(53, 148, 71, 0.82)",
            borderColor: "#132033",
            borderWidth: 1.5,
            pointRadius: isMobileChart ? 5 : 6,
            pointHoverRadius: isMobileChart ? 6 : 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title(items) {
                return items[0]?.raw?.label || "Saved Game";
              },
              label(context) {
                const raw = context.raw || {};
                return `${raw.type || "Game"}: Score ${raw.x}, Money ${formatMoney(raw.y || 0)}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Round Score",
              font: {
                size: isMobileChart ? 11 : 12
              }
            },
            ticks: {
              font: {
                size: isMobileChart ? 10 : 12
              }
            }
          },
          y: {
            title: {
              display: true,
              text: "Game Money",
              font: {
                size: isMobileChart ? 11 : 12
              }
            },
            ticks: {
              font: {
                size: isMobileChart ? 10 : 12
              },
              callback(value) {
                return `$${value}`;
              }
            }
          }
        }
      }
    });
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
        const firTotals = getRoundFirAggregate(round);
        const girTotals = getRoundGirAggregate(round);

        acc.thru += getRoundHolesCount(round);
        acc.score += Number(round.totalScore) || 0;
        acc.vsPar += Number(round.vsPar) || 0;
        acc.putts += Number(round.totalPutts) || 0;
        acc.firHits += firTotals.hits;
        acc.firChances += firTotals.chances;
        acc.girHits += girTotals.hits;
        acc.girChances += girTotals.chances;
        return acc;
      },
      {
        thru: 0,
        score: 0,
        vsPar: 0,
        putts: 0,
        firHits: 0,
        firChances: 0,
        girHits: 0,
        girChances: 0
      }
    );

    const firPct = totals.firChances
      ? Math.round((totals.firHits / totals.firChances) * 100)
      : 0;
    const girPct = totals.girChances
      ? Math.round((totals.girHits / totals.girChances) * 100)
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
      const label = getSafeGameLabel(game);
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
                <div class="fw-bold">${escapeHtml(game.hole ?? "-")}</div>
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
                      * ${escapeHtml(player || `Player ${idx + 1}`)} - ${Number(totals[idx]) || 0} pts
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
          renderAnalyticsChart(allRounds);
          renderGameAnalyticsChart(allGames, allRounds);
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
          renderGameAnalyticsChart(allGames, allRounds);
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
      renderAnalyticsChart(allRounds);
      renderGameAnalyticsChart(allGames, allRounds);
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

      renderGameAnalyticsChart([], allRounds);
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
      renderGameAnalyticsChart(allGames, allRounds);
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

      renderGameAnalyticsChart([], allRounds);

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
    if (analyticsLoggedIn) analyticsLoggedIn.classList.toggle("d-none", !loggedIn);
    if (loginToUsePlayerData) loginToUsePlayerData.classList.toggle("d-none", loggedIn);
    if (playerDataShell) playerDataShell.classList.toggle("is-locked", !loggedIn);

    if (loggedIn) {
      scheduleAnalyticsRender(140);
    }
  }

  function updateGameDataLock(user) {
    const loggedIn = !!user;

    if (gameTotalsLoggedIn) gameTotalsLoggedIn.classList.toggle("d-none", !loggedIn);
    if (gamesPlayedLoggedIn) gamesPlayedLoggedIn.classList.toggle("d-none", !loggedIn);
    if (gameAnalyticsLoggedIn) gameAnalyticsLoggedIn.classList.toggle("d-none", !loggedIn);
    if (loginToUseGameData) loginToUseGameData.classList.toggle("d-none", loggedIn);
    if (savedGameDataShell) savedGameDataShell.classList.toggle("is-locked", !loggedIn);

    if (loggedIn) {
      scheduleGameAnalyticsRender(140);
    }
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
    renderGameAnalyticsChart([], allRounds);
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
        renderAnalyticsChart([]);
        resetGameDisplays();
        return;
      }

      loadSavedRounds(user.uid);
      loadSavedGames(user.uid);
    });
  }

  initPlayerLogRounds();

  analyticsTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.analyticsView;
      if (!nextView || nextView === activeAnalyticsView) return;

      activeAnalyticsView = nextView;
      renderAnalyticsChart(allRounds);
    });
  });

  gameAnalyticsTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const nextView = button.dataset.gameAnalyticsView;
      if (!nextView || nextView === activeGameAnalyticsView) return;

      activeGameAnalyticsView = nextView;
      renderGameAnalyticsChart(allGames, allRounds);
    });
  });

  window.addEventListener("resize", () => {
    scheduleAnalyticsRender(120);
    scheduleGameAnalyticsRender(120);
  });
});
