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
                
                const emptySection = document.querySelector('.grid-section:empty');
                if (emptySection) {
                    emptySection.appendChild(img);
                    makeDraggable(img);
                    
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

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

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
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
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

let rotation = 0;
document.getElementById('rotateLeft').addEventListener('click', function() {
    if (selectedImage) {
        rotation -= 90;
        selectedImage.style.transform = `rotate(${rotation}deg)`;
    }
});

document.getElementById('rotateRight').addEventListener('click', function() {
    if (selectedImage) {
        rotation += 90;
        selectedImage.style.transform = `rotate(${rotation}deg)`;
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
    controls.style.display = 'flex';
}

// Save functionality
document.getElementById('saveBoard').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    html2canvas(moodboard, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'moodboard.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});