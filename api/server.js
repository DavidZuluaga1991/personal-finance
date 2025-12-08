const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../data/db.json'));

const SECRET = process.env.JWT_SECRET || 'dev-secret-key';

server.use(bodyParser.json());

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

server.post('/auth', (req, res) => {
  console.log('⚡ POST /auth received');

  const { email, password } = req.body;
  const db = router.db;

  const user = db.get('users').find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const payload = { sub: user.id, email: user.email };
  const token = jwt.sign(payload, SECRET, { expiresIn: '24h' });

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

server.use(router);

server.listen(3001, () => {
  console.log('🚀 JSON Server RUNNING on http://localhost:3001');
});

