import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { Admin } from './models/Admin.js';
import { Category } from './models/Category.js';
import { Food } from './models/Food.js';
import { Order } from './models/Order.js';
import { hashPassword } from './utils/password.js';

export const seedDatabase = async () => {
  console.log('🌱 Starting comprehensive database seeding...');

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

  // 2. Categories Data (12 Categories)
  const categoriesList = [
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
      name: 'Tacos',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
      sortOrder: 5,
      isActive: true,
    },
    {
      name: 'Ramen & Noodles',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      sortOrder: 6,
      isActive: true,
    },
    {
      name: 'Steaks & BBQ',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      sortOrder: 7,
      isActive: true,
    },
    {
      name: 'Breakfast & Brunch',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
      sortOrder: 8,
      isActive: true,
    },
    {
      name: 'Salads & Bowls',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      sortOrder: 9,
      isActive: true,
    },
    {
      name: 'Appetizers & Sides',
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
      sortOrder: 10,
      isActive: true,
    },
    {
      name: 'Desserts',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
      sortOrder: 11,
      isActive: true,
    },
    {
      name: 'Beverages',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
      sortOrder: 12,
      isActive: true,
    },
  ];

  for (const cat of categoriesList) {
    await Category.findOneAndUpdate(
      { name: cat.name },
      { $set: cat },
      { upsert: true, new: true }
    );
  }

  const allCategories = await Category.find();
  const categoryMap = allCategories.reduce((acc, cat) => {
    acc[cat.name] = cat._id;
    return acc;
  }, {});

  console.log(`✅ Verified ${allCategories.length} Categories.`);

  // 3. Gourmet Foods Data (50+ Items)
  const fullFoodsCatalog = [
    // ==========================================
    // 🍔 BURGERS
    // ==========================================
    {
      categoryId: categoryMap['Burgers'],
      name: 'Truffle Angus Burger',
      description: 'Prime black angus beef patty, black truffle aioli, aged sharp cheddar, caramelized shallots on toasted brioche.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Burgers'],
      name: 'Smoky BBQ Bacon Burger',
      description: 'Crispy applewood bacon, smoked gouda, house chipotle BBQ glaze, crisp butter lettuce, beefsteak tomato.',
      price: 14.5,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Burgers'],
      name: 'Crispy Buttermilk Chicken Burger',
      description: '24hr brined organic fried chicken breast, spicy honey mustard slaw, house pickles, toasted brioche.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Burgers'],
      name: 'Double Smashed Cheese Burger',
      description: 'Two seared smash patties, double American cheese, grilled sweet onions, secret burger sauce.',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Burgers'],
      name: 'Portobello Mushroom Swiss Burger',
      description: 'Charbroiled beef patty, balsamic-glazed sautéed Portobello mushrooms, melted Swiss cheese, herb garlic aioli.',
      price: 15.5,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Burgers'],
      name: 'Spicy Firehouse Jalapeño Burger',
      description: 'Angus patty topped with charred jalapeños, pepper jack cheese, crispy onion strings, and sriracha habanero mayo.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🍕 PIZZA
    // ==========================================
    {
      categoryId: categoryMap['Pizza'],
      name: 'Artisan Margherita Pizza',
      description: 'San Marzano DOP tomato sauce, fresh buffalo mozzarella, fragrant basil leaves, extra virgin olive oil.',
      price: 18.0,
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Pizza'],
      name: 'Spicy Diavola Pizza',
      description: 'Calabrian spicy salami, fior di latte mozzarella, hot chili honey drizzle, fresh oregano.',
      price: 19.5,
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Pizza'],
      name: 'Quattro Formaggi with Truffle Honey',
      description: 'Gorgonzola dolce, fontina, parmigiano reggiano, fresh mozzarella, warm wildflower truffle honey.',
      price: 21.0,
      image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Pizza'],
      name: 'Burrata & Prosciutto di Parma',
      description: '24-month aged Prosciutto di Parma, whole fresh pugliese burrata, wild baby arugula, shaved parmesan.',
      price: 23.5,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Pizza'],
      name: 'Truffle Wild Mushroom Pizza',
      description: 'Roasted cremini & shiitake mushrooms, creamy mascarpone base, thyme, shaved pecorino, white truffle oil.',
      price: 22.0,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Pizza'],
      name: 'Smoked BBQ Chicken Pizza',
      description: 'Slow-smoked pulled chicken, smoky bourbon BBQ sauce, red onions, smoked provolone, cilantro.',
      price: 20.0,
      image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🍣 SUSHI
    // ==========================================
    {
      categoryId: categoryMap['Sushi'],
      name: 'Salmon & Avocado Dragon Roll',
      description: 'Fresh Norwegian salmon, creamy hass avocado, English cucumber, orange tobiko, unagi reduction glaze.',
      price: 21.0,
      image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Sushi'],
      name: 'Spicy Bluefin Tuna Roll',
      description: 'Sashimi-grade bluefin tuna, house sriracha chili aioli, chopped scallions, toasted sesame seeds.',
      price: 19.0,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Sushi'],
      name: 'Crispy Tempura Tiger Roll',
      description: 'Jumbo black tiger prawn tempura, asparagus, avocado, sweet teriyaki reduction, crisp panko flakes.',
      price: 18.5,
      image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Sushi'],
      name: 'Deluxe Sashimi Selection (12 pcs)',
      description: 'Chef selected slices of King Salmon, Yellowtail Hamachi, Bigeye Tuna, and Hokkaido Scallop.',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Sushi'],
      name: 'Rainbow Specialty Roll',
      description: 'California crab roll draped with fresh yellowfin tuna, salmon, yellowtail, avocado, and citrus ponzu.',
      price: 22.5,
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Sushi'],
      name: 'Crispy Volcano Scallop Roll',
      description: 'Crab and avocado roll baked with fresh chopped scallops, spicy masago sauce, and scallion crunch.',
      price: 23.0,
      image: 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🍝 PASTA
    // ==========================================
    {
      categoryId: categoryMap['Pasta'],
      name: 'Creamy Truffle Tagliatelle',
      description: 'Handmade fresh egg pasta, wild forest mushrooms, parmigiano reggiano 24-month, white truffle emulsion.',
      price: 22.5,
      image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Pasta'],
      name: 'Rigatoni all’Amatriciana',
      description: 'Slow-braised crispy Guanciale, San Marzano tomato reduction, cracked black pepper, aged Pecorino Romano.',
      price: 19.0,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Pasta'],
      name: 'Wild Lobster & Ricotta Ravioli',
      description: 'Handmade ravioli stuffed with Maine lobster and creamy ricotta in a velvety saffron bisque reduction.',
      price: 26.0,
      image: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Pasta'],
      name: 'Seafood Linguine Pescatore',
      description: 'Jumbo prawns, Manila clams, PEI mussels, and calamari tossed in white wine, garlic, and cherry tomato sauce.',
      price: 25.5,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Pasta'],
      name: 'Gnocchi alla Sorrentina',
      description: 'Handmade potato gnocchi baked in bubbling San Marzano tomato sauce with melted fior di latte and fresh basil.',
      price: 18.0,
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🌮 TACOS
    // ==========================================
    {
      categoryId: categoryMap['Tacos'],
      name: 'Birria Beef Tacos (3 pcs)',
      description: 'Slow-braised beef shank, melted Oaxaca cheese, cilantro, white onion, rich savory consommé broth for dipping.',
      price: 16.5,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Tacos'],
      name: 'Baja Crispy Fish Tacos (3 pcs)',
      description: 'Crispy beer-battered cod, chipotle lime crema, shaved red cabbage, pico de gallo on warm corn tortillas.',
      price: 15.0,
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Tacos'],
      name: 'Al Pastor Pork Tacos (3 pcs)',
      description: 'Achiote-marinated roasted pork, charred pineapple slices, cilantro, diced white onion, salsa verde.',
      price: 14.5,
      image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Tacos'],
      name: 'Pollo Asado Citrus Tacos (3 pcs)',
      description: 'Char-grilled citrus-marinated chicken, avocado crema, pickled red onions, cotija cheese, fresh lime.',
      price: 14.0,
      image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Tacos'],
      name: 'Crispy Avocado & Black Bean Tacos (3 pcs)',
      description: 'Panko crusted avocado wedges, spiced black bean purée, roasted corn salsa, vegan chipotle drizzle.',
      price: 13.5,
      image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🍜 RAMEN & NOODLES
    // ==========================================
    {
      categoryId: categoryMap['Ramen & Noodles'],
      name: 'Tonkotsu Chashu Ramen',
      description: 'Rich 16-hour pork bone broth, tender braised pork belly chashu, ajitsuke tamago egg, black garlic oil, nori.',
      price: 17.5,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Ramen & Noodles'],
      name: 'Spicy Hokkaido Miso Ramen',
      description: 'Red miso broth infused with chili oil, minced pork, sweet butter corn, bamboo shoots, soft molten egg.',
      price: 18.0,
      image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Ramen & Noodles'],
      name: 'Tiger Prawn Pad Thai',
      description: 'Stir-fried rice noodles with colossal black tiger prawns, crushed peanuts, tamarind glaze, crispy shallots, bean sprouts.',
      price: 18.5,
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Ramen & Noodles'],
      name: 'Singapore Golden Curry Rice Noodles',
      description: 'Wok-tossed vermicelli noodles with roasted barbecue chicken, shrimp, bell peppers, madras curry spices.',
      price: 16.5,
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Ramen & Noodles'],
      name: 'Vegan Shoyu Truffle Mushroom Ramen',
      description: 'Fragrant mushroom and kelp dashi broth, grilled king oyster mushrooms, baby bok choy, white truffle aroma.',
      price: 17.0,
      image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🥩 STEAKS & BBQ
    // ==========================================
    {
      categoryId: categoryMap['Steaks & BBQ'],
      name: 'Prime Black Angus Ribeye (12oz)',
      description: 'Char-grilled prime ribeye steak basted in garlic rosemary butter, served with roasted bone marrow and chimichurri.',
      price: 34.0,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Steaks & BBQ'],
      name: 'Texas Smoked Beef Brisket Platter',
      description: '14-hour hickory-smoked beef brisket, bourbon molasses BBQ sauce, creamy coleslaw, honey cornbread.',
      price: 24.5,
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Steaks & BBQ'],
      name: 'Glazed BBQ Baby Back Ribs (Half Rack)',
      description: 'Fall-off-the-bone tender pork baby back ribs basted in sticky smoky chipotle glaze, served with seasoned fries.',
      price: 22.0,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Steaks & BBQ'],
      name: 'Grilled Chimichurri Skirt Steak',
      description: 'Marinated grass-fed skirt steak seared pink, served over roasted garlic fingerling potatoes and herb chimichurri.',
      price: 27.5,
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🍳 BREAKFAST & BRUNCH
    // ==========================================
    {
      categoryId: categoryMap['Breakfast & Brunch'],
      name: 'Smoked Salmon Benedict',
      description: 'Poached free-range organic eggs, cured Atlantic smoked salmon, velvety citrus hollandaise on toasted English muffin.',
      price: 16.5,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Breakfast & Brunch'],
      name: 'Fluffy Blueberry Buttermilk Pancakes',
      description: 'Stack of three golden fluffy pancakes studded with Maine blueberries, whipped mascarpone, pure Quebec maple syrup.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Breakfast & Brunch'],
      name: 'Avocado Tartine with Poached Eggs',
      description: 'Toasted artisan sourdough, smashed hass avocado, chili flakes, shaved radishes, microgreens, two soft poached eggs.',
      price: 14.5,
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Breakfast & Brunch'],
      name: 'Acai Superfood Energy Bowl',
      description: 'Organic pure acai puree, fresh strawberries, wild blueberries, banana slices, house granola, toasted coconut, chia seeds.',
      price: 12.5,
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Breakfast & Brunch'],
      name: 'Brioche French Toast with Berries',
      description: 'Thick sliced egg-dipped brioche, vanilla bean custard, cinnamon butter, fresh organic berries, powdered sugar.',
      price: 14.0,
      image: 'https://images.unsplash.com/photo-1484723091739-004a8c52766b?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🥗 SALADS & BOWLS
    // ==========================================
    {
      categoryId: categoryMap['Salads & Bowls'],
      name: 'Grilled Salmon Poke Bowl',
      description: 'Sashimi-grade salmon, warm sushi rice, edamame, seaweed salad, diced mango, sesame soy vinaigrette.',
      price: 18.5,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Salads & Bowls'],
      name: 'Mediterranean Burrata & Fig Salad',
      description: 'Creamy burrata, ripe mission figs, baby arugula, heirloom tomatoes, pine nuts, 12yr aged Modena balsamic glaze.',
      price: 15.5,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Salads & Bowls'],
      name: 'Organic Grilled Chicken Caesar',
      description: 'Crisp romaine hearts, herb-marinated grilled chicken breast, garlic sourdough croutons, shaved parmigiano, house Caesar dressing.',
      price: 15.0,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Salads & Bowls'],
      name: 'Roasted Beet & Goat Cheese Bowl',
      description: 'Baby spinach, golden and red roasted beets, candied walnuts, creamy chèvre goat cheese, honey dijon vinaigrette.',
      price: 14.5,
      image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Salads & Bowls'],
      name: 'Crispy Tofu & Quinoa Buddha Bowl',
      description: 'Organic tri-color quinoa, sesame-glazed crispy tofu, roasted sweet potatoes, shredded red cabbage, ginger tahini dressing.',
      price: 14.0,
      image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🍟 APPETIZERS & SIDES
    // ==========================================
    {
      categoryId: categoryMap['Appetizers & Sides'],
      name: 'Truffle Parmesan Hand-Cut Fries',
      description: 'Crispy double-cooked russet potatoes tossed with black truffle oil, fresh rosemary, and grated parmigiano reggiano.',
      price: 8.5,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Appetizers & Sides'],
      name: 'Crispy Salt & Pepper Calamari',
      description: 'Flash-fried tender squid dusted with sea salt and cracked Szechuan pepper, served with spicy yuzu garlic aioli.',
      price: 13.5,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Appetizers & Sides'],
      name: 'Glazed Buffalo Wings (8 pcs)',
      description: 'Crispy jumbo chicken wings tossed in tangy cayenne butter sauce, served with Gorgonzola blue cheese dip and celery.',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Appetizers & Sides'],
      name: 'Loaded Guacamole & Tortilla Chips',
      description: 'Hass avocados mashed fresh with lime juice, diced jalapeños, cilantro, cotija cheese, served with warm corn chips.',
      price: 9.5,
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Appetizers & Sides'],
      name: 'Artisanal Garlic Herb Focaccia',
      description: 'Freshly baked Ligurian rosemary focaccia brushed with roasted garlic extra virgin olive oil and flaky Maldon sea salt.',
      price: 7.0,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Appetizers & Sides'],
      name: 'Golden Mac & Cheese Bites (6 pcs)',
      description: 'Crispy panko-breaded bites stuffed with four-cheese macaroni and smoked bacon, served with spicy ranch.',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🍰 DESSERTS
    // ==========================================
    {
      categoryId: categoryMap['Desserts'],
      name: 'Classic Venetian Tiramisu',
      description: 'Savoiardi ladyfingers soaked in dark roast espresso and Marsala, layered with mascarpone cream and Valrhona cocoa.',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Desserts'],
      name: 'Molten Dark Chocolate Lava Cake',
      description: 'Warm Valrhona dark chocolate cake with a molten liquid center, served with Madagascar vanilla bean gelato.',
      price: 9.5,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Desserts'],
      name: 'Pistachio Sicilian Cannoli (2 pcs)',
      description: 'Crisp golden pastry shells filled with sweetened ricotta cream, dipped in Bronte pistachio crumbles.',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Desserts'],
      name: 'New York Cheesecake with Berry Compote',
      description: 'Velvety rich cream cheese cake on a buttery graham cracker crust, topped with tart wild berry reduction.',
      price: 8.5,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Desserts'],
      name: 'Warm Cinnamon Apple Crisp',
      description: 'Caramelized Honeycrisp apples baked under a brown sugar oat streusel, served with salted caramel drizzle and vanilla cream.',
      price: 8.5,
      image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Desserts'],
      name: 'Dulce de Leche Churros (4 pcs)',
      description: 'Warm crispy Spanish churros dusted with cinnamon sugar, served with warm dulce de leche and chocolate dip.',
      price: 7.5,
      image: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },

    // ==========================================
    // 🍹 BEVERAGES
    // ==========================================
    {
      categoryId: categoryMap['Beverages'],
      name: 'Cold Pressed Hibiscus Lemonade',
      description: 'Organic hibiscus flower infusion, freshly squeezed Meyer lemons, pure cane sugar, fresh mint.',
      price: 5.5,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Beverages'],
      name: 'Iced Ceremonial Matcha Latte',
      description: 'Uji ceremonial grade Japanese matcha whisked with creamy oat milk and Madagascar vanilla bean syrup.',
      price: 6.5,
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Beverages'],
      name: 'Passion Fruit Sparkling Cooler',
      description: 'Real passion fruit pulp, sparkling San Pellegrino mineral water, fresh mint leaves, lime wedge.',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Beverages'],
      name: 'Vanilla Cold Brew Nitro Coffee',
      description: 'Steeped for 20 hours, infused with nitrogen for a silky micro-foam head, sweet bourbon vanilla cream.',
      price: 5.75,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Beverages'],
      name: 'Fresh Detox Green Juice',
      description: 'Cold-pressed organic green apple, cucumber, celery, baby spinach, ginger root, and lemon juice.',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
    {
      categoryId: categoryMap['Beverages'],
      name: 'Mango Dragonfruit Sparkling Refresher',
      description: 'Sweet tropical Alphonso mango puree, vivid red dragonfruit pieces, coconut water, sparkling fizz.',
      price: 6.25,
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    },
  ];

  for (const food of fullFoodsCatalog) {
    if (food.categoryId) {
      await Food.findOneAndUpdate(
        { name: food.name },
        { $set: food },
        { upsert: true, new: true }
      );
    }
  }

  const finalFoodCount = await Food.countDocuments();
  console.log(`✅ Seeded and verified ${finalFoodCount} Gourmet Food items across ${allCategories.length} categories.`);
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
