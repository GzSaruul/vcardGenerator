const languageSelect = document.getElementById("languageSelect");
const qrImage = document.getElementById("qrImage");
const pathSegments = window.location.pathname.split('/');
const employeeId = pathSegments[pathSegments.length - 1];
console.log("Current URL:", window.location.pathname);
console.log("Extracted employeeId:", employeeId);


function generateQRCode(language = "EN") {
  fetch(`/generate-qr/${employeeId}`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language })
   })
   .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
   })
   .then(data => {
    qrImage.src = data.qrUrl;
   })
   .catch(error => {
     console.error("QR Code generation error:", error);
   });
}

// Initial load
generateQRCode();

// Update QR when language is changed
languageSelect.addEventListener("change", () => {
  const selectedLang = languageSelect.value;
  generateQRCode(selectedLang);
});

// Function to download the QR code
function downloadQRCodeCard() {
  const qrSrc = qrImage.src;
  const imageFormatSelect = document.getElementById("imageFormat");
  const selectedFormat = imageFormatSelect ? imageFormatSelect.value : 'png';
  if (qrSrc) {
    const link = document.createElement('a');
    link.href = qrSrc;
    const sanitizedFirstName = employeeData.Name_MN ? employeeData.Name_MN.replace(/[^а-яА-ЯёЁ\s]/g, "") : '';
    const sanitizedLastName = employeeData.LastName_MN ? employeeData.LastName_MN.replace(/[^а-яА-ЯёЁ\s]/g, "") : '';
    link.download = `Ажилтан_${sanitizedFirstName}_${sanitizedLastName}.${selectedFormat}`; // Customized filename with format
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('No QR Code to download.');
  }
}

// Ensure the DOM is fully loaded before attaching the event listener
document.addEventListener('DOMContentLoaded', () => {
  const downloadQrCardBtn = document.getElementById("downloadQrCard");
  if (downloadQrCardBtn) {
    downloadQrCardBtn.addEventListener('click', downloadQRCodeCard);
  }
});