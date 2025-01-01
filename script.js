document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const moodboard = document.getElementById('moodboard');
    const imageInput = document.getElementById('imageInput');
    const squareBtn = document.getElementById('squareFormat');
    const phoneBtn = document.getElementById('phoneFormat');
    const landscapeBtn = document.getElementById('landscapeFormat');
    const adjustBtn = document.getElementById('adjustFormat');
    const saveBtn = document.getElementById('saveBoard');

    // Moodboard format buttons
    squareBtn.addEventListener('click', () => {
        moodboard.style.width = '600px';
        moodboard.style.height = '600px';
    });

    phoneBtn.addEventListener('click', () => {
        moodboard.style.width = '400px';
        moodboard.style.height = '700px';
    });

    landscapeBtn.addEventListener('click', () => {
        moodboard.style.width = '800px';
        moodboard.style.height = '500px';
    });

    // Image upload handling
    imageInput.addEventListener('change', function(e) {
        const files = e.target.files;
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'moodboard-image';
                    
                    // Set initial size and position
                    img.style.maxWidth = '300px';
                    img.style.position = 'absolute';
                    
                    // Center the image in the moodboard
                    const x = (moodboard.offsetWidth - 300) / 2;
                    const y = (moodboard.offsetHeight - 300) / 2;
                    img.style.left = x + 'px';
                    img.style.top = y + 'px';
                    
                    moodboard.appendChild(img);
                    makeImageDraggable(img);
                };
                reader.readAsDataURL(file);
            }
        });
        // Clear input
        imageInput.value = '';
    });

    // Adjust/Edit functionality
    adjustBtn.addEventListener('click', () => {
        const images = document.querySelectorAll('.moodboard-image');
        images.forEach(img => {
            img.classList.toggle('editable');
        });
    });

    // Save functionality
    saveBtn.addEventListener('click', () => {
        // Remove editable class before saving
        const images = document.querySelectorAll('.moodboard-image');
        images.forEach(img => img.classList.remove('editable'));
        
        html2canvas(moodboard).then(canvas => {
            const link = document.createElement('a');
            link.download = 'moodboard.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});

// Make images draggable and resizable
function makeImageDraggable(img) {
    let isDragging = false;
    let startX, startY;
    let currentRotation = 0;
    let currentScale = 1;

    // Create control buttons - added counter-clockwise rotation button
    const controls = document.createElement('div');
    controls.className = 'image-controls';
    controls.innerHTML = `
        <button class="control-btn increase">+</button>
        <button class="control-btn decrease">-</button>
        <button class="control-btn rotate-left">↺</button>
        <button class="control-btn rotate-right">↻</button>
    `;
    img.parentElement.appendChild(controls);

    // Update controls position
    function updateControlsPosition() {
        const rect = img.getBoundingClientRect();
        const parentRect = img.parentElement.getBoundingClientRect();
        controls.style.left = (rect.right - parentRect.left + 10) + 'px';
        controls.style.top = (rect.top - parentRect.top) + 'px';
    }

    // Drag functionality
    img.addEventListener('mousedown', function(e) {
        if (e.target === img) {
            isDragging = true;
            startX = e.clientX - img.offsetLeft;
            startY = e.clientY - img.offsetTop;
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            img.style.left = (e.clientX - startX) + 'px';
            img.style.top = (e.clientY - startY) + 'px';
            updateControlsPosition();
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Size increase/decrease
    controls.querySelector('.increase').addEventListener('click', function(e) {
        e.stopPropagation();
        currentScale += 0.1;
        updateImageTransform();
    });

    controls.querySelector('.decrease').addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentScale > 0.2) {
            currentScale -= 0.1;
            updateImageTransform();
        }
    });

    // Clockwise rotation
    controls.querySelector('.rotate-right').addEventListener('click', function(e) {
        e.stopPropagation();
        currentRotation += 15;
        updateImageTransform();
    });

    // Counter-clockwise rotation
    controls.querySelector('.rotate-left').addEventListener('click', function(e) {
        e.stopPropagation();
        currentRotation -= 15;
        updateImageTransform();
    });

    // Update image transform
    function updateImageTransform() {
        img.style.transform = `rotate(${currentRotation}deg) scale(${currentScale})`;
        updateControlsPosition();
    }

    // Show/hide controls when image is clicked
    img.addEventListener('click', function() {
        const images = document.querySelectorAll('.moodboard-image');
        const allControls = document.querySelectorAll('.image-controls');
        
        images.forEach(image => {
            image.classList.remove('editable');
        });
        allControls.forEach(control => {
            control.style.display = 'none';
        });
        
        img.classList.add('editable');
        controls.style.display = 'flex';
        updateControlsPosition();
    });

    // Hide controls when clicking outside
    document.addEventListener('click', function(e) {
        if (!img.contains(e.target) && !controls.contains(e.target)) {
            img.classList.remove('editable');
            controls.style.display = 'none';
        }
    });
}