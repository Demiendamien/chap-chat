// import { config } from "dotenv";
// import { connectDB } from "../lib/db.js";
// import { User } from "../models/user.model.js";

// config();
// const seedUsers = [
//   {
//     username: "john_doe",
//     email: "john@example.com",
//     password: "123456",
//   },
//   {
//     username: "jane_smith",
//     email: "jane@example.com",
//     password: "123456",
//   },
//   {
//     username: "jane_smith",
//     email: "smith@example.com",
//     password: "123456",
//   },
//   {
//     username: "alice_wonder",
//     email: "alice@example.com",
//     password: "123456",
//   },
//   {
//     username: "bob_builder",
//     email: "bob@example.com",
//     password: "123456",
//   },
// ];



// const seedDataBase = async () => {
//   try {
//     await connectDB();

//     await User.insertMany(seedUsers);
//     console.log("Database seeded successfully");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   }
// };

// seedDataBase();
