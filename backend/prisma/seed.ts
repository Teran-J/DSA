import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting seed...');

  // Clean database
  await prisma.review.deleteMany();
  await prisma.design.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('✨ Database cleaned');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const clientUser = await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: hashedPassword,
      name: 'Cliente Demo',
      role: 'CLIENT',
    },
  });

  const designerUser = await prisma.user.create({
    data: {
      email: 'designer@example.com',
      password: hashedPassword,
      name: 'Diseñador Demo',
      role: 'DESIGNER',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  console.log('👥 Users created:', {
    client: clientUser.email,
    designer: designerUser.email,
    admin: adminUser.email,
  });

  // Create products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Camiseta Básica',
        category: 'camisetas',
        baseModelUrl: '/models/tshirt-basic.glb',
        availableColors: JSON.stringify(['white', 'black', 'navy', 'red', 'gray']),
        price: 29.99,
        thumbnailUrl: '/thumbnails/tshirt-basic.jpg',
        description: 'Camiseta de algodón 100% ideal para estampados personalizados',
        active: true,
      },
      {
        name: 'Camiseta Premium',
        category: 'camisetas',
        baseModelUrl: '/models/tshirt-premium.glb',
        availableColors: JSON.stringify(['white', 'black', 'navy']),
        price: 39.99,
        thumbnailUrl: '/thumbnails/tshirt-premium.jpg',
        description: 'Camiseta premium con mejor calidad de tela',
        active: true,
      },
      {
        name: 'Hoodie Clásico',
        category: 'hoodies',
        baseModelUrl: '/models/hoodie-classic.glb',
        availableColors: JSON.stringify(['black', 'gray', 'navy', 'burgundy']),
        price: 59.99,
        thumbnailUrl: '/thumbnails/hoodie-classic.jpg',
        description: 'Hoodie con capucha y bolsillo frontal',
        active: true,
      },
      {
        name: 'Hoodie Oversize',
        category: 'hoodies',
        baseModelUrl: '/models/hoodie-oversize.glb',
        availableColors: JSON.stringify(['black', 'gray', 'white']),
        price: 69.99,
        thumbnailUrl: '/thumbnails/hoodie-oversize.jpg',
        description: 'Hoodie con corte oversize moderno',
        active: true,
      },
      {
        name: 'Polo Deportivo',
        category: 'polos',
        baseModelUrl: '/models/polo-sport.glb',
        availableColors: JSON.stringify(['white', 'black', 'navy', 'red']),
        price: 34.99,
        thumbnailUrl: '/thumbnails/polo-sport.jpg',
        description: 'Polo con cuello y botones, ideal para deportes',
        active: true,
      },
      {
        name: 'Tank Top',
        category: 'tank-tops',
        baseModelUrl: '/models/tank-top.glb',
        availableColors: JSON.stringify(['white', 'black', 'gray']),
        price: 24.99,
        thumbnailUrl: '/thumbnails/tank-top.jpg',
        description: 'Camiseta sin mangas para clima cálido',
        active: true,
      },
      {
        name: 'Sudadera Crewneck',
        category: 'sudaderas',
        baseModelUrl: '/models/crewneck.glb',
        availableColors: JSON.stringify(['gray', 'black', 'navy', 'burgundy']),
        price: 49.99,
        thumbnailUrl: '/thumbnails/crewneck.jpg',
        description: 'Sudadera sin capucha con cuello redondo',
        active: true,
      },
      {
        name: 'Camiseta Manga Larga',
        category: 'camisetas',
        baseModelUrl: '/models/tshirt-long-sleeve.glb',
        availableColors: JSON.stringify(['white', 'black', 'gray', 'navy']),
        price: 34.99,
        thumbnailUrl: '/thumbnails/tshirt-long-sleeve.jpg',
        description: 'Camiseta de manga larga básica',
        active: true,
      },
    ],
  });

  console.log('👕 Products created:', products.count);

  // Create sample designs
  const allProducts = await prisma.product.findMany();

  const design1 = await prisma.design.create({
    data: {
      userId: clientUser.id,
      productId: allProducts[0].id,
      color: 'white',
      imageUrl: '/uploads/sample-design-1.png',
      transforms: JSON.stringify({
        position: { x: 0, y: 0.5, z: 0.1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      }),
      status: 'PENDING',
    },
  });

  const design2 = await prisma.design.create({
    data: {
      userId: clientUser.id,
      productId: allProducts[2].id,
      color: 'black',
      imageUrl: '/uploads/sample-design-2.png',
      transforms: JSON.stringify({
        position: { x: 0, y: 0.3, z: 0.1 },
        rotation: { x: 0, y: 0, z: 45 },
        scale: { x: 0.8, y: 0.8, z: 0.8 },
      }),
      status: 'APPROVED',
    },
  });

  // Create review for approved design
  await prisma.review.create({
    data: {
      designId: design2.id,
      reviewerId: designerUser.id,
      status: 'APPROVED',
      comment: 'Diseño aprobado, se ve excelente en la prenda',
    },
  });

  console.log('🎨 Sample designs created');

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
