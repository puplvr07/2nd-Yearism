// Storage Keys
const STORAGE_KEY_DATA = 'ticktock_student_data';

// Default initial data matching the wireframe
const defaultData = {
  subjects: [
    {
      id: 1,
      name: 'Subject 1',
      tasks: [
        { id: 1, title: 'Quiz 1', done: true },
        { id: 2, title: 'Presentation 2', done: true },
        { id: 3, title: 'Task 3', done: false },
        { id: 4, title: 'Activity 4', done: false },
        { id: 5, title: 'Exam 5', done: false }
      ]
    },
    {
      id: 2,
      name: 'Subject 2',
      tasks: [
        { id: 6, title: 'Quiz 1', done: true },
        { id: 7, title: 'Presentation 2', done: true },
        { id: 8, title: 'Task 3', done: true },
        { id: 9, title: 'Lab 4', done: true },
        { id: 10, title: 'Paper 5', done: false }
      ]
    },
    {
      id: 3,
      name: 'Subject 3',
      tasks: [
        { id: 11, title: 'Quiz 1', done: true },
        { id: 12, title: 'Presentation 2', done: false },
        { id: 13, title: 'Task 3', done: false },
        { id: 14, title: 'Readings', done: false },
        { id: 15, title: 'Summary', done: false }
      ]
    },
    {
      id: 4,
      name: 'Subject 4',
      tasks: [
        { id: 16, title: 'Quiz 1', done: true },
        { id: 17, title: 'Presentation 2', done: true },
        { id: 18, title: 'Task 3', done: true },
        { id: 19, title: 'Case Study', done: true },
        { id: 20, title: 'Final Report', done: true }
      ]
    },
    {
      id: 5,
      name: 'Subject 5',
      tasks: [
        { id: 21, title: 'Quiz 1', done: false },
        { id: 22, title: 'Presentation 2', done: false },
        { id: 23, title: 'Task 3', done: false },
        { id: 24, title: 'Duty Log', done: false },
        { id: 25, title: 'Reflection', done: false }
      ]
    }
  ]
};

// Application State
const state = {
  activeView: 'dashboard',
  selectedDate: '2026-05-04',
  subjects: loadState()
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse saved state:', err);
  }
  return defaultData.subjects;
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(state.subjects));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

// Navigation
function switchView(viewName) {
  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
  const target = document.getElementById(`view-${viewName}`);
  if (target) {
    target.classList.add('active');
    state.activeView = viewName;
  }
  
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  document.getElementById('sidebar').classList.remove('open');
}

// Subject Management
function addSubject(name) {
  if (!name || !name.trim()) return;
  const newSubject = {
    id: Date.now(),
    name: name.trim(),
    tasks: []
  };
  state.subjects.push(newSubject);
  persistState();
  renderApp();
}

function removeSubject(subjectId) {
  if (confirm('Are you sure you want to remove this subject and all its tasks?')) {
    state.subjects = state.subjects.filter(s => s.id !== subjectId);
    persistState();
    renderApp();
  }
}

// Task Management
function addTask(subjectId, title) {
  if (!title || !title.trim()) return;
  const subject = state.subjects.find(s => s.id === subjectId);
  if (subject) {
    subject.tasks.push({
      id: Date.now(),
      title: title.trim(),
      done: false
    });
    persistState();
    renderApp();
  }
}

function removeTask(subjectId, taskId) {
  const subject = state.subjects.find(s => s.id === subjectId);
  if (subject) {
    subject.tasks = subject.tasks.filter(t => t.id !== taskId);
    persistState();
    renderApp();
  }
}

function toggleTask(subjectId, taskId) {
  const subject = state.subjects.find(s => s.id === subjectId);
  if (!subject) return;
  const task = subject.tasks.find(t => t.id === taskId);
  if (task) {
    task.done = !task.done;
    persistState();
    renderApp();
  }
}

// UI Rendering
function renderDashboardMetrics() {
  let totalTasks = 0;
  let doneTasks = 0;

  state.subjects.forEach(sub => {
    totalTasks += sub.tasks.length;
    doneTasks += sub.tasks.filter(t => t.done).length;
  });

  const remaining = totalTasks - doneTasks;
  const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  document.getElementById('dashTotalTasks').textContent = totalTasks;
  document.getElementById('dashPercent').textContent = `${percent}%`;
  document.getElementById('dashDoneTasks').textContent = doneTasks;
  document.getElementById('dashRemaining').textContent = remaining;
  document.getElementById('dashProgressBar').style.width = `${percent}%`;

  const pieChart = document.getElementById('dashPieChart');
  if (pieChart) {
    pieChart.style.background = `conic-gradient(var(--accent) 0% ${percent}%, #fde047 ${percent}% 100%)`;
  }
}

function renderSubjectDropdown() {
  const select = document.getElementById('taskSubject');
  if (!select) return;
  select.innerHTML = state.subjects
    .map(sub => `<option value="${sub.id}">${sub.name}</option>`)
    .join('');
}

function renderSubjectsList() {
  const list = document.getElementById('subjectCardsList');
  if (!list) return;
  list.innerHTML = '';

  state.subjects.forEach(sub => {
    const total = sub.tasks.length;
    const done = sub.tasks.filter(t => t.done).length;
    const left = total - done;
    const percent = total > 0 ? (done / total) * 100 : 0;

    list.innerHTML += `
      <div class="subject-card">
        <header>
          <h3>${sub.name}</h3>
          <button class="btn-icon-danger" onclick="removeSubject(${sub.id})" title="Delete Subject">🗑️</button>
        </header>
        <p><strong>TOTAL TASK:</strong> ${total}</p>
        <p><strong>TASK DONE:</strong> ${done}</p>
        <p><strong>TASK LEFT:</strong> ${left}</p>
        <div class="progress-track">
          <div class="progress-bar" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  });
}

function renderTodoList() {
  const todoContainer = document.getElementById('todoSubjectsContainer');
  if (!todoContainer) return;
  todoContainer.innerHTML = '';

  state.subjects.forEach(sub => {
    const taskItems = sub.tasks.map(t => `
      <li class="todo-task-item">
        <label class="todo-label">
          <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${sub.id}, ${t.id})">
          <span class="${t.done ? 'task-done' : ''}">${t.title}</span>
        </label>
        <button class="btn-icon-danger btn-sm-icon" onclick="removeTask(${sub.id}, ${t.id})" title="Delete Task">✕</button>
      </li>
    `).join('');

    todoContainer.innerHTML += `
      <div class="subject-card">
        <header>
          <h3>${sub.name}</h3>
          <button class="btn-icon-danger" onclick="removeSubject(${sub.id})" title="Delete Subject">🗑️</button>
        </header>
        <ul class="subject-task-list">
          ${taskItems || '<li class="empty-state">No tasks yet.</li>'}
        </ul>
        <div class="quick-add-task">
          <input type="text" placeholder="Add task..." id="quickInput-${sub.id}" onkeydown="handleQuickTaskAdd(event, ${sub.id})" />
          <button class="secondary btn-sm" onclick="handleQuickTaskClick(${sub.id})">+</button>
        </div>
      </div>
    `;
  });
}

function handleQuickTaskAdd(event, subjectId) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTask(subjectId, event.target.value);
    event.target.value = '';
  }
}

function handleQuickTaskClick(subjectId) {
  const input = document.getElementById(`quickInput-${subjectId}`);
  if (input && input.value.trim()) {
    addTask(subjectId, input.value);
    input.value = '';
  }
}

function renderCalendar() {
  const container = document.getElementById('calendarDays');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 26; i <= 30; i++) {
    container.innerHTML += `<div class="cal-day muted">${i}</div>`;
  }
  for (let d = 1; d <= 31; d++) {
    container.innerHTML += `<div class="cal-day ${d === 4 ? 'today' : ''}">${d}</div>`;
  }
}

function renderModalCalendar() {
  const container = document.getElementById('modalCalendarDays');
  if (!container) return;
  container.innerHTML = '';
  for (let d = 1; d <= 31; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = `mini-cal-day ${d === 4 ? 'selected' : ''}`;
    dayEl.textContent = d;
    dayEl.addEventListener('click', () => {
      document.querySelectorAll('.mini-cal-day').forEach(el => el.classList.remove('selected'));
      dayEl.classList.add('selected');
      document.getElementById('selectedDateText').textContent = `Monday, May ${d}, 2026`;
    });
    container.appendChild(dayEl);
  }
}

function renderApp() {
  renderDashboardMetrics();
  renderSubjectDropdown();
  renderSubjectsList();
  renderTodoList();
}

// Lifecycle Init
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderModalCalendar();
  renderApp();

  // Navigation Links
  document.querySelectorAll('.sidebar-nav .nav-item[data-view]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Mobile toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Prompt / Modal to add a new subject
  document.getElementById('btnAddNewSubject').addEventListener('click', () => {
    const name = prompt('Enter new subject name (e.g., Nursing Informatics):');
    if (name) addSubject(name);
  });

  // Create Task Modal
  const modal = document.getElementById('createTaskModal');
  document.getElementById('openCreateModal').addEventListener('click', () => modal.classList.add('open'));
  document.getElementById('closeCreateModal').addEventListener('click', () => modal.classList.remove('open'));
  document.getElementById('cancelCreateModal').addEventListener('click', () => modal.classList.remove('open'));

  document.getElementById('createTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const subId = Number(document.getElementById('taskSubject').value);
    
    if (title.trim() && subId) {
      addTask(subId, title);
      modal.classList.remove('open');
      document.getElementById('createTaskForm').reset();
      switchView('todos');
    }
  });

  // Customizer Drawer Handling
  const customizer = document.getElementById('customizer');
  document.getElementById('openCustomizerBtn').addEventListener('click', () => customizer.classList.add('open'));
  document.getElementById('closeCustomizer').addEventListener('click', () => customizer.classList.remove('open'));

  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
  });
  document.getElementById('bgColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--page-bg', e.target.value);
  });
  document.getElementById('cardColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--card', e.target.value);
  });
  document.getElementById('accentColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--accent', e.target.value);
  });
  document.getElementById('textColor').addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--text', e.target.value);
  });
  document.getElementById('saveCustomizer').addEventListener('click', () => {
    alert('Theme preferences saved!');
    customizer.classList.remove('open');
  });
}); 