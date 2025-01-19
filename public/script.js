let selectedImage = null;
let currentRotation = 0;

document.getElementById('imageInput').addEventListener('change', function(e) {
    const files = e.target.files;
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'draggable';
                
                const moodboard = document.getElementById('moodboard');
                const moodboardRect = moodboard.getBoundingClientRect();
                
                // Set initial image properties
                img.style.position = 'absolute';
                img.style.maxWidth = '80%';
                img.style.maxHeight = '80%';
                img.style.width = 'auto';
                img.style.height = 'auto';
                
                // Ensure image is placed within moodboard
                img.style.top = '50%';
                img.style.left = '50%';
                img.style.transform = 'translate(-50%, -50%)';
                
                // Add image to moodboard
                moodboard.appendChild(img);
                makeDraggable(img);
            };
            reader.readAsDataURL(file);
        }
    }
});

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        element.style.zIndex = '1000';
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Get moodboard boundaries
        const moodboard = document.getElementById('moodboard');
        const moodboardRect = moodboard.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Calculate new position
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        // Keep image within moodboard boundaries
        newTop = Math.max(0, Math.min(newTop, moodboardRect.height - elementRect.height));
        newLeft = Math.max(0, Math.min(newLeft, moodboardRect.width - elementRect.width));

        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        element.style.zIndex = 'auto';
    }
}

// Image Controls
document.getElementById('scaleUp').addEventListener('click', function() {
    if (selectedImage) {
        const currentWidth = selectedImage.offsetWidth;
        const currentHeight = selectedImage.offsetHeight;
        selectedImage.style.width = (currentWidth * 1.1) + 'px';
        selectedImage.style.height = (currentHeight * 1.1) + 'px';
    }
});

document.getElementById('scaleDown').addEventListener('click', function() {
    if (selectedImage) {
        const currentWidth = selectedImage.offsetWidth;
        const currentHeight = selectedImage.offsetHeight;
        selectedImage.style.width = (currentWidth * 0.9) + 'px';
        selectedImage.style.height = (currentHeight * 0.9) + 'px';
    }
});

document.getElementById('rotateLeft').addEventListener('click', function() {
    if (selectedImage) {
        currentRotation = (currentRotation - 90) % 360;
        selectedImage.style.transform = `rotate(${currentRotation}deg)`;
    }
});

document.getElementById('rotateRight').addEventListener('click', function() {
    if (selectedImage) {
        currentRotation = (currentRotation + 90) % 360;
        selectedImage.style.transform = `rotate(${currentRotation}deg)`;
    }
});

document.getElementById('deleteBtn').addEventListener('click', function() {
    if (selectedImage) {
        selectedImage.remove();
        selectedImage = null;
        document.getElementById('imageControls').style.display = 'none';
    }
});

function showImageControls(img) {
    const controls = document.getElementById('imageControls');
    const rect = img.getBoundingClientRect();
    controls.style.display = 'flex';
    controls.style.top = `${rect.top + window.scrollY - 40}px`;
    controls.style.left = `${rect.left}px`;
}

// Save functionality
document.getElementById('saveBoard').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    
    // Create a clone for saving
    const clone = moodboard.cloneNode(true);
    document.body.appendChild(clone);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    
    // Preserve image positions and sizes in the clone
    clone.querySelectorAll('.draggable').forEach(img => {
        const originalImg = moodboard.querySelector(`img[src="${img.src}"]`);
        const computedStyle = window.getComputedStyle(originalImg);
        
        img.style.width = computedStyle.width;
        img.style.height = computedStyle.height;
        img.style.transform = computedStyle.transform;
        img.style.top = computedStyle.top;
        img.style.left = computedStyle.left;
    });

    html2canvas(clone, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
        width: moodboard.offsetWidth,
        height: moodboard.offsetHeight
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'moodboard.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        document.body.removeChild(clone);
    });
});

// Format button handlers
document.getElementById('squareFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.innerHTML = '';
    moodboard.className = 'square-format';
    
    // Create single full-size section
    const section = document.createElement('div');
    section.className = 'grid-section full-section';
    section.style.width = '100%';
    section.style.height = '100%';
    section.style.border = 'none';
    moodboard.appendChild(section);
});

document.getElementById('phoneFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.innerHTML = '';
    moodboard.className = 'phone-format';
    
    const section = document.createElement('div');
    section.className = 'grid-section full-section';
    section.style.width = '100%';
    section.style.height = '100%';
    section.style.border = 'none';
    moodboard.appendChild(section);
});

document.getElementById('landscapeFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.innerHTML = '';
    moodboard.className = 'landscape-format';
    
    const section = document.createElement('div');
    section.className = 'grid-section full-section';
    section.style.width = '100%';
    section.style.height = '100%';
    section.style.border = 'none';
    moodboard.appendChild(section);
});
// Add click handler to hide controls when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('draggable') && 
        !e.target.classList.contains('control-btn')) {
        if (selectedImage) {
            selectedImage.classList.remove('selected');
            selectedImage = null;
        }
        document.getElementById('imageControls').style.display = 'none';
    }
});
