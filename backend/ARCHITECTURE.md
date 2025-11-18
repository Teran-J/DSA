# Arquitectura del Proyecto

Este documento describe la arquitectura limpia implementada en el backend de la plataforma de diseño de estampados.

## 🏛️ Arquitectura Limpia (Clean Architecture)

El proyecto sigue los principios de **Clean Architecture** de Robert C. Martin (Uncle Bob), organizando el código en capas concéntricas con dependencias que fluyen hacia adentro.

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│          (Controllers, Routes, Middlewares)             │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │            Application Layer                      │  │
│  │         (Services, Use Cases)                     │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │        Domain Layer                      │    │  │
│  │  │    (Entities, Interfaces)                │    │  │
│  │  │                                          │    │  │
│  │  │     - Pure Business Logic                │    │  │
│  │  │     - No External Dependencies           │    │  │
│  │  │                                          │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  │                                                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  Infrastructure Layer (Repositories, DB, External)      │
└─────────────────────────────────────────────────────────┘
```

## 📂 Capas del Sistema

### 1. Domain Layer (Capa de Dominio)

**Ubicación:** `src/domain/`

**Responsabilidades:**
- Contiene las **entidades** del negocio
- Define las **interfaces de repositorios**
- Establece las **reglas de negocio** puras
- **Sin dependencias** externas (frameworks, librerías)

**Estructura:**
```
domain/
├── entities/
│   ├── User.ts          # Entidad de usuario + DTOs
│   ├── Product.ts       # Entidad de producto + DTOs
│   ├── Design.ts        # Entidad de diseño + DTOs
│   ├── Review.ts        # Entidad de revisión + DTOs
│   └── TechnicalSheet.ts
└── repositories/
    ├── IUserRepository.ts
    ├── IProductRepository.ts
    ├── IDesignRepository.ts
    └── IReviewRepository.ts
```

**Principios:**
- ✅ Entidades completamente tipadas
- ✅ DTOs para transferencia de datos
- ✅ Interfaces, no implementaciones
- ✅ Enums para valores constantes
- ❌ NO importar nada de otras capas
- ❌ NO depender de frameworks

**Ejemplo:**
```typescript
// domain/entities/User.ts
export enum Role {
  CLIENT = 'CLIENT',
  DESIGNER = 'DESIGNER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}
```

### 2. Application Layer (Capa de Aplicación)

**Ubicación:** `src/application/`

**Responsabilidades:**
- Implementa **casos de uso** del sistema
- Orquesta la lógica de negocio
- Coordina entre repositorios
- Aplica validaciones de negocio

**Estructura:**
```
application/
└── services/
    ├── AuthService.ts      # Autenticación y registro
    ├── ProductService.ts   # Lógica de productos
    ├── DesignService.ts    # Lógica de diseños
    ├── ReviewService.ts    # Aprobación/rechazo
    └── UploadService.ts    # Gestión de uploads
```

**Principios:**
- ✅ Depende de interfaces del dominio
- ✅ Implementa lógica de negocio compleja
- ✅ Coordina múltiples repositorios
- ✅ Valida reglas de negocio
- ❌ NO conoce detalles de HTTP
- ❌ NO conoce detalles de base de datos

**Ejemplo:**
```typescript
// application/services/DesignService.ts
export class DesignService {
  constructor(
    private designRepository: IDesignRepository,
    private productRepository: IProductRepository
  ) {}

  async createDesign(data: CreateDesignDTO): Promise<Design> {
    // Validar que el producto existe
    const product = await this.productRepository.findById(data.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Validar que el color está disponible
    if (!product.availableColors.includes(data.color)) {
      throw new Error('Color not available');
    }

    return this.designRepository.create(data);
  }
}
```

### 3. Infrastructure Layer (Capa de Infraestructura)

**Ubicación:** `src/infrastructure/`

**Responsabilidades:**
- Implementa las **interfaces de repositorios**
- Gestiona la **conexión a base de datos**
- Integra con **servicios externos**
- Maneja **detalles técnicos**

**Estructura:**
```
infrastructure/
├── database/
│   └── prisma.ts           # Cliente de Prisma
└── repositories/
    ├── UserRepository.ts   # Implementación de IUserRepository
    ├── ProductRepository.ts
    ├── DesignRepository.ts
    └── ReviewRepository.ts
```

**Principios:**
- ✅ Implementa interfaces del dominio
- ✅ Contiene detalles técnicos (SQL, ORM)
- ✅ Mapea entre modelos de DB y entidades
- ✅ Gestiona transacciones
- ❌ NO contiene lógica de negocio

**Ejemplo:**
```typescript
// infrastructure/repositories/UserRepository.ts
export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name || null,
        role: data.role || Role.CLIENT,
      },
    });

    return this.mapToEntity(user);
  }

  private mapToEntity(user: any): User {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role as Role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
```

### 4. Presentation Layer (Capa de Presentación)

**Ubicación:** `src/presentation/`

**Responsabilidades:**
- Maneja **HTTP requests/responses**
- Define **rutas** de la API
- Implementa **middlewares**
- Valida **datos de entrada**
- Formatea **respuestas**

**Estructura:**
```
presentation/
├── controllers/
│   ├── AuthController.ts
│   ├── ProductController.ts
│   ├── DesignController.ts
│   ├── ReviewController.ts
│   └── UploadController.ts
├── middlewares/
│   ├── authMiddleware.ts
│   ├── roleMiddleware.ts
│   ├── errorHandler.ts
│   └── uploadMiddleware.ts
└── routes/
    ├── authRoutes.ts
    ├── productRoutes.ts
    ├── designRoutes.ts
    ├── reviewRoutes.ts
    ├── uploadRoutes.ts
    └── index.ts
```

**Principios:**
- ✅ Depende de servicios de aplicación
- ✅ Valida request con Zod
- ✅ Transforma responses a JSON
- ✅ Maneja errores HTTP
- ❌ NO contiene lógica de negocio

**Ejemplo:**
```typescript
// presentation/controllers/DesignController.ts
export class DesignController {
  private designService: DesignService;

  constructor() {
    const designRepository = new DesignRepository();
    const productRepository = new ProductRepository();
    this.designService = new DesignService(designRepository, productRepository);
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createDesignSchema.parse(req.body);

      const design = await this.designService.createDesign({
        ...validatedData,
        userId: req.userId!,
      });

      res.status(201).json({
        id: design.id,
        status: design.status,
        createdAt: design.createdAt,
      });
    } catch (error) {
      // Error handling...
    }
  };
}
```

## 🔄 Flujo de Datos

### Ejemplo: Crear un Diseño

```
1. HTTP Request
   POST /api/designs
   ↓

2. Presentation Layer
   DesignController.create()
   - Valida datos con Zod
   - Extrae userId del token
   ↓

3. Application Layer
   DesignService.createDesign()
   - Valida que producto existe
   - Valida que color está disponible
   - Aplica reglas de negocio
   ↓

4. Infrastructure Layer
   DesignRepository.create()
   - Ejecuta query en Prisma
   - Mapea resultado a entidad
   ↓

5. Response Flow
   Design Entity → DTO → JSON Response
```

## 🎯 Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
Cada clase tiene una única responsabilidad:
- `AuthService` → Solo autenticación
- `DesignRepository` → Solo persistencia de diseños
- `AuthController` → Solo manejo de HTTP para auth

### Open/Closed Principle (OCP)
Abierto a extensión, cerrado a modificación:
- Nuevos repositorios implementan `IRepository`
- Nuevos servicios pueden agregarse sin modificar existentes

### Liskov Substitution Principle (LSP)
Las implementaciones de repositorios son intercambiables:
```typescript
const repository: IDesignRepository = new DesignRepository();
// Podría cambiarse por otra implementación sin romper el código
```

### Interface Segregation Principle (ISP)
Interfaces específicas, no monolíticas:
```typescript
interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: number): Promise<User | null>;
  // Solo métodos necesarios para User
}
```

### Dependency Inversion Principle (DIP)
Dependemos de abstracciones, no de implementaciones:
```typescript
class DesignService {
  constructor(
    private designRepository: IDesignRepository,  // Interface, no clase
    private productRepository: IProductRepository
  ) {}
}
```

## 🔒 Seguridad

### Autenticación
- JWT tokens con expiración configurable
- Passwords hasheados con bcrypt (10 rounds)
- Token validation middleware

### Autorización
- Role-based access control (RBAC)
- Middleware para validar roles
- Ownership validation en servicios

### Validación
- Validación de entrada con Zod
- Sanitización de datos
- File upload con restricciones

## 🧪 Testabilidad

La arquitectura facilita el testing:

```typescript
// Mock de repositorio para testing
class MockDesignRepository implements IDesignRepository {
  async create(data: CreateDesignDTO): Promise<Design> {
    return {
      id: 1,
      ...data,
      status: DesignStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  // ...otros métodos
}

// Test del servicio
const designService = new DesignService(
  new MockDesignRepository(),
  new MockProductRepository()
);

const design = await designService.createDesign(mockData);
expect(design.status).toBe(DesignStatus.PENDING);
```

## 📊 Ventajas de esta Arquitectura

### ✅ Mantenibilidad
- Código organizado y fácil de entender
- Cambios localizados en capas específicas
- Separación clara de responsabilidades

### ✅ Escalabilidad
- Fácil agregar nuevos features
- Servicios independientes
- Capas pueden escalar por separado

### ✅ Testabilidad
- Inyección de dependencias
- Mocks fáciles de implementar
- Testing unitario por capa

### ✅ Flexibilidad
- Cambiar ORM sin afectar lógica de negocio
- Cambiar framework web sin afectar servicios
- Implementaciones intercambiables

## 🔄 Flujo de Dependencias

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑            ↑
   HTTP         Use Cases    Entities    Database
 Express         Logic      Interfaces   Prisma
Middlewares    Services                External
```

**Regla de dependencias:**
- Las capas externas dependen de las internas
- Las capas internas NO conocen las externas
- El dominio es el núcleo sin dependencias

## 🛠️ Tecnologías por Capa

| Capa | Tecnologías |
|------|-------------|
| Domain | TypeScript puro, Interfaces |
| Application | TypeScript, Business Logic |
| Infrastructure | Prisma, PostgreSQL |
| Presentation | Express, Zod, JWT, Multer |

---

**Esta arquitectura garantiza un código limpio, mantenible y profesional** 🚀
