# ✅ Checklist de Integración Frontend-Backend

Esta guía te ayudará a integrar correctamente el frontend con el backend.

## 📋 Pre-requisitos

### Backend
- [x] Backend ejecutándose en `http://localhost:3000`
- [x] Base de datos PostgreSQL configurada
- [x] Migraciones ejecutadas
- [x] Datos de prueba cargados (seed)
- [x] Health check respondiendo: `GET http://localhost:3000/health`

### Frontend
- [ ] React/Vue/Angular configurado
- [ ] Cliente HTTP instalado (axios/fetch)
- [ ] Variables de entorno configuradas
- [ ] Tipos TypeScript copiados

## 🚀 Paso 1: Configurar Variables de Entorno

### Frontend `.env`

```env
# React (Vite)
VITE_API_URL=http://localhost:3000/api

# React (CRA)
REACT_APP_API_URL=http://localhost:3000/api

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🔧 Paso 2: Configurar Cliente HTTP

### Opción A: Axios (Recomendado)

```bash
npm install axios
```

```typescript
// src/api/client.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Opción B: Fetch API Nativo

```typescript
// src/api/client.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}
```

## 📝 Paso 3: Copiar Tipos TypeScript

1. Copia el contenido de `backend/FRONTEND_TYPES.md`
2. Créalo en `frontend/src/types/api.ts`
3. Verifica que no haya errores de compilación

## 🔐 Paso 4: Implementar Autenticación

### Context de Autenticación (React)

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../api/services/authService';
import { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await authService.login({ email, password });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const { token, user } = await authService.register({ email, password, name });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 🎨 Paso 5: Crear Servicios API

Copia los servicios desde `backend/API_INTEGRATION.md`:

```
src/api/services/
├── authService.ts
├── productService.ts
├── designService.ts
├── reviewService.ts
└── uploadService.ts
```

## 🧪 Paso 6: Probar Integración

### Test 1: Health Check

```typescript
// src/tests/apiTest.ts
import { apiClient } from '../api/client';

export async function testHealthCheck() {
  try {
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log('✓ Health check:', data);
    return true;
  } catch (error) {
    console.error('✗ Health check failed:', error);
    return false;
  }
}
```

### Test 2: Registro de Usuario

```typescript
import { authService } from '../api/services/authService';

export async function testRegister() {
  try {
    const result = await authService.register({
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
    });
    console.log('✓ Register successful:', result);
    return true;
  } catch (error) {
    console.error('✗ Register failed:', error);
    return false;
  }
}
```

### Test 3: Login

```typescript
export async function testLogin() {
  try {
    const result = await authService.login({
      email: 'client@example.com',
      password: 'password123',
    });
    console.log('✓ Login successful:', result);
    return true;
  } catch (error) {
    console.error('✗ Login failed:', error);
    return false;
  }
}
```

### Test 4: Obtener Productos

```typescript
import { productService } from '../api/services/productService';

export async function testGetProducts() {
  try {
    const result = await productService.getAll();
    console.log('✓ Get products successful:', result);
    return true;
  } catch (error) {
    console.error('✗ Get products failed:', error);
    return false;
  }
}
```

### Ejecutar Todos los Tests

```typescript
// src/App.tsx (temporal, para testing)
import { useEffect } from 'react';
import { testHealthCheck, testRegister, testLogin, testGetProducts } from './tests/apiTest';

function App() {
  useEffect(() => {
    async function runTests() {
      console.log('🧪 Running API tests...');
      await testHealthCheck();
      await testRegister();
      await testLogin();
      await testGetProducts();
      console.log('✅ All tests completed');
    }

    runTests();
  }, []);

  return <div>Check console for test results</div>;
}
```

## 🔒 Paso 7: Proteger Rutas

### React Router v6

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

### Uso

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Role } from './types/api';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/designs"
            element={
              <ProtectedRoute>
                <DesignsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/designer/dashboard"
            element={
              <ProtectedRoute allowedRoles={[Role.DESIGNER, Role.ADMIN]}>
                <DesignerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

## 📤 Paso 8: Implementar Upload de Imágenes

```typescript
// src/components/ImageUploader.tsx
import React, { useState } from 'react';
import { uploadService } from '../api/services/uploadService';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PNG and JPG files are allowed');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    try {
      setUploading(true);
      setError(null);
      const { url } = await uploadService.uploadImage(file);
      onUploadSuccess(url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '300px' }} />}
    </div>
  );
};
```

## 🎯 Paso 9: Checklist Final

### Backend
- [ ] Servidor corriendo en puerto 3000
- [ ] Base de datos conectada
- [ ] Health check responde correctamente
- [ ] CORS permite tu frontend origin
- [ ] Usuarios de prueba creados

### Frontend
- [ ] Variables de entorno configuradas
- [ ] Cliente HTTP configurado
- [ ] Tipos TypeScript importados
- [ ] Servicios API creados
- [ ] Context de autenticación implementado
- [ ] Rutas protegidas funcionando
- [ ] Login/Register funcionan
- [ ] Productos se pueden listar
- [ ] Upload de imágenes funciona

### Integración
- [ ] Token se guarda correctamente
- [ ] Token se envía en headers
- [ ] 401 redirige a login
- [ ] Errores se manejan correctamente
- [ ] Loading states implementados

## 🐛 Troubleshooting Común

### Error: CORS

**Problema:** `Access-Control-Allow-Origin` error

**Solución:** En backend `.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

### Error: 401 Unauthorized

**Problema:** Token no se está enviando

**Solución:** Verifica interceptor de axios:
```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // Debug
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Error: Network Error

**Problema:** Backend no está corriendo

**Solución:**
```bash
cd backend
npm run dev
```

### Error: Invalid Token

**Problema:** Token expirado o inválido

**Solución:**
```typescript
// Logout y limpiar storage
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';
```

## 📚 Recursos Adicionales

- `backend/README.md` - Documentación completa del backend
- `backend/API_INTEGRATION.md` - Guía de integración detallada
- `backend/FRONTEND_TYPES.md` - Tipos TypeScript
- `backend/QUICK_START.md` - Inicio rápido

## ✅ Listo!

Si completaste todos los pasos, tu frontend está correctamente integrado con el backend. Ahora puedes:

1. Implementar la UI de tu aplicación
2. Integrar el visualizador 3D
3. Crear el flujo de diseño completo
4. Implementar el dashboard de diseñador

¡Buena suerte con tu proyecto! 🚀
