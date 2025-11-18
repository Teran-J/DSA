# Guía de Integración API - Frontend

Esta guía proporciona ejemplos prácticos de cómo integrar el backend con tu aplicación frontend.

## 📦 Instalación de Cliente HTTP

Recomendamos usar **Axios** para las peticiones HTTP:

```bash
npm install axios
```

## 🔧 Configuración Base

### 1. Crear Cliente API

```typescript
// src/api/client.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔐 Servicios de Autenticación

```typescript
// src/api/services/authService.ts
import { apiClient } from '../client';

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string | null;
    role: 'CLIENT' | 'DESIGNER' | 'ADMIN';
  };
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  },
};
```

## 👕 Servicios de Productos

```typescript
// src/api/services/productService.ts
import { apiClient } from '../client';

export interface Product {
  id: number;
  name: string;
  category: string;
  availableColors: string[];
  price: string;
  thumbnailUrl: string | null;
  baseModelUrl: string;
  description: string | null;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
}

export const productService = {
  async getAll(category?: string): Promise<ProductListResponse> {
    const params = category ? { category } : {};
    const response = await apiClient.get<ProductListResponse>('/products', { params });
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },
};
```

## 📤 Servicios de Upload

```typescript
// src/api/services/uploadService.ts
import { apiClient } from '../client';

export interface UploadResponse {
  url: string;
  filename: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
```

## 🎨 Servicios de Diseños

```typescript
// src/api/services/designService.ts
import { apiClient } from '../client';

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

export interface CreateDesignRequest {
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
}

export interface Design {
  id: number;
  userId: number;
  productId: number;
  color: string;
  imageUrl: string;
  transforms: Transforms;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user?: {
    id: number;
    email: string;
    name: string | null;
  };
  product?: {
    id: number;
    name: string;
    category: string;
    thumbnailUrl: string | null;
  };
}

export const designService = {
  async create(data: CreateDesignRequest): Promise<{ id: number; status: string; createdAt: string }> {
    const response = await apiClient.post('/designs', data);
    return response.data;
  },

  async getById(id: number): Promise<Design> {
    const response = await apiClient.get<Design>(`/designs/${id}`);
    return response.data;
  },

  async getMyDesigns(): Promise<{ designs: Design[]; total: number }> {
    const response = await apiClient.get('/designs/user/me');
    return response.data;
  },

  async getPendingDesigns(): Promise<{ designs: Design[]; total: number }> {
    const response = await apiClient.get('/designs/pending/all');
    return response.data;
  },
};
```

## ✅ Servicios de Reviews

```typescript
// src/api/services/reviewService.ts
import { apiClient } from '../client';

export interface ApproveRequest {
  comment?: string;
}

export interface RejectRequest {
  comment: string;
}

export interface ReviewResponse {
  designId: number;
  status: 'APPROVED' | 'REJECTED';
  reviewedAt: string;
}

export const reviewService = {
  async approve(designId: number, data: ApproveRequest): Promise<ReviewResponse> {
    const response = await apiClient.post<ReviewResponse>(`/reviews/${designId}/approve`, data);
    return response.data;
  },

  async reject(designId: number, data: RejectRequest): Promise<ReviewResponse> {
    const response = await apiClient.post<ReviewResponse>(`/reviews/${designId}/reject`, data);
    return response.data;
  },

  async getTechnicalSheet(designId: number): Promise<any> {
    const response = await apiClient.get(`/reviews/${designId}/technical-sheet`);
    return response.data;
  },
};
```

## 🎯 Ejemplos de Uso en Componentes React

### Componente de Login

```typescript
// src/components/Login.tsx
import React, { useState } from 'react';
import { authService } from '../api/services/authService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { token, user } = await authService.login({ email, password });
      authService.saveToken(token);
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};
```

### Componente de Catálogo

```typescript
// src/components/ProductCatalog.tsx
import React, { useEffect, useState } from 'react';
import { productService, Product } from '../api/services/productService';

export const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll(category || undefined);
      setProducts(data.products);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Todas las categorías</option>
        <option value="camisetas">Camisetas</option>
        <option value="hoodies">Hoodies</option>
        <option value="polos">Polos</option>
      </select>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.thumbnailUrl || ''} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Componente de Upload

```typescript
// src/components/ImageUpload.tsx
import React, { useState } from 'react';
import { uploadService } from '../api/services/uploadService';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación en cliente
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Solo se permiten archivos PNG y JPG');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const { url } = await uploadService.uploadImage(file);
      onUploadSuccess(url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <div>Subiendo imagen...</div>}
    </div>
  );
};
```

### Componente de Creación de Diseño

```typescript
// src/components/DesignCreator.tsx
import React, { useState } from 'react';
import { designService, CreateDesignRequest } from '../api/services/designService';
import { ImageUpload } from './ImageUpload';

export const DesignCreator: React.FC = () => {
  const [productId, setProductId] = useState(1);
  const [color, setColor] = useState('white');
  const [imageUrl, setImageUrl] = useState('');
  const [transforms, setTransforms] = useState({
    position: { x: 0, y: 0.5, z: 0.1 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  });

  const handleCreateDesign = async () => {
    if (!imageUrl) {
      alert('Primero sube una imagen');
      return;
    }

    try {
      const design = await designService.create({
        productId,
        color,
        imageUrl,
        transforms,
      });

      alert(`Diseño creado con ID: ${design.id}`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear diseño');
    }
  };

  return (
    <div>
      <h2>Crear Diseño</h2>

      <ImageUpload onUploadSuccess={setImageUrl} />
      {imageUrl && <img src={imageUrl} alt="Preview" width="200" />}

      <select value={color} onChange={(e) => setColor(e.target.value)}>
        <option value="white">Blanco</option>
        <option value="black">Negro</option>
        <option value="navy">Azul Marino</option>
      </select>

      <button onClick={handleCreateDesign} disabled={!imageUrl}>
        Crear Diseño
      </button>
    </div>
  );
};
```

### Componente de Dashboard de Diseñador

```typescript
// src/components/DesignerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { designService, Design } from '../api/services/designService';
import { reviewService } from '../api/services/reviewService';

export const DesignerDashboard: React.FC = () => {
  const [pendingDesigns, setPendingDesigns] = useState<Design[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  useEffect(() => {
    loadPendingDesigns();
  }, []);

  const loadPendingDesigns = async () => {
    const data = await designService.getPendingDesigns();
    setPendingDesigns(data.designs);
  };

  const handleApprove = async (designId: number) => {
    try {
      await reviewService.approve(designId, {
        comment: 'Diseño aprobado',
      });
      alert('Diseño aprobado exitosamente');
      loadPendingDesigns();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al aprobar');
    }
  };

  const handleReject = async (designId: number) => {
    const comment = prompt('Ingresa el motivo del rechazo:');
    if (!comment) return;

    try {
      await reviewService.reject(designId, { comment });
      alert('Diseño rechazado');
      loadPendingDesigns();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al rechazar');
    }
  };

  return (
    <div>
      <h2>Diseños Pendientes</h2>
      <div className="designs-list">
        {pendingDesigns.map((design) => (
          <div key={design.id} className="design-card">
            <img src={design.imageUrl} alt="Design" width="150" />
            <p>Cliente: {design.user?.name || design.user?.email}</p>
            <p>Producto: {design.product?.name}</p>
            <button onClick={() => handleApprove(design.id)}>Aprobar</button>
            <button onClick={() => handleReject(design.id)}>Rechazar</button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🎣 Custom Hooks para React

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../api/services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { token } = await authService.login({ email, password });
    authService.saveToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, loading, login, logout };
};
```

## 🔄 Manejo de Errores

```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Error de respuesta del servidor
    return error.response.data?.error || 'Error del servidor';
  } else if (error.request) {
    // No se recibió respuesta
    return 'No se pudo conectar con el servidor';
  } else {
    // Error al configurar la petición
    return error.message || 'Error desconocido';
  }
};
```

## 📱 Variables de Entorno Frontend

```env
# .env
VITE_API_URL=http://localhost:3000/api
```

---

Esta guía proporciona todo lo necesario para integrar el backend con tu aplicación frontend de forma completa y tipada. 🚀
