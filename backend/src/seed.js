import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { Admin } from './models/Admin.js';
import { Category } from './models/Category.js';
import { Food } from './models/Food.js';
import { Order } from './models/Order.js';
import { hashPassword } from './utils/password.js';
import { ORDER_STATUS } from './constants/orderStatus.js';

export const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Admin
  const adminEmail = 'admin@fooddelivery.com';
  let admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    const passwordHash = await hashPassword('Admin@123456');
    admin = await Admin.create({
      email: adminEmail,
      passwordHash,
      name: 'Restaurant Administrator',
    });
    console.log(`✅ Seeded Admin: ${adminEmail} (Password: Admin@123456)`);
  } else {
    console.log(`ℹ️ Admin ${adminEmail} already exists.`);
  }

  // 2. Seed Categories
  const categoryCount = await Category.countDocuments();
  let categories = [];
  if (categoryCount === 0) {
    categories = await Category.insertMany([
      {
        name: 'Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Sushi',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Pasta',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'Desserts',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'Beverages',
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
        sortOrder: 6,
        isActive: true,
      },
    ]);
    console.log(`✅ Seeded ${categories.length} Categories.`);
  } else {
    categories = await Category.find();
    console.log(`ℹ️ Categories already seeded (${categories.length} found).`);
  }

  // 3. Seed Foods
  const foodCount = await Food.countDocuments();
  if (foodCount === 0 && categories.length > 0) {
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});

    const foodsData = [
      {
        categoryId: categoryMap['Burgers'],
        name: 'Truffle Angus Burger',
        description: 'Prime black angus beef patty, black truffle aioli, aged cheddar, caramelized onions, brioche bun.',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
      },
      {
        categoryId: categoryMap['Burgers'],
        name: 'Smoky BBQ Bacon Burger',
        description: 'Crispy applewood bacon, smoked gouda, house BBQ sauce, crisp lettuce, tomato.',
        price: 14.5,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
      },
      {
        categoryId: categoryMap['Pizza'],
        name: 'Artisan Margherita Pizza',
        description: 'San Marzano tomato sauce, fresh buffalo mozzarella, fragrant basil leaves, extra virgin olive oil.',
        price: 18.0,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
      },
      {
        categoryId: categoryMap['Pizza'],
        name: 'Spicy Diavola Pizza',
        description: 'Calabrian spicy salami, mozzarella, chili honey drizzle, fresh oregano.',
        price: 19.5,
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
      },
      {
        categoryId: categoryMap['Sushi'],
        name: 'Salmon & Avocado Dragon Roll',
        description: 'Fresh Norwegian salmon, creamy avocado, cucumber, tobiko, unagi glaze.',
        price: 21.0,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
      },
      {
        categoryId: categoryMap['Pasta'],
        name: 'Creamy Truffle Tagliatelle',
        description: 'Handmade fresh egg pasta, wild forest mushrooms, parmigiano reggiano, white truffle emulsion.',
        price: 22.5,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
      },
      {
        categoryId: categoryMap['Desserts'],
        name: 'Classic Venetian Tiramisu',
        description: 'Savoiardi ladyfingers soaked in espresso, mascarpone cream, dark cocoa dust.',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
      },
      {
        categoryId: categoryMap['Beverages'],
        name: 'Cold Pressed Hibiscus Lemonade',
        description: 'Organic hibiscus flowers, freshly squeezed Meyer lemons, pure cane sugar.',
        price: 5.5,
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        isAvailable: true,
      },
    ];

    const seededFoods = await Food.insertMany(foodsData);
    console.log(`✅ Seeded ${seededFoods.length} Food items.`);
  } else {
    console.log(`ℹ️ Foods already seeded (${foodCount} found).`);
  }

  console.log('✨ Seeding complete!');
};

// If run directly via CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    try {
      await connectDatabase();
      await seedDatabase();
    } catch (err) {
      console.error('❌ Seeding failed:', err);
    } finally {
      await disconnectDatabase();
      process.exit(0);
    }
  })();
}
