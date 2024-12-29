document.addEventListener('DOMContentLoaded', () => {
    const moodboard = document.getElementById('moodboard');
    const imageUpload = document.getElementById('imageUpload');

    imageUpload.addEventListener('change', handleImageUpload);

    let activeImage = null;
    let initialX, initialY;
    let isResizing = false;

    function handleImageUpload(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                createDraggableImage(event.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    function createDraggableImage(src) {
        const wrapper = document.createElement('div');
        wrapper.className = 'draggable-image';
        wrapper.style.left = '10px';
        wrapper.style.top = '10px';

        const img = document.createElement('img');
        img.src = src;

        const controls = document.createElement('div');
        controls.className = 'image-controls';

        const rotateBtn = document.createElement('button');
        rotateBtn.textContent = 'Rotate';
        rotateBtn.onclick = () => rotateImage(wrapper);

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle se';

        controls.appendChild(rotateBtn);
        wrapper.appendChild(img);
        wrapper.appendChild(controls);
        wrapper.appendChild(resizeHandle);
        moodboard.appendChild(wrapper);

        // Dragging functionality
        wrapper.addEventListener('mousedown', startDragging);
        resizeHandle.addEventListener('mousedown', startResizing);
    }

    function startDragging(e) {
        if (e.target.classList.contains('resize-handle')) return;
        
        activeImage = e.currentTarget;
        const rect = activeImage.getBoundingClientRect();
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    }

    function drag(e) {
        if (!activeImage || isResizing) return;

        const moodboardRect = moodboard.getBoundingClientRect();
        let newX = e.clientX - moodboardRect.left - initialX;
        let newY = e.clientY - moodboardRect.top - initialY;

        activeImage.style.left = `${newX}px`;
        activeImage.style.top = `${newY}px`;
    }

    function stopDragging() {
        activeImage = null;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDragging);
    }

    function startResizing(e) {
        isResizing = true;
        activeImage = e.target.parentElement;
        const initialWidth = activeImage.querySelector('img').offsetWidth;
        const startX = e.clientX;

        function resize(e) {
            const deltaX = e.clientX - startX;
            const newWidth = initialWidth + deltaX;
            activeImage.querySelector('img').style.width = `${newWidth}px`;
        }

        function stopResizing() {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
        }

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
    }

    function rotateImage(wrapper) {
        const currentRotation = wrapper.style.transform || 'rotate(0deg)';
        const currentDegrees = parseInt(currentRotation.match(/\d+/) || 0);
        const newRotation = (currentDegrees + 90) % 360;
        wrapper.style.transform = `rotate(${newRotation}deg)`;
    }
});

function changeBoardSize(size) {
    const moodboard = document.getElementById('moodboard');
    moodboard.className = ''; // Clear existing classes
    
    switch(size) {
        case 'square':
            moodboard.style.width = '600px';
            moodboard.style.height = '600px';
            break;
        case 'phone':
            moodboard.style.width = '300px';
            moodboard.style.height = '600px';
            break;
        case 'landscape':
            moodboard.style.width = '800px';
            moodboard.style.height = '400px';
            break;
    }
}

// Handle image uploads and drag-and-drop
function initializeMoodboard() {
    const moodboard = document.getElementById('moodboard');
    
    // Set position relative on moodboard for proper positioning of images
    moodboard.style.position = 'relative';

    // Handle file input changes
    document.querySelector('.choose-file').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        
        // Changed to use addEventListener instead of onchange
        input.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                handleFiles(files);
            }
        });
        
        input.click();
    });

    // Modify dragover to not change background color
    moodboard.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    moodboard.addEventListener('drop', handleDrop);
}

// Handle dropped files
function handleDrop(e) {
    e.preventDefault();
    const files = [...e.dataTransfer.files];
    handleFiles(files);
}

// Handle the actual file processing
function handleFiles(files) {
    [...files].filter(file => file.type.startsWith('image/')).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // Create container for the image and controls
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'absolute';
            imgContainer.style.left = '50%';
            imgContainer.style.top = '50%';
            imgContainer.style.transform = 'translate(-50%, -50%)';
            
            // Create and setup the image
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '200px';
            img.style.maxHeight = '200px';
            img.style.cursor = 'move';
            img.style.userSelect = 'none';
            img.style.transform = 'rotate(0deg)';
            
            // Create controls container
            const controls = document.createElement('div');
            controls.className = 'image-controls';
            controls.style.position = 'absolute';
            controls.style.top = '-30px';
            controls.style.left = '50%';
            controls.style.transform = 'translateX(-50%)';
            controls.style.display = 'none';
            controls.innerHTML = `
                <button class="rotate-left">↶</button>
                <button class="rotate-right">↷</button>
                <button class="resize-smaller">-</button>
                <button class="resize-larger">+</button>
                <button class="delete-img">×</button>
            `;

            // Add image and controls to container
            imgContainer.appendChild(img);
            imgContainer.appendChild(controls);
            
            // Add container to moodboard
            document.getElementById('moodboard').appendChild(imgContainer);
            
            // Show/hide controls on hover
            imgContainer.addEventListener('mouseenter', () => controls.style.display = 'block');
            imgContainer.addEventListener('mouseleave', () => controls.style.display = 'none');
            
            // Make the image draggable
            makeImageDraggable(img);
            
            // Add control functionality
            setupImageControls(img, controls, imgContainer);
        };
        
        reader.readAsDataURL(file);
    });
}

function setupImageControls(img, controls, container) {
    let currentRotation = 0;
    let currentScale = 1;
    
    // Rotation buttons
    controls.querySelector('.rotate-left').addEventListener('click', (e) => {
        e.stopPropagation();
        currentRotation -= 90;
        updateTransform();
    });
    
    controls.querySelector('.rotate-right').addEventListener('click', (e) => {
        e.stopPropagation();
        currentRotation += 90;
        updateTransform();
    });
    
    // Resize buttons
    controls.querySelector('.resize-smaller').addEventListener('click', (e) => {
        e.stopPropagation();
        currentScale = Math.max(0.2, currentScale - 0.1);
        updateTransform();
    });
    
    controls.querySelector('.resize-larger').addEventListener('click', (e) => {
        e.stopPropagation();
        currentScale = Math.min(3, currentScale + 0.1);
        updateTransform();
    });
    
    // Delete button
    controls.querySelector('.delete-img').addEventListener('click', (e) => {
        e.stopPropagation();
        container.remove();
    });
    
    function updateTransform() {
        img.style.transform = `rotate(${currentRotation}deg) scale(${currentScale})`;
    }
}

// Update makeImageDraggable to work with transformed images
function makeImageDraggable(img) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    img.parentElement.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target === img) {
            initialX = e.clientX - img.parentElement.offsetLeft;
            initialY = e.clientY - img.parentElement.offsetTop;
            isDragging = true;
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            img.parentElement.style.left = currentX + 'px';
            img.parentElement.style.top = currentY + 'px';
            img.parentElement.style.transform = 'none';
        }
    }
    
    function dragEnd() {
        isDragging = false;
    }
}

// Add some CSS for the controls
const style = document.createElement('style');
style.textContent = `
    .image-controls {
        background: rgba(0, 0, 0, 0.7);
        padding: 5px;
        border-radius: 15px;
        white-space: nowrap;
    }
    
    .image-controls button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 2px 5px;
        margin: 0 2px;
        font-size: 14px;
    }
    
    .image-controls button:hover {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }
`;
document.head.appendChild(style);

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeMoodboard();
});

// Add this function to handle saving the moodboard
function saveMoodboard() {
    // Hide controls temporarily if they're visible
    const controls = document.querySelectorAll('.image-controls');
    controls.forEach(control => control.style.display = 'none');

    // Use html2canvas to capture the moodboard
    html2canvas(document.getElementById('moodboard')).then(canvas => {
        // Convert the canvas to a data URL
        const dataURL = canvas.toDataURL('image/png');
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.download = 'moodiqa-board.png';
        link.href = dataURL;
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show controls again
        controls.forEach(control => control.style.display = '');
    });
} 