# 🚀 Guía de Despliegue

Guía para desplegar el backend en producción.

## 📋 Pre-requisitos

- Node.js 18+ instalado en el servidor
- PostgreSQL 14+ en producción
- Acceso SSH al servidor
- Dominio configurado (opcional)

## 🌐 Opciones de Hosting

### Opción 1: Railway (Recomendado - Más Fácil)

#### 1. Preparar proyecto

Asegúrate de tener estos archivos:
- ✅ `package.json` con scripts de build
- ✅ `prisma/schema.prisma`
- ✅ `.env.example`

#### 2. Deploy en Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar proyecto
railway init

# Agregar PostgreSQL
railway add

# Deploy
railway up
```

#### 3. Configurar variables de entorno

En el dashboard de Railway:
- `DATABASE_URL` → Auto-configurado por Railway
- `JWT_SECRET` → Generar uno seguro
- `NODE_ENV` → `production`
- `PORT` → Auto-configurado
- `CORS_ORIGIN` → URL de tu frontend

#### 4. Ejecutar migraciones

```bash
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

### Opción 2: Render

#### 1. Crear cuenta en Render.com

#### 2. Crear PostgreSQL database

- New → PostgreSQL
- Copiar `DATABASE_URL`

#### 3. Crear Web Service

- New → Web Service
- Conectar repositorio Git
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npx prisma migrate deploy && npm start`

#### 4. Variables de entorno

```
DATABASE_URL=<from-render-postgres>
JWT_SECRET=<generate-strong-secret>
NODE_ENV=production
CORS_ORIGIN=<your-frontend-url>
```

### Opción 3: DigitalOcean App Platform

#### 1. Crear App

- Apps → Create App
- Conectar GitHub/GitLab
- Seleccionar repositorio

#### 2. Configurar Build

```yaml
name: design-platform-api
services:
  - name: api
    environment_slug: node-js
    build_command: npm install && npx prisma generate && npm run build
    run_command: npx prisma migrate deploy && npm start
    envs:
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
      - key: JWT_SECRET
        value: <generate>
      - key: NODE_ENV
        value: production
databases:
  - name: db
    engine: PG
    version: "14"
```

### Opción 4: VPS (DigitalOcean, AWS EC2, etc.)

#### 1. Conectar al servidor

```bash
ssh root@your-server-ip
```

#### 2. Instalar dependencias

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PostgreSQL
apt install -y postgresql postgresql-contrib

# Instalar PM2
npm install -g pm2
```

#### 3. Configurar PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE design_platform;
CREATE USER design_user WITH ENCRYPTED PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE design_platform TO design_user;
\q
```

#### 4. Clonar y configurar proyecto

```bash
# Clonar repositorio
git clone <your-repo-url>
cd backend

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env
nano .env
```

Configurar `.env`:
```env
DATABASE_URL="postgresql://design_user:strong_password@localhost:5432/design_platform"
JWT_SECRET="generate-a-very-strong-secret-here"
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
```

#### 5. Ejecutar migraciones y build

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
```

#### 6. Configurar PM2

```bash
# Iniciar con PM2
pm2 start dist/index.js --name design-api

# Guardar configuración
pm2 save

# Auto-iniciar en reboot
pm2 startup
```

#### 7. Configurar Nginx (opcional)

```bash
apt install -y nginx

# Crear configuración
nano /etc/nginx/sites-available/design-api
```

Contenido:
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activar:
```bash
ln -s /etc/nginx/sites-available/design-api /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 8. SSL con Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d api.your-domain.com
```

## 🔐 Seguridad en Producción

### 1. Variables de Entorno Seguras

```env
# Generar JWT_SECRET seguro
JWT_SECRET=$(openssl rand -base64 64)

# Usar HTTPS en producción
CORS_ORIGIN=https://your-app.com

# NODE_ENV en producción
NODE_ENV=production
```

### 2. Configurar Rate Limiting

Instalar:
```bash
npm install express-rate-limit
```

Agregar en `src/app.ts`:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Too many requests, please try again later.',
});

app.use('/api/', limiter);
```

### 3. Helmet para Seguridad Headers

```bash
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

### 4. CORS Específico

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [],
  credentials: true,
}));
```

## 📊 Monitoreo

### PM2 Monitoring

```bash
# Ver logs
pm2 logs design-api

# Monitorear recursos
pm2 monit

# Reiniciar
pm2 restart design-api

# Ver status
pm2 status
```

### Logs en Producción

Configurar en `src/index.ts`:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## 🔄 Actualización en Producción

### Con PM2

```bash
cd backend
git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart design-api
```

### Script de Deploy

Crear `deploy.sh`:
```bash
#!/bin/bash

echo "🚀 Deploying updates..."

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Build
npm run build

# Restart
pm2 restart design-api

echo "✅ Deploy complete!"
```

## 📦 Backup de Base de Datos

### Script de Backup

```bash
#!/bin/bash

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

pg_dump -U design_user design_platform > $BACKUP_DIR/backup_$DATE.sql

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql"
```

Configurar cron:
```bash
crontab -e

# Backup diario a las 2 AM
0 2 * * * /path/to/backup.sh
```

## 🌍 Variables de Entorno por Ambiente

### Development (.env.development)
```env
DATABASE_URL="postgresql://localhost:5432/design_platform_dev"
NODE_ENV=development
JWT_SECRET=dev-secret
CORS_ORIGIN=http://localhost:5173
```

### Production (.env.production)
```env
DATABASE_URL="postgresql://prod-db-url"
NODE_ENV=production
JWT_SECRET=<strong-secret>
CORS_ORIGIN=https://your-app.com
```

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET fuerte generado
- [ ] Base de datos PostgreSQL creada
- [ ] Migraciones ejecutadas
- [ ] Seeds ejecutados (opcional)
- [ ] Build compilado sin errores
- [ ] CORS configurado correctamente
- [ ] SSL/HTTPS configurado
- [ ] Firewall configurado
- [ ] Backups automatizados
- [ ] Monitoreo configurado
- [ ] Health check funcionando

## 🆘 Troubleshooting

### Error: Cannot connect to database

```bash
# Verificar PostgreSQL está corriendo
systemctl status postgresql

# Verificar credenciales
psql -U design_user -d design_platform
```

### Error: Port already in use

```bash
# Encontrar proceso
lsof -i :3000

# Matar proceso
kill -9 <PID>
```

### Error: Out of memory

```bash
# Aumentar memoria de Node.js
NODE_OPTIONS="--max-old-space-size=4096" pm2 start dist/index.js
```

---

**¡Tu API está lista para producción!** 🎉
