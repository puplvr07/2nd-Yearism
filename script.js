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
