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
            controls.style.display = 'none'; // Hide by default
            
            // Rotate buttons
            const rotateLeft = document.createElement('button');
            rotateLeft.innerHTML = '↺';
            let rotation = 0;
            rotateLeft.onmousedown = startRotation(-1); // Counter-clockwise
            rotateLeft.onmouseup = stopRotation;
            rotateLeft.onmouseleave = stopRotation;
            
            const rotateRight = document.createElement('button');
            rotateRight.innerHTML = '↻';
            rotateRight.onmousedown = startRotation(1); // Clockwise
            rotateRight.onmouseup = stopRotation;
            rotateRight.onmouseleave = stopRotation;
            
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
            
            controls.appendChild(rotateLeft);
            controls.appendChild(rotateRight);
            controls.appendChild(sizeDown);
            controls.appendChild(sizeUp);
            controls.appendChild(deleteBtn);
            
            const moodboard = document.getElementById('moodboard');
            moodboard.appendChild(img);
            moodboard.appendChild(controls);
            
            makeImageDraggable(img, controls);

            // Show controls when image is clicked
            img.addEventListener('mousedown', () => {
                controls.style.display = 'flex';
                updateControlsPosition(img, controls);
            });

            // Hide controls when clicking outside
            document.addEventListener('mousedown', (e) => {
                if (e.target !== img && !controls.contains(e.target)) {
                    controls.style.display = 'none';
                }
            });
        };
        reader.readAsDataURL(file);
    }
});

let rotationInterval = null;

function startRotation(direction) {
    return function(e) {
        e.preventDefault();
        const img = this.parentElement.previousSibling;
        
        // For mobile touch events
        if (e.type === 'touchstart') {
            if (rotationInterval) clearInterval(rotationInterval);
            rotationInterval = setInterval(() => {
                const currentRotation = getCurrentRotation(img);
                img.style.transform = `rotate(${currentRotation + (direction * 2)}deg)`;
            }, 20);
        }
        // For desktop mouse events
        else {
            if (rotationInterval) clearInterval(rotationInterval);
            rotationInterval = setInterval(() => {
                const currentRotation = getCurrentRotation(img);
                img.style.transform = `rotate(${currentRotation + (direction * 2)}deg)`;
            }, 20);
        }
    };
}

function stopRotation() {
    if (rotationInterval) {
        clearInterval(rotationInterval);
        rotationInterval = null;
    }
}

function getCurrentRotation(element) {
    const transform = element.style.transform;
    let rotation = 0;
    if (transform) {
        const matches = transform.match(/rotate\(([-\d.]+)deg\)/);
        if (matches) {
            rotation = parseFloat(matches[1]);
        }
    }
    return rotation;
}

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

    // Update controls position whenever the image is clicked
    img.addEventListener('mousedown', () => updateControlsPosition(img, controls));
    img.addEventListener('touchstart', () => updateControlsPosition(img, controls));

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
            
            // Update controls position while dragging
            updateControlsPosition(img, controls);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        // Update controls position after drag ends
        updateControlsPosition(img, controls);
    }
}

// Helper functions for image manipulation
function rotateImage(img, degrees) {
    const currentRotation = img.style.transform.match(/rotate\(([^)]+)\)/) || ['', '0deg'];
    const currentDegrees = parseInt(currentRotation[1]) || 0;
    const newRotation = currentDegrees + degrees;
    img.style.transform = `rotate(${newRotation}deg)`;
    
    // Find and update controls position after rotation
    const controls = img.parentElement.querySelector('.image-controls');
    if (controls) {
        updateControlsPosition(img, controls);
    }
}

function resizeImage(img, factor) {
    const currentWidth = img.offsetWidth;
    const currentHeight = img.offsetHeight;
    img.style.width = (currentWidth * factor) + 'px';
    img.style.height = (currentHeight * factor) + 'px';
    
    // Find and update controls position after resize
    const controls = img.parentElement.querySelector('.image-controls');
    if (controls) {
        updateControlsPosition(img, controls);
    }
}

function deleteImage(img, controls) {
    img.remove();
    controls.remove();
}

function updateControlsPosition(img, controls) {
    const moodboard = document.getElementById('moodboard');
    const moodboardRect = moodboard.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    // Calculate position relative to the moodboard
    const top = imgRect.top - moodboardRect.top - 40; // 40px above the image
    const left = imgRect.left - moodboardRect.left;
    
    controls.style.position = 'absolute';
    controls.style.top = `${top}px`;
    controls.style.left = `${left}px`;
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
    const moodboard = document.getElementById('moodboard');
    
    // Hide all control buttons before capturing
    const controls = document.querySelectorAll('.image-controls');
    controls.forEach(control => control.style.display = 'none');

    // Use html2canvas with proper settings
    html2canvas(moodboard, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null,
        scale: 2, // Higher quality
    }).then(function(canvas) {
        // Create download link
        const link = document.createElement('a');
        link.download = 'moodboard.png';
        link.href = canvas.toDataURL('image/png');
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show controls again
        controls.forEach(control => control.style.display = 'flex');
    }).catch(function(error) {
        console.error('Error saving moodboard:', error);
        alert('There was an error saving your moodboard. Please try again.');
    });
}

// Add touch event listeners for rotation buttons
const addRotationControls = (button, img) => {
    button.addEventListener('touchstart', startRotation(button.classList.contains('rotate-right') ? 1 : -1));
    button.addEventListener('touchend', stopRotation);
    button.addEventListener('touchcancel', stopRotation);
};