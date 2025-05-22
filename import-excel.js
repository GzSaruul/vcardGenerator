const xlsx = require('xlsx');
const sqlite3 = require('sqlite3').verbose();

// Specify the path to your Excel file and SQLite database
const excelFilePath = './employees.xlsx'; // Path to your Excel file
// Path to your SQLite database file
const dbFilePath = './data/employees.db';
// Create a new SQLite database or connect to an existing one

// Connect to the SQLite database
const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {s
        console.error('Failed to connect to the database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

// Function to insert employee data
function insertEmployee(employee) {
    const { Name_EN, LastName_EN, Department_EN, Occupation_EN, CompanyName_EN, Street_EN, POBox_EN, Region_EN, City_EN,
        Postal_EN, Country_EN, Name_MN, LastName_MN, Department_MN, Occupation_MN, CompanyName_MN, Street_MN, POBox_MN, Region_MN,
        City_MN, Postal_MN, Country_MN, Phone, Email, Website, qr_data } = employee;
    // ... rest of the function
    const sql = `INSERT INTO employees (Name_EN, LastName_EN, Department_EN, Occupation_EN, CompanyName_EN, Street_EN, POBox_EN,
    Region_EN, City_EN, Postal_EN, Country_EN, Name_MN, LastName_MN, Department_MN, Occupation_MN, CompanyName_MN, Street_MN, POBox_MN,
    Region_MN, City_MN, Postal_MN, Country_MN, Phone, Email, Website, qr_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [Name_EN, LastName_EN, Department_EN, Occupation_EN, CompanyName_EN, Street_EN, POBox_EN, Region_EN, City_EN, 
        Postal_EN, Country_EN, Name_MN, LastName_MN, Department_MN, Occupation_MN, CompanyName_MN, Street_MN, POBox_MN, Region_MN, 
        City_MN, Postal_MN, Country_MN, Phone, Email, Website, ''], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Inserted employee: ${Name_MN} ${LastName_MN} (ID: ${this.lastID})`);
    });
}

// Read the Excel file
const workbook = xlsx.readFile(excelFilePath);

// Assuming your employee data is in the first sheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to an array of JSON objects (one object per row)
const employeesData = xlsx.utils.sheet_to_json(worksheet);

// Iterate through the data and insert into the database
db.serialize(() => { // Serialize ensures operations happen in order
    employeesData.forEach(employee => {
        insertEmployee(employee);
    });

    // Close the database connection after all insertions
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Closed the database connection.');
    });
});