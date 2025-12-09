const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));

const SECRET = "dev-secret-key";

// Body parser
server.use(bodyParser.json());

// CORS manual sin defaults()
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


// 🔥 CUSTOM LOGIN ROUTE — debe estar ANTES del router
server.post("/auth/login", (req, res) => {
  console.log("⚡ POST /auth received");

  const { email, password } = req.body;
  const db = router.db;
  const user = db.get("users").find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const payload = { sub: user.id, email: user.email };
  const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

  res.json({ data: { user: { id: user.id, email: user.email, role: user.role }, token }, message: "Success login"});
});



// 🔥 Importante: el router SIEMPRE al final
server.use(router);

server.listen(3003, () => {
  console.log("🚀 JSON Server RUNNING on http://localhost:3003");
});
