// ========== Login Logic ==========

const openLoginBtn = document.getElementById('openLogin');
const closeLoginBtn = document.getElementById('closeLogin');
const loginOverlay = document.getElementById('loginOverlay');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

openLoginBtn.addEventListener('click', () => {
  loginOverlay.classList.add('active');
});

closeLoginBtn.addEventListener('click', () => {
  loginOverlay.classList.remove('active');
  loginError.classList.remove('visible');
  loginForm.reset();
});

loginOverlay.addEventListener('click', (e) => {
  if (e.target === loginOverlay) {
    loginOverlay.classList.remove('active');
    loginError.classList.remove('visible');
    loginForm.reset();
  }
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;

  if (user === 'admin' && pass === '123') {
    window.location.href = 'admin/home.html';
  } else {
    loginError.classList.add('visible');
  }
});
