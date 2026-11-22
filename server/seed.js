// Run with:  npm run seed
// Adds 3 demo users and 14 sample items. It clears existing data first.
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Item = require("./models/Item");
const BorrowRequest = require("./models/BorrowRequest");

// Picture helper: loremflickr returns a photo matching the keyword
const pic = (keyword, n) => "https://loremflickr.com/600/400/" + keyword + "?lock=" + n;

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Clearing old data...");
  await BorrowRequest.deleteMany({});
  await Item.deleteMany({});
  await User.deleteMany({});

  const password = User.hashPassword("password123");
  const [asha, rahul, meera] = await User.create([
    { name: "Asha Rao", email: "asha@example.com", password, location: "Indiranagar, Bengaluru" },
    { name: "Rahul Verma", email: "rahul@example.com", password, location: "Koramangala, Bengaluru" },
    { name: "Meera Nair", email: "meera@example.com", password, location: "Jayanagar, Bengaluru" },
  ]);

  await Item.create([
    { name: "Scientific Calculator", category: "Electronics", description: "Casio fx-991EX with 552 functions. Great for engineering exams and lab work.", image: pic("calculator", 1), location: "Indiranagar, Bengaluru", pricePerDay: 10, owner: asha._id },
    { name: "DSLR Camera", category: "Electronics", description: "Canon EOS 1500D with 18-55mm lens, one battery and a 32GB card. Perfect for fests and trips.", image: pic("camera", 2), location: "Koramangala, Bengaluru", pricePerDay: 400, owner: rahul._id },
    { name: "Cricket Bat", category: "Sports Equipment", description: "English willow bat, full size, lightly used. Grip was changed recently.", image: pic("cricket", 3), location: "Jayanagar, Bengaluru", pricePerDay: 80, owner: meera._id },
    { name: "Novel Collection", category: "Books", description: "Set of 8 popular novels including thrillers and classics. Return within a week please.", image: pic("books", 4), location: "Indiranagar, Bengaluru", pricePerDay: 0, owner: asha._id },
    { name: "Bicycle", category: "Sports Equipment", description: "Hero 21-speed mountain bike with a helmet. Good for weekend rides and short commutes.", image: pic("bicycle", 5), location: "Koramangala, Bengaluru", pricePerDay: 150, owner: rahul._id },
    { name: "Laptop Stand", category: "Electronics", description: "Foldable aluminium stand, fits 11 to 17 inch laptops. Helps with long study sessions.", image: pic("laptop", 6), location: "Jayanagar, Bengaluru", pricePerDay: 20, owner: meera._id },
    { name: "Power Drill", category: "Tools", description: "Bosch 500W corded drill with 20 drill bits. Useful for wall hanging and small repairs.", image: pic("drill", 7), location: "Indiranagar, Bengaluru", pricePerDay: 100, owner: asha._id },
    { name: "Football", category: "Sports Equipment", description: "Size 5 Nivia football, well inflated. Free to borrow for college matches.", image: pic("football", 8), location: "Koramangala, Bengaluru", pricePerDay: 0, owner: rahul._id },
    { name: "Headphones", category: "Electronics", description: "Sony over-ear wired headphones with deep bass. Comfortable for long use.", image: pic("headphones", 9), location: "Jayanagar, Bengaluru", pricePerDay: 50, owner: meera._id },
    { name: "Projector", category: "Electronics", description: "Portable HD projector with HDMI cable and a 100 inch screen. Ideal for presentations and movie nights.", image: pic("projector", 10), location: "Indiranagar, Bengaluru", pricePerDay: 500, owner: asha._id },
    { name: "Pressure Cooker", category: "Kitchen Appliances", description: "5 litre stainless steel pressure cooker. Handy when you have guests.", image: pic("cooker", 11), location: "Koramangala, Bengaluru", pricePerDay: 30, owner: rahul._id },
    { name: "Blazer", category: "Clothing", description: "Navy blue formal blazer, size M (40). Good for interviews and presentations.", image: pic("blazer", 12), location: "Jayanagar, Bengaluru", pricePerDay: 120, owner: meera._id },
    { name: "Hand Tool Kit", category: "Tools", description: "Screwdrivers, pliers, hammer, spanner set and measuring tape in one box.", image: pic("tools", 13), location: "Indiranagar, Bengaluru", pricePerDay: 40, owner: asha._id },
    { name: "Badminton Racket Set", category: "Sports Equipment", description: "Two Yonex rackets with three shuttlecocks and a carry bag.", image: pic("badminton", 14), location: "Koramangala, Bengaluru", pricePerDay: 60, owner: rahul._id },
  ]);

  console.log("Done! Added 3 users and 14 items.");
  console.log("Demo login: asha@example.com / password123");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
