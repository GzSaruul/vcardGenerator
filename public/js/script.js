import utilities, { getValue, buildVCard } from './functions.js';

// cache DOM nodes
const inputs      = document.querySelectorAll('.data__input');
const btnGenerate = document.getElementById('generateQr');
const btnDownload = document.getElementById('download');
const selectExt   = document.querySelector('select[name="extension"]');
const langSelect  = document.getElementById('languageSelect');

// 1) validate on input
inputs.forEach(i => i.addEventListener('input', e => {
    utilities.checkData(e.target);
}));

// 2) regenerate QR when extension changes
selectExt.addEventListener('change', () => {
    utilities.updateQR();
});

// 3) Generate / Download buttons
btnGenerate.addEventListener('click', async () => {
// gather form values and vCard text
    const data = {
// English
Name_EN: getValue('Name_EN'),
LastName_EN: getValue('LastName_EN'),
Department_EN: getValue('Department_EN'),
Occupation_EN: getValue('Occupation_EN'),
CompanyName_EN: getValue('CompanyName_EN'),
Street_EN: getValue('Street_EN'),
POBox_EN: getValue('POBox_EN'),
Region_EN: getValue('Region_EN'),
City_EN: getValue('City_EN'),
Postal_EN: getValue('Postal_EN'),
Country_EN: getValue('Country_EN'),
// Mongolian
Name_MN: getValue('Name_MN'),
LastName_MN: getValue('LastName_MN'),
Department_MN: getValue('Department_MN'),
Occupation_MN: getValue('Occupation_MN'),
CompanyName_MN: getValue('CompanyName_MN'),
Street_MN: getValue('Street_MN'),
POBox_MN: getValue('POBox_MN'),
Region_MN: getValue('Region_MN'),
City_MN: getValue('City_MN'),
Postal_MN: getValue('Postal_MN'),
Country_MN: getValue('Country_MN'),
// Common
Phone: getValue('Phone'),
Email: getValue('Email'),
Website: getValue('Website'),
// QR data
    qr_data: buildVCard()
};
    // validate
try {
    const resp = await fetch('/api/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
});

    const json = await resp.json();

if (!json.success) throw new Error(json.error || 'Save failed');
// after saving, generate QR
    utilities.updateQR();
    //utilities.enableOpts();
    //utilities.enableItem(btnDownload);
    //utilities.disableItem(btnGenerate);
} catch (err) {
    console.error(err);
    alert('Error saving employee: ' + err.message);
}
});

btnDownload.addEventListener('click', () => {
    utilities.downloadQR();
});

// 4) language switcher (show/hide wrappers + redraw)

/*langSelect.addEventListener('change', () => {
    document.getElementById('englishFields').style.display =langSelect.value === 'EN' ? 'block' : 'none';
    document.getElementById('mongolianFields').style.display = langSelect.value === 'MN' ? 'block' : 'none';
    utilities.updateQR();
    //utilities.disableItem(btnDownload);
    //utilities.disableItem(btnGenerate);
});*/

// initialize
utilities.updateQR();