(function () {
  'use strict';

  var enc = new TextEncoder();

  function toHex(buf) {
    var bytes = new Uint8Array(buf), out = '';
    for (var i = 0; i < bytes.length; i++) out += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    return out;
  }

  function sha256(data) {
    return crypto.subtle.digest('SHA-256', data).then(toHex);
  }

  // 64 hex chars -> 32 cells, opacity from each byte. Same input, same picture.
  function fingerprint(el, hex) {
    el.textContent = '';
    if (!hex) return;
    for (var i = 0; i < 32; i++) {
      var b = parseInt(hex.substr(i * 2, 2), 16);
      var cell = document.createElement('i');
      cell.style.opacity = (0.18 + (b / 255) * 0.82).toFixed(2);
      el.appendChild(cell);
    }
  }

  function showHash(hashEl, fpEl, hex) {
    hashEl.textContent = hex;
    fingerprint(fpEl, hex);
  }

  // Sample certificate: hash its own text so the readout is real.
  var cert = document.getElementById('sample-cert');
  var sampleHash = document.getElementById('sample-hash');
  var sampleFp = document.getElementById('sample-fp');
  if (cert && window.crypto && crypto.subtle) {
    var text = cert.textContent.replace(/\s+/g, ' ').trim();
    sha256(enc.encode(text)).then(function (hex) { showHash(sampleHash, sampleFp, hex); });
  } else if (sampleHash) {
    sampleHash.textContent = 'unavailable in this browser';
  }

  // Demo
  var fileInput = document.getElementById('file');
  var drop = document.getElementById('drop');
  var textInput = document.getElementById('text');
  var demoName = document.getElementById('demo-name');
  var demoHash = document.getElementById('demo-hash');
  var demoFp = document.getElementById('demo-fp');
  if (!fileInput || !crypto.subtle) return;

  function size(n) {
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  }

  function hashFile(file) {
    if (!file) return;
    demoName.textContent = file.name + ', ' + size(file.size);
    demoHash.textContent = 'computing…';
    file.arrayBuffer().then(sha256).then(function (hex) {
      showHash(demoHash, demoFp, hex);
    }).catch(function () {
      demoHash.textContent = 'could not read that file';
    });
  }

  var pending;
  function hashText() {
    var t = textInput.value;
    clearTimeout(pending);
    pending = setTimeout(function () {
      if (!t) {
        demoName.textContent = 'nothing yet';
        demoHash.textContent = '—';
        fingerprint(demoFp, '');
        return;
      }
      demoName.textContent = t.length + ' character' + (t.length === 1 ? '' : 's') + ' of text';
      sha256(enc.encode(t)).then(function (hex) { showHash(demoHash, demoFp, hex); });
    }, 80);
  }

  fileInput.addEventListener('change', function () { hashFile(fileInput.files[0]); });
  textInput.addEventListener('input', hashText);

  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); });
  });
  drop.addEventListener('drop', function (e) {
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) hashFile(f);
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
