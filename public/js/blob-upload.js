import { upload } from 'https://esm.sh/@vercel/blob/client?bundle';

const form = document.getElementById('publishForm');
const logoInput = document.getElementById('logoFile');
const apkInput = document.getElementById('apkFile');
const submitBtn = document.getElementById('submitBtn');
const progressWrap = document.getElementById('progressWrap');
const progressTitle = document.getElementById('progressTitle');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

function safeName(name) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 90);
  return cleaned || 'file';
}

function setProgress(title, percentage) {
  progressWrap.hidden = false;
  progressTitle.textContent = title;
  const value = Math.max(0, Math.min(100, Math.round(percentage || 0)));
  progressBar.style.width = `${value}%`;
  progressText.textContent = `${value}%`;
}

async function uploadOne(type, file) {
  const folder = type === 'logo' ? 'logos' : 'apks';
  const pathname = `${folder}/${Date.now()}-${safeName(file.name)}`;

  return upload(pathname, file, {
    access: 'public',
    handleUploadUrl: '/api/blob/upload',
    clientPayload: JSON.stringify({ type }),
    multipart: type === 'apk',
    onUploadProgress: ({ percentage }) => {
      setProgress(type === 'logo' ? 'Logo yükleniyor...' : 'APK yükleniyor...', percentage);
    }
  });
}

form?.addEventListener('submit', async (event) => {
  const alreadyUploaded = document.getElementById('logoUrl').value && document.getElementById('apkUrl').value;
  if (alreadyUploaded) return;

  event.preventDefault();

  const logo = logoInput.files?.[0];
  const apk = apkInput.files?.[0];

  if (!logo || !apk) {
    alert('Logo ve APK dosyası seçmelisin.');
    return;
  }

  if (!apk.name.toLowerCase().endsWith('.apk')) {
    alert('APK dosyası .apk uzantılı olmalı.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Yükleniyor...';

  try {
    const logoBlob = await uploadOne('logo', logo);
    const apkBlob = await uploadOne('apk', apk);

    document.getElementById('logoUrl').value = logoBlob.url;
    document.getElementById('apkUrl').value = apkBlob.url;
    document.getElementById('apkOriginalName').value = apk.name;
    document.getElementById('apkSizeBytes').value = String(apk.size);

    setProgress('Yayın kaydı oluşturuluyor...', 100);
    form.submit();
  } catch (err) {
    console.error(err);
    alert(err?.message || 'Yükleme sırasında hata oluştu.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Yayınla';
  }
});
