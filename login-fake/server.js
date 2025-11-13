// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos falsa en memoria
const usuarios = [
  { id: 1, email: 'ana@example.com', password: '1234', nombre: 'Ana' },
  { id: 2, email: 'lucia@example.com', password: 'abcd', nombre: 'Lucía' }
];

// Helper para crear un "token" simple (solo para la simulación)
function crearTokenParaUsuario(usuario) {
  // token sencillo: "fake-token-<id>"
  return `fake-token-${usuario.id}`;
}

// Ruta de login (POST)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = usuarios.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }

  const token = crearTokenParaUsuario(user);
  // No devolvemos password
  const { password: _, ...userSinPassword } = user;
  res.json({ usuario: userSinPassword, token });
});

// Ruta protegida (GET /perfil)
app.get('/perfil', (req, res) => {
  const auth = req.headers['authorization'] || '';
  // Esperamos: "Bearer fake-token-1"
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ mensaje: 'No autorizado: token faltante' });
  }
  const token = parts[1];
  const match = token.match(/^fake-token-(\d+)$/);
  if (!match) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
  const userId = Number(match[1]);
  const user = usuarios.find(u => u.id === userId);
  if (!user) return res.status(401).json({ mensaje: 'Usuario no encontrado' });
  const { password: _, ...userSinPassword } = user;
  res.json({ usuario: userSinPassword });
});

app.listen(PORT, () => {
  console.log(`Servidor fake escuchando en http://localhost:${PORT}`);
});
