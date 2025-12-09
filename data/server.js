const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const SECRET = process.env.JWT_SECRET || "dev-secret-key";
const PORT = process.env.PORT || 3003;

const ROLE_PERMISSIONS = {
  admin: [
    "transactions:view:all",
    "transactions:create",
    "transactions:edit:all",
    "transactions:delete:all",
    "summary:view:all",
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "system:config",
  ],
  user: [
    "transactions:view:own",
    "transactions:create",
    "transactions:edit:own",
    "transactions:delete:own",
    "summary:view:own",
  ],
  viewer: [
    "transactions:view:own",
    "summary:view:own",
  ],
  guest: [],
};

function getUserPermissions(user) {
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  const customPermissions = user.permissions || [];
  return [...new Set([...rolePermissions, ...customPermissions])];
}

function hasPermission(user, permission) {
  const permissions = getUserPermissions(user);
  return permissions.includes(permission);
}

function isAdmin(user) {
  return user.role === "admin";
}

function canViewTransaction(user, transactionUserId) {
  if (isAdmin(user)) return true;
  if (hasPermission(user, "transactions:view:all")) return true;
  if (hasPermission(user, "transactions:view:own") && transactionUserId === user.id) return true;
  return false;
}

function canEditTransaction(user, transactionUserId) {
  if (isAdmin(user)) return true;
  if (hasPermission(user, "transactions:edit:all")) return true;
  if (hasPermission(user, "transactions:edit:own") && transactionUserId === user.id) return true;
  return false;
}

function canDeleteTransaction(user, transactionUserId) {
  if (isAdmin(user)) return true;
  if (hasPermission(user, "transactions:delete:all")) return true;
  if (hasPermission(user, "transactions:delete:own") && transactionUserId === user.id) return true;
  return false;
}

function requireAuth(req, requiredPermission) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return { user: null, error: { status: 401, message: "No autorizado" } };
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    if (!decoded || !decoded.sub || !decoded.email) {
      return { user: null, error: { status: 401, message: "Token inválido" } };
    }

    const db = router.db;
    const user = db.get("users").find({ id: decoded.sub }).value();

    if (!user) {
      return { user: null, error: { status: 401, message: "Usuario no encontrado" } };
    }

    const authUser = {
      id: user.id,
      email: user.email,
      role: user.role || "user",
      permissions: user.permissions || [],
    };

    if (requiredPermission && !isAdmin(authUser) && !hasPermission(authUser, requiredPermission)) {
      return { user: null, error: { status: 403, message: "Permisos insuficientes" } };
    }

    return { user: authUser, error: null };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { user: null, error: { status: 401, message: "Token expirado" } };
    }
    return { user: null, error: { status: 401, message: "Token inválido. Por favor, inicia sesión nuevamente." } };
  }
}

server.use(middlewares);
server.use(bodyParser.json());

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

server.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son requeridos" });
  }

  const db = router.db;
  const user = db.get("users").find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role || "user",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };

  const token = jwt.sign(payload, SECRET);

  res.json({
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
      token,
    },
    message: "Login exitoso",
  });
});

server.get("/transactions", (req, res) => {
  const { user, error } = requireAuth(req);

  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  if (!user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const db = router.db;
  let transactions = db.get("transactions").value();

  if (!isAdmin(user)) {
    transactions = transactions.filter((t) => t.userId === user.id);
  }

  res.json({
    data: transactions,
    message: "Transacciones obtenidas exitosamente",
  });
});

server.get("/transactions/:id", (req, res) => {
  const { user, error } = requireAuth(req);

  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  if (!user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const db = router.db;
  const transaction = db.get("transactions").find({ id: req.params.id }).value();

  if (!transaction) {
    return res.status(404).json({ message: "Transacción no encontrada" });
  }

  if (!canViewTransaction(user, transaction.userId)) {
    return res.status(403).json({ message: "No tienes permiso para ver esta transacción" });
  }

  res.json({
    data: transaction,
    message: "Transacción obtenida exitosamente",
  });
});

server.post("/transactions", (req, res) => {
  const { user, error } = requireAuth(req, "transactions:create");

  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  if (!user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (!isAdmin(user) && !hasPermission(user, "transactions:create")) {
    return res.status(403).json({ message: "Permisos insuficientes" });
  }

  const db = router.db;
  const { title, amount, type, category, date, description } = req.body;

  if (!title || amount === undefined || !type || !category || !date) {
    return res.status(400).json({ message: "Campos requeridos: title, amount, type, category, date" });
  }

  const newTransaction = {
    id: `t${Date.now()}`,
    userId: user.id,
    title,
    amount: Number(amount),
    type,
    category,
    date,
    description: description || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.get("transactions").push(newTransaction).write();

  res.status(201).json({
    data: newTransaction,
    message: "Transacción creada exitosamente",
  });
});

server.put("/transactions/:id", (req, res) => {
  const { user, error } = requireAuth(req);

  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  if (!user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const db = router.db;
  const transaction = db.get("transactions").find({ id: req.params.id }).value();

  if (!transaction) {
    return res.status(404).json({ message: "Transacción no encontrada" });
  }

  if (!canEditTransaction(user, transaction.userId)) {
    return res.status(403).json({ message: "No tienes permiso para editar esta transacción" });
  }

  const updated = {
    ...transaction,
    ...req.body,
    id: transaction.id,
    userId: transaction.userId,
    updatedAt: new Date().toISOString(),
  };

  db.get("transactions").find({ id: req.params.id }).assign(updated).write();

  res.json({
    data: updated,
    message: "Transacción actualizada exitosamente",
  });
});

server.delete("/transactions/:id", (req, res) => {
  const { user, error } = requireAuth(req);

  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  if (!user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const db = router.db;
  const transaction = db.get("transactions").find({ id: req.params.id }).value();

  if (!transaction) {
    return res.status(404).json({ message: "Transacción no encontrada" });
  }

  if (!canDeleteTransaction(user, transaction.userId)) {
    return res.status(403).json({ message: "No tienes permiso para eliminar esta transacción" });
  }

  db.get("transactions").remove({ id: req.params.id }).write();

  res.json({
    message: "Transacción eliminada exitosamente",
  });
});

server.get("/summary", (req, res) => {
  const { user, error } = requireAuth(req);

  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  if (!user) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const db = router.db;
  let transactions = db.get("transactions").value();

  if (!isAdmin(user)) {
    transactions = transactions.filter((t) => t.userId === user.id);
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  res.json({
    data: {
      totalIncome,
      totalExpenses,
      netBalance,
    },
    message: "Resumen obtenido exitosamente",
  });
});

server.use((req, res, next) => {
  if (req.path.startsWith("/transactions") || req.path.startsWith("/summary") || req.path.startsWith("/auth")) {
    return next();
  }
  next();
});

server.use(router);

server.listen(PORT, () => {
  console.log(`🚀 JSON Server RUNNING on http://localhost:${PORT}`);
  console.log(`📝 Endpoints disponibles:`);
  console.log(`   POST   /auth/login`);
  console.log(`   GET    /transactions`);
  console.log(`   GET    /transactions/:id`);
  console.log(`   POST   /transactions`);
  console.log(`   PUT    /transactions/:id`);
  console.log(`   DELETE /transactions/:id`);
  console.log(`   GET    /summary`);
});
