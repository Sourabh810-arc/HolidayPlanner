import mongoose from 'mongoose';
import { Hotel } from '../models/Hotel.js';
import { Activity } from '../models/Activity.js';
import { TouristPlace } from '../models/TouristPlace.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/holiday-planne');
    
    // Clear existing data
    await Hotel.deleteMany({});
    await Activity.deleteMany({});
    await TouristPlace.deleteMany({});

    // Seed Hotels
    const hotels = await Hotel.insertMany([
      // Mumbai Hotels
      { name: "Budget Inn Mumbai", city: "Mumbai", price: 2000, rating: 3.5, stars: 2, location: "Andheri", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400" },
      { name: "Comfort Stay", city: "Mumbai", price: 3500, rating: 4.0, stars: 3, location: "Bandra", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" },
      { name: "City Plaza Hotel", city: "Mumbai", price: 5000, rating: 4.5, stars: 4, location: "Colaba", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400" },
      { name: "Grand Mumbai Resort", city: "Mumbai", price: 8000, rating: 4.8, stars: 5, location: "Juhu", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400" },
      // Delhi Hotels
      { name: "Delhi Budget Lodge", city: "Delhi", price: 1800, rating: 3.3, stars: 2, location: "Karol Bagh", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400" },
      { name: "Capital Inn", city: "Delhi", price: 3000, rating: 4.0, stars: 3, location: "Connaught Place", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400" },
      { name: "Heritage Delhi Hotel", city: "Delhi", price: 6000, rating: 4.6, stars: 4, location: "Chanakyapuri", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400" },
      { name: "Luxury Palace Delhi", city: "Delhi", price: 10000, rating: 4.9, stars: 5, location: "Aerocity", image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=400" },
      // Bangalore Hotels
      { name: "Tech City Lodge", city: "Bangalore", price: 2200, rating: 3.7, stars: 2, location: "Electronic City", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400" },
      { name: "Garden View Hotel", city: "Bangalore", price: 3800, rating: 4.2, stars: 3, location: "MG Road", image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=400" },
      { name: "Silicon Valley Resort", city: "Bangalore", price: 5500, rating: 4.5, stars: 4, location: "Whitefield", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400" },
      { name: "Premium Bangalore Stay", city: "Bangalore", price: 7500, rating: 4.7, stars: 5, location: "Indiranagar", image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400" },
      // Goa Hotels
      { name: "Beach Budget Hut", city: "Goa", price: 1500, rating: 3.5, stars: 2, location: "Calangute", image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400" },
      { name: "Coastal Comfort Inn", city: "Goa", price: 3200, rating: 4.1, stars: 3, location: "Baga", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400" },
      { name: "Ocean View Resort", city: "Goa", price: 6500, rating: 4.6, stars: 4, location: "Candolim", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400" },
      { name: "Luxury Beach Villa", city: "Goa", price: 12000, rating: 4.9, stars: 5, location: "Anjuna", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400" },
    ]);

    // Seed Activities
    const activities = await Activity.insertMany([
      // Mumbai Activities
      { name: "Paragliding", city: "Mumbai", emoji: "🪂", pricePerPerson: 2500, tag: "Extreme", description: "Soar over the Western Ghats near Kamshet" },
      { name: "Surfing", city: "Mumbai", emoji: "🏄", pricePerPerson: 1200, tag: "Water", description: "Beginner lessons at Manori or Gorai beach" },
      { name: "Jet Skiing", city: "Mumbai", emoji: "🚤", pricePerPerson: 800, tag: "Water", description: "15-min ride at Juhu or Aksa beach" },
      { name: "Dolphin Watching", city: "Mumbai", emoji: "🐬", pricePerPerson: 1500, tag: "Nature", description: "Boat tour from Gateway of India" },
      // Delhi Activities
      { name: "Paragliding", city: "Delhi", emoji: "🪂", pricePerPerson: 3500, tag: "Extreme", description: "Tandem flights at Bir Billing" },
      { name: "Archery", city: "Delhi", emoji: "🏹", pricePerPerson: 500, tag: "Sport", description: "Coaching session at Delhi Archery Academy" },
      // Bangalore Activities
      { name: "Skydiving", city: "Bangalore", emoji: "🪂", pricePerPerson: 25000, tag: "Extreme", description: "Tandem jump over Devanahalli" },
      { name: "White-water Rafting", city: "Bangalore", emoji: "🏊", pricePerPerson: 1500, tag: "Water", description: "Class 3 rapids on River Cauvery, Coorg" },
      // Goa Activities
      { name: "Surfing", city: "Goa", emoji: "🏄", pricePerPerson: 1000, tag: "Water", description: "1-hr beginner lesson at Ashwem beach" },
      { name: "Scuba Diving", city: "Goa", emoji: "🤿", pricePerPerson: 3500, tag: "Water", description: "Discover dive at Grande Island" },
    ]);

    // Seed Tourist Places
    const places = await TouristPlace.insertMany([
      // Mumbai
      { name: "Gateway of India", city: "Mumbai", type: "Monument", image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=300" },
      { name: "Marine Drive", city: "Mumbai", type: "Scenic", image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=300" },
      // Delhi
      { name: "India Gate", city: "Delhi", type: "Monument", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300" },
      { name: "Red Fort", city: "Delhi", type: "Historical", image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=300" },
      // Bangalore
      { name: "Lalbagh Gardens", city: "Bangalore", type: "Park", image: "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=300" },
      { name: "Bangalore Palace", city: "Bangalore", type: "Historical", image: "https://images.unsplash.com/photo-1582632842672-da5bc18e5ddf?w=300" },
      // Goa
      { name: "Baga Beach", city: "Goa", type: "Beach", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300" },
      { name: "Basilica of Bom Jesus", city: "Goa", type: "Religious", image: "https://images.unsplash.com/photo-1590076215667-875d4c1a9c92?w=300" },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`✓ ${hotels.length} hotels added`);
    console.log(`✓ ${activities.length} activities added`);
    console.log(`✓ ${places.length} tourist places added`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
