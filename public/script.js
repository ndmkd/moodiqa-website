let selectedImage = null;

document.getElementById('imageInput').addEventListener('change', function(e) {
    const files = e.target.files;
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'draggable grid-image';
                
                const emptySection = document.querySelector('.grid-section:empty');
                if (emptySection) {
                    img.style.position = 'absolute';
                    img.style.left = '50%';
                    img.style.top = '50%';
                    img.style.transform = 'translate(-50%, -50%)';
                    emptySection.appendChild(img);
                    
                    // Make image draggable
                    let isDragging = false;
                    let currentX;
                    let currentY;
                    let initialX;
                    let initialY;
                    let xOffset = 0;
                    let yOffset = 0;

                    img.addEventListener('mousedown', dragStart);
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', dragEnd);

                    function dragStart(e) {
                        initialX = e.clientX - xOffset;
                        initialY = e.clientY - yOffset;
                        if (e.target === img) {
                            isDragging = true;
                        }
                    }

                    function drag(e) {
                        if (isDragging) {
                            e.preventDefault();
                            currentX = e.clientX - initialX;
                            currentY = e.clientY - initialY;
                            xOffset = currentX;
                            yOffset = currentY;
                            img.style.transform = `translate(${currentX}px, ${currentY}px)`;
                        }
                    }

                    function dragEnd() {
                        isDragging = false;
                    }

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

// Update save functionality
document.getElementById('saveBoard').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    
    html2canvas(moodboard, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2,
        onclone: function(clonedDoc) {
            const clonedBoard = clonedDoc.getElementById('moodboard');
            clonedBoard.querySelectorAll('.grid-image').forEach(img => {
                const originalImg = moodboard.querySelector(`img[src="${img.src}"]`);
                const rect = originalImg.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(originalImg);
                img.style.transform = computedStyle.transform;
                img.style.width = rect.width + 'px';
                img.style.height = rect.height + 'px';
            });
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'moodboard.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
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