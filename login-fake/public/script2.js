// script.js - login
const loginForm = document.getElementById('loginForm');
const messageEl = document.getElementById('message');

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageEl.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Validación cliente (Ejercicio 1)
  if (!esEmailValido(email)) {
    messageEl.textContent = 'Introduce un email válido.';
    return;
  }
  if (password.length < 4) {
    messageEl.textContent = 'La contraseña debe tener al menos 4 caracteres.';
    return;
  }

  try {
    const res = await fetch('/login', {
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
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    // Redirigir al dashboard (Ejercicio 2)
    window.location.href = '/dashboard.html';
  } catch (err) {
    messageEl.textContent = 'No se pudo conectar al servidor';
    console.error(err);
  }
});
