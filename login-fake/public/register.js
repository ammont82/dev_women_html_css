// register.js
const registerForm = document.getElementById('registerForm');
const messageEl = document.getElementById('message');

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageEl.textContent = '';

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!nombre) {
    messageEl.textContent = 'Introduce tu nombre';
    return;
  }
  if (!esEmailValido(email)) {
    messageEl.textContent = 'Email inválido';
    return;
  }
  if (password.length < 4) {
    messageEl.textContent = 'La contraseña debe tener al menos 4 caracteres';
    return;
  }

  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      messageEl.textContent = err.mensaje || 'Error en el registro';
      return;
    }

    const data = await res.json();
    // Guardar token y redirigir a dashboard automáticamente
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    window.location.href = '/dashboard.html';
  } catch (err) {
    messageEl.textContent = 'No se pudo conectar al servidor';
    console.error(err);
  }
});
