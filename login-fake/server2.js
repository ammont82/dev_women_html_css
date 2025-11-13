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
let usuarios = [
  { id: 1, email: 'ana@example.com', password: '1234', nombre: 'Ana' },
  { id: 2, email: 'lucia@example.com', password: 'abcd', nombre: 'Lucía' }
];
let nextUserId = usuarios.length + 1;

// Helper para crear un "token" simple (solo para la simulación)
// Incluimos un pequeño payload: fake-token-<id>-<timestamp> para poder simular expiración si se quisiera
function crearTokenParaUsuario(usuario) {
  return `fake-token-${usuario.id}-${Date.now()}`;
}

// Helper para validar email básico
function esEmailValido(email) {
  // regex simple para propósitos didácticos
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Ruta de login (POST)
app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y password son requeridos' });
  }
  const user = usuarios.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }

  const token = crearTokenParaUsuario(user);
  const { password: _, ...userSinPassword } = user;
  res.json({ usuario: userSinPassword, token });
});

// Ruta para registrar (POST /register)
app.post('/register', (req, res) => {
  const { email, password, nombre } = req.body || {};

  // Validaciones básicas en servidor
  if (!email || !password || !nombre) {
    return res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });
  }
  if (!esEmailValido(email)) {
    return res.status(400).json({ mensaje: 'Email inválido' });
  }
  if (password.length < 4) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 4 caracteres' });
  }
  const exists = usuarios.some(u => u.email === email);
  if (exists) {
    return res.status(409).json({ mensaje: 'Ya existe un usuario con ese email' });
  }

  const nuevo = { id: nextUserId++, email, password, nombre };
  usuarios.push(nuevo);

  const token = crearTokenParaUsuario(nuevo);
  const { password: _, ...usuarioSinPassword } = nuevo;
  res.status(201).json({ usuario: usuarioSinPassword, token });
});

// Ruta protegida (GET /perfil)
app.get('/perfil', (req, res) => {
  const auth = req.headers['authorization'] || '';
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ mensaje: 'No autorizado: token faltante' });
  }
  const token = parts[1];
  // Token esperado: fake-token-<id>-<ts>
  const match = token.match(/^fake-token-(\d+)-\d+$/);
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
