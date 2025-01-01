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
    moodboard.style.width = '600px';
    moodboard.style.height = '600px';
});

document.getElementById('phoneFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.style.width = '400px';
    moodboard.style.height = '700px';
});

document.getElementById('landscapeFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.style.width = '800px';
    moodboard.style.height = '500px';
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
    
    // Position controls near the selected image
    const imgRect = img.getBoundingClientRect();
    controls.style.top = (imgRect.top - 50) + 'px';
    controls.style.left = imgRect.left + 'px';

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