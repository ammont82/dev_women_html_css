// dashboard.js
const profileContent = document.getElementById('profileContent');
const logoutBtn = document.getElementById('logoutBtn');

async function cargarPerfil() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Si no hay token, redirigimos al login
    window.location.href = '/index.html';
    return;
  }

  try {
    const res = await fetch('/perfil', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      // token inválido o expirado -> eliminamos credenciales y redirigimos
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/index.html';
      return;
    }

    const data = await res.json();
    // Mostrar nombre y email
    profileContent.innerHTML = `
      <p><strong>Nombre:</strong> ${data.usuario.nombre}</p>
      <p><strong>Email:</strong> ${data.usuario.email}</p>
    `;
  } catch (err) {
    console.error(err);
    profileContent.textContent = 'Error al cargar perfil';
  }
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/index.html';
});

document.addEventListener('DOMContentLoaded', cargarPerfil);
