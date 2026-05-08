(function () {
  function getFirebase() {
    return window.firebase || null;
  }

  function getDb() {
    return getFirebase()?.firestore?.() || null;
  }

  function getFieldValue() {
    return getFirebase()?.firestore?.FieldValue || null;
  }

  function serverTimestamp() {
    return getFieldValue()?.serverTimestamp?.() || new Date();
  }

  function deleteField() {
    return getFieldValue()?.delete?.();
  }

  function normalizeUsername(value) {
    return String(value || "").trim().toLowerCase();
  }

  function toFiniteNumber(value) {
    const nextValue = Number(value);
    return Number.isFinite(nextValue) ? nextValue : null;
  }

  function normalizeGameType(data) {
    const raw = (data?.gameType || data?.gameName || "").toString().toLowerCase();

    if (raw.includes("wolf")) return "wolf";
    if (raw.includes("666") || raw.includes("six") || raw.includes("sixes")) return "666";
    if (raw.includes("bbb") || raw.includes("bingo")) return "bbb";

    return "unknown";
  }

  function getTrackedGamePoints(game) {
    const totals = Array.isArray(game?.totals) ? game.totals : [];
    const trackedIndex = Number(game?.trackedPlayerIndex);

    if (!Number.isInteger(trackedIndex) || trackedIndex < 0 || trackedIndex >= totals.length) {
      return null;
    }

    const trackedPoints = Number(totals[trackedIndex]);
    return Number.isFinite(trackedPoints) ? trackedPoints : null;
  }

  function getWolfAveragePointsFromGames(games) {
    const wolfGames = (Array.isArray(games) ? games : []).filter(
      (game) => normalizeGameType(game) === "wolf"
    );

    const trackedPoints = wolfGames
      .map((game) => getTrackedGamePoints(game))
      .filter((value) => value !== null);

    if (!trackedPoints.length) {
      return {
        value: null,
        gamesPlayed: 0,
        source: "none"
      };
    }

    const average =
      trackedPoints.reduce((sum, value) => sum + value, 0) / trackedPoints.length;

    if (!Number.isFinite(average)) {
      return {
        value: null,
        gamesPlayed: 0,
        source: "none"
      };
    }

    return {
      value: Number(average.toFixed(2)),
      gamesPlayed: trackedPoints.length,
      source: "savedWolfGames"
    };
  }

  function getLeaderboardMetric({ games = [] } = {}) {
    const wolfAverage = getWolfAveragePointsFromGames(games);
    if (wolfAverage.value !== null) {
      return {
        value: wolfAverage.value,
        gamesPlayed: wolfAverage.gamesPlayed,
        source: wolfAverage.source
      };
    }

    return {
      value: null,
      gamesPlayed: 0,
      source: "none"
    };
  }

  async function getSavedGames(db, user) {
    if (!db || !user?.uid) return [];

    try {
      const snap = await db
        .collection("users")
        .doc(user.uid)
        .collection("savedGames")
        .get();

      return snap.docs.map((doc) => doc.data());
    } catch (error) {
      console.warn("Could not load saved games for leaderboard sync:", error);
      return [];
    }
  }

  async function getPrivateUserData(db, user) {
    if (!db || !user?.uid) return {};

    try {
      const snap = await db.collection("users").doc(user.uid).get();
      return snap.data() || {};
    } catch (error) {
      console.warn("Could not load user profile for leaderboard sync:", error);
      return {};
    }
  }

  async function syncCurrentUserProfile(options = {}) {
    const user = options.user || getFirebase()?.auth?.().currentUser || null;
    const db = options.db || getDb();

    if (!db || !user?.uid) return null;

    const privateUserData = {
      ...(await getPrivateUserData(db, user)),
      ...(options.userData || {})
    };

    const username = String(
      options.username ||
      privateUserData.username ||
      user.displayName ||
      ""
    ).trim();

    if (!username || username.includes("@")) return null;

    const photoURL =
      typeof options.photoURL === "string"
        ? options.photoURL
        : String(
            privateUserData.photoURL ||
            user.photoURL ||
            ""
          );

    let games = Array.isArray(options.games) ? options.games : null;
    if (!games) {
      games = await getSavedGames(db, user);
    }

    const metric = getLeaderboardMetric({
      games: games || []
    });

    const payload = {
      uid: user.uid,
      username,
      usernameLower: normalizeUsername(username),
      photoURL,
      leaderboardOptIn: !!privateUserData.leaderboardOptIn,
      updatedAt: serverTimestamp(),
      leaderboardUpdatedAt: serverTimestamp()
    };

    if (metric.value !== null) {
      payload.leaderboardWolfAvgPoints = metric.value;
      payload.leaderboardWolfGamesPlayed = metric.gamesPlayed;
      payload.leaderboardMetric = "wolfAvgPoints";
      payload.leaderboardSource = metric.source;
      const deleteToken = deleteField();
      if (deleteToken) {
        payload.leaderboardHandicap = deleteToken;
      } else {
        payload.leaderboardHandicap = null;
      }
    } else {
      const deleteToken = deleteField();
      if (deleteToken) {
        payload.leaderboardWolfAvgPoints = deleteToken;
        payload.leaderboardWolfGamesPlayed = deleteToken;
        payload.leaderboardMetric = deleteToken;
        payload.leaderboardSource = deleteToken;
        payload.leaderboardHandicap = deleteToken;
      } else {
        payload.leaderboardWolfAvgPoints = null;
        payload.leaderboardWolfGamesPlayed = null;
        payload.leaderboardMetric = "";
        payload.leaderboardSource = "";
        payload.leaderboardHandicap = null;
      }
    }

    await db.collection("publicUsers").doc(user.uid).set(payload, { merge: true });
    return payload;
  }

  window.GFGLeaderboard = {
    normalizeUsername,
    normalizeGameType,
    getTrackedGamePoints,
    getWolfAveragePointsFromGames,
    getLeaderboardMetric,
    syncCurrentUserProfile
  };
})();
