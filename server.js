// server.js
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./database'); // database.js sets up SQLite
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public')); // Serve static files (CSS, JS, images)
app.set('view engine', 'ejs');
app.use(session({ secret: 'Saruul1127', resave: false, saveUninitialized: true }));
app.set('views', path.join(__dirname, 'views'));




// Root: redirect based on login
app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.redirect('/dashboard');
});

// Login page
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send('Internal server error');
    }

    if (!user) {
      return res.render('login', { error: 'Invalid login' });
    }

    // Use bcrypt.compare to verify password
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Bcrypt error:', err);
        return res.status(500).send('Internal server error');
      }

      if (!result) {
        // Passwords do not match
        return res.render('login', { error: 'Invalid login' });
      }

      // Password matched, set session and redirect
      req.session.user = { id: user.id, username: user.username };
      res.redirect('/dashboard');
    });
  });
});



// Dashboard: list employees
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  db.all('SELECT * FROM employees ORDER BY Name_MN', [], (err, employees) => {
    if (err) return res.status(500).send('Error retrieving employee data');
    res.render('dashboard', { user: req.session.user, employees });
  });
});

// Add Employee page (form)
app.get('/add-employee', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('add-employee', {
    title: 'Add Employee',
    headerTitle: 'Шинэ ажилтны мэдээлэл',
    fieldNameEN: 'Name', fieldLastNameEN: 'Last Name',
    fieldDepartmentEN: 'Department', fieldOccupationEN: 'Occupation',
    fieldCompanyNameEN: 'Company Name', fieldStreetEN: 'Street',
    fieldPOBoxEN: 'P.O. Box', fieldRegionEN: 'Region',
    fieldCityEN: 'City', fieldPostalEN: 'Postal Code',
    fieldCountryEN: 'Country',
    fieldNameMN: 'Нэр', fieldLastNameMN: 'Овог',
    fieldDepartmentMN: 'Хэлтэс', fieldOccupationMN: 'Албан тушаал',
    fieldCompanyNameMN: 'Байгууллага', fieldStreetMN: 'Гудамж',
    fieldPOBoxMN: 'Шуудангийн хайрцаг', fieldRegionMN: 'Бүс нутаг',
    fieldCityMN: 'Хот', fieldPostalMN: 'Шуудан код',
    fieldCountryMN: 'Улс',
    fieldPhone: 'Утас', fieldEmail: 'Имэйл', fieldWebsite: 'Вэбсайт',
    message: 'Бүх утгыг бүрэн бөглөнө үү.',
    generateQrText: 'ХАДАГЛАХ', downloadText: 'ТАТАХ',
    languageLabel: 'QR хэл солих', englishOption: 'English', mongolianOption: 'Mongolian'
  });
});



// Route to display the edit employee form
app.get('/edit-profile/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const employeeId = req.params.id;
  db.get('SELECT * FROM employees WHERE id = ?', [employeeId], (err, employee) => {
    if (err) {
      console.error('Error fetching employee for edit:', err);
      return res.status(500).send('Error fetching employee data');
    }
    if (!employee) {
      return res.status(404).send('Employee not found');
    }
    res.render('edit-profile', { employee: employee }); // Pass the employee data
  });
});

// Route to handle the form submission for updating employee data
app.post('/edit-employee/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const employeeId = req.params.id;
  const {
    Name_EN, LastName_EN, Department_EN, Occupation_EN, CompanyName_EN,
    Street_EN, POBox_EN, Region_EN, City_EN, Postal_EN, Country_EN,
    Name_MN, LastName_MN, Department_MN, Occupation_MN, CompanyName_MN,
    Street_MN, POBox_MN, Region_MN, City_MN, Postal_MN, Country_MN,
    Phone, Email, Website, qr_data
  } = req.body;

const sql = "UPDATE employees SET " +
  "Name_EN = ?, " +
  "LastName_EN = ?, " +
  "Department_EN = ?, " +
  "Occupation_EN = ?, " +
  "CompanyName_EN = ?, " +
  "Street_EN = ?, " +
  "POBox_EN = ?, " +
  "Region_EN = ?, " +
  "City_EN = ?, " +
  "Postal_EN = ?, " +
  "Country_EN = ?, " +
  "Name_MN = ?, " +
  "LastName_MN = ?, " +
  "Department_MN = ?, " +
  "Occupation_MN = ?, " +
  "CompanyName_MN = ?, " +
  "Street_MN = ?, " +
  "POBox_MN = ?, " +
  "Region_MN = ?, " +
  "City_MN = ?, " +
  "Postal_MN = ?, " +
  "Country_MN = ?, " +
  "Phone = ?, " +
  "Email = ?, " +
  "Website = ?, " +
  "qr_data = ? " +
"WHERE id = ?";

const params = [
  Name_EN, LastName_EN, Department_EN, Occupation_EN, CompanyName_EN,
  Street_EN, POBox_EN, Region_EN, City_EN, Postal_EN, Country_EN,
  Name_MN, LastName_MN, Department_MN, Occupation_MN, CompanyName_MN,
  Street_MN, POBox_MN, Region_MN, City_MN, Postal_MN, Country_MN,
  Phone, Email, Website, qr_data,
  employeeId // The ID to update
];


  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).send('Error updating employee');
    }
    res.redirect('/dashboard'); // Redirect back to the dashboard
  });
});



// API to save employee data
app.post('/api/employee', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const {
    Name_EN, LastName_EN, Department_EN, Occupation_EN, CompanyName_EN,
    Street_EN, POBox_EN, Region_EN, City_EN, Postal_EN, Country_EN,
    Name_MN, LastName_MN, Department_MN, Occupation_MN, CompanyName_MN,
    Street_MN, POBox_MN, Region_MN, City_MN, Postal_MN, Country_MN,
    Phone, Email, Website, qr_data
  } = req.body;

  const sql = `INSERT INTO employees (
    Name_EN, LastName_EN, Department_EN, Occupation_EN, CompanyName_EN,
    Street_EN, POBox_EN, Region_EN, City_EN, Postal_EN, Country_EN,
    Name_MN, LastName_MN, Department_MN, Occupation_MN, CompanyName_MN,
    Street_MN, POBox_MN, Region_MN, City_MN, Postal_MN, Country_MN,
    Phone, Email, Website, qr_data
  ) VALUES (${Array(26).fill('?').join(',')})`; // Ensure this is correct

  const params = [
    Name_EN, LastName_EN, Department_EN, Occupation_EN, CompanyName_EN,
    Street_EN, POBox_EN, Region_EN, City_EN, Postal_EN, Country_EN,
    Name_MN, LastName_MN, Department_MN, Occupation_MN, CompanyName_MN,
    Street_MN, POBox_MN, Region_MN, City_MN, Postal_MN, Country_MN,
    Phone, Email, Website, qr_data
  ];

  console.log("SQL:", sql);
  console.log("Params:", params);

  db.run(sql, params, function (err) {
    console.log("db.run callback called");
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json({ success: true, id: this.lastID });
  });
});

// Employee List
app.get('/employee-list', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  db.all('SELECT * FROM employees', [], (err, employees) => {
    if (err) return res.status(500).send('Error retrieving employee list');
    res.render('employee-list', { employees });
  });
});

// Employee Card
app.get('/card/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const id = req.params.id;
  // Include qr_data in the select query
  db.get('SELECT *, qr_data FROM employees WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error("Error fetching employee card:", err);
      return res.status(500).send('Database error');
    }
    if (!row) return res.status(404).send('Employee not found');
    // Pass the entire row (which now includes qr_data) to the template
    res.render('card', { employee: row });
  });
});

// Route to handle deleting an employee
app.get('/delete-employee/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const employeeId = req.params.id;
  db.run('DELETE FROM employees WHERE id = ?', [employeeId], function (err) {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).send('Error deleting employee');
    }
    console.log(`Employee with ID ${employeeId} deleted.`);
    res.redirect('/dashboard'); // Redirect back to the dashboard after deletion
  });
});



const QRCode = require('qrcode');

app.post('/generate-qr/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const id = req.params.id;
  const { language } = req.body; // Accept language

  db.get('SELECT * FROM employees WHERE id = ?', [id], (err, employee) => {
    if (err || !employee) return res.status(404).send('Employee not found');

    const getValue = key => employee[key] || "";

    const vcard = language === 'MN' ? [
      "BEGIN:VCARD", "VERSION:3.0",
      `N;CHARSET=UTF-8:${getValue("LastName_MN")};${getValue("Name_MN")}`,
      `FN;CHARSET=UTF-8:${getValue("Name_MN")} ${getValue("LastName_MN")}`,
      `ORG;CHARSET=UTF-8:${getValue("CompanyName_MN")};${getValue("Department_MN")}`,
      `TITLE;CHARSET=UTF-8:${getValue("Occupation_MN")}`,
      `ADR;TYPE=WORK;CHARSET=UTF-8:${getValue("POBox_MN")};;${getValue("Street_MN")};${getValue("City_MN")};${getValue("Region_MN")};${getValue("Postal_MN")};${getValue("Country_MN")}`,
      `TEL;TYPE=CELL:${getValue("Phone")}`,
      `EMAIL;TYPE=INTERNET:${getValue("Email")}`,
      `URL:${getValue("Website")}`,
      "END:VCARD"
    ].join("\r\n") : [
      "BEGIN:VCARD", "VERSION:3.0",
      `N:${getValue("LastName_EN")};${getValue("Name_EN")}`,
      `FN:${getValue("Name_EN")} ${getValue("LastName_EN")}`,
      `ORG:${getValue("CompanyName_EN")};${getValue("Department_EN")}`,
      `TITLE:${getValue("Occupation_EN")}`,
      `ADR;TYPE=WORK:${getValue("POBox_EN")};;${getValue("Street_EN")};${getValue("City_EN")};${getValue("Region_EN")};${getValue("Postal_EN")};${getValue("Country_EN")}`,
      `TEL;TYPE=CELL:${getValue("Phone")}`,
      `EMAIL;TYPE=INTERNET:${getValue("Email")}`,
      `URL:${getValue("Website")}`,
      "END:VCARD"
    ].join("\r\n");

    QRCode.toDataURL(vcard, { errorCorrectionLevel: 'H' }, (err, qrDataUrl) => {
      if (err) {
        console.error("QR Code generation error:", err);
        return res.status(500).send("Failed to generate QR code");
      }
      res.json({ qrUrl: qrDataUrl });
    });
  });
});



// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout failed');
    res.redirect('/login');
  });
});

// vCard generator template
// app.get('/generate', (req, res) => {
//   if (!req.session.user) return res.redirect('/login');
//   res.render('yourTemplate', {
//     title: 'vCard Generator', headerTitle: 'VCard', sectionTitle: 'Ажилтаны мэдээлэл',
//     fieldNameEN: 'Name', fieldLastNameEN: 'Last Name', message: 'Бүх утгыг бүрэн бөглөнө үү.',
//     generateQrText: 'ХАДАГЛАХ', downloadText: 'ТАТАХ', languageLabel: 'QR хэл солих',
//     englishOption: 'English', mongolianOption: 'Mongolian'
//   });
// });

// Start server
app.listen(port, () => console.log(`App running at http://localhost:${port}`));
