# 🚀 Quick Start Guide

Guía rápida para poner en marcha el backend en menos de 5 minutos.

## ⚡ Inicio Rápido

### 1. Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configurar Base de Datos

Crea una base de datos PostgreSQL:

```sql
CREATE DATABASE design_platform;
```

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita `.env` y configura la URL de la base de datos:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/design_platform?schema=public"
JWT_SECRET="cambia-este-secreto-por-uno-seguro"
```

### 4. Ejecutar Migraciones

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 5. Poblar Base de Datos

```bash
npm run prisma:seed
```

### 6. Iniciar Servidor

```bash
npm run dev
```

¡Listo! El servidor está corriendo en `http://localhost:3000`

## 🧪 Probar la API

### Opción 1: Con cURL

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Registrar Usuario:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Obtener Productos:**
```bash
curl http://localhost:3000/api/products
```

### Opción 2: Con Thunder Client / Postman

Importa esta colección:

**Base URL:** `http://localhost:3000/api`

**Endpoints:**
1. POST `/auth/register`
2. POST `/auth/login`
3. GET `/products`
4. POST `/upload` (requiere auth)
5. POST `/designs` (requiere auth)
6. GET `/designs/user/me` (requiere auth)

### Opción 3: Con el script de prueba

```bash
# Crear archivo test.sh
cat > test.sh << 'EOF'
#!/bin/bash

echo "=== Testing API ==="

echo "\n1. Health Check"
curl http://localhost:3000/health

echo "\n\n2. Register User"
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test"}' \
  | jq -r '.token')

echo "\n\n3. Get Products"
curl http://localhost:3000/api/products

echo "\n\n4. Get My Designs (authenticated)"
curl http://localhost:3000/api/designs/user/me \
  -H "Authorization: Bearer $TOKEN"

echo "\n\nDone!"
EOF

chmod +x test.sh
./test.sh
```

## 👥 Usuarios de Prueba

Después del seed, estos usuarios están disponibles:

| Email | Password | Role |
|-------|----------|------|
| client@example.com | password123 | CLIENT |
| designer@example.com | password123 | DESIGNER |
| admin@example.com | password123 | ADMIN |

## 📊 Ver Base de Datos

Abre Prisma Studio:

```bash
npm run prisma:studio
```

Navega a `http://localhost:5555`

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar en modo desarrollo

# Base de datos
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:migrate   # Crear nueva migración
npm run prisma:seed      # Poblar datos de prueba

# Producción
npm run build            # Compilar TypeScript
npm start                # Iniciar servidor compilado

# Código
npm run lint             # Ejecutar ESLint
npm run format           # Formatear con Prettier
```

## 🐛 Solución de Problemas

### Error: "Can't reach database server"

**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Comprueba las credenciales en `.env`
3. Verifica que la base de datos existe

### Error: "JWT_SECRET is required"

**Solución:**
Configura `JWT_SECRET` en `.env`

### Error: "Port 3000 is already in use"

**Solución:**
Cambia el puerto en `.env`:
```env
PORT=3001
```

### Error de migraciones

**Solución:**
Resetea la base de datos:
```bash
npx prisma migrate reset
npm run prisma:migrate
npm run prisma:seed
```

## 📚 Próximos Pasos

1. **Lee la documentación completa:** `README.md`
2. **Explora la arquitectura:** `ARCHITECTURE.md`
3. **Integra con frontend:** `API_INTEGRATION.md`
4. **Revisa los requerimientos:** `../requerimientos_bk.md`

## 🎯 Endpoints Principales

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | No |
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/products` | Listar productos | No |
| GET | `/api/products/:id` | Ver producto | No |
| POST | `/api/upload` | Subir imagen | Sí |
| POST | `/api/designs` | Crear diseño | Sí |
| GET | `/api/designs/:id` | Ver diseño | Sí |
| GET | `/api/designs/user/me` | Mis diseños | Sí |
| GET | `/api/designs/pending/all` | Diseños pendientes | Designer |
| POST | `/api/reviews/:id/approve` | Aprobar diseño | Designer |
| POST | `/api/reviews/:id/reject` | Rechazar diseño | Designer |
| GET | `/api/reviews/:id/technical-sheet` | Ficha técnica | Designer |

## 💡 Tips

1. **Usa Prisma Studio** para visualizar y editar datos fácilmente
2. **Guarda el token** después del login para hacer requests autenticados
3. **Revisa los logs** en la consola para debug
4. **Usa variables de entorno** diferentes para dev/prod

---

¿Todo funcionando? ¡Perfecto! Ahora puedes comenzar a desarrollar tu frontend 🎨
