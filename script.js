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
            document.getElementById('moodboard').appendChild(img);
            makeImageDraggable(img);
        };
        reader.readAsDataURL(file);
    }
});

// Make images draggable
function makeImageDraggable(img) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    img.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - img.offsetLeft;
        initialY = e.clientY - img.offsetTop;

        if (e.target === img) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            img.style.left = currentX + "px";
            img.style.top = currentY + "px";
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
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
    html2canvas(document.getElementById('moodboard')).then(function(canvas) {
        const link = document.createElement('a');
        link.download = 'moodboard.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}