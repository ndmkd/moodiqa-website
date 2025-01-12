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
                    img.style.position = 'absolute';
                    img.style.width = '50%';
                    img.style.top = '50%';
                    img.style.left = '50%';
                    img.style.transform = 'translate(-50%, -50%)';
                    
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
    const rect = img.getBoundingClientRect();
    const parentRect = img.parentElement.getBoundingClientRect();
    
    controls.style.display = 'flex';
    controls.style.position = 'absolute';
    controls.style.top = `${parentRect.top + window.scrollY + 10}px`;
    controls.style.left = `${parentRect.left + 10}px`;
    controls.style.zIndex = '1000';
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

// Original format buttons
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

// Grid format buttons
document.getElementById('fourGridFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.innerHTML = '';
    moodboard.className = 'four-grid-format';
    
    // Create four sections
    for (let i = 0; i < 4; i++) {
        const section = document.createElement('div');
        section.className = 'grid-section';
        moodboard.appendChild(section);
    }
});

document.getElementById('threeGridFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.innerHTML = '';
    moodboard.className = 'three-grid-format';
    
    // Create left section
    const leftSection = document.createElement('div');
    leftSection.className = 'grid-section left-section';
    moodboard.appendChild(leftSection);
    
    // Create right sections
    const rightTop = document.createElement('div');
    rightTop.className = 'grid-section right-top';
    const rightBottom = document.createElement('div');
    rightBottom.className = 'grid-section right-bottom';
    moodboard.appendChild(rightTop);
    moodboard.appendChild(rightBottom);
});

document.getElementById('twoGridFormat').addEventListener('click', function() {
    const moodboard = document.getElementById('moodboard');
    moodboard.innerHTML = '';
    moodboard.className = 'two-grid-format';
    
    // Create two sections
    for (let i = 0; i < 2; i++) {
        const section = document.createElement('div');
        section.className = 'grid-section';
        moodboard.appendChild(section);
    }
});