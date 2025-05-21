const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/employees.db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

db.serialize(() => {
  // Create employees table
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        -- English fields
        Name_EN TEXT,
        LastName_EN TEXT,
        Department_EN TEXT,
        Occupation_EN TEXT,
        CompanyName_EN TEXT,
        Street_EN TEXT,
        POBox_EN TEXT,
        Region_EN TEXT,
        City_EN TEXT,
        Postal_EN TEXT,
        Country_EN TEXT,

        -- Mongolian fields
        Name_MN TEXT,
        LastName_MN TEXT,
        Department_MN TEXT,
        Occupation_MN TEXT,
        CompanyName_MN TEXT,
        Street_MN TEXT,
        POBox_MN TEXT,
        Region_MN TEXT,
        City_MN TEXT,
        Postal_MN TEXT,
        Country_MN TEXT,

        -- Common fields
        Phone TEXT,
        Email TEXT,
        Website TEXT,
        qr_data TEXT
    )
  `);

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.get("SELECT * FROM users WHERE username = ?", ['admin'], (err, row) => {
    if (err) {
      console.error("Error checking for admin user:", err);
    } else if (!row) {
      console.log("Admin user not found. Creating default admin...");
      // Hash the default password '123'
      bcrypt.hash('123', saltRounds, (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return;
        }
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', hash], (err) => {
          if (err) {
            console.error("Error inserting default admin:", err);
          } else {
            console.log("Default admin user created with hashed password.");
          }
        });
      });
    } else {
      console.log("Admin user already exists.");
    }
  });
});

module.exports = db;
