const video = document.getElementById('webcam');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let stream = null;
let intervalId = null;

startBtn.addEventListener('click', async () => {
  if (!stream) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (err) {
      alert('Tidak bisa mengakses kamera!');
      return;
    }
  }

  // Mulai interval screenshot tiap 15 detik
  intervalId = setInterval(captureAndSend, 15000);
});

stopBtn.addEventListener('click', () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    stream = null;
  }
});

async function captureAndSend() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  const base64Image = canvas.toDataURL('image/png');

  const response = await fetch('https://malasngoding.uno/process-face', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
  });

  const result = await response.json();
  console.log(result);

  if (result.status === 'face detected') {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = result.saved || 'screenshot.png';
    link.click();
  }
}

// Tutup popup
function closePopup() {
  document.getElementById('popupBox').style.display = 'none';
}

// Tampilkan popup sekali saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('popupBox').style.display = 'flex';
});
