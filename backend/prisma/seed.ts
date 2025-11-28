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
        baseModelUrl: 'https://www.pngarts.com/files/1/T-Shirt-PNG-Transparent-Image.png',
        availableColors: JSON.stringify(['white', 'black', 'navy', 'red', 'gray']),
        price: 29.99,
        thumbnailUrl: 'https://www.pngarts.com/files/1/T-Shirt-PNG-Transparent-Image.png',
        description: 'Camiseta de algodón 100% ideal para estampados personalizados',
        active: true,
      },
      {
        name: 'Camiseta Premium',
        category: 'camisetas',
        baseModelUrl: 'https://www.pngarts.com/files/1/T-Shirt-PNG-Transparent-Image.png',
        availableColors: JSON.stringify(['white', 'black', 'navy']),
        price: 39.99,
        thumbnailUrl: 'https://www.pngarts.com/files/1/T-Shirt-PNG-Transparent-Image.png',
        description: 'Camiseta premium con mejor calidad de tela',
        active: true,
      },
      {
        name: 'Hoodie Clásico',
        category: 'hoodies',
        baseModelUrl: 'https://www.stick-manufaktur.de/wp-content/uploads/2019/01/Daiber_Hoodies_JN796_ash_front.jpg',
        availableColors: JSON.stringify(['black', 'gray', 'navy', 'burgundy']),
        price: 59.99,
        thumbnailUrl: 'https://www.stick-manufaktur.de/wp-content/uploads/2019/01/Daiber_Hoodies_JN796_ash_front.jpg',
        description: 'Hoodie con capucha y bolsillo frontal',
        active: true,
      },
      {
        name: 'Hoodie Oversize',
        category: 'hoodies',
        baseModelUrl: 'https://www.stick-manufaktur.de/wp-content/uploads/2019/01/Daiber_Hoodies_JN796_ash_front.jpg',
        availableColors: JSON.stringify(['black', 'gray', 'white']),
        price: 69.99,
        thumbnailUrl: 'https://www.stick-manufaktur.de/wp-content/uploads/2019/01/Daiber_Hoodies_JN796_ash_front.jpg',
        description: 'Hoodie con corte oversize moderno',
        active: true,
      },
      {
        name: 'Polo Deportivo',
        category: 'polos',
        baseModelUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBbAudNJ1wI9SLYh0dgyAzY1-esLl4PKpYTw&s',
        availableColors: JSON.stringify(['white', 'black', 'navy', 'red']),
        price: 34.99,
        thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBbAudNJ1wI9SLYh0dgyAzY1-esLl4PKpYTw&s',
        description: 'Polo con cuello y botones, ideal para deportes',
        active: true,
      },
      {
        name: 'Tank Top',
        category: 'tank-tops',
        baseModelUrl: 'https://sicurezza.pe/cdn/shop/files/Tank_Top_Blanco_copia_74a33a06-c6f3-4157-b7b8-1e657a852090.jpg?v=1761421142&width=480',
        availableColors: JSON.stringify(['white', 'black', 'gray']),
        price: 24.99,
        thumbnailUrl: 'https://sicurezza.pe/cdn/shop/files/Tank_Top_Blanco_copia_74a33a06-c6f3-4157-b7b8-1e657a852090.jpg?v=1761421142&width=480',
        description: 'Camiseta sin mangas para clima cálido',
        active: true,
      },
      {
        name: 'Sudadera Crewneck',
        category: 'sudaderas',
        baseModelUrl: 'https://digitalblak.com/cdn/shop/products/db_prendas2020_sudadera_adulto_cuellor_blanco_1800x.jpg?v=1603756392',
        availableColors: JSON.stringify(['gray', 'black', 'navy', 'burgundy']),
        price: 49.99,
        thumbnailUrl: 'https://digitalblak.com/cdn/shop/products/db_prendas2020_sudadera_adulto_cuellor_blanco_1800x.jpg?v=1603756392',
        description: 'Sudadera sin capucha con cuello redondo',
        active: true,
      },
      {
        name: 'Camiseta Manga Larga',
        category: 'camisetas',
        baseModelUrl: 'https://www.pngarts.com/files/1/T-Shirt-PNG-Transparent-Image.png',
        availableColors: JSON.stringify(['white', 'black', 'gray', 'navy']),
        price: 34.99,
        thumbnailUrl: 'https://www.pngarts.com/files/1/T-Shirt-PNG-Transparent-Image.png',
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
