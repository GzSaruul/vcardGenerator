// functions.js
const $data = Array.from(document.querySelectorAll(".data__input"));
const $languageSelect  = document.getElementById("languageSelect");
const $qrContainer     = document.getElementById("qr");
const $buttonGenerate  = document.getElementById("generateQr");
const $buttonDownload  = document.getElementById("download");
const $options         = document.querySelectorAll("select[name='extension']");
const $message         = document.querySelector(".data__message");

// ─── Regex definitions ────────────────────────────────────────────
// ENGLISH
const regexNames_EN    = /^[A-Za-zñÑáéíóúÁÉÍÓÚ]{1,15}$/i;
const regexDept_EN     = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s&\-,]{1,60}$/;
const regexOccupation_EN = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s&\-,]{1,60}$/;
const regexCompanyName_EN = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s&\-,]{1,60}$/;
const regexStreet = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s.,'#\/\-]{1,60}$/;
const regexPOBox = /^[A-Za-z0-9\s.\-]{1,30}$/;
const regexCity        = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s\-]{1,50}$/;
const regexRegion      = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s\-]{1,50}$/;
const regexPostal      = /^[A-Za-z0-9\s\-]{3,12}$/;
const regexCountry     = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s\-]{2,50}$/;
// Enable Unicode matching by using the `u` flag
// MONGOLIAN
const regexNames_MN   = /^[\u0400-\u04FF]{1,15}$/u;
const regexDept_MN    = /^[\u0400-\u04FF0-9\s&\-,]{1,60}$/u;
const regexOccupation_MN = /^[\u0400-\u04FF0-9\s&\-,]{1,60}$/u;
const regexCompanyName_MN = /^[\u0400-\u04FF0-9\s&\-,]{1,60}$/u;
const regexStreet_MN = /^[\u0400-\u04FF0-9\s.,'#\/-]{1,60}$/u;
const regexPOBox_MN = /^[\u0400-\u04FF0-9\/-]{1,20}$/u;
const regexCity_MN    = /^[\u0400-\u04FF0-9\s&\-,]{1,60}$/u;
const regexRegion_MN  = /^[\u0400-\u04FF\s\-]{1,50}$/u;
const regexPostal_MN  = /^[A-Za-z0-9\s\-]{3,12}$/;
const regexCountry_MN = /^[\u0400-\u04FF0-9\s&\-,]{1,60}$/u;

// Common
const regexPhone       = /^(\+)?\d{1,15}$/;
const regexEmail       = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const regexWebsite     = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[\w .-]*)*\/?$/;

// track validation state
const inputError = {
  //EN
  Name_EN: null, LastName_EN: null, Department_EN: null,
  Occupation_EN: null, CompanyName_EN: null,
  Street_EN: null, POBox_EN: null,  City_EN: null, Region_EN: null, Postal_EN: null, Country_EN: null,
  Name_MN: null, LastName_MN: null, Department_MN: null,
  Occupation_MN: null, CompanyName_MN: null,
  Street_MN: null, POBox_MN: null, City_MN: null, Region_MN: null, Postal_MN: null, Country_MN: null,
  Phone: null, Email: null, Website: null,
  
};

// ─── Helpers ─────────────────────────────────────────────────────
const getIndex    = (vec,name) => Array.from(vec).findIndex(i=>i.name===name);
const getValue    = name => { const i=getIndex($data,name); return i>=0?$data[i].value.trim():""; };
const enableItem  = btn => btn.disabled = false;
const disableItem = btn => btn.disabled = true;
const enableOpts  = ()  => $options.forEach(enableItem);
const disableOpts = ()  => $options.forEach(disableItem);

function messageError(cond) {
  $message.classList.toggle("data__message--error", cond);
  $message.textContent = cond ? "Утгуудыг үнэн зөв оруулна уу." : "Бүх утгыг бүрэн бөглөнө үү.";
}


function checkElement(regex, el) {
  const v = el.value.trim();
  if (!v) {
    el.classList.remove("data__input--error", "data__input--success");
    return null;
  }
  if (regex.test(v)) {
    el.classList.add("data__input--success");
    el.classList.remove("data__input--error");
    return true;
  }
  el.classList.add("data__input--error");
  el.classList.remove("data__input--success");

  // Show error message when input is invalid
  messageError(true);
  return false;
}


// ─── Main validation ─────────────────────────────────────────────
export function checkData(el) {
  const n = el.name;
  
  // Always check the field and set input error status
  switch (n) {
    case "Name_EN": case "LastName_EN":
      inputError[n] = checkElement(regexNames_EN, el); break;
    case "Department_EN":
      inputError[n] = checkElement(regexDept_EN, el); break;
    case "Occupation_EN":
      inputError[n] = checkElement(regexOccupation_EN, el); break;
    case "CompanyName_EN":
      inputError[n] = checkElement(regexCompanyName_EN, el); break;
    case "Street_EN":
      inputError[n] = checkElement(regexStreet, el); break;
    case "POBox_EN":
      inputError[n] = checkElement(regexPOBox, el); break;
    case "City_EN":
      inputError[n] = checkElement(regexCity, el); break;
    case "Region_EN":
      inputError[n] = checkElement(regexRegion, el); break;
    case "Postal_EN":
      inputError[n] = checkElement(regexPostal, el); break;
    case "Country_EN":  
      inputError[n] = checkElement(regexCountry, el); break;

    // Mongolian fields
    case "Name_MN": case "LastName_MN":
      inputError[n] = checkElement(regexNames_MN, el); break;
    case "Department_MN":
      inputError[n] = checkElement(regexDept_MN, el); break;
    case "Occupation_MN":
      inputError[n] = checkElement(regexOccupation_MN, el); break;
    case "CompanyName_MN":
      inputError[n] = checkElement(regexCompanyName_MN, el); break;
    case "Street_MN":
      inputError[n] = checkElement(regexStreet_MN, el); break;
    case "POBox_MN":
      inputError[n] = checkElement(regexPOBox_MN, el); break;
    case "City_MN":
      inputError[n] = checkElement(regexCity_MN, el); break;
    case "Region_MN":
      inputError[n] = checkElement(regexRegion_MN, el); break;
    case "Postal_MN":
      inputError[n] = checkElement(regexPostal_MN, el); break;
    case "Country_MN":
      inputError[n] = checkElement(regexCountry_MN, el); break;

    // Common fields
    case "Phone":
      inputError[n] = checkElement(regexPhone, el); break;
    case "Email":
      inputError[n] = checkElement(regexEmail, el); break;
    case "Website":
      inputError[n] = checkElement(regexWebsite, el); break;
  }

  // Enable GENERATE button if any field is filled (not necessarily all)
  const anyFieldFilled = $data.some(input => input.value.trim() !== "");

  // Enable GENERATE if at least one field is filled and no errors
  const noErrors = !Object.values(inputError).includes(false);
  if (anyFieldFilled && noErrors) {
    enableItem($buttonGenerate);
  } else {
    disableItem($buttonGenerate);
  }

  // Show error message if any invalid field
  const hasError = Object.values(inputError).includes(false);
  messageError(hasError);
}



// ─── vCard builders ──────────────────────────────────────────────
// ENGLISH
const vcardEN = () => [
  "BEGIN:VCARD",
  "VERSION:3.0",
  `N:${getValue("LastName_EN")};${getValue("Name_EN")}`,
  `FN:${getValue("Name_EN")} ${getValue("LastName_EN")}`,
  `ORG:${getValue("CompanyName_EN")};${getValue("Department_EN")}`,
  `TITLE:${getValue("Occupation_EN")}`,
  // ADR: postOffice;extended;street;city;region;postal;country
  `ADR;TYPE=WORK:${getValue("POBox_EN")};;${getValue("Street_EN")};` +
    `${getValue("City_EN")};${getValue("Region_EN")};${getValue("Postal_EN")};${getValue("Country_EN")}`,
  `TEL;TYPE=CELL:${getValue("Phone")}`,
  `EMAIL;TYPE=INTERNET:${getValue("Email")}`,
  `URL:${getValue("Website")}`,
  "END:VCARD"
].join("\r\n");
// MONGOLIAN
const vcardMN = () => [
  "BEGIN:VCARD",
  "VERSION:3.0",
  `N;CHARSET=UTF-8:${getValue("LastName_MN")};${getValue("Name_MN")}`,
  `FN;CHARSET=UTF-8:${getValue("Name_MN")} ${getValue("LastName_MN")}`,
  `ORG;CHARSET=UTF-8:${getValue("CompanyName_MN")};${getValue("Department_MN")}`,
  `TITLE;CHARSET=UTF-8:${getValue("Occupation_MN")}`,
  // ADR: postOffice;extended;street;city;region;postal;country
  // Note: The ADR field is encoded in UTF-8
  `ADR;TYPE=WORK;CHARSET=UTF-8:${getValue("POBox_MN")};;${getValue("Street_MN")};` +
    `${getValue("City_MN")};${getValue("Region_MN")};${getValue("Postal_MN")};${getValue("Country_MN")}`,
  `TEL;TYPE=CELL:${getValue("Phone")}`,
  `EMAIL;TYPE=INTERNET:${getValue("Email")}`,
  `URL:${getValue("Website")}`,
  "END:VCARD"
].join("\r\n");
// ─── vCard builder switcher ──────────────────────────────────────
// This function will return the vCard string based on the selected language
function buildVCard(){
  return $languageSelect.value === "MN" ? vcardMN() : vcardEN();
}

// ─── QR redraw ────────────────────────────────────────────────────
export function updateQR(){
  const vcard = buildVCard();
  let canvas = $qrContainer.querySelector("canvas");
  if(!canvas){
    canvas = document.createElement("canvas");
    $qrContainer.appendChild(canvas);
  }
  // clear & draw
  canvas.width = canvas.width;
  QRCode.toCanvas(canvas, vcard, {
    width: 280, height: 280, errorCorrectionLevel: "H"
  }, err => err && console.error(err));
}

// ─── Button handlers ─────────────────────────────────────────────
export function generateQR(){
  // This will generate the QR code regardless of validation
  updateQR();
  enableItem($buttonDownload);  // Enable download button
  disableItem($buttonGenerate); // Disable generate button after QR is generated
}


export function downloadQR(){
  const canvas = $qrContainer.querySelector("canvas");
  if(!canvas) return alert("No QR to download");
  const ext = document.querySelector("select[name='extension']").value;
  const link = document.createElement("a");
  link.download = `vCard.${ext}`;
  link.href     = canvas.toDataURL(`image/${ext}`);
  link.click();
}

// ─── Language switcher ────────────────────────────────────────────
$languageSelect.addEventListener("change", ()=>{
  document.getElementById("englishFields").style.display = $languageSelect.value==="EN"?"block":"none";
  document.getElementById("mongolianFields").style.display = $languageSelect.value==="MN"?"block":"none";
  updateQR();
});

// initialize on load
updateQR();

export default {
  checkData, updateQR, generateQR, downloadQR,
  enableOpts, enableItem,
  $qrContainer, $buttonDownload
};
