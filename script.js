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

const defaultTheme = {
  bg: '#f4f7fb',
  card: '#ffffff',
  text: '#1f2937',
  accent: '#2563eb',
  imageUrl: '',
  imageData: ''
};

const theme = { ...defaultTheme };

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
  if (!hex || hex[0] !== '#') return '#dbeafe';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.15)`;
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

function setCustomizerInputs() {
  bgColor.value = theme.bg;
  cardColor.value = theme.card;
  accentColor.value = theme.accent;
  textColor.value = theme.text;
  imageUrl.value = theme.imageUrl;
  imageFile.value = '';
}

function resetTheme() {
  Object.assign(theme, defaultTheme);
  applyTheme();
  setCustomizerInputs();
}

openCustomizer.addEventListener('click', openPanel);
closeCustomizer.addEventListener('click', closePanel);
doneCustomizer.addEventListener('click', closePanel);
resetCustomizer.addEventListener('click', resetTheme);

bgColor.addEventListener('input', (event) => {
  theme.bg = event.target.value;
  applyTheme();
});
cardColor.addEventListener('input', (event) => {
  theme.card = event.target.value;
  applyTheme();
});
accentColor.addEventListener('input', (event) => {
  theme.accent = event.target.value;
  applyTheme();
});
textColor.addEventListener('input', (event) => {
  theme.text = event.target.value;
  applyTheme();
});

imageUrl.addEventListener('change', (event) => {
  theme.imageUrl = event.target.value.trim();
  if (theme.imageUrl) {
    theme.imageData = '';
  }
  applyTheme();
});

imageFile.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    theme.imageData = reader.result;
    theme.imageUrl = '';
    applyTheme();
  };
  reader.readAsDataURL(file);
});

applyTheme();
