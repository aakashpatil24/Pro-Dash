/* ============================================================
   ProDash — Productivity Dashboard
   script.js — All logic in one file, organized by module
============================================================ */

'use strict';

/* ============================================================
   CONFIG — Constants, keys, defaults
============================================================ */
const CONFIG = {

    // ⚠️  Replace with your OpenWeatherMap API key (free at openweathermap.org)
    WEATHER_API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY',
    WEATHER_URL: 'https://api.openweathermap.org/data/2.5/weather',

    // Quote API — free, CORS-enabled, no key required
    QUOTE_URL: 'https://api.quotable.io/random',

    // Pomodoro durations in seconds
    POMODORO: {
        work:  25 * 60,
        short:  5 * 60,
        long:  15 * 60,
    },

    // Planner time range (24-hr)
    PLANNER_START: 6,
    PLANNER_END: 23,

    // LocalStorage keys — prefixed to avoid collisions
    LS: {
        theme:   'pdb_theme',
        todos:   'pdb_todos',
        goals:   'pdb_goals',
        planner: 'pdb_planner',
    },

    // Weather icon map (OpenWeatherMap icon code → emoji)
    WEATHER_ICONS: {
        '01d':'☀️','01n':'🌙',
        '02d':'⛅','02n':'⛅',
        '03d':'☁️','03n':'☁️',
        '04d':'☁️','04n':'☁️',
        '09d':'🌧','09n':'🌧',
        '10d':'🌦','10n':'🌧',
        '11d':'⛈','11n':'⛈',
        '13d':'❄️','13n':'❄️',
        '50d':'🌫','50n':'🌫',
    },

    // Background gradients per time-of-day (used as fallback if image missing)
    BACKGROUNDS: {
        morning:   { img: 'assets/backgrounds/morning.jpg',   gradient: 'linear-gradient(135deg,#fbd786,#f7797d)' },
        afternoon: { img: 'assets/backgrounds/afternoon.jpg', gradient: 'linear-gradient(135deg,#84fab0,#8fd3f4)' },
        evening:   { img: 'assets/backgrounds/evening.jpg',   gradient: 'linear-gradient(135deg,#f093fb,#f5576c)' },
        night:     { img: 'assets/backgrounds/night.jpg',     gradient: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)' },
    },

    // Fallback quotes shown if API is unreachable
    FALLBACK_QUOTES: [
        { content: 'The secret of getting ahead is getting started.',                     author: 'Mark Twain' },
        { content: 'It always seems impossible until it\'s done.',                        author: 'Nelson Mandela' },
        { content: 'Don\'t watch the clock; do what it does. Keep going.',               author: 'Sam Levenson' },
        { content: 'Success is the sum of small efforts, repeated day in and day out.',   author: 'Robert Collier' },
        { content: 'Believe you can and you\'re halfway there.',                          author: 'Theodore Roosevelt' },
        { content: 'The future depends on what you do today.',                            author: 'Mahatma Gandhi' },
        { content: 'You don\'t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
        { content: 'Focus on being productive instead of busy.',                          author: 'Tim Ferriss' },
    ],
};


/* ============================================================
   STATE — Shared application state
============================================================ */
const STATE = {
    activeFeature:  null,
    todos:          [],
    todoFilter:     'all',
    goals:          [],
    planner:        {},
    pomodoro: {
        mode:        'work',
        timeLeft:    CONFIG.POMODORO.work,
        totalTime:   CONFIG.POMODORO.work,
        isRunning:   false,
        intervalId:  null,
        sessionNum:  1,
    },
    clockId:     null,
    bgCheckId:   null,
    weatherCache: null,   // stores last fetched weather API response
    weatherLoaded: false,
};


/* ============================================================
   DOM — Cached element references (queried once on load)
============================================================ */
const DOM = {};

function cacheDOM() {
    // App
    DOM.appWrapper    = document.getElementById('app-wrapper');
    DOM.dashboard     = document.getElementById('dashboard');
    DOM.featureView   = document.getElementById('feature-view');
    DOM.featureTitle  = document.getElementById('feature-title');
    DOM.backBtn       = document.getElementById('back-btn');
    DOM.cards         = document.querySelectorAll('.feature-card');
    DOM.sections      = document.querySelectorAll('.feature-section');

    // Top bar
    DOM.themeToggle     = document.getElementById('theme-toggle');
    DOM.currentTime     = document.getElementById('current-time');
    DOM.currentDate     = document.getElementById('current-date');
    DOM.ftTime          = document.getElementById('ft-time');
    DOM.greetingText    = document.getElementById('greeting-text');
    DOM.weatherMini     = document.getElementById('weather-mini');
    DOM.weatherMiniIcon = document.getElementById('weather-mini-icon');
    DOM.weatherMiniTemp = document.getElementById('weather-mini-temp');
    DOM.weatherMiniCity = document.getElementById('weather-mini-city');

    // Todo
    DOM.todoInput    = document.getElementById('todo-input');
    DOM.todoAddBtn   = document.getElementById('todo-add-btn');
    DOM.todoList     = document.getElementById('todo-list');
    DOM.todoCount    = document.getElementById('todo-count');
    DOM.todoClearBtn = document.getElementById('todo-clear-btn');
    DOM.todoBadge    = document.getElementById('todo-badge');
    DOM.filterBtns   = document.querySelectorAll('.filter-btn');

    // Planner
    DOM.plannerSlots   = document.getElementById('planner-slots');
    DOM.plannerDateLbl = document.getElementById('planner-date-label');
    DOM.plannerClearBtn = document.getElementById('planner-clear-btn');

    // Pomodoro
    DOM.pomoTime       = document.getElementById('pomo-time');
    DOM.pomoLabel      = document.getElementById('pomo-label');
    DOM.pomoStart      = document.getElementById('pomo-start');
    DOM.pomoPause      = document.getElementById('pomo-pause');
    DOM.pomoReset      = document.getElementById('pomo-reset');
    DOM.pomoSessionLbl = document.getElementById('pomo-session-label');
    DOM.pomoMessage    = document.getElementById('pomo-message');
    DOM.modeTabs       = document.querySelectorAll('.mode-tab');
    DOM.timerRing      = document.getElementById('timer-ring-fill');

    // Quote
    DOM.quoteText    = document.getElementById('quote-text');
    DOM.quoteAuthor  = document.getElementById('quote-author');
    DOM.quoteNewBtn  = document.getElementById('quote-new-btn');
    DOM.quoteCopyBtn = document.getElementById('quote-copy-btn');
    DOM.quoteStatus  = document.getElementById('quote-status');

    // Weather
    DOM.weatherLoading   = document.getElementById('weather-loading');
    DOM.weatherError     = document.getElementById('weather-error');
    DOM.weatherErrMsg    = document.getElementById('weather-err-msg');
    DOM.weatherDataDiv   = document.getElementById('weather-data');
    DOM.wIcon            = document.getElementById('w-icon');
    DOM.wTemp            = document.getElementById('w-temp');
    DOM.wCondition       = document.getElementById('w-condition');
    DOM.wCity            = document.getElementById('w-city');
    DOM.wHumidity        = document.getElementById('w-humidity');
    DOM.wWind            = document.getElementById('w-wind');
    DOM.wFeels           = document.getElementById('w-feels');
    DOM.wVisibility      = document.getElementById('w-visibility');
    DOM.weatherCityInput = document.getElementById('weather-city-input');
    DOM.weatherCityBtn   = document.getElementById('weather-city-btn');
    DOM.weatherRefreshBtn = document.getElementById('weather-refresh-btn');

    // Goals
    DOM.goalsInput       = document.getElementById('goals-input');
    DOM.goalsAddBtn      = document.getElementById('goals-add-btn');
    DOM.goalsList        = document.getElementById('goals-list');
    DOM.goalsProgressTxt = document.getElementById('goals-progress-text');
    DOM.goalsProgressPct = document.getElementById('goals-progress-pct');
    DOM.goalsProgressBar = document.getElementById('goals-progress-bar');
    DOM.goalsBadge       = document.getElementById('goals-badge');
    DOM.goalsClearBtn    = document.getElementById('goals-clear-btn');
}


/* ============================================================
   HELPERS
============================================================ */
const Helpers = {

    // Safe HTML escape (prevents XSS when injecting user input via innerHTML)
    escapeHTML(str) {
        const el = document.createElement('div');
        el.appendChild(document.createTextNode(String(str)));
        return el.innerHTML;
    },

    // Safe localStorage get with JSON parse
    lsGet(key) {
        try {
            const v = localStorage.getItem(key);
            return v ? JSON.parse(v) : null;
        } catch {
            return null;
        }
    },

    // Safe localStorage set with JSON stringify
    lsSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            console.warn('localStorage write failed for key:', key);
        }
    },

    // Format seconds into MM:SS
    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },

    // Pick a random item from an array
    randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },
};


/* ============================================================
   NAVIGATION MODULE
============================================================ */
const Navigation = {

    TITLES: {
        todo:     'Todo List',
        planner:  'Daily Planner',
        pomodoro: 'Pomodoro Timer',
        quote:    'Daily Quote',
        weather:  'Weather',
        goals:    'Daily Goals',
    },

    // Open a feature panel by name
    open(name) {
        // Prevent redundant re-opens
        if (STATE.activeFeature === name) return;

        // Deactivate all sections
        DOM.sections.forEach(s => s.classList.remove('active'));

        const section = document.getElementById(`feature-${name}`);
        if (!section) return;

        // Activate the target section
        section.classList.add('active');
        STATE.activeFeature = name;

        // Update header title
        DOM.featureTitle.textContent = this.TITLES[name] || name;

        // Switch visibility: hide dashboard, show feature view
        DOM.dashboard.classList.add('hidden');
        DOM.featureView.classList.add('active');

        // Scroll feature view to top
        DOM.featureView.scrollTop = 0;

        // Run per-feature on-open logic
        this._onOpen(name);
    },

    // Close feature panel and return to dashboard
    close() {
        DOM.featureView.classList.remove('active');
        DOM.dashboard.classList.remove('hidden');
        DOM.sections.forEach(s => s.classList.remove('active'));
        STATE.activeFeature = null;
    },

    // Actions to run when a specific feature opens
    _onOpen(name) {
        switch (name) {
            case 'quote':
                Quote.fetch();
                break;
            case 'weather':
                Weather.onOpen();
                break;
            case 'planner':
                Planner.highlightCurrent();
                break;
        }
    },

    init() {
        // Card clicks — use data-target attribute for routing (one handler for all)
        DOM.cards.forEach(card => {
            card.addEventListener('click', () => {
                this.open(card.dataset.target);
            });
        });

        // Back button
        DOM.backBtn.addEventListener('click', () => this.close());

        // Weather mini pill click also opens weather feature
        DOM.weatherMini.addEventListener('click', () => this.open('weather'));
    },
};


/* ============================================================
   DATETIME MODULE
============================================================ */
const DateTimeModule = {

    DAYS:   ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    MONTHS: ['January','February','March','April','May','June',
             'July','August','September','October','November','December'],

    formatDisplayTime(date) {
        let h = date.getHours();
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`;
    },

    formatDisplayDate(date) {
        const day  = this.DAYS[date.getDay()];
        const num  = String(date.getDate()).padStart(2, '0');
        const mon  = this.MONTHS[date.getMonth()];
        const year = date.getFullYear();
        return `${day}, ${num} ${mon} ${year}`;
    },

    greeting(h) {
        if (h >= 5  && h < 12) return 'Good Morning! ☀️';
        if (h >= 12 && h < 17) return 'Good Afternoon! 🌤';
        if (h >= 17 && h < 21) return 'Good Evening! 🌆';
        return 'Good Night! 🌙';
    },

    update() {
        const now = new Date();
        const timeStr = this.formatDisplayTime(now);
        DOM.currentTime.textContent  = timeStr;
        DOM.ftTime.textContent       = timeStr;
        DOM.currentDate.textContent  = this.formatDisplayDate(now);
        DOM.greetingText.textContent = this.greeting(now.getHours());
    },

    start() {
        this.update(); // Run immediately so there's no blank gap on load
        if (STATE.clockId) clearInterval(STATE.clockId);
        STATE.clockId = setInterval(() => this.update(), 1000);
    },
};


/* ============================================================
   BACKGROUND MODULE
============================================================ */
const Background = {

    getTimeOfDay(h) {
        if (h >= 5  && h < 12) return 'morning';
        if (h >= 12 && h < 17) return 'afternoon';
        if (h >= 17 && h < 21) return 'evening';
        return 'night';
    },

    apply() {
        const h   = new Date().getHours();
        const tod = this.getTimeOfDay(h);
        const bg  = CONFIG.BACKGROUNDS[tod];

        // Try to use the image; fall back to gradient if image fails
        const img = new Image();
        img.onload = () => {
            DOM.appWrapper.style.backgroundImage = `url('${bg.img}')`;
        };
        img.onerror = () => {
            DOM.appWrapper.style.backgroundImage = bg.gradient;
        };
        img.src = bg.img;

        DOM.appWrapper.dataset.timeOfDay = tod;
    },

    start() {
        this.apply();
        // Re-check every 10 minutes in case the app is left open across time boundaries
        if (STATE.bgCheckId) clearInterval(STATE.bgCheckId);
        STATE.bgCheckId = setInterval(() => this.apply(), 10 * 60 * 1000);
    },
};


/* ============================================================
   THEME MODULE
============================================================ */
const Theme = {

    // Apply saved theme on page load (called before DOMContentLoaded via inline script)
    load() {
        const saved = Helpers.lsGet(CONFIG.LS.theme) || 'light';
        document.documentElement.setAttribute('data-theme', saved);
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next    = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        Helpers.lsSet(CONFIG.LS.theme, next);
    },

    init() {
        DOM.themeToggle.addEventListener('click', () => this.toggle());
    },
};


/* ============================================================
   TODO MODULE
============================================================ */
const Todo = {

    // ── Data ──────────────────────────────────────────────
    load() {
        STATE.todos = Helpers.lsGet(CONFIG.LS.todos) || [];
    },

    save() {
        Helpers.lsSet(CONFIG.LS.todos, STATE.todos);
    },

    addTask(text) {
        text = text.trim();
        if (!text) return;

        STATE.todos.unshift({
            id:        Date.now(),
            text,
            completed: false,
            important: false,
        });

        this.save();
        this.render();
        this.updateBadge();
        DOM.todoInput.value = '';
        DOM.todoInput.focus();
    },

    toggleComplete(id) {
        const task = STATE.todos.find(t => t.id === id);
        if (!task) return;
        task.completed = !task.completed;
        this.save();
        this.render();
        this.updateBadge();
    },

    toggleImportant(id) {
        const task = STATE.todos.find(t => t.id === id);
        if (!task) return;
        task.important = !task.important;
        this.save();
        this.render();
    },

    deleteTask(id) {
        STATE.todos = STATE.todos.filter(t => t.id !== id);
        this.save();
        this.render();
        this.updateBadge();
    },

    clearCompleted() {
        STATE.todos = STATE.todos.filter(t => !t.completed);
        this.save();
        this.render();
        this.updateBadge();
    },

    getFiltered() {
        switch (STATE.todoFilter) {
            case 'active':    return STATE.todos.filter(t => !t.completed);
            case 'completed': return STATE.todos.filter(t => t.completed);
            case 'important': return STATE.todos.filter(t => t.important);
            default:          return STATE.todos;
        }
    },

    // ── Render ────────────────────────────────────────────
    render() {
        const filtered  = this.getFiltered();
        const remaining = STATE.todos.filter(t => !t.completed).length;

        DOM.todoCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;

        if (filtered.length === 0) {
            DOM.todoList.innerHTML = `
                <li>
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <p>${STATE.todoFilter === 'all' ? 'No tasks yet. Add one above!' : 'Nothing here.'}</p>
                    </div>
                </li>`;
            return;
        }

        DOM.todoList.innerHTML = filtered.map(t => `
            <li class="task-item
                        ${t.completed ? 'is-done'      : ''}
                        ${t.important ? 'is-important' : ''}"
                data-id="${t.id}">
                <button class="task-check" data-action="complete" aria-label="Toggle complete">
                    ${t.completed ? '✓' : ''}
                </button>
                <span class="task-text">${Helpers.escapeHTML(t.text)}</span>
                <button class="task-star ${t.important ? 'on' : ''}"
                        data-action="important" aria-label="Toggle important">⭐</button>
                <button class="task-del" data-action="delete" aria-label="Delete task">🗑</button>
            </li>
        `).join('');
    },

    updateBadge() {
        const active = STATE.todos.filter(t => !t.completed).length;
        DOM.todoBadge.textContent = `${active} task${active !== 1 ? 's' : ''}`;
    },

    // ── Events ────────────────────────────────────────────
    init() {
        this.load();
        this.render();
        this.updateBadge();

        // Add task
        DOM.todoAddBtn.addEventListener('click', () => this.addTask(DOM.todoInput.value));
        DOM.todoInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') this.addTask(DOM.todoInput.value);
        });

        // Event delegation on list container
        DOM.todoList.addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const li = btn.closest('.task-item');
            if (!li) return;
            const id = Number(li.dataset.id);
            const action = btn.dataset.action;
            if (action === 'complete')  this.toggleComplete(id);
            if (action === 'important') this.toggleImportant(id);
            if (action === 'delete')    this.deleteTask(id);
        });

        // Clear completed
        DOM.todoClearBtn.addEventListener('click', () => this.clearCompleted());

        // Filter buttons
        DOM.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                DOM.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                STATE.todoFilter = btn.dataset.filter;
                this.render();
            });
        });
    },
};


/* ============================================================
   PLANNER MODULE
============================================================ */
const Planner = {

    DAYS:   DateTimeModule.DAYS,
    MONTHS: DateTimeModule.MONTHS,

    // ── Data ──────────────────────────────────────────────
    load() {
        STATE.planner = Helpers.lsGet(CONFIG.LS.planner) || {};
    },

    save(key, value) {
        STATE.planner[key] = value;
        Helpers.lsSet(CONFIG.LS.planner, STATE.planner);
    },

    clearAll() {
        if (!confirm('Clear all planner entries for today?')) return;
        STATE.planner = {};
        Helpers.lsSet(CONFIG.LS.planner, STATE.planner);
        this.renderSlots();
    },

    slotKey(hour) {
        return `${String(hour).padStart(2, '0')}:00`;
    },

    displayTime(hour) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h    = hour % 12 || 12;
        return `${String(h).padStart(2, '0')}:00 ${ampm}`;
    },

    // ── Render ────────────────────────────────────────────
    renderSlots() {
        const now = new Date();
        DOM.plannerDateLbl.textContent =
            `${this.DAYS[now.getDay()]}, ${this.MONTHS[now.getMonth()]} ${now.getDate()}`;

        let html = '';
        for (let h = CONFIG.PLANNER_START; h <= CONFIG.PLANNER_END; h++) {
            const key  = this.slotKey(h);
            const time = this.displayTime(h);
            html += `
                <div class="planner-slot" data-hour="${h}" data-key="${key}">
                    <span class="planner-time">${time}</span>
                    <input type="text" class="planner-input"
                           data-key="${key}" placeholder="What's planned..."
                           maxlength="120" autocomplete="off">
                    <button class="slot-clear" data-key="${key}" aria-label="Clear">✕</button>
                </div>`;
        }

        DOM.plannerSlots.innerHTML = html;

        // Set values programmatically (safe — avoids attribute injection)
        DOM.plannerSlots.querySelectorAll('.planner-input').forEach(input => {
            input.value = STATE.planner[input.dataset.key] || '';
        });

        this.highlightCurrent();
    },

    highlightCurrent() {
        const currentHour = new Date().getHours();
        DOM.plannerSlots.querySelectorAll('.planner-slot').forEach(slot => {
            const isActive = Number(slot.dataset.hour) === currentHour;
            slot.classList.toggle('current-slot', isActive);
            if (isActive) {
                slot.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    },

    // ── Events ────────────────────────────────────────────
    init() {
        this.load();
        this.renderSlots();

        // Save on blur (not every keystroke — avoids excessive writes)
        DOM.plannerSlots.addEventListener('blur', e => {
            if (e.target.classList.contains('planner-input')) {
                this.save(e.target.dataset.key, e.target.value.trim());
            }
        }, true /* useCapture needed for blur event delegation */);

        // Clear individual slot
        DOM.plannerSlots.addEventListener('click', e => {
            const btn = e.target.closest('.slot-clear');
            if (!btn) return;
            const key   = btn.dataset.key;
            const input = DOM.plannerSlots.querySelector(`.planner-input[data-key="${key}"]`);
            if (input) input.value = '';
            this.save(key, '');
        });

        // Clear all
        DOM.plannerClearBtn.addEventListener('click', () => this.clearAll());
    },
};


/* ============================================================
   GOALS MODULE
============================================================ */
const Goals = {

    // ── Data ──────────────────────────────────────────────
    load() {
        STATE.goals = Helpers.lsGet(CONFIG.LS.goals) || [];
    },

    save() {
        Helpers.lsSet(CONFIG.LS.goals, STATE.goals);
    },

    addGoal(text) {
        text = text.trim();
        if (!text) return;

        STATE.goals.push({
            id:        Date.now(),
            text,
            completed: false,
        });

        this.save();
        this.render();
        DOM.goalsInput.value = '';
        DOM.goalsInput.focus();
    },

    toggleGoal(id) {
        const goal = STATE.goals.find(g => g.id === id);
        if (!goal) return;
        goal.completed = !goal.completed;
        this.save();
        this.render();
    },

    deleteGoal(id) {
        STATE.goals = STATE.goals.filter(g => g.id !== id);
        this.save();
        this.render();
    },

    clearCompleted() {
        STATE.goals = STATE.goals.filter(g => !g.completed);
        this.save();
        this.render();
    },

    // ── Render ────────────────────────────────────────────
    updateProgress() {
        const total     = STATE.goals.length;
        const completed = STATE.goals.filter(g => g.completed).length;
        const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

        DOM.goalsProgressTxt.textContent = `${completed} of ${total} goal${total !== 1 ? 's' : ''} completed`;
        DOM.goalsProgressPct.textContent = `${pct}%`;
        DOM.goalsProgressBar.style.width = `${pct}%`;
        DOM.goalsBadge.textContent        = `${completed} of ${total}`;
    },

    render() {
        this.updateProgress();

        if (STATE.goals.length === 0) {
            DOM.goalsList.innerHTML = `
                <li>
                    <div class="empty-state">
                        <div class="empty-icon">🎯</div>
                        <p>No goals yet. Set your goals for today!</p>
                    </div>
                </li>`;
            return;
        }

        DOM.goalsList.innerHTML = STATE.goals.map(g => `
            <li class="task-item ${g.completed ? 'is-done' : ''}" data-id="${g.id}">
                <button class="goal-check" data-action="toggle" aria-label="Toggle goal">
                    ${g.completed ? '✓' : ''}
                </button>
                <span class="task-text">${Helpers.escapeHTML(g.text)}</span>
                <button class="task-del" data-action="delete" aria-label="Delete goal">🗑</button>
            </li>
        `).join('');
    },

    // ── Events ────────────────────────────────────────────
    init() {
        this.load();
        this.render();

        DOM.goalsAddBtn.addEventListener('click', () => this.addGoal(DOM.goalsInput.value));
        DOM.goalsInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') this.addGoal(DOM.goalsInput.value);
        });

        // Event delegation
        DOM.goalsList.addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const li = btn.closest('.task-item');
            if (!li) return;
            const id = Number(li.dataset.id);
            if (btn.dataset.action === 'toggle') this.toggleGoal(id);
            if (btn.dataset.action === 'delete') this.deleteGoal(id);
        });

        DOM.goalsClearBtn.addEventListener('click', () => this.clearCompleted());
    },
};


/* ============================================================
   POMODORO MODULE
============================================================ */
const Pomodoro = {

    // SVG ring: radius = 96, circumference = 2π×96 ≈ 603.19
    CIRCUMFERENCE: 2 * Math.PI * 96,

    MODE_LABELS: {
        work:  'Work Session',
        short: 'Short Break',
        long:  'Long Break',
    },

    // ── Timer Control ─────────────────────────────────────
    setMode(mode) {
        // Don't change mode while running — force reset first
        if (STATE.pomodoro.isRunning) this.stop();

        STATE.pomodoro.mode      = mode;
        STATE.pomodoro.timeLeft  = CONFIG.POMODORO[mode];
        STATE.pomodoro.totalTime = CONFIG.POMODORO[mode];

        DOM.modeTabs.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
        this.updateDisplay();
        this.updateButtons();
        this.hideMessage();
    },

    start() {
        if (STATE.pomodoro.isRunning) return;

        // Guard: always clear before creating a new interval
        this.stop();
        STATE.pomodoro.isRunning = true;

        STATE.pomodoro.intervalId = setInterval(() => this.tick(), 1000);
        this.updateButtons();
        this.hideMessage();
    },

    pause() {
        this.stop();
        this.updateButtons();
    },

    reset() {
        this.stop();
        STATE.pomodoro.timeLeft  = CONFIG.POMODORO[STATE.pomodoro.mode];
        STATE.pomodoro.totalTime = CONFIG.POMODORO[STATE.pomodoro.mode];
        this.updateDisplay();
        this.updateButtons();
        this.hideMessage();
    },

    stop() {
        if (STATE.pomodoro.intervalId) {
            clearInterval(STATE.pomodoro.intervalId);
            STATE.pomodoro.intervalId = null;
        }
        STATE.pomodoro.isRunning = false;
    },

    tick() {
        if (STATE.pomodoro.timeLeft <= 0) {
            this.onComplete();
            return;
        }
        STATE.pomodoro.timeLeft--;
        this.updateDisplay();
    },

    onComplete() {
        this.stop();
        this.updateButtons();

        const isWork  = STATE.pomodoro.mode === 'work';
        const message = isWork
            ? '🎉 Work session complete! Take a well-earned break.'
            : '💪 Break over! Time to get back to work.';

        this.showMessage(message);

        if (isWork) {
            STATE.pomodoro.sessionNum++;
            DOM.pomoSessionLbl.textContent = `Session #${STATE.pomodoro.sessionNum}`;
        }

        // Browser notification (if permission was granted)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('ProDash — Pomodoro', { body: message, icon: 'assets/icons/pomodoro.svg' });
        }
    },

    // ── Display ───────────────────────────────────────────
    updateDisplay() {
        DOM.pomoTime.textContent  = Helpers.formatTime(STATE.pomodoro.timeLeft);
        DOM.pomoLabel.textContent = this.MODE_LABELS[STATE.pomodoro.mode];

        // Update SVG progress ring
        const progress = STATE.pomodoro.timeLeft / STATE.pomodoro.totalTime;
        const offset   = this.CIRCUMFERENCE * (1 - progress);
        DOM.timerRing.style.strokeDashoffset = String(offset);

        // Also update the badge on the dashboard card
        DOM.pomodoroBadge = document.getElementById('pomodoro-badge');
        if (DOM.pomodoroBadge) {
            DOM.pomodoroBadge.textContent = Helpers.formatTime(STATE.pomodoro.timeLeft);
        }
    },

    updateButtons() {
        const running = STATE.pomodoro.isRunning;
        DOM.pomoStart.disabled = running;
        DOM.pomoPause.disabled = !running;
    },

    showMessage(msg) {
        DOM.pomoMessage.textContent = msg;
        DOM.pomoMessage.classList.remove('hidden');
    },

    hideMessage() {
        DOM.pomoMessage.classList.add('hidden');
        DOM.pomoMessage.textContent = '';
    },

    // ── Events ────────────────────────────────────────────
    init() {
        this.updateDisplay();
        this.updateButtons();

        DOM.pomoStart.addEventListener('click', () => this.start());
        DOM.pomoPause.addEventListener('click', () => this.pause());
        DOM.pomoReset.addEventListener('click', () => this.reset());

        DOM.modeTabs.forEach(tab => {
            tab.addEventListener('click', () => this.setMode(tab.dataset.mode));
        });

        // Request notification permission proactively
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    },
};


/* ============================================================
   QUOTE MODULE
============================================================ */
const Quote = {

    _current: null,

    async fetch() {
        // Show loading spinner while request is in flight
        DOM.quoteText.innerHTML  = '<span class="loading-spinner"></span>';
        DOM.quoteAuthor.textContent = '';
        DOM.quoteStatus.textContent = '';

        try {
            const res = await fetch(CONFIG.QUOTE_URL, { signal: AbortSignal.timeout(5000) });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            // api.quotable.io returns { content, author }
            const content = data.content || data.q || data.text || '';
            const author  = data.author  || data.a || 'Unknown';

            this.display(content, author);

        } catch {
            // Silently fall back to a local quote — the UI never breaks
            const fallback = Helpers.randomFrom(CONFIG.FALLBACK_QUOTES);
            this.display(fallback.content, fallback.author);
            DOM.quoteStatus.textContent = '(Showing offline quote)';
        }
    },

    display(text, author) {
        this._current = { text, author };
        DOM.quoteText.textContent   = text;
        DOM.quoteAuthor.textContent = author;
    },

    copy() {
        if (!this._current) return;
        const str = `"${this._current.text}" — ${this._current.author}`;
        navigator.clipboard.writeText(str)
            .then(() => {
                DOM.quoteStatus.textContent = '✓ Copied to clipboard!';
                setTimeout(() => { DOM.quoteStatus.textContent = ''; }, 2500);
            })
            .catch(() => {
                DOM.quoteStatus.textContent = 'Copy failed — please copy manually.';
            });
    },

    init() {
        DOM.quoteNewBtn.addEventListener('click',  () => this.fetch());
        DOM.quoteCopyBtn.addEventListener('click', () => this.copy());
    },
};


/* ============================================================
   WEATHER MODULE
============================================================ */
const Weather = {

    // ── UI States ─────────────────────────────────────────
    showLoading() {
        DOM.weatherLoading.classList.remove('hidden');
        DOM.weatherError.classList.add('hidden');
        DOM.weatherDataDiv.classList.add('hidden');
    },

    showError(msg) {
        DOM.weatherLoading.classList.add('hidden');
        DOM.weatherError.classList.remove('hidden');
        DOM.weatherDataDiv.classList.add('hidden');
        DOM.weatherErrMsg.textContent = msg;
    },

    showData() {
        DOM.weatherLoading.classList.add('hidden');
        DOM.weatherError.classList.add('hidden');
        DOM.weatherDataDiv.classList.remove('hidden');
    },

    // ── Fetch ─────────────────────────────────────────────
    async _fetchURL(url, silent = false) {
        if (CONFIG.WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            const msg = 'Add your OpenWeatherMap API key to CONFIG.WEATHER_API_KEY in script.js';
            if (!silent) this.showError(msg);
            return;
        }

        if (!silent) this.showLoading();

        try {
            const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || `HTTP ${res.status}`);
            }
            const data = await res.json();
            this._displayData(data);
            STATE.weatherCache  = data;
            STATE.weatherLoaded = true;
        } catch (e) {
            if (!silent) this.showError(`Could not fetch weather: ${e.message}`);
        }
    },

    fetchByCoords(lat, lon, silent = false) {
        const url = `${CONFIG.WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${CONFIG.WEATHER_API_KEY}`;
        return this._fetchURL(url, silent);
    },

    fetchByCity(city, silent = false) {
        const url = `${CONFIG.WEATHER_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${CONFIG.WEATHER_API_KEY}`;
        return this._fetchURL(url, silent);
    },

    // ── Display ───────────────────────────────────────────
    _displayData(data) {
        const iconCode = data.weather[0].icon;
        const emoji    = CONFIG.WEATHER_ICONS[iconCode] || '🌤';
        const temp     = Math.round(data.main.temp);
        const city     = `${data.name}, ${data.sys.country}`;

        // Full panel
        DOM.wIcon.textContent        = emoji;
        DOM.wTemp.textContent        = temp;
        DOM.wCondition.textContent   = data.weather[0].description;
        DOM.wCity.textContent        = city;
        DOM.wHumidity.textContent    = `${data.main.humidity}%`;
        DOM.wWind.textContent        = `${Math.round(data.wind.speed * 3.6)} km/h`;
        DOM.wFeels.textContent       = `${Math.round(data.main.feels_like)}°C`;
        DOM.wVisibility.textContent  = `${(data.visibility / 1000).toFixed(1)} km`;

        // Mini weather pill in top bar
        DOM.weatherMiniIcon.textContent = emoji;
        DOM.weatherMiniTemp.textContent = `${temp}°C`;
        DOM.weatherMiniCity.textContent = data.name;

        // Dashboard card badge
        const badge = document.getElementById('weather-badge');
        if (badge) badge.textContent = `${temp}°C`;

        this.showData();
    },

    // ── Geolocation ───────────────────────────────────────
    _geoLocate(silent = false) {
        if (!navigator.geolocation) {
            if (!silent) this.showError('Geolocation not supported. Enter a city below.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            pos  => this.fetchByCoords(pos.coords.latitude, pos.coords.longitude, silent),
            ()   => {
                if (!silent) this.showError('Location access denied. Enter a city name below.');
            }
        );
    },

    // Called silently on page load to populate the top-bar mini widget
    silentLoad() {
        this._geoLocate(true);
    },

    // Called when the weather feature panel is opened
    onOpen() {
        if (STATE.weatherLoaded && STATE.weatherCache) {
            // Re-display cached data — no new network request
            this._displayData(STATE.weatherCache);
        } else {
            this._geoLocate(false);
        }
    },

    // ── Events ────────────────────────────────────────────
    init() {
        DOM.weatherCityBtn.addEventListener('click', () => {
            const city = DOM.weatherCityInput.value.trim();
            if (city) this.fetchByCity(city);
        });

        DOM.weatherCityInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const city = DOM.weatherCityInput.value.trim();
                if (city) this.fetchByCity(city);
            }
        });

        DOM.weatherRefreshBtn.addEventListener('click', () => {
            STATE.weatherLoaded = false;
            STATE.weatherCache  = null;
            this._geoLocate(false);
        });
    },
};


/* ============================================================
   INIT — Entry point, runs once on DOMContentLoaded
============================================================ */
function init() {

    // 1. Cache all DOM references
    cacheDOM();

    // 2. Apply saved theme immediately (no flash — also done in <head>)
    Theme.load();
    Theme.init();

    // 3. Start live clock and dynamic background
    DateTimeModule.start();
    Background.start();

    // 4. Initialize all feature modules
    Todo.init();
    Planner.init();
    Goals.init();
    Pomodoro.init();
    Quote.init();
    Weather.init();

    // 5. Try to silently load weather for the top-bar mini widget
    Weather.silentLoad();

    // 6. Wire up navigation (must come after all sections exist in DOM)
    Navigation.init();
}

document.addEventListener('DOMContentLoaded', init);