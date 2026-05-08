(function () {
  const suggestionRegistry = new Map();
  let pickerUiBound = false;

  function normalizeName(value) {
    return String(value || "").trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function waitForFirebaseReady() {
    return new Promise((resolve) => {
      const ready = () => {
        try {
          window.gfgEnsureFirebaseApp?.();
          return !!(window.firebase?.apps && window.firebase.apps.length && window.firebase?.auth && window.firebase?.firestore);
        } catch (error) {
          return false;
        }
      };

      if (ready()) {
        resolve(true);
        return;
      }

      const onReady = () => {
        if (!ready()) return;
        window.removeEventListener("gfg-firebase-ready", onReady);
        resolve(true);
      };

      window.addEventListener("gfg-firebase-ready", onReady);

      const poll = window.setInterval(() => {
        if (!ready()) return;
        window.clearInterval(poll);
        window.removeEventListener("gfg-firebase-ready", onReady);
        resolve(true);
      }, 50);

      window.setTimeout(() => {
        window.clearInterval(poll);
        resolve(ready());
      }, 5000);
    });
  }

  function setHelperMessage(helperEl, message, type) {
    if (!helperEl) return;
    helperEl.textContent = message || "";
    helperEl.className = "game-friend-suggestion-note";
    if (type) helperEl.classList.add(`is-${type}`);
  }

  async function loadCurrentUsername(user, db) {
    try {
      const publicSnap = await db.collection("publicUsers").doc(user.uid).get();
      const publicName = String(publicSnap.data()?.username || "").trim();
      if (publicName) return publicName;

      const privateSnap = await db.collection("users").doc(user.uid).get();
      const privateName = String(privateSnap.data()?.username || "").trim();
      if (privateName && !privateName.includes("@")) return privateName;
    } catch (error) {
      console.error("Could not load current username for game suggestions:", error);
    }

    return "";
  }

  async function loadAcceptedFriendNames(user, db) {
    const requests = db.collection("friendRequests");
    const [incomingSnap, outgoingSnap] = await Promise.all([
      requests.where("toUid", "==", user.uid).get(),
      requests.where("fromUid", "==", user.uid).get()
    ]);

    const seen = new Map();

    incomingSnap.docs.forEach((doc) => {
      const data = doc.data() || {};
      if (data.status !== "accepted") return;
      const name = String(data.fromUsername || "").trim();
      if (!name) return;
      seen.set(normalizeName(name), name);
    });

    outgoingSnap.docs.forEach((doc) => {
      const data = doc.data() || {};
      if (data.status !== "accepted") return;
      const name = String(data.toUsername || "").trim();
      if (!name) return;
      seen.set(normalizeName(name), name);
    });

    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
  }

  function ensureDatalist(listId) {
    let list = document.getElementById(listId);
    if (!list) {
      list = document.createElement("datalist");
      list.id = listId;
      document.body.appendChild(list);
    }
    return list;
  }

  function ensurePickerPanel(listId) {
    const panelId = `${listId}-picker`;
    let panel = document.getElementById(panelId);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = panelId;
      panel.className = "gfg-player-suggestion-menu hidden";
      panel.setAttribute("role", "listbox");
      document.body.appendChild(panel);
    }
    return panel;
  }

  function positionPickerPanel(panel, input) {
    if (!panel || !input) return;
    const rect = input.getBoundingClientRect();
    panel.style.left = `${window.scrollX + rect.left}px`;
    panel.style.top = `${window.scrollY + rect.bottom + 6}px`;
    panel.style.width = `${rect.width}px`;
  }

  function hidePicker(state) {
    if (!state?.panel) return;
    state.panel.classList.add("hidden");
    state.panel.innerHTML = "";
    state.activeInput = null;
    state.matches = [];
    state.highlightedIndex = -1;
  }

  function getFilteredNames(state, query) {
    const normalizedQuery = normalizeName(query);
    if (!normalizedQuery) return [...state.names];

    const startsWithMatches = [];
    const containsMatches = [];

    state.names.forEach((name) => {
      const normalized = normalizeName(name);
      if (!normalized) return;
      if (normalized.startsWith(normalizedQuery)) {
        startsWithMatches.push(name);
      } else if (normalized.includes(normalizedQuery)) {
        containsMatches.push(name);
      }
    });

    const matches = [...startsWithMatches, ...containsMatches];
    return matches.length ? matches : [...state.names];
  }

  function renderPicker(state, input) {
    if (!state?.panel || !input || !state.names.length) {
      hidePicker(state);
      return;
    }

    const matches = getFilteredNames(state, input.value).slice(0, 8);
    if (!matches.length) {
      hidePicker(state);
      return;
    }

    state.activeInput = input;
    state.matches = matches;

    if (state.highlightedIndex < 0 || state.highlightedIndex >= matches.length) {
      state.highlightedIndex = 0;
    }

    state.panel.innerHTML = matches.map((name, idx) => `
      <button
        type="button"
        class="gfg-player-suggestion-option${idx === state.highlightedIndex ? " is-active" : ""}"
        data-suggestion-name="${escapeHtml(name)}">
        ${escapeHtml(name)}
      </button>
    `).join("");

    positionPickerPanel(state.panel, input);
    state.panel.classList.remove("hidden");
  }

  function selectSuggestion(state, input, value) {
    if (!input) return;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    hidePicker(state);
    input.focus();
  }

  function bindInputPicker(input, state) {
    if (!input || input.dataset.gfgFriendPickerBound === state.listId) return;

    input.dataset.gfgFriendPickerBound = state.listId;
    input.setAttribute("list", state.datalist.id);
    input.setAttribute("autocomplete", "off");
    input.setAttribute("spellcheck", "false");

    input.addEventListener("focus", () => {
      state.highlightedIndex = 0;
      renderPicker(state, input);
    });

    input.addEventListener("click", () => {
      state.highlightedIndex = 0;
      renderPicker(state, input);
    });

    input.addEventListener("input", () => {
      state.highlightedIndex = 0;
      renderPicker(state, input);
    });

    input.addEventListener("keydown", (event) => {
      const pickerOpen = !state.panel.classList.contains("hidden");

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!pickerOpen) {
          state.highlightedIndex = 0;
          renderPicker(state, input);
          return;
        }
        state.highlightedIndex = Math.min(state.highlightedIndex + 1, state.matches.length - 1);
        renderPicker(state, input);
        return;
      }

      if (event.key === "ArrowUp" && pickerOpen) {
        event.preventDefault();
        state.highlightedIndex = Math.max(state.highlightedIndex - 1, 0);
        renderPicker(state, input);
        return;
      }

      if (event.key === "Enter" && pickerOpen && state.matches[state.highlightedIndex]) {
        event.preventDefault();
        selectSuggestion(state, input, state.matches[state.highlightedIndex]);
        return;
      }

      if (event.key === "Escape" && pickerOpen) {
        event.preventDefault();
        hidePicker(state);
      }
    });

    input.addEventListener("blur", () => {
      window.setTimeout(() => {
        if (document.activeElement && state.panel.contains(document.activeElement)) return;
        if (state.activeInput === input) hidePicker(state);
      }, 120);
    });
  }

  function bindPickerUi() {
    if (pickerUiBound) return;
    pickerUiBound = true;

    document.addEventListener("pointerdown", (event) => {
      suggestionRegistry.forEach((state) => {
        const clickedInput = state.activeInput === event.target || state.activeInput?.contains(event.target);
        const clickedPanel = state.panel?.contains(event.target);
        if (!clickedInput && !clickedPanel) {
          hidePicker(state);
        }
      });
    });

    document.addEventListener("mousedown", (event) => {
      const option = event.target.closest(".gfg-player-suggestion-option");
      if (!option) return;

      const panel = option.closest(".gfg-player-suggestion-menu");
      const state = Array.from(suggestionRegistry.values()).find((entry) => entry.panel === panel);
      if (!state?.activeInput) return;

      event.preventDefault();
      selectSuggestion(state, state.activeInput, option.dataset.suggestionName || option.textContent || "");
    });

    const repositionOpenPickers = () => {
      suggestionRegistry.forEach((state) => {
        if (!state.activeInput || state.panel.classList.contains("hidden")) return;
        if (!document.body.contains(state.activeInput)) {
          hidePicker(state);
          return;
        }
        positionPickerPanel(state.panel, state.activeInput);
      });
    };

    window.addEventListener("resize", repositionOpenPickers);
    window.addEventListener("scroll", repositionOpenPickers, true);
  }

  async function attachPlayerSuggestions({ inputSelector, helperId, listId }) {
    const inputs = Array.from(document.querySelectorAll(inputSelector || ""));
    if (!inputs.length) return;

    const resolvedListId = listId || `gfgFriendSuggestions-${Math.random().toString(36).slice(2, 8)}`;
    const helperEl = helperId ? document.getElementById(helperId) : null;
    const datalist = ensureDatalist(resolvedListId);
    const panel = ensurePickerPanel(resolvedListId);

    bindPickerUi();

    const existing = suggestionRegistry.get(resolvedListId);
    if (existing) {
      existing.helperId = helperId || existing.helperId;
      inputs.forEach((input) => bindInputPicker(input, existing));
      setHelperMessage(helperEl, existing.message, existing.type);
      if (existing.activeInput && !existing.panel.classList.contains("hidden")) {
        renderPicker(existing, existing.activeInput);
      }
      return;
    }

    const state = {
      helperId,
      listId: resolvedListId,
      datalist,
      panel,
      message: "",
      type: "",
      names: [],
      matches: [],
      highlightedIndex: -1,
      activeInput: null
    };
    suggestionRegistry.set(resolvedListId, state);

    inputs.forEach((input) => bindInputPicker(input, state));

    const updateHelper = (message, type) => {
      state.message = message || "";
      state.type = type || "";
      setHelperMessage(state.helperId ? document.getElementById(state.helperId) : null, state.message, state.type);
    };

    const firebaseReady = await waitForFirebaseReady();
    if (!firebaseReady) {
      updateHelper("Friend suggestions will appear here once Firebase is ready.", "info");
      return;
    }

    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        datalist.innerHTML = "";
        state.names = [];
        hidePicker(state);
        updateHelper("Log in to pick from your username and accepted friends in the player slots.", "info");
        return;
      }

      try {
        const db = firebase.firestore();
        const [currentUsername, friendNames] = await Promise.all([
          loadCurrentUsername(user, db),
          loadAcceptedFriendNames(user, db)
        ]);

        const orderedNames = [];
        const seen = new Set();

        [currentUsername, ...friendNames].forEach((name) => {
          const trimmed = String(name || "").trim();
          const normalized = normalizeName(trimmed);
          if (!trimmed || seen.has(normalized)) return;
          seen.add(normalized);
          orderedNames.push(trimmed);
        });

        state.names = orderedNames;
        datalist.innerHTML = orderedNames
          .map((name) => `<option value="${escapeHtml(name)}"></option>`)
          .join("");

        if (friendNames.length) {
          updateHelper("Click or type in any player box to pick from your accepted friends.", "success");
        } else if (currentUsername) {
          updateHelper("Click a player box to pick your username. Add friends in My Account or the Clubhouse for more quick picks.", "info");
        } else {
          updateHelper("Add a username in My Account, then accepted friends will show up here too.", "info");
        }

        if (state.activeInput && document.body.contains(state.activeInput)) {
          renderPicker(state, state.activeInput);
        }
      } catch (error) {
        console.error("Could not load game friend suggestions:", error);
        datalist.innerHTML = "";
        state.names = [];
        hidePicker(state);
        updateHelper("Could not load friend suggestions right now.", "error");
      }
    });
  }

  window.GFGGameFriends = {
    attachPlayerSuggestions
  };
})();
