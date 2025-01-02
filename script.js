let selectedImage = null;

document.getElementById('imageInput').addEventListener('change', function(e) {
    const files = e.target.files;
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'draggable';
                img.style.maxWidth = '150px';
                img.style.maxHeight = '150px';
                img.style.position = 'absolute';
                img.style.transform = 'rotate(0deg)';
                img.style.cursor = 'move';
                document.getElementById('moodboard').appendChild(img);
                makeImageDraggable(img);
            };
            reader.readAsDataURL(file);
        }
    }
});

function makeImageDraggable(img) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let rotation = 0;
    let scale = 1;

    img.addEventListener('mousedown', dragMouseDown);
    img.addEventListener('click', selectImage);

    function selectImage(e) {
        e.stopPropagation();
        if (selectedImage) {
            selectedImage.style.outline = 'none';
        }
        selectedImage = img;
        img.style.outline = '2px solid #6B4DE6';
        showImageControls(img);
    }

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        img.style.top = (img.offsetTop - pos2) + "px";
        img.style.left = (img.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Click outside to deselect
document.getElementById('moodboard').addEventListener('click', function(e) {
    if (e.target === this) {
        if (selectedImage) {
            selectedImage.style.outline = 'none';
            selectedImage = null;
            document.getElementById('imageControls').style.display = 'none';
        }
    }
});

// Keyboard controls
document.addEventListener('keydown', function(e) {
    if (!selectedImage) return;

    let currentRotation = parseInt(selectedImage.style.transform.replace('rotate(', '')) || 0;
    let currentScale = parseFloat(selectedImage.style.scale) || 1;

    switch(e.key) {
        case '[':
            currentRotation -= 5;
            selectedImage.style.transform = `rotate(${currentRotation}deg)`;
            break;
        case ']':
            currentRotation += 5;
            selectedImage.style.transform = `rotate(${currentRotation}deg)`;
            break;
        case 'ArrowUp':
            if (e.ctrlKey) {
                e.preventDefault();
                currentScale += 0.1;
                selectedImage.style.scale = currentScale;
            }
            break;
        case 'ArrowDown':
            if (e.ctrlKey) {
                e.preventDefault();
                currentScale = Math.max(0.1, currentScale - 0.1);
                selectedImage.style.scale = currentScale;
            }
            break;
        case 'Delete':
        case 'Backspace':
            selectedImage.remove();
            selectedImage = null;
            break;
    }
});

// Format buttons
document.getElementById('squareFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.className = 'square-format';
});

document.getElementById('phoneFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.className = 'phone-format';
});

document.getElementById('landscapeFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.className = 'landscape-format';
});

// Save functionality
document.getElementById('saveBoard').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    html2canvas(moodboard, {
        backgroundColor: '#ffffff',
        useCORS: true,
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'moodiqa-moodboard.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

function showImageControls(img) {
    const controls = document.getElementById('imageControls');
    controls.style.display = 'flex';
    
    const imgRect = img.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Position controls at the bottom of the screen for mobile
        controls.style.position = 'fixed';
        controls.style.bottom = '20px';
        controls.style.left = '50%';
        controls.style.transform = 'translateX(-50%)';
        controls.style.top = 'auto';
    } else {
        // Desktop positioning
        controls.style.top = (imgRect.top - 50) + 'px';
        controls.style.left = imgRect.left + 'px';
        controls.style.transform = 'none';
    }

    // Scale controls
    document.getElementById('scaleUp').onclick = () => {
        let scale = parseFloat(img.style.scale || 1);
        img.style.scale = scale + 0.1;
    };

    document.getElementById('scaleDown').onclick = () => {
        let scale = parseFloat(img.style.scale || 1);
        img.style.scale = Math.max(0.1, scale - 0.1);
    };

    // Rotation controls
    document.getElementById('rotateLeft').onclick = () => {
        let rotation = parseInt(img.style.transform.replace('rotate(', '')) || 0;
        img.style.transform = `rotate(${rotation - 15}deg)`;
    };

    document.getElementById('rotateRight').onclick = () => {
        let rotation = parseInt(img.style.transform.replace('rotate(', '')) || 0;
        img.style.transform = `rotate(${rotation + 15}deg)`;
    };

    // Delete control
    document.getElementById('deleteBtn').onclick = () => {
        img.remove();
        controls.style.display = 'none';
        selectedImage = null;
    };
}

function makeImageInteractive(img) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Touch events
    img.addEventListener('touchstart', dragStart, { passive: false });
    img.addEventListener('touchend', dragEnd, { passive: false });
    img.addEventListener('touchmove', drag, { passive: false });

    // Mouse events
    img.addEventListener('mousedown', dragStart);
    img.addEventListener('mouseup', dragEnd);
    img.addEventListener('mousemove', drag);

    // Handle image selection
    img.addEventListener('click', selectImage);
    img.addEventListener('touchend', selectImage);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
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

            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, img);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    function selectImage(e) {
        e.preventDefault();
        if (selectedImage === img) {
            selectedImage = null;
            img.style.outline = 'none';
            document.getElementById('imageControls').style.display = 'none';
        } else {
            if (selectedImage) {
                selectedImage.style.outline = 'none';
            }
            selectedImage = img;
            img.style.outline = '2px solid #6B4DE6';
            showImageControls(img);
        }
    }
}

// Add touch-friendly styles for the controls
document.addEventListener('DOMContentLoaded', function() {
    const controls = document.getElementById('imageControls');
    
    if ('ontouchstart' in window) {
        controls.style.padding = '12px';
        const buttons = controls.getElementsByClassName('control-btn');
        for (let btn of buttons) {
            btn.style.width = '40px';
            btn.style.height = '40px';
        }
    }
});