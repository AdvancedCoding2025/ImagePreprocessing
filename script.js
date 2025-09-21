const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const brightnessValueText = document.getElementById('brightnessValue');
const contrastValueText = document.getElementById('contrastValue');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const grayscaleToggle = document.getElementById('grayscaleToggle');

let originalImageData = null;
let currentImage = null;
const MAX_SIZE = 600; // Maximum width or height for the image

upload.addEventListener('change', handleImageUpload);
brightnessSlider.addEventListener('input', applyFilters);
contrastSlider.addEventListener('input', applyFilters);
grayscaleToggle.addEventListener('change', applyFilters);
resetBtn.addEventListener('click', resetFilters);
downloadBtn.addEventListener('click', downloadImage);

function handleImageUpload(event) {
  const file = event.target.files[0];
  if(!file) return;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function() {
    currentImage = img;
    
    // Calculate new dimensions to reduce size if needed
    let width = img.naturalWidth;
    let height = img.naturalHeight;
    
    if (width > MAX_SIZE || height > MAX_SIZE) {
      if (width > height) {
        height = (MAX_SIZE / width) * height;
        width = MAX_SIZE;
      } else {
        width = (MAX_SIZE / height) * width;
        height = MAX_SIZE;
      }
    }
    
    // Set canvas size to reduced dimensions
    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);
    
    // Draw image on canvas with new size
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Save original pixels (at the reduced size)
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Reset controls
    resetFilters();
  };
  
  img.onerror = function() {
    alert("Failed to load image. Please try a different file.");
  };
  
  const reader = new FileReader();
  reader.onload = function(e) {
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function applyFilters() {
  if (!originalImageData) return;

  brightnessValueText.textContent = brightnessSlider.value;
  contrastValueText.textContent = contrastSlider.value;

  const brightness = parseInt(brightnessSlider.value);
  const contrast = parseInt(contrastSlider.value);
  const applyGrayscale = grayscaleToggle.checked;

  const imgData = ctx.createImageData(originalImageData);
  const data = imgData.data;
  const origData = originalImageData.data;

  // Contrast factor
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for(let i = 0; i < origData.length; i += 4) {
    let r = origData[i];
    let g = origData[i+1];
    let b = origData[i+2];
    
    if (applyGrayscale) {
      // Convert to grayscale using luminance formula
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = g = b = gray;
    }
    
    // Apply contrast and brightness to each channel
    r = factor * (r - 128) + 128 + brightness;
    g = factor * (g - 128) + 128 + brightness;
    b = factor * (b - 128) + 128 + brightness;
    
    // Clamp values between 0 and 255
    data[i] = Math.min(255, Math.max(0, r));
    data[i+1] = Math.min(255, Math.max(0, g));
    data[i+2] = Math.min(255, Math.max(0, b));
    data[i+3] = origData[i+3]; // preserve alpha
  }

  ctx.putImageData(imgData, 0, 0);
}

function resetFilters() {
  brightnessSlider.value = 0;
  contrastSlider.value = 0;
  brightnessValueText.textContent = '0';
  contrastValueText.textContent = '0';
  grayscaleToggle.checked = false;
  
  if(originalImageData) {
    ctx.putImageData(originalImageData, 0, 0);
  }
}

function downloadImage() {
  if (!originalImageData) {
    alert('Please upload an image first');
    return;
  }
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.download = 'processed-image.png';
  
  // Convert canvas to blob and create download link
  canvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.click();
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  });
}