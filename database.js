// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/employees.db');

// Create table if it doesn't exist
db.serialize(() => {
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
});

module.exports = db;
