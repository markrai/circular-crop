document.getElementById('upload').addEventListener('change', function(e) {
    const image = document.getElementById('image');
    const reader = new FileReader();

    reader.onload = function(event) {
        image.src = event.target.result;
        image.style.display = 'block'; 
    };

    reader.readAsDataURL(e.target.files[0]);

    
    image.addEventListener('mousedown', onDragStart);
});

let offsetX, offsetY, cropOffsetX, cropOffsetY, isResizing = false;

function onDragStart(e) {
    offsetX = e.clientX - e.target.offsetLeft;
    offsetY = e.clientY - e.target.offsetTop;

    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
}

function onDragMove(e) {
    const image = document.getElementById('image');
    image.style.left = `${e.clientX - offsetX}px`;
    image.style.top = `${e.clientY - offsetY}px`;
}

function onDragEnd() {
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
}

document.getElementById('crop-area').addEventListener('mousedown', function(e) {
    
    const cropArea = document.getElementById('crop-area');
    const rect = cropArea.getBoundingClientRect();
    const buffer = 10; 

    if (
        e.clientX >= rect.right - buffer &&
        e.clientY >= rect.bottom - buffer
    ) {
        isResizing = true;
    } else {
        cropOffsetX = e.clientX - e.target.offsetLeft;
        cropOffsetY = e.clientY - e.target.offsetTop;
    }

    document.addEventListener('mousemove', onCropAreaDrag);
    document.addEventListener('mouseup', onCropAreaDragEnd);
});

function onCropAreaDrag(e) {
    const cropArea = document.getElementById('crop-area');

    if (isResizing) {
        
        const newWidth = e.clientX - cropArea.offsetLeft;
        const newHeight = e.clientY - cropArea.offsetTop;

        
        const newSize = Math.max(newWidth, newHeight);
        cropArea.style.width = `${newSize}px`;
        cropArea.style.height = `${newSize}px`;
    } else {
        
        cropArea.style.left = `${e.clientX - cropOffsetX}px`;
        cropArea.style.top = `${e.clientY - cropOffsetY}px`;
    }
}

function onCropAreaDragEnd() {
    isResizing = false;
    document.removeEventListener('mousemove', onCropAreaDrag);
    document.removeEventListener('mouseup', onCropAreaDragEnd);
}

document.getElementById('crop').addEventListener('click', function() {
    const cropContainer = document.getElementById('crop-container');
    const cropArea = document.getElementById('crop-area');
    const image = document.getElementById('image');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const cropAreaRect = cropArea.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const cropContainerRect = cropContainer.getBoundingClientRect();

    
    const cropX = cropAreaRect.left - imageRect.left;
    const cropY = cropAreaRect.top - imageRect.top;
    const cropWidth = cropAreaRect.width;
    const cropHeight = cropAreaRect.height;

    
    const scaleX = image.naturalWidth / imageRect.width;
    const scaleY = image.naturalHeight / imageRect.height;

    
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    
    ctx.arc(cropWidth / 2, cropHeight / 2, cropWidth / 2, 0, 2 * Math.PI);
    ctx.clip();

    ctx.drawImage(
        image,
        cropX * scaleX,
        cropY * scaleY,
        cropWidth * scaleX,
        cropHeight * scaleY,
        0,
        0,
        cropWidth,
        cropHeight
    );

    const croppedImage = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = croppedImage;
    link.download = 'cropped-image.png';
    link.click();
});
