# Requerimientos del Sistema - Plataforma de Diseño de Estampados

Este documento contiene los requerimientos técnicos para implementar una plataforma de personalización de prendas con visualización 3D, gestión de diseños y flujo de aprobación.

---

## P001 — Registro de Usuario

**Prioridad:** 1  
**Estimación:** 8 horas

### Descripción
Implementar endpoint `POST /auth/register` para crear usuarios con hash de contraseña y validación básica de email.

### Valor de Negocio
Permite guardar diseños y relacionarlos a un cliente.

### Criterios de Aceptación
- [ ] Usuario creado correctamente en la base de datos
- [ ] Password hasheado con algoritmo seguro (bcrypt o argon2)
- [ ] Validación de formato de email
- [ ] Endpoint devuelve status 201 en caso de éxito
- [ ] Test unitario implementado y pasando

### Dependencias
- P003 (Migraciones y modelos BD)
- P004 (Estructura API básica)

### Notas de Implementación
```typescript
// Endpoint esperado
POST /auth/register

// Request body type
interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

// Response type
interface RegisterResponse {
  id: number;
  email: string;
  createdAt: Date;
}

// Response: 201 { id, email, createdAt }
```

---

## P002 — Login / Autenticación

**Prioridad:** 1  
**Estimación:** 6 horas

### Descripción
Implementar endpoint `POST /auth/login` que devuelva JWT y middleware de protección de rutas.

### Valor de Negocio
Acceso seguro a recursos protegidos.

### Criterios de Aceptación
- [ ] Login devuelve token JWT válido
- [ ] Token incluye userId y expiration
- [ ] Middleware de autenticación implementado
- [ ] Rutas protegidas validan token correctamente
- [ ] Manejo de errores para credenciales inválidas

### Dependencias
- P001 (Registro de usuario)

### Notas de Implementación
```typescript
// Endpoint esperado
POST /auth/login

// Request body type
interface LoginRequest {
  email: string;
  password: string;
}

// Response type
interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

// Middleware
const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  // Valida JWT en header Authorization
};
```

---

## P003 — Migraciones y Modelos BD

**Prioridad:** 1  
**Estimación:** 6 horas

### Descripción
Crear tablas `users`, `products`, `designs`, `reviews` con migraciones y seed de catálogo inicial.

### Valor de Negocio
Base de datos funcional para persistencia de toda la aplicación.

### Criterios de Aceptación
- [ ] Migraciones ejecutan sin errores
- [ ] Tabla `users`: id, email, password, name, role, createdAt
- [ ] Tabla `products`: id, name, category, baseModel, colors, price
- [ ] Tabla `designs`: id, userId, productId, color, imageUrl, transforms, status, createdAt
- [ ] Tabla `reviews`: id, designId, reviewerId, status, comment, createdAt
- [ ] Seed con productos básicos (camisetas, hoodies, etc.)
- [ ] Índices apropiados en campos de búsqueda

### Dependencias
- Ninguna

### Notas de Implementación
```typescript
// Prisma Schema
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(CLIENT)
  createdAt DateTime @default(now())
  designs   Design[]
  reviews   Review[]
}

model Product {
  id              Int      @id @default(autoincrement())
  name            String
  category        String
  baseModelUrl    String
  availableColors Json
  price           Decimal
  designs         Design[]
}

model Design {
  id        Int      @id @default(autoincrement())
  userId    Int
  productId Int
  color     String
  imageUrl  String
  transforms Json
  status    DesignStatus @default(PENDING)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
  reviews   Review[]
}

model Review {
  id         Int      @id @default(autoincrement())
  designId   Int
  reviewerId Int
  status     ReviewStatus
  comment    String?
  createdAt  DateTime @default(now())
  design     Design   @relation(fields: [designId], references: [id])
  reviewer   User     @relation(fields: [reviewerId], references: [id])
}

enum Role {
  CLIENT
  DESIGNER
  ADMIN
}

enum DesignStatus {
  PENDING
  APPROVED
  REJECTED
}

enum ReviewStatus {
  APPROVED
  REJECTED
}
```

---

## P004 — Estructura API Básica

**Prioridad:** 1  
**Estimación:** 8 horas

### Descripción
Inicializar servidor Express/Fastify, configurar rutas base, error handler global y endpoint de health check.

### Valor de Negocio
Fundamento para todos los endpoints de la aplicación.

### Criterios de Aceptación
- [ ] Servidor arranca correctamente
- [ ] Endpoint `/health` devuelve 200
- [ ] Error handler global implementado
- [ ] CORS configurado
- [ ] Variables de entorno configuradas
- [ ] README con documentación de endpoints
- [ ] Estructura de carpetas organizada (routes, controllers, middleware, models)

### Dependencias
- Ninguna

### Notas de Implementación
```
/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── utils/
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── config/
│   └── index.ts
├── tests/
├── tsconfig.json
├── package.json
└── README.md
```

---

## P005 — GET /products (Catálogo)

**Prioridad:** 2  
**Estimación:** 8 horas

### Descripción
Endpoint para listar productos del catálogo con filtro por categoría.

### Valor de Negocio
Permite al cliente escoger la prenda base para personalizar.

### Criterios de Aceptación
- [ ] `GET /products` retorna lista JSON de todos los productos
- [ ] Filtro `?category=` funciona correctamente
- [ ] Respuesta incluye: id, name, category, colors, price, thumbnailUrl
- [ ] Paginación implementada (opcional)
- [ ] Test de integración

### Dependencias
- P003 (Migraciones y modelos BD)
- P004 (Estructura API básica)

### Notas de Implementación
```typescript
// Endpoint esperado
GET /products
GET /products?category=camisetas

// Response type
interface ProductListResponse {
  products: Product[];
  total: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  availableColors: string[];
  price: number;
  thumbnailUrl: string;
}
```

---

## P006 — POST /upload (Imágenes)

**Prioridad:** 2  
**Estimación:** 10 horas

### Descripción
Subida de imágenes PNG/JPG (máximo 5MB) con respuesta de URL para almacenamiento local en staging.

### Valor de Negocio
Permite aplicar estampados personalizados de los clientes.

### Criterios de Aceptación
- [ ] Acepta archivos PNG y JPG únicamente
- [ ] Validación de tamaño máximo 5MB
- [ ] Archivo guardado en sistema de archivos local
- [ ] Devuelve URL accesible de la imagen
- [ ] Genera nombre único para evitar colisiones
- [ ] Manejo de errores para archivos inválidos

### Dependencias
- P004 (Estructura API básica)

### Notas de Implementación
```typescript
// Endpoint esperado
POST /upload
Content-Type: multipart/form-data

// Response type
interface UploadResponse {
  url: string;
  filename: string;
}

// Multer config example
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
    cb(null, allowed.includes(file.mimetype));
  }
});
```

---

## P007 — POST /designs & GET /designs/:id

**Prioridad:** 1  
**Estimación:** 10 horas

### Descripción
Guardar diseño completo (JSON con userId, productId, color, imageUrl, transforms) y recuperar por ID.

### Valor de Negocio
Workflow central de la aplicación: guardar y recuperar diseños personalizados.

### Criterios de Aceptación
- [ ] `POST /designs` guarda diseño correctamente
- [ ] `GET /designs/:id` recupera diseño por ID
- [ ] Endpoints protegidos por autenticación
- [ ] Validación de campos requeridos
- [ ] Usuario solo puede ver sus propios diseños (o admin todos)
- [ ] Status inicial: "pending"

### Dependencias
- P002 (Login / autenticación)
- P003 (Migraciones y modelos BD)

### Notas de Implementación
```typescript
// Endpoint esperado
POST /designs (auth required)

// Request body type
interface CreateDesignRequest {
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
}

interface Transforms {
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Response type
interface CreateDesignResponse {
  id: number;
  status: 'PENDING';
  createdAt: Date;
}

// GET /designs/:id (auth required)
interface DesignResponse {
  id: number;
  userId: number;
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
  status: DesignStatus;
  createdAt: Date;
}
```

---

## P008 — Spike 3D (Evaluación)

**Prioridad:** 2  
**Estimación:** 16 horas

### Descripción
Evaluación técnica de Three.js vs Babylon.js con PoC de render básico para medir rendimiento y compatibilidad.

### Valor de Negocio
Reduce riesgo técnico del visualizador 3D antes de inversión completa.

### Criterios de Aceptación
- [ ] Informe comparativo Three.js vs Babylon.js
- [ ] PoC funcional que renderiza modelo base de prenda
- [ ] Métricas de rendimiento (FPS, carga inicial, memoria)
- [ ] Prueba en diferentes navegadores
- [ ] Recomendación justificada de tecnología

### Dependencias
- Ninguna

### Notas de Implementación
```
Criterios de evaluación:
- Facilidad de integración
- Rendimiento en dispositivos móviles
- Soporte de texturas dinámicas
- Comunidad y documentación
- Tamaño del bundle
```

---

## P009 — Visualizador 3D Cliente (PoC → Integración)

**Prioridad:** 2  
**Estimación:** 40 horas

### Descripción
Viewer 3D completo con cambio de color de prenda y aplicación de textura/estampado.

### Valor de Negocio
Experiencia central del cliente para visualizar su diseño personalizado.

### Criterios de Aceptación
- [ ] Modelo 3D de prenda carga correctamente
- [ ] Cambio de color funciona en tiempo real
- [ ] Imagen del estampado se aplica como textura
- [ ] Controles de cámara: rotar, zoom, pan
- [ ] Responsive en desktop y móvil
- [ ] Loading state mientras carga modelo

### Dependencias
- P008 (Spike 3D)
- P005 (Catálogo de productos)

### Notas de Implementación
```typescript
// Componente React esperado
interface ProductViewer3DProps {
  modelUrl: string;
  color: string;
  stampImage?: string;
  stampTransforms?: Transforms;
  onTransformChange?: (transforms: Transforms) => void;
}

const ProductViewer3D: React.FC<ProductViewer3DProps> = ({
  modelUrl,
  color,
  stampImage,
  stampTransforms,
  onTransformChange
}) => {
  // Three.js implementation
};

export default ProductViewer3D;
```

---

## P010 — Transform Controls (Escala/Rotación/Posición en 3D)

**Prioridad:** 2  
**Estimación:** 32 horas

### Descripción
Herramientas interactivas para posicionar, rotar y escalar el estampado sobre el modelo 3D.

### Valor de Negocio
Control preciso del estampado para obtener el resultado deseado.

### Criterios de Aceptación
- [ ] Control de posición (drag & drop sobre superficie)
- [ ] Control de escala (handles o slider)
- [ ] Control de rotación (handles o slider)
- [ ] Transforms se guardan en formato JSON
- [ ] Preview en tiempo real
- [ ] Undo/Redo de transformaciones

### Dependencias
- P009 (Visualizador 3D)

### Notas de Implementación
```typescript
// Formato de transforms esperado
interface Transforms {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number }; // grados
  scale: { x: number; y: number; z: number };
}

// Ejemplo de valores
const defaultTransforms: Transforms = {
  position: { x: 0, y: 0.5, z: 0.1 },
  rotation: { x: 0, y: 0, z: 45 },
  scale: { x: 1, y: 1, z: 1 }
};
```

---

## P011 — Dashboard Diseñador (Pendientes, Visor)

**Prioridad:** 2  
**Estimación:** 20 horas

### Descripción
Panel para diseñadores con listado de diseños pendientes de revisión y visor 3D integrado.

### Valor de Negocio
Permite el flujo de aprobación/rechazo de diseños.

### Criterios de Aceptación
- [ ] Lista de diseños con status "pending"
- [ ] Filtros por fecha, cliente, producto
- [ ] Click en diseño abre visor 3D
- [ ] Visor muestra diseño exacto del cliente
- [ ] Información del cliente visible
- [ ] Solo accesible para rol "designer"

### Dependencias
- P009 (Visualizador 3D)
- P007 (Endpoints de diseños)

### Notas de Implementación
```typescript
// Componentes React esperados
interface DesignListProps {
  filters: DesignFilters;
  onSelect: (design: Design) => void;
}

interface DesignFilters {
  dateFrom?: Date;
  dateTo?: Date;
  clientId?: number;
  productId?: number;
}

const DesignerDashboard: React.FC = () => {
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  
  return (
    <div>
      <DesignList filters={filters} onSelect={setSelectedDesign} />
      {selectedDesign && (
        <>
          <DesignPreview design={selectedDesign} />
          <ReviewActions designId={selectedDesign.id} />
        </>
      )}
    </div>
  );
};
```

---

## P012 — Aprobación / Rechazo y Comentarios

**Prioridad:** 2  
**Estimación:** 16 horas

### Descripción
Endpoints para aprobar o rechazar diseños con comentarios de feedback.

### Valor de Negocio
Cierre del flujo de revisión y comunicación con el cliente.

### Criterios de Aceptación
- [ ] `POST /reviews/:designId/approve` cambia status a "approved"
- [ ] `POST /reviews/:designId/reject` cambia status a "rejected"
- [ ] Comentario obligatorio en rechazo
- [ ] Comentario opcional en aprobación
- [ ] Registro de quién revisó y cuándo
- [ ] Solo accesible para rol "designer"

### Dependencias
- P007 (Endpoints de diseños)
- P002 (Autenticación)

### Notas de Implementación
```typescript
// Endpoints esperados
POST /reviews/:designId/approve (auth: designer)
POST /reviews/:designId/reject (auth: designer)

// Request types
interface ApproveRequest {
  comment?: string;
}

interface RejectRequest {
  comment: string; // requerido
}

// Response type
interface ReviewResponse {
  designId: number;
  status: 'APPROVED' | 'REJECTED';
  reviewedAt: Date;
}

// Controller example
const approveDesign = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { designId } = req.params;
  const { comment } = req.body as ApproveRequest;
  // Implementation
};
```

---

## P013 — Generación Ficha Técnica JSON al Aprobar

**Prioridad:** 2  
**Estimación:** 8 horas

### Descripción
Al aprobar un diseño, compilar especificaciones completas en JSON para producción/ERP.

### Valor de Negocio
Insumo estructurado para el área de producción y sistemas ERP.

### Criterios de Aceptación
- [ ] JSON generado automáticamente al aprobar
- [ ] Incluye: prenda, color, imagen, transforms, cantidades
- [ ] Endpoint para descargar ficha técnica
- [ ] Formato consistente y documentado
- [ ] Almacenado junto con el diseño

### Dependencias
- P012 (Aprobación/Rechazo)

### Notas de Implementación
```typescript
// Estructura de ficha técnica
interface TechnicalSheet {
  designId: number;
  approvedAt: string; // ISO8601
  product: {
    id: number;
    name: string;
    category: string;
    baseModel: string;
  };
  specifications: {
    color: string;
    stampImageUrl: string;
    transforms: Transforms;
    printArea: {
      width: number;
      height: number;
      position: string;
    };
  };
  client: {
    id: number;
    name: string;
    email: string;
  };
  production: {
    estimatedQuantity: number;
    notes: string;
  };
}

// Endpoint
GET /designs/:id/technical-sheet
// Response: 200 TechnicalSheet
```

---

## P014 — Estado Pedido en Perfil (Cliente)

**Prioridad:** 3  
**Estimación:** 8 horas

### Descripción
Endpoint para que el cliente vea sus diseños con estado actual y comentarios de revisión.

### Valor de Negocio
Transparencia del proceso para el cliente.

### Criterios de Aceptación
- [ ] `GET /profile/designs` lista diseños del usuario
- [ ] Muestra status: Pendiente, Rechazado, Aprobado
- [ ] Incluye comentarios de revisión
- [ ] Ordenado por fecha (más reciente primero)
- [ ] Paginación

### Dependencias
- P007 (Endpoints de diseños)
- P012 (Aprobación/Rechazo)

### Notas de Implementación
```typescript
// Endpoint esperado
GET /profile/designs (auth required)

// Response type
interface ProfileDesignsResponse {
  designs: ProfileDesign[];
  total: number;
}

interface ProfileDesign {
  id: number;
  product: {
    name: string;
    thumbnail: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  review: {
    comment: string;
    reviewedAt: Date;
  } | null;
  createdAt: Date;
}
```

---

## P015 — Integración ERP (Simulada / Stub SAP)

**Prioridad:** 4  
**Estimación:** 12 horas

### Descripción
Endpoint stub que simula consulta a SAP para stock y costos, preparando integración futura.

### Valor de Negocio
Simulación para cálculo de costos y disponibilidad de stock.

### Criterios de Aceptación
- [ ] `GET /stub/sap/stock/:productId` devuelve stock mock
- [ ] `GET /stub/sap/cost/:productId` devuelve costo mock
- [ ] Datos mock configurables
- [ ] Documentación de formato esperado de SAP real
- [ ] Fácil de reemplazar por integración real

### Dependencias
- P004 (Estructura API básica)

### Notas de Implementación
```typescript
// Endpoints esperados
GET /stub/sap/stock/:productId
GET /stub/sap/cost/:productId

// Response types
interface StockResponse {
  productId: number;
  available: number;
  reserved: number;
  warehouse: string;
  updatedAt: string; // ISO8601
}

interface CostResponse {
  productId: number;
  unitCost: number;
  currency: 'USD' | 'PEN';
  components: CostComponent[];
}

interface CostComponent {
  name: string;
  cost: number;
}

// Config flag para cambiar a integración real
// .env
USE_REAL_SAP=false

// config/index.ts
export const config = {
  useRealSAP: process.env.USE_REAL_SAP === 'true'
};
```

---

## Resumen de Prioridades

| Prioridad | Requerimientos | Total Horas |
|-----------|----------------|-------------|
| 1 (Crítico) | P001, P002, P003, P004, P007 | 38h |
| 2 (Alto) | P005, P006, P008, P009, P010, P011, P012, P013 | 150h |
| 3 (Medio) | P014 | 8h |
| 4 (Bajo) | P015 | 12h |

**Total estimado:** 208 horas

## Orden Sugerido de Implementación

1. **Sprint 1 (Fundamentos):** P004 → P003 → P001 → P002
2. **Sprint 2 (Core Features):** P005 → P006 → P007
3. **Sprint 3 (3D Viewer):** P008 → P009 → P010
4. **Sprint 4 (Workflow):** P011 → P012 → P013 → P014
5. **Sprint 5 (Integración):** P015

---

## Stack Tecnológico

- **Backend:** Node.js + Express/Fastify + **TypeScript**
- **Base de datos:** PostgreSQL
- **ORM:** Prisma (TypeScript nativo)
- **Autenticación:** JWT + bcrypt
- **3D:** Three.js (confirmar con P008)
- **Frontend:** React + TypeScript
- **Storage:** Local filesystem (staging) → S3 (producción)
- **Testing:** Jest + Supertest
- **Validación:** Zod