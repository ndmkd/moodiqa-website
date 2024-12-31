// File Upload
document.querySelector('input[type="file"]').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'uploaded-image';
            img.style.position = 'absolute';
            img.style.left = '50%';
            img.style.top = '50%';
            img.style.transform = 'translate(-50%, -50%)';
            
            // Create image controls
            const controls = document.createElement('div');
            controls.className = 'image-controls';
            
            // Rotate buttons
            const rotateLeft = document.createElement('button');
            rotateLeft.innerHTML = '↺';
            rotateLeft.onclick = () => rotateImage(img, -90);
            
            const rotateRight = document.createElement('button');
            rotateRight.innerHTML = '↻';
            rotateRight.onclick = () => rotateImage(img, 90);
            
            // Size buttons
            const sizeDown = document.createElement('button');
            sizeDown.innerHTML = '−';
            sizeDown.onclick = () => resizeImage(img, 0.9);
            
            const sizeUp = document.createElement('button');
            sizeUp.innerHTML = '+';
            sizeUp.onclick = () => resizeImage(img, 1.1);
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = () => deleteImage(img, controls);
            
            // Add buttons to controls
            controls.appendChild(rotateLeft);
            controls.appendChild(rotateRight);
            controls.appendChild(sizeDown);
            controls.appendChild(sizeUp);
            controls.appendChild(deleteBtn);
            
            // Add image and controls to moodboard
            const moodboard = document.getElementById('moodboard');
            moodboard.appendChild(img);
            moodboard.appendChild(controls);
            
            makeImageDraggable(img, controls);
        };
        reader.readAsDataURL(file);
    }
});

// Make images draggable
function makeImageDraggable(img, controls) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    img.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Add touch events for mobile
    img.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - img.offsetLeft;
            initialY = e.touches[0].clientY - img.offsetTop;
        } else {
            initialX = e.clientX - img.offsetLeft;
            initialY = e.clientY - img.offsetTop;
        }

        if (e.target === img) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            img.style.left = currentX + "px";
            img.style.top = currentY + "px";
            
            // Update controls position
            updateControlsPosition(img, controls);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
}

// Helper functions for image manipulation
function rotateImage(img, degrees) {
    const currentRotation = img.style.transform.match(/rotate\(([^)]+)\)/) || ['', '0deg'];
    const currentDegrees = parseInt(currentRotation[1]) || 0;
    const newRotation = currentDegrees + degrees;
    img.style.transform = `rotate(${newRotation}deg)`;
}

function resizeImage(img, factor) {
    const currentWidth = img.offsetWidth;
    const currentHeight = img.offsetHeight;
    img.style.width = (currentWidth * factor) + 'px';
    img.style.height = (currentHeight * factor) + 'px';
}

function deleteImage(img, controls) {
    img.remove();
    controls.remove();
}

function updateControlsPosition(img, controls) {
    const rect = img.getBoundingClientRect();
    controls.style.left = rect.left + 'px';
    controls.style.top = (rect.top - 40) + 'px';
}

// Board size changes
function changeBoardSize(size) {
    const moodboard = document.getElementById('moodboard');
    switch(size) {
        case 'square':
            moodboard.style.width = '600px';
            moodboard.style.height = '600px';
            break;
        case 'phone':
            moodboard.style.width = '400px';
            moodboard.style.height = '600px';
            break;
        case 'landscape':
            moodboard.style.width = '800px';
            moodboard.style.height = '600px';
            break;
    }
}

// Save functionality
function saveMoodboard() {
    html2canvas(document.getElementById('moodboard')).then(function(canvas) {
        const link = document.createElement('a');
        link.download = 'moodboard.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}