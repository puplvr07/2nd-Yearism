// State Management
const state = {
  activeView: 'dashboard',
  selectedDate: '2026-05-04',
  subjects: [
    { id: 1, name: 'Subject 1', tasks: [{ id: 1, title: 'Quiz 1', done: true }, { id: 2, title: 'Presentation 2', done: true }, { id: 3, title: 'Task 3', done: false }, { id: 4, title: 'Activity 4', done: false }, { id: 5, title: 'Exam 5', done: false }] },
    { id: 2, name: 'Subject 2', tasks: [{ id: 6, title: 'Quiz 1', done: true }, { id: 7, title: 'Presentation 2', done: true }, { id: 8, title: 'Task 3', done: true }, { id: 9, title: 'Lab 4', done: true }, { id: 10, title: 'Paper 5', done: false }] },
    { id: 3, name: 'Subject 3', tasks: [{ id: 11, title: 'Quiz 1', done: true }, { id: 12, title: 'Presentation 2', done: false }, { id: 13, title: 'Task 3', done: false }, { id: 14, title: 'Readings', done: false }, { id: 15, title: 'Summary', done: false }] },
    { id: 4, name: 'Subject 4', tasks: [{ id: 16, title: 'Quiz 1', done: true }, { id: 17, title: 'Presentation 2', done: true }, { id: 18, title: 'Task 3', done: true }, { id: 19, title: 'Case Study', done: true }, { id: 20, title: 'Final Report', done: true }] },
    { id: 5, name: 'Subject 5', tasks: [{ id: 21, title: 'Quiz 1', done: false }, { id: 22, title: 'Presentation 2', done: false }, { id: 23, title: 'Task 3', done: false }, { id: 24, title: 'Duty Log', done: false }, { id: 25, title: 'Reflection', done: false }] }
  ]
};

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

  // Close mobile sidebar if open
  document.getElementById('sidebar').classList.remove('open');
}

// Render Calendar Days
function renderCalendar() {
  const container = document.getElementById('calendarDays');
  if (!container) return;
  container.innerHTML = '';
  
  // May 2026 starts on Friday (5 dummy days before)
  for (let i = 26; i <= 30; i++) {
    container.innerHTML += `<div class="cal-day muted">${i}</div>`;
  }
  for (let d = 1; d <= 31; d++) {
    const isToday = d === 4;
    container.innerHTML += `<div class="cal-day ${isToday ? 'today' : ''}">${d}</div>`;
  }
}

// Render Mini Calendar in Modal
function renderModalCalendar() {
  const container = document.getElementById('modalCalendarDays');
  if (!container) return;
  container.innerHTML = '';
  for (let d = 1; d <= 31; d++) {
    const isSelected = d === 4;
    const dayEl = document.createElement('div');
    dayEl.className = `mini-cal-day ${isSelected ? 'selected' : ''}`;
    dayEl.textContent = d;
    dayEl.addEventListener('click', () => {
      document.querySelectorAll('.mini-cal-day').forEach(el => el.classList.remove('selected'));
      dayEl.classList.add('selected');
      document.getElementById('selectedDateText').textContent = `Monday, May ${d}, 2026`;
    });
    container.appendChild(dayEl);
  }
}

// Render Subject Cards
function renderSubjects() {
  const list = document.getElementById('subjectCardsList');
  const todoList = document.getElementById('todoSubjectsContainer');
  if (!list || !todoList) return;

  list.innerHTML = '';
  todoList.innerHTML = '';

  state.subjects.forEach(sub => {
    const total = sub.tasks.length;
    const done = sub.tasks.filter(t => t.done).length;
    const left = total - done;

    // Subjects Overview Card
    list.innerHTML += `
      <div class="subject-card">
        <header>
          <h3>${sub.name}</h3>
          <span class="badge">${done}/${total} Done</span>
        </header>
        <p><strong>TOTAL TASKS:</strong> ${total}</p>
        <p><strong>TASK DONE:</strong> ${done}</p>
        <p><strong>TASK LEFT:</strong> ${left}</p>
        <div class="progress-track">
          <div class="progress-bar" style="width: ${(done / total) * 100}%;"></div>
        </div>
      </div>
    `;

    // To-Do Screen Item
    let taskRows = sub.tasks.map(t => `
      <li>
        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${sub.id}, ${t.id})">
        <span style="${t.done ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${t.title}</span>
      </li>
    `).join('');

    todoList.innerHTML += `
      <div class="subject-card">
        <header>
          <h3>${sub.name}</h3>
        </header>
        <ul class="subject-task-list">
          ${taskRows}
        </ul>
      </div>
    `;
  });
}

function toggleTask(subjectId, taskId) {
  const sub = state.subjects.find(s => s.id === subjectId);
  if (!sub) return;
  const task = sub.tasks.find(t => t.id === taskId);
  if (task) {
    task.done = !task.done;
    renderSubjects();
  }
}

// Global Event Listeners & Initialization
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderModalCalendar();
  renderSubjects();

  // Navigation clicks
  document.querySelectorAll('.sidebar-nav .nav-item[data-view]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Mobile menu toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Search input focus & search dropdown actions
  const searchInput = document.getElementById('globalSearch');
  const searchDropdown = document.getElementById('searchDropdown');

  searchInput.addEventListener('focus', () => searchDropdown.classList.add('open'));
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.remove('open');
    }
  });

  searchDropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      searchDropdown.classList.remove('open');
      if (link.dataset.view) switchView(link.dataset.view);
      if (link.dataset.modal === 'create') document.getElementById('createTaskModal').classList.add('open');
      if (link.dataset.action === 'customizer') document.getElementById('customizer').classList.add('open');
    });
  });

  // Create Task Modal Handling
  const modal = document.getElementById('createTaskModal');
  document.getElementById('openCreateModal').addEventListener('click', () => modal.classList.add('open'));
  document.getElementById('closeCreateModal').addEventListener('click', () => modal.classList.remove('open'));
  document.getElementById('cancelCreateModal').addEventListener('click', () => modal.classList.remove('open'));

  document.getElementById('createTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const subjectName = document.getElementById('taskSubject').value;
    const targetSub = state.subjects.find(s => s.name === subjectName);
    
    if (targetSub && title.trim()) {
      targetSub.tasks.push({ id: Date.now(), title: title.trim(), done: false });
      renderSubjects();
      modal.classList.remove('open');
      document.getElementById('createTaskForm').reset();
      switchView('todos');
    }
  });

  // Customizer Drawer Handling
  const customizer = document.getElementById('customizer');
  document.getElementById('openCustomizerBtn').addEventListener('click', () => customizer.classList.add('open'));
  document.getElementById('closeCustomizer').addEventListener('click', () => customizer.classList.remove('open'));

  // Customizer inputs
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
    alert('Theme preferences saved successfully!');
    customizer.classList.remove('open');
  });
});