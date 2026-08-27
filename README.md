# 🔑 AccessPass System

## 📖 Origen y Contexto

Este proyecto nació y se desplegó originalmente en producción durante mis **Pasantías Profesionalizantes**, desarrollado en un equipo de hasta 3 personas trabajando en simultáneo, con rotación de integrantes a lo largo de la pasantía (5 personas distintas en total). Surgió para resolver una necesidad operativa: centralizar la administración de identidades del personal de la empresa y automatizar en tiempo real el control de acceso físico del portón principal del establecimiento.

Posteriormente, tomé la iniciativa de **refactorizar y evolucionar el sistema de forma individual**. Reestructuré la arquitectura del Backend implementando una capa de lógica de negocios desacoplada (`Services`), automaticé la infraestructura de desarrollo local con **Docker / Docker Compose** para la base de datos y pulí la experiencia de usuario (UI/UX) para llevar la aplicación a estándares modernos de desarrollo.

## 🚀 Características Principales

- 🔐 **Autenticación Segura:** Manejo de sesiones mediante cookies `HttpOnly` (mitigación de ataques XSS) y JWT.
- 👥 **Gestión de Identidades (CRUD por Roles):** Permisos y vistas segmentadas para **ADMIN**, **EMPLOYEE** e **INTERN**.
- 🚪 **Control de Accesos Físicos:** Módulo interactivo con estados dinámicos para apertura y cierre remoto de portón.
- 🎨 **UI/UX Adaptativa:** Interfaz responsive en Next.js con soporte nativo para **Modo Claro / Modo Oscuro**.

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React / React Icons

### Backend e Infraestructura

- **Infraestructura:** Docker & Docker Compose (entorno de desarrollo local para MongoDB)
- **Runtime:** Node.js / Express
- **Base de Datos:** MongoDB (vía Docker Compose)
- **Seguridad:** Cookies `HttpOnly` + JWT

## 📂 Estructura del Repositorio

```text
access-pass-system/
├── frontend/     # Aplicación Next.js (UI, Contexts, Hooks)
└── backend/      # API REST, controladores de auth, roles y Docker Compose
````

## ⚙️ Variables de Entorno (`.env`)

Las variables requeridas están comentadas en los archivos de ejemplo de cada directorio:

- **Backend:** Copiar `backend/.env.example` a `backend/.env`
- **Frontend:** Copiar `frontend/.env.example` a `frontend/.env`

## 📦 Guía de Instalación

### Requisitos previos

- **Node.js** (v18+)
- **Docker** & **Docker Compose**

### 1. Clonar el repositorio

```bash
git clone [https://github.com/daviddtejedor/access-pass-system.git](https://github.com/daviddtejedor/access-pass-system.git)
cd access-pass-system

```

### 2. Instalar dependencias

Instalar los paquetes en ambos módulos por separado (`backend` y `frontend`):

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

```


## 💻 Guía de Desarrollo Local

Una vez instaladas las dependencias y configurados los archivos `.env`:

### 1. Levantar Servicios e Infraestructura

Desde el directorio `backend`, levantar la base de datos (MongoDB) en Docker y ejecutar la API:

```bash
cd backend

# Levantar MongoDB en contenedor
docker compose -f docker-compose-dev.yml up -d

# Iniciar servidor backend en modo desarrollo
npm run dev

```
⚠️ Nota importante sobre el primer inicio de sesión:
El sistema no cuenta con un módulo de registro público de usuarios (sign-up). Para poder iniciar sesión y probar la plataforma por primera vez, el primer usuario administrador debe crearse manualmente mediante una de las siguientes opciones:

- Opción A: Vía Petición HTTP (Postman / Thunder Client / cURL) [Recomendada]

Método: POST

URL: http://localhost:3000/api/auth/register (o la ruta/puerto configurado en tu backend)

Headers: Content-Type: application/json

Body:

JSON
```bash
{
  "name": "Admin Initial",
  "email": "admin@accesspass.local",
  "password": "tu_password_segura",
  "role": "ADMIN"
}
```

- Opción B: Vía Consulta Directa en MongoDB (Mongo Compass / Shell)
Insertar el documento directamente en la colección users:

JavaScript
```bash
db.users.insertOne({
  name: "Admin Initial",
  email: "admin@accesspass.local",
  password: "$2b$10$HASH_BCRYPT_AQUI", // Contraseña previamente hasheada
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date()
});
```
### 2. Levantar el Frontend

En una terminal independiente:

```bash
cd frontend
npm run dev

```

Acceder a la aplicación desde el navegador en `http://localhost:3001`.


## 🚀 Checklist para Despliegue en Producción

Para llevar el proyecto a un entorno de producción (VPS, Railway, Vercel, Docker Prod), considerar:

### 1. Variables de Entorno y Seguridad

- **`NODE_ENV`:** Configurar en `production`.
- **`JWT_SECRET`:** Reemplazar por una clave aleatoria de alta entropía.
- **CORS:** Restringir el origen permitido en Express (`cors({ origin: 'https://tu-dominio.com', credentials: true })`) en lugar de usar comodines (`*`).

### 2. Base de Datos (MongoDB)

- Utilizar una instancia persistente con autenticación y credenciales de producción (MongoDB Atlas o contenedor con volumen montado).

### 3. Build del Frontend

```bash
cd frontend
npm run build
npm start

```
