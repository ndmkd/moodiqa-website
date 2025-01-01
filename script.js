document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('imageInput');
    const moodboard = document.getElementById('moodboard');
    const squareBtn = document.querySelector('button:nth-child(1)');
    const phoneBtn = document.querySelector('button:nth-child(2)');
    const landscapeBtn = document.querySelector('button:nth-child(3)');
    const saveBtn = document.querySelector('button:nth-child(4)');

    // Moodboard format handlers
    squareBtn.addEventListener('click', () => {
        moodboard.style.width = '600px';
        moodboard.style.height = '600px';
        moodboard.style.margin = '20px auto';
    });

    phoneBtn.addEventListener('click', () => {
        moodboard.style.width = '400px';
        moodboard.style.height = '700px';
        moodboard.style.margin = '20px auto';
    });

    landscapeBtn.addEventListener('click', () => {
        moodboard.style.width = '800px';
        moodboard.style.height = '500px';
        moodboard.style.margin = '20px auto';
    });

    // Save functionality
    saveBtn.addEventListener('click', () => {
        html2canvas(moodboard).then(canvas => {
            const link = document.createElement('a');
            link.download = 'moodboard.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    // Image upload handler
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.className = 'moodboard-image';
                    img.style.position = 'absolute';
                    img.style.maxWidth = '300px';
                    img.style.cursor = 'move';
                    
                    // Random initial position within moodboard
                    const x = Math.random() * (moodboard.offsetWidth - 100);
                    const y = Math.random() * (moodboard.offsetHeight - 100);
                    img.style.left = x + 'px';
                    img.style.top = y + 'px';
                    
                    moodboard.appendChild(img);
                    makeImageDraggable(img);
                };
                reader.readAsDataURL(file);
            }
        });
    });
});

function makeImageDraggable(img) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    img.addEventListener('mousedown', dragStart);
    img.addEventListener('mousemove', drag);
    img.addEventListener('mouseup', dragEnd);

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

            setTranslate(currentX, currentY, img);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
}