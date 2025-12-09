# Personal Finance Tracker

Aplicación web moderna para el seguimiento de ingresos y gastos personales, desarrollada con Next.js, TypeScript y Tailwind CSS. Incluye autenticación JWT, sistema de roles y permisos (RBAC), y una interfaz responsive con diseño moderno.

## 👨‍💻 Desarrollador

**David Leandro Zuluaga Martinez**

- 📧 Email: davidzuluaga1991@gmail.com
- 📱 Teléfono: +57 3006642896
- 💼 LinkedIn: [https://www.linkedin.com/in/david-leandro-zuluaga-martinez-404a9437/](https://www.linkedin.com/in/david-leandro-zuluaga-martinez-404a9437/)

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18.x o superior
- npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd personalfinance
```

2. Instalar dependencias:
```bash
npm install
```

3. Instalar dependencias del servidor JSON (backend simulado):
```bash
cd data
npm install
cd ..
```

4. Configurar variables de entorno (opcional):
```bash
# Crear archivo .env.local en la raíz del proyecto
NEXT_PUBLIC_API_URL=http://localhost:3003
```

### Ejecutar el Proyecto

#### Opción 1: Ejecutar ambos servidores juntos (Recomendado)

```bash
npm run dev:all
```

Este comando inicia:
- **Next.js** en `http://localhost:3000`
- **JSON Server** (backend simulado) en `http://localhost:3003`

#### Opción 2: Ejecutar servidores por separado

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run json-server
```

#### Opción 3: Ejecutar docker-compose

**Docker compose**
```bash
docker-compose up -d
```

### Acceder a la Aplicación

1. Abrir el navegador en: `http://localhost:3000`
2. Iniciar sesión con las credenciales de prueba:
   - **Email**: `admin@test.com`
   - **Password**: `123456`

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia solo Next.js
npm run json-server      # Inicia solo JSON Server
npm run dev:all          # Inicia ambos servidores

# Testing
npm test                 # Ejecuta todos los tests
npm run test:watch       # Ejecuta tests en modo watch
npm run test:coverage    # Genera reporte de cobertura

# Producción
npm run build            # Construye la aplicación
npm start                # Inicia la aplicación en producción
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Con reporte de cobertura
npm run test:coverage
```

### Cobertura de Tests

El proyecto incluye **172 tests** organizados en las siguientes categorías:

- ✅ **Utilidades** (formatters, validators, jwt, storage)
- ✅ **Sistema de Permisos** (RBAC completo)
- ✅ **Stores de Zustand** (auth, transactions)
- ✅ **API Client** (métodos HTTP, autenticación)
- ✅ **Servicios** (authService, transactionService)
- ✅ **Hooks Personalizados** (useLogin, useGetTransactions, etc.)
- ✅ **Componentes** (LoginForm, TransactionTable, etc.)
- ✅ **Schemas de Validación** (Zod schemas)

### Estructura de Tests

Los tests están organizados siguiendo la misma estructura del código fuente:

```
src/
├── lib/
│   └── __tests__/          # Tests de utilidades y stores
├── features/
│   ├── auth/
│   │   └── __tests__/      # Tests de autenticación
│   └── transactions/
│       └── __tests__/      # Tests de transacciones
└── components/
    └── __tests__/          # Tests de componentes UI
```

Para más detalles sobre testing, consulta [TESTING.md](./TESTING.md).

## 📡 Endpoints de la API

El proyecto utiliza un **JSON Server** como backend simulado que implementa todos los endpoints necesarios con autenticación JWT y sistema de permisos.

### Base URL

```
http://localhost:3003
```

### Autenticación

#### `POST /auth/login`

Inicia sesión y obtiene un token JWT válido por 24 horas.

**Request:**
```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "admin@test.com",
      "name": "Administrador",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Errores:**
- `400 Bad Request`: Email y contraseña requeridos
- `401 Unauthorized`: Credenciales inválidas

### Transacciones

Todos los endpoints de transacciones requieren autenticación:
```
Authorization: Bearer <token>
```

#### `GET /transactions`

Obtiene todas las transacciones (filtradas según permisos del usuario).

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "t1",
      "userId": 1,
      "title": "Monthly Salary",
      "amount": 3500,
      "type": "income",
      "category": "salary",
      "date": "2024-01-01",
      "description": "Monthly salary payment",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Transactions retrieved successfully"
}
```

**Comportamiento:**
- **Admin**: Ve todas las transacciones
- **User/Viewer**: Solo ve sus propias transacciones

#### `GET /transactions/:id`

Obtiene una transacción específica por ID.

**Response (200 OK):**
```json
{
  "data": {
    "id": "t1",
    "userId": 1,
    "title": "Monthly Salary",
    "amount": 3500,
    "type": "income",
    "category": "salary",
    "date": "2024-01-01",
    "description": "Monthly salary payment",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Transaction retrieved successfully"
}
```

**Errores:**
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: No tiene permiso para ver esta transacción
- `404 Not Found`: Transacción no encontrada

#### `POST /transactions`

Crea una nueva transacción.

**Request:**
```json
{
  "title": "Grocery Shopping",
  "amount": 150.50,
  "type": "expense",
  "category": "food",
  "date": "2024-01-15",
  "description": "Weekly groceries"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "t1234567890",
    "userId": 1,
    "title": "Grocery Shopping",
    "amount": 150.50,
    "type": "expense",
    "category": "food",
    "date": "2024-01-15",
    "description": "Weekly groceries",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Transaction created successfully"
}
```

**Errores:**
- `400 Bad Request`: Campos requeridos faltantes
- `401 Unauthorized`: Token inválido
- `403 Forbidden`: Permisos insuficientes

#### `PUT /transactions/:id`

Actualiza una transacción existente.

**Request:**
```json
{
  "title": "Updated Title",
  "amount": 200,
  "type": "expense",
  "category": "shopping",
  "date": "2024-01-15",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "t1",
    "userId": 1,
    "title": "Updated Title",
    "amount": 200,
    "type": "expense",
    "category": "shopping",
    "date": "2024-01-15",
    "description": "Updated description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Transaction updated successfully"
}
```

**Errores:**
- `401 Unauthorized`: Token inválido
- `403 Forbidden`: No tiene permiso para editar esta transacción
- `404 Not Found`: Transacción no encontrada

#### `DELETE /transactions/:id`

Elimina una transacción.

**Response (200 OK):**
```json
{
  "message": "Transaction deleted successfully"
}
```

**Errores:**
- `401 Unauthorized`: Token inválido
- `403 Forbidden`: No tiene permiso para eliminar esta transacción
- `404 Not Found`: Transacción no encontrada

### Resumen Financiero

#### `GET /summary`

Obtiene el resumen financiero (ingresos totales, gastos totales, balance neto).

**Response (200 OK):**
```json
{
  "data": {
    "totalIncome": 3500,
    "totalExpenses": 198.50,
    "netBalance": 3301.50
  },
  "message": "Summary retrieved successfully"
}
```

**Comportamiento:**
- **Admin**: Resumen global (todas las transacciones)
- **User/Viewer**: Resumen personal (solo sus transacciones)

## 🔐 Sistema de Autenticación y Permisos

### Autenticación JWT

- Los tokens JWT tienen una validez de **24 horas**
- Se almacenan en `localStorage` con persistencia
- Se incluyen automáticamente en todas las peticiones API

### Sistema de Roles (RBAC)

El sistema implementa un control de acceso basado en roles con los siguientes niveles:

#### 👑 Admin
- ✅ Ver todas las transacciones
- ✅ Crear transacciones
- ✅ Editar cualquier transacción
- ✅ Eliminar cualquier transacción
- ✅ Ver resumen global
- ✅ Gestión de usuarios

#### 👤 User
- ✅ Ver solo sus transacciones
- ✅ Crear transacciones
- ✅ Editar solo sus transacciones
- ✅ Eliminar solo sus transacciones
- ✅ Ver su resumen personal

#### 👁️ Viewer
- ✅ Ver solo sus transacciones (solo lectura)
- ✅ Ver su resumen personal
- ❌ No puede crear/editar/eliminar

#### 🚫 Guest
- ❌ Sin permisos

### Usuarios de Prueba

El archivo `data/db.json` incluye varios usuarios de prueba con diferentes roles:

- **admin@test.com** / `123456` - Administrador
- **user@test.com** / `123456` - Usuario estándar
- **viewer@test.com** / `123456` - Solo lectura

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
personalfinance/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Rutas públicas
│   │   │   └── login/
│   │   └── (dashboard)/        # Rutas protegidas
│   │       ├── dashboard/
│   │       └── transactions/
│   ├── components/             # Componentes reutilizables
│   │   ├── auth/               # Componentes de autenticación
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # Componentes UI base
│   ├── features/               # Features organizados por dominio
│   │   ├── auth/               # Feature de autenticación
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── dashboard/          # Feature del dashboard
│   │   └── transactions/      # Feature de transacciones
│   ├── lib/                    # Utilidades y configuraciones
│   │   ├── api/                # Cliente API y endpoints
│   │   ├── auth/               # Lógica de permisos
│   │   ├── store/              # Zustand stores
│   │   └── utils/              # Funciones utilitarias
│   ├── hooks/                  # Hooks personalizados
│   ├── types/                  # Tipos TypeScript globales
│   └── contexts/               # React Contexts
├── data/                       # Backend simulado (JSON Server)
│   ├── server.js               # Servidor Express con endpoints
│   ├── db.json                 # Base de datos JSON
│   └── package.json
├── public/                     # Archivos estáticos
└── tests/                      # Tests de integración (opcional)
```

### Tecnologías Utilizadas

#### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Zustand** - Gestión de estado global
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **date-fns** - Manipulación de fechas
- **Lucide React** - Iconos

#### Backend (Simulado)
- **JSON Server** - Servidor REST simulado
- **Express** - Framework Node.js
- **jsonwebtoken** - Autenticación JWT
- **body-parser** - Parsing de requests

#### Testing
- **Jest** - Test runner
- **React Testing Library** - Testing de componentes
- **@testing-library/jest-dom** - Matchers adicionales

### Patrones de Diseño

- **Feature-Based Architecture**: Organización por features/dominios
- **Custom Hooks**: Lógica reutilizable encapsulada
- **Service Layer**: Separación de lógica de negocio
- **Type Safety**: TypeScript en todo el proyecto
- **Component Composition**: Componentes pequeños y reutilizables

## ✨ Características Implementadas

### ✅ Requisitos Mínimos

- [x] Login con email y password
- [x] Rutas públicas y privadas
- [x] Validaciones de formularios
- [x] Persistencia de sesión (24 horas)
- [x] Dashboard con resumen financiero
- [x] Lista de transacciones
- [x] Filtrado por tipo
- [x] Ordenamiento por fecha, monto y título
- [x] Crear/Editar/Eliminar transacciones
- [x] Actualización automática del resumen
- [x] Indicadores de carga
- [x] Manejo de errores
- [x] Tests unitarios

### 🎁 Funcionalidades Adicionales (Bonus)

- [x] **Sistema de Roles y Permisos (RBAC)**: Control de acceso granular
- [x] **Diseño Responsive**: Mobile-first, completamente adaptativo
- [x] **UI Moderna**: Diseño oscuro con gradientes y efectos glassmorphism
- [x] **Toast Notifications**: Notificaciones de éxito/error
- [x] **Modales de Confirmación**: Reemplazo de `confirm()` nativo
- [x] **Filtrado Avanzado**: Por tipo, categoría, fecha
- [x] **Ordenamiento Múltiple**: Por fecha, monto, título
- [x] **Validación con Zod**: Schemas de validación robustos
- [x] **Persistencia de Estado**: Zustand con persist middleware
- [x] **Backend Simulado Completo**: JSON Server con autenticación JWT
- [x] **Cobertura de Tests**: 172 tests unitarios
- [x] **TypeScript Estricto**: Tipado completo en todo el proyecto
- [x] **Optimización de Performance**: useMemo, useCallback donde corresponde
- [x] **Accesibilidad**: ARIA labels, navegación por teclado

## 🎨 Diseño UI/UX

### Paleta de Colores

- **Fondo**: Gradiente oscuro (slate-950, blue-950)
- **Cards**: Glassmorphism con backdrop-blur
- **Acentos**: Azul (#3b82f6) para acciones principales
- **Estados**: Verde para ingresos, Rojo para gastos

### Componentes Principales

- **Sidebar**: Navegación lateral con información del usuario
- **Header**: Barra superior con título y acciones
- **Summary Cards**: Tarjetas con resumen financiero (clickeables)
- **Transaction Table**: Tabla responsive con acciones
- **Forms**: Formularios con validación en tiempo real
- **Modals**: Modales de confirmación personalizados
- **Toasts**: Notificaciones no intrusivas

## 🔧 Configuración Avanzada

### Variables de Entorno

Crear archivo `.env.local`:

```env
# URL del backend (JSON Server o API real)
NEXT_PUBLIC_API_URL=http://localhost:3003

# Secret para JWT (solo para JSON Server)
JWT_SECRET=dev-secret-key

# Puerto del JSON Server
PORT=3003
```

### Personalizar el Backend

Para usar un backend real en lugar de JSON Server:

1. Implementa los mismos endpoints en tu backend
2. Mantén la misma estructura de respuestas
3. Actualiza `NEXT_PUBLIC_API_URL` en `.env.local`
4. El frontend funcionará sin cambios


## 🐛 Solución de Problemas

### El servidor no inicia

1. Verifica que los puertos 3000 y 3003 estén disponibles
2. Asegúrate de tener todas las dependencias instaladas
3. Verifica que `data/db.json` exista y tenga formato válido

### Errores 401/403

1. **401 Unauthorized**: Token inválido o expirado
   - Solución: Hacer login de nuevo
   
2. **403 Forbidden**: Permisos insuficientes
   - Verifica el rol del usuario en `data/db.json`
   - Asegúrate de usar un usuario con los permisos necesarios

### Tests fallando

1. Asegúrate de tener todas las dependencias instaladas
2. Ejecuta `npm test` para ver los errores específicos
3. Algunos tests pueden requerir ajustes según la zona horaria

### CORS Errors

El JSON Server está configurado para aceptar peticiones desde `http://localhost:3000`. Si usas otro puerto, actualiza la configuración CORS en `data/server.js`.

## 📝 Notas Importantes

- Los datos se persisten en `data/db.json`
- Los tokens JWT expiran después de 24 horas
- Los usuarios admin tienen acceso total automáticamente
- Los usuarios no-admin solo ven sus propias transacciones
- Todos los endpoints validan autenticación y permisos

## 📄 Licencia

Este proyecto fue desarrollado como parte de una prueba técnica.

---

**Desarrollado con ❤️ por David Leandro Zuluaga Martinez**
