// script.js
const loginForm = document.getElementById('loginForm');
const messageEl = document.getElementById('message');
const profileSection = document.getElementById('profile');
const profileContent = document.getElementById('profileContent');
const logoutBtn = document.getElementById('logoutBtn');

const API_BASE = ''; // public servido por express, mismo dominio/origen (http://localhost:3000)

// Manejo del formulario
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageEl.textContent = '';
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      messageEl.textContent = err.mensaje || 'Error en el login';
      return;
    }

    const data = await res.json();
    // Guardamos token (simulado)
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    showProfile();
  } catch (err) {
    messageEl.textContent = 'No se pudo conectar al servidor';
    console.error(err);
  }
});

async function showProfile() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('/perfil', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      // token inválido o expirado (simulado)
      logout();
      return;
    }

    const data = await res.json();
    profileContent.innerHTML = `
      <strong>Nombre:</strong> ${data.usuario.nombre}<br>
      <strong>Email:</strong> ${data.usuario.email}
    `;
    profileSection.classList.remove('hidden');
    loginForm.classList.add('hidden');
    messageEl.textContent = '';
  } catch (err) {
    console.error(err);
    messageEl.textContent = 'Error al obtener perfil';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  profileSection.classList.add('hidden');
  loginForm.classList.remove('hidden');
  messageEl.textContent = '';
}

logoutBtn.addEventListener('click', () => {
  logout();
});

// Al cargar la página, intentar mostrar perfil si el token está presente
document.addEventListener('DOMContentLoaded', () => {
  showProfile();
});
