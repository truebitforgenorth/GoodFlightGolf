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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

  function getActiveSessionForId(sessionId) {
    const activeSession = getActiveSession();
    return activeSession?.sessionId === sessionId ? activeSession : null;
  }

  function getGameDraftSummary(gameType, sessionId) {
    const normalized = normalizeGameType(gameType);
    const draft = loadGameDraft(normalized, sessionId);

    if (!draft) {
      return {
        exists: false,
        readyToSave: false,
        gameType: normalized,
        draft: null
      };
    }

    const trackedPlayerIndex = Number.isInteger(draft.trackedPlayerIndex) ? draft.trackedPlayerIndex : null;
    const finished = Number(draft.hole) === 19;

    return {
      exists: true,
      readyToSave: finished && trackedPlayerIndex !== null,
      finished,
      hasTrackedPlayer: trackedPlayerIndex !== null,
      trackedPlayerIndex,
      gameType: normalized,
      draft
    };
  }

  async function saveLinkedGameForCurrentUser(gameType, sessionId) {
    const normalized = normalizeGameType(gameType);
    const draftSummary = getGameDraftSummary(normalized, sessionId);

    if (!normalized) {
      return { ok: false, code: "invalid-game", message: "Choose a valid linked game first." };
    }

    if (!draftSummary.exists) {
      return { ok: false, code: "missing-draft", message: "Open the linked game and enter the scores first." };
    }

    if (!draftSummary.finished) {
      return { ok: false, code: "game-not-finished", message: "Finish the linked game before saving both." };
    }

    if (!draftSummary.hasTrackedPlayer) {
      return { ok: false, code: "missing-player", message: "Choose your player slot in the linked game before saving both." };
    }

    const user = window.firebase?.auth?.().currentUser;
    if (!user) {
      return { ok: false, code: "auth-required", message: "Please log in to save the linked game." };
    }

    const firestore = window.firebase?.firestore?.();
    const serverTimestamp = window.firebase?.firestore?.FieldValue?.serverTimestamp;
    if (!firestore || !serverTimestamp) {
      return { ok: false, code: "firebase-missing", message: "Firebase is not ready yet." };
    }

    const sessionMeta = getActiveSessionForId(sessionId);
    const draft = draftSummary.draft || {};
    const players = Array.isArray(draft.players) && draft.players.length ? draft.players : ["Player 1", "Player 2", "Player 3", "Player 4"];
    const trackedPlayerIndex = draftSummary.trackedPlayerIndex;

    const payload = {
      gameType: normalized,
      sessionId: sessionId || null,
      sessionMode: sessionId ? "round+game" : "game-only",
      linkedCourseName: sessionMeta?.courseName || null,
      linkedTeeName: sessionMeta?.teeName || null,
      linkedRoundDate: sessionMeta?.roundDate || null,
      hole: Number(draft.hole) || 19,
      holes: draft.holes || {},
      totals: draft.totals || [0, 0, 0, 0],
      players,
      trackedPlayerIndex,
      trackedPlayerName: players[trackedPlayerIndex] || `Player ${trackedPlayerIndex + 1}`,
      trackedUserUid: user.uid,
      timestamp: serverTimestamp()
    };

    if (normalized === "wolf") {
      Object.assign(payload, {
        base: Number(draft.base) || 0,
        dollarValue: Number(draft.dollarValue) || 0,
        loneWinPoints: Number(draft.loneWinPoints) || 0,
        loneLosePoints: Number(draft.loneLosePoints) || 0,
        dumpWinPoints: Number(draft.dumpWinPoints) || 0,
        dumpLosePoints: Number(draft.dumpLosePoints) || 0,
        blindWinPoints: Number(draft.blindWinPoints) || 0,
        blindLosePoints: Number(draft.blindLosePoints) || 0,
        tieSetPoints: Number(draft.tieSetPoints) || 0,
        loneEnabled: !!draft.loneEnabled,
        dumpEnabled: !!draft.dumpEnabled,
        blindEnabled: !!draft.blindEnabled,
        carryoverEnabled: !!draft.carryoverEnabled,
        birdieDoubleEnabled: !!draft.birdieDoubleEnabled
      });
    } else if (normalized === "666") {
      Object.assign(payload, {
        base: Number(draft.base) || 0,
        dollarValue: Number(draft.dollarValue) || 0,
        tieSetPoints: draft.tieSetPoints !== null && draft.tieSetPoints !== undefined ? Number(draft.tieSetPoints) : null,
        tieMultiplier: Number(draft.tieMultiplier) || 1
      });
    } else if (normalized === "bbb") {
      Object.assign(payload, {
        bet: Number(draft.bet) || 0
      });
    }

    const docRef = await firestore
      .collection("users")
      .doc(user.uid)
      .collection("savedGames")
      .add(payload);

    if (sessionId) {
      const completion = completeSessionPart("game", { docId: docRef.id });
      if (!completion.completed) {
        clearGameDraft(normalized, sessionId);
        updateActiveSession({
          sessionId,
          gameSaved: true,
          gameDocId: docRef.id,
          gameType: normalized
        });
      }
    }

    return {
      ok: true,
      code: "saved",
      docId: docRef.id,
      message: `${normalized.toUpperCase()} game saved.`
    };
  }

  function isInteractiveSwipeTarget(target) {
    return !!target?.closest?.("input, select, textarea, option");
  }

  function attachLinkedFullscreenSwipe(config = {}) {
    const surface = config.surface;
    if (!surface) return () => {};

    const direction = config.direction === "right" ? "right" : "left";
    const previewSide = direction === "left" ? "right" : "left";
    const prefersPointer = typeof window.PointerEvent === "function";
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let tracking = false;
    let dragging = false;
    let activePointerId = null;

    function getContentSurface() {
      return surface.querySelector("#fullscreenContent") || surface;
    }

    function getSwipeThreshold() {
      const width = surface.clientWidth || window.innerWidth || 390;
      return Math.min(150, Math.max(84, width * 0.18));
    }

    function getPreviewLabel() {
      if (typeof config.getPreviewLabel === "function") {
        return config.getPreviewLabel() || "";
      }

      return direction === "left" ? "Continue" : "Back";
    }

    function ensureSwipePreview() {
      let preview = surface.querySelector(".gfg-linked-swipe-preview");
      if (!preview) {
        preview = document.createElement("div");
        preview.className = "gfg-linked-swipe-preview";
        preview.setAttribute("aria-hidden", "true");
        surface.appendChild(preview);
      }

      preview.className = `gfg-linked-swipe-preview gfg-linked-swipe-preview--${previewSide}`;
      preview.textContent = getPreviewLabel();
      return preview;
    }

    function resetSwipePreview() {
      surface.classList.remove("gfg-linked-swipe-active");
      surface.style.removeProperty("--gfg-linked-swipe-shift");
      surface.style.removeProperty("--gfg-linked-swipe-progress");

      const preview = surface.querySelector(".gfg-linked-swipe-preview");
      preview?.classList.remove("is-visible");
    }

    function applySwipePreview(deltaX) {
      const cappedDelta = clamp(direction === "left" ? Math.min(0, deltaX) : Math.max(0, deltaX), -180, 180);
      const progress = Math.min(Math.abs(cappedDelta) / getSwipeThreshold(), 1);

      surface.classList.add("gfg-linked-swipe-active");
      surface.style.setProperty("--gfg-linked-swipe-shift", `${cappedDelta}px`);
      surface.style.setProperty("--gfg-linked-swipe-progress", progress.toFixed(3));
      ensureSwipePreview().classList.add("is-visible");
    }

    function beginTracking(clientX, clientY, target, pointerId = null) {
      if (typeof config.isEnabled === "function" && !config.isEnabled()) return false;
      if (isInteractiveSwipeTarget(target)) return false;

      tracking = true;
      dragging = false;
      activePointerId = pointerId;
      startX = clientX;
      startY = clientY;
      currentX = clientX;
      ensureSwipePreview();
      return true;
    }

    function moveTracking(clientX, clientY, event) {
      if (!tracking) return;

      currentX = clientX;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      if (!dragging) {
        const verticalGesture = Math.abs(deltaY) > 18 && Math.abs(deltaY) > Math.abs(deltaX);
        if (verticalGesture) {
          tracking = false;
          activePointerId = null;
          resetSwipePreview();
          return;
        }

        const horizontalGesture = Math.abs(deltaX) >= 14 && Math.abs(deltaX) > Math.abs(deltaY) + 8;
        const directionMatches = direction === "left" ? deltaX < 0 : deltaX > 0;

        if (!horizontalGesture || !directionMatches) return;
        dragging = true;
      }

      if (event?.cancelable) {
        event.preventDefault();
      }

      applySwipePreview(deltaX);
    }

    function endTracking(clientX = currentX) {
      if (!tracking) return;

      const deltaX = clientX - startX;
      const enoughHorizontalTravel = Math.abs(deltaX) >= getSwipeThreshold();
      const directionMatches = direction === "left" ? deltaX < 0 : deltaX > 0;
      const targetUrl = typeof config.getTargetUrl === "function" ? config.getTargetUrl() : "";
      const shouldNavigate = dragging && enoughHorizontalTravel && directionMatches && !!targetUrl;

      tracking = false;
      dragging = false;
      activePointerId = null;
      resetSwipePreview();

      if (shouldNavigate) {
        const contentSurface = getContentSurface();
        contentSurface.style.transition = "transform 180ms ease";
        contentSurface.style.transform = `translate3d(${direction === "left" ? "-100vw" : "100vw"}, 0, 0)`;
        window.setTimeout(() => {
          window.location.href = targetUrl;
        }, 120);
      }
    }

    function onTouchStart(event) {
      if (prefersPointer) return;
      if (event.touches.length !== 1) return;

      beginTracking(event.touches[0].clientX, event.touches[0].clientY, event.target);
    }

    function onTouchMove(event) {
      if (prefersPointer) return;
      const touch = event.touches?.[0];
      if (!touch) return;

      moveTracking(touch.clientX, touch.clientY, event);
    }

    function onTouchEnd(event) {
      if (prefersPointer) return;
      const touch = event.changedTouches?.[0];
      endTracking(touch?.clientX ?? currentX);
    }

    function onTouchCancel() {
      tracking = false;
      dragging = false;
      activePointerId = null;
      resetSwipePreview();
    }

    function onPointerDown(event) {
      if (!prefersPointer) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      beginTracking(event.clientX, event.clientY, event.target, event.pointerId);
    }

    function onPointerMove(event) {
      if (!prefersPointer || !tracking || event.pointerId !== activePointerId) return;

      moveTracking(event.clientX, event.clientY, event);
    }

    function onPointerUp(event) {
      if (!prefersPointer || event.pointerId !== activePointerId) return;

      endTracking(event.clientX);
    }

    function onPointerCancel(event) {
      if (!prefersPointer || event.pointerId !== activePointerId) return;

      tracking = false;
      dragging = false;
      activePointerId = null;
      resetSwipePreview();
    }

    surface.addEventListener("touchstart", onTouchStart, { passive: true });
    surface.addEventListener("touchmove", onTouchMove, { passive: false });
    surface.addEventListener("touchend", onTouchEnd, { passive: true });
    surface.addEventListener("touchcancel", onTouchCancel, { passive: true });

    surface.addEventListener("pointerdown", onPointerDown, { passive: true });
    surface.addEventListener("pointermove", onPointerMove, { passive: false });
    surface.addEventListener("pointerup", onPointerUp, { passive: true });
    surface.addEventListener("pointercancel", onPointerCancel, { passive: true });

    return function detachLinkedFullscreenSwipe() {
      surface.removeEventListener("touchstart", onTouchStart);
      surface.removeEventListener("touchmove", onTouchMove);
      surface.removeEventListener("touchend", onTouchEnd);
      surface.removeEventListener("touchcancel", onTouchCancel);
      surface.removeEventListener("pointerdown", onPointerDown);
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerup", onPointerUp);
      surface.removeEventListener("pointercancel", onPointerCancel);
      resetSwipePreview();
    };
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
    getScorecardUrl,
    getGameDraftSummary,
    saveLinkedGameForCurrentUser,
    attachLinkedFullscreenSwipe
  };
})();
