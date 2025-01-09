let selectedImage = null;

document.getElementById('imageInput').addEventListener('change', function(e) {
    const files = e.target.files;
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'grid-image';
                
                // Find the first empty grid section
                const emptySection = document.querySelector('.grid-section:empty');
                if (emptySection) {
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'image-container';
                    imageContainer.appendChild(img);
                    emptySection.appendChild(imageContainer);
                    
                    // Initialize image position at center
                    centerImageInContainer(img, imageContainer);
                    
                    // Add pan functionality
                    enableImagePanning(img, imageContainer);
                    
                    // Add click handler for image selection
                    img.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (selectedImage) {
                            selectedImage.classList.remove('selected');
                        }
                        selectedImage = img;
                        img.classList.add('selected');
                        showImageControls(img);
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }
});

function centerImageInContainer(img, container) {
    img.style.position = 'absolute';
    img.style.left = '50%';
    img.style.top = '50%';
    img.style.transform = 'translate(-50%, -50%)';
}

function enableImagePanning(img, container) {
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    let xOffset = 0, yOffset = 0;

    img.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target === img) {
            isDragging = true;
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Limit the panning to keep image visible
            const bounds = calculatePanningBounds(img, container);
            xOffset = Math.min(Math.max(currentX, bounds.minX), bounds.maxX);
            yOffset = Math.min(Math.max(currentY, bounds.minY), bounds.maxY);

            img.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }
    }

    function dragEnd() {
        isDragging = false;
    }
}

function calculatePanningBounds(img, container) {
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    return {
        minX: containerRect.width - imgRect.width,
        maxX: 0,
        minY: containerRect.height - imgRect.height,
        maxY: 0
    };
}

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

document.getElementById('fourGridFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.innerHTML = '';
    moodboard.className = 'four-grid-format';

    // Create four equal sections
    for (let i = 0; i < 4; i++) {
        const section = document.createElement('div');
        section.className = 'grid-section';
        moodboard.appendChild(section);
    }
});

document.getElementById('threeGridFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.innerHTML = ''; // Clear existing content
    moodboard.className = 'three-grid-format';

    // Create the three sections
    const leftSection = document.createElement('div');
    leftSection.className = 'grid-section left-section';
    
    const rightTop = document.createElement('div');
    rightTop.className = 'grid-section right-top';
    
    const rightBottom = document.createElement('div');
    rightBottom.className = 'grid-section right-bottom';

    moodboard.appendChild(leftSection);
    moodboard.appendChild(rightTop);
    moodboard.appendChild(rightBottom);
});

document.getElementById('twoGridFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.innerHTML = '';
    moodboard.className = 'two-grid-format';

    // Create two equal sections
    for (let i = 0; i < 2; i++) {
        const section = document.createElement('div');
        section.className = 'grid-section';
        moodboard.appendChild(section);
    }
});

function setupGridAreas(sections) {
    const moodboard = document.getElementById('moodboard');
    
    // Clear existing grid areas
    while (moodboard.firstChild) {
        if (!moodboard.firstChild.classList?.contains('draggable')) {
            moodboard.removeChild(moodboard.firstChild);
        }
    }

    // Create grid sections
    for (let i = 0; i < sections; i++) {
        const section = document.createElement('div');
        section.className = 'grid-section';
        section.dataset.sectionIndex = i;
        moodboard.appendChild(section);
    }

    // Update image drop behavior
    updateDropBehavior();
}

function updateDropBehavior() {
    const sections = document.querySelectorAll('.grid-section');
    
    sections.forEach(section => {
        section.addEventListener('dragover', (e) => {
            e.preventDefault();
            section.classList.add('drag-over');
        });

        section.addEventListener('dragleave', () => {
            section.classList.remove('drag-over');
        });

        section.addEventListener('drop', (e) => {
            e.preventDefault();
            section.classList.remove('drag-over');
            
            const img = document.querySelector('.dragging');
            if (img) {
                section.appendChild(img);
                img.style.position = 'relative';
                img.style.top = 'auto';
                img.style.left = 'auto';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
            }
        });
    });
}

// Save functionality
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveBoard');

    if (saveButton) {
        saveButton.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('Save button clicked');
            
            // Get the mood board element
            const moodboard = document.getElementById('moodboard');
            
            if (moodboard) {
                try {
                    // Use html2canvas to convert the mood board to a canvas
                    const canvas = await html2canvas(moodboard, {
                        backgroundColor: '#ffffff',
                        scale: 2, // Higher quality
                        useCORS: true // Allow cross-origin images
                    });
                    
                    // Convert to PNG and download
                    const dataURL = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = 'moodboard.png';
                    link.href = dataURL;
                    link.click();
                    
                    console.log('Download triggered');
                } catch (error) {
                    console.error('Error saving mood board:', error);
                    alert('Error saving mood board: ' + error.message);
                }
            } else {
                console.error('Mood board element not found');
                alert('Error: Could not find the mood board');
            }
        });
    }
});

function showImageControls(img) {
    const controls = document.getElementById('imageControls');
    const rect = img.getBoundingClientRect();
    const parentRect = img.parentElement.getBoundingClientRect();
    
    controls.style.display = 'flex';
    // Position controls relative to the grid section
    controls.style.top = `${parentRect.top + window.scrollY + 10}px`;
    controls.style.left = `${parentRect.left + 10}px`;

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
    let startTime = 0;
    let lastTap = 0;
    let touchOffset = { x: 0, y: 0 };

    // Touch events
    img.addEventListener('touchstart', handleTouchStart, { passive: false });
    img.addEventListener('touchmove', handleTouchMove, { passive: false });
    img.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse events remain the same for desktop
    img.addEventListener('mousedown', handleMouseDown);
    img.addEventListener('mousemove', handleMouseMove);
    img.addEventListener('mouseup', handleMouseUp);

    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = img.getBoundingClientRect();
        
        // Calculate offset between touch point and image position
        touchOffset.x = touch.clientX - rect.left;
        touchOffset.y = touch.clientY - rect.top;
        
        startTime = Date.now();
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            // Double tap detected
            selectImage(e);
            return;
        }
        lastTap = currentTime;

        isDragging = true;
        img.style.opacity = '0.8';
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const touch = e.touches[0];
        const moodboard = document.getElementById('moodboard');
        const moodboardRect = moodboard.getBoundingClientRect();
        
        // Calculate new position relative to the moodboard
        let newX = touch.clientX - moodboardRect.left - touchOffset.x;
        let newY = touch.clientY - moodboardRect.top - touchOffset.y;
        
        // Keep image within moodboard bounds
        const imgRect = img.getBoundingClientRect();
        const maxX = moodboardRect.width - imgRect.width;
        const maxY = moodboardRect.height - imgRect.height;
        
        newX = Math.min(Math.max(0, newX), maxX);
        newY = Math.min(Math.max(0, newY), maxY);

        // Update image position
        img.style.left = `${newX}px`;
        img.style.top = `${newY}px`;
    }

    function handleTouchEnd(e) {
        if (!isDragging) return;
        e.preventDefault();

        isDragging = false;
        img.style.opacity = '1';

        if (Date.now() - startTime < 300) {
            selectImage(e);
        }
    }

    function handleMouseDown(e) {
        const rect = img.getBoundingClientRect();
        touchOffset.x = e.clientX - rect.left;
        touchOffset.y = e.clientY - rect.top;
        isDragging = true;
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const moodboard = document.getElementById('moodboard');
        const moodboardRect = moodboard.getBoundingClientRect();
        
        let newX = e.clientX - moodboardRect.left - touchOffset.x;
        let newY = e.clientY - moodboardRect.top - touchOffset.y;
        
        const imgRect = img.getBoundingClientRect();
        const maxX = moodboardRect.width - imgRect.width;
        const maxY = moodboardRect.height - imgRect.height;
        
        newX = Math.min(Math.max(0, newX), maxX);
        newY = Math.min(Math.max(0, newY), maxY);

        img.style.left = `${newX}px`;
        img.style.top = `${newY}px`;
    }

    function handleMouseUp(e) {
        isDragging = false;
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded'); // Debug log

    const form = document.querySelector('form');
    const saveButton = document.getElementById('saveBoard'); // Updated selector to match ID

    console.log('Save button:', saveButton); // Debug log
    console.log('Form:', form); // Debug log

    if (saveButton) {
        console.log('Adding click listener to save button'); // Debug log
        
        saveButton.addEventListener('click', function(e) {
            console.log('Save button clicked'); // Debug log
            e.preventDefault();
            
            // Show success message
            alert('Mood board saved successfully!');
            
            // Optional: Clear form or reset state
            if (form) {
                form.reset();
            }
        });
    } else {
        console.log('Save button not found!'); // Debug log
    }
});