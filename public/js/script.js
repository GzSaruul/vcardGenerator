// script.js
import utilities from './functions.js';
// script.js

// — cache only the DOM nodes you actually have —
const inputs        = document.querySelectorAll('.data__input');
const btnGenerate   = document.getElementById('generateQr');
const btnDownload   = document.getElementById('download');
const selectExt     = document.querySelector('select[name="extension"]');
const langSelect    = document.getElementById('languageSelect');

// 1) validate on input
inputs.forEach(i => i.addEventListener('input', e => {
  utilities.checkData(e.target);
}));

// 2) regenerate QR when extension changes
selectExt.addEventListener('change', () => {
  utilities.updateQR();
});

// 3) Generate / Download buttons
btnGenerate.addEventListener('click', () => {
  utilities.enableOpts();
  utilities.generateQR();
});

btnDownload.addEventListener('click', () => {
  utilities.downloadQR();
});

// 4) language switcher (show/hide wrappers + redraw)
langSelect.addEventListener('change', () => {
  document.getElementById('englishFields').style.display =
    langSelect.value === 'EN' ? 'block' : 'none';
  document.getElementById('mongolianFields').style.display =
    langSelect.value === 'MN' ? 'block' : 'none';
  utilities.updateQR();
});

// initialize
utilities.updateQR();
