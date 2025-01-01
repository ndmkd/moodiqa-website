document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('imageInput');
    const moodboard = document.getElementById('moodboard');
    
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        for (let file of files) {
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'moodboard-image';
                    img.draggable = true;
                    moodboard.appendChild(img);
                    
                    // Add drag functionality
                    img.addEventListener('mousedown', startDragging);
                };
                reader.readAsDataURL(file);
            }
        }
    });
});

function startDragging(e) {
    const img = e.target;
    let isDragging = true;
    
    // Calculate offset
    const offsetX = e.clientX - img.offsetLeft;
    const offsetY = e.clientY - img.offsetTop;
    
    // Move function
    function moveImage(e) {
        if (isDragging) {
            img.style.left = (e.clientX - offsetX) + 'px';
            img.style.top = (e.clientY - offsetY) + 'px';
            img.style.position = 'absolute';
        }
    }
    
    // Stop dragging
    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', moveImage);
        document.removeEventListener('mouseup', stopDragging);
    }
    
    document.addEventListener('mousemove', moveImage);
    document.addEventListener('mouseup', stopDragging);
}