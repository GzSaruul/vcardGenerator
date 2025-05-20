const generateQrButton = document.getElementById('generateQrButton');
const qrCodeImage = document.getElementById('employeeQrCode');
const noQrCodeText = document.getElementById('noQrCode');

if (generateQrButton) {
    generateQrButton.addEventListener('click', () => {
        const pathSegments = window.location.pathname.split('/');
        const employeeId = pathSegments[pathSegments.length - 1];

        fetch(`/generate-qr/${employeeId}`, {
            method: 'POST',
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.qrCode) {
                if (qrCodeImage) {
                    qrCodeImage.src = data.qrCode;
                    qrCodeImage.style.display = 'block';
                }
                if (noQrCodeText) {
                    noQrCodeText.style.display = 'none';
                }
            } else {
                alert('Failed to generate QR code.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to generate QR code: ' + error);
        });
    });
}
