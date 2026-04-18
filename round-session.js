(function () {
  const ACTIVE_SESSION_KEY = "gfg_active_round_session_v1";
  const ROUND_DRAFT_PREFIX = "gfg_round_draft_v1_";
  const GAME_DRAFT_PREFIX = "gfg_game_draft_v1_";

  function readJson(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn("[GFGSession] Could not read storage key:", key, error);
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("[GFGSession] Could not write storage key:", key, error);
      return false;
    }
  }

  function removeKey(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn("[GFGSession] Could not remove storage key:", key, error);
    }
  }

  function now() {
    return Date.now();
  }

  function normalizeGameType(type) {
    const raw = String(type || "").toLowerCase();
    if (raw.includes("wolf")) return "wolf";
    if (raw.includes("666") || raw.includes("six")) return "666";
    if (raw.includes("bbb") || raw.includes("bingo")) return "bbb";
    return "";
  }

  function createSessionId() {
    return `gfg_${now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function getActiveSession() {
    const session = readJson(ACTIVE_SESSION_KEY, null);
    return session && typeof session === "object" ? session : null;
  }

  function setActiveSession(session) {
    const nextSession = {
      sessionId: session?.sessionId || createSessionId(),
      createdAt: session?.createdAt || now(),
      updatedAt: now(),
      mode: "round+game",
      roundSaved: false,
      gameSaved: false,
      ...session
    };

    writeJson(ACTIVE_SESSION_KEY, nextSession);
    return nextSession;
  }

  function startRoundSession(patch = {}) {
    const existing = getActiveSession();
    const nextSession = existing?.sessionId === patch.sessionId
      ? { ...existing, ...patch }
      : { ...patch };

    return setActiveSession(nextSession);
  }

  function updateActiveSession(patch = {}) {
    const existing = getActiveSession();
    if (!existing) {
      return startRoundSession(patch);
    }

    return setActiveSession({
      ...existing,
      ...patch
    });
  }

  function clearActiveSession() {
    removeKey(ACTIVE_SESSION_KEY);
  }

  function getRoundDraftKey(sessionId) {
    return `${ROUND_DRAFT_PREFIX}${sessionId || "standalone"}`;
  }

  function getGameDraftKey(gameType, sessionId) {
    return `${GAME_DRAFT_PREFIX}${normalizeGameType(gameType) || "game"}_${sessionId || "standalone"}`;
  }

  function saveRoundDraft(sessionId, data) {
    writeJson(getRoundDraftKey(sessionId), {
      ...data,
      updatedAt: now()
    });
  }

  function loadRoundDraft(sessionId) {
    return readJson(getRoundDraftKey(sessionId), null);
  }

  function clearRoundDraft(sessionId) {
    removeKey(getRoundDraftKey(sessionId));
  }

  function saveGameDraft(gameType, sessionId, data) {
    writeJson(getGameDraftKey(gameType, sessionId), {
      ...data,
      updatedAt: now()
    });
  }

  function loadGameDraft(gameType, sessionId) {
    return readJson(getGameDraftKey(gameType, sessionId), null);
  }

  function clearGameDraft(gameType, sessionId) {
    removeKey(getGameDraftKey(gameType, sessionId));
  }

  function clearSessionArtifacts(sessionOrId) {
    const sessionId = typeof sessionOrId === "string"
      ? sessionOrId
      : sessionOrId?.sessionId;

    if (!sessionId) return;

    clearRoundDraft(sessionId);
    ["wolf", "666", "bbb"].forEach((gameType) => {
      clearGameDraft(gameType, sessionId);
    });

    const activeSession = getActiveSession();
    if (activeSession?.sessionId === sessionId) {
      clearActiveSession();
    }
  }

  function completeSessionPart(part, payload = {}) {
    const activeSession = getActiveSession();
    if (!activeSession) {
      return { session: null, completed: false };
    }

    const nextSession = updateActiveSession(
      part === "round"
        ? {
            roundSaved: true,
            roundDocId: payload.docId || activeSession.roundDocId || null
          }
        : {
            gameSaved: true,
            gameDocId: payload.docId || activeSession.gameDocId || null
          }
    );

    const completed = !!(nextSession?.roundSaved && nextSession?.gameSaved);

    if (completed) {
      clearSessionArtifacts(nextSession);
    }

    return {
      session: nextSession,
      completed
    };
  }

  function getSessionIdFromUrl() {
    try {
      return new URLSearchParams(window.location.search).get("sessionId") || "";
    } catch (error) {
      return "";
    }
  }

  function getGamePath(gameType) {
    const normalized = normalizeGameType(gameType);
    if (normalized === "wolf") return "Wolf.html";
    if (normalized === "666") return "666.html";
    if (normalized === "bbb") return "bbb.html";
    return "goodflightgames.html";
  }

  function getLinkedGameUrl(gameType, sessionId) {
    const path = getGamePath(gameType);
    return `${path}?sessionId=${encodeURIComponent(sessionId || "")}`;
  }

  function getScorecardUrl(sessionId) {
    return `../rounds/scorecard.html${sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : ""}`;
  }

  window.GFGSession = {
    normalizeGameType,
    createSessionId,
    getActiveSession,
    setActiveSession,
    startRoundSession,
    updateActiveSession,
    clearActiveSession,
    saveRoundDraft,
    loadRoundDraft,
    clearRoundDraft,
    saveGameDraft,
    loadGameDraft,
    clearGameDraft,
    clearSessionArtifacts,
    completeSessionPart,
    getSessionIdFromUrl,
    getLinkedGameUrl,
    getScorecardUrl
  };
})();
