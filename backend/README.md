# Design Platform Backend

Backend API para plataforma de diseño de estampados personalizados con visualización 3D, desarrollado con **Arquitectura Limpia** y **TypeScript**.

## 📋 Características

- ✅ Arquitectura limpia por capas (Domain, Application, Infrastructure, Presentation)
- ✅ TypeScript con tipado estricto en todas las capas
- ✅ Autenticación JWT con roles (CLIENT, DESIGNER, ADMIN)
- ✅ Gestión de productos y catálogo
- ✅ Sistema de diseños personalizados con transformaciones 3D
- ✅ Flujo de aprobación/rechazo de diseños
- ✅ Generación de fichas técnicas en JSON
- ✅ Upload de imágenes con validación
- ✅ PostgreSQL + Prisma ORM
- ✅ Validación con Zod
- ✅ Manejo global de errores

## 🏗️ Arquitectura

```
backend/
├── src/
│   ├── domain/                    # Capa de Dominio
│   │   ├── entities/              # Entidades del negocio
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Design.ts
│   │   │   ├── Review.ts
│   │   │   └── TechnicalSheet.ts
│   │   └── repositories/          # Interfaces de repositorios
│   │       ├── IUserRepository.ts
│   │       ├── IProductRepository.ts
│   │       ├── IDesignRepository.ts
│   │       └── IReviewRepository.ts
│   │
│   ├── application/               # Capa de Aplicación
│   │   └── services/              # Casos de uso y lógica de negocio
│   │       ├── AuthService.ts
│   │       ├── ProductService.ts
│   │       ├── DesignService.ts
│   │       ├── ReviewService.ts
│   │       └── UploadService.ts
│   │
│   ├── infrastructure/            # Capa de Infraestructura
│   │   ├── database/
│   │   │   └── prisma.ts
│   │   └── repositories/          # Implementaciones de repositorios
│   │       ├── UserRepository.ts
│   │       ├── ProductRepository.ts
│   │       ├── DesignRepository.ts
│   │       └── ReviewRepository.ts
│   │
│   ├── presentation/              # Capa de Presentación
│   │   ├── controllers/           # Controladores HTTP
│   │   │   ├── AuthController.ts
│   │   │   ├── ProductController.ts
│   │   │   ├── DesignController.ts
│   │   │   ├── ReviewController.ts
│   │   │   └── UploadController.ts
│   │   ├── middlewares/           # Middlewares de Express
│   │   │   ├── authMiddleware.ts
│   │   │   ├── roleMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── uploadMiddleware.ts
│   │   └── routes/                # Definición de rutas
│   │       ├── authRoutes.ts
│   │       ├── productRoutes.ts
│   │       ├── designRoutes.ts
│   │       ├── reviewRoutes.ts
│   │       ├── uploadRoutes.ts
│   │       └── index.ts
│   │
│   ├── config/                    # Configuración
│   │   └── index.ts
│   ├── shared/                    # Tipos compartidos
│   │   └── types/
│   │       └── express.d.ts
│   ├── app.ts                     # Configuración de Express
│   └── index.ts                   # Entry point
│
├── prisma/
│   ├── schema.prisma              # Esquema de base de datos
│   └── seed.ts                    # Datos iniciales
├── uploads/                       # Archivos subidos
├── .env.example                   # Variables de entorno de ejemplo
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Instalación

### Prerequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/design_platform"
PORT=3000
JWT_SECRET=tu-super-secreto-jwt-cambiar-en-produccion
```

4. **Ejecutar migraciones de base de datos**
```bash
npm run prisma:migrate
```

5. **Generar cliente de Prisma**
```bash
npm run prisma:generate
```

6. **Poblar base de datos con datos iniciales**
```bash
npm run prisma:seed
```

7. **Iniciar servidor en modo desarrollo**
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

## 📚 API Endpoints

### Autenticación

#### POST `/api/auth/register`
Registrar un nuevo usuario.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLIENT",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Iniciar sesión.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLIENT"
  }
}
```

---

### Productos

#### GET `/api/products`
Obtener catálogo de productos.

**Query Parameters:**
- `category` (opcional): Filtrar por categoría

**Response (200):**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Camiseta Básica",
      "category": "camisetas",
      "availableColors": ["white", "black", "navy", "red"],
      "price": "29.99",
      "thumbnailUrl": "/thumbnails/tshirt-basic.jpg",
      "baseModelUrl": "/models/tshirt-basic.glb"
    }
  ],
  "total": 1
}
```

#### GET `/api/products/:id`
Obtener producto por ID.

**Response (200):**
```json
{
  "id": 1,
  "name": "Camiseta Básica",
  "category": "camisetas",
  "availableColors": ["white", "black", "navy"],
  "price": "29.99",
  "thumbnailUrl": "/thumbnails/tshirt-basic.jpg",
  "description": "Camiseta de algodón 100%",
  "baseModelUrl": "/models/tshirt-basic.glb"
}
```

---

### Upload

#### POST `/api/upload`
Subir imagen para estampado.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Archivo de imagen (PNG/JPG, máx 5MB)

**Response (200):**
```json
{
  "url": "http://localhost:3000/uploads/abc123-def456.png",
  "filename": "abc123-def456.png"
}
```

---

### Diseños

#### POST `/api/designs`
Crear un nuevo diseño.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "productId": 1,
  "color": "white",
  "imageUrl": "http://localhost:3000/uploads/abc123.png",
  "transforms": {
    "position": { "x": 0, "y": 0.5, "z": 0.1 },
    "rotation": { "x": 0, "y": 0, "z": 0 },
    "scale": { "x": 1, "y": 1, "z": 1 }
  }
}
```

**Response (201):**
```json
{
  "id": 1,
  "status": "PENDING",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### GET `/api/designs/:id`
Obtener diseño por ID.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "userId": 1,
  "productId": 1,
  "color": "white",
  "imageUrl": "http://localhost:3000/uploads/abc123.png",
  "transforms": {
    "position": { "x": 0, "y": 0.5, "z": 0.1 },
    "rotation": { "x": 0, "y": 0, "z": 0 },
    "scale": { "x": 1, "y": 1, "z": 1 }
  },
  "status": "PENDING",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "product": {
    "id": 1,
    "name": "Camiseta Básica",
    "category": "camisetas"
  }
}
```

#### GET `/api/designs/user/me`
Obtener diseños del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "designs": [
    {
      "id": 1,
      "productId": 1,
      "color": "white",
      "status": "APPROVED",
      "product": {
        "name": "Camiseta Básica",
        "thumbnailUrl": "/thumbnails/tshirt-basic.jpg"
      }
    }
  ],
  "total": 1
}
```

#### GET `/api/designs/pending/all`
Obtener diseños pendientes (solo DESIGNER/ADMIN).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "designs": [
    {
      "id": 1,
      "userId": 1,
      "status": "PENDING",
      "user": {
        "email": "user@example.com",
        "name": "John Doe"
      },
      "product": {
        "name": "Camiseta Básica"
      }
    }
  ],
  "total": 1
}
```

---

### Reviews (Aprobación/Rechazo)

#### POST `/api/reviews/:designId/approve`
Aprobar un diseño (solo DESIGNER/ADMIN).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "comment": "Diseño aprobado, se ve excelente"
}
```

**Response (200):**
```json
{
  "designId": 1,
  "status": "APPROVED",
  "reviewedAt": "2024-01-15T11:00:00.000Z"
}
```

#### POST `/api/reviews/:designId/reject`
Rechazar un diseño (solo DESIGNER/ADMIN).

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "comment": "El estampado necesita mejor resolución"
}
```

**Response (200):**
```json
{
  "designId": 1,
  "status": "REJECTED",
  "reviewedAt": "2024-01-15T11:00:00.000Z"
}
```

#### GET `/api/reviews/:designId/technical-sheet`
Generar ficha técnica de diseño aprobado (solo DESIGNER/ADMIN).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "designId": 1,
  "approvedAt": "2024-01-15T11:00:00.000Z",
  "product": {
    "id": 1,
    "name": "Camiseta Básica",
    "category": "camisetas",
    "baseModel": "/models/tshirt-basic.glb"
  },
  "specifications": {
    "color": "white",
    "stampImageUrl": "http://localhost:3000/uploads/abc123.png",
    "transforms": {
      "position": { "x": 0, "y": 0.5, "z": 0.1 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 }
    },
    "printArea": {
      "width": 30,
      "height": 40,
      "position": "center-front"
    }
  },
  "client": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  },
  "production": {
    "estimatedQuantity": 1,
    "notes": "Diseño aprobado, se ve excelente"
  }
}
```

---

### Health Check

#### GET `/health`
Verificar estado del servidor.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 🔐 Autenticación

Todos los endpoints protegidos requieren un token JWT en el header:

```
Authorization: Bearer {token}
```

El token se obtiene al hacer login o registro y debe incluirse en todas las peticiones autenticadas.

## 👥 Roles y Permisos

- **CLIENT**: Puede crear diseños y ver sus propios diseños
- **DESIGNER**: Puede ver todos los diseños, aprobar/rechazar, y generar fichas técnicas
- **ADMIN**: Todos los permisos

## 🗄️ Base de Datos

### Modelos

- **User**: Usuarios del sistema
- **Product**: Catálogo de prendas
- **Design**: Diseños personalizados de clientes
- **Review**: Aprobaciones/rechazos de diseñadores

### Datos de prueba

Después de ejecutar `npm run prisma:seed`, tendrás:

**Usuarios:**
- Cliente: `client@example.com` / `password123`
- Diseñador: `designer@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

**Productos:**
- 8 productos de diferentes categorías (camisetas, hoodies, polos, etc.)

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Iniciar en modo desarrollo
npm run build        # Compilar TypeScript
npm start            # Iniciar servidor en producción
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:seed      # Poblar base de datos
npm run prisma:studio    # Abrir Prisma Studio
npm run lint         # Ejecutar ESLint
npm run format       # Formatear código con Prettier
```

## 🧪 Ejemplo de Integración con Frontend

### 1. Registro/Login

```typescript
// Registro
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
  })
});

const { token, user } = await response.json();
localStorage.setItem('token', token);
```

### 2. Obtener Productos

```typescript
const response = await fetch('http://localhost:3000/api/products');
const { products } = await response.json();
```

### 3. Subir Imagen

```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const { url } = await response.json();
```

### 4. Crear Diseño

```typescript
const response = await fetch('http://localhost:3000/api/designs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: 1,
    color: 'white',
    imageUrl: uploadedImageUrl,
    transforms: {
      position: { x: 0, y: 0.5, z: 0.1 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    }
  })
});

const design = await response.json();
```

## 📝 Tipos TypeScript para Frontend

```typescript
// User
export enum Role {
  CLIENT = 'CLIENT',
  DESIGNER = 'DESIGNER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
}

// Product
export interface Product {
  id: number;
  name: string;
  category: string;
  availableColors: string[];
  price: string;
  thumbnailUrl: string | null;
  baseModelUrl: string;
}

// Design
export enum DesignStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Transforms {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

export interface Design {
  id: number;
  userId: number;
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
  status: DesignStatus;
  createdAt: string;
}
```

## 🔧 Variables de Entorno

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/design_platform

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=image/png,image/jpeg,image/jpg

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 📄 Licencia

MIT

## 👨‍💻 Desarrollo

Este proyecto utiliza:
- **Express** - Framework web
- **TypeScript** - Lenguaje de programación
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Zod** - Validación de datos
- **Multer** - Upload de archivos

---

**Desarrollado con Arquitectura Limpia y buenas prácticas de TypeScript** 🚀
