const days = [
  { name: 'Mon', task: 'Design review' },
  { name: 'Tue', task: 'Project sync' },
  { name: 'Wed', task: 'Focus block' },
  { name: 'Thu', task: 'Client call' },
  { name: 'Fri', task: 'Wrap-up tasks' },
  { name: 'Sat', task: 'Gym + errands' },
  { name: 'Sun', task: 'Reset week' }
];

const weekGrid = document.getElementById('weekGrid');
const todayDate = document.getElementById('todayDate');
const openCustomizer = document.getElementById('openCustomizer');
const customizer = document.getElementById('customizer');
const closeCustomizer = document.getElementById('closeCustomizer');
const bgColor = document.getElementById('bgColor');
const cardColor = document.getElementById('cardColor');
const accentColor = document.getElementById('accentColor');
const textColor = document.getElementById('textColor');
const imageUrl = document.getElementById('imageUrl');
const imageFile = document.getElementById('imageFile');
const resetCustomizer = document.getElementById('resetCustomizer');
const doneCustomizer = document.getElementById('doneCustomizer');
const saveCustomizer = document.getElementById('saveCustomizer');
const loginEmail = document.getElementById('loginEmail');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const loginStatus = document.getElementById('loginStatus');

const defaultTheme = {
  bg: '#f4f7fb',
  card: '#ffffff',
  text: '#1f2937',
  accent: '#2563eb',
  imageUrl: '',
  imageData: ''
};

const theme = { ...defaultTheme };
let currentUser = null;

const today = new Date();
const options = { weekday: 'long', month: 'long', day: 'numeric' };
todayDate.textContent = today.toLocaleDateString('en-US', options);

const todayIndex = (today.getDay() + 6) % 7;

days.forEach((day, index) => {
  const card = document.createElement('div');
  card.className = 'day' + (index === todayIndex ? ' today' : '');
  card.innerHTML = `
    <div class="day-name">${day.name}</div>
    <div class="task">${day.task}</div>
  `;

  card.addEventListener('click', () => {
    weekGrid.querySelectorAll('.day').forEach((item) => item.classList.remove('selected'));
    card.classList.add('selected');
  });

  weekGrid.appendChild(card);
});

function applyTheme() {
  const root = document.documentElement;
  root.style.setProperty('--bg', theme.bg);
  root.style.setProperty('--card', theme.card);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--accent-soft', hexToSoft(theme.accent));

  const pageBg = `linear-gradient(135deg, rgba(238, 244, 255, 0.9), ${theme.bg})`;
  root.style.setProperty('--page-bg', pageBg);

  if (theme.imageData) {
    root.style.setProperty('--page-bg-image', `url('${theme.imageData}')`);
  } else if (theme.imageUrl) {
    root.style.setProperty('--page-bg-image', `url('${theme.imageUrl}')`);
  } else {
    root.style.setProperty('--page-bg-image', 'none');
  }
}

function hexToSoft(hex) {
  if (!hex || hex[0] !== '#') return 'rgba(219, 234, 254, 0.15)';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.15)`;
}

function getStorageKey(email) {
  return `planner-customizations:${email.toLowerCase()}`;
}

function getCurrentUserKey() {
  return 'planner-current-user';
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function updateThemeProperty(property, value) {
  theme[property] = value;
  applyTheme();
  if (currentUser) saveThemeForUser();
}

function saveThemeForUser() {
  if (!currentUser) return;
  localStorage.setItem(getStorageKey(currentUser), JSON.stringify(theme));
  localStorage.setItem(getCurrentUserKey(), currentUser);
}

function loadUserTheme(email) {
  const stored = localStorage.getItem(getStorageKey(email));
  if (!stored) return false;
  try {
    const saved = JSON.parse(stored);
    Object.assign(theme, { ...defaultTheme, ...saved });
    return true;
  } catch {
    return false;
  }
}

function setCustomizerInputs() {
  bgColor.value = theme.bg;
  cardColor.value = theme.card;
  accentColor.value = theme.accent;
  textColor.value = theme.text;
  imageUrl.value = theme.imageUrl;
  imageFile.value = '';
}

function setLoginStatus(message, isError = false) {
  loginStatus.textContent = message;
  loginStatus.style.color = isError ? '#b91c1c' : 'var(--text)';
}

function openPanel() {
  setCustomizerInputs();
  customizer.classList.add('open');
  customizer.setAttribute('aria-hidden', 'false');
}

function closePanel() {
  customizer.classList.remove('open');
  customizer.setAttribute('aria-hidden', 'true');
}

function loginUser() {
  const email = loginEmail.value.trim().toLowerCase();
  if (!validateEmail(email)) {
    setLoginStatus('Enter a valid email address.', true);
    return;
  }

  currentUser = email;
  const loaded = loadUserTheme(currentUser);
  applyTheme();
  setCustomizerInputs();
  saveThemeForUser();
  setLoginStatus(`Signed in as ${currentUser}`);
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem(getCurrentUserKey());
  setLoginStatus('Not signed in');
}

function saveSettings() {
  if (!currentUser) {
    setLoginStatus('Login first to save your settings.', true);
    return;
  }
  saveThemeForUser();
  setLoginStatus(`Settings saved for ${currentUser}`);
}

function resetTheme() {
  Object.assign(theme, defaultTheme);
  applyTheme();
  setCustomizerInputs();
  if (currentUser) saveThemeForUser();
}

function loadCurrentUser() {
  const stored = localStorage.getItem(getCurrentUserKey());
  if (!stored) {
    setLoginStatus('Not signed in');
    return;
  }
  currentUser = stored;
  const loaded = loadUserTheme(currentUser);
  if (loaded) {
    applyTheme();
    setCustomizerInputs();
    loginEmail.value = currentUser;
    setLoginStatus(`Signed in as ${currentUser}`);
  } else {
    loginEmail.value = currentUser;
    setLoginStatus(`Signed in as ${currentUser}`);
  }
}

openCustomizer.addEventListener('click', openPanel);
closeCustomizer.addEventListener('click', closePanel);
doneCustomizer.addEventListener('click', closePanel);
resetCustomizer.addEventListener('click', resetTheme);
saveCustomizer.addEventListener('click', saveSettings);
loginButton.addEventListener('click', loginUser);
logoutButton.addEventListener('click', logoutUser);

bgColor.addEventListener('input', (event) => updateThemeProperty('bg', event.target.value));
cardColor.addEventListener('input', (event) => updateThemeProperty('card', event.target.value));
accentColor.addEventListener('input', (event) => updateThemeProperty('accent', event.target.value));
textColor.addEventListener('input', (event) => updateThemeProperty('text', event.target.value));

imageUrl.addEventListener('change', (event) => {
  theme.imageUrl = event.target.value.trim();
  theme.imageData = '';
  applyTheme();
  if (currentUser) saveThemeForUser();
});

imageFile.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    theme.imageData = reader.result;
    theme.imageUrl = '';
    applyTheme();
    if (currentUser) saveThemeForUser();
  };
  reader.readAsDataURL(file);
});

loadCurrentUser();
applyTheme();
