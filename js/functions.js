// functions.js
const $data = document.querySelectorAll(".data__input"),
      $options = document.querySelectorAll("select, input[type='color']"),
      $buttonGenerateQr = document.getElementById("generateQr"),
      $buttonClear = document.getElementById("clear"),
      $buttonDownload = document.getElementById("download"),
      $qrContainer = document.getElementById("qr"),
      $message = document.querySelector(".data__message");

// Regex definitions
const regexNames_EN = /^[A-Za-zñÑáéíóúÁÉÍÓÚ]{1,15}$/i;
const regexDepartment_EN = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s&\-,]{1,60}$/;
const regexOccupation_EN = /^[A-Za-zñÑáéíóúÁÉÍÓÚ]{1,15}$/;
const regexCompanyName_EN = /^[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,15}$/;
const regexCompanyAddress_EN = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s,./:\-]{1,60}$/;
const regexNames_MN = /^[\u0400-\u052F\s]{1,15}$/;
const regexDepartment_MN = /^[\u0400-\u052F0-9\s&\-,]{1,60}$/;
const regexOccupation_MN = /^[\u0400-\u052F]{1,15}$/;
const regexCompanyName_MN = /^[\u0400-\u052F ]{1,15}$/;
const regexCompanyAddress_MN = /^[\u0400-\u052F0-9\s,./:\-]{1,60}$/;
const regexPhone = /^\+?\d{1,15}$/;
const regexMail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const regexWebsite = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}([\/\w .-]*)*\/?$/;

// track each field's validation state
const inputError = {
  input_name_en: null,
  input_lastName_en: null,
  input_department_en: null,
  input_occupation_en: null,
  input_companyName_en: null,
  input_companyAddress_en: null,
  input_name_mn: null,
  input_lastName_mn: null,
  input_department_mn: null,
  input_occupation_mn: null,
  input_companyName_mn: null,
  input_companyAddress_mn: null,
  input_phone: null,
  input_email: null,
  input_website: null
};

let qr = qrcode(0, 'H'); // 'H' = High error correction
qr.addData(vcardTemplate(), 'Byte'); // Ensure 'Byte' mode for UTF-8
qr.make();
document.getElementById("qr").innerHTML = qr.createImgTag(6); // or createSvgTag()


// ─── Helpers ─────────────────────────────────────────────────────
const getIndex = (vector, name) =>
  Array.from(vector).findIndex(el => el.name === name);

const getValue = name => {
  const i = getIndex($data, name);
  return i >= 0 ? $data[i].value.trim() : "";
};

const enableItem = item => item.disabled = false;
const disableItem = item => item.disabled = true;
const enableOptions = () => $options.forEach((e) => enableItem(e))
const disableOptions = () => $options.forEach((e) => disableItem(e))
const messageError = condition => {
  $message.classList.toggle("data__message--error", condition);
  $message.textContent = condition
    ? "Enter a valid value"
    : "Enter the data to generate the code";
};

const checkElement = (regex, el) => {
  const val = el.value.trim();
  if (regex.test(val)) {
    el.classList.add("data__input--success");
    el.classList.remove("data__input--error");
    return true;
  } else if (!val) {
    el.classList.remove("data__input--error", "data__input--success");
    return null;
  } else {
    el.classList.add("data__input--error");
    el.classList.remove("data__input--success");
    messageError(true);
    return false;
  }
};

const checkError = () => {
  if (!Object.values(inputError).includes(false)) {
    messageError(false);
  }
};

// ─── Main validation ─────────────────────────────────────────────
export function checkData(el) {
  const n = el.name;
  switch (n) {
    case "Name_EN":
    case "LastName_EN":
      inputError[`input_${n.toLowerCase()}`] = checkElement(regexNames_EN, el);
      break;
    case "Department_EN":
      inputError.input_department_en = checkElement(regexDepartment_EN, el);
      break;
    case "Occupation_EN":
      inputError.input_occupation_en = checkElement(regexOccupation_EN, el);
      break;
    case "CompanyName_EN":
      inputError.input_companyName_en = checkElement(regexCompanyName_EN, el);
      break;
    case "CompanyAddress_EN":
      inputError.input_companyAddress_en = checkElement(regexCompanyAddress_EN, el);
      break;
    case "Name_MN":
    case "LastName_MN":
      inputError[`input_${n.toLowerCase()}`] = checkElement(regexNames_MN, el);
      break;
    case "Department_MN":
      inputError.input_department_mn = checkElement(regexDepartment_MN, el);
      break;
    case "Occupation_MN":
      inputError.input_occupation_mn = checkElement(regexOccupation_MN, el);
      break;
    case "CompanyName_MN":
      inputError.input_companyName_mn = checkElement(regexCompanyName_MN, el);
      break;
    case "CompanyAddress_MN":
      inputError.input_companyAddress_mn = checkElement(regexCompanyAddress_MN, el);
      break;
    case "Phone":
      inputError.input_phone = checkElement(regexPhone, el);
      break;
    case "Email":
      inputError.input_email = checkElement(regexMail, el);
      break;
    case "Website":
      inputError.input_website = checkElement(regexWebsite, el);
      break;
  }

  checkError();

  // Enable GENERATE only when no field is explicitly invalid and all required have values
  const required = [
    "Name_EN","LastName_EN","Department_EN","Occupation_EN","CompanyName_EN","CompanyAddress_EN",
    "Name_MN","LastName_MN","Department_MN","Occupation_MN","CompanyName_MN","CompanyAddress_MN",
    "Phone", "Email", "Website"
  ];
  const allFilled = required.every(f => getValue(f));
  const noErrors = !Object.values(inputError).includes(false);

  if (allFilled && noErrors) {
    enableItem($buttonGenerateQr);
  } else {
    disableItem($buttonGenerateQr);
  }

  // Always enable CLEAR once any field has been touched
  const touched = Object.values(inputError).some(v => v !== null);
  if (touched) enableItem($buttonClear);
  else disableItem($buttonClear);
}


const clear = () => {
  $qrContainer.innerHTML = "";
  $data.forEach((e) => e.value = "")
  $data.forEach((e) => {
    e.classList.remove("data__input--error")
    e.classList.remove("data__input--succes")
  })
  Array.from($options)[getIndex($options, "dotStyle")].value = "square"
  Array.from($options)[getIndex($options, "dotColor")].value = "#182c2b"
  Array.from($options)[getIndex($options, "cornerStyle")].value = ""
  Array.from($options)[getIndex($options, "cornerColor")].value = "#182c2b"
  Array.from($options)[getIndex($options, "cornerDotStyle")].value = ""
  Array.from($options)[getIndex($options, "cornerDotColor")].value = "#d53839"
  // Array.from($options)[getIndex($options, "imageColor")].value = "#d53839"
  // Array.from($options)[getIndex($options, "backgroundColor")].value = "#fffffd"
  Array.from($options)[getIndex($options, "extension")].value = "png"
  disableOptions();
  disableItem($buttonClear)
  disableItem($buttonGenerateQr)
  disableItem($buttonDownload)
  messageError(false);
}


const vcardTemplate = () => {
  return `BEGIN:VCARD
VERSION:3.0
N:${getValue("LastName_EN")};${getValue("Name_EN")}
FN:${getValue("Name_EN")} ${getValue("LastName_EN")}
ORG:${getValue("CompanyName_EN")};${getValue("Department_EN")}
TITLE:${getValue("Occupation_EN")}
ADR;TYPE=WORK:;;${getValue("CompanyAddress_EN")};;;;
N;CHARSET=UTF-8:${getValue("LastName_MN")};${getValue("Name_MN")}
FN;CHARSET=UTF-8:${getValue("Name_MN")} ${getValue("LastName_MN")}
ORG;CHARSET=UTF-8:${getValue("CompanyName_MN")}
TITLE;CHARSET=UTF-8:${getValue("Occupation_MN")}
X-DEPARTMENT;CHARSET=UTF-8:${getValue("Department_MN")}
ADR;TYPE=WORK;CHARSET=UTF-8:;;${getValue("CompanyAddress_MN")};;;;
TEL;TYPE=CELL:${getValue("Phone")}
EMAIL;TYPE=INTERNET:${getValue("Email")}
URL:${getValue("Website")}
END:VCARD`;
}


const imgTemplate = () => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
<path fill="${encodeURIComponent(Array.from($options)[getIndex($options, "dotColor")].value)}" d="M0 96l576 0c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96zm0 32V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128H0zM64 405.3c0-29.5 23.9-53.3 53.3-53.3H234.7c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7H74.7c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16z"/></svg>`
}
const getValues = () => {
  return {
    width: 280,
    height: 280,
    type: "svg",
    data: vcardTemplate(),
    image: imgTemplate(),
    imageOptions: {
      imageSize: 0.3,
      margin: 3
    },
    dotsOptions: {
      type: Array.from($options)[getIndex($options, "dotStyle")].value,
      color: Array.from($options)[getIndex($options, "dotColor")].value
    },
    // backgroundOptions: {
    //   color: Array.from($options)[getIndex($options, "backgroundColor")].value
    // },
    cornersSquareOptions: {
      type: Array.from($options)[getIndex($options, "cornerStyle")].value,
      color: Array.from($options)[getIndex($options, "cornerColor")].value
    },
    cornersDotOptions: {
      type: Array.from($options)[getIndex($options, "cornerDotStyle")].value,
      color: Array.from($options)[getIndex($options, "cornerDotColor")].value
    }
  }
}
const generateQR = () => {
  qrCode = new QRCodeStyling(getValues());
  qrCode.append($qrContainer)
}
const updateQR = () => qrCode.update(getValues())

const downloadQR = () => {
  qrCode.download({
    name: "vCard",
    extension: Array.from($options)[getIndex($options, "extension")].value
  })
}
export default {
  $qrContainer,
  $buttonDownload,
  checkData,
  updateQR,
  enableOptions,
  enableItem,
  generateQR,
  updateQR,
  clear,
  downloadQR
}