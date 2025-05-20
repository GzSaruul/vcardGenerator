// functions.js
// Ensure you have corresponding CSS for .data__message--success and .data__message--error
// e.g.:
// .data__message--success { color: green; /* or your theme's success color */ }
// .data__message--error { color: red; /* or your theme's error color */ }

const $data = Array.from(document.querySelectorAll(".data__input"));
const $languageSelect  = document.getElementById("languageSelect");
const $qrContainer     = document.getElementById("qr");
const $buttonGenerate  = document.getElementById("generateQr");
const $buttonDownload  = document.getElementById("download");
// const $options         = document.querySelectorAll("select[name='extension']"); // Not used in provided code, but kept if needed elsewhere
const $message         = document.querySelector(".data__message");

// ─── Helpers ─────────────────────────────────────────────────────

export const getIndex = (vec,name) => Array.from(vec).findIndex(i=>i.name===name);
export const getValue = name => { const i=getIndex($data,name); return i>=0?$data[i].value.trim():""; };
export const enableItem  = btn => { if(btn) btn.disabled = false; };
export const disableItem = btn => { if(btn) btn.disabled = true; };

// ─── Regex definitions ────────────────────────────────────────────
// ENGLISH
const regexNames_EN     = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]{1,30}$/i; // Adjusted length for names
const regexDept_EN      = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s&\-,.]{1,60}$/;
const regexOccupation_EN = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s&\-,.]{1,60}$/;
const regexCompanyName_EN = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s&\-,.]{1,60}$/;
const regexStreet_EN = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s.,'#\/\-]{1,60}$/;
const regexPOBox_EN = /^[A-Za-z0-9\s.\-]{1,30}$/;
const regexCity_EN      = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s\-]{1,50}$/;
const regexRegion_EN    = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s\-]{1,50}$/;
const regexPostal_EN    = /^[A-Za-z0-9\s\-]{3,12}$/;
const regexCountry_EN   = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s\-]{2,50}$/;

// MONGOLIAN (Using Cyrillic range and common characters)
const regexNames_MN     = /^[\u0400-\u04FF\s]{1,30}$/u; // Adjusted length
const regexDept_MN      = /^[\u0400-\u04FF0-9\s&\-,.]{1,60}$/u;
const regexOccupation_MN = /^[\u0400-\u04FF0-9\s&\-,.]{1,60}$/u;
const regexCompanyName_MN = /^[\u0400-\u04FF0-9\s&\-,.]{1,60}$/u;
const regexStreet_MN = /^[\u0400-\u04FF0-9\s.,'#\/\-]{1,60}$/u;
const regexPOBox_MN = /^[\u0400-\u04FF0-9\s.\/\-]{1,20}$/u; // Added dot
const regexCity_MN      = /^[\u0400-\u04FF0-9\s&\-,.]{1,60}$/u;
const regexRegion_MN    = /^[\u0400-\u04FF\s\-]{1,50}$/u;
const regexPostal_MN    = /^[A-Za-z0-9\s\-]{3,12}$/u; // Kept as is, assuming postal codes might be latin alphanumeric
const regexCountry_MN = /^[\u0400-\u04FF0-9\s&\-,.]{1,60}$/u;

// Common
const regexPhone      = /^(\+)?\d{1,15}$/;
const regexEmail      = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const regexWebsite    = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w .-]*)*\/?$/;


// track validation state
const inputError = {
  Name_EN: null, LastName_EN: null, Department_EN: null, Occupation_EN: null, CompanyName_EN: null,
  Street_EN: null, POBox_EN: null,  City_EN: null, Region_EN: null, Postal_EN: null, Country_EN: null,
  Name_MN: null, LastName_MN: null, Department_MN: null, Occupation_MN: null, CompanyName_MN: null,
  Street_MN: null, POBox_MN: null, City_MN: null, Region_MN: null, Postal_MN: null, Country_MN: null,
  Phone: null, Email: null, Website: null,
};

// ─── Message Display Function ─────────────────────────────────────
function displayMessage(text, type = "info") { // type can be 'info', 'error', 'success'
  if (!$message) return;
  $message.textContent = text;
  $message.classList.remove("data__message--error", "data__message--success", "data__message--info");

  if (type === "error") {
    $message.classList.add("data__message--error");
  } else if (type === "success") {
    $message.classList.add("data__message--success");
  } else {
    $message.classList.add("data__message--info"); // Default or info styling
  }
}

// ─── Element Validation ───────────────────────────────────────────
function checkElement(regex, el) {
  if (!el) return null; // Element might not exist on all forms
  const v = el.value.trim();
  if (!v) { // Field is empty
    el.classList.remove("data__input--error", "data__input--success");
    return null; // Treat empty as 'not yet validated' or 'not applicable' rather than an error here
  }
  if (regex.test(v)) {
    el.classList.add("data__input--success");
    el.classList.remove("data__input--error");
    return true;
  }
  el.classList.add("data__input--error");
  el.classList.remove("data__input--success");
  // Global message will be set by checkData
  return false;
}

// ─── Main validation ─────────────────────────────────────────────
export function checkData(el) {
  const n = el.name;
  switch (n) {
    case "Name_EN": inputError[n] = checkElement(regexNames_EN, el); break;
    case "LastName_EN": inputError[n] = checkElement(regexNames_EN, el); break; // Assuming same regex for last name
    case "Department_EN": inputError[n] = checkElement(regexDept_EN, el); break;
    case "Occupation_EN": inputError[n] = checkElement(regexOccupation_EN, el); break;
    case "CompanyName_EN": inputError[n] = checkElement(regexCompanyName_EN, el); break;
    case "Street_EN": inputError[n] = checkElement(regexStreet_EN, el); break;
    case "POBox_EN": inputError[n] = checkElement(regexPOBox_EN, el); break;
    case "City_EN": inputError[n] = checkElement(regexCity_EN, el); break;
    case "Region_EN": inputError[n] = checkElement(regexRegion_EN, el); break;
    case "Postal_EN": inputError[n] = checkElement(regexPostal_EN, el); break;
    case "Country_EN": inputError[n] = checkElement(regexCountry_EN, el); break;

    case "Name_MN": inputError[n] = checkElement(regexNames_MN, el); break;
    case "LastName_MN": inputError[n] = checkElement(regexNames_MN, el); break; // Assuming same regex
    case "Department_MN": inputError[n] = checkElement(regexDept_MN, el); break;
    case "Occupation_MN": inputError[n] = checkElement(regexOccupation_MN, el); break;
    case "CompanyName_MN": inputError[n] = checkElement(regexCompanyName_MN, el); break;
    case "Street_MN": inputError[n] = checkElement(regexStreet_MN, el); break;
    case "POBox_MN": inputError[n] = checkElement(regexPOBox_MN, el); break;
    case "City_MN": inputError[n] = checkElement(regexCity_MN, el); break;
    case "Region_MN": inputError[n] = checkElement(regexRegion_MN, el); break;
    case "Postal_MN": inputError[n] = checkElement(regexPostal_MN, el); break;
    case "Country_MN": inputError[n] = checkElement(regexCountry_MN, el); break;

    case "Phone": inputError[n] = checkElement(regexPhone, el); break;
    case "Email": inputError[n] = checkElement(regexEmail, el); break;
    case "Website": inputError[n] = checkElement(regexWebsite, el); break;
  }

  const anyFieldFilled = $data.some(input => input.value.trim() !== "");
  const noErrors = !Object.values(inputError).includes(false); // true if no 'false' values (nulls are ok)

  if (anyFieldFilled && noErrors) {
    enableItem($buttonGenerate);
  } else {
    disableItem($buttonGenerate);
  }

  if (Object.values(inputError).includes(false)) { // If there's any explicit error
    displayMessage("Утгуудыг үнэн зөв оруулна уу.", "error");
  } else if (!anyFieldFilled && $buttonGenerate && $buttonGenerate.disabled) { // No data and button disabled (initial state)
    displayMessage("Бүх утгыг бүрэн бөглөнө үү.", "info");
  } else if (anyFieldFilled && noErrors) { // Data filled and no errors
    displayMessage("Ready to generate and save.", "info");
  } else { // Other states (e.g. some fields filled, some empty but not invalid)
      displayMessage("Бүх утгыг бүрэн бөглөнө үү.", "info");
  }
}

// ─── Data Saving Function (vCard string builder) ──────────────────
export function buildVCard() {
  const lang = $languageSelect ? $languageSelect.value : "EN"; // Default to EN if select not found
  if (lang === "MN") {
    return [
      "BEGIN:VCARD", "VERSION:3.0",
      `N;CHARSET=UTF-8:${getValue("LastName_MN")};${getValue("Name_MN")}`,
      `FN;CHARSET=UTF-8:${getValue("Name_MN")} ${getValue("LastName_MN")}`,
      `ORG;CHARSET=UTF-8:${getValue("CompanyName_MN")};${getValue("Department_MN")}`,
      `TITLE;CHARSET=UTF-8:${getValue("Occupation_MN")}`,
      `ADR;TYPE=WORK;CHARSET=UTF-8:${getValue("POBox_MN")};;${getValue("Street_MN")};${getValue("City_MN")};${getValue("Region_MN")};${getValue("Postal_MN")};${getValue("Country_MN")}`,
      `TEL;TYPE=CELL:${getValue("Phone")}`, `EMAIL;TYPE=INTERNET:${getValue("Email")}`,
      `URL:${getValue("Website")}`, "END:VCARD"
    ].join("\r\n");
  } else { // Default to English
    return [
      "BEGIN:VCARD", "VERSION:3.0",
      `N:${getValue("LastName_EN")};${getValue("Name_EN")}`,
      `FN:${getValue("Name_EN")} ${getValue("LastName_EN")}`,
      `ORG:${getValue("CompanyName_EN")};${getValue("Department_EN")}`,
      `TITLE:${getValue("Occupation_EN")}`,
      `ADR;TYPE=WORK:${getValue("POBox_EN")};;${getValue("Street_EN")};${getValue("City_EN")};${getValue("Region_EN")};${getValue("Postal_EN")};${getValue("Country_EN")}`,
      `TEL;TYPE=CELL:${getValue("Phone")}`, `EMAIL;TYPE=INTERNET:${getValue("Email")}`,
      `URL:${getValue("Website")}`, "END:VCARD"
    ].join("\r\n");
  }
}

// ─── API Call to Save Employee Data ───────────────────────────────
async function callSaveEmployeeAPI() {
  const employeeData = {};
  const vCardString = buildVCard(); // Use buildVCard here

  const fieldsToSave = [
    "Name_EN", "LastName_EN", "Department_EN", "Occupation_EN", "CompanyName_EN",
    "Street_EN", "POBox_EN", "Region_EN", "City_EN", "Postal_EN", "Country_EN",
    "Name_MN", "LastName_MN", "Department_MN", "Occupation_MN", "CompanyName_MN",
    "Street_MN", "POBox_MN", "Region_MN", "City_MN", "Postal_MN", "Country_MN",
    "Phone", "Email", "Website"
  ];

  fieldsToSave.forEach(fieldName => {
    // Ensure getValue doesn't break if a field is not on the page
    const value = getValue(fieldName);
    employeeData[fieldName] = value !== undefined ? value : ""; // Send empty string if field not found/empty
  });

  employeeData.qr_data = vCardString;

  try {
    displayMessage("Saving employee data...", "info");
    const response = await fetch('/api/employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(employeeData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      displayMessage(`Ажилтан амжилттай хадгалагдлаа! ID: ${result.id}`, "success");
      // Consider clearing the form or redirecting:
      // $data.forEach(input => { input.value = ''; });
      // $data.forEach(input => checkData(input)); // Re-validate and update UI
      // updateQR();
    } else {
      displayMessage(`Ажилтан хадгалахад алдаа гарлаа: ${result.error || response.statusText || 'Серверийн үл мэдэгдэх алдаа'}`, "error");
    }
  } catch (error) {
    console.error('Failed to save employee data via API:', error);
    displayMessage('Сервер лүү өгөгдөл илгээхэд алдаа гарлаа. Консолыг шалгана уу.', "error");
  }
}

// ─── QR redraw ────────────────────────────────────────────────────
export function updateQR() {
  if (!$qrContainer) return;
  const vcard = buildVCard(); // Use buildVCard here
  let canvas = $qrContainer.querySelector("canvas");
  if(!canvas){ canvas = document.createElement("canvas"); $qrContainer.appendChild(canvas); }
  canvas.width = canvas.width; // Clears canvas

  if (typeof QRCode === 'undefined') {
    console.error("QRCode library is not loaded.");
    displayMessage("QR Code library not found.", "error");
    return;
  }

  QRCode.toCanvas(canvas, vcard, { width: 280, height: 280, margin: 0 }, (error) => {
    if (error) {
      console.error("Error generating QR code:", error);
      displayMessage("QR код үүсгэхэд алдаа гарлаа.", "error");
    } else {
      displayMessage("QR код амжилттай үүсгэгдлээ.", "success");
    }
  });
}

export default { checkData, buildVCard, updateQR, callSaveEmployeeAPI }; // Updated export